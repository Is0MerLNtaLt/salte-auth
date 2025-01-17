const common = require('./rollup.common.config.js');

module.exports = (config) => {
  const browsers = [
    'Chrome',
    'Firefox',
    'MicrosoftEdge',
    'Safari',
    'Internet Explorer'
  ];

  const customLaunchers = browsers.reduce((output, browser) => {
    // TODO: For some reason Safari 12 throws a 500 error...
    output[`${browser}Latest`] = {
      base: 'SauceLabs',
      browserName: browser.toLowerCase(),
      version: browser === 'Safari' ? 'latest-1' : 'latest'
    };

    if (browser !== 'Internet Explorer') {
      output[`${browser}Prior`] = {
        base: 'SauceLabs',
        browserName: browser.toLowerCase(),
        version: browser === 'Safari' ? 'latest-2' : 'latest-1'
      };
    }

    return output;
  }, {});

  config.set({
    basePath: '',

    frameworks: [
      'mocha'
    ],

    files: [
      'test/unit/index.js'
    ],

    client: {
      mocha: {
        timeout: 10000
      }
    },

    preprocessors: {
      'test/unit/index.js': ['rollup', 'sourcemap']
    },

    rollupPreprocessor: common({
      minified: false,
      es6: false,
      tests: true,
      coverage: false
    }),

    reporters: ['mocha', 'coverage'],

    mochaReporter: {
      output: 'minimal',
      showDiff: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    sauceLabs: {
      testName: 'salte-auth/salte-auth',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false
    },

    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    captureTimeout: 120000,
    browserNoActivityTimeout: 120000,

    singleRun: true
  });
}
