/* global define */
define(
	["./app-helpers"],
	function (helpers) {
		var testFunctions = {
			main: function (window, page, tests) {
				var document = window.document,
					list = document.getElementById("list"),
					lisLength = list.children.length;

				helpers.pushTests(tests,
					lisLength,
					10,
					"listview has 10 children"
					);
				helpers.pushTests(tests,
					page && page.classList && !page.classList.contains("hidden"),
					true,
					"hidden class isn't set"
					);
			},

			details: function (window, page, tests) {
				var h2 = page.querySelector("h2");

				helpers.pushTests(tests,
					h2.innerHTML,
					"Movie details",
					"details page has correct title"
					);
				helpers.pushTests(tests,
					page && page.classList && !page.classList.contains("hidden"),
					true,
					"hidden class isn't set"
					);
			}
		};

		helpers.run("TAUControllerWithOutRouter/src/index.html", testFunctions, 100, [300, 300], true);
	});