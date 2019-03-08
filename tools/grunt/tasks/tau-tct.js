/*global module, process, require*/
/*eslint no-process-exit: "off"*/
/*
 * TAU TCT package automatic making module.
 */
var shell = require("shelljs"),
	path = require("path"),
	TIZEN_VERSION = "5.0",
	TCT_MANAGER_NAME = "tizen_web_" + TIZEN_VERSION;

module.exports = function (grunt) {
	var DOWNLOAD_PATH = path.join(process.env.HOME, process.env.DOWNLOADS || "Downloads"),
		relativePath = path.relative("./", DOWNLOAD_PATH || "");

	grunt.registerTask("prepare", "Prepare", function (profile) {
		if (!profile) {
			profile = "mobile"
		}
		grunt.task.run("test-runner-prepare:" + profile);
	});

	grunt.registerTask("fake-tct", "Make fake .tct file in Downloads", function () {
		grunt.file.write(path.join(DOWNLOAD_PATH, "fake.tct"), "dummy content");
	});

	grunt.config.merge({

		connect: {
			tct: {
				options: {
					port: 9002,
					open: {
						target: "http://localhost:9002/tests/tau-runner/generate.html?0"
					}
				}
			}
		},
		watch: {
			mobilePackaging: {
				files: [path.join(relativePath, "*.tct")],
				tasks: [
					"copy:configXMLMobile",
					"copy:tct",
					"serialTctWgt:mobile",
					"serialExecTctWgt:mobile",
					"tctPackaging",
					"copyTctPackagesToTctMgr:mobile",
					"tctUpdatePackagesInfo:mobile",
					"clean:tct",
					"exit"
				],
				options: {
					spawn: false
				}
			},
			wearablePackaging: {
				files: [path.join(relativePath, "*.tct")],
				tasks: [
					"copy:configXMLWearable",
					"copy:tct",
					"serialTctWgt:wearable",
					"serialExecTctWgt:wearable",
					"tctPackaging",
					"copyTctPackagesToTctMgr:wearable",
					"tctUpdatePackagesInfo:wearable",
					"clean:tct",
					"exit"
				],
				options: {
					spawn: false
				}
			}
		},
		copy: {
			configXMLMobile: {
				files: [{
					src: "tests/tau-runner/excluded/config-mobile.xml",
					dest: "tests/tau-runner/config.xml"
				}]
			},
			configXMLWearable: {
				files: [{
					src: "tests/tau-runner/excluded/config-wearable.xml",
					dest: "tests/tau-runner/config.xml"
				}]
			},
			tct: {
				files: [
					{
						expand: true,
						cwd: relativePath + "/",
						src: ["tests-*.xml"],
						dest: "tests/tau-runner/xml/"
					}
				]
			},
			tests: {
				files: [
					{
						expand: true,
						cwd: "tests",
						src: ["js/**", "libs/**"],
						dest: "tests/tau-runner/tests/"
					},
					{
						src: "tests/karma/tests/helpers.js",
						dest: "tests/tau-runner/tests/karma/tests/helpers.js"
					}
				],
				options: {
					process: function (content, srcpath) {
						if (srcpath.indexOf(".html") > -1 && srcpath.indexOf("test-data") === -1) {
							content = content.replace("<!-- TCT", "");
							content = content.replace("TCT -->", "");
							return content + "<script>QUnit.config.autostart=false;</script>";
						}
						return content;
					}
				}
			},
			mobileTCT: {
				files: [
					{
						expand: true,
						cwd: path.join("tests", "tct-package"),
						src: ["*.zip"],
						dest: path.join("dist", "mobile", "tct")
					}
				]
			},
			wearableTCT: {
				files: [
					{
						expand: true,
						cwd: path.join("tests", "tct-package"),
						src: ["*.zip"],
						dest: path.join("dist", "wearable", "tct")
					}
				]
			},
			runnerWearableTCT: {
				files: [
					{
						expand: true,
						cwd: path.join("tests"),
						src: ["tct-runner/**"],
						dest: path.join("tct-packages", "0"),
						dot: true
					}
				]
			}
		},
		exec: {
			wgt: {
				command: "grunt prepare-app --app=./tests/tau-runner/ --tizen-3-0=true --profile=wearable --no-run=true && cd ..",
				stdout: true
			}
		},
		clean: {
			tct: {
				options: {
					force: true
				},
				src: [
					path.join(relativePath, "tests-*.xml"),
					path.join(relativePath, "*.tct"),
					"tests/tau-runner/xml/*.xml",
					"tests/tau-runner/tests/**",
					"tests/tct-packages",
					"tests/tct-package/*.zip"
				]
			},
			"tct-wearable-packages": {
				options: {
					force: true
				},
				src: [
					"/opt/tct/" + TCT_MANAGER_NAME + "/packages/wearable/tcttautest*.zip"
				]
			},
			"tct-mobile-packages": {
				options: {
					force: true
				},
				src: [
					"/opt/tct/" + TCT_MANAGER_NAME + "/packages/mobile/tcttautest*.zip"
				]
			},
			legacy: {
				src: [
					"tests/tau-runner/xml/*.xml",
					"tests/tct-package/*.zip"
				]
			}
		}
	});

	grunt.loadTasks("tools/app/tasks");

	grunt.registerTask("copyTctWgt", "copy tct wgts", function (number) {
		grunt.log.ok("copyTctWgt");

		grunt.config.merge({
			copy: {
				runnerTCT: {
					files: [{
						expand: true,
						cwd: path.join("tests"),
						src: ["tau-runner/**"],
						dest: path.join("tests", "tct-packages", number)
					}, {
						src: "tests/tau-runner/xml/tests-p" + number + ".xml",
						dest: path.join("tests", "tct-packages", number, "tau-runner", "tests.xml")
					}]
				}
			}
		});
		grunt.task.run("copy:runnerTCT");
	});

	function twoDigit(index) {
		if (index < 10) {
			return "0" + index;
		}
		return index;
	}

	grunt.registerTask("syncTCT", "...", function (profileIndex) {
		var args = profileIndex.split("-"),
			profile = args[0],
			index = args[1],
			tctRepo = grunt.option("tct-repo");

		grunt.file.write("tests/tct-packages/" + index + "/tau-runner/currentTestIndex.js", "var CURRENT_ITERATION = " + (index - 1) + ";");

		if (tctRepo) {
			grunt.config.merge({
				sync: {
					runner: {
						files: [{
							expand: true,
							cwd: path.join("tests", "tct-packages", index, "tau-runner"),
							src: ["**", "!excluded/**", "!xml/**", "!generate.html"],
							dest: path.join(tctRepo, profile, "tct-webuifw-tests" + twoDigit(index))
						}],
						verbose: true,
						updateAndDelete: true
					}
				}
			});
			grunt.task.run("sync:runner");
		}
	});

	grunt.registerTask("updateTestIndex", "update index of current test", function (index) {
		var CONFIG_FILE_NAME = "tests/tct-packages/" + index + "/tau-runner/config.xml",
			SUITE_FILE_NAME = "tests/tct-packages/" + index + "/tau-runner/suite.json",
			content;

		grunt.file.write("tests/tct-packages/" + index + "/tau-runner/currentTestIndex.js", "var CURRENT_ITERATION = " + (index - 1) + ";");

		content = grunt.file.read(CONFIG_FILE_NAME, "UTF8");
		content = content.replace(/\%\%name\%\%/g, "tct-webuifw-tests" + twoDigit(index));
		content = content.replace(/\%\%tizen\-version\%\%/g, TIZEN_VERSION);
		grunt.file.write(CONFIG_FILE_NAME, content);

		content = grunt.file.read(SUITE_FILE_NAME, "UTF8");
		content = content.replace(/\%\%name\%\%/g, "tct-webuifw-tests" + twoDigit(index));
		content = content.replace(/\%\%tizen\-version\%\%/g, TIZEN_VERSION);
		grunt.file.write(SUITE_FILE_NAME, content);

	});

	grunt.registerTask("serialTctWgt", "serial make tct wgts", function (profile) {
		var xmls = grunt.file.expand("tests/tau-runner/xml/tests-*.xml"),
			len = xmls.length,
			i;

		for (i = 1; i <= len; i++) {
			grunt.task.run("copyTctWgt:" + i);
			grunt.task.run("updateTestIndex:" + i);
			grunt.task.run("syncTCT:" + profile + "-" + i);
		}
	});

	grunt.registerTask("serialExecTctWgt", "serial make tct wgts", function (profile) {
		var xmls = grunt.file.expand("tests/tau-runner/xml/tests-*.xml"),
			len = xmls.length,
			i;


		for (i = 1; i <= len; i++) {
			shell.exec("grunt prepare-app --app=./tests/tct-packages/" + i + "/tau-runner/" +
				" --tizen-3-0=true --profile=" + profile + " --no-run=true --app-dest=./tests/tct-packages/" + i + "/ && cd ..");
		}
	});

	grunt.registerTask("tctPackaging", "tct packaging", function () {
		var xmls = grunt.file.expand("tests/tau-runner/xml/tests-*.xml"),
			len = xmls.length,
			i;

		for (i = 1; i <= len; i++) {
			shell.exec("cd tests && ./tct-paker.sh -n " + i);
		}
	});

	grunt.registerTask("tctUpdatePackagesInfo", "tct packaging", function (profile) {
		// create tct test plan
		shell.exec("/opt/tools/shell/tct-plan-generator " +
			"-o /opt/tct/" + TCT_MANAGER_NAME +
			"/packages/pkg_infos/" + profile + "_pkg_info.xml " +
			"--tizen-version " + TCT_MANAGER_NAME +
			" -m '*.zip' --profile " + profile);
	});

	grunt.registerTask("copyTctPackagesToTctMgr", "tct packaging", function (profile) {
		// create tct test plan
		shell.exec("cp tests/tct-package/*.zip /opt/tct/" + TCT_MANAGER_NAME + "/packages/" + profile);
	});

	grunt.registerTask("exit", "finish work", function () {
		process.exit(0);
	});

	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-exec");
	grunt.loadNpmTasks("grunt-sync");

	grunt.registerTask("tau-tct:mobile", ["prepare:mobile", "clean:tct", "copy:tests", "clean:tct-mobile-packages", "fake-tct", "connect:tct", "watch:mobilePackaging"]);
	grunt.registerTask("tau-tct:wearable", ["prepare:wearable", "clean:tct", "copy:tests", "clean:tct-wearable-packages", "fake-tct", "connect:tct", "watch:wearablePackaging"]);
	grunt.registerTask("tau-tct", ["tau-tct:wearable", "tau-tct:mobile"]);
};