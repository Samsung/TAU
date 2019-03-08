/*global module, require*/
var fs = require("fs"),
	path = require("path"),
	deviceMap = {
		"SM-R380": "wearable",
		"SM-R750": "wearable",
		"SM-R750A": "wearable",
		"SM-V700": "wearable",
		"SM-Z130H": "mobile",
		"device-1": "mobile",
		"device-2": "mobile",
		"<unknown>": "tv",
		"Wearable-B2": "wearable"
	},
	deviceNames = {
		"SM-R380": "gear2",
		"SM-R750": "gearS",
		"SM-R750A": "gearS",
		"SM-V700": "gear2",
		"SM-Z130H": "kiran",
		"device-1": "redwood",
		"device-2": "redwood",
		"<unknown>": "tv",
		"Wearable-B2": "gear"
	},
	devicesIds = {};

module.exports = function (grunt) {
	"use strict";

	/**
	 * Look ma, it's cp -R.
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
		dirs.forEach(function (dirName) {
			if (!fs.existsSync(currentDir)) {
				fs.mkdirSync(currentDir);
			}
			currentDir += path.sep + dirName;
		});
	}

	function exec(command, callback) {
		var child = require("child_process");

		grunt.log.subhead(command);
		child.exec(command, function (error, stdout, stderr) {
			if (stderr) {
				grunt.log.error(stderr);
			}
			if (stdout) {
				grunt.log.warn(stdout);
			}
			callback(error, stdout, stderr);
		});
	}

	/**
	 * Gets the list of attached devices
	 * @param profile {null|string} Defines the profile to which devices should
	 * be matched. Use `null` to get all devices.
	 * @param done {function} done callback
	 */
	function getDeviceList(profile, done) {
		exec("sdb devices", function (error, stdout) {
			var devices = {
				wearable: [],
				mobile: [],
				tv: []
			},
				count = 0;
			stdout.split("\n").forEach(function (line) {
				var portRegexp = /([0-9A-Za-z.:]+)[ \t]+(device|online|offline)[ \t]+([^ ]+)/mi,
					match = portRegexp.exec(line);
				if (match) {
					if (deviceMap[match[3]] === profile || profile === null) {
						if (match[2] === "offline") {
							grunt.log.warn("Offline device " + match[3]);
						} else {
							if (devices[deviceMap[match[3]]]) {
								devices[deviceMap[match[3]]].push(match[1]);
								devicesIds[match[1]] = deviceNames[match[3]];
							} else {
								grunt.log.warn("Unrecognized device " + match[3]);
							}
							count++;
						}
					}
				}
			});
			done(devices, count);
		});
	}

	function build(dir, profile, done) {
		var config,
			appId,
			packageId;
		fs.exists(dir + path.sep + "config.xml", function(exists) {
			if (exists) {
				fs.readFile(dir + path.sep + "config.xml", function (err, data) {
					var parseString = require("xml2js").parseString;
					parseString(data, function (err, result) {
						config = result;
						appId = result.widget["tizen:application"][0].$.id;
						packageId = result.widget["tizen:application"][0].$.package;
						fs.unlink(appId + ".wgt", function () {
							exec(path.join("tools", "tizen-sdk", "bin", "web-build") +" " + dir + " -e .gitignore .build* .project .settings .sdk_delta.info *.wgt", function () {
								exec(path.join("tools", "tizen-sdk", "bin", "web-signing") + " " + appId + path.sep + ".buildResult -n -p default:tools" + path.sep + (profile === "tv" ? "tv-" : "") + "profiles.xml", function () {
									exec(path.join("tools", "tizen-sdk", "bin", "web-packaging") + " -n -o " + appId + ".wgt " + dir + path.sep + ".buildResult" + path.sep, function () {
										done();
									});
								});
							});
						});
					});
				});
			} else {
				grunt.log.error("config.xml not exists");
				done(1);
			}
		});
	}

	function screenshot(device, profile, app, done) {
		var deviceParam = device ? " -s " + device + " " : "";
		exec("sdb" + deviceParam + " root on", function () {
			exec("sdb" + deviceParam + " shell xwd -root -out /tmp/screen.xwd", function () {
				var dir = path.join("screenshots", profile, devicesIds[device], app) + path.sep;
				mkdirRecursiveSync(dir);
				// Add current date and time but remove problematic chars
				dir += (new Date()).toISOString().replace(/[\.:]/g, "");
				exec("sdb" + deviceParam + " pull /tmp/screen.xwd " + dir + ".xwd", function () {
					exec("convert " + dir + ".xwd " + dir + ".png", function () {
						fs.unlink(dir + ".xwd", function() {
							grunt.log.ok("Screenshot saved to: " + dir + ".png");
							done();
						});
					});
				});
			});
		});
	}

	function openDebuger(device, port, done) {
		var ip = /^([0-9.]+):/.exec(device),
			host = (ip && ip[1]) || "localhost",
			url = "http://" + host + ":" + port + "/inspector.html?page=1";
		exec("chromium-browser --no-first-run --activate-on-launch  --no-default-browser-check --allow-file-access-from-files " +
			"--disable-web-security  --disable-translate--proxy-auto-detect --proxy-bypass-list=127.0.0.1  --app=" + url,
			function () {
				done();
			});
	}

	function run(device, dir, debug, done) {
		var config,
			appId,
			packageId,
			deviceParam = device ? " -s " + device + " " : "";
		fs.readFile(dir + path.sep + "config.xml", function (err, data) {
			var parseString = require("xml2js").parseString;
			parseString(data, function (err, result) {
				config = result;
				appId = result.widget["tizen:application"][0].$.id;
				packageId = result.widget["tizen:application"][0].$.package;
					exec("sdb" + deviceParam + " shell wrt-launcher -k " + appId, function () {
						exec("sdb" + deviceParam + " uninstall " + packageId, function () {
							exec("sdb" + deviceParam + " install " + appId + ".wgt", function () {
								exec("sdb" + deviceParam + " shell wrt-launcher " + (debug ? "-d" : "") + " -s " + appId, function (error, stdout) {
									var portRegexp = /port: ([0-9]+)/,
										match = portRegexp.exec(stdout);
									if (debug) {
										if (device.indexOf(":") !== -1) {
											openDebuger(device, match[1]);
										} else {
											exec("sdb" + deviceParam + " forward tcp:" + match[1] + " tcp:" + match[1], function () {
												openDebuger(device, match[1]);
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

	grunt.registerTask("screenshot", function () {
		var options = this.options(),
			disableSDB = options["disablesdb"],
			done = this.async();

		if (disableSDB) {
			grunt.log.error("SDB disabled, finishing");
			done();
		} else {
			getDeviceList(null,
				function (allDevices, count) {
					var async = require("async"),
						asyncTasks = [],
						allProfiles = Object.keys(allDevices);

					allProfiles.forEach(function (profile) {
						var devices = allDevices[profile];

						devices.forEach(function (device) {
							asyncTasks.push(function (next) {
								screenshot(device, profile, "", next);
							});
						});
					});

					async.series(asyncTasks, done);
				});
		}
	});

	grunt.registerMultiTask("multitau", "", function () {
		var options = this.options(),
			profile = options.profile,
			debug = grunt.option("tau-debug"),
			noRun = grunt.option("no-run"),
			app = options.app || "MediaQuriesUtilDemo",
			src = options.src,
			disableSDB = options.disablesdb,
			dest = options.dest,
			done = this.async(),
			destArray = dest.split(path.sep);

		if (src.substr(-1) !== path.sep) {
			src += path.sep;
		}

		destArray.pop();
		fs.lstat(destArray.join(path.sep), function(error, stats) {
			if (stats && stats.isSymbolicLink()) {
				grunt.log.ok("delete " + destArray.join(path.sep));
				fs.unlinkSync(destArray.join(path.sep));
			}
			fs.lstat(dest, function (error, stats) {
				if (stats && stats.isSymbolicLink()) {
					grunt.log.ok("delete " + dest);
					fs.unlinkSync(dest);
				} else {
					unlinkRecursiveSync(dest);
				}
				mkdirRecursiveSync(dest);
				grunt.log.ok("copy " + src + profile + " -> " + dest);
				copyRecursiveSync(src + profile, dest);
				if (disableSDB) {
					done();
				} else {
					getDeviceList(profile,
						function (devices, count) {
							if (count) {
								build(app, profile, function (error) {
									var async = require("async"),
										tasks = [];

									if (error) {
										grunt.log.error("Error on building");
										done();
									} else {
										if (!noRun) {
											devices[profile].forEach(function (device) {
												tasks.push(run.bind(null, device, app, debug));
												tasks.push(function (next) {
													// Timeout set because we need to wait
													// for the application to start
													setTimeout(function () {
														screenshot(device, profile, app, next);
													}, 5000);
												});
											});
											async.series(tasks, done);
										} else {
											done();
										}
									}
								});
							} else {
								done();
							}
						}
					);
				}
			});
		});
	});
};

