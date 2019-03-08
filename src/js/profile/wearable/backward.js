/*global define, ns */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/engine",
			"./widget/wearable/IndexScrollbar",
			"../../core/widget/core/SectionChanger",
			"./widget/wearable/SwipeList",
			"./widget/wearable/VirtualListview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var engine = ns.engine;

			ns.IndexScrollbar = function (element, options) {
				ns.warn("tau.IndexScrollbar is deprecated. you have to use tau.widget.IndexScrollbar.");
				return engine.instanceWidget(element, "IndexScrollbar", options);
			};

			ns.SectionChanger = function (element, options) {
				ns.warn("tau.SectionChanger is deprecated. you have to use tau.widget.SectionChanger.");
				return engine.instanceWidget(element, "SectionChanger", options);
			};

			ns.SwipeList = function (element, options) {
				ns.warn("tau.SwipeList is deprecated. you have to use tau.widget.SwipeList.");
				return engine.instanceWidget(element, "SwipeList", options);
			};

			ns.VirtualListview = function (element, options) {
				ns.warn("tau.VirtualListview is deprecated. you have to use tau.widget.VirtualListview.");
				return engine.instanceWidget(element, "VirtualListview", options);
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
