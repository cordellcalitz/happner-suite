const commons = require('happn-commons'),
  async = commons.async;
module.exports = Security;

function Security() {
  this.__initialized = false;
  this.__adminUser = null;
  this.__systemGroups = {};
  this.__attachToSecurityChangesActivated = false;
  this.__attachToSessionChangesActivated = false;
}

Security.prototype.__createSystemGroup = function (name, adminUser, permissions, callback) {
  this.__securityService.groups.upsertGroup(
    {
      name,
      permissions,
    },
    (e, upsertedGroup) => {
      if (e) return callback(e);
      this.__systemGroups[name] = upsertedGroup;
      if (name !== '_MESH_ADM') return callback();
      this.__securityService.users.linkGroup(upsertedGroup, adminUser, callback);
    }
  );
};

Security.prototype.__createSystemGroups = function (adminUser, callback) {
  async.eachSeries(
    ['_MESH_ADM', '_MESH_GST', '_MESH_DELEGATE'],
    (groupName, eachCallback) => {
      let permissions;

      if (groupName === '_MESH_ADM') {
        permissions = {
          '/mesh/*': {
            actions: ['*'],
            description: 'mesh system permission',
          },
          '/_exchange/*': {
            actions: ['*'],
            description: 'mesh system permission',
          },
          '/_events/*': {
            actions: ['*'],
            description: 'mesh system permission',
          },
        };
      }
      if (groupName === '_MESH_GST') {
        permissions = {
          '/mesh/schema/*': {
            actions: ['get', 'on'],
            description: 'mesh system guest permission',
          },
          '/_exchange/requests/{{happn.name}}/security/updateOwnUser': {
            actions: ['set'],
            description: 'mesh system permission',
          },
          '/_exchange/responses/*/security/updateOwnUser/{{id}}/*': {
            actions: ['on'],
            description: 'mesh system request permission',
          },
          '/_exchange/requests/{{happn.name}}/security/changePassword': {
            actions: ['set'],
            description: 'mesh system permission',
          },
          '/_exchange/responses/*/security/changePassword/{{id}}/*': {
            actions: ['on'],
            description: 'mesh system request permission',
          },
          '/_exchange/requests/{{happn.name}}/security/resetPassword': {
            actions: ['set'],
            description: 'mesh system permission',
          },
          '/_exchange/responses/*/security/resetPassword/{{id}}/*': {
            actions: ['on'],
            description: 'mesh system request permission',
          },
        };
      }
      if (groupName === '_MESH_DELEGATE') {
        permissions = {
          '/mesh/*': {
            actions: ['*'],
            description: 'mesh system permission',
          },
          '/_exchange/*': {
            actions: ['*'],
            description: 'mesh system permission',
          },
          '/_events/*': {
            actions: ['*'],
            description: 'mesh system permission',
          },
        };
      }
      this.__createSystemGroup(groupName, adminUser, permissions, eachCallback);
    },
    callback
  );
};

Security.prototype.__createUsersAndGroups = function (callback) {
  this.__securityService.users.getUser('_ADMIN', {}, (e, userFound) => {
    if (e) return callback(e);
    if (!userFound)
      return callback(
        new Error('admin user not found, happn may have been incorrectly configured')
      );
    this.__adminUser = userFound;
    this.__createSystemGroups(this.__adminUser, callback);
  });
};

Security.prototype.initialize = function ($happn, callback) {
  try {
    if (!$happn._mesh.config.happn.secure) {
      if (typeof $happn._mesh.config.happn.secure !== 'boolean') {
        // no warning if explicitly set to false
        $happn.log.warn('data layer is not set to secure in config');
      }
      return callback();
    }

    this.__securityService = $happn._mesh.happn.server.services.security;
    this.__sessionService = $happn._mesh.happn.server.services.session;
    this.__createUsersAndGroups((e) => {
      if (e) return callback(e);
      this.__initialized = true;
      if (!this.__securityService.config.allowAnonymousAccess) return callback();
      this.__happnLinkAnonymousGroup = require('util')
        .callbackify(this.__securityService.linkAnonymousGroup)
        .bind(this.__securityService);
      this.__happnUnlinkAnonymousGroup = require('util')
        .callbackify(this.__securityService.unlinkAnonymousGroup)
        .bind(this.__securityService);
      this.linkAnonymousGroup($happn, '_MESH_GST', callback);
    });
  } catch (e) {
    callback(e);
  }
};

Security.prototype.attachToSecurityChanges = function ($happn, callback) {
  try {
    if (!this.__attachToSecurityChangesActivated) {
      this.__securityService.onDataChanged(function (whatHappnd, changedData) {
        $happn.emit(whatHappnd, changedData);
        return true;
      });
      this.__attachToSecurityChangesActivated = true;
    }
  } catch (e) {
    return callback(e);
  }
  callback();
};

