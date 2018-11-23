const babel = require('gulp-babel');
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

var sass = require('gulp-sass');
sass.compiler = require('node-sass');

gulp.task("transform", () => {
    return gulp.src("main.js")
        .pipe(babel())
        .on("error", error => {
            console.log(error);
        })
        .pipe(gulp.dest('dist'));
});

gulp.task('transform-runtime', () => {
    return browserify({
            entries: "src/main.js",
            debug: true
        })
        .transform("babelify", {
            presets: ["@babel/preset-env"],
            plugins: ['@babel/plugin-proposal-class-properties']
        })
        .bundle()
        .on("error", error => {
            console.log("[Bundle Error] " + error);
        })
        .pipe(source('main3.js'))
        .pipe(gulp.dest('dist'));
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

gulp.task("watch", () => {
    return gulp.watch("src/**/*", ["transform-runtime", "copy"]);
});

gulp.task('default', ['transform-runtime', 'copy', 'watch', 'sass', 'sass:watch']);