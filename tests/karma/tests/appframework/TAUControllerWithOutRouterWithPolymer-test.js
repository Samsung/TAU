/* global define */
define(
	["./app-helpers"],
	function (helpers) {
		var testFunctions = {
			main: function (window, page, tests) {
				var document = window.document,
					list = document.getElementById("items"),
					lisLength = list.children.length;

				helpers.pushTests(tests,
					lisLength,
					21,
					"listview has 21 children (some are hidden)"
					);
			},

			details: function (window, page, tests) {
				var h2 = page.querySelector("h2");

				helpers.pushTests(tests,
					h2.innerHTML,
					"Movie details",
					"details page has correct title"
					);
			}
		};

		helpers.run("TAUControllerWithOutRouterWithPolymer/src/index.html", testFunctions, 100, [300, 300], true);
	});