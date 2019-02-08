import path from 'path';

import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

import uglify from 'gulp-uglify';
import concat from 'gulp-concat';

import csso from 'gulp-csso';
import csscomb from 'gulp-csscomb';

//  PATHS
const paths = {
    'js': './src/js/*.js',
    'css': 'src/css/*.css'
};

//  TASKS
gulp.task('scripts', function () {
    return gulp.src(paths.js)
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

const build = gulp.parallel('scripts', 'styles');
gulp.task('build', build);
export default build;