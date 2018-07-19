const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const gulp = require('gulp');
const browserifyHandlebars = require('browserify-handlebars');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

gulp.task('js', function () {
    return browserify({
            entries: './src/js/main.js',
            transform: [browserifyHandlebars],
            debug: true
        })
        .transform('babelify', { presets: ['es2015'] })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('js:lib', function () {
    return gulp.src([
        './src/js/lib/jquery-min.js',
        './src/js/lib/popper.min.js',
        './src/js/lib/bootstrap.min.js',
        './src/js/lib/form-validator.min.js',
        './src/js/lib/**/*.js'
        ])
        .pipe(concat('bundle-vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('static', function() {
    return gulp.src('./index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('images', function() {
    return gulp.src('./img')
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('fonts', function() {
    return gulp.src('./fonts')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('scss', function() {
    return gulp.src(['./src/scss/vendor/**/*.+(css|scss)', './src/scss/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('server', function() {
    browserSync.init({
        'server': {
            'baseDir': 'dist'
        },
        'files': ['dist/**/*.*']
    });
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('index.html', ['static']);
});

gulp.task('default', ['js', 'js:lib', 'scss', 'static', 'images', 'fonts', 'server']);
