const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const clean = require('gulp-clean');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const cssmin = require('gulp-cssnano'),
    prefix = require('gulp-autoprefixer');

const hash = require('gulp-hash');
const references = require('gulp-hash-references');

const uglify = require('gulp-uglify'),
    buffer = require('vinyl-buffer');

var prefixerOptions = {
    browsers: ['last 2 versions']
};

// DEV SUBTASKS
// ---------------
gulp.task('transform-runtime', () => {
    return browserify({
            entries: 'src/main.js',
            debug: true
        })
        .transform('babelify', {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
        })
        .bundle()
        .on('error', error => {
            console.log('[Bundle Error] ' + error);
        })
        .pipe(source('main.js'))
        .pipe(gulp.dest('dist'))
        .pipe(hash.manifest('asset-manifest.json'))
        .pipe(gulp.dest('.'));
});

gulp.task('copy', () => {
    gulp.src(['src/assets/**/*', '!src/assets/scss', '!src/assets/scss/*'])
        .pipe(gulp.dest('dist'));

    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
    return gulp.src('src/assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('src/assets/scss/**/*.scss', ['sass']);
});

// DEV SUBTASKS
// ---------------

// BUILD SUBTASKS
// ---------------

gulp.task('clean', () => {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean());
})

gulp.task('transform', () => {
    return browserify({
            entries: 'src/main.js',
            debug: false
        })
        .transform('babelify', {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
        })
        .bundle()
        .on('error', error => {
            console.log('[Bundle Error] ' + error);
        })
        .pipe(source('main.js'))
        // 添加 hash
        .pipe(buffer())
        .pipe(uglify())
        .pipe(hash())
        .pipe(gulp.dest('dist'))
        .pipe(hash.manifest('asset-manifest.json'))
        .pipe(gulp.dest('.'));
});

gulp.task('copy:build', () => {
    gulp.src(['src/assets/**/*', '!src/assets/scss', '!src/assets/scss/*'])
        .pipe(gulp.dest('dist'));
});

/** Update hte hash js or css to index.html */
gulp.task('update-references', ['transform'], function () {
    return gulp.src('src/index.html')
        .pipe(references('asset-manifest.json')) // Replace file paths in index.html according to the manifest
        .pipe(gulp.dest('dist'));
});

gulp.task('sass:build', function () {
    return gulp.src('src/assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix(prefixerOptions))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});

// BUILD TASKS
// ------------

gulp.task('develop', ['transform-runtime', 'copy'])

gulp.task('watch', () => {
    return gulp.watch('src/**/*', ['develop']);
});

gulp.task('default', ['develop', 'watch', 'sass', 'sass:watch']);

gulp.task('build', ['clean'], () => {
    gulp.start(['transform', 'update-references', 'sass:build', 'copy:build']);
});