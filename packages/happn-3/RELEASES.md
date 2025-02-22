0.0.1 2016-11-03
----------------

 - based on 2.15.4
 - alpha release

0.0.2 2016-11-04
----------------

 - passing publicKey back with login response on encrypted payloads

0.0.3 2016-11-07
----------------

 - security audits and modifiedBy

0.0.4 2016-11-15
----------------

 - modified login method to be simpler, check for secure - then set auth type to digest if no password


0.1.0 2016-11-15
----------------

 - have layered security more, not so many conditional statements, now have distinct login, and processLogin methods
 - fixed issue where onEvent in client was not pushing the actual event data, as the data was being pushed into the scope argument for a "call"
 - fixed bug in client, with incorrcetly spelled enum STATE.diconnected

0.2.0 2016-11-18
----------------

 - update to default policies, both now have no ttl
 - fix the session service disconnect to allow client reconnections (reconnect true if options.reconnect == null)

0.3.0 2016-11-21
----------------

 - inbound and outbound layer plugins

0.4.0 2016-11-21
----------------

 - services other than system services can now be loaded

0.4.2 2016-11-22
----------------

 - proper error returned when token from deleted user is used in an attempt to access a resource

0.4.3 2016-11-22
----------------

 - upgrade from node-uuid to uuid

0.5.0 2016-11-22
----------------

 - fix to pubsub, allow for noCluster option
 - added mergeObjects function to utils

0.6.0 2016-11-23
----------------

 - client connect timeout
 - made getConnection more logical
 - token login reuse

0.6.1 2016-11-25
----------------

 - fix to test c1
 - have correct management of connection timeout
 - upgrade to primus 6

0.6.2 2016-11-25
----------------

 - downgrade to primus 5.2.2 (support node 0.10)

0.6.3 2016-11-27
----------------

 - downgrade to primus 4.0.5 (last known good version)

0.6.5 2016-11-27
----------------

 - upgrade to primus 5.2.2 (didnt make a difference)

0.6.6 2016-11-27
----------------

 - update to __getConnection

0.6.7 2016-11-28
----------------

 - safeSession and updateSession returns null if session booted

0.7.0 2016-12-02
----------------

 - major updates to disconnect
 - fix to browser (Primus now attached to window)
 - happner-mocha-serial tests

0.7.1 2016-12-02
----------------

 - disabled benchmarket on all tests except benchmarket

0.8.0 2016-12-03
----------------

 - changed config on client to not have config.config
 - changed client.options.config to just client.options

0.9.0 2016-12-06
----------------

 - server shutdown, if connections are destroyed by primus, destroy not called in transport.stop
 - made call timeout configurable in client, defaults to 30 seconds

0.9.1 2016-12-12
----------------

 - updated README
 - added migration plan

1.0.0 2016-12-13
----------------

 - protocol update!: error in message now has separate name and message, ie: {error:{name:'AccessDenied', message:'unauthorised'}} previous {error:{name:'AccessDenied: unauthorised'}}
 - updated __createResponse to include the message of the error (was previously looping through the properties - 'message' was non-iterable)

1.0.1 2016-12-13
----------------

 - fixed issue where outbound responses where not going through layers if custom outbound layers configured

1.0.2 2016-12-13
----------------

 - fixed persisted cache does not set __sync flag, when db is empty

1.0.3 2016-12-15
----------------

 - fixed outbound system messages to include logging and custom outbound layers
 - fixed issue with tags working regardless of whether the data to tag exists or not

1.0.4 2016-12-15
----------------

 - allow for event_type * as well as 'all' in client 'on' option

1.1.0 2016-12-21
----------------

 - protocol version update 1.2.0
 - happn protocol 0.1.1 in place
 - default protocol is 1.1.0 (oldest)

1.1.1 2016-12-22
----------------

 - error serialization enhancement

1.2.1 2017-01-21
----------------

 - targetClients enhancement
 - removed benchmarket
 - fixed bug with subscribe on keys without preceding '/'
 - client disconnect improvements and test

1.3.0 2017-02-08
------------------
 - added support for passing custom _meta into `set()` options

1.4.0 2017-02-08
----------------
  - dataprovider functionality
  - updates to tests

1.4.1 2017-02-08
----------------
  - fixed issue where the options where getting attached to request options in dataprovider
  - updates to tests

