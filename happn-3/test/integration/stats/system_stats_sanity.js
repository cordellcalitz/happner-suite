var expect = require('expect.js');
var happn = require('../../../lib/index');
var service = happn.service;
var client = happn.client;
var statsServer;
var happnServer;
var happnClient;
var lastMetrics;
var lastFragment;
var StatsServer = require('happn-stats').StatsServer;
describe(
  require('../../__fixtures/utils/test_helper').create().testName(__filename, 3),
  function () {
    before('start the stats server', function (done) {
      statsServer = new StatsServer({
        reportInterval: 500,
        fragmentsPerReport: 2,
      });
      statsServer.on('report', function (timestamp, metrics) {
        // console.log('METRICS', metrics);
        lastMetrics = metrics;
      });

      statsServer.on('fragment', function (fragment) {
        lastFragment = fragment;
      });

      statsServer
        .start()
        .then(function () {
          done();
        })
        .catch(done);
    });

    before('start happn server', function (done) {
      service
        .create({
          name: 'server_name',
          services: {
            stats: {
              config: {
                emit: true,
                debug: true,
                statsServer: '127.0.0.1',
                statsPort: 49494,
                interval: 500,
              },
            },
          },
        })
        .then(function (server) {
          happnServer = server;
          done();
        })
        .catch(done);
    });

    before('start happn client', function (done) {
      client
        .create({})
        .then(function (client) {
          happnClient = client;
        })
        .then(function () {
          done();
        })
        .catch(done);
    });

    after('stop happn client', function (done) {
      if (!happnClient) return done();
      happnClient.disconnect(done);
    });

    after('stop happn server', function (done) {
      if (!happnServer) return done();
      happnServer.stop(done);
    });

    after('stop the stats server', function (done) {
      if (!statsServer) return done();
      statsServer
        .stop()
        .then(function () {
          done();
        })
        .catch(done);
    });

    it('runs stats after the server has started', function (done) {
      //console.log(JSON.stringify(stats, null, 2));

      done();
    });

    it('has accumulated metrics', function (done) {
      setTimeout(function () {
        expect(lastMetrics.gauges['happn.system.memory.rss']).to.not.be(undefined);
        expect(lastMetrics.gauges['happn.system.memory.heapTotal']).to.not.be(undefined);
        expect(lastMetrics.gauges['happn.system.memory.heapUsed']).to.not.be(undefined);
        expect(lastMetrics.gauges['happn.system.memory.external']).to.not.be(undefined);
        expect(lastMetrics.gauges['happn.session.sessions'] > 0).to.be(true);

        done();
      }, 1020);
    });

    it('has name in fragment', function (done) {
      setTimeout(function () {
        expect(lastFragment.name).to.be('server_name');
        done();
      }, 1020);
    });
  }
);
