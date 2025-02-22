
based on happner 1.28.1

1.0.0 2016-11-20
----------------
 - still have intermittent issue, being logged on e5 test
 - missing some happn functionality (incoming and outgoing plugins)
 - ready for testing on the brain

1.1.0 2016-11-21
----------------
 - happn layer middleware tested

1.2.0 2016-11-25
----------------

 - happn upgraded to 0.6.2
 - endpoint service
 - found race condition in f1 test

1.2.1 2016-11-27
----------------

 - connection attempts upped to 10 by default

1.2.2 2016-11-27
----------------

 - happn upgraded to 0.6.3

1.2.3 2016-11-27
----------------

 - happn upgraded to 0.6.5

1.2.4 2016-11-27
----------------

  - happn upgraded to 0.6.6

1.2.5 2016-11-27
----------------

  - happn upgraded to 0.6.7


1.2.6 2016-12-02
----------------

  - happn upgraded to 0.7.0
  - fix to browser client

1.3.0 2016-12-03
----------------
 - happn upgraded to 0.8.0

1.4.0 2016-12-06
----------------
 - happn upgraded to 0.9.0

1.4.1 2016-12-12
----------------
 - happn upgraded to 0.9.1
 - upgraded migration plan
 - fixed docs

1.5.0 2016-12-13
----------------
 - happner 1 compatability
 - updated package.json

1.6.0 2016-12-13
----------------
 - upgraded to happn 1.0.0
 - fixed HappnClient living in global scope

1.6.1 2016-12-13
----------------
 - upgraded to happn 1.0.2

1.6.2 2016-12-15
----------------
 - upgraded to happn 1.0.4

1.7.0 2016-12-21
----------------
 - upgraded to happn 1.1.0, happn protocol 1.2.0
 - REST fixes, empty body parameters


1.7.1 2016-12-22
----------------
 - upgraded to happn 1.1.1, happn protocol 1.2.0
 - mesh client disconnect

1.7.2 2017-01-12
----------------
 - fixed $happn.info.happn.address property

1.7.3 2012-01-13
----------------
 - removed benchmarket

2.0.0 2017-01-18
----------------
 - updated web routes, removed static and refactored
 - add root web routes for serving /

2.1.0 2017-01-20
----------------
 - security patch
 - happn-3 version 1.2.1

2.2.0 2017-01-25
----------------
 - added config.domain

2.2.1 2017-01-26
----------------
 - updated to have the directResponses config option
 - removed superfuous functions that crept in on release 2.1.2

2.2.2 2017-01-30
----------------
  - added description.component.version

2.3.0 2017-02-06
----------------
  - added meta.componentVersion to $happn.emit()

2.4.0 2017-02-15
----------------
  - updated happn-3 version

2.5.0 2017-03-03
----------------
  - added externally assignable datalayer for happnercluster
  - added plugin-able functions to externally adjust _mesh just before clients start using it
  - exposed modules package.json at elements.name.module.package
  - added $happn.exchage.componentName.__version
  - added cluster awareness for componentInstance reply to set at message.callbackPeer
  - expanded plugins to have start and stop methods
  - serve happner-client
  - cached packager's /api/client script in production mode
  - integrate new happn browserClient packeger

2.5.1 2017-03-09
----------------
  - upgraded happn-3 to v 1.7.2

2.5.2 2017-03-10
----------------
  - upgraded happn-3 to v 1.7.4

2.5.4 2017-03-13
----------------
  - fix insecure endpoints not resuming after reconnect

2.5.5 2017-03-15
----------------
  - bump happner-client version

2.6.0 2017-03-19
----------------

  - added localEvent api
  - duplicated exchange into each component so that cluster can overwrite dependency into one component's exchange without overwriting all

2.6.1 2017-03-20
----------------
  - removed convenience $happn.localEmit() - it may be used for other purposes

2.6.2 2017-03-21
----------------
  - onward release of happner-client

2.6.3 2017-03-21
----------------
  - updated happn-3

2.6.4 2017-03-21
----------------
  - onward release of happner-client

2.7.0 2017-03-22
----------------
  - happn v1.8.0 update
  - updated happn layer to use preconfigured buckets
  - the new _optimised bucket

