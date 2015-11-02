var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var flatten = require('gulp-flatten');
var cssmin = require('gulp-cssmin');
var es = require('event-stream');


var jsBundle = gulp.src(
    mainBowerFiles({filter: /\.js$/})
    .concat(['src/js/main.js'])
)
.pipe(concat('bundle.js'))
//.pipe(uglify())
.pipe(gulp.dest('./dist'));

var cssBundle = gulp.src(
    mainBowerFiles({filter: /\.css$/})
    .concat(['src/styles/main.css'])
)
.pipe(concat('bundle.css'))
//.pipe(cssmin())
.pipe(gulp.dest('./dist'));


gulp.task('copy' , function() {
    gulp.src(
        mainBowerFiles({filter: /images/})
        .concat(['src/images/**/*']))
    .pipe(gulp.dest('./dist/images/'));
});

gulp.task('build', ['copy'], function () {
    gulp.src('src/index.html')
    .pipe(inject(es.merge(jsBundle, cssBundle), { read:false }))
    .pipe(replace('\/dist', '.'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', function () {
});
