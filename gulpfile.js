const gulp         = require('gulp'),           
sass         = require('gulp-sass'),         
browserSync  = require('browser-sync'),     
cssnano      = require('gulp-cssnano'),    
del          = require('del'),               
imagemin     = require('gulp-imagemin'),    
cache        = require('gulp-cache'),     
autoprefixer = require('gulp-autoprefixer'), 
uglifyjs = require('gulp-uglifyjs'),       
concat = require('gulp-concat'),             
rename = require('gulp-rename'),           
htmlmin = require('gulp-htmlmin'),      
htmlreplace = require('gulp-html-replace'), 
babel = require('gulp-babel'),
pug = require('gulp-pug'),
gcmq = require('gulp-group-css-media-queries');




gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return gulp.src(['app/js/main.js', 'app/libs/**/*.js'])
	.pipe(browserSync.reload({ stream: true }))
});


// gulp.task('code', function() {
// 	return gulp.src('app/*.html')
// 	.pipe(browserSync.reload({ stream: true }))
// });

gulp.task('pug', function() {
	return gulp.src('app/pug/pages/*.pug')
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest('app/'))
	.pipe(browserSync.reload({ stream: true }))
});


gulp.task('browser-sync', function() { 
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	// .pipe(cache(imagemin({ 
	// 	interlaced: true,
	// 	progressive: true,
	// 	svgoPlugins: [{removeViewBox: false}],
	// })))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('clear', function () {
	return cache.clearAll();
})


gulp.task('clean', function() {
	return del.sync('dist');
});


gulp.task('buildHtml', function() {
	return gulp.src('app/*.html')
	.pipe(htmlreplace({
		'css_critical': 'css/critical.css',
		'css_main': 'css/style.css',
		'js': 'js/main.js'
	}))
	.pipe(gulp.dest('dist'))
});

gulp.task('buildFonts', function() {
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});

gulp.task('buildCss', function() {
	return gulp.src('app/css/*.css', '!app/css/libs/*.css', '!app/css/critical.css')
	.pipe(concat('style.css'))
	.pipe(gcmq())
	.pipe(gulp.dest('dist/css/'))
	.pipe(cssnano({autoprefixer: {
		browsers:['last 50 versions', '> 1%', 'ie 8', 'ie 7'], 
		add: true
	}}))	
	.pipe(concat('style.min.css'))
	.pipe(gulp.dest('dist/css/'))
});

gulp.task('buildCssCritical', function() {
	return gulp.src('app/css/critical.css')
	.pipe(gcmq())
	.pipe(gulp.dest('dist/css/'))
	.pipe(cssnano({autoprefixer: {
		browsers:['last 50 versions', '> 1%', 'ie 8', 'ie 7'], 
		add: true
	}}))	
	.pipe(concat('critical.min.css'))
	.pipe(gulp.dest('dist/css/'))
});

gulp.task('buildJs', function() {
	return gulp.src('app/js/main.js')
	.pipe(gulp.dest('dist/js'))
	// .pipe(babel({ "presets": ["@babel/preset-env"] }))
	// .pipe(rename('es5.js'))
	// .pipe(gulp.dest('dist/js'))
	// .pipe(uglifyjs())
	// .pipe(rename({suffix: '.min'}))
	// .pipe(gulp.dest('dist/js'))
});



gulp.task('buildCssLibs', function() {
	return gulp.src('app/css/libs/*.css')
	.pipe(gulp.dest('dist/css/libs'))
});

gulp.task('buildLibs', function() {
	return gulp.src('app/libs/**/*')
	.pipe(gulp.dest('dist/libs'))
});

gulp.task('b', gulp.parallel('clean', 'img', 'buildHtml', 'buildCss', 'buildCssCritical', 'buildCssLibs', 'buildJs', 'buildFonts', 'buildLibs'));


gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
	gulp.watch('app/pug/**/*.pug', gulp.parallel('pug'));
	gulp.watch(['app/js/**/*.js', 'app/libs/**/*.js'], gulp.parallel('scripts'));
});


gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'));