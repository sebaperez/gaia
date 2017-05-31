module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js', 'app.js', 'test/*'],
			options: {
				reporterOutput: ''
			}
		},
		mochaTest: {
			test: {
				src: ['test/**/*.js']
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'mochaTest']);
	grunt.registerTask('travis', ['jshint', 'mochaTest']);
};