1.4.2 2017-02-21
----------------
  - refactored this.STATE to this.state in client

1.5.0 2017-02-27
----------------
  - publisher/subscription services
  - consistency ACKNOWLEDGED/TRANSACTIONAL/DEFERRED

1.6.0 2017-03-02
----------------
  - packager, with browser client caching
  - added homedir and fs-extra dependancies
  - updates to utilities

1.6.2 2017-03-07
----------------
  - client.disconnect() supports server offline

1.7.0 2017-03-08
----------------
  - forked primus

1.7.1 2017-03-09
----------------
  - bucket optimisations, trie segmentation

1.7.2 2017-03-09
----------------
  - happn-tcp-port-used

1.7.4 2017-03-10
----------------
  - fixed bucket to use the wildcardMatch on subscriptions, updated f7 test

1.7.5 2017-03-13
----------------
  - fixed collisions on multiple servers in same process deleting the cached-to-disk browserclient

1.7.6 2017-03-20
----------------
  - updated forked primus to only dodge missing options on destroy if configured to do so

1.7.7 2017-03-21
----------------
  - forked primus closing process.env, switched to global

1.8.0 2017-03-21
----------------
  - strict bucket
  - redundant connections

1.8.1 2017-03-23
----------------
  - updated README (subscription service)
  - socketCleanup method on client
  - socket connect timeout is 30 seconds
  - socket pool reconnect interval
  - getBuckets optimisation, also bucket fix * = ALL

1.8.2 2017-03-23
----------------
  - socket pool reconnect delay, 0 by default
  - socket pool secure service tests

1.8.3 2017-03-27
----------------
  - moved transform and transformAll to dataProvider
  - updated documentation

1.8.4 2017-03-28
----------------
  - happn-util-crypto 0.2.2

1.8.5 2017-03-28
----------------
  - happn-util-crypto 0.2.3

1.8.6 2017-03-29
----------------
  - __ensureCryptoLibrary only happens if encryptPayloads || loginType === 'digest'

1.8.7 2017-03-30
----------------
  - removed var Primus from lib/client because Primus is in window in browser client

1.9.0 2017-03-31
----------------
  - account lockout

1.10.0 2017-04-01
----------------
  - revoke session
  - revoke-session backward compatible with happn 2 clients

1.10.1 2017-04-04
-----------------
  - fixed issue with services, where initializeServices was a global variable

1.11.0 2017-04-11
-----------------
  - updated with happn-2 changes

1.11.1 2017-04-14
-----------------
  - fix: event subscriptions don't resume with subscriptionId causing server-side .subscriptionData to be empty
  - fix: resumed event subscriptions no longer contain meta
  - fix: .off(listenerIdNumber) failing for explicit (no wildcard) paths

1.12.0 2017-04-18
-----------------
  - fix: options passed into the client with a null or empty options, but a connection default to 127.0.0.1:55000
  - enhancement: login with a token is now possible
  - test: default profiles, client options, login using tokens

1.12.1 2017-04-21
-----------------
  - fix: issue #49 strict bucket events dont work

1.12.2 2017-05-30
-----------------
  - update to forked sillyname (removed objectionable words)

1.13.0 2017-06-08
-----------------
  - updated password-salt-and-hash to happn-password-salt-and-hash
  - updates to travis node 8
  - updates to .gitignore

1.13.1 2017-06-15
-----------------
  - fixed issue with protocol 1.1.0, protocol field missing

1.13.2 2017-06-15
-----------------
  - fixed issue with protocols, protocol field "harded coded in emit and response on all plugins"

1.13.3 2017-06-19
-----------------
  - updated g6 test, timeout

1.13.4 2017-07-07
-----------------
  - updated parseFields in dataprovider to not append data.data

2.0.1 2017-07-18
-----------------
  - fixed delegate.runCount issue
  - updated data.

2.1.0 2017-07-29
----------------
  - released changes _data.

3.0.0 2017-07-30
----------------
  - updated wildcard, fixed bug where db path was stripping / unintentionally
  - wildcard fix may break existing systems that are inadvertantly making use of the bugs permissiveness

3.1.0 2017-07-18
----------------
  - Bearer token authorization header
  - moved getting session from req to security service
  - added happn_session property to req, for repeated calls of the sessionFromRequest method in one request

