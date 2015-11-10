(function () {
    'use strict';
    var gulp = require('gulp'),
        rimraf = require('gulp-rimraf'),
        server = require( 'gulp-develop-server'),
        watch = require('gulp-watch'),
        taskListing = require('gulp-task-listing'),
        simpleCopyRegistration = require('./.gulp/simple-copy-registration'),
        watchTasks = [],
        i;

    for(i=0; i< simpleCopyRegistration.length; i++) {
        watchTasks.push('watch:' + simpleCopyRegistration[i]);
    }

    gulp.task('help', taskListing);

    gulp.task('watch', watchTasks.concat([]));

    gulp.task('server:start', ['watch'], function(){
        server.listen({path:'./.build/api-app.js'});
    });

    gulp.task('default', ['server:start']);
})();