2.7.1 2017-03-23
----------------
  - happn v 1.8.1
  - additional buckets happn.js

2.7.2 2017-03-24
----------------
  - happn v 1.8.2

2.7.3 2017-03-24
----------------
  - happner-client v 1.2.0

2.7.4 2017-03-27
----------------
  - happn v 1.8.3

2.7.5 2017-03-28
----------------
  - happn v 1.8.5
  - fixed $happn.exchange missing endpoints

2.7.6 2017-03-29
----------------
  - fix __getWebOrigin

2.7.8 2017-03-29
-----------------
  - happn v 1.8.7

2.8.0 2017-03-31
-----------------
  - happn v 1.9.0 (account lockout)

2.9.0 2017-04-03
-----------------
  - happn v 1.10.1 (client revoke session, service manager fix)

2.10.0 2017-04-05
-----------------
  - added $happn.emitLocal() to no emit events into cluster

2.10.1 2017-04-07
-----------------
  - update happner-client

2.11.0 2017-04-11
-----------------
  - fixed db compaction
  - fixed long-running tests
  - upgraded happn to 1.11.0

2.11.1 2017-04-18
-----------------
  - onward release of happn-3

2.11.2 2017-04-18
-----------------
  - onward release of happner-client

2.11.3 2017-04-19
-----------------
  - issue-43 - Fix rest for mesh with domain

2.12.0 2017-04-20
-----------------
  - login with tokens

2.12.1 2017-04-21
-----------------
  - bumped happn-3 to 1.12.1

2.13.0 2017-04-26
-----------------
  - reincorporated happner-1 updates
  - fixed persit and mem datastores

3.0.0 2017-05-20
----------------
  - defer happn listen to final step in mesh start, after components are started, this means that `mesh.start()` MUST BE CALLED after `mesh.initialize()`, `Happner.create()` still does both.
  - added config.listenFirst to disable this behaviour.

3.0.1 2017-05-30
----------------
  - update happn-3 to version 1.12.2

3.1.0 2017-06-08
----------------
  - update happn-3 to version 1.13.0
  - update happner to version 2.1.0 and up
    - password-hash-update
  - updated travis for node 8

3.1.1 2017-06-15
----------------
  - updated happn 1.13.1 (protocol 1.1.0 fix)

3.1.2 2017-06-15
----------------
  - updated happn 1.13.2 (protocol general fix)

4.0.0 2017-07-27
----------------
  - updated happn to 2.0.1

4.0.1 2017-07-29
----------------
  - issue with release 4.0.0

5.0.0 2017-07-31
----------------
  - happn-3 upgraded to v 3.0.0

5.1.0 2017-08-19
----------------
  - allowed for the pulling of the $origin from an authorization header
  - fixed non-dry code for getting the session from the req object, now happens only in one place

5.1.1 2017-08-19
----------------
  - fix to the _registerSchema function, have try/catch and deepcopy of the filtered config

5.2.0 2017-08-29
----------------
  - improved repl

6.0.0 2017-10-27
----------------
  - large test refactor
  - happn-3 v5 dependancy updated
  - breaking: off and offPath changes, due to happn-3 v5 release

6.0.1 2018-01-27
----------------
  - update happner-client

6.0.2 2018-01-27
----------------
  - update happn-3

6.1.0 2018-02-06
----------------
  - integrated happn stats into existing happner stats
  - deprecated system.activateStatistics & deactivateStatistics (always on)

6.1.1 2018-02-26
----------------
  - happn: fixed 401 issue with auth invalid credentials failure

7.0.0 2018-04-12
----------------
  - happn: upgraded to 6.0.0, security changes
  - fix #303 - make shared datalayer respect the noPublish set option

7.1.0 2018-04-13
----------------
  - happn: upgraded to 6.1.0
  - happn: merge only subscriptions
  - REST component correct 401 error
  - init and start methods

7.1.1 2018-04-18
----------------
  - happn: upgraded to 6.2.0
  - admin password now saves ok
  - happner-client: upgraded to 4.0.0

