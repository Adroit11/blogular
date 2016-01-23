'use strict';

var path        = require('path');
var gulp        = require('gulp');
var runSequence = require('run-sequence');
var conf        = require('./conf');

var browserSync    = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components' : 'bower_components'
    };
  }

  var server = {
    baseDir : baseDir,
    routes  : routes
  };

  server.middleware = proxyMiddleware('/api', {target : 'http://localhost:3010/', proxyHost : 'localhost:3010/'});

  browserSync.instance = browserSync.init({
    startPath : '/',
    server    : server,
    browser   : browser
  });
}

browserSync.use(browserSyncSpa({
  selector : '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', function(callback) {
  runSequence('clean', ['nodemon', 'watch'], function() {
    browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
    callback();
  });
});

gulp.task('serve:dist', function(callback) {
  runSequence('clean', ['nodemon', 'watch'], function() {
    browserSyncInit(conf.paths.dist);
    callback();
  });
});
