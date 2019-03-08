/*global TESTS, CURRENT_ITERATION, TESTS_PER_ITERATION, $, QUnit, ok*/
/*eslint camelcase: "off"*/

var RESOURCE_DIR = "/home/owner/share/";

var Runner = function () {
	var self = this,
		currentModule,
		currentTest,
		assertCount,
		currentTestPath,
		currentRun = {
			modules: [],
			total: 0,
			passed: 0,
			failed: 0,
			start: new Date(),
			time: 0
		};

	function noop() {
		console.log("noop");
	}

	function pushTestModule(run, moduleName) {
		var i,
			l,
			modules = run.modules,
			module = {
				name: moduleName,
				tests: [],
				total: 0,
				passed: 0,
				failed: 0,
				start: new Date(),
				time: 0,
				stdout: [],
				stderr: []
			};

		// Avoid duplicates, if module exists, return it
		// It's important for generating tcresult files by runner.js
		// Splited modules for file, generated one file instead few tcresult files
		for (i = 0, l = modules.length; i < l; i++) {
			if (modules[i].name === moduleName) {
				return modules[i];
			}
		}

		modules.push(module);
		return module;
	}

	$.extend(self, {
		frame: window.frames["testFrame"],
		testTimeout: 10 * 1000,
		attemptsLimit: 20,
		attempt: 0,
		$frameElem: $("#testFrame"),
		assertionResultPrefix: "assertion result for test:",
		onTimeout: function () {
			var src = "",
				urlOperand = "?",
				frame = self.$frameElem.get(0);

			// runner will try again perform test (several attepts)
			if (self.attempt > self.attemptsLimit) {
				//QUnit.start();
				self.onFrameDone({
					failed: 0,
					passed: 0,
					total: 0,
					runtime: 0
				});
			} else {
				self.attempt++;
				src = frame.getAttribute("src");
				if (src.match(/\?/)) {
					urlOperand = "&";
				}

				if ((src.match(/attempt/))) {
					src = src.replace(/attempt=([0-9]+)/, function () {
						return "attempt=" + self.attempt;
					});
				} else {
					src += urlOperand + "attempt=" + self.attempt;
				}

				self.$frameElem.one("load", self.onFrameLoad);
				frame.setAttribute("src", src);
			}
		},

		onFrameLoad: function () {
			// establish a timeout for a given suite in case of async tests hanging
			self.testTimer = setTimeout(self.onTimeout, self.testTimeout);

			// it might be a redirect with query params for push state
			// tests skip this call and expect another
			if (!self.frame.QUnit) {
				self.$frameElem.one("load", self.onFrameLoad);
				return;
			}

			self.onBegin();

			// when the QUnit object reports done in the iframe
			// run the onFrameDone method
			self.frame.QUnit.done = self.onFrameDone;
			self.frame.QUnit.testDone = self.onTestDone;
			self.frame.QUnit.log = self.onLog;
			self.frame.QUnit.begin = self.onBegin;
			self.frame.QUnit.moduleStart = self.onModuleStart;
			self.frame.QUnit.moduleDone = self.onModuleDone;
			self.frame.QUnit.testStart = self.onTestStart;

			if (!self.frame.QUnit.config.autostart) {
				self.frame.QUnit.start();
			}
		},
		onBegin: function () {
			currentRun = {
				modules: [],
				total: 0,
				passed: 0,
				failed: 0,
				start: new Date(),
				time: 0
			};
		},
		onModuleStart: function () {
			currentModule = pushTestModule(currentRun, currentTestPath);
		},
		onTestStart: function (data) {
			if (!currentModule) {
				currentModule = pushTestModule(currentRun, currentTestPath);
			}

			assertCount = 0;
			currentTest = {
				name: data.name,
				failedAssertions: [],
				total: 0,
				passed: 0,
				failed: 0,
				start: new Date(),
				time: 0
			};

			currentModule.tests.push(currentTest);
		},
		onLog: function (data) {
			assertCount++;
			//if (!data.result) {
			currentTest.failedAssertions.push(data);
			currentModule.stdout.push("[" + currentModule.name + ", " + currentTest.name + ", " + assertCount + "] " + data.message);
			//}
		},
		onTestDone: function (result) {
			currentTest.time = (new Date()).getTime() - currentTest.start.getTime();  // ms
			currentTest.total = result.total;
			currentTest.passed = result.passed;
			currentTest.failed = result.failed;

			currentTest = null;

			QUnit.ok(!(result.failed > 0), result.name);
			self.recordAssertions(result.total - result.failed, result.name);
		},

		onModuleDone: function () {
			currentModule = null;
		},

		onFrameDone: function (result) {
			// make result object
			var details = {};

			details.failed = result.failed;
			details.passed = result.passed;
			details.total = result.total;
			details.time = result.runtime;

			// make sure we don't time out the tests
			clearTimeout(self.testTimer);
			self.attempt = 0;

			// TODO decipher actual cause of multiple test results firing twice
			// clear the done call to prevent early completion of other test cases
			self.frame.QUnit.done = noop;
			self.frame.QUnit.testDone = noop;
			self.frame.QUnit.log = noop;
			self.frame.QUnit.begin = noop;
			self.frame.QUnit.moduleStart = noop;
			self.frame.QUnit.moduleDone = noop;
			self.frame.QUnit.testStart = noop;

			// hide the extra assertions made to propogate the count
			// to the suite level test
			self.hideAssertionResults();

			if (currentModule) {
				// FIXME: this is wrong, check arguments variable
				pushTestModule(currentRun, currentModule.name);

				currentModule = null;
			}

			generateReport(details, UnitTCRunner.getTestResult(), false);
		},

		getTestResult: function () {
			return currentRun;
		},

		getCurrentTest: function () {
			return currentTest;
		},

		recordAssertions: function (count, parentTest) {
			var i;

			for (i = 0; i < count; i++) {
				ok(true, self.assertionResultPrefix + parentTest);
			}
		},

		hideAssertionResults: function () {
			$("li:not([id]):contains('" + self.assertionResultPrefix + "')").hide();
		},

		exec: function (data) {
			var template = self.$frameElem.attr("data-src");

			$.each(data, function (i, dir) {
				if (i >= CURRENT_ITERATION * TESTS_PER_ITERATION && i < (CURRENT_ITERATION + 1) * TESTS_PER_ITERATION) {
					QUnit.asyncTest(dir, function () {
						currentTestPath = dir;
						self.dir = dir;
						self.$frameElem = $("#testFrame");
						self.$frameElem.one("load", self.onFrameLoad);
						self.$frameElem.attr("src", template.replace("{{testfile}}", dir));
					});
				}
			});

			// having defined all suite level tests let QUnit run
			setTimeout(QUnit.start, 2000);
		}
	});
};