7.1.2 2018-04-20
----------------
  - happn: upgraded to 6.2.1

7.1.3 2018-04-24
----------------
 - happn: upgraded to 6.2.2

7.1.4 2018-04-25
----------------
 - generated package-lock

7.2.0 2018-04-26
----------------
  - happn: upgraded to 6.3.0
  - feature: listUsers now optimised and filterable at the db via criteria

7.2.1 2018-05-01
----------------
  - happn: upgraded to 6.3.1

7.2.2 2018-05-08
----------------
  - happn: upgraded to 6.3.2

8.0.0 2018-05-15
----------------
  - happn: upgraded to 7.1.0
      - allowed set and on paths are more permissive with regards to special characters '(' ')' '&'
      - set paths are not allowed to contain the * character
      - server side path checking on set
      - increment functionality
      - login returns a session user sans the groups, smaller payload
  - getUser now has {includeGroups: false} functionality
  - $happn.data.increment functionality

8.0.1 2018-05-19
----------------
  - component-instance secureData checks for happn client connectivity, raises proper error if disconnected
  - happn: upgraded to 7.1.2
    - set/on paths more permissive, : % also allowed now

8.0.2 2018-05-20
----------------
  - component-instance - fixed issue with defaults and no connection

8.0.3 2018-05-25
----------------
  - upgraded happner-client v5.0.0

8.0.4 2018-05-26
----------------
  - upgraded happn 7.1.3
  - happn dependency now ^

8.0.5 2018-05-29
----------------
  - happner-client dependency now ^

8.1.0 2018-06-07
----------------
  - increment functionality
  - application_data, sacred field for users

8.2.0 2018-06-08
----------------
  - data permissions

8.2.1 2018-06-15
----------------
  - bugfix: stats emit

8.3.0 2018-08-24
----------------
  - feature: security.listUsersByGroup, security.listUserNamesByGroup

8.3.1 2018-09-04
----------------
  - update: all system components that have initialize code moved to initMethod
  - update: mesh happn server is stopped on mesh start failure when the happn server has been started but a subsequent call has failed

9.0.0 2018-09-12
----------------
  - update of happn-3 to version 8.0.0

9.0.1 2018-09-12
----------------
  - dependency of happner-client updated

9.0.2 2018-09-15
----------------
  - happn-3 fix to disconnect issue with protocol 2 client to protocol 3 server

9.0.3 2018-10-28
----------------
  - happn-3 release 8.0.3

9.1.0 2018-11-06
----------------
  - happn-3 release 8.1.1

9.2.0 2018-11-06
----------------
  - happn-3 release 8.2.1

9.2.1 2018-11-17
----------------
  - happner-client release 6.2.0

9.2.2 2018-12-02
----------------
  - fix: packager file watcher now releases process
  - test: integration/startup/startup-proxy uses kill-tree to remove test processes

9.2.3 2018-12-07
----------------
  - fix #159 - allow unknown cli options to be passed through
  - fix #160 - disable terminal from being started in bin file

9.3.0 2019-01-02
----------------
  - onward release of happn-3@8.2.7
  - fix #170

9.3.1 2019-02-13
----------------
  - fix: silent ignore exchange response reconnections

9.3.2 2019-03-01
----------------
  - ensure bluebird declaration on modules where promisify is being used

10.0.0 2019-03-11
----------------
  - fix: removed happn client disconnect on server stop

10.0.1 2019-03-14
----------------
  - latest version of happn-3 9.0.0
  - issue #191 performance enhancements

10.0.2 2019-03-19
----------------
  - latest version of happn-3 9.0.1

10.0.3 2019-04-17
----------------
  - latest version of happn-3 9.0.4

10.0.4 2019-05-07
-----------------
  - update to lodash@^4.17.11 to improve deduping

10.1.0 2019-07-04
-----------------
  - authority delegation

10.1.1 2019-07-09
-----------------
  - fix: happn-3 401 returned by missing token
  - fix: authority delegation for convenience methods on component data

10.2.0 2019-07-26
-----------------
  - feature: ability to update a mesh element (component)
  - fix: reconnect backoff now configurable

