/**********************************************************************************/
/*                                                                                */
/*                                   LIBRARIES                                    */
/*                                                                                */
/**********************************************************************************/

var fs              = require('fs'),
    del             = require('del'),
    opn             = require('opn'),
    rev             = require('gulp-rev'),
    zip             = require('gulp-zip'),
    gulp            = require('gulp'),
    path            = require('path'),
    csso            = require('gulp-csso'),
    sass            = require('gulp-sass'),
    merge           = require('merge-stream'),
    watch           = require('gulp-watch'),
    rename          = require('gulp-rename'),
    useref          = require('gulp-useref'),
    filter          = require('gulp-filter'),
    uglify          = require('gulp-uglify'),
    minify          = require('gulp-minify'),
    connect         = require('gulp-connect'),
    wiredep         = require('wiredep').stream,
    cleanCss        = require('gulp-clean-css'),
    minifyCss       = require('gulp-minify-css'),
    livereload      = require('gulp-livereload'),
    revReplace      = require('gulp-rev-replace'),

    paths = {

        sass: ['./scss/**/*.scss'],
        images: ['./www/img/*'],
        useref: ['./www/*.html', '!./www/index.html']

    };

/**********************************************************************************/
/*                                                                                */
/*                                     TASKS                                      */
/*                                                                                */
/**********************************************************************************/

gulp.task('default',        ['deploy', 'serve', 'watch', 'browser']);

gulp.task('zip',                                                            _zip);
gulp.task('hook',           ['deploy'],                                     _hook);
gulp.task('sass',                                                           _sass);
gulp.task('build',          ['minify'],                                     _build);
gulp.task('bower',                                                          _bower);
gulp.task('serve',                                                          _serve);
gulp.task('watch',                                                          _watch);
gulp.task('useref',                                                         _useref);
gulp.task('minify',         ['hook'],                                       _minify);
gulp.task('deploy',         ['sass', 'copyimgs', 'copyfonts'],              _useref);
gulp.task('browser',                                                        _browser);
gulp.task('scratch',                                                        _scratch);
gulp.task('copyimgs',                                                       _copyimgs);
gulp.task('copyfonts',                                                      _copyfonts);

/**********************************************************************************/
/*                                                                                */
/*                                     HOOKS                                      */
/*                                                                                */
/**********************************************************************************/

/**
 * _minify
 * @name _minify
 * @function
 */
function _minify() {

    var jsMinified =
        gulp.src('./www/dist/js/*.js')
            .pipe(minify({
                ext: { min:'.js' },
                noSource: true
            }))
            .pipe(gulp.dest('./www/dist/js'));

    var cssMinified =
        gulp.src('./www/dist/styles/*.css')
            .pipe(cleanCss({ keepSpecialComments: 0 }))
            .pipe(gulp.dest('./www/dist/styles'));

    return merge(jsMinified, cssMinified);

}

/**
 * _hook
 * @name _hook
 * @function
 */
function _hook(done) {

    function endsWith(string, value) {

        return string.substring(string.length - value.length, string.length) === value;

    }

    var environment = (process.argv[3] || 'dev').replace(/--/g, ''),
        filePath = __dirname + '/www/dist/js',
        configFile = path.join('config', 'environments.json'),
        JSONConfigObject = JSON.parse(fs.readFileSync(configFile, 'utf8')),
        filesToReplace = Object.keys(JSONConfigObject.hooks),
        distFilenames = fs.readdirSync(filePath);

    console.log('[+] On environment:', environment);

    filesToReplace.forEach(
        function (filePatternToReplace) {

            var realFile = filePatternToReplace;

            for(var i = 0; i < distFilenames.length; ++i) {

                var pattern = new RegExp(filePatternToReplace),
                    filename = distFilenames[i];

                if(endsWith(filename, '.js') &&  pattern.test(filename)) {

                    realFile = filename;
                    break;

                }

            }

            var fullFileName = path.join(filePath, realFile);

            if (fs.existsSync(fullFileName)) {

                console.log('[+] Interpolating ', fullFileName);

                Object.keys(JSONConfigObject.hooks[filePatternToReplace]).forEach(
                    function (variable) {

                        var conf = JSONConfigObject.hooks[filePatternToReplace][variable],
                            obj = {

                                value: conf.environments[environment],
                                pattern: conf.pattern

                            };

                        console.log('[+] Working on:', variable, '=', obj.value);
                        _replaceStringInFile(fullFileName, obj.pattern, obj.value);

                    }
                );

            } else {

                console.error('[ERROR] MISSING:', fullFileName);

            }

        }
    );

    done();

}

