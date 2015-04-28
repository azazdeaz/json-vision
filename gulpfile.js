'use strict';
var babel = require('gulp-babel');
var size = require('gulp-filesize');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var rimraf = require('gulp-rimraf');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var gcallback = require('gulp-callback');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash/object/assign');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var SOURCES = './src/**/*.{js,jsx}';

gulp.task('clean', function () {
  return gulp.src('lib/**/*.*')
    .pipe(rimraf({force: true}));
});

gulp.task('build', ['clean'], function () {
  return gulp.src(SOURCES)
    .pipe(size())
    .pipe(plumber())
    .pipe(babel())
    .pipe(plumber.stop())
    .pipe(gulp.dest('lib'));
});

gulp.task('watch-build', function () {
  return watch(SOURCES,{base: 'src' })
    .pipe(size())
    .pipe(plumber())
    .pipe(babel())
    .pipe(plumber.stop())
    .pipe(gulp.dest('lib'));
});


gulp.task('default', ['build', 'watch-build']);







// var gulp = require('gulp'),
//     babel = require('gulp-babel'),
//     watch = require('gulp-watch'),
//     plumber = require('gulp-plumber'),
//
// path = {
//     src: {
//         js: SOURCES,
//     },
//     dist: {
//         js: "lib/"
//     }
// };
//
// gulp.task('6to5', function () {
//     gulp.src(SOURCES)
//         // .pipe(plumber())
//         .pipe(babel())
//         // .pipe(plumber.stop())
//         .pipe(gulp.dest(path.dist.js));
// });
//
// gulp.task('watchez', ['6to5'], function (){
//     gulp.watch([SOURCES], [babel]);
// });