Security.prototype.attachToSessionChanges = function ($happn, callback) {
  try {
    if (!this.__attachToSessionChangesActivated) {
      this.__sessionService.on('authentic', function (data) {
        $happn.emit('connect', data);
      });
      this.__sessionService.on('disconnect', function (data) {
        $happn.emit('disconnect', data);
      });
      this.__attachToSessionChangesActivated = true;
    }
  } catch (e) {
    return callback(e);
  }
  callback();
};

Security.prototype.getComponentId = function () {
  return this.__componentId;
};

Security.prototype.__validateRequest = function (methodName, callArguments, callback) {
  if (!this.__initialized) {
    return callback(
      new Error('security module not initialized, is your happn configured to be secure?')
    );
  }

  if (['addGroup', 'updateGroup'].indexOf(methodName) > -1) {
    var group = callArguments[1];

    if (typeof group !== 'object' || group == null)
      return callback(new Error('group is null or not an object'));

    if (
      group.permissions &&
      group.permissions.data &&
      !this.__validateDataPermissions(group.permissions.data)
    )
      return callback(
        new Error('data permissions cannot start with /_events, /_exchange or /@HTTP')
      );
  }

  if (methodName === 'addGroupPermissions') {
    var mergePermissions = callArguments[2];
    if (mergePermissions.data && !this.__validateDataPermissions(mergePermissions.data))
      return callback(
        new Error('data permissions cannot start with /_events, /_exchange or /@HTTP')
      );
  }

  if (['linkGroupName', 'unlinkGroupName'].indexOf(methodName) > -1)
    if (!callArguments[1]) return callback(new Error('missing user argument'));

  callback();
};

this.__cachedSystemPermissions = null;
//Return possible assignable system permissions by iterating through the mesh description
Security.prototype.getSystemPermissions = function ($happn, params, callback) {
  this.__validateRequest('getSystemPermissions', arguments, (e) => {
    if (e) return callback(e);
    if (!params) params = {};
    if (!this.__cachedSystemPermissions || params.nocache) {
      var permissions = {
        events: {},
        methods: {},
        web: {},
      };
      var meshName = $happn._mesh.config.name;
      for (var componentName in $happn.exchange[meshName]) {
        permissions.methods['/' + meshName + '/' + componentName + '/*'] = {
          authorized: true,
          description: 'system permission',
        };
        for (var methodName in $happn.exchange[meshName][componentName]) {
          permissions.methods['/' + meshName + '/' + componentName + '/' + methodName] = {
            authorized: true,
            description: 'system permission',
          };
        }
      }
      for (var eventComponentName in $happn.event[meshName]) {
        permissions.events['/' + meshName + '/' + eventComponentName + '/*'] = {
          authorized: true,
          description: 'system permission',
        };
        for (var eventName in $happn.event[meshName][eventComponentName]) {
          permissions.events['/' + meshName + '/' + eventComponentName + '/' + eventName] = {
            authorized: true,
            description: 'system permission',
          };
        }
      }
      for (var meshComponentName in $happn._mesh.config.components) {
        permissions.web['/' + meshName + '/' + meshComponentName + '/*'] = {
          authorized: true,
          description: 'system permission',
        };
        if (
          $happn._mesh.config.components[meshComponentName].web &&
          $happn._mesh.config.components[meshComponentName].web.routes
        )
          for (var webMethod in $happn._mesh.config.components[meshComponentName].web.routes) {
            permissions.web['/' + meshName + '/' + meshComponentName + '/' + webMethod] = {
              authorized: true,
              description: 'system permission',
            };
          }
      }
      this.__cachedSystemPermissions = permissions;
    }
    callback(null, this.__cachedSystemPermissions);
  });
};

Security.prototype.__getPermissionPath = function ($happn, rawPath, prefix, wildcard) {
  const meshName = $happn.info.mesh.domain;
  //we add a wildcard to the end of the path
  // eslint-disable-next-line no-useless-escape
  if (wildcard) rawPath = rawPath.replace(/[\/*]+$/, '') + '/*';
  if (rawPath.substring(0, 1) !== '/') rawPath = '/' + rawPath;
  if (rawPath.indexOf('/' + meshName) === -1) rawPath = rawPath.replace('/', '/' + meshName + '/');
  return '/' + prefix + rawPath;
};

Security.prototype.__transformMeshGroup = function ($happn, group) {
  if (!group) return group;
  var transformed = JSON.parse(JSON.stringify(group));
  transformed.permissions = this.__transformMeshPermissions($happn, group.permissions);
  return transformed;
};

Security.prototype.__transformMeshUser = function ($happn, user) {
  if (!user) return user;
  var transformed = JSON.parse(JSON.stringify(user));
  transformed.permissions = this.__transformMeshPermissions($happn, user.permissions || {});
  return transformed;
};

Security.prototype.__transformHappnUser = function ($happn, user) {
  if (!user) return user;
  var transformed = JSON.parse(JSON.stringify(user));
  transformed.permissions = transformed.permissions
    ? this.__transformHappnPermissions($happn, transformed.permissions)
    : {};
  return transformed;
};

Security.prototype.__transformHappnGroups = function ($happn, happnGroups) {
  var transformed = [];
  happnGroups.forEach((happnGroup) => {
    transformed.push(this.__transformHappnGroup($happn, happnGroup));
  });
  return transformed;
};

Security.prototype.__transformHappnGroup = function ($happn, group) {
  if (!group) return group;
  var transformed = JSON.parse(JSON.stringify(group));
  transformed.permissions = this.__transformHappnPermissions($happn, group.permissions);
  return transformed;
};

Security.prototype.__validateDataPermissions = function (dataPermissions) {
  for (var permissionPath in dataPermissions) {
    var cleanPath = permissionPath.replace(/\//g, '').replace(/\*/g, '');
    if (
      cleanPath.indexOf('_exchange') === 0 ||
      cleanPath.indexOf('_events') === 0 ||
      cleanPath.indexOf('@HTTP') === 0
    )
      return false;
  }
  return true;
};

