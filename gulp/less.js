
// const autoprefixer = require('autoprefixer');

module.exports = function(gulp, $, p_src, p_dest) {
	// build stream
	return gulp.src(p_src+'/**/*.less')

		// handle uncaught exceptions thrown by any of the plugins that follow
		.pipe($.plumber())

		.pipe($.debug())

		// begin sourcemaps
		.pipe($.sourcemaps.init())

			// compile less => css
			.pipe($.less({
				paths: [
					p_src,
				],
			}))

			// // auto-prefix css
			// .pipe($.postcss([
			// 	autoprefixer({
			// 		browsers: [
			// 			'last 2 version',
			// 			'> 5%',
			// 			'safari 5',
			// 			'ios 6',
			// 			'android 4',
			// 		],
			// 	})
			// ]))

		// remove 'src' dir and '_' file prefix from path
		.pipe($.if(this.options.rename, $.rename(this.options.rename)))

		// // minify css
		// .pipe($.if(B_PRODUCTION, $.minifyCss({
		// 	rebase: false,
		// })))

		// sourcemaps
		.pipe($.sourcemaps.write())

		// write to output directory
		.pipe(gulp.dest(p_dest));
};

module.exports.dependencies = [
	'gulp-util',
	'gulp-plumber',
	'gulp-debug',
	'gulp-sourcemaps',
	'gulp-less',
	'gulp-if',
	'gulp-rename',
];
