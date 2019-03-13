import concat from 'gulp-concat';
import csscomb from 'gulp-csscomb';
import csso from 'gulp-csso';
import gulp from 'gulp';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';

//  PATHS
const paths = {
    js: './src/*.js',
    css: 'src/*.css'
};

//  TASKS
gulp.task('scripts', () =>
    gulp.src(paths.js)
        .on('error', console.log)
        .pipe(uglify())
        .pipe(rename('sa-filter-bootstrap.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(concat('sa-filter-bootstrap.min.js'))
        .pipe(gulp.dest('./dist/js'))
);


gulp.task('styles', () =>
    gulp.src(paths.css)
        .pipe(csscomb())
        .pipe(rename('sa-filter-bootstrap.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css'))
);

const build = gulp.parallel('scripts', 'styles');
gulp.task('build', build);
