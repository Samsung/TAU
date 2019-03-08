module.exports = function(grunt) {
	"use strict";

	var themes = grunt.file.readJSON("../../themes.json"),
		path = require("path"),

		themePath = path.join( "..", "..", themes.path),

		srcNinepatchImage = "nine-patch",
		distNinepatchImage = "nine-patch",
		ninePatchLess = "9-patch.less";

	grunt.initConfig({

		ninepatch: (function( ) {
				var rtn = {},
				devices = themes.device,
				deviceName,
				device,
				theme,
				i,
				len;

			for ( deviceName in devices ) {
				if ( devices.hasOwnProperty( deviceName ) ) {
					device = devices[ deviceName ];

					theme = device[0];

					rtn[ deviceName + "-" + theme.name ] = {
						options: {
							out: path.join( themePath, deviceName, "changeable", "theme-changeable", ninePatchLess )
						},
						files: [{
							src: [path.join( themePath, deviceName, "changeable", "theme-changeable", srcNinepatchImage, "**/*.9.png" )],
							dest: path.join( themePath, deviceName, "changeable", "theme-changeable", theme.images, distNinepatchImage )
						}]
					};
				}
			}
			return rtn;
		}()),

		watch : {

			options: {
				livereload: 1337,
				interrupt: true
			},

			ninepatch: {
				files : [ path.join( themePath, "**/*.9.png" ) ],
				tasks : [ "ninepatch" ]
			}

		}
	});

	// load the project's default tasks
	grunt.loadTasks( "tasks");
	grunt.loadNpmTasks( "grunt-contrib-watch" );

	grunt.registerTask("default", [ "ninepatch" ]);
};