var UnitTCRunner;
var m = 0;

//Generate XML
var generateReport = function (results, run, end) {
	var pad = function (n) {
			return n < 10 ? "0" + n : n;
		},

		toISODateString = function (d) {
			return d.getUTCFullYear() + "-" +
				pad(d.getUTCMonth() + 1) + "-" +
				pad(d.getUTCDate()) + "T" +
				pad(d.getUTCHours()) + ":" +
				pad(d.getUTCMinutes()) + ":" +
				pad(d.getUTCSeconds()) + "Z";
		},

		convertMillisToSeconds = function (ms) {
			return Math.round(ms * 1000) / 1000000;
		},

		xmlEncode = function (text) {
			var baseEntities = {
				"\"": "&quot;",
				"'": "&apos;",
				"<": "&lt;",
				">": "&gt;",
				"&": "&amp;"
			};

			return ("" + text).replace(/[<>&\"\']/g, function (chr) {
				return baseEntities[chr] || chr;
			});
		},

		XmlWriter = function (settings) {
			var data = [],
				stack = [],
				lineBreakAt,
				addLineBreak = function (name) {
					if (lineBreakAt[name] && data[data.length - 1] !== "\n") {
						data.push("\n");
					}
				};

			settings = settings || {};

			lineBreakAt = (function (items) {
				var i,
					map = {};

				items = items || [];

				i = items.length;
				while (i--) {
					map[items[i]] = {};
				}
				return map;
			})(settings.linebreak_at);

			this.start = function (name, attrs, empty) {
				var aname;

				if (!empty) {
					stack.push(name);
				}

				data.push("<" + name);

				for (aname in attrs) {
					if (attrs.hasOwnProperty(aname)) {
						data.push(" " + xmlEncode(aname) + "=\"" + xmlEncode(attrs[aname]) + "\"");
					}
				}

				data.push(empty ? " />" : ">");
				addLineBreak(name);
			};

			this.end = function () {
				var name = stack.pop();

				addLineBreak(name);
				data.push("</" + name + ">");
				addLineBreak(name);
			};

			this.text = function (text) {
				data.push(xmlEncode(text));
			};

			this.cdata = function (text) {
				data.push("<![CDATA[" + text + "]]>");
			};

			this.comment = function (text) {
				data.push("<!--" + text + "-->");
			};
			this.pi = function (name, text) {
				data.push("<?" + name + (text ? " " + text : "") + "?>\n");
			};

			this.doctype = function (text) {
				data.push("<!DOCTYPE" + text + ">\n");
			};

			this.getString = function () {
				while (stack.length) {
					this.end();  // internally calls `stack.pop();`
				}
				return data.join("").replace(/\n$/, "");
			};

			this.reset = function () {
				data.length = 0;
				stack.length = 0;
			};

			// Start by writing the XML declaration
			this.pi(settings.xmldecl || "xml version=\"1.0\" encoding=\"UTF-8\"");
		},

		// Generate JUnit XML report!
		mLen,
		module,
		t,
		tLen,
		test,
		a,
		k,
		aLen,
		assertion,
		currentTest,
		xmlWriter = new XmlWriter({
			linebreak_at: ["testsuites", "testsuite", "testcase", "failure", "system-out", "system-err"]
		});

	if (!end) {
		currentTest = QUnit.config.current.testName;
	}
	xmlWriter.pi("xml-stylesheet type=\"text/xsl\"  href=\"testresult.xsl\"");
	xmlWriter.start("test_definition", {
		name: "http://tempuri.org",
		type: "",
		"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"xsi:noNamespaceSchemaLocation": "test_definition.xsd"
	});

	xmlWriter.start("environment", {
		device_id: "",
		device_model: "SDK & Target",
		device_name: "Tizen",
		host: navigator.userAgent,
		os_version: "3.0",
		resolution: "",
		screen_size: $(window).height() + " x " + $(window).width()
	});
	xmlWriter.start("other");
	xmlWriter.cdata("Tizen Web UI FW UnitTest");
	xmlWriter.end();
	xmlWriter.end(); //environment

	xmlWriter.start("summary", {
		test_plan_name: "Tizen Web UI FW Unit TC"
	});
	xmlWriter.start("start_at");
	xmlWriter.cdata(run.start);
	xmlWriter.end(); //start_at
	xmlWriter.start("end_at");
	xmlWriter.cdata(new Date());
	xmlWriter.end(); //start_at
	xmlWriter.end(); // summary

	xmlWriter.start("suite", {
		id: "suite" + Date.now(),
		name: "tct-webuifw-tests" + ((CURRENT_ITERATION > 9) ? "" : "0") + (CURRENT_ITERATION + 1),
		hostname: "localhost",
		tests: results.total,
		failures: results.failed,
		errors: 0,
		time: convertMillisToSeconds(results.time),  // ms → sec
		timestamp: toISODateString(run.start)
	});

	for (k = 0, mLen = run.modules.length; k < mLen; k++) {
		module = run.modules[k];
		if (!end) {
			if (currentTest.toLowerCase() != module.name.toLowerCase()) {
				continue;
			}
		}

		xmlWriter.start("set", {
			name: module.name + "_" + m
		});
		for (t = 0, tLen = module.tests.length; t < tLen; t++) {
			test = module.tests[t];
			for (a = 0, aLen = test.failedAssertions.length; a < aLen; a++) {
				assertion = test.failedAssertions[a];
				xmlWriter.start("testcase", {
					component: module.name,
					execution_type: "auto",
					id: module.name + "_" + m + "_" + t + "_" + a,
					priority: (assertion.priority) ? assertion.priority : "P1",
					purpose: assertion.checktype + " " + (assertion.message) ? "-" + assertion.message : "",
					status: (assertion.result) ? "PASS" : "FAIL",
					result: (assertion.result) ? "PASS" : "FAIL",
					type: "compliance"
				});
				xmlWriter.start("description");
				xmlWriter.start("pre_condition");
				xmlWriter.end();
				xmlWriter.start("post_condition");
				xmlWriter.end();
				xmlWriter.start("steps");
				xmlWriter.start("step", {
					order: "1"
				});
				xmlWriter.start("step_desc");
				xmlWriter.cdata(assertion.checktype + " " + (assertion.message) ? " " + assertion.message : "");
				xmlWriter.end();
				xmlWriter.start("expected");
				xmlWriter.cdata(assertion.expected);
				xmlWriter.end();
				xmlWriter.end();// step
				xmlWriter.end(); //steps

				xmlWriter.start("test_script_entry", {
					test_script_expected_result: ""
				});
				xmlWriter.end();
				xmlWriter.end(); // description
				xmlWriter.start("result_info");
				xmlWriter.start("actual_result");
				xmlWriter.cdata(assertion.actual);
				xmlWriter.end();
				xmlWriter.end();
				xmlWriter.end();
			}
		}

		xmlWriter.end();
		m++;
	}

	xmlWriter.end(); //testsuite
	xmlWriter.end(); //test_definition
	// Invoke the user-defined callback
	QUnit.jUnitReport({
		results: results,
		xml: xmlWriter.getString(),
		end: end
	});
};