/*
 turns the mesh groups permissions to happn permissions, uses
 the mesh description to verify
 */
Security.prototype.__transformMeshPermissions = function ($happn, meshGroupPermissions) {
  var permissions = {};
  if (meshGroupPermissions.data) {
    Object.keys(meshGroupPermissions.data).forEach(function (permissionPath) {
      if (meshGroupPermissions.data[permissionPath].authorized === false) {
        permissions[permissionPath] = {
          prohibit: meshGroupPermissions.data[permissionPath].actions,
          remove: meshGroupPermissions.data[permissionPath].remove,
        };
        return;
      }
      permissions[permissionPath] = meshGroupPermissions.data[permissionPath];
    });
  }

  for (var eventPermissionPath in meshGroupPermissions.events) {
    if (meshGroupPermissions.events[eventPermissionPath].authorized)
      permissions[this.__getPermissionPath($happn, eventPermissionPath, '_events')] = {
        actions: ['on'],
        remove: meshGroupPermissions.events[eventPermissionPath].remove,
        description: meshGroupPermissions.events[eventPermissionPath].description,
      };
    else
      permissions[this.__getPermissionPath($happn, eventPermissionPath, '_events')] = {
        prohibit: ['on'],
        remove: meshGroupPermissions.events[eventPermissionPath].remove,
        description: meshGroupPermissions.events[eventPermissionPath].description,
      };
  }

  for (var methodPermissionPath in meshGroupPermissions.methods) {
    if (meshGroupPermissions.methods[methodPermissionPath].authorized) {
      permissions[this.__getPermissionPath($happn, methodPermissionPath, '_exchange/requests')] = {
        actions: ['set'],
        remove: meshGroupPermissions.methods[methodPermissionPath].remove,
        description: meshGroupPermissions.methods[methodPermissionPath].description,
      };
      permissions[
        this.__getPermissionPath($happn, methodPermissionPath, '_exchange/responses', true)
      ] = {
        actions: ['on', 'set'],
        remove: meshGroupPermissions.methods[methodPermissionPath].remove,
        description: meshGroupPermissions.methods[methodPermissionPath].description,
      };
    } else {
      permissions[this.__getPermissionPath($happn, methodPermissionPath, '_exchange/requests')] = {
        prohibit: ['set'],
        remove: meshGroupPermissions.methods[methodPermissionPath].remove,
        description: meshGroupPermissions.methods[methodPermissionPath].description,
      };
      permissions[
        this.__getPermissionPath($happn, methodPermissionPath, '_exchange/responses', true)
      ] = {
        prohibit: ['on', 'set'],
        remove: meshGroupPermissions.methods[methodPermissionPath].remove,
        description: meshGroupPermissions.methods[methodPermissionPath].description,
      };
    }
  }

  for (var webPermissionPath in meshGroupPermissions.web) {
    let actions = meshGroupPermissions.web[webPermissionPath].actions;
    let authorized = meshGroupPermissions.web[webPermissionPath].authorized;
    let remove = meshGroupPermissions.web[webPermissionPath].remove;
    if (webPermissionPath[0] !== '/') webPermissionPath = '/' + webPermissionPath;

    permissions['/@HTTP' + webPermissionPath] = {};
    permissions['/@HTTP' + webPermissionPath].remove = remove;
    if (authorized == null || authorized === true)
      permissions['/@HTTP' + webPermissionPath].actions = actions;
    else permissions['/@HTTP' + webPermissionPath].prohibit = actions;
  }
  return permissions;
};

/*
 turns the happn groups permissions to mesh permissions, uses
 the mesh description to verify
 */
