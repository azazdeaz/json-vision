'use strict';
var babel = require('gulp-babel');
var size = require('gulp-filesize');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rimraf = require('gulp-rimraf');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var demoWebpackConfig = require('./demo/webpack.config.js');
var ghPages = require('gulp-gh-pages');

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
  return watch(SOURCES, {base: 'src'})
    .pipe(size())
    .pipe(plumber())
    .pipe(babel())
    .pipe(plumber.stop())
    .pipe(gulp.dest('lib'));
});


gulp.task('dev', ['build', 'watch-build']);
gulp.task('default', ['webpack-dev-server']);


gulp.task('gh-pages', ['build-demo'], function() {
  return gulp.src('./demo/dist/**/*')
    .pipe(ghPages());
});

gulp.task('build-demo', function(callback) {
	webpack(demoWebpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('build-demo', err);
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));
		callback();
	});
});


gulp.task('webpack-dev-server', function() {
	// modify some webpack config options
	var myConfig = Object.create(demoWebpackConfig);
	myConfig.devtool = '#eval';
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: '/' + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, 'localhost', function(err) {
		if(err) throw new gutil.PluginError('webpack-dev-server', err);
		gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
	});
});
