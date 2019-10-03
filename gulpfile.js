const { src, dest, watch, series, parallel } = require("gulp");
concat = require("gulp-concat");
uglifyes = require('gulp-uglify-es').default;
babel = require("gulp-babel");
concatCss = require('gulp-concat-css');
cssnano = require('gulp-cssnano');
autoprefixer = require('gulp-autoprefixer');
sass = require('gulp-sass');
sassComplier = require('node-sass');
browserSync = require('browser-sync').create();
livereload = require('gulp-livereload');

// Paths
const files = {
	htmlPath: 'src/**/*.html',
	cssPath: "src/**/*.css",
	scssPath: "src/**/*.scss",
	jsPath: "src/**/*.js", 
	imagePath: "src/images/*"
	
};

// Tasks for copying a html files and images
function html() {
    return src(files.htmlPath)
        .pipe(dest('Public'))
		.pipe(browserSync.stream())
		.pipe(livereload());  
}

function image()
{
	return src(files.imagePath)
	.pipe(dest('Public/images'))
	.pipe(livereload());  
}
// Tasks for Concatenating And Minifying JavaScript and CSS Files

function js() {
	    return src(files.jsPath)
	    .pipe(concat('main.js'))
	    .pipe(uglifyes())
	    .pipe(babel({
		presets: ['@babel/preset-env'],
		plugins: ['@babel/transform-runtime']
	     }))
	    .pipe(dest('public/js'))
	    .pipe(browserSync.stream())
	    .pipe(livereload()); 
}

function css()
{
	return src(files.cssPath, files.scssPath)
	.pipe(concatCss('style.css'))
	.pipe(autoprefixer())
    .pipe(cssnano())
	.pipe(dest('Public/css'))
	.pipe(browserSync.stream())
	.pipe(livereload());  
}

// Task for compile Scss Files
function scss()
{
	return src(files.scssPath)
	.pipe(sass().on('error', sass.logError))
	.pipe(dest('Public/css'))
	.pipe(browserSync.stream())
	.pipe(livereload());  
}

// Watching tasks
function watchTask()
{
	livereload.listen();
	browserSync.init({
		server:{
			baseDir: 'Public/' }
		});
	watch([files.htmlPath, files.jsPath, files.scssPath, files.cssPath, files.imagePath],
        parallel(html, js, scss, css, image)
    ).on('change', browserSync.reload);
}


// Gulp basic task
exports.default = series(
    parallel(html, js, scss, css, image, watchTask),
);