Security.prototype.__transformHappnPermissions = function ($happn, happnGroupPermissions) {
  var permissions = {
    methods: {},
    events: {},
    web: {},
    data: {},
  };

  for (var happnPermissionPath in happnGroupPermissions) {
    //huh?
    //if (!happnGroupPermissions.hasOwnProperty(happnPermissionPath)) return;
    if (happnPermissionPath.indexOf('/_events/') === 0) {
      var happnEventPermission = happnGroupPermissions[happnPermissionPath];
      if (happnEventPermission.actions && happnEventPermission.actions.indexOf('on') > -1)
        permissions.events[happnPermissionPath.replace('/_events/', '')] = {
          authorized: true,
          description: happnEventPermission.description,
        };
      continue;
    }

    if (happnPermissionPath.indexOf('/_exchange/requests/') === 0) {
      var happnPermission = happnGroupPermissions[happnPermissionPath];
      if (happnPermission.actions && happnPermission.actions.indexOf('set') > -1)
        permissions.methods[happnPermissionPath.replace('/_exchange/requests/', '')] = {
          authorized: true,
          description: happnPermission.description,
        };
      continue;
    }

    if (happnPermissionPath.indexOf('/@HTTP/') === 0) {
      var happnWebPermission = happnGroupPermissions[happnPermissionPath];
      if (
        happnWebPermission.authorized ||
        (happnWebPermission.actions && happnWebPermission.actions.length > 0)
      ) {
        var key = happnPermissionPath.replace('/@HTTP/', '');
        permissions.web[key] = {
          authorized: true,
          description: happnWebPermission.description,
        };
        if (happnWebPermission.actions) {
          permissions.web[key].actions = happnWebPermission.actions;
        }
      }
      continue;
    }
    if (happnPermissionPath.indexOf('/_exchange/responses/') === 0) continue;
    //set up a plain data permission
    permissions.data[happnPermissionPath] = happnGroupPermissions[happnPermissionPath];
  }

  return permissions;
};

