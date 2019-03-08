(function () {
	"use strict";
	function runTests(PanelChanger, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/PanelChanger/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/PanelChanger", {
			setup: initHTML
		});

		test("_loadSuccess", function (assert) {

			var PanelChanger = ns.widget.core.PanelChanger,
				widget = new PanelChanger(),
				href = "#mainpanel",
				xml = {},
				direction = "";


			assert.ok(true, "widget instantiated");
			widget.eventType = "";
			widget.element = document.getElementById("panelChanger");
			widget.mainPanelStyle = widget.element.querySelector("#mainpanel").style;
			helpers.stub(ns.engine, "createWidgets", function () {
				assert.ok(widget.mainPanelStyle.display === "block",
					"panel has correct display property");
				assert.ok(widget.mainPanelStyle.transform === "translate(-9999px, -9999px)",
					"panel has correct transform property ");
			});

			helpers.stub(ns.event, "trigger", function () {
			});

			helpers.stub(widget, "_show", function () {
				assert.ok(widget.mainPanelStyle.transform === "" || widget.mainPanelStyle.transform === undefined
					, "panel has correct transform property");
				assert.ok(widget.mainPanelStyle.display === "none",
					"panel has correct display property");
			});

			widget._loadSuccess(href, xml, direction);
			widget._destroy();
			helpers.restoreStub(ns.engine, "createWidgets");
			helpers.restoreStub(ns.event, "trigger");
			helpers.restoreStub(widget, "_show");
		});

	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.PanelChanger,
			window.helpers,
			tau);
	}
}());
