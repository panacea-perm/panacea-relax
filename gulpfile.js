var gulp = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    inject = require('gulp-inject'),
    replace = require('gulp-replace'),
    cssmin = require('gulp-cssmin'),
    es = require('event-stream'),
    ghPages = require('gulp-gh-pages'),
    connect = require('gulp-connect'),
    cached = require('gulp-cached'),
    remember = require('gulp-remember'),
    changed = require('gulp-changed');

var jsBundle, cssBundle;

gulp.task('js', function() {
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


gulp.task('css', function() {
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

gulp.task('copy' , function() {
    var images = gulp.src(
        mainBowerFiles({filter: /images/})
        .concat(['src/images/**/*']))
    .pipe(gulp.dest('./dist/images/'));

    var cname = gulp.src('src/CNAME')
    .pipe(gulp.dest('./dist/'));
    return es.merge(images, cname);
});


gulp.task('index', function() {
    return gulp.src('src/index.html')
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('build', ['js','css', 'copy', 'index'], function () {
});

gulp.task('webserver', function() {
    return connect.server({
        livereload: true,
        root: ['./dist/']
    });
});

gulp.task('deploy', ['build'], function() {
  return gulp.src('./dist/**/*')
  .pipe(ghPages());
});

gulp.task('default',['build', 'webserver'], function() {
    gulp.watch(['./src/styles/**/*.css'], ['css']);
    gulp.watch(['./src/js/**/*.js'], ['js']);
    gulp.watch(['./src/index.html'], ['index']);
});
