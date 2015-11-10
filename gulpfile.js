
'use strict';

const gulp = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    cssmin = require('gulp-cssmin'),
    es = require('event-stream'),
    ghPages = require('gulp-gh-pages'),
    connect = require('gulp-connect'),
    cached = require('gulp-cached'),
    remember = require('gulp-remember'),
    changed = require('gulp-changed');

gulp.task('js', () => {
    return gulp.src(
        mainBowerFiles({filter: /\.js$/})
        .concat(['src/js/main.js'])
    )
    //.pipe(cached('js'))
    //.pipe(remember('js'))
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload());
});


gulp.task('css', () => {
    return gulp.src(
        mainBowerFiles({filter: /\.css$/})
        .concat(['src/styles/main.css'])
    )
    //.pipe(cached('css'))
    //.pipe(remember('css'))
    .pipe(concat('bundle.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
});

gulp.task('copy' , () => {
    let images = gulp.src(
        mainBowerFiles({filter: /images/})
        .concat(['src/images/**/*']))
    .pipe(gulp.dest('./dist/images/'));

    let cname = gulp.src('src/CNAME')
    .pipe(gulp.dest('./dist/'));
    return es.merge(images, cname);
});


gulp.task('index', () => {
    return gulp.src('src/index.html')
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('build', ['js','css', 'copy', 'index']);

gulp.task('webserver', () => {
    return connect.server({
        livereload: true,
        root: ['./dist/']
    });
});

gulp.task('deploy', ['build'], () => {
  return gulp.src('./dist/**/*')
  .pipe(ghPages());
});

gulp.task('default',['build', 'webserver'], () => {
    gulp.watch(['./src/styles/**/*.css'], ['css']);
    gulp.watch(['./src/js/**/*.js'], ['js']);
    gulp.watch(['./src/index.html'], ['index']);
});