Security.prototype.__permissionsToInputFormat = function (permissions) {
  if (permissions && permissions.methods) {
    Object.keys(permissions.methods).forEach(function (path) {
      // reduce /requests/* /responses/* to single entry

      if (path.match(/^responses\//)) {
        return delete permissions.methods[path];
      }

      if (path.match(/^requests\//)) {
        permissions.methods[path.replace(/^requests\//, '')] = permissions.methods[path];
        return delete permissions.methods[path];
      }
    });
  }
};

Security.prototype.__removeLeadingSlashes = function (permissions) {
  // remove leading /'s from input paths to match outputted getGroup format
  ['methods', 'events', 'web'].forEach(function (type) {
    if (!(permissions[type] instanceof Object)) return;

    Object.keys(permissions[type]).forEach(function (path) {
      if (path.match(/^\//)) {
        permissions[type][path.substring(1)] = permissions[type][path];
        delete permissions[type][path];
      }
    });
  });
};

Security.prototype.unlinkGroups = function ($happn, unlink, user, callback) {
  if (!unlink || unlink.length === 0) return callback(null);
  async.each(
    unlink,
    (groupName, unlinkGroupCB) => {
      this.unlinkGroupName($happn, groupName, user, unlinkGroupCB);
    },
    callback
  );
};

Security.prototype.associateGroups = function ($happn, user, link, unlink, callback) {
  if (!link || link.length === 0) return this.unlinkGroups($happn, unlink, user, callback);

  async.each(
    link,
    (linkGroupName, linkGroupCB) => {
      this.linkGroupName($happn, linkGroupName, user, linkGroupCB);
    },
    (e) => {
      if (e) return callback(e);
      if (!unlink || unlink.length === 0) return callback(null);
      this.unlinkGroups($happn, unlink, user, callback);
    }
  );
};

Security.prototype.upsertUser = function ($happn, user, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (!user.groups) user.groups = {};
  var isUpdate = false;

  this.getUser($happn, user.username, (e, found) => {
    if (e) return callback(e);
    var upsertUser;
    var groupsToDrop = [];

    if (found) {
      upsertUser = found;
      isUpdate = true;
      //replace all properties except groups and username
      Object.keys(user).forEach(function (propertyName) {
        if (['groups', 'username', '_meta'].indexOf(propertyName) === -1)
          upsertUser[propertyName] = user[propertyName];
      });
      if (options.overwriteMemberships) {
        //get the groups we need to unlink, when we overwrite
        Object.keys(found.groups).forEach(function (groupName) {
          if (!user.groups[groupName]) groupsToDrop.push(groupName);
        });
        upsertUser.groups = user.groups;
      } else for (var groupName in user.groups) upsertUser.groups[groupName] = user.groups;
    } else upsertUser = user;

    if (isUpdate) {
      this.updateUser($happn, upsertUser, (e, updated) => {
        if (e) return callback(e);
        this.associateGroups($happn, updated, Object.keys(user.groups), groupsToDrop, (e) => {
          if (e) return callback(e);
          this.getUser($happn, updated.username, callback);
        });
      });
      return;
    }
    this.addUser($happn, upsertUser, (e, added) => {
      if (e) return callback(e);
      this.associateGroups($happn, added, Object.keys(user.groups), [], (e) => {
        if (e) return callback(e);
        this.getUser($happn, added.username, callback);
      });
    });
  });
};

Security.prototype.upsertGroup = function ($happn, group, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (group.permissions == null) group.permissions = {};
  if (group.permissions.methods == null) group.permissions.methods = {};
  if (group.permissions.events == null) group.permissions.events = {};
  if (group.permissions.web == null) group.permissions.web = {};
  if (group.permissions.data == null) group.permissions.data = {};

  this.getGroup($happn, group.name, (e, found) => {
    if (e) return callback(e);

    if (!found) return this.addGroup($happn, group, callback);

    let upsertGroup = found;

    //replace all properties except permissions and name
    Object.keys(group).forEach(function (propertyName) {
      if (['permissions', 'name', '_meta'].indexOf(propertyName) === -1)
        upsertGroup[propertyName] = group[propertyName];
    });

    if (options.overwritePermissions) upsertGroup.permissions = group.permissions;
    else {
      if (!upsertGroup.permissions.methods) upsertGroup.permissions.methods = {};
      if (!upsertGroup.permissions.events) upsertGroup.permissions.events = {};
      if (!upsertGroup.permissions.web) upsertGroup.permissions.web = {};
      if (!upsertGroup.permissions.data) upsertGroup.permissions.data = {};

      if (group.permissions.methods)
        Object.keys(group.permissions.methods).forEach(function (permissionKey) {
          upsertGroup.permissions.methods[permissionKey] = group.permissions.methods[permissionKey];
        });

      if (group.permissions.events)
        Object.keys(group.permissions.events).forEach(function (permissionKey) {
          upsertGroup.permissions.events[permissionKey] = group.permissions.events[permissionKey];
        });

      if (group.permissions.web)
        Object.keys(group.permissions.web).forEach(function (permissionKey) {
          upsertGroup.permissions.web[permissionKey] = group.permissions.web[permissionKey];
        });

      if (group.permissions.data)
        Object.keys(group.permissions.data).forEach(function (permissionKey) {
          upsertGroup.permissions.data[permissionKey] = group.permissions.data[permissionKey];
        });
    }
    return this.updateGroup($happn, upsertGroup, callback);
  });
};

Security.prototype.addGroup = function ($happn, group, callback) {
  this.__validateRequest('addGroup', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.upsertGroup(
      this.__transformMeshGroup($happn, group),
      {
        overwrite: false,
      },
      (e, addedGroup) => {
        if (e) return callback(e);
        return callback(null, this.__transformHappnGroup($happn, addedGroup));
      }
    );
  });
};

Security.prototype.updateGroup = function ($happn, group, callback) {
  this.__validateRequest('updateGroup', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.upsertGroup(
      this.__transformMeshGroup($happn, group),
      (e, updatedGroup) => {
        if (e) return callback(e);
        return callback(null, this.__transformHappnGroup($happn, updatedGroup));
      }
    );
  });
};

Security.prototype.__transformPermissions = function (entity, changePermissions, change) {
  let authorized;
  if (['removeProhibitions', 'prohibit'].includes(change)) authorized = false;
  if (['removePermissions', 'add'].includes(change)) authorized = true;
  let remove = change.startsWith('remove');
  if (typeof authorized !== 'boolean') return; //Unsupported change type
  let permissionsTypes = ['removePermissions', 'prohibit'].includes(change)
    ? ['methods', 'events', 'web', 'data']
    : ['methods', 'events', 'web'];

  this.__removeLeadingSlashes(changePermissions);
  permissionsTypes.forEach((type) => {
    if (!(changePermissions[type] instanceof Object)) return;
    Object.keys(changePermissions[type]).forEach((permissionPath) => {
      changePermissions[type][permissionPath].authorized = authorized;
      changePermissions[type][permissionPath].remove = remove;
      if (type === 'web')
        if (
          !changePermissions[type][permissionPath].actions ||
          Object.keys(changePermissions[type][permissionPath].actions).length === 0
        )
          changePermissions[type][permissionPath].actions = ['*'];
    });
  });
  entity.permissions = changePermissions;
  return entity;
};

Security.prototype.addGroupPermissions = function ($happn, groupName, mergePermissions, callback) {
  this.__validateRequest('addGroupPermissions', arguments, (e) => {
    if (e) return callback(e);
    this.getGroup($happn, groupName, (e, group) => {
      if (e) return callback(e);
      this.updateGroup(
        $happn,
        this.__transformPermissions(group, mergePermissions, 'add'),
        (e, updated) => {
          if (e) return callback(e);
          return callback(null, updated);
        }
      );
    });
  });
};

Security.prototype.addUserPermissions = function ($happn, username, mergePermissions, callback) {
  this.__validateRequest('addUserPermissions', arguments, (e) => {
    if (e) return callback(e);
    this.getUser($happn, username, (e, user) => {
      if (!user) return callback(new Error(`User ${username} does not exist in the system`));
      if (e) return callback(e);
      this.__securityService.users.upsertPermissions(
        this.__transformMeshUser(
          $happn,
          this.__transformPermissions(user, mergePermissions, 'add')
        ),
        callback
      );
    });
  });
};

Security.prototype.removeGroupPermissions = function (
  $happn,
  groupName,
  removePermissions,
  callback
) {
  this.__validateRequest('removeGroupPermissions', arguments, (e) => {
    if (e) return callback(e);
    this.getGroup($happn, groupName, (e, group) => {
      if (e) return callback(e);
      this.updateGroup(
        $happn,
        this.__transformPermissions(group, removePermissions, 'removePermissions'),
        (e, updated) => {
          if (e) return callback(e);
          callback(null, updated);
        }
      );
    });
  });
};

Security.prototype.removeUserPermissions = function (
  $happn,
  username,
  removePermissions,
  callback
) {
  this.__validateRequest('removeUserPermissions', arguments, (e) => {
    if (e) return callback(e);
    this.getUser($happn, username, (e, user) => {
      if (e) return callback(e);
      this.__securityService.users.upsertPermissions(
        this.__transformMeshUser(
          $happn,
          this.__transformPermissions(user, removePermissions, 'removePermissions')
        ),
        callback
      );
    });
  });
};

Security.prototype.addUser = function ($happn, user, callback) {
  this.__validateRequest('addUser', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.upsertUser(
      this.__transformMeshUser($happn, user),
      {
        overwrite: false,
      },
      (e, upsertedUser) => {
        if (e) return callback(e);
        this.linkGroup($happn, this.__systemGroups._MESH_GST, upsertedUser, (e) => {
          if (e) return callback(e);
          callback(null, upsertedUser);
        });
      }
    );
  });
};

Security.prototype.changePassword = async function ($happn, $origin, oldPassword, newPassword) {
  if (typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
    throw new Error('Bad Password Arguments');
  }
  await this.__securityService.changePassword($origin, { oldPassword, newPassword });
};

Security.prototype.updateOwnUser = function ($happn, $origin, user, callback) {
  let updateError;
  $happn.log.warn(`Deprecated function, please use changePassword`);
  this.changePassword($happn, $origin, user.oldPassword, user.password)
    .catch((e) => {
      updateError = e;
    })
    .finally(() => {
      callback(updateError, user);
    });
};

Security.prototype.updateUser = function ($happn, user, callback) {
  this.__validateRequest('updateUser', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.upsertUser(this.__transformMeshUser($happn, user), callback);
  });
};

Security.prototype.resetPassword = async function (username) {
  if (typeof username !== 'string') {
    throw new Error('Invalid arguments');
  }
  return this.__securityService.resetPassword(username);
};

Security.prototype.linkGroupName = function ($happn, groupName, user, callback) {
  this.__validateRequest('linkGroupName', arguments, (e) => {
    if (e) return callback(e);
    this.getGroup($happn, groupName, (e, group) => {
      if (e) return callback(e);
      if (!group) return callback(new Error('group with name ' + groupName + ' does not exist'));
      this.__securityService.users.linkGroup(
        this.__transformMeshGroup($happn, group),
        user,
        {},
        callback
      );
    });
  });
};

Security.prototype.unlinkGroupName = function ($happn, groupName, user, callback) {
  this.__validateRequest('unlinkGroupName', arguments, (e) => {
    if (e) return callback(e);
    this.getGroup($happn, groupName, (e, group) => {
      if (e) return callback(e);
      if (!group) return callback(new Error('group with name ' + groupName + ' does not exist'));
      this.__securityService.users.unlinkGroup(
        this.__transformMeshGroup($happn, group),
        user,
        {},
        callback
      );
    });
  });
};

Security.prototype.linkAnonymousGroup = function ($happn, groupName, callback) {
  this.__validateRequest('linkAnonymousGroup', arguments, (e) => {
    if (e) return callback(e);
    this.__happnLinkAnonymousGroup({ name: groupName }, callback);
  });
};

Security.prototype.unlinkAnonymousGroup = function ($happn, groupName, callback) {
  this.__validateRequest('unlinkAnonymousGroup', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.groups.getGroup(groupName, (e, group) => {
      if (e) return callback(e);
      if (group == null) return callback();
      this.__happnUnlinkAnonymousGroup(group, callback);
    });
  });
};