4.0.0 2017-10-08
----------------
  - breaking changes, protocol 2.0.0:
    - server
      - set requests can not contain *'s
    - doing away with integer listener ids
    - off cannot take a string now, it is the reference not the path
    - offPath takes in the path
  - no more buckets, wild-pare integrated

5.0.0 2017-11-24
----------------
  - backward compatible protocol 1 & 2
  - memory leak fixes in protocol service and checkpoint

5.0.1 2017-11-24
----------------
  - uses less memory for subscriptions, not storing the whole session
  - tested subscriptions leaks on session disconnect

5.1.0 2017-11-25
----------------
  - integrated happn-stats

5.1.2 2017-11-27
----------------
  - fixed use of undefined variable in property
  - added happn-stats and dependency
  - only test master and PR in travis

5.2.0 2018-02-05
----------------
  - expand stats to include queue messages/second (rate)

5.2.1 2018-02-26
----------------
  - fixed invalid credentials error code to 401

5.3.0 2018-03-13
----------------
  - all tests refactored
  - able to add custom data to groups, tested
  - fixed browser tests
  - fixed prepareOptions in client for redundant connections

6.0.0 2018-03-13
----------------
  - replicate security changes where happn-cluster is present
  - db is versioned, and can be upgraded
  - cookie token permissionSetKey removed
  - fixed group deleted but not unlinked properly
  - updated 401 return on http calls

6.1.0 2018-04-18
----------------
  - fixed 401 issue with auth invalid credentials failure
  - merge only subscriptions

6.2.0 2018-04-19
----------------
  - local admin login
  - tested _ADMIN password can be changed

6.2.1 2018-04-20
----------------
  - activate session management no longer calls dataChanged

6.3.0 2018-04-25
----------------
  - lisUsers optimised
  - listUsers criteria

6.3.1 2018-05-01
----------------
  - removed unnecessary bindings
  - removed unnecessary try catch blocks

6.3.2 2018-05-03
----------------
  - security caches refactor
  - security caches extended tests
  - lru cache now has getSync and setSync methods
  - lru cache now has values method
  - security users and groups refactor

7.0.0 2018-05-10
----------------
  - allowed set and on paths are more permissive with regards to special characters '(' ')' '&'
  - set paths are not allowed to contain the * character
  - server side path checking
  - increment set functionality and tests

7.1.0 2018-05-16
----------------
  - added the includeGroups:false functionality in getUser

7.1.1 2018-05-15
----------------
  - groups no longer in session passed back on login, smaller on the wire

7.1.2 2018-05-18
----------------
  - more permissive paths in set and on, now % : is also allowed

7.1.3 2018-05-26
----------------
  - handle_error now unit tested
  - handle_error now has fatal option, only puts client into ERROR state if fatal

7.1.4 2018-05-28
----------------
  - fixed intermittent issue with removal of decoupled session groups in security

7.2.0 2018-06-07
----------------
  - feature: templated permissions
  - fix: login lockout bug

7.2.1 2018-05-28
----------------
  - fix: error when login locks not explicitly enabled

7.2.2 2018-05-28
----------------
  - refactor: jshint integration
  - dep: package pem updated for new openssl libs

7.2.3 2018-08-23
----------------
  - refactor: client unit tests
  - jshint syntax fixes

7.3.0 2018-08-23
----------------
  - feature: getUsersByGroup

8.0.0 2018-09-10
----------------
  - fix: deleteUser removes tree first then user
  - change: removed wild-pare, and included tame-search, wildcards now dealt with differently
  - change: client now has state property holding all mutable state
  - change: client now uses status property to indicate connection state
  - change: happn-3 protocol now sends back a security-directory-changed system event
  - change: protocol now logs a verbose error on AccessDenied

8.0.1 2018-10-15
----------------
  - fix: disconnect issue with protocol 2 client and protocol 2 server

8.0.2 2018-10-20
----------------
  - fix: nedb provider now clones incoming data

8.1.0 2018-10-31
----------------
  - security patch: cookie client adds is now secure
  - security patch: hsts header when https mode
  - security enhancement: allow _ADMIN connections on intra-process only by configuration

8.1.1 2018-11-06
----------------
  - fix: scope issue with middleware
  - refactor: service.js cleaned up

