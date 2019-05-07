/*global module:false, require:false*/
/* eslint no-console: 0 */
var TIME_TICK = 0,
	FIRST_TIME_TICK = 3000,
	fs = require("fs"),
	path = require("path"),
	xml2js = require("xml2js"),
	child = require("child_process"),
	easyimg = require("easyimage"),
	deviceMap = require("../../../tools/app/data/deviceMap.js"),
	deviceTypes = require("../../../tools/app/data/deviceTypes.js"),
	newEmulatorDeviceName = "emulator-mobile",

	requestFileName = "test-request.txt",
	responseFileName = "test-response.txt",
	remoteFolder = "/opt/usr/home/owner/media/Downloads",
	DEVICE_IMAGE_FOLDER = "/opt/usr/home/owner/media/Downloads",
	requestFullFileName = path.join(remoteFolder, requestFileName),
	responseFullFileName = path.join(remoteFolder, responseFileName),
	localResponseFullFileName,

	screenshots = [],
	profile,
	type,
	app,
	globalAppId,
	localRequestFile = null,
	deviceParam,
	deviceName,

	tempFolder = null,

	uiTests = {},
	i = 0,
	doneCallback,
	end = 150,
	deviceSizes = {
		mobile: "720x1280",
		wearable: "360x360"
	},
	counterOfRepeatOnError = 0,
	LIMIT_OF_REPEAT_ON_ERROR = 50,
	lastScreen;

function exec(command, callback, options) {
	options = options || {};
	//console.log.subhead(command);
	child.exec(command, options, function (error, stdout, stderr) {
		callback(error, stdout, stderr);
	});
}

function done() {
	// clear temp dir
	fs.rmdir(tempFolder, function (error) {
		if (error) {
			console.log(error);
		}
		console.log("Success done");
		removeAllScreenshots(deviceParam, function () {
			doneCallback();
		});
	});
}

function removeLocalRequestFile(file, onSuccess, onError) {
	fs.unlink(file, function (error) {
		if (error) {
			onError();
		} else {
			onSuccess();
		}
	});
}
function removeLocalResponseFile(file, onSuccess, onError) {
	fs.unlink(file, function (error) {
		if (error) {
			onError();
		} else {
			onSuccess();
		}
	});
}

function takeScreenshot(pageName, onDone) {
	var screenshotItem;

	pageName = pageName.replace(".html", "");

	screenshotItem = screenshots.filter(function (item) {
		return item.name === pageName;
	});

	screenshotItem = screenshotItem[0];
	if (screenshotItem) {
		screenshot(profile, type, app, screenshotItem, onDone);
	}
}

function runApp(done) {
	exec("sdb" + deviceParam + " shell app_launcher -s " + globalAppId, function () {
		done();
	});
}

function next(done) {
	// end of watching
	if (i >= end) {
		exec(
			`sdb ${deviceParam} dlog -d | grep vUf39tzQ3t`,
			function (error, stdout, stderr) {
				console.log("status: ", error);
				console.log("stdout: ", stdout);
				console.log("stderr: ", stderr);
				if (stdout.indexOf("CRASH_MANAGER") > -1) {
					console.log("Was crash!!!", lastScreen);
					runApp(function () {
						prepareResponse(lastScreen, function () {
							setTimeout(tick.bind(null, done), TIME_TICK);
						});
					});
				} else {
					done();
				}
			});
	} else {
		setTimeout(tick.bind(null, done), TIME_TICK);
	}
}

function removeRemoteRequest(onSuccess) {
	exec(`sdb ${deviceParam} root on`, function (error) {
		if (error) {
			console.log("error: " + error);
		}
		exec(`sdb ${deviceParam} shell 'rm ${requestFullFileName}'`, function (error) {
			if (error) {
				console.log("error: " + error);
			}
			exec(`sdb ${deviceParam} root off`, function (error) {
				if (error) {
					console.log("error: " + error);
				}
				onSuccess();
			});
		});
	});
}

function setLongLife() {
	return new Promise(function (resolve) {
		exec(
			`sdb ${deviceParam} root on`,
			function (error) {
				if (error) {
					console.log("error: " + error);
				}
				exec(
					`sdb ${deviceParam} shell vconftool set -t int db/setting/lcd_backlight_normal 0 -f`,
					function (error) {
						if (error) {
							console.log("error: " + error);
						}
						exec(
							`sdb ${deviceParam} root off`,
							function (error) {
								if (error) {
									console.log("error: " + error);
								}
								resolve();
							});
					});
			});
	});
}

function sendResponse(onSuccess) {
	exec(
		`sdb ${deviceParam} push ${localResponseFullFileName} ${remoteFolder}`,
		function (error) {
			if (error) {
				console.log("error: " + error);
			}
			removeRemoteRequest(onSuccess);
		});
}

function prepareResponse(data, onSuccess) {
	localResponseFullFileName = path.join(tempFolder, responseFileName);

	console.log("Sent: " + data);
	fs.writeFile(localResponseFullFileName, data, "utf8", function (error) {
		if (error) {
			// if file not exists
			console.log("error", error);
		} else {
			sendResponse(onSuccess);
		}
	});
}


function parseData(data, onSuccess) {
	var onDone,
		matched,
		cmd,
		param;

	onDone = function () {
		prepareResponse(`done(${param})`, onSuccess);
	};

	matched = data.match(/^[^:]+/gi);

	if (matched) {
		cmd = matched[0];
		param = data.replace(cmd + ":", "");
	}

	if (cmd) {
		switch (cmd) {
			case "take-screenshot" :
				lastScreen = param;
				takeScreenshot(param, onDone);
				break;
			default :
				onDone();
				break;
		}
	} else {
		onDone();
	}

}

function tick(done) {
	exec(
		`sdb ${deviceParam} pull ${requestFullFileName} ${tempFolder}`,
		function (error, stdout, stderr) {
			i++;

			if (error) {
				next(done);
			} else {
				// check file content
				localRequestFile = path.join(tempFolder, requestFileName);

				fs.readFile(localRequestFile, "utf8", function (error, data) {
					if (error) {
						// if file not exists
						console.log("error1", error);
						next(done);
					} else if (data === "") {
						// wait for full data
						console.log("uncompleted data");
						next(done);
					} else {
						parseData(data, function () {

							console.log("Received: " + data);

							if (data.indexOf("end!") === 0) {
								i = end;
							} else {
								i = 0;
							}

							// remove request file from temporary dir;
							removeLocalRequestFile(localRequestFile,
								function () {
									removeLocalResponseFile(localResponseFullFileName,
										function () {
											next(done);
										},
										function () {
											console.log("removeLocalResponseFile: error");
										}
									);
								},
								function () {
									console.log("onError");
								}
							);
						});
					}
				});

				if (stderr) {
					//console.log("stderror: " + stderr);
				}
			}

		}
	);
}

function removeAllScreenshots(deviceParam, done) {
	console.log("removing all screenshots");
	exec("sdb" + deviceParam + " root on &", function () {
		exec("sdb" + deviceParam + " shell \"rm -r \\\`find " + DEVICE_IMAGE_FOLDER + " -name topvwins-*\\\`\"", function () {
			exec("sdb" + deviceParam + " root off &", function () {
				done();
			});
		});
	});
}

function createCircle(path, size, outputTempFilePath, outputFilePath, callback) {
	if (type === "c-3.0") {
		easyimg.exec("convert " + path + " \\( -size " +
			size + "x" + size + " xc:none -fill white -draw \"circle " +
			(size / 2 - 0.5) + "," + (size / 2 - 0.5) + " " + (size / 2) + ",0\" \\) -compose copy_opacity -composite " +
			outputTempFilePath).then(
			function () {
				easyimg.exec("composite " + outputTempFilePath + " -size " + size + "x" + size + " canvas:white " + outputFilePath).then(
					function () {
						fs.unlink(outputTempFilePath, function () {
							callback();
						});
					},
					function () {
						callback();
					});
			}, function () {
				callback();
			}
		);
	} else {
		callback();
	}
}

function saveWindow(deviceParam, app, profile, type, screen, onSuccess, onError) {
	exec("sdb" + deviceParam + " shell 'cd " + DEVICE_IMAGE_FOLDER + ";enlightenment_info -dump topvwins'",
		function (error, result) {
			var dir,
				resultDir;

			if (error) {
				counterOfRepeatOnError++;
				saveWindow(deviceParam, app, profile, type, screen, onSuccess, onError);
			} else if (result.match(/^error:/)) {
				counterOfRepeatOnError++;
				if (counterOfRepeatOnError < LIMIT_OF_REPEAT_ON_ERROR) {
					console.log("attempt " + counterOfRepeatOnError);
					saveWindow(deviceParam, app, profile, type, screen, onSuccess, onError);
				} else {
					// too many attempt
					counterOfRepeatOnError = 0;
					onError();
				}
			} else {
				dir = app + "/../../result/" + profile + "/" + type + "/" + screen.name;
				resultDir = result.replace("directory: ", "").replace(/[\r\n]/gm, "");

				counterOfRepeatOnError = 0;
				onSuccess(dir, resultDir);
			}
		});
}

function clean(filename, dir, done) {
	fs.unlink(filename, function () {
		fs.unlink(dir + "_crop-1.png", function () {
			fs.unlink(dir + "_raw.png", function () {
				done();
			});
		});
	})
}

function convertImage(profile, screen, dir, done) {
	var width = screen.width || 257,
		height = screen.height || 457;

	exec("convert " + dir + "_raw.png -crop " + deviceSizes[profile] + " " + dir + "_crop.png", function () {
		fs.exists(dir + "_crop-0.png", function (exists) {
			var filename = dir + (exists ? "_crop-0.png" : "_crop.png");

			exec("convert " + filename + " -resize " + width + "x" + height + "\\! " + dir + ".png", function () {
				exec("sdb" + deviceParam + " root off", function () {
					createCircle(dir + ".png", width, dir + "_.png", dir + ".png", function () {
						clean(filename, dir, done);
					});
				});
			});
		});
	});
}

function screenshotTizen3(profile, type, app, screen, done) {
	exec("sdb" + deviceParam + " root on", function () {
		exec("sdb" + deviceParam + " shell enlightenment_info -reslist", function (error, result) {
			var regexp = new RegExp("^.*" + globalAppId + ".*$", "gm"),
				match = result.match(regexp)[0],
				PID = match.split(/\s+/)[2];

			exec("sdb" + deviceParam + " shell enlightenment_info -topvwins", function (error, result) {
				var regexp = new RegExp("^.*\\\s" + PID + "\\\s.*$", "gm"),
					matches = result.match(regexp),
					match = "",
					winID;

				if (matches) {
					match = matches[matches.length - 1];
					winID = match.split(/\s+/)[2];

					saveWindow(deviceParam, app, profile, type, screen, function (dir, resultDir) {
						exec("sdb" + deviceParam + " pull " + resultDir + "/" + winID + ".png " + dir + "_raw.png", function (error) {
							if (error) {
								exec("sdb" + deviceParam + " pull " + resultDir + "/" + winID + "_0.png " + dir + "_raw.png", function () {
									convertImage(profile, screen, dir, done);
								});
							} else {
								convertImage(profile, screen, dir, done);
							}
						});
					}, function () {
						// onError
						done();
					});

				} else {
					console.log("Device issue: app window is not available! App PID(" + PID + ")");
					exec("sdb" + deviceParam + " root off", function () {
						// wait for next tick
					});
				}

			});
		});
	});
}


function screenshotTizen2(profile, type, app, screen, done) {
	exec("sdb" + deviceParam + " root on &", function () {
		exec("sdb" + deviceParam + " shell xwd -root -out /tmp/screen.xwd", function () {
			var dir = app + "/../../result/" + profile + "/" + screen.name;

			exec("sdb" + deviceParam + " pull /tmp/screen.xwd " + dir + ".xwd", function () {
				var width = screen.width || 257,
					height = screen.height || 457;

				exec("convert -resize " + width + "x" + height + "\\! " + dir + ".xwd " + dir + ".png", function () {
					fs.unlink(dir + ".xwd", function () {
						done();
					});
				});
			});
		});
	});
}

function screenshot(profile, type, app, screen, done) {
	// check tizen version
	if (globalAppId) {
		// if not exists than run tizen 3 commands
		screenshotTizen3(profile, type, app, screen, done);
	} else {
		screenshotTizen2(profile, type, app, screen, done);
	}
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
					console.warn("Offline device " + match[3]);
				} else {
					if (deviceMap[match[3]] === profile) {
						if (match[2] === "offline") {
							console.warn("Offline device " + match[3]);
						} else {
							if (devices[deviceMap[match[3]]]) {
								devices[deviceMap[match[3]]].push({
									id: match[1],
									name: match[3]
								});
							} else {
								console.warn("Unrecognized device " + match[3]);
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

function getDevice(done) {
	getDeviceList(profile,
		function (devices, count) {
			if (count) {
				devices[profile].forEach(function (device) {
					deviceTypes[profile].forEach(function (info) {
						if (info.device === device.name && info.type === type) {
							deviceParam = " -s " + device.id + " ";
							deviceName = info.device;
						}
					});
				});
			}
			done();
		});
}

uiTests.config = function (config, done) {
	screenshots = config.screenshots;
	profile = config.profile;
	type = config.type;
	app = config.app;
	fs.readFile(app + "/config.xml", function (err, data) {
		if (err) {
			console.error(err);
		}

		xml2js.parseString(data, function (err, result) {
			var appId;

			if (err) {
				console.error(err);
			}

			appId = result.widget["tizen:application"][0].$.id;
			globalAppId = appId;
			getDevice(done);
		});
	});
};

function makeResultDirectories() {
	return new Promise(function (resolve) {
		fs.mkdir(app + "/../../result", function () {
			fs.mkdir(app + "/../../result/" + profile, function () {
				fs.mkdir(app + "/../../result/" + profile + "/" + type, function () {
					resolve();
				});
			});
		});
	});
}

function clearRequestResponseFiles() {
	return new Promise(function (resolve) {
		exec(`sdb ${deviceParam} shell rm ${requestFullFileName}`, function () {
			exec(`sdb ${deviceParam} shell rm ${responseFullFileName}`, function () {
				resolve();
			});
		});
	});
}

function makeTmpFolder() {
	return new Promise(function (resolve) {
		fs.mkdir(path.join(__dirname, "../../../temp"), function () {
			fs.mkdtemp(path.join(__dirname, "../../../temp/ui-tests-"),
				function (error, folder) {
					if (error) {
						console.log("(fs.mkdtemp) " + error);
						return;
					}
					tempFolder = folder;
					resolve();
				});
		});
	});
}

uiTests.run = function (callback) {
	i = 0;
	doneCallback = callback;
	clearRequestResponseFiles()
		.then(setLongLife)
		.then(makeResultDirectories)
		.then(makeTmpFolder)
		.then(function () {
			setTimeout(tick.bind(null, done), FIRST_TIME_TICK);
		});
}

module.exports = uiTests;
