(function () {
    'use strict';

    var gulp = require('gulp'),
        rimraf = require('gulp-rimraf'),
        server = require('gulp-develop-server'),
        watch = require('gulp-watch'),
        simpleCopyGlobs = {
            core: ['api-app.js', 'config.js', 'core-server/**/'],
            api: 'api/*.js',
            users: 'users/**'
        },
        createDestinationGlob = function (pattern) {
            var buildRootPath = './.build/',
                returnValue,
                i;

            if (Object.prototype.toString.call(pattern) === '[object Array]') {
                returnValue = []
                for (i = 0; i < pattern.length; i++) {
                    returnValue.push(createDestinationGlob(pattern[i]));
                }
            }
            else {
                returnValue = buildRootPath + pattern;
            }
            return returnValue;
        },
        registerSimpleCopyTasks = function (name) {
            var cleanTaskName = 'clean:' + name,
                copyTaskName = 'copy:' + name,
                watchTaskName = 'watch:' + name,
                globPattern = simpleCopyGlobs[name];

            gulp.task(cleanTaskName, function () {
                return gulp.src(createDestinationGlob(globPattern), {read: false})
                    .pipe(rimraf());
            });

            gulp.task(copyTaskName, [cleanTaskName], function () {
                return gulp.src(globPattern, { cwd: './app/', base:'./app'})
                    .pipe(gulp.dest('./.build'));
            });

            gulp.task(watchTaskName, [copyTaskName], function () {
                gulp.watch(globPattern, {base: './'}, [copyTaskName]);
            });
        };

    Object.keys(simpleCopyGlobs).forEach(function (name) {
        console.log('Adding task ' + name);
        registerSimpleCopyTasks(name);
    });

     module.exports = Object.keys(simpleCopyGlobs);

})();