8.1.2 2018-11-07
----------------
  - fix: issue with __transformResponse protocol happn_1, bad callback
  - fix: security, users that are substrings of other users get returned by getUser
  - test: updated travis.yml

8.1.3 2018-11-07
----------------
  - fix: protocol fail for encrypted payloads issue

8.2.0 2018-11-15
----------------
  - feature: variable depth subscriptions

8.2.1 2018-11-16
----------------
  - fix: overlapping variable depth subscriptions, different depths
  - doc: updated variable depth on readme

8.2.2 2019-01-02
----------------
  - fix #172: remove large unused 'trie-search' dep

8.2.3 2019-01-02
----------------
  - fix: happn_1.3.0 protocol backward compatibility

8.2.4 2019-01-02
----------------
  - fix: happn_1.3.0 protocol backward compatibility - outbound

8.2.5 2019-01-18
----------------
  - fix: listUserNamesByGroup does not work on mongodb (issue 180 workaround)

8.2.6 2019-01-24
----------------
  - issue #184 fix: cannot read status of null in .on response of client
  - lru cache issue

8.2.7 2019-02-01
----------------
  - client now disregards permission change errors when reattaching sessions
  - using dezalgo in more obvious security methods that early exit with callbacks

9.0.0 2019-03-01
----------------
  - performance optimizations for embedded version: issue #170

9.0.1 2019-03-17
----------------
  - session service configures session correctly for heartbeats

9.0.2 2019-03-24
----------------
  - latest primus-wrapper

9.0.3 2019-04-11
----------------
  - patch: regenerated browser_primus

9.0.4 2019-04-11
----------------
  - issue #181,#196,
  - happn-logger version 0.1.0
  - configurable iteration count pbkdf2

9.0.5 2019-05-22
----------------
  - fix: $regex filter

9.1.0 2019-05-24
----------------
  - feature: skip capability for client search/get
  - doc: updated README

9.1.1 2019-06-04
----------------
  - fix: parseFields issue with $or operator

10.0.0 2019-06-10
-----------------
  - authority delegation, onBehalfOf

10.0.1 2019-06-10
-----------------
  - cleanup: removed range code from client
  - doc: updated readme
  - dep: updated ws
  - dep: updated happn-stats

10.1.0 2019-07-08
-----------------
  - fix #209 - implement ability to respond with a HTML file for unauthorized/forbidden requests
  - fix #210 - respond with status code '401 Unauthorized' for invalid or missing token instead of '403 Forbidden'

10.1.1 2019-07-09
-----------------
  - fix: issue with client error and ws v7
  - fix: opts on convenience client methods for auth delegation

10.1.2 2019-07-30
-----------------
  - fix: 217 Update bluebird dependency

10.1.3 2019-07-30
-----------------
  - security update: include happn leaf in permission identity
  - fix: issue with client error and ws v7, handle old ws

10.2.0 2019-08-16
-----------------
  - Issue #222 - Add count capability to data provider

10.2.1 2019-08-23
-----------------
  - Issue: access denied security logs username and password via JSON.stringify

10.2.2 2019-08-28
-----------------
  - session logs browser primus writer
  - revokeSession revokes token, including across the cluster
  - reverted to v6.1 of ws - backward compatibility issue, ws 6.2+ checks sec header format causing failures of devices in the field

10.2.3 2019-09-12
-----------------
  - getOnBehalfOfSession now includes the delegate sessions happn property
  - sessionFromRequest includes happn property fetched from system service

10.3.0 2019-10-07
-----------------
  - prettier and eslint updates
  - using uglify-es for minify in packager
  - listUsers and listGroups now allow for mongo filters

10.4.0 2019-10-08
-----------------
  - listUsers and listGroups now allow for extended search options (sort, limit, skip, count)
  - updates to data provider to allow for aggregate, collation and count in mongodb

10.4.1 2019-10-14
-----------------
  - listUsers collation fix
  - mongodb listUsers and listGroups tests
  - fix: broken browser client, due to lint fix, undeclared _this
  - Object.assign polyfill (IE11 support)

10.4.2 2019-10-23
-----------------
  - lint prettier tests

10.4.3 2019-11-11
-----------------
  - cache fixes - clearTimeout on persisted cache
  - test: user deletion and recreation token reuse (test/integration/security/access_sanity)