10.2.1 2019-08-02
-----------------
  - Update to latest Happn-3, Async, uglify, Bluebird and Request to make image size smaller.

10.2.2 2019-08-08
-----------------
  - Security: tightened up the updateOwnUser security method
  - happn-3 dependency bump

10.2.3 2019-08-13
-----------------
  - Fix: better logging on inbound and outbound layer failures

10.3.0 2019-08-20
-----------------
  - Fix #206: Add count to data providers

10.4.0 2019-09-04
-----------------
  - Fix #212: Add route info to 'req' for middleware on component to use if request is directed to root web route

10.4.1 2019-09-12
-----------------
  - component instance tweaks for cluster brokering
  - cleanup of mesh.js, removed unused dependencies

10.5.0 2019-10-03
-----------------
  - security component listUsers and listGroups with criteria
  - security component listUsers and listGroups with count, skip and limit
  - mongo plugin aggregate, collation and count
  - fix: uglify-es in packager

10.5.1 2019-10-22
-----------------
  - prettier update with lint

11.0.0 2019-11-28
-----------------
  - happn-3 upgrade 11.0.0: session events, token revocation
  - fix: issue with shared internals _this in _getSubscriber

11.0.1 2019-12-03
-----------------
  - fix: component stop called twice on SIGINT, issue #221
  - fix: graceful disconnect when client initialized using constructor only
  - lint: removed console.log warnings, from tests and production code where necessary

11.0.2 2019-12-13
-----------------
  - feature: utilities can now get function parameters for async functions #231

11.0.3 2020-01-20
-----------------
  - fix: users and groups error handling for undefined users and groups

11.1.0 2020-02-04
-----------------
  - feature: global middleware configuration
  - fix: proper clearing of waiting timeouts in messenger when connection is closed

11.2.0 2020-02-24
-----------------
  - feature: happn-3 bump to 11.2.0 allows for unconfigured socket removal by configuration
  - test: stress test code, for checking client reconnection process

11.2.1 2020-03-02
-----------------
  - fix #250: _MESH_ADM and _MESH_GST groups not added if they exist on startup

11.2.2 2020-03-03
-----------------
  - fix of fix #250: __systemGroups is populated in security module if groups have been found

11.2.3 2020-03-16
-----------------
  - happn-3 11.2.4 - prioritization of data providers by length of filter pattern desc
  - fix: happner-cluster issue #186 - allow for default version injection

11.2.4 2020-04-01
-----------------
  - happn-3 11.3.0 - publish feature on client, issue #265
  - publish in messenger and component-instance reduces 'echo' traffic of set
  - compression and publish integration test

11.2.5 2020-04-08
-----------------
  - fix #267 - fix function parser to support class methods

11.2.6 2020-04-08
-----------------
  - fix #269 - fix ES6 syntax for IE11 compatibility
  
11.2.7 2020-04-08
-----------------
  - fix  #267 - further adjustments to make classes consumable by the exchange
  - fix  #373 - IE11 browser support

11.2.8 2020-04-14
-----------------
  - fix  #273 - add try catch for parsing module function definitions

11.2.9 2020-04-23
-----------------
  - test: fixed stats tests, happn no longer logs stats by default
  - Fix #275 - Pass useCookie to happn client.
  - Fix #262 - Pass socket options to happn client.

11.2.10 2020-04-29
-----------------
  - Fix #280
  - bumped async v3.2, fixes for breaking whilst
  - bumped happner-client and happn-3 versions, for async ^3.2 dedup

11.2.11 2020-04-29
-----------------
  - feature: happn enriched session lifecycle events 
  - debug: added warning if an async method over the exchange is a promise but also passed a callback

11.2.12 2020-05-27
-----------------
  - dependency - bumped happn-3 version 11.4.2

11.2.13 2020-06-05
-----------------
  - dependency - bumped happn-3 version 11.5.1, permissions-tree and regex caching
  - dependency - bumped happner-client version 11.0.2

11.2.14 2020-06-19
-----------------
  - dependency - bumped happn-3 version 11.5.2

11.2.15 2020-06-22
-----------------
  - fix: component events now honour promises, and assume promises when no callback is specified

