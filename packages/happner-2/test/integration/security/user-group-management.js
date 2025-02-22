module.exports = TestMesh;

function TestMesh() {}

TestMesh.prototype.method1 = function ($happn, options, callback) {
  options.methodName = 'method1';
  callback(null, options);
};

if (global.TESTING_USER_MANAGEMENT) return; // When 'requiring' the module above,

require('../../__fixtures/utils/test_helper').describe({ timeout: 120e3 }, (test) => {
  var mesh;
  var Mesh = test.Mesh;

  var adminClient = new Mesh.MeshClient({ secure: true, port: 8003 });
  var test_id = test.newid();

  before(function (done) {
    global.TESTING_USER_MANAGEMENT = true; //.............

    mesh = this.mesh = new Mesh();

    mesh.initialize(
      {
        name: 'user-management',
        happn: {
          secure: true,
          adminPassword: test_id,
          port: 8003,
        },
        modules: {
          TestMesh: {
            path: __filename,
          },
        },
        components: {
          TestMesh: {
            moduleName: 'TestMesh',
            schema: {
              exclusive: false,
              methods: {},
            },
          },
        },
      },
      function (err) {
        if (err) return done(err);
        mesh.start(function (err) {
          if (err) {
            return done(err);
          }
          // Credentials for the login method
          var credentials = {
            username: '_ADMIN', // pending
            password: test_id,
          };
          adminClient
            .login(credentials)
            .then(function () {
              done();
            })
            .catch(done);
        });
      }
    );
  });

  after(function (done) {
    delete global.TESTING_USER_MANAGEMENT; //.............
    adminClient.disconnect(() => {
      mesh.stop({ reconnect: false }, done);
    });
  });

  it('adds a test user, modifies the users password with the admin user, logs in with the test user', function (done) {
    var testGroup = {
      name: 'TESTGROUP1' + test_id,
      custom_data: {
        customString: 'custom1',
        customNumber: 0,
      },
      permissions: {
        methods: {},
      },
    };

    var testGroupSaved;
    var testUserSaved;
    var testUserClient;

    adminClient.exchange.security.addGroup(testGroup, function (e, result) {
      if (e) return done(e);

      testGroupSaved = result;

      var testUser = {
        username: 'TESTUSER1' + test_id,
        password: 'TEST PWD',
        custom_data: {
          something: 'useful',
        },
      };

      adminClient.exchange.security.addUser(testUser, function (e, result) {
        if (e) return done(e);

        test.expect(result.username).to.be(testUser.username);
        testUserSaved = result;

        adminClient.exchange.security.linkGroup(testGroupSaved, testUserSaved, function (e) {
          //we'll need to fetch user groups, do that later
          if (e) return done(e);

          testUser.password = 'NEW PWD';
          testUser.custom_data = { changedCustom: 'changedCustom' };

          adminClient.exchange.security.updateUser(testUser, function (e) {
            if (e) return done(e);

            testUserClient = new Mesh.MeshClient({ secure: true, port: 8003 });
            return testUserClient.login(testUser).then(done).catch(done);
          });
        });
      });
    });
  });

  it('test getting a user with no params', async () => {
    try {
      await adminClient.exchange.security.getUser();
      throw new Error('unexpected success');
    } catch (e) {
      test.expect(e.message).to.be('getUser method expects a userName argument');
    }
  });

  it('test getting a group with no params', async () => {
    try {
      await adminClient.exchange.security.getGroup();
      throw new Error('unexpected success');
    } catch (e) {
      test.expect(e.message).to.be('getGroup method expects a groupName argument');
    }
  });

  it('test updating an undefined user', function (done) {
    adminClient.exchange.security.updateUser(undefined, function (e) {
      test.expect(e.message).to.be('user is null or not an object');
      done();
    });
  });

  it('test updating an undefined group', function (done) {
    adminClient.exchange.security.updateGroup(undefined, function (e) {
      test.expect(e.message).to.be('group is null or not an object');
      done();
    });
  });

  it('adds a test user, logs in with the test user - modifies the users password, fetches modified user and ensures oldPassword is not present', function (done) {
    var testGroup = {
      name: 'TESTGROUP2' + test_id,

      custom_data: {
        customString: 'custom1',
        customNumber: 0,
      },

      permissions: {
        methods: {},
      },
    };

    var testGroupSaved;
    var testUserSaved;
    var testUserClient;

    adminClient.exchange.security.addGroup(testGroup, function (e, result) {
      if (e) return done(e);

      testGroupSaved = result;

      var testUser = {
        username: 'TESTUSER2' + test_id,
        password: 'TEST PWD',
        custom_data: {
          something: 'useful',
        },
      };

      adminClient.exchange.security.addUser(testUser, function (e, result) {
        if (e) return done(e);

        test.expect(result.username).to.be(testUser.username);
        testUserSaved = result;

        adminClient.exchange.security.linkGroup(testGroupSaved, testUserSaved, function (e) {
          //we'll need to fetch user groups, do that later
          if (e) return done(e);

          testUserClient = new Mesh.MeshClient({ secure: true, port: 8003 });

          testUserClient
            .login(testUser)
            .then(function () {
              testUser.oldPassword = 'TEST PWD';
              testUser.password = 'NEW PWD';
              testUser.custom_data = { changedCustom: 'changedCustom' };

              testUserClient.exchange.security.updateOwnUser(testUser, function (e, result) {
                if (e) return done(e);
                test.expect(result.custom_data.changedCustom).to.be('changedCustom');
                testUserClient
                  .login(testUser)
                  .then(function () {
                    adminClient.exchange.security
                      .getUser(testUser.username)
                      .then(function (fetchedUser) {
                        test.expect(fetchedUser.oldPassword).to.be(undefined);

                        done();
                      });
                  })
                  .catch(done);
              });
            })
            .catch(function (e) {
              done(e);
            });
        });
      });
    });
  });

  it('adds a test user, logs in with the test user - fails to modify the user using updateUser on another user', function (done) {
    var testGroup = {
      name: 'TESTGROUP3' + test_id,

      custom_data: {
        customString: 'custom1',
        customNumber: 0,
      },

      permissions: {
        methods: {},
      },
    };

    var testGroupSaved;
    var testUserSaved;
    var testUserClient;

    adminClient.exchange.security.addGroup(testGroup, function (e, result) {
      if (e) return done(e);

      testGroupSaved = result;

      var testUser = {
        username: 'TESTUSER3' + test_id,
        password: 'TEST PWD',
        custom_data: {
          something: 'useful',
        },
      };

      adminClient.exchange.security.addUser(testUser, function (e, result) {
        if (e) return done(e);

        test.expect(result.username).to.be(testUser.username);
        testUserSaved = result;

        adminClient.exchange.security.linkGroup(testGroupSaved, testUserSaved, function (e) {
          //we'll need to fetch user groups, do that later
          if (e) return done(e);

          testUserClient = new Mesh.MeshClient({ secure: true, port: 8003 });

          testUserClient
            .login(testUser)
            .then(function () {
              testUser.oldPassword = 'TEST PWD';
              testUser.password = 'NEW PWD';
              testUser.custom_data = { changedCustom: 'changedCustom' };

              testUserClient.exchange.security.updateUser(testUser, function (e) {
                test.expect(e.toString()).to.be('AccessDenied: unauthorized');
                done();
              });
            })
            .catch(function (e) {
              done(e);
            });
        });
      });
    });
  });

  it('adds a test user, logs in with the test user - fails to modify the password, as old password was not included', function (done) {
    var testGroup = {
      name: 'TESTGROUP4' + test_id,

      custom_data: {
        customString: 'custom1',
        customNumber: 0,
      },

      permissions: {
        methods: {},
      },
    };

    var testGroupSaved;
    var testUserSaved;
    var testUserClient;

    adminClient.exchange.security.addGroup(testGroup, function (e, result) {
      if (e) return done(e);

      testGroupSaved = result;

      var testUser = {
        username: 'TESTUSER4' + test_id,
        password: 'TEST PWD',
        custom_data: {
          something: 'useful',
        },
      };

      adminClient.exchange.security.addUser(testUser, function (e, result) {
        if (e) return done(e);

        test.expect(result.username).to.be(testUser.username);
        testUserSaved = result;

        adminClient.exchange.security.linkGroup(testGroupSaved, testUserSaved, function (e) {
          //we'll need to fetch user groups, do that later
          if (e) return done(e);

          testUserClient = new Mesh.MeshClient({ secure: true, port: 8003 });

          testUserClient
            .login(testUser)
            .then(function () {
              testUser.password = 'NEW PWD';
              testUser.custom_data = { changedCustom: 'changedCustom' };

              testUserClient.exchange.security.updateOwnUser(testUser, function (e) {
                test.expect(e.toString()).to.be('Error: Bad Password Arguments');
                done();
              });
            })
            .catch(function (e) {
              done(e);
            });
        });
      });
    });
  });

  it('adds a test user, logs in with the test user - fails to modify the password, as old password does not match the current one', function (done) {
    var testGroup = {
      name: 'TESTGROUP5' + test_id,

      custom_data: {
        customString: 'custom1',
        customNumber: 0,
      },

      permissions: {
        methods: {},
      },
    };

    var testGroupSaved;
    var testUserSaved;
    var testUserClient;

    adminClient.exchange.security.addGroup(testGroup, function (e, result) {
      if (e) return done(e);

      testGroupSaved = result;

      var testUser = {
        username: 'TESTUSER5' + test_id,
        password: 'TEST PWD',
        custom_data: {
          something: 'useful',
        },
      };

      adminClient.exchange.security.addUser(testUser, function (e, result) {
        if (e) return done(e);

        test.expect(result.username).to.be(testUser.username);
        testUserSaved = result;

        adminClient.exchange.security.linkGroup(testGroupSaved, testUserSaved, function (e) {
          //we'll need to fetch user groups, do that later
          if (e) return done(e);

          testUserClient = new Mesh.MeshClient({ secure: true, port: 8003 });

          testUserClient
            .login(testUser)
            .then(function () {
              testUser.oldPassword = 'NEW PWD';
              testUser.password = 'NEW PWD';
              testUser.custom_data = { changedCustom: 'changedCustom' };

              testUserClient.exchange.security.updateOwnUser(testUser, function (e) {
                test.expect(e.toString()).to.be('SystemError: Invalid old password');
                done();
              });
            })
            .catch(function (e) {
              done(e);
            });
        });
      });
    });
  });

  it('adds a test user, we fetch the user using the listUsersByGroup method', function (done) {
    var testGroup = {
      name: 'TESTGROUP7' + test_id,
      custom_data: {
        customString: 'custom1',
        customNumber: 0,
      },
      permissions: {
        methods: {},
      },
    };

    var testGroupSaved;
    var testUserSaved;

    adminClient.exchange.security.addGroup(testGroup, function (e, result) {
      if (e) return done(e);

      testGroupSaved = result;

      var testUser = {
        username: 'TESTUSER7' + test_id,
        password: 'TEST PWD',
        custom_data: {
          something: 'useful',
          extra: 8,
        },
      };

      var steps = [];

      adminClient.exchange.security.addUser(testUser, function (e, result) {
        if (e) return done(e);
        test.expect(result.username).to.be(testUser.username);
        testUserSaved = result;

        adminClient.exchange.security.linkGroup(testGroupSaved, testUserSaved, function (e) {
          //we'll need to fetch user groups, do that later
          if (e) return done(e);
          adminClient.exchange.security
            .listUsersByGroup('TESTGROUP7' + test_id)
            .then(function (users) {
              test.expect(users.length).to.be(1);
              test.expect(users[0].username).to.be('TESTUSER7' + test_id);
              test.expect(users[0].custom_data).to.eql({
                something: 'useful',
                extra: 8,
              });
              steps.push(1);
              return adminClient.exchange.security.listUsersByGroup('TESTGROUP7' + test_id, {
                criteria: { 'custom_data.extra': 8 },
              });
            })
            .then(function (users) {
              test.expect(users.length).to.be(1);
              test.expect(users[0].username).to.be('TESTUSER7' + test_id);
              test.expect(users[0].custom_data).to.eql({
                something: 'useful',
                extra: 8,
              });
              steps.push(2);
              return adminClient.exchange.security.listUsersByGroup('TESTGROUP50' + test_id);
            })
            .then(function (users) {
              test.expect(users.length).to.be(0);
              steps.push(3);
              return adminClient.exchange.security.listUsersByGroup('TESTGROUP7' + test_id, {
                criteria: { 'custom_data.extra': 9 },
              });
            })
            .then(function (users) {
              test.expect(users.length).to.be(0);
              steps.push(4);
              return adminClient.exchange.security.listUserNamesByGroup('TESTGROUP7' + test_id);
            })
            .then(function (usernames) {
              test.expect(usernames.length).to.be(1);
              test.expect(usernames[0]).to.be('TESTUSER7' + test_id);
              steps.push(5);
              return adminClient.exchange.security.listUsersByGroup(null);
            })
            .catch(function (e) {
              test
                .expect(e.toString())
                .to.be('Error: validation error: groupName must be specified');
              test.expect(steps.length).to.be(5);
              done();
            });
        });
      });
    });
  });

  it('tests the listUsers method with and without criteria', async () => {
    await adminClient.exchange.security.addUser({
      username: 'TESTUSER_LIST1',
      password: 'TEST PWD',
      custom_data: {
        something: 'useful',
      },
    });

    await adminClient.exchange.security.addUser({
      username: 'TESTUSER_LIST2',
      password: 'TEST PWD',
      custom_data: {
        something: 'useful',
      },
    });

    await adminClient.exchange.security.addUser({
      username: 'TESTUSER_LIST3',
      password: 'TEST PWD',
      custom_data: {
        something: 'else',
      },
    });

    await adminClient.exchange.security.addUser({
      username: 'TESTUSER_LIST4',
      password: 'TEST PWD',
      custom_data: {
        something: 'else',
      },
    });

    let usersFiltered = await adminClient.exchange.security.listUsers('TESTUSER_LIST*', {
      criteria: {
        'custom_data.something': { $eq: 'useful' },
      },
    });

    let usersUnFiltered = await adminClient.exchange.security.listUsers('TESTUSER_LIST*');

    test.expect(usersFiltered.length).to.be(2);
    test.expect(usersUnFiltered.length).to.be(4);
  });

  it('tests the listGroups method with and without criteria', async () => {
    await adminClient.exchange.security.addGroup({
      name: 'TESTGROUP_LIST1',
      custom_data: {
        something: 'useful',
      },
      permissions: {
        methods: {},
      },
    });

    await adminClient.exchange.security.addGroup({
      name: 'TESTGROUP_LIST2',
      custom_data: {
        something: 'useful',
      },
      permissions: {
        methods: {},
      },
    });

    await adminClient.exchange.security.addGroup({
      name: 'TESTGROUP_LIST3',
      custom_data: {
        something: 'else',
      },
      permissions: {
        methods: {},
      },
    });

    await adminClient.exchange.security.addGroup({
      name: 'TESTGROUP_LIST4',
      custom_data: {
        something: 'else',
      },
      permissions: {
        methods: {},
      },
    });

    let groupsFiltered = await adminClient.exchange.security.listGroups('TESTGROUP_LIST*', {
      criteria: {
        'custom_data.something': { $eq: 'useful' },
      },
    });

    let groupsUnFiltered = await adminClient.exchange.security.listGroups('TESTGROUP_LIST*');

    test.expect(groupsUnFiltered.length).to.be(4);
    test.expect(groupsFiltered.length).to.be(2);
  });

  it('should get groups matching special criteria with limit, skip and count', async () => {
    await adminClient.exchange.security.addGroup({
      name: 'TESTGROUP_SEARCH1',
      custom_data: {
        cadre: 0,
      },
      permissions: {
        methods: {},
      },
    });

    await adminClient.exchange.security.addGroup({
      name: 'TESTGROUP_SEARCH2',
      custom_data: {
        cadre: 0,
      },
      permissions: {
        methods: {},
      },
    });

    await adminClient.exchange.security.addGroup({
      name: 'TESTGROUP_SEARCH3',
      custom_data: {
        cadre: 1,
      },
      permissions: {
        methods: {},
      },
    });

    await adminClient.exchange.security.addGroup({
      name: 'TESTGROUP_SEARCH4',
      custom_data: {
        cadre: 2,
      },
      permissions: {
        methods: {},
      },
    });

    let results1 = await adminClient.exchange.security.listGroups('TESTGROUP_SEARCH*', {
      criteria: {
        'custom_data.cadre': { $gt: 0 },
      },
      limit: 1,
    });

    let results2 = await adminClient.exchange.security.listGroups('TESTGROUP_SEARCH*', {
      criteria: {
        'custom_data.cadre': { $gt: 0 },
      },
      skip: 1,
    });

    let resultscontrol = await adminClient.exchange.security.listGroups('TESTGROUP_SEARCH*', {
      criteria: {
        'custom_data.cadre': { $gt: 0 },
      },
    });

    let results3 = await adminClient.exchange.security.listGroups('TESTGROUP_SEARCH*', {
      criteria: {
        'custom_data.cadre': { $gt: 0 },
      },
      count: true,
    });

    test.expect(results1.length).to.be(1);
    test.expect(results2.length).to.be(1);
    test.expect(resultscontrol.length).to.be(2);

    test.expect(results3.value).to.be(2);
  });

  it('should get users matching special criteria with limit, skip and count', async () => {
    await adminClient.exchange.security.addUser({
      username: 'TESTUSER_SEARCH1',
      password: 'TEST PWD',
      custom_data: {
        cadre: 0,
      },
    });

    await adminClient.exchange.security.addUser({
      username: 'TESTUSER_SEARCH2',
      password: 'TEST PWD',
      custom_data: {
        cadre: 0,
      },
    });

    await adminClient.exchange.security.addUser({
      username: 'TESTUSER_SEARCH3',
      password: 'TEST PWD',
      custom_data: {
        cadre: 1,
      },
    });

    await adminClient.exchange.security.addUser({
      username: 'TESTUSER_SEARCH4',
      password: 'TEST PWD',
      custom_data: {
        cadre: 2,
      },
    });

    let results1 = await adminClient.exchange.security.listUsers('TESTUSER_SEARCH*', {
      criteria: {
        'custom_data.cadre': { $gt: 0 },
      },
      limit: 1,
    });

    let results2 = await adminClient.exchange.security.listUsers('TESTUSER_SEARCH*', {
      criteria: {
        'custom_data.cadre': { $gt: 0 },
      },
      skip: 1,
    });

    let resultscontrol = await adminClient.exchange.security.listUsers('TESTUSER_SEARCH*', {
      criteria: {
        'custom_data.cadre': { $gt: 0 },
      },
    });

    let results3 = await adminClient.exchange.security.listUsers('TESTUSER_SEARCH*', {
      criteria: {
        'custom_data.cadre': { $gt: 0 },
      },
      count: true,
    });

    test.expect(results1.length).to.be(1);
    test.expect(results2.length).to.be(1);
    test.expect(resultscontrol.length).to.be(2);

    test.expect(results3.value).to.be(2);
  });

  it('Test ability to change password over the security exchange.', async () => {
    let testError;
    const testUser = {
      username: 'TESTUSER_SEARCH1@testing34.com',
      password: 'TEST PWD',
      custom_data: {
        cadre: 0,
      },
    };
    await adminClient.exchange.security.addUser(testUser);
    let testUserClient = new Mesh.MeshClient({ secure: true, port: 8003 });

    await testUserClient.login(testUser);
    // await testUserClient.exchange.security.updateOwnUser({ oldPassword: '123', ...testUser });
    await testUserClient.exchange.security.changePassword('TEST PWD', 'new');
    try {
      await testUserClient.exchange.security.changePassword('old', 'new');
    } catch (e) {
      testError = e.message;
    }
    test.expect(testError).to.eql('Invalid old password');
    await testUserClient.disconnect();
    testUser.password = 'new';
    await testUserClient.login(testUser);
  });
});