11.0.0 2019-11-17
-----------------
  - feature: client session end events
  - chore: lint fixes
  - feature: happner-2 #158, configure usernames to be case-insensitive
  - test: happner-2 #179, client testing to ensure retries still happen after ENOTFOUND
  - dep: happner-2 #186, using version 1.0.0 of happn-util-crypto, latest bitcore
  - feature: happner-2 #188, happn client saved to .happner by packager
  - feature: security config setting: lockTokenToUserId: users now created with userid which is embedded in the token, which is checked against token logins and HTTP requests
  - fix: packager ensure .happner home directory
  - feature: sessionTokenSecret is retained between startups

11.0.1 2019-11-29
-----------------
  - fix: __cleanseRequestForLogs fails when message.request is undefined, happner-2 #226

11.1.0 2019-12-05
-----------------
  - feature: allow for volatile permissions via the persistPermissions security config setting, happn-3 #245

11.1.1 2020-01-13
-----------------
  - fix: client Socket is constructed with the pingTimeout option set to a default of 45e3, this is configurable

11.1.2 2020-01-17
-----------------
  - fix: upsertUser and upsertGroup and deleteUser and deleteGroup check for undefined or not object user or group
  - fix #254: include port number in listen error log msg

11.1.3 2020-01-26
-----------------
  - fix: client login failure (ECONNREFUSED) memory leak

11.1.4 2020-01-30
-----------------
  - fix: session-end on expired token after system time change
  - fix: double error is not emitted on connection failure when failure occurs in callback

11.2.0 2020-02-15
-----------------
  - feature: unconfigured session removal
  - fix: client reconnect strategy only for reconnections, not for initial connection timeouts

11.2.1 2020-02-26
-----------------
  - optimisation: setImmediate on incoming data from socket in session service

11.2.2 2020-03-05
-----------------
  - fix #274: Bring back IE11 compatibility.

11.2.3 2020-03-05
-----------------
  - fix: #272 - primus leaks on client __endSocket
  - fix: removed Promisify of handleMessage in session service

11.2.4 2020-03-16
-----------------
  - refactor: prioritization of data providers by length of filter pattern desc
  - fix: when using volatile permissions, system permissions starting with _ are retained in same datastore as groups
  - fix #283: client connection status is set to ACTIVE before authentication happens, added new status RECONNECT_ACTIVE

11.3.0 2020-03-30
-----------------
  - test: per message deflate compression configuration, issue #282
  - doc: per message deflate compression README update
  - fix: 403 returned on token ttl, issue #287
  - feature: leaner publish functionality on the client, issue #281
  - refactor: CONSTANTS being used for authorization failure messages

11.3.1 2020-04-20
-----------------
  - fixes #290 cookie name appended with _https if protocol is https
  - feature login with cookie fixes #297
  - possible breaking: stats now only being created if emit:true in config (no-one really uses the stats...)
  - fixes #292 - eat the rest of the post after sending an unauthorized/forbidden
  - fixes #295 - _ADMIN user locked out of web requests causes crash
  - feature: IP address whitelisting fixes #299

11.3.2 2020-04-20
-----------------
  - fix #303 - upgrade to async@3 throughout
  - fix: publication count functionality in client, adjusted backward compatibility tests for this

11.4.0 2020-04-29
-----------------
  - feature - new connect event #300
  - feature - connect, authentic, configure-session, disconnect events have more client data #300
  - fix: safeSessionData no longer includes token
  - protocol feature: client now sends happn version up with configure session
  - neatened up security directory changes event names into constants

11.4.1 2020-05-22
-----------------
  - feature: configurable http/s keepalive

11.4.2 2020-05-27
-----------------
  - fix: added eachSeries to subscription service securityDirectoryChanged 

11.5.0 2020-06-04
-----------------
  - fix #309: added slice to doHandover in client, as in place modification of the state.events causes follow on handlers to be missed
  - feature: explicit promisify on .on and onAll for client, allows for subscription promises to work
  - feature: once convenience method on client subscriptions

11.5.1 2020-06-12
-----------------
  - fixes #313 #314 - permissions tree and regex caching optimisations
  - wrapImmediate utility function and wrapImmediate of nedb provider functions

11.5.2 2020-06-18
-----------------
  - test: renamed _ security integration tests to use -
  - test: user deleted backward compatibility and integration tests
  - log: delete and add user or group info logs
  - fix #316: merge upsert mutates input data

