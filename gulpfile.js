var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var cleanCss = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ejs = require('gulp-ejs');
var minifyHtml = require('gulp-minify-html');
var imageMin = require('gulp-imagemin');
var cache = require('gulp-cache');
gulp.task('sass',function(){
    gulp.src(['src/css/*.scss'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(csslint())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./src/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});
gulp.task('js',function(){
    gulp.src(['src/js/index.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(jshint())
          .pipe(jshint.reporter('default'))
          .pipe(browserify())
        .pipe(gulp.dest('src/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream());
});

gulp.task('ejs',function(){
    return gulp.src('src/*.ejs')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        })) 
        .pipe(ejs({}, {}, {ext:'.html'}))
        .pipe(minifyHtml())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

gulp.task('image',function(){
    gulp.src(['src/images/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imageMin()))
        .pipe(gulp.dest('build/images'))
        .pipe(browserSync.stream());
});
gulp.task('default',function(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('src/js/*.js',['js']);
    gulp.watch('src/css/*.scss',['sass']);
    gulp.watch('src/*.ejs',['ejs']);
    gulp.watch('src/images/*',['image']);
    gulp.watch('src/partials/*.ejs',['ejs']);
});