$.ajax({
	url: "/opt/usr/home/owner/share/TCT_CONFIG",
	data: {},
	async: true,
	success: function (data) {
		var regEx = /DEVICE_SUITE_TARGET_30=(.+)/i,
			path = regEx.exec(data);

		if (path) {
			RESOURCE_DIR = path[1];
		}

		start();
	}
});

function start() {
	var tizen = window.tizen,
		_order = 0;

	/*
	 Reporting section
	 */
	function exitAPP() {
		var app;

		if (tizen) {
			app = tizen.application.getCurrentApplication();
			app.exit();
		}
	}

	function riseError(msg, e) {
		console.error(msg, e);
		setTimeout(exitAPP(), 5000);
	}

	function writeToFile(data, fs) {
		fs.write(data.xml);
		fs.close();

		if (data.end) {
			setTimeout(exitAPP(), 5000);
		} else {
			// continue on to the next suite
			QUnit.start();
		}
	}

	function saveReport(data, order, dir) {
		var tempFile,
			filename;

		filename = data.end ? "tcresult.xml" : "tcresult_" + order + ".xml";

		try {
			tempFile = dir.createFile(filename);
		} catch (err) {
			tempFile = dir.resolve(filename);
		}

		if (tempFile !== null) {
			tempFile.openStream("w",
				writeToFile.bind(null, data),
				riseError.bind(null, "There is a problem with opening stream to write"),
				"UTF-8"
			);
		} else {
			riseError("There was a problem with getting into " + filename);
		}
	}

	QUnit.jUnitReport = function (data) {
		if (tizen) {
			// Save partial or final report to file.
			try {
				tizen.filesystem.resolve("file://" + RESOURCE_DIR + "/Documents",
					function (dir) {
						saveReport(data, _order, dir);
					},
					function (err) {
					});
			} catch (except) {
				// go to next test
				QUnit.start();
			}
			_order = _order + 1;
		} else {
			if (!data.end) {
				QUnit.start();
			}
		}
	};

	// prevent qunit from starting the test suite until all tests are defined
	QUnit.begin = function () {
		//this.config.autostart = false;
	};

	QUnit.done = function (details) {
		// All Test is done
		generateReport(details, UnitTCRunner.getTestResult(), true);
	};

	// get the test directories
	UnitTCRunner = new Runner();

	UnitTCRunner.exec(TESTS);
}

QUnit.config.autostart = false;