11.2.16 2020-06-27
-----------------
  - dep: removed browserified bluebird from packager

11.3.0 2020-07-30
-----------------
  feature: disable/enable mesh schema change events - JIRA: SMC-617
  
11.4.0 2020-08-11
-----------------
  - Fix #296 - make request info available to method being called over REST

11.4.1 2020-08-24
-----------------
  - Fix #299 - expected falsy rest parameter get converted to null by rest request handler

11.4.2 2020-09-01
-----------------
  fix: connection-ended event in messenger removes handler from handler collection - JIRA: SMC-848
  test fix: deprecation warning removed on db compaction test for node v14 - JIRA: SMC-817

11.4.3 2020-09-10
-----------------
  patch: allow for brokered flag in description - passed in from happner-cluster - JIRA: SMC-989

11.4.4 2020-09-17
-----------------
  patch: mesh description is updated in the rest component when an element is updated in the mesh - JIRA:SMC-1026 happner-cluster #199

11.4.5 2020-10-03
-----------------
  patch: SMC-1178 - peer disconnection before peerReply causes FATAL

11.4.6 2020-10-03
-----------------
  happn-3: selective security cache clearing and concurrency 1 queue on dataChanged event - SMC-1189

11.4.7 2020-11-20
-----------------
  - happn-3: feature: SMC-1269 - logging a JSON object on socket error
  - happn-3: feature: SMC-1321 - only print error message for fail to decode JSON socket error, also just warning

11.4.8 2020-11-23
-----------------
  - SMC-1482 - fix: redirected logs not in correct format

11.5.0 2021-01-20
-----------------
  - SMC-917: modified mesh components to defer ther startup method execut… …
  - SMC-917: modified mesh deferred execution of component startup method… …
  - SMC-917: added init on component injection, add defer start method ba… …
  - SMC-917 - stop should clear timeouts on waiting for component start 
  - smc-917 - prerelease publish
  - SMC-917: Will detect component dependency satisfaction changes for in… …
  - SMC-917 removed lint created spaces between 'function' and parenthesis
  - SMC-917: Added unit tests covering SMC-917 changes to ./lib/mesh
  - SMC-917: Checken module.package for dependencies/brokered deps. Fixed… …
  - SMC-917: Added _mesh.ignoreDependenciesOnStartup flag. Currently defa… …
  - SMC-917: Upped pre-release version
  - SMC-917: Chore: lint-fix
  - SM7-917 Code review changes (minor)

11.6.0 2021-02-05
-----------------
  - SMC-1645: merged testing branch - minor refactor of rest component
  - SMC-1645: Merge branch 'testing' of https://github.com/happner/happner-2 into feature/1645
  - SMC-1645: added __version to events layer, additional tests
  - SMC-1645: functionality and basic browser and server-side client tests
  - SMC-1645: updated releases, docs and package
  - SMC-1645: refactor removed strange branch logic event and exchange layer

11.6.1 2021-03-01
-----------------
SMC-1645: added first callback test
SMC-1645: updated the internals to allow for callbacks on $ api
SMC-1645: fixed and tested callback on unknown method, tested unknown method error on async
SMC-1645: made error messages more consistent, encapsulating mesh.component.method in []'

11.6.2 2021-03-01
-----------------
- SMC-2013: move sinon to devdeps

11.7.0 2021-03-30
------------------
- SMC-1808: user permissions

11.7.1 2021-04-16
------------------
- SMC-1807: light happner client support
- SMC-1807: updated travis - removed Node 10 support, added node 16 support
- SMC-1807: added shared happner-semver module

11.7.2 2021-05-24
------------------
- SMC-1807: updated happner-client dependency

11.7.3 2021-05-31
------------------
- SMC-1597: correctly parse single-parameter arrow functions with no parentheses

11.7.4 2021-06-02
------------------
- SMC-1597: fix $happn etc. parameter string matching for arrow functions

11.7.5 2021-06-02
------------------
- SMC-1597: fix parameter string matching for arrow functions with parentheses in body not signature

11.8.0 2021-06-04
------------------
- SMC-2835: updateOwnUser can be configured to not change custom_data

11.9.0 2021-07-09
------------------
- SMC-3030: add ability to parse bound class methods via prototype

11.10.0 2021-07-20
------------------
- SMC-1810: nested paths in get and on

11.11.0 2021-07-20
------------------
- SMC-3512: fixed happn inbound and outbound layers to fail without "Callback already called" error
- SMC-3460: added support for anonymous user
- SMC-3646: added github actions
- SMC-2717: cookie lifecycle events

11.11.1 2021-8-23
------------------
- SMC-3807: happn anonymous user permissions

11.11.2 2021-08-27
------------------
- SMC-3242: fixed onBehalfOf and nested permissions issue

11.11.3 2021-09-09
------------------
- fix: SMC-4044 - cookie events not dependent on client login

11.12.0 2021-09-11
------------------
- fix: SMC-4044 - happner-client upgrade to 11.5.0

11.12.1 2021-09-20
------------------
- fix: SMC-4161 - happn-3 upgrade 11.13.4

11.12.2 2021-09-28
-----------------
  - happn-3 upgrades:
  - fix: SMC-4209 - concurrency issue, user created logged on deleted, causes security directory update to fatal
  - fix: SMC-4208 - merge insert now uses upsert, moved constants out of data service

11.12.3 2021-10-15
-----------------
  - fix: SMC-3661 - removal of try catch callback anti-pattern
  - fix: SMC-4349 - happner-client update, inter-mesh $on fails due to argument mismatch
  - fix: SMC-4388 - updated mongo data provider, removed main from package.json
  - test: SMC-4393 - test intercomponent $on and $call

11.12.4 2021-11-11
-----------------
  - fix: SMC-4512 - happn-3 upgrade, db error causes fatal

11.12.5 2021-11-12
-----------------
  - fix: SMC-4585 - setImmediate in browser client

11.13.0 2021-11-24
-----------------
  - feature: SMC-2954 - Allows for configuration and use of multiple authentication providers.
  - fix: SMC-4386 -  upsertMultiplePermissions will now allow for removing permissions/prohibitions as well as upserting permissions or prohibitions

11.13.1 2021-11-24
-----------------
  - updated happner-client dependency

11.14.0 2021-11-29
-----------------
  - SMC-734: removed bitcore-lib and encrypted payloads

11.14.1 2021-12-04
-----------------
  - SMC-4466: update of happner-client

11.14.2 2021-12-05
-----------------
  - SMC-4749: logging of rest/rpc request failure

11.14.3 2021-12-06
-----------------
  - SMC-4749: logging of rest/rpc request failure - mounting methods

11.14.4 2021-12-07
-----------------
  - SMC-4749: logging of rest/rpc request failure - parses description on start method in rest component

11.14.5 2021-12-07
-----------------
  - SMC-4749: refactor of rest component method, upped coverage

11.14.6 2021-12-10
-----------------
  - SMC-4827: component instance does not inject cbproxy into async methods

11.14.7 2021-12-14
-----------------
  - SMC-4848: fixed promisify to not modify incoming null arguments

11.15.0 2022-01-04
-----------------
  - SMC-4550: lookup tables for permissions

11.15.1 2022-01-10
-----------------
  - SMC-4938: lookup tables fail for rest request

11.15.2 2022-01-10
-----------------
  - SMC-4550: happner-client update

11.16.0 2022-01-16
-----------------
  - SMC-4933: $happn.isAuthorized(user)

11.16.1 2022-01-19
-----------------
  - SMC-4550: Fix -correctly calling securityDirectoryChanged on permission removal and group/permission table unlinking - happn-3

11.17.0 2022-01-25
-----------------
  - SMC-4550: added array functionality to templated permissions, lookup tables tests demonstrating methods and component events, sugar for adding lookup table permissions for components and events.

11.17.1 2022-02-01
-----------------
  - SMC-4550: happn-3 upgrade: unified templated path combinations logic

12.0.0 2022-03-01
-----------------
  - SMC-4198: monorepo upgrade

12.0.1 2022-03-01
-----------------
  - SMC-4198: made smaller dependencies major bumps

12.0.2 2022-03-08
-----------------
  - SMC-4198: git and npm ignore updates

