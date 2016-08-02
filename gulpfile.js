var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    cssmin       = require('gulp-cssmin'),
    header       = require('gulp-header'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    sass         = require('gulp-sass'),
    uglify       = require('gulp-uglify'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload;

var pkg = require('./bower.json');
var banner = ['/**',
              ' * Agg v<%= pkg.version %> (<%= pkg.homepage %>)',
              ' * Copyright 2015-<%= new Date().getFullYear() %> <%= pkg.author %>',
              ' * Licensed under the <%= pkg.license %> license',
                ' */',
                ''].join('\n');


gulp.task('vendors', function() {

  // bootstrap
  gulp.src('assets/dev/vendors/bootstrap/dist/**/*.{min.css,eot,svg,ttf,woff,woff2}')
      .pipe(gulp.dest('assets/dist/vendors/bootstrap'));

});


// Concat and Uglify
var plugins = ['assets/dev/vendors/jquery/dist/jquery.min.js',
               'assets/dev/vendors/bootstrap/dist/js/bootstrap.min.js'];

var helpers = ['assets/dev/js/script.js'];

gulp.task('jsPlugins', function(){
  gulp.src(plugins)
      .pipe(plumber())
      .pipe(concat('plugins.js'))
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(gulp.dest('assets/dist/js'))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(gulp.dest('assets/dist/js'))
      .pipe(browserSync.stream());
});

gulp.task('jsHelpers', function(){
  gulp.src(helpers)
      .pipe(plumber())
      .pipe(concat(pkg.name+'.js'))
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(gulp.dest('assets/dist/js'))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(gulp.dest('assets/dist/js'))
      .pipe(browserSync.stream());
});

// sass
gulp.task('sass', function(){
  return sass('assets/dev/sass/pixelomatic.scss')
      .pipe(plumber())
      .pipe(autoprefixer({
        browsers: ['Android >= 2.1',
                   'Chrome >= 21',
                   'Edge >= 12',
                   'Explorer >= 7',
                   'Firefox >= 17',
                   'Opera >= 12.1',
                   'Safari >= 6.0'],
        cascade: false}))
      .pipe(rename({basename: pkg.name}))
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(gulp.dest('assets/dist/css'))
      .pipe(cssmin())
  		.pipe(rename({suffix: '.min'}))
      .pipe(header(banner, { pkg : pkg } ))
  		.pipe(gulp.dest('assets/dist/css'))
      .pipe(browserSync.stream());
});

// serve
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "."
            // host: "192.168.1.1"
        },
        // port: 8080,
        // tunnel: true,
        // online: true,
        // open: "tunnel",
        notify: false
    });
});

// Watch
gulp.task('watch', function(){
  gulp.watch('assets/dev/js/*.js', ['jsHelpers']);
  gulp.watch('assets/dev/sass/**/*.scss', ['sass']);
  gulp.watch("*.html").on("change", reload);
});

gulp.task('build', ['vendors', 'sass', 'jsPlugins', 'jsHelpers']);
gulp.task('default', ['vendors', 'sass', 'jsPlugins', 'jsHelpers', 'serve', 'watch']);
