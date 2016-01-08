(function () {
    'use strict';

    var gulp = require('gulp');
    var del = require('del');
    var vinylPaths = require('vinyl-paths');
    var server = require('gulp-develop-server');
    var watch = require('gulp-watch');

    var simpleCopyGlobs = {
        core: ['*.js', 'config.js', 'core-server/**/'],
        api: 'api/*.js',
        users: 'users/**'
    };

    var createDestinationGlob = function (pattern) {
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
    };

    var registerSimpleCopyTasks = function (name) {
        var cleanTaskName = 'clean:' + name,
            copyTaskName = 'copy:' + name,
            watchTaskName = 'watch:' + name,
            globPattern = simpleCopyGlobs[name];

        gulp.task(cleanTaskName, function () {
            return gulp.src(createDestinationGlob(globPattern), {read: false})
                .pipe(vinylPaths(del));
        });

        gulp.task(copyTaskName, [cleanTaskName], function () {
            return gulp.src(globPattern, {cwd: './app/', base: './app'})
                .pipe(gulp.dest('./.build'));
        });

        gulp.task(watchTaskName, [copyTaskName], function () {
            gulp.watch(globPattern, {base: './'}, [copyTaskName]);
        });
    };

    Object.keys(simpleCopyGlobs).forEach(function (name) {
        registerSimpleCopyTasks(name);
    });

     module.exports = Object.keys(simpleCopyGlobs);

})();