Security.prototype.__getGroupIfString = function (group, callback) {
  if (typeof group !== 'string') return callback(null, group);
  this.__securityService.groups.getGroup(group, (e, foundGroup) => {
    if (e) return callback(e);
    if (!foundGroup) return callback(new Error('group with name ' + group + ' does not exist'));
    return callback(null, foundGroup);
  });
};

Security.prototype.__getUserIfString = function (user, callback) {
  if (typeof user !== 'string') return callback(null, user);
  this.__securityService.users.getUser(user, (e, foundUser) => {
    if (e) return callback(e);
    if (!foundUser) return callback(new Error('user with name ' + user + ' does not exist'));
    return callback(null, foundUser);
  });
};

Security.prototype.linkGroup = function ($happn, group, user, callback) {
  this.__validateRequest('linkGroup', arguments, (e) => {
    if (e) return callback(e);
    this.__getGroupIfString(group, (e, foundGroup) => {
      if (e) return callback(e);
      this.__getUserIfString(user, (e, foundUser) => {
        if (e) return callback(e);
        const transformedGroup = this.__transformMeshGroup($happn, foundGroup);
        this.__securityService.users.linkGroup(transformedGroup, foundUser, {}, (e, result) => {
          if (e) return callback(e);
          callback(null, result);
        });
      });
    });
  });
};

