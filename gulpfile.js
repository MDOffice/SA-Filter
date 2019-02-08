var gulp = require('gulp'),
    rename = require("gulp-rename");

var uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var csso = require('gulp-csso'),
    csscomb = require('gulp-csscomb');



//  PATHS
var paths = {
    'js': './src/js/*.js',
    'css': 'src/css/*.css'
};

//  TASKS
gulp.task('scripts', function () {
    gulp.src(paths.js)
        .on('error', console.log)
        .pipe(uglify())
        .pipe(rename('sa-filter-bootstrap.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(concat('sa-filter-bootstrap.min.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('styles', function () {
    return gulp.src(paths.css)
        .pipe(csscomb())
        .pipe(rename('sa-filter-bootstrap.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(csso())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', ['scripts', 'styles']);