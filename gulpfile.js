const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');
var mergeCss = require('gulp-merge-media-queries');
const sass = require('gulp-sass')(require('sass'));

function serve() {
  browserSync.init({
    server: {
      baseDir: './docs'
    }
  });
}

function copyFonts() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('./docs/fonts/'));
}

function copyJs() {
  return gulp.src('src/scripts/*')
    .pipe(gulp.dest('./docs/scripts/'))
    .pipe(browserSync.reload({stream: true}));
} 

// function scripts() {
//   return gulp.src('src/scripts/*')
//     .pipe(gulp.dest('./docs/scripts/'))
//     .pipe(sourcemaps.init())
//     .pipe(browserSync.reload({stream: true}));
// }

function scss() {
  const plugins = [
    autoprefixer()
    // cssnano()
  ];
  return gulp.src('src/styles/**/*.scss')
    .pipe(sass())
    .pipe(mergeCss())
    // .pipe(concat('style-min.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('docs/'))
    .pipe(browserSync.reload({stream: true}));
}

function html() {
  const options = {
	  removeComments: true,
	  removeRedundantAttributes: true,
	  removeScriptTypeAttributes: true,
	  removeStyleLinkTypeAttributes: true,
	  sortClassName: true,
	  useShortDoctype: true,
	  collapseWhitespace: true,
		// minifyCSS: true,
		keepClosingSlash: true
	};
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    // .on('data', function(file) {
    //   const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
    //   return file.contents = buferFile
    // })
    .pipe(gulp.dest('docs/'))
    .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('docs/'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('docs/');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/styles/**/*.scss'], scss);
  gulp.watch(['src/scripts/**.js'], copyJs);
  gulp.watch(['src/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
}

const build = gulp.series(clean, gulp.parallel(html, scss, copyFonts, copyJs, images));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.scss = scss;
exports.images = images;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;