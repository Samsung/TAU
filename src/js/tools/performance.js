/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/*global define, ns */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../core/core"
	],
		function () {
		//>>excludeEnd("tauBuildExclude");
			var tizen = window.tizen;

			window.tauPerf = {
				phantomRun: window.callPhantom && window._phantom,
				collect: function (type, section, stepName, stepTime, stepDuration) {
					if (this.phantomRun) {
						window.callPhantom({
							type: type,
							section: section,
							stepName: stepName,
							stepTime: stepTime,
							stepDuration: stepDuration
						});
					}
				},
				saveToFile: !!(tizen && tizen.filesystem),
				print: function () {
					if (!this.phantomRun) {
						ns.log.apply(ns, arguments);
					}
				},
				data: {},
				steps: {},
				start: function (sectionName) {
					var text;

					this.data[sectionName] = window.performance.now();
					this.steps[sectionName] = [];

					text = "[TAU Perf][%c" + sectionName + "%c][start] at %c" + this.data[sectionName].toFixed(3);

					this.print(text, "color:blue", "color:inherit", "font-weight: bold");

					this.collect("performance.data.start", sectionName, "start", this.data[sectionName]);
				},
				get: function (sectionName, stepName) {
					var text,
						stepDuration,
						timeNow = window.performance.now();

					if (this.data[sectionName]) {
						stepDuration = timeNow - this.data[sectionName];
						text = "[TAU Perf][%c" + sectionName + "%c] %c+" + stepDuration.toFixed(3) + "ms%c";

						if (stepName) {
							text += " | [Step] " + stepName;
						//rawText += " | [Step] " + stepName;
						} else {
							stepName = "Step" + this.steps[sectionName].length;
						}

						this.steps[sectionName].push({
							name: stepName,
							time: timeNow,
							duration: stepDuration
						});

						this.print(text, "color:blue", "color:inherit", "font-weight: bold", "font-weight:normal");

						this.collect("performance.data", sectionName, stepName, timeNow, stepDuration);

						return text;
					}
					return null;
				},
				finish: function () {
					var self = this;

					if (self.saveToFile) {
						tizen.filesystem.resolve("documents", function (documents) {
							var resultFile,
								file = "tauperf_result.json";

							try {
							// On some tizen version this throws error and on other just returns null
								resultFile = documents.resolve(file);

								if (resultFile === null) {
									resultFile = documents.createFile(file);
								}
							} catch (e) {
								resultFile = documents.createFile(file);
							}

						// Save reference to done
							self.start("performance.done");
							resultFile.openStream("w", function (fs) {
								var stringToWrite = JSON.stringify({
									data: self.data,
									steps: self.steps
								});

								fs.write(stringToWrite);

								fs.close();
								tizen.application.getCurrentApplication().exit();
							}, function (e) {
								ns.error("Problem with opening file for writing " + e.message);
							}, "UTF-8");
						}, function (e) {
							ns.error("Error: " + e.message);
							tizen.application.getCurrentApplication.exit();
						}, "rw");
					} else {
						self.collect("performance.done");
					}
				}
			};

			window.tauPerf.start("performance.start");

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		});
	//>>excludeEnd("tauBuildExclude");
}());
