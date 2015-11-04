var gulp = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    inject = require('gulp-inject'),
    replace = require('gulp-replace'),
    cssmin = require('gulp-cssmin'),
    es = require('event-stream'),
    ghPages = require('gulp-gh-pages');

var jsBundle = gulp.src(
    mainBowerFiles({filter: /\.js$/})
    .concat(['src/js/main.js'])
)
.pipe(concat('bundle.js'))
.pipe(uglify())
.pipe(gulp.dest('./dist/js'));

var cssBundle = gulp.src(
    mainBowerFiles({filter: /\.css$/})
    .concat(['src/styles/main.css'])
)
.pipe(concat('bundle.css'))
.pipe(cssmin())
.pipe(gulp.dest('./dist/css'));


gulp.task('copy' , function() {
    gulp.src(
        mainBowerFiles({filter: /images/})
        .concat(['src/images/**/*']))
    .pipe(gulp.dest('./dist/images/'));

    gulp.src('src/CNAME')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['copy'], function () {
    gulp.src('src/index.html')
    .pipe(inject(es.merge(jsBundle, cssBundle), { read:false }))
    .pipe(replace('\/dist', '.'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});


gulp.task('default', function () {
});
