var del = require('del'),
    gulp = require('gulp'),
    rename = require("gulp-rename");
//SCRIPT
var uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jscs = require('gulp-jscs');
//STYLE
var csso = require('gulp-csso'),
    csscomb = require('gulp-csscomb'),
    csslint = require('gulp-csslint'),
    concatCss = require('gulp-concat-css');



//PATHS
var paths = {
    'js': './src/js/*.js',
    'css': 'src/css/*.css'
};


//TASKS
gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('scripts', function () {
    gulp.src(paths.js)
        .on('error', console.log)
        .pipe(uglify())
        /*.pipe(gulp_version_tag(__dirname,'./package.json', {

            global: true,
            prefix: '---v',
            suffix: '---'
        }))*/
        .pipe(rename('sa-filter-bootstrap.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(concat('sa-filter-bootstrap.min.js'))
        //.pipe(jscs({fix: true}))
        //.pipe(jscs.reporter())
        //.pipe(jscs.reporter('fail'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts-lint', function () {
    gulp.src(paths.js)
        .on('error', console.log)
        .pipe(uglify())
        .pipe(concat('sa-filter-bootstrap.min.js'))
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('styles', function () {
    return gulp.src(paths.css)
    //.pipe(csslint())
    //.pipe(csslint.formatter())
        .pipe(csscomb())
        //.pipe(gulp_version_tag(__dirname,'./package.json'))
        .pipe(rename('sa-filter-bootstrap.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(concatCss('sa-filter-bootstrap.min.css'))
        .pipe(csso())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('styles-lint', function () {
    return gulp.src(paths.css)
        .pipe(csslint())
        .pipe(csslint.formatter());
});

/*gulp.task('patch',function () {
    return version.patch();
    //console.log "version changed to #{version.version}"
});

gulp.task( 'feature', function () {
    version.feature();
//console.log "version changed to #{version.version}"
});
gulp.task( 'release', function () {
    version.release();
//console.log "version changed to #{version.version}"
});*/

/* gulp.task('development', function () {
 return gulp.src('./portal.css')
 .pipe(csso({
 restructure: false,
 sourceMap: true,
 debug: true
 }))
 .pipe(gulp.dest('./out'));
 });*/

// The default task (called when you run `gulp` from cli)
gulp.task('lint', ['styles-lint']);

gulp.task('build', [/*'clean', */'scripts', 'styles']);