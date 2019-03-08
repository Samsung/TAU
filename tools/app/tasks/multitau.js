/*global module:false, require:false*/
var fs = require("fs"),
	path = require("path"),
	deviceMap = require("../data/deviceMap"),
	deviceTypes = require("../data/deviceTypes"),
	xml2js = require("xml2js"),
	child = require("child_process"),
	async = require("async");

module.exports = function (grunt) {
	"use strict";

	var globalAppId = "";

	/**
	 * Look ma, it"s cp -R.
	 * @param {string} src The path to the thing to copy.
	 * @param {string} dest The path to the new copy.
	 */
	function copyRecursiveSync(src, dest) {
		var exists = fs.existsSync(src),
			stats = exists && fs.statSync(src),
			isDirectory = exists && stats.isDirectory();

		if (exists && isDirectory) {
			fs.mkdirSync(dest);
			fs.readdirSync(src).forEach(function (childItemName) {
				copyRecursiveSync(path.join(src, childItemName),
					path.join(dest, childItemName));
			});
		} else {
			fs.linkSync(src, dest);
		}
	}

	function unlinkRecursiveSync(src) {
		var exists = fs.existsSync(src),
			stats = exists && fs.statSync(src),
			isDirectory = exists && stats.isDirectory();

		if (exists) {
			if (isDirectory) {
				fs.readdirSync(src).forEach(function (childItemName) {
					unlinkRecursiveSync(path.join(src, childItemName));
				});
				fs.rmdirSync(src);
			} else {
				fs.unlinkSync(src);
			}
		}
	}

	function mkdirRecursiveSync(dir) {
		var dirs = dir.split(path.sep),
			currentDir = dirs.shift();

		if (!currentDir) {
			// we have absolute pathm -rf
			currentDir = path.sep;
		}
		dirs.forEach(function (dirName) {
			if (!fs.existsSync(currentDir)) {
				fs.mkdirSync(currentDir);
			}
			currentDir += path.sep + dirName;
		});
	}

	function exec(command, callback, options) {
		options = options || {};
		grunt.log.subhead(command);
		child.exec(command, options, function (error, stdout, stderr) {
			if (stderr) {
				grunt.log.error(stderr);
			}
			if (stdout) {
				grunt.log.ok(stdout);
			}
			callback(error, stdout, stderr);
		});
	}

	function getDeviceList(profile, done) {
		exec("sdb devices", function (error, stdout) {
			var devices = {
					wearable: [],
					mobile: []
				},
				count = 0;

			stdout.split("\n").forEach(function (line) {
				var portRegexp = /([0-9A-Za-z.:-]+)[ \t]+(device|online|offline)[ \t]+([^ ]+)/mi,
					match = portRegexp.exec(line);

				if (match) {
					if (match[2] === "offline") {
						grunt.log.warn("Offline device " + match[3]);
					} else {
						if (deviceMap[match[3]] === profile) {
							if (match[2] === "offline") {
								grunt.log.warn("Offline device " + match[3]);
							} else {
								if (devices[deviceMap[match[3]]]) {
									devices[deviceMap[match[3]]].push({
										id: match[1],
										name: match[3],
									});
								} else {
									grunt.log.warn("Unrecognized device " + match[3]);
								}
								count++;
							}
						}
					}
				}
			});
			done(devices, count);
		});
	}

	function prepareWGT(dir, appId, profile, done, appDest) {
		appDest = appDest || "";

		exec("tools/tizen-sdk/bin/web-build " + dir + " -e .gitignore .build* .settings .sdk_delta.info *.wgt .idea", function () {
			exec("mkdir " + dir + ".buildResult", function () {
				exec("cp " + dir + ".project " + dir + ".buildResult/", function () {
					exec("tools/tizen-sdk/bin/web-signing " + dir + ".buildResult -n -p Developer:tools/profiles.xml", function () {
						exec("tools/tizen-sdk/bin/web-packaging -n -o " + path.join(appDest, appId) + ".wgt " + dir + "/.buildResult/", function () {
							done();
						});
					});
				});
			});
		});
	}

	function build(dir, profile, done, appDest) {
		grunt.log.ok("building app for: [" + profile + "] from dir: " + dir);
		fs.exists(dir + "/config.xml", function (exists) {
			if (exists) {
				fs.readFile(dir + "/config.xml", function (err, data) {
					if (err) {
						grunt.log.error(err);
					}

					xml2js.parseString(data, function (err, result) {
						var appId;

						if (err) {
							grunt.log.error(err);
						}

						appId = result.widget["tizen:application"][0].$.id;

						fs.unlink(appId + ".wgt", function () {
							prepareWGT(dir, appId, profile, done, appDest);
						});
					});
				});
			} else {
				grunt.log.error("config.xml does not exists in dir: " + dir);
				done(1);
			}
		});
	}

	function openDebuger(device, port, done) {
		var ip = /^([0-9.]+):/.exec(device.id),
			host = (ip && ip[1]) || "localhost",
			url = "http://" + host + ":" + port + "/";

		exec("chromium-browser --no-first-run --activate-on-launch  --no-default-browser-check --allow-file-access-from-files " +
			"--disable-web-security  --disable-translate--proxy-auto-detect --proxy-bypass-list=127.0.0.1  --app=" + url,
			function () {
				done();
			});
	}

	function runTizen3(device, dir, debug, done) {
		var deviceParam = device ? " -s " + device.id + " " : "";

		fs.readFile(dir + "/config.xml", function (err, data) {
			if (err) {
				grunt.log.error(err);
			}

			xml2js.parseString(data, function (err, result) {
				var appId,
					packageId;

				if (err) {
					grunt.log.error(err);
				}

				appId = result.widget["tizen:application"][0].$.id;
				packageId = result.widget["tizen:application"][0].$.package;

				globalAppId = appId;

				exec("sdb" + deviceParam + " shell app_launcher -k " + appId, function () {
					exec("sdb" + deviceParam + " shell pkgcmd -un " + packageId, function () {
						exec("sdb" + deviceParam + " install " + appId + ".wgt", function () {
							exec("sdb" + deviceParam + " shell app_launcher " + (debug ? "-w" : "") + " -s " + appId, function (error, stdout) {
								var portRegexp = /port: ([0-9]+)/,
									match = portRegexp.exec(stdout);

								if (debug) {
									if (device.id.indexOf(":") > -1) {
										openDebuger(device.id, match[1], done);
									} else {
										exec("sdb" + deviceParam + " forward tcp:" + match[1] + " tcp:" + match[1], function () {
											openDebuger(device, match[1], done);
										});
									}
								} else {
									done();
								}
							});
						});
					});
				});
			});
		});
	}


	function runTizen2(device, dir, debug, done) {
		var deviceParam = device ? " -s " + device.id + " " : "";

		fs.readFile(dir + "/config.xml", function (err, data) {
			if (err) {
				grunt.log.error(err);
			}

			xml2js.parseString(data, function (err, result) {
				var appId,
					packageId;

				if (err) {
					grunt.log.error(err);
				}

				appId = result.widget["tizen:application"][0].$.id;
				packageId = result.widget["tizen:application"][0].$.package;
				exec("sdb" + deviceParam + " shell wrt-launcher -k " + appId, function () {
					exec("sdb" + deviceParam + " uninstall " + packageId, function () {
						exec("sdb" + deviceParam + " install " + appId + ".wgt", function () {
							exec("sdb" + deviceParam + " shell wrt-launcher " + (debug ? "-d" : "") + " -s " + appId, function (error, stdout) {
								var portRegexp = /port: ([0-9]+)/,
									match = portRegexp.exec(stdout);

								if (debug) {
									if (device.id.indexOf(":") > -1) {
										openDebuger(device.id, match[1], done);
									} else {
										exec("sdb" + deviceParam + " forward tcp:" + match[1] + " tcp:" + match[1], function () {
											openDebuger(device, match[1], done);
										});
									}
								} else {
									done();
								}
							});
						});
					});
				});
			});
		});
	}

	function run(device, dir, debug, done) {
		// add device id
		var deviceParam = device ? " -s " + device.id + " " : "";
		// check that wrt-launcher exists

		exec("sdb" + deviceParam + " shell wrt-launcher", function (errorcode, stdout) {
			if (stdout.indexOf("command not found") > -1) {
				// if not exists than run tizen 3 commands
				runTizen3(device, dir, debug, done);
			} else {
				runTizen2(device, dir, debug, done);
			}
		});
	}

	grunt.registerMultiTask("multitau", "", function () {
		var options = this.options(),
			profile = options["profile"],
			testToRun = grunt.option("test"),
			tauDebug = grunt.option("tau-debug"),
			onlyAccepted = grunt.option("only-accepted"),
			noCopy = grunt.option("no-copy-tau") || 0,
			type = grunt.option("type"),
			app = options.app || "MediaQuriesUtilDemo",
			src = options["src"],
			dest = options["dest"],
			appDest = options["app-dest"],
			done = this.async();

		if (src.substr(-1) !== "/") {
			src += "/";
		}


		grunt.log.ok("profile: " + profile);
		grunt.log.ok("type: " + type);
		grunt.log.ok("test: " + (testToRun ? testToRun : "all"));
		grunt.log.ok("tau-debug: " + !!tauDebug);
		grunt.log.ok("app: " + app);
		grunt.log.ok("only-accepted: " + onlyAccepted);
		grunt.log.ok("no-copy-tau: " + !!noCopy);
		grunt.log.ok("src: " + src);
		grunt.log.ok("dest: " + dest);
		grunt.log.ok("app-dest: " + appDest);


		fs.lstat(dest, function (error, stats) {
			if (!noCopy) {
				if (stats && stats.isSymbolicLink()) {
					fs.unlinkSync(dest);
				} else {
					unlinkRecursiveSync(dest);
				}
			}
			async.series([
				function (callback) {
					if (!noCopy) {
						mkdirRecursiveSync(dest);
						grunt.log.ok("copy " + src + profile + " -> " + dest);
						copyRecursiveSync(src, dest);
					}
					callback();
				}
			], getDeviceList.bind(null, profile,
				function (devices, count) {
					var device = null;

					grunt.log.ok("count: " + count);
					if (count) {
						device = devices[profile][0];
						grunt.log.ok("device: " + device);

						//when we run application with more details, for example
						//if its landscape or portrait
						if (typeof type !== "undefined") {
							deviceTypes[profile].forEach(function (info) {
								if (info.device === device.name && info.type === type) {
									build(app, profile, function (error) {
										if (error) {
											grunt.log.error("Error on building");
										}
										run(device, app, tauDebug, done);
									}, appDest);
								} else {
									grunt.log.ok("Device " + device.name + " not match to type " + type + " (" + JSON.stringify(info) + ")");
								}
							});
						// more general, for example run on mobile with portrait
						// and landscape, no need for additional settings
						} else {
							build(app, profile, function (error) {
								if (error) {
									grunt.log.error("Error on building");
								}
								run(device, app, tauDebug, done);
							}, appDest);
						}
					} else {
						done();
					}
				}
			));
		});
	});
};
