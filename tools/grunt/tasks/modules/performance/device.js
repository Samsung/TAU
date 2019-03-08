/*global module, console, require, __dirname */
var fs = require("fs"),
	grunt = require("grunt"),
	BaseTester = require("./base"),
	tizen = require("../tizen");

/**
 * Tester class for testing on device and emulator
 * @author Piotr Karny <p.karny@samsung.com>
 */
module.exports = (function () {
	var proto,
		baseTesterPrototype = BaseTester.prototype,
		errorCount = 0,
		// TEMP_PATH = "tmp",
		TARGET_RESULT_FILE = "/opt/usr/media/Documents/tauperf_result.json",
		alreadyInstalled = [];

	proto = new BaseTester();

	function DevicePerformanceTester() {
		var self = this;

		BaseTester.call(self);

		self._initialized = false;
		//self.tempFilename = "tester_" + (Date.now()) + ".json";
	}

	function runAndGetResults(tester, target, targetName, applicationId) {
		tizen.run(applicationId, null, null, function (exitedOnTarget, exitedOnTargetName/*, stoppedApplicationId*/) {
			tizen.pull(TARGET_RESULT_FILE, null, true, function (target, targetName, fileContent, localPath) {

				tester.queueProgress++;

				// @TODO check memory usage during heavy testing, this may be very consuming for large tests in case of problems change back to file based approach

//					if (tester.queueLength - tester.queueProgress > 0) {
//						// Separate results
//						fileContent += ",";
//					} else if (tester.queueProgress === tester.queueLength) {
//						// Append "]" as array end to the final file
//						fileContent += "]";
//					}

				//fs.appendFileSync(tempFile, fileContent);

				tester.addData(target, fileContent);

				fs.unlinkSync(localPath);

				grunt.verbose.or.write(".");

				if (tester.queueProgress < tester.queueLength) {
					tester.runQueue(target, targetName);
				} else {
					tester.finishQueues();
				}

			}, function () {
				// pull fail
				grunt.log.error("Pull fail ", arguments);
			}, exitedOnTarget, exitedOnTargetName);
		}, target, targetName);
	}

	proto.run = function (doneCallback) {
		var self = this;

		baseTesterPrototype.run.call(self, doneCallback);

		tizen.init(null, function () {
			self._initialized = true;

			tizen.getTargets(function (targets) {
				self.prepareTargetQueues(targets);

				self.info.start = Date.now();

				// Start queue for every device
				targets.forEach(function (target) {
					self.runQueue(target.uid, target.name);
				});
			});
		});
	};

	proto.runQueue = function (targetUID, targetName) {
		var self = this,
			queue = this.queue[targetUID],
			targetQueueLength = queue.length,
			appToProcess,
			// tempFile = TEMP_PATH + path.sep + self.tempFilename,
			runDeviceTest;

		// Create temporary directory if it doesn't exist
		// grunt.file.mkdir(TEMP_PATH);

		if (targetQueueLength > 0) {
			appToProcess = queue.pop();

			if (appToProcess) {

				// @TODO check memory usage during heavy testing, this may be very consuming for large tests in case of problems change back to file based approach
//					if (self.queueProgress === 0) {
//						// Prepend "[" as array start to the final file
//						fs.writeFileSync(tempFile, "[");
//					}

				runDeviceTest = runAndGetResults.bind(null, self, targetUID, targetName);

				// @TODO timeout for running tests

				// Prevent installing application on every run
				if (alreadyInstalled.indexOf(targetUID + "|" + appToProcess.wgtPath) > -1) {
					runDeviceTest(appToProcess.id);
				} else {
					// Install success callback gives: applicationId as argument
					tizen.install(appToProcess.wgtPath, function (applicationId, wgtPath/*, message*/) {
						// Thanks to references to queue elements we may add id for all queue iterations once
						// this can make some problems when implementing queue in a different way
						if (!appToProcess.id) {
							appToProcess.id = applicationId;
						}

						alreadyInstalled.push(targetUID + "|" + wgtPath);

						runDeviceTest(applicationId);
					}, null, targetUID, targetName);
				}
			} else {
				grunt.log.error("Unexpected empty element on queue " + appToProcess + self.queueProgress + "/" + self.queueLength);
			}
		}
	};

	proto.finishQueues = function () {
		var self = this;
		// var tempFile = TEMP_PATH + path.sep + this.tempFilename;

		// this.addDataList(grunt.file.readJSON(tempFile));

		self.info.finish = Date.now();

		grunt.log.ok();
		grunt.log.ok(self.queueProgress + " tests run in " + ((self.info.finish - self.info.start) / 1000) + "s");

		alreadyInstalled.length = 0;

		grunt.log.writeln("Collecting detailed targets' configuration");
		self.collectInfo(function () {
			self.doneCallback(errorCount === 0);
		});
	};

	proto.addData = function (targetUID, jsonString) {
		var storage = this.storage,
			storageDevice,
			jsonData = JSON.parse(jsonString),
			data = jsonData.data,
			steps = jsonData.steps,
			sectionNames = Object.keys(data);

		if (!storage[targetUID]) {
			storage[targetUID] = {};
		}

		storageDevice = storage[targetUID];

		sectionNames.forEach(function (sectionName) {
			if (!storageDevice[sectionName]) {
				storageDevice[sectionName] = {
					start: [],
					steps: {}
				};
			}

			storageDevice[sectionName].start.push(data[sectionName]);

			steps[sectionName].forEach(function (step) {
				if (!storageDevice[sectionName].steps[step.name]) {
					storageDevice[sectionName].steps[step.name] = [];
				}

				storageDevice[sectionName].steps[step.name].push(parseFloat(step.duration));
			});

		});
	};

	proto.addDataList = function (device, jsonData) {
		var addData = this.addData.bind(this, device);

		if (jsonData.length > 0) {
			jsonData.forEach(addData);
		}
	};

	proto.collectInfo = function (doneCallback) {
		var self = this;

		tizen.getTargets(function (targetList) {
			var targetsInfo = self.info.targets;

			targetList.forEach(function (device) {
				targetsInfo[device.uid] = {
					uid: device.uid,
					name: device.name,
					emulator: (device.uid.indexOf("emulator-") === 0),
					model: null,
					build: null,
					buildDate: null,
					webkitBuild: null
				};
			});

			doneCallback();
		});
	};

	DevicePerformanceTester.prototype = proto;

	return DevicePerformanceTester;
}());
