require('../../__fixtures/utils/test_helper').describe({ timeout: 20000 }, test => {
  var happn = require('../../../lib/index');
  var happn_client = happn.client;

  var serviceInstance;
  var testClient;

  var config = require('../../__fixtures/test/integration/security/https_initialization_config.js');

  var clientConfig = {
    config: {
      protocol: 'https',
      allowSelfSignedCerts: true
    }
  };

  var getService = function(config, callback) {
    happn.service.create(config, function(e, service) {
      if (e) return callback(e);
      serviceInstance = service;
      callback();
    });
  };

  var getClient = function(config, callback) {
    happn_client.create(config, function(e, instance) {
      if (e) return callback(e);
      testClient = instance;
      callback();
    });
  };

  afterEach(function(done) {
    if (testClient && serviceInstance) {
      testClient
        .disconnect()
        .then(
          serviceInstance.stop().then(function() {
            testClient = null;
            serviceInstance = null;
            done();
          })
        )
        .catch(done);
    } else done();
  });

  after(async () => {
    await config.test.cleanup;
  });

  it('starts an https server, with a configured cert and key', function(done) {
    var serviceConfig = config.test1_config;

    getService(serviceConfig, function(e) {
      if (e) return done(e);

      getClient(clientConfig, done);
    });
  });

  it('starts an https server, with a configured cert and key file path pointing to existing files', function(done) {
    var serviceConfig = config.test2_config;

    getService(serviceConfig, function(e) {
      if (e) return done(e);

      getClient(clientConfig, done);
    });
  });

  it('starts an https server, with a configured cert and key file path pointing to non-existing files', function(done) {
    //we check for the files existences afterwards - then delete them as well

    if (process.env.TRAVIS) return done();

    var serviceConfig = config.test3_config;

    getService(serviceConfig, function(e) {
      if (e) return done(e);

      getClient(clientConfig, function(e) {
        if (e) return done(e);

        var certStats = test.fs.statSync(serviceConfig.services.transport.config.certPath);
        var keyStats = test.fs.statSync(serviceConfig.services.transport.config.keyPath);

        test.expect(certStats.isFile()).to.equal(true);
        test.expect(keyStats.isFile()).to.equal(true);

        config.test.cleanup().then(done);
      });
    });
  });

  it('it fails to start an https, due to bad values in the cert', function(done) {
    if (process.env.TRAVIS) return done();

    var serviceConfig = config.test4_config;

    getService(serviceConfig, function(e) {
      // test.expect(e.toString()).to.equal('Error: error creating server: error:140DC009:SSL routines:SSL_CTX_use_certificate_chain_file:PEM lib');
      test.expect(e.toString()).to.match(/PEM/);
      done();
    });
  });

  it('it fails to start an https, due to bad values in the key', function(done) {
    if (process.env.TRAVIS) return done();
    var serviceConfig = config.test5_config;
    getService(serviceConfig, function(e) {
      // test.expect(e.toString()).to.equal('Error: error creating server: PEM_read_bio_PrivateKey');
      test.expect(e.toString()).to.match(/PEM|error/);
      done();
    });
  });

  it('it fails to start an https server, missing key', function(done) {
    if (process.env.TRAVIS) return done();

    var serviceConfig = config.test6_config;

    getService(serviceConfig, function(e) {
      test.expect(e.toString()).to.equal('Error: key file missing for cert');
      done();
    });
  });

  it('it fails to start an https server, missing cert', function(done) {
    if (process.env.TRAVIS) return done();

    var serviceConfig = config.test7_config;

    getService(serviceConfig, function(e) {
      test.expect(e.toString()).to.equal('Error: cert file missing key');
      done();
    });
  });

  it('it fails to start an https server, missing key file path', function(done) {
    if (process.env.TRAVIS) return done();

    var serviceConfig = config.test8_config;

    getService(serviceConfig, function(e) {
      test
        .expect(e.toString())
        .to.equal('Error: missing key file: ' + serviceConfig.services.transport.config.keyPath);
      done();
    });
  });

  it('it fails to start an https server, missing cert file path', function(done) {
    if (process.env.TRAVIS) return done();

    var serviceConfig = config.test9_config;

    getService(serviceConfig, function(e) {
      test
        .expect(e.toString())
        .to.equal('Error: missing cert file: ' + serviceConfig.services.transport.config.certPath);
      done();
    });
  });
});
