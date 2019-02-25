'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
let babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];


// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src('./app/*.css')
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('./public'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
  return gulp.src('./app/**/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./public'))
});

// Gulp task to minify HTML files
gulp.task('pages', function() {
  return gulp.src(['./app/**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('assets', function() {
  return gulp.src(['app/images/**/*']).pipe(gulp.dest('./public/images'));
});

// Clean output directory
gulp.task('clean', () => del(['public']));

// Gulp task to minify all files
gulp.task('default',  gulp.series('clean', gulp.parallel('styles', 'scripts', 'pages', 'assets')));