11.5.3 2020-06-30
-----------------
  - refactor: removed bluebird dependency

11.5.4 2020-07-15
-----------------
  - optimisation: tame-search upgrade for faster unsubscribes

11.6.0 2020-08-13
-----------------
  - feature: default info level log in JSON format on session attach and detach - SMC-729
  - test: scripts for client connection leaks and infinite loop issue - SMC-731

11.7.0 2020-08-19
-----------------
  - feature: ability to switch off info level log in JSON format on session attach and detach - SMC-775
  
11.7.1 2020-09-21
----------------- 
  - bug: maybePromisify does not call resolve the promise if options and an undefined callback is passed - SMC-1108
  
11.7.2 2020-09-30
-----------------
  - patch: race condition on load permissionset - SMC-1028

11.7.3 2020-09-30
-----------------
  - patch: selective security cache clearing and concurrency 1 queue on dataChanged event - SMC-1189
  - feature: ability to switch off removal of subscriptions on security directory changed effected sessions
  - fix #180: path_only selects now work on mongo

11.8.0 2020-11-19
-----------------
  - feature: SMC-1269 - logging a JSON object on socket error
  - feature: SMC-1321 - only print error message for fail to decode JSON socket error, also just warning

11.8.1 2020-11-23
-----------------
  - SMC-1482 - fix: redirected logs not in correct format

11.9.0 2021-03-19
-----------------
  - [ERRONEOUS PUBLISH - on tag dep-updates]

11.10.0 2021-03-30
-----------------
  - feature: SMC-1808 - Add support for permissions on the happn user
  - feature: SMC-1897 - nedb data provider must sync db file after each persistent write

11.10.1 2021-04-15
-----------------
  - fix: SMC-1425 - maybePromisify and stale token, after server token change causing unhandled error

11.10.2 2021-04-21
-----------------
  - fix: SMC-2474 - client fixed to be backward compatible with <11.10.0 servers, which do not send back user with permissions on dataChanged

11.11.0 2021-07-14
-----------------
  - feature: SMC-1810 - added support for getting and listening on nested permissions.

11.12.0 2021-08-06
-----------------
  - feature: SMC-3460 - added support for anonymous user.
  - process: SMC-3646 - set up coveralls and github actions

11.12.1 2021-08-11
-----------------
  - bugfix: SMC-3682 - only add criteria to db query if passed in

11.12.2 2021-08-16
-----------------
  - optimisation: SMC-3720 - in Publication.prototype.publish, don't call async.eachLimit on empty array

11.13.0 2021-08-17
-----------------
  - feature: SMC-2717 - cookie lifecycle events

11.13.1 2021-08-23
-----------------
  - fix: SMC-3807 - adding multiple user permissions

11.13.2 2021-08-27
-----------------
  - fix: SMC-3242 - Will correctly listRelevantPermissions for onBehalfOf sessions


11.13.3 2021-09-08
-----------------
  - fix: SMC-4044 - cookie events not dependent on client login

11.13.4 2021-09-20
-----------------
  - fix: SMC-4161 - user permissions not cleaned up on user deletion

11.13.5 2021-09-27
-----------------
  - fix: SMC-4209 - concurrency issue, user created logged on deleted, causes security directory update to fatal
  - fix: SMC-4208 - merge insert now uses upsert, moved constants out of data service

11.13.6 2021-11-09
-----------------
  - fix: SMC-4512 -  data provider get action causes fatal when allowNestedPermissions switched on

11.14.0 2021-11-24
-----------------
  - feature: SMC-2954 - Allows for configuration and use of multiple authentication providers.

11.14.1 2021-11-24
-----------------
  - fix: SMC-4386 -  upsertMultiplePermissions will now allow for removing permissions/prohibitions as well as upserting permissions or prohibitions

11.14.2 2021-11-26
-----------------
  - fix: SMC-2716 -  fatal caused when message passed to processAuthorize (security service) has no message.request.path
  - fixed test was leaking clients

12.0.0 2021-11-26
-----------------
  - feature: SMC-734: Updated happn-util-crypto - removed bitcore, changes to crypto calls, removed payload encryption
  - maybe-breaking: SMC-734: removed encrypted payloads as it is not being used anywhere
  - lintignored session-management test, may be breaking eslint due to callback hell