Security.prototype.unlinkGroup = function ($happn, group, user, callback) {
  this.__validateRequest('unlinkGroup', arguments, (e) => {
    if (e) return callback(e);
    this.__getGroupIfString(group, (e, foundGroup) => {
      if (e) return callback(e);
      this.__getUserIfString(user, (e, foundUser) => {
        if (e) return callback(e);
        this.__securityService.users.unlinkGroup(
          this.__transformMeshGroup($happn, foundGroup),
          foundUser,
          {},
          callback
        );
      });
    });
  });
};

Security.prototype.listGroups = function ($happn, groupName, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  this.__validateRequest('listGroups', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.listGroups(groupName, options, (e, happnGroups) => {
      if (e) return callback(e);
      if (options && options.count) return callback(null, happnGroups);
      callback(null, this.__transformHappnGroups($happn, happnGroups));
    });
  });
};

Security.prototype.listUsers = function ($happn, userName, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  this.__validateRequest('listUsers', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.listUsers(userName, options, callback);
  });
};

Security.prototype.listUserNamesByGroup = function (groupName, callback) {
  this.__securityService.users
    .listUserNamesByGroup(groupName)
    .then(function (usernames) {
      return callback(null, usernames);
    })
    .catch(callback);
};

Security.prototype.listUsersByGroup = function (groupName, options) {
  return new Promise((resolve, reject) => {
    this.__securityService.users.listUsersByGroup(groupName, options, (e, users) => {
      if (e) return reject(e);
      resolve(users);
    });
  });
};

Security.prototype.getUser = function ($happn, userName, options, callback) {
  if (typeof userName === 'function') {
    callback = userName;
    return callback(new Error('getUser method expects a userName argument'));
  }

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  this.__validateRequest('getUser', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.getUser(userName, options, (e, user) => {
      if (e) return callback(e);
      if (user) return callback(null, this.__transformHappnUser($happn, user));
      return callback(null, null);
    });
  });
};

Security.prototype.getGroup = function ($happn, groupName, callback) {
  if (typeof groupName === 'function') {
    callback = groupName;
    return callback(new Error('getGroup method expects a groupName argument'));
  }
  this.__validateRequest('getGroup', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.getGroup(groupName, {}, (e, group) => {
      if (e) return callback(e);
      if (group) return callback(null, this.__transformHappnGroup($happn, group));
      // callback with null if group does not exist (same as getUser)
      callback(null, null);
    });
  });
};

Security.prototype.deleteGroup = function (group, callback) {
  this.__validateRequest('deleteGroup', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.deleteGroup(group, {}, callback);
  });
};

Security.prototype.deleteUser = function (user, callback) {
  this.__validateRequest('deleteUser', arguments, (e) => {
    if (e) return callback(e);
    this.__securityService.users.deleteUser(user, callback);
  });
};

Security.prototype.sessionManagementActive = function () {
  if (!this.__securityService) throw new Error('not initialized');
  return this.__securityService.sessionManagementActive();
};

Security.prototype.activateSessionManagement = function (logSessionActivity, callback) {
  if (!this.__securityService) return callback(new Error('not initialized'));
  return this.__securityService.activateSessionManagement(logSessionActivity, callback);
};

Security.prototype.deactivateSessionManagement = function (logSessionActivity, callback) {
  if (!this.__securityService) return callback(new Error('not initialized'));
  return this.__securityService.deactivateSessionManagement(logSessionActivity, callback);
};

Security.prototype.sessionActivityActive = function () {
  if (!this.__securityService) throw new Error('not initialized');
  return this.__securityService.sessionActivityActive();
};

Security.prototype.activateSessionActivity = function (callback) {
  if (!this.__securityService) return callback(new Error('not initialized'));
  return this.__securityService.activateSessionActivity(callback);
};

Security.prototype.deactivateSessionActivity = function (clear, callback) {
  if (!this.__securityService) return callback(new Error('not initialized'));
  return this.__securityService.deactivateSessionActivity(clear, callback);
};

Security.prototype.clearSessionActivity = function (callback) {
  if (!this.__securityService) return callback(new Error('not initialized'));
  return this.__securityService.clearSessionActivity(callback);
};

Security.prototype.revokeToken = function (token, reason, callback) {
  if (!token) return callback(new Error('missing token argument'));

  if (typeof reason === 'function') {
    callback = reason;
    reason = 'SYSTEM';
  }

  if (!this.__securityService) return callback(new Error('not initialized'));
  return this.__securityService.revokeToken(token, reason, callback);
};

Security.prototype.restoreToken = function (token, callback) {
  if (!token) return callback(new Error('missing token argument'));
  if (!this.__securityService) return callback(new Error('not initialized'));

  return this.__securityService.restoreToken(token, callback);
};

Security.prototype.listSessionActivity = function (filter, callback) {
  if (typeof filter === 'function') {
    callback = filter;
    filter = null;
  }

  if (!this.__securityService) return callback(new Error('not initialized'));
  return this.__securityService.listSessionActivity(filter, callback);
};

Security.prototype.listActiveSessions = function (filter, callback) {
  if (typeof filter === 'function') {
    callback = filter;
    filter = null;
  }

  if (!this.__securityService) return callback(new Error('not initialized'));
  return this.__securityService.listActiveSessions(filter, callback);
};

Security.prototype.listRevokedTokens = function (filter, callback) {
  if (typeof filter === 'function') {
    callback = filter;
    filter = null;
  }

  if (!this.__securityService) return callback(new Error('not initialized'));
  return this.__securityService.listRevokedTokens(filter, callback);
};

Security.prototype.upsertLookupPermission = async function (group, permission) {
  return this.__securityService.lookupTables.upsertLookupPermission(group, permission);
};

Security.prototype.removeLookupPermission = async function (group, permission) {
  return this.__securityService.lookupTables.removeLookupPermission(group, permission);
};

Security.prototype.upsertEventLookupPermission = async function (group, permission, $happn) {
  return this.__securityService.lookupTables.upsertLookupPermission(
    group,
    this.__transformEventLookupPermission(permission, $happn)
  );
};

Security.prototype.removeEventLookupPermission = async function (group, permission, $happn) {
  return this.__securityService.lookupTables.removeLookupPermission(
    group,
    this.__transformEventLookupPermission(permission, $happn)
  );
};

Security.prototype.upsertExchangeLookupPermission = async function (group, permission, $happn) {
  return this.upsertLookupPermissions(
    group,
    this.__transformExchangeLookupPermission(permission, $happn)
  );
};

Security.prototype.removeExchangeLookupPermission = async function (group, permission, $happn) {
  return this.removeLookupPermissions(
    group,
    this.__transformExchangeLookupPermission(permission, $happn)
  );
};

Security.prototype.upsertLookupPermissions = async function (group, permissions) {
  for (const permission of permissions) {
    await this.upsertLookupPermission(group, permission);
  }
};

Security.prototype.removeLookupPermissions = async function (group, permissions) {
  const results = [];
  for (const permission of permissions) {
    results.push(await this.removeLookupPermission(group, permission));
  }
  return results;
};

Security.prototype.__transformEventLookupPermission = function (eventPermission, $happn) {
  return {
    regex: `^/_events/${$happn.info.mesh.domain}/${eventPermission.component}/${eventPermission.event}`,
    actions: ['on'],
    table: eventPermission.table,
    path: eventPermission.path,
  };
};

Security.prototype.__transformExchangeLookupPermission = function (exchangePermission, $happn) {
  return [
    {
      regex: `^/_exchange/requests/${$happn.info.mesh.domain}/${exchangePermission.component}/${exchangePermission.method}`,
      actions: ['set'],
      table: exchangePermission.table,
      path: exchangePermission.path,
    },
    {
      regex: `^/_exchange/responses/${$happn.info.mesh.domain}/${exchangePermission.component}/${exchangePermission.method}`,
      actions: ['set', 'on'],
      table: exchangePermission.table,
      path: exchangePermission.path,
    },
  ];
};

Security.prototype.fetchLookupPermissions = async function (group) {
  return this.__securityService.lookupTables.fetchLookupPermissions(group);
};

Security.prototype.unlinkLookupTable = async function (group, table) {
  return this.__securityService.lookupTables.removeAllTablePermission(group, table);
};

Security.prototype.upsertLookupTable = async function (table) {
  return this.__securityService.lookupTables.upsertLookupTable(table);
};

Security.prototype.deleteLookupTable = async function (name) {
  return this.__securityService.lookupTables.deleteLookupTable(name);
};

Security.prototype.insertLookupPath = async function (table, path) {
  return this.__securityService.lookupTables.insertPath(table, path);
};

Security.prototype.removeLookupPath = async function (table, path) {
  return this.__securityService.lookupTables.removePath(table, path);
};

Security.prototype.fetchLookupTable = async function (tableName) {
  return this.__securityService.lookupTables.fetchLookupTable(tableName);
};
