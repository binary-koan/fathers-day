var gulp = require('gulp');
var gutil = require('gulp-util');
var wiredep = require('wiredep').stream;
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var coffeeify = require('coffeeify');

// Transpile Sass
gulp.task('sass', function () {
  gulp.src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public'));
});

// Transpile Coffee
gulp.task('coffee', function() {
  return browserify({
    entries: './src/main.coffee',
    debug: true,
    transform: [ coffeeify ],
    extensions: [ '.coffee' ]
  }).bundle()
    .pipe(source('script.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    .on('error', function(err) {
      gutil.log(err);
      this.end();
    })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/'));
});

// Watch files for changes
gulp.task('watch', ['coffee', 'sass'], function() {
  gulp.watch('./src/**/*.coffee', ['coffee']);
  gulp.watch('./src/*.scss', ['sass']);
  gulp.watch('./src/index.html', ['bower']);
});

// Include bower components into html
gulp.task('bower', function () {
  gulp.src('./src/index.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe(gulp.dest('./public'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'bower', 'sass']);
