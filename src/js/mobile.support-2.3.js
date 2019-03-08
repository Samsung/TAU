/*global define, ns */
/**
 * #Tizen Advanced UI Framework Backward compatibility
 *
 * TAU framework Tizen 2.4 version has many changed feature for example component naming, API and structure.
 * But, We need to support previous version so we divide to previous support file and current version support file.
 * This file has previous support files.
 *
 * @class ns.mobile-2-3
 * @title Tizen Advanced UI Framework
 */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function (ns) {
	"use strict";
	define(
		[
			"require",
			"./core/info",
			"support/mobile/event/touch",
			"support/mobile/router/Router",
			"support/mobile/widget/Checkboxradio",
			"support/mobile/widget/ToggleSwitch.extra",
			"support/mobile/widget/SelectMenu",
			"support/mobile/widget/Progress",
			"support/mobile/widget/Progressbar",
			"support/mobile/widget/Listview.extra",
			"support/mobile/widget/ExtendableList",
			"support/mobile/widget/Notification",
			"support/mobile/widget/ListviewAutodivider",
			"support/mobile/widget/ListDivider",
			"support/mobile/widget/Collapsible",
			"support/mobile/widget/Collapsibleset",
			"support/mobile/widget/Dialog",
			"support/mobile/router/route/dialog",
			"support/mobile/widget/Slider.extra",
			"support/mobile/widget/TizenSlider.extra",
			"support/mobile/widget/SearchBar",
			"support/mobile/widget/Swipe",
			"support/mobile/widget/TextInput",
			"support/mobile/widget/TokenTextArea.extra",
			"support/mobile/widget/Fieldcontain",
			"support/mobile/widget/Gallery",
			"support/mobile/widget/Fastscroll",
			"support/mobile/widget/Controlgroup",
			"support/mobile/widget/Circularview",
			"support/mobile/widget/Datetimepicker"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.info.profile = "mobile";
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
}(ns));
//>>excludeEnd("tauBuildExclude");
