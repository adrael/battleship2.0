// Karma configuration
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        files: [
            'https://code.createjs.com/createjs-2015.11.26.min.js',
            'www/js/bs/exceptions/bs.factory.exception.js',
            'www/js/bs/exceptions/bs.invalid-value.exception.js',
            'www/js/bs/exceptions/bs.missing-property.exception.js',
            'www/js/bs/exceptions/bs.invalid-coordinates.exception.js',
            'www/js/bs/core/bs.utils.core.js',
            'www/js/bs/core/bs.events.core.js',
            'www/js/bs/core/bs.ticker.core.js',
            'www/js/bs/core/bs.core.js',
            'www/js/bs/core/bs.map.core.js',
            'www/js/bs/core/bs.game.core.js',
            'www/js/bs/core/bs.board.core.js',
            'www/js/bs/ships/bs.abstract.ship.js',
            'www/js/bs/ships/bs.cruiser.ship.js',
            'www/js/bs/ships/bs.carrier.ship.js',
            'www/js/bs/ships/bs.destroyer.ship.js',
            'www/js/bs/ships/bs.submarine.ship.js',
            'www/js/bs/ships/bs.battleship.ship.js',

            'tests/common-helpers.js',
            'tests/bs/**/*.test.js'
        ],


        // list of files to exclude
        exclude: [
            '**/*.swp'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },

        client: {
            //captureConsole: false
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
