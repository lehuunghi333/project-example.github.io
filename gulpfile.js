var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
    })
});

gulp.task('sass', function () {
    return gulp.src('scss/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('useref', function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('main.min.js', uglify()))
        .pipe(gulpif('styles.min.css', cssnano()))
        .pipe(gulp.dest(''))
});

gulp.task('images', function () {
    return gulp.src('img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('img'))
});

gulp.task('clean:dist', function () {
    return del.sync('dist');
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

gulp.task('build', function (callback) {
    runSequence('cache: clear',
        ['sass', 'useref', 'images'],
        callback
    )
});

gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('scss/styles.scss', ['sass']);
    gulp.watch('index.html', browserSync.reload);
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync'], 'watch',
        callback
    )
})