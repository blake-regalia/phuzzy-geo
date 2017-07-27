//
const path = require('path');

// gulp & tasker
const gulp = require('gulp');
const soda = require('gulp-soda');

// 
soda(gulp, {
	// 
	inputs: {
		main: 'node',
		styles: 'less-css',
	},

	// 
	targets: {
		node: [
			'copy',
		],

		// compile less to css
		'less-css': [
			'less',
		],
	},
});
