/* File: gulpfile.js */

var app_dir = "app/";
var build_dir = "build/";

// dependencies
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    gulpSass = require('gulp-sass'),
    gulpSourceMaps = require('gulp-sourcemaps'),
    gulpConcat = require('gulp-concat');

var copyFiles = [
    app_dir + '/**/*.html',
    app_dir + '/**/*.js'
];

var sassFiles = [
    app_dir + '/**/*.scss'
];

//////////////////////////////////////////////////////////
// copy static files from app dir to build dir
gulp.task('copy-files', function(){
    gulp.src(copyFiles).pipe(gulp.dest(build_dir));
    gutil.log("Done copying.");
});

//////////////////////////////////////////////////////////
// compile scss files and create sourcemaps
gulp.task('compile-sass', function(){
    return gulp.src(sassFiles)
        .pipe(gulpSourceMaps.init())
            .pipe(gulpSass())
            .pipe(gulpConcat('main.css'))
        .pipe(gulpSourceMaps.write())
        .pipe(gulp.dest(build_dir))
        .pipe(browserSync.stream());
});

//////////////////////////////////////////////////////////
// initialize all watch tasks
gulp.task('watch', function(){
    gulp.watch(copyFiles, ['copy-files'], browserSync.reload);
    gulp.watch(sassFiles, ['compile-sass']);
});

//////////////////////////////////////////////////////////
// setup everything
gulp.task('all', ['watch', 'copy-files', 'compile-sass'], function(){
    gutil.log('everything setup');
});

//////////////////////////////////////////////////////////
// start the server and sync browser
gulp.task('serve', ['all'], function(){
    browserSync.init({
        server: {
            baseDir: build_dir
        }
    });
});

gulp.task('default', ['serve'], function(){
    return gutil.log('Done.');
});

gulp.task('clean', function(){
    del([build_dir + "*"]);
});