12.0.1 2021-12-02
-----------------
  - SMC-4466: light client modifications - able to pass null options into create


12.1.0 2021-12-13
-----------------
  - SMC-4550: Feature - added lokup tables and permissions

12.1.1 2021-12-31
-----------------
  - SMC-4901: Fix - bad cookieName set on session

12.1.2 2022-01-07
-----------------
  - SMC-4938: Fix - lookup tables fail for rest request

13.0.0 2022-01-08
-----------------
  - SMC-4938: Fix - dont delete session.username
  - SMC-4550: Fix -correctly calling securityDirectoryChanged on permission removal and group/permission table unlinking
  - SMC-4550: Fixed array templated permission substitution
  - SMC-4550: subscriptions service does not pollute request with parsed path info
  - SMC-4550: unified tempated permission path combinatorial logic

13.0.1 2022-03-01
-----------------
  - SMC-4198: made all dependencies major bumps

13.0.2 2022-03-03
-----------------
  - SMC-4198: git and npm ignore updates

13.0.3 2022-03-04
-----------------
  - SMC-4198: fixed bad dataroute config to emit a proper error message

13.0.4 2022-03-08
-----------------
  - SMC-5125: Permissions-sets now accurately reflect templated paths

13.0.5 2022-03-29
-----------------
  - TEN-92, TEN-93: logging levels and events
  - TEN-102: loki snapshot  file redundancy

13.0.6 2022-04-06
-----------------
  - TEN-103: set default timeout on component loading wait warning to 30secs
  - TEN-104: errors are only logged on system failures

13.0.7 2022-05-04
-----------------
  - TEN-112: group with permissions that have dots in them causes compaction failure

13.0.8 2022-05-06
-----------------
  - TEN-114: enforce admin group save on startup

13.0.9 2022-05-09
-----------------
  - TEN-114: happner-2: enforce MESH_GST, MESH_ADMIN upsert on startup, ensures db dir

13.1.0 2022-05-26
-----------------
  - TEN-49: add diagnostics log to caching service, refactored happn-3 caching layer
  - TEN-54: all systems tested on node v18

13.1.1 2022-06-02
-----------------
  - TEN-49: fixed persisted cache and loki provider issues, caused by revoked tokens

13.1.2 2022-06-09
-----------------
  - TEN-31: further logging restrictions (info -> debug) and clustering allowances (debug -> info)

13.1.3 2022-06-28
-----------------
  - TEN-123: fix to getaddress - issue with bad breaking release in node 18.4

13.1.4 2022-07-14
-----------------
  - TEN-125: body-parser v1.20.0 causes memory leak

13.2.0 2022-07-07
-----------------
  - TEN-31: added userBelongsToGroups to security.users

13.2.1 2022-09-08
-----------------
  - TEN-130: updated logger dependency

13.3.0 2022-09-22
-----------------
  - TEN-65: bad options on data get
  - TEN-126: reconnect on error

13.4.0 2022-10-03
-----------------
  - TEN-132: cache key regex masking

13.5.0 2022-10-12
-----------------
  - TEN-143: ws and primus update in happn-primus-wrapper
  - TEN-101: removed elasticsearch support

13.6.0 2022-10-29
-----------------
  - TEN-129: security service tests
  - TEN-141: fatal on security generate session
  - TEN-144: rest array arguments
  - TEN-146: preserve criteria on remove

13.6.1 2022-11-05
-----------------
  - TEN-135: mongo search does not sort by path

13.7.0 2022-11-24
-----------------
  - TEN-4: productionize summon (authType saved to user)
  - TEN-140: outdated pem module

13.7.1 2022-11-26
-----------------
  - feat: Sqlite DB Provider

13.7.2 2022-12-22
-----------------
  - feat: loki provider disaster recovery enhancements

13.8.0 2023-01-11
-----------------
  - feat: loki archiving and plugins 

13.9.0 2023-01-18
-----------------
  - feat: Summon productionization

13.9.1 2023-02-17
-----------------
  - doc: added documentation regarding primus opts

13.10.0 2023-03-03
-----------------
  - feat: token revocation and logout
  - fix: token revocation cluster fix

13.11.0 2023-04-29
-----------------
  - feat: changePassword in client
  - feat: resetPassword supported by auth provider

13.11.1 2023-05-20
-----------------
- feat: add happner-2 support for reset password