/**
 * _replaceStringInFile
 * @name _replaceStringInFile
 * @function
 */
function _replaceStringInFile(filename, toReplace, replaceWith) {

    var data = fs.readFileSync(filename, 'utf8'),
        result = _replace(data, toReplace, replaceWith);

    fs.writeFileSync(filename, result, 'utf8');

}

/**
 * _replace
 * @name _replace
 * @function
 */
function _replace(data, from, to) {

    return data.replace(new RegExp(from, 'g'), to);

}

/**
 * _sass
 * @name _sass
 * @function
 */
function _sass() {

    return gulp.src(paths.sass)
        .pipe(sass({ errLogToConsole: true }))
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .pipe(livereload());

}

/**
 * _copyfonts
 * @name _copyfonts
 * @function
 */
function _copyfonts() {

    var fontsMaterial =
        gulp.src(['./www/lib/material/*.{ttf,woff,woff2,eot}'])
            .pipe(gulp.dest('./www/fonts/Material'))
            .pipe(gulp.dest('./www/css/fonts/Material'))
            .pipe(gulp.dest('./www/dist/fonts/Material'));

    var fontsRoboto =
        gulp.src(['./bower_components/roboto-fontface/fonts/roboto/*.{ttf,woff,woff2,eot,svg}'])
            .pipe(gulp.dest('./www/fonts/Roboto'))
            .pipe(gulp.dest('./www/css/fonts/Roboto'))
            .pipe(gulp.dest('./www/dist/fonts/Roboto'));

    var fontsBebasNeue =
        gulp.src(['./www/lib/bebas_neue/*.{ttf,otf}'])
            .pipe(gulp.dest('./www/fonts/Bebas-Neue'))
            .pipe(gulp.dest('./www/css/fonts/Bebas-Neue'))
            .pipe(gulp.dest('./www/dist/fonts/Bebas-Neue'));

    return merge(fontsMaterial, fontsRoboto, fontsBebasNeue);

}

/**
 * _copyimgs
 * @name _copyimgs
 * @function
 */
function _copyimgs() {

    return gulp.src(paths.images)
        .pipe(gulp.dest('./www/css/img'))
        .pipe(gulp.dest('./www/dist/img'));

}

/**
 * _useref
 * @name _useref
 * @function
 */
function _useref() {

    var userefAssets = useref.assets(),
        cssFilter = filter('./www/css/*.min.css'),
        jsFilter = filter('./www/dist/tmp/**/*.js');

    return gulp.src('./www/*.html')
        .pipe(userefAssets)         // Concatenate with gulp-useref
        .pipe(jsFilter)
        .pipe(uglify())             // Minify any javascript sources
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(csso())               // Minify any CSS sources
        .pipe(cssFilter.restore())
        .pipe(rev())                // Rename the concatenated files
        .pipe(userefAssets.restore())
        .pipe(useref())
        .pipe(revReplace())         // Substitute in new filenames
        .pipe(gulp.dest('./www/dist'));

}

/**
 * _scratch
 * @name _scratch
 * @function
 */
function _scratch(done, toDelete) {

    toDelete = toDelete || [
            './www/css',
            './www/dist',
            './www/fonts'
        ];

    var nextToDelete = toDelete.pop();

    if (nextToDelete === undefined) return done && done() || done;

    console.log('> Removing:', nextToDelete);

    del(nextToDelete, function () { return _scratch(done, toDelete); });

}

/**
 * _build
 * @name _build
 * @function
 */
function _build() {

    return _scratch(_zip, ['./www/dist/tmp']);

}

/**
 * _zip
 * @name _zip
 * @function
 */
function _zip() {

    return gulp.src('./www/dist/**')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./www/dist'));

}

/**
 * _watch
 * @name _watch
 * @function
 */
function _watch() {

    livereload.listen();

    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.images, ['copyimgs']);
    gulp.watch(paths.useref, ['useref']);

}

/**
 * _bower
 * @name _bower
 * @function
 */
function _bower() {

    return gulp.src('./www/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest('./www'));

}

/**
 * _serve
 * @name _serve
 * @function
 */
function _serve() {

    return connect.server({ livereload: true });

}

/**
 * _browser
 * @name _browser
 * @function
 */
function _browser() {

    return opn('http://localhost:8080/www');

}
