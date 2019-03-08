/* global tau, equal, test, define */
function runTests(dataUtils, helpers) {
	var e1,
		e2,
		e3,
		testData1 = {
			"foobar": 1
		},
		testData2 = {
			"foobar": 2
		};

	function initHTML() {
		var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/util/data/test-data/sample.html"),
			parent = document.getElementById("qunit-fixture") || helpers.initFixture();

		parent.innerHTML = HTML;
		e1 = document.getElementById("test1");
		e2 = document.getElementById("test2");
		e3 = document.getElementById("test3");
	}

	module("core/util/data", {
		setup: initHTML
	});

	test("data", function () {
		equal(testData1, dataUtils.set(e1, "testData", testData1), "setting data to element 1");
		equal(testData2, dataUtils.set(e2, "testData", testData2), "setting data to element 2");
		equal(dataUtils.get(e1, "testData"), dataUtils.set(e3, "testData", dataUtils.get(e1, "testData")), "data reference check");
		equal(testData2, dataUtils.set(1, "testData", testData2), "setting data to numeric key");
		equal(testData2, dataUtils.set("stringKey", "testData", testData2), "setting data to string key");

		equal(testData1, dataUtils.get(e1, "testData"), "getting data to element 1");
		equal(testData2, dataUtils.get(e2, "testData"), "getting data to element 2");
		equal(dataUtils.get(e1, "testData"), dataUtils.get(e3, "testData"), "data reference check");
		equal(testData2, dataUtils.get(1, "testData"), "getting data to numeric key");
		equal(testData2, dataUtils.get("stringKey", "testData"), "getting data to string key");

		dataUtils.remove(e1, "testData");
		dataUtils.remove(e2, "testData");
		dataUtils.remove(e3, "testData");
		dataUtils.remove(1, "testData");
		dataUtils.remove("stringKey", "testData");

		equal("undefined", typeof dataUtils.get(e1, "testData"), "removed data from element 1");
		equal("undefined", typeof dataUtils.get(e2, "testData"), "removed data from element 2");
		equal("undefined", typeof dataUtils.get(e3, "testData"), "removed data from element 4");
		equal("undefined", typeof dataUtils.get(1, "testData"), "removed data from numeric key");
		equal("undefined", typeof dataUtils.get("stringKey", "testData"), "removed data from string key");
	});
}

if (typeof define === "function") {
	define(function () {
		return runTests;
	});
} else {
	runTests(tau.util.data, window.helpers);
}