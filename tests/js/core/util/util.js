/*global window, ns, tau, define, module, test, equal, notStrictEqual, initFixture, ok*/
(function (window, document) {
	"use strict";

	function runTests(util, helpers) {

		window.ns = window.ns || window.tau;

		function createXMLHttpRequestSyncMock(options) {
			var protocol = options.protocol || "get",
				readyState = (options.readyState !== undefined) ? options.readyState : 4,
				url = options.url || "url",
				responseText = (options.responseText !== undefined) ? options.responseText : "",
				status = (options.status !== undefined) ? options.status : 200;

			return function XMLHttpRequestMock() {
				ok(true, "Instance XMLHttpRequest was created");
				this.readyState = 0;
				this.open = function (arg1, arg2, arg3) {
					ok(true, "XMLHttpRequest: method open was called");
					equal(arg1, protocol, "XMLHttpRequest.open() first argument is get");
					equal(arg2, url, "XMLHttpRequest.open() second argument is url");
					equal(arg3, false, "XMLHttpRequest.open() third argument is false (synchronously request)");
				};
				this.send = function () {
					ok(true, "XMLHttpRequest: method send was called");
					this.readyState = readyState;
					this.status = status;
					this.responseText = responseText;
				};
				this.overrideMimeType = function (arg1) {
					ok(true, "XMLHttpRequest: method overrideMimeType was called");
					equal(arg1, "text/html", "XMLHttpRequest.overrideMimeType() first argument is get");
				};
			}
		}

		module("core/util");

		test("_requestAnimationFrameOnSetTimeout", 4, function () {
			var callback = function (time) {
				ok(true, "Callback called");
				ok(time > 0, "First callback argument is provided");
			};

			equal(typeof util._requestAnimationFrameOnSetTimeout, "function", "_requestAnimationFrameOnSetTimeout exists and is a method");

			helpers.stub(window, "setTimeout", function (callback) {
				ok(true, "window.setTimeout called");
				callback();
				return 1;
			});

			util._requestAnimationFrameOnSetTimeout(callback);

			helpers.restoreStub(window, "setTimeout");
		});

		test("_cancelAnimationFrameOnSetTimeout", 2, function () {
			equal(typeof util._cancelAnimationFrameOnSetTimeout, "function", "_cancelAnimationFrameOnSetTimeout exists and is a method");

			helpers.stub(window, "clearTimeout", function () {
				ok(true, "window.clearTimeout called");
			});
			util._cancelAnimationFrameOnSetTimeout();
			helpers.restoreStub(window, "clearTimeout");
		});


		test("_getRequestAnimationFrame", 13, function () {
			var result = null;

			equal(typeof util._getRequestAnimationFrame, "function", "_getRequestAnimationFrame exists and is a method");

			helpers.stub(window, "requestAnimationFrame", null);
			helpers.stub(window, "webkitRequestAnimationFrame", null);
			helpers.stub(window, "mozRequestAnimationFrame", null);
			helpers.stub(window, "oRequestAnimationFrame", null);
			helpers.stub(window, "msRequestAnimationFrame", null);
			helpers.stub(util, "_requestAnimationFrameOnSetTimeout", function () {
				ok(true, "_requestAnimationFrameOnSetTimeout was called");
			});

			result = util._getRequestAnimationFrame();
			ok(typeof result === "function", "requestAnimationFrame as function based on setTimeout method exists");
			result();
			helpers.restoreStub(util, "_requestAnimationFrameOnSetTimeout");

			helpers.restoreStub(window, "msRequestAnimationFrame");
			helpers.stub(window, "msRequestAnimationFrame", function () {
				ok(true, "msRequestAnimationFrame was called");
			});
			result = util._getRequestAnimationFrame();
			ok(typeof result === "function", "msRequestAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "msRequestAnimationFrame");

			helpers.restoreStub(window, "oRequestAnimationFrame");
			helpers.stub(window, "oRequestAnimationFrame", function () {
				ok(true, "oRequestAnimationFrame was called");
			});
			result = util._getRequestAnimationFrame();
			ok(typeof result === "function", "oRequestAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "oRequestAnimationFrame");

			helpers.restoreStub(window, "mozRequestAnimationFrame");
			helpers.stub(window, "mozRequestAnimationFrame", function () {
				ok(true, "mozRequestAnimationFrame was called");
			});
			result = util._getRequestAnimationFrame();
			ok(typeof result === "function", "mozRequestAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "mozRequestAnimationFrame");

			helpers.restoreStub(window, "webkitRequestAnimationFrame");
			helpers.stub(window, "webkitRequestAnimationFrame", function () {
				ok(true, "webkitRequestAnimationFrame was called");
			});
			result = util._getRequestAnimationFrame();
			ok(typeof result === "function", "webkitRequestAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "webkitRequestAnimationFrame");

			helpers.restoreStub(window, "requestAnimationFrame");
			helpers.stub(window, "requestAnimationFrame", function () {
				ok(true, "requestAnimationFrame was called");
			});
			result = util._getRequestAnimationFrame();
			ok(typeof result === "function", "requestAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "requestAnimationFrame");

		});

		test("_getCancelAnimationFrame", 13, function () {
			var result = null;

			equal(typeof util._getCancelAnimationFrame, "function", "_getCancelAnimationFrame exists and is a method");

			helpers.stub(window, "cancelAnimationFrame", null);
			helpers.stub(window, "webkitCancelAnimationFrame", null);
			helpers.stub(window, "mozCancelAnimationFrame", null);
			helpers.stub(window, "oCancelAnimationFrame", null);
			helpers.stub(window, "msCancelAnimationFrame", null);
			helpers.stub(util, "_cancelAnimationFrameOnSetTimeout", function () {
				ok(true, "_cancelAnimationFrameOnSetTimeout was called");
			});

			result = util._getCancelAnimationFrame();
			ok(typeof result === "function", "cancelAnimationFrame as function based on setTimeout method exists");
			result();
			helpers.restoreStub(util, "_cancelAnimationFrameOnSetTimeout");

			helpers.restoreStub(window, "msCancelAnimationFrame");
			helpers.stub(window, "msCancelAnimationFrame", function () {
				ok(true, "msCancelAnimationFrame was called");
			});
			result = util._getCancelAnimationFrame();
			ok(typeof result === "function", "msCancelAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "msCancelAnimationFrame");

			helpers.restoreStub(window, "oCancelAnimationFrame");
			helpers.stub(window, "oCancelAnimationFrame", function () {
				ok(true, "oCancelAnimationFrame was called");
			});
			result = util._getCancelAnimationFrame();
			ok(typeof result === "function", "oCancelAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "oCancelAnimationFrame");

			helpers.restoreStub(window, "mozCancelAnimationFrame");
			helpers.stub(window, "mozCancelAnimationFrame", function () {
				ok(true, "mozCancelAnimationFrame was called");
			});
			result = util._getCancelAnimationFrame();
			ok(typeof result === "function", "mozCancelAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "mozCancelAnimationFrame");

			helpers.restoreStub(window, "webkitCancelAnimationFrame");
			helpers.stub(window, "webkitCancelAnimationFrame", function () {
				ok(true, "webkitCancelAnimationFrame was called");
			});
			result = util._getCancelAnimationFrame();
			ok(typeof result === "function", "webkitCancelAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "webkitCancelAnimationFrame");

			helpers.restoreStub(window, "cancelAnimationFrame");
			helpers.stub(window, "cancelAnimationFrame", function () {
				ok(true, "cancelAnimationFrame was called");
			});
			result = util._getCancelAnimationFrame();
			ok(typeof result === "function", "cancelAnimationFrame method exists");
			result();
			helpers.restoreStub(window, "cancelAnimationFrame");

		});


		test("batchCall", 3, function () {
			equal(typeof util.batchCall, "function", "batchCall exists and is a method");

			util.batchCall([
				function () {
					ok(true, "First function was called");
				},
				function () {
					ok(true, "Second function was called");
				}
			]);
		});

		test("fetchSync", 38, function () {
			equal(typeof util.fetchSync, "function", "fetchSync exists and is a method");

			helpers.stub(window, "XMLHttpRequest", createXMLHttpRequestSyncMock({
				responseText: "Test Content"
			}));
			equal(util.fetchSync("url"), "Test Content", "fetchSync method returns proper result");
			equal(util.fetchSync("url", "text/html"), "Test Content", "fetchSync method returns proper result and mime type was overriden");
			helpers.restoreStub(window, "XMLHttpRequest");


			helpers.stub(window, "XMLHttpRequest", createXMLHttpRequestSyncMock({
				readyState: 0
			}));
			ok(util.fetchSync("url") === null, "fetchSync method returns null when xhr.readyState is not equal 4");
			helpers.restoreStub(window, "XMLHttpRequest");


			helpers.stub(window, "XMLHttpRequest", createXMLHttpRequestSyncMock({
				status: 0,
				responseText: "Test Content"
			}));
			equal(util.fetchSync("url"), "Test Content", "fetchSync method returns responseText when xhr.status is 0 but responseText is not empty");
			helpers.restoreStub(window, "XMLHttpRequest");


			helpers.stub(window, "XMLHttpRequest", createXMLHttpRequestSyncMock({
				status: 0,
				responseText: ""
			}));
			ok(util.fetchSync("url") === null, "fetchSync method returns null when xhr.status is 0 and responseText is empty");
			helpers.restoreStub(window, "XMLHttpRequest");
		});


		test("safeEvalWrap", 12, function () {
			var result = null;

			equal(typeof util.safeEvalWrap, "function", "safeEvalWrap exists and is a method");

			helpers.stub(window, "eval", function () {
				ok(true, "Code was properly evaluated");
			});
			result = util.safeEvalWrap("proper code"); // method window.eval is overriden by mock
			equal(typeof result, "function", "result of safeEvalWrap is a function");
			result();
			helpers.restoreStub(window, "eval");


			helpers.stub(ns, "error", function (e) {
				ok(true, "Message error was caught and stack displayed: " + e.stack);
			});
			helpers.stub(window, "eval", function () {
				ok(true, "Code is incorrect. Throw standard exception");
				throw new Error("Error");
			});
			result = util.safeEvalWrap("wrong code");  // method window.eval is overriden by mock
			equal(typeof result, "function", "result of safeEvalWrap is a function");
			// below calling should be cause message error
			result();
			helpers.restoreStub(window, "eval");
			helpers.restoreStub(ns, "error");


			helpers.stub(ns, "error", function (e) {
				ok(true, "Message error was caught and without stack (name) " + e.name + " (message)" + e.message);
			});
			helpers.stub(window, "eval", function () {
				var e = new Error("Error");

				ok(true, "Code is incorrect. Throw exception without stack");
				e.stack = null;
				throw e;
			});
			result = util.safeEvalWrap("wrong code");  // method window.eval is overriden by mock
			equal(typeof result, "function", "result of safeEvalWrap is a function");
			// below calling should be cause message error
			result();
			helpers.restoreStub(window, "eval");
			helpers.restoreStub(ns, "error");


			helpers.stub(ns, "error", function () {
				ok(true, "Message error was caught");
			});
			helpers.stub(window, "eval", function () {
				var e = new Error("Error");

				ok(true, "Code is incorrect. Throw exception without stack, name and message");
				e.stack = null;
				e.name = "";
				e.message = "";
				throw e;
			});
			result = util.safeEvalWrap("wrong code");  // method window.eval is overriden by mock
			equal(typeof result, "function", "result of safeEvalWrap is a function");
			// below calling should be cause message error
			result();
			helpers.restoreStub(window, "eval");
			helpers.restoreStub(ns, "error");
		});


		test("removeExternalScripts", 7, function () {
			var html = helpers.loadHTMLFromFile("/base/tests/js/core/util/test-data/removeExternalScriptSample.html"),
				container = document.createElement("div"),
				result = null;

			equal(typeof util._removeExternalScripts, "function", "_removeExternalScripts exists and is a method");

			result = util._removeExternalScripts(document.createElement("div"));
			ok(Array.isArray(result), "_removeExternalScripts method returns array");
			ok(result.length === 0, "_removeExternalScripts method returns empty array");

			container.innerHTML = html;
			result = util._removeExternalScripts(container);
			equal(result.length, 4, "_removeExternalScripts method returns array of script elements");
			ok(result[0].src.indexOf("no-file-1.js") > -1, "first element of result has proper source");
			ok(result[3].src.indexOf("no-file-4.js") > -1, "last element of result has proper source");
			ok(result[0].parentNode === null, "result elements have to be removed from parent element");
		});

		test("createScriptsSync", 12, function () {
			var container = document.createElement("div"),
				script = document.createElement("script"),
				result = null;

			equal(typeof util._createScriptsSync, "function", "_createScriptsSync exists and is a method");

			/**
			 * Test for case when script exists
			 */
			script.src = "some-script.js";
			helpers.stub(util, "fetchSync", function () {
				ok(true, "fetchSync success");
				return "some script";
			});
			helpers.stub(util, "safeEvalWrap", function () {
				ok(true, "safeEvalWrap success");
				return function () {
					ok(true, "function in queue");
				};
			});
			helpers.stub(document, "adoptNode", function () {
				ok(true, "document.adoptNode success");
				return document.createElement("script");
			});
			result = util._createScriptsSync([script], container);
			equal(container.childNodes.length, 1, "New script element was apended to container");
			result[0]();
			helpers.restoreStub(util, "fetchSync");
			helpers.restoreStub(util, "safeEvalWrap");
			helpers.restoreStub(document, "adoptNode");

			/**
			 * Test for case when script exists but container is not indicated
			 */
			script.src = "some-script.js";
			helpers.stub(util, "fetchSync", function () {
				ok(true, "fetchSync success");
				return "some script";
			});
			helpers.stub(util, "safeEvalWrap", function () {
				ok(true, "safeEvalWrap success");
				return function () {
					ok(true, "function in queue");
				};
			});
			helpers.stub(document, "adoptNode", function () {
				ok(true, "document.adoptNode success");
				return document.createElement("script");
			});
			result = util._createScriptsSync([script]);
			result[0]();
			helpers.restoreStub(util, "fetchSync");
			helpers.restoreStub(util, "safeEvalWrap");
			helpers.restoreStub(document, "adoptNode");


			/**
			 * Test for case when script not exists
			 */
			script.src = "some-script.js";
			helpers.stub(util, "fetchSync", function () {
				ok(true, "fetchSync success but file not exists");
				return null;
			});
			result = util._createScriptsSync([script], container);
			ok(result.length === 0, "If file not exists then method should returns empty array");
			helpers.restoreStub(util, "fetchSync");

		});

		test("importEvaluateAndAppendElement", 7, function () {
			var container = document.createElement("div"),
				element = document.createElement("script"),
				result = null;

			equal(typeof util.importEvaluateAndAppendElement, "function", "importEvaluateAndAppendElement exists and is a method");

			helpers.stub(document, "importNode", function () {
				ok(true, "document.importNode success");
				return document.createElement("script");
			});
			helpers.stub(util, "batchCall", function () {
				ok(true, "batchCall success");
			});
			helpers.stub(util, "_createScriptsSync", function () {
				ok(true, "createScriptsSync success");
				return [function () {
					ok(true, "function in queue");
				}];
			});
			helpers.stub(util, "_removeExternalScripts", function () {
				ok(true, "removeExternalScripts success");
				return true;
			});
			result = util.importEvaluateAndAppendElement(element, container);
			equal(container.childNodes.length, 1, "New script element was appended to container");
			ok(result instanceof HTMLElement, "Result is instance of HTMLElement");

			helpers.restoreStub(util, "_removeExternalScripts");
			helpers.restoreStub(util, "_createScriptsSync");
			helpers.restoreStub(util, "batchCall");
			helpers.restoreStub(document, "importNode");
		});

		test("runScript src and attributes", 9, function () {
			var script = document.createElement("script"),
				baseUrl = "test-data/runScriptSample.js",
				parent = document.getElementById("qunit-fixture") || initFixture(),
				newScript = null;


			helpers.stub(util, "path", {
				"makeUrlAbsolute": function () {
					ok(true, "path.makeUrlAbsolute success");
					return "/some-script.js";
				}
			});
			// fetchSync Success mock
			helpers.stub(util, "fetchSync", function () {
				ok(true, "fetchSync success");
				return "some script";
			});

			// window.URL Success mock
			helpers.stub(window, "URL", {
				createObjectURL: function () {
					ok(true, "createObjectURL success");
					return "blob-source";
				}
			});

			// window.Blob Success mock
			helpers.stub(window, "Blob", function () {
				ok(true, "new Blob object was created");
				return {};
			});

			// with attributes other than "src"
			script.setAttribute("src", "some-script.js");
			script.setAttribute("type", "text/javascript");
			parent.appendChild(script);

			equal(typeof util.runScript, "function", "runScript exists and is a method");
			util.runScript(baseUrl, script);
			newScript = parent.querySelector("script");
			equal(script.getAttribute("src"), newScript.getAttribute("data-src"), "Attribute src should be rewrite to new element as data-src");
			ok(newScript.getAttribute("type") === "text/javascript", "Previous attributes should be rewriten to new script element");
			notStrictEqual(newScript, script, "The scripts elements should be different instances");
			equal(newScript.textContent, "some script", "Script element has proper text content");

			helpers.restoreStub(window, "Blob");
			helpers.restoreStub(window, "URL");
			helpers.restoreStub(util, "fetchSync");
		});

		test("runScript src only", 6, function () {
			var script = document.createElement("script"),
				baseUrl = "test-data/runScriptSample.js",
				parent = document.getElementById("qunit-fixture") || initFixture(),
				newScript = null;


			helpers.stub(util, "path", {
				"makeUrlAbsolute": function () {
					ok(true, "path.makeUrlAbsolute success");
					return "/some-script.js";
				}
			});

			// fetchSync Fail mock
			helpers.stub(util, "fetchSync", function () {
				ok(true, "fetchSync failed");
				return null;
			});

			// Without additional attributes
			script = document.createElement("script");
			script.setAttribute("src", "some-script.js");
			parent.appendChild(script);

			equal(typeof util.runScript, "function", "runScript exists and is a method");
			util.runScript(baseUrl, script);
			newScript = parent.querySelector("script");
			equal(script.getAttribute("src"), newScript.getAttribute("data-src"), "Attribute src should be rewrite to new element as data-src");
			notStrictEqual(newScript, script, "The scripts elements should be different instances");
			equal(newScript.textContent, "", "Script element has not any text content");

			// cleanup mocks
			helpers.restoreStub(util, "fetchSync");
			helpers.restoreStub(util, "path");
		});

		test("runScript without any attributes", 3, function () {
			var script = document.createElement("script"),
				baseUrl = "test-data/runScriptSample.js",
				parent = document.getElementById("qunit-fixture") || initFixture(),
				newScript = null;

			helpers.stub(util, "path", {
				"makeUrlAbsolute": function () {
					ok(true, "path.makeUrlAbsolute success");
					return "/some-script.js";
				}
			});
			// fetchSync Success mock
			helpers.stub(util, "fetchSync", function () {
				ok(true, "fetchSync success");
				return "some script";
			});

			// script "src" not exists
			script = document.createElement("script");
			parent.appendChild(script);

			equal(typeof util.runScript, "function", "runScript exists and is a method");
			util.runScript(baseUrl, script);
			newScript = parent.querySelector("script");
			equal(script.getAttribute("src"), newScript.getAttribute("data-src"), "Attribute src should be rewrite to new element as data-src");
			notStrictEqual(newScript, script, "The scripts elements should be different instances");

			// cleanup mocks
			helpers.restoreStub(util, "fetchSync");
			helpers.restoreStub(util, "path");
		});

		test("_loop/requestAnimationFrame", 10, function (assert) {
			var windowRequestAnimationFrameCount = 0;

			helpers.stub(util, "windowRequestAnimationFrame", function (callback) {
				windowRequestAnimationFrameCount++;
				assert.equal(typeof callback, "function", "first argument is function");
			});

			util.requestAnimationFrame(function () {
				assert.ok(true, "b");
			});

			util.requestAnimationFrame(function () {
				var startTime = performance.now();

				while (performance.now() - startTime < 20) {
					true;
				}
				assert.ok(true, "a");
			});

			util.requestAnimationFrame(function () {
				assert.ok(true, "b");
			});


			assert.equal(windowRequestAnimationFrameCount, 1, "windowRequestAnimationFrame was called" +
				" only once");

			util._loop();

			assert.equal(windowRequestAnimationFrameCount, 2, "windowRequestAnimationFrame was called" +
				" twice");

			util._loop();

			assert.equal(windowRequestAnimationFrameCount, 2, "windowRequestAnimationFrame was called" +
				" twice");

			util.requestAnimationFrame(function () {
				assert.ok(true, "b");
			});

			assert.equal(windowRequestAnimationFrameCount, 3, "windowRequestAnimationFrame was called" +
				" three times");

			// cleanup mocks
			helpers.restoreStub(util, "windowRequestAnimationFrame");
		});

		test("isNumber", 7, function (assert) {
			assert.equal(util.isNumber(3), true, "");
			assert.equal(util.isNumber(false), false, "");
			assert.equal(util.isNumber(3.0), true, "");
			assert.equal(util.isNumber("3"), true, "");
			assert.equal(util.isNumber("3.45px"), true, "");
			assert.equal(util.isNumber(NaN), false, "");
			assert.equal(util.isNumber(Infinity), false, "");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.util, window.helpers, tau);
	}
}(window, window.document));