12.0.3 2022-03-08
-----------------
   - SMC-4198: fixed bad dataroute config to emit a proper error message

12.0.4 2022-03-08
-----------------
  - SMC-4198: updated dependencies
  - SMC-4198: fixed datastores configuration and logging in happn configuration

12.0.5 2022-03-15
-----------------
  - TEN-34: fixed no arguments passed by client

12.0.6 2022-03-29
-----------------
  - TEN-92, TEN-93: logging levels and events
  - TEN-102: loki snapshot  file redundancy
  - TEN-92: made all dependencies test dependencies

12.0.7 2022-04-06
-----------------
  - TEN-103: set default timeout on component loading wait warning to 30secs
  - TEN-104: errors are only logged on system failures

12.1.0 2022-04-08
-----------------
  - TEN-95: $call discovers components and methods in cluster

12.1.1 2022-04-12
-----------------
  - TEN-60: Wildcard-brokering
  - TEN-42: Rest-discovery

12.1.2 2022-05-04
-----------------
  - TEN-112: happn-3: group with permissions that have dots in them causes compaction failure

12.1.3 2022-05-06
-----------------
  - TEN-114: happn-3: enforce admin group save on startup

12.1.4 2022-05-09
-----------------
  - TEN-114: happner-2: enforce MESH_GST, MESH_ADMIN upsert on startup

12.1.5 2022-05-26
-----------------
  - updates to commons libs, lint fixes, due to:
  - TEN-49: add diagnostics log to caching service, refactored happn-3 caching layer
  - TEN-54: all systems tested on node v18

12.1.6 2022-06-02
-----------------
  - TEN-49: fixed persisted cache and loki provider issues, caused by revoked tokens

12.1.7 2022-06-09
-----------------
  - TEN-31: further logging restrictions (info -> debug) and clustering allowances (debug -> info)

12.1.8 2022-06-28
-----------------
  - TEN-123: fix to getaddress - issue with bad breaking release in node 18.4

12.1.9 2022-07-14
-----------------
  - TEN-125: body-parser v1.20.0 causes memory leak

12.2.0 2022-08-07
-----------------
  - TEN-31: onbehalf of / as

12.2.1 2022-09-08
-----------------
  - TEN-130: fixes to component instance and mesh defer

12.2.2 2022-10-22
-----------------
  - TEN-65, TEN-126: happn-3 updates

12.3.0 2022-10-03
-----------------
  - TEN-132: cache key regex masking
  - TEN-138: api/client call fails when auth delegation switched on

12.4.0 2022-10-12
-----------------
  - TEN-143: ws and primus update in happn-primus-wrapper
  - TEN-101: removed elasticsearch support

12.5.0 2022-10-29
-----------------
  - TEN-146: preserve criteria on remove

12.5.1 2022-11-05
-----------------
  - TEN-135: mongo search does not sort by path

12.5.2 2022-11-24
-----------------
  - TEN-4: productionize summon (authType saved to user)
  - TEN-140: outdated pem module
  - TEN-148: document post array rest module

12.5.3 2022-11-26
-----------------
  - feat: Sqlite DB provider

12.5.4  2022-12-22
-----------------
  - feat: loki provider disaster recovery enhancements

12.5.5 2023-01-11
-----------------
  - feat: loki archiving and plugins tests

12.6.0 2023-01-18
-----------------
  - feat: Summon productionization

12.7.0 2023-02-17
-----------------
  - feat: allow "as" for rest call to exchange when using a params array
  - fix: prevent fatal when using "as" for a user that does not exist
  - feat: removed file watching in packager

12.8.0 2023-03-03
-----------------
  - feat: token revocation and logout
  - fix: token revocation cluster fix
  

12.8.1 2023-04-13
-----------------
- fix: rest payload stringify

12.9.0 2023-04-29
-----------------
  - feat: happn-3 changePassword in client
  - feat: happn-3 resetPassword supported by auth provider

13.0.0 2023-05-20
-----------------
  - feat: Happner-2 security change password
  - feat: Happner-2 security reset password as anonymouse
  - feat: deprecate updateOwnUser (breaking)
