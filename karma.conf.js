// Karma configuration
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        files: [
            'www/js/bs/bs.core.js',
            'www/js/bs/bs.events.js',
            'www/js/bs/ships/bs.ships.torpedo.js',
            'www/js/bs/ships/bs.ships.cruiser.js',
            'www/js/bs/ships/bs.ships.destroyer.js',
            'www/js/bs/ships/bs.ships.submarine.js',
            'www/js/bs/ships/bs.ships.aircraft-carrier.js',
            'www/js/bs/bs.constants.js',
            'www/js/bs/bs.utils.js',
            'www/js/bs/bs.exceptions.js',
            'www/js/bs/bs.helpers.js',
            'www/js/bs/bs.canvas.js',
            'www/js/bs/bs.display.js',
            'www/js/bs/bs.map.js',

            'tests/common-helpers.js',
            'tests/**/*!(common-helpers).js'
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
