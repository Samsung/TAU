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
 */
/*global define, ns */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function () {
	// configure TAU
	window.nsConfig = {
		autostart: false
	};
	// load dependencies
	define(
		[
			//>>excludeStart("tauPerformance", pragmas.tauPerformance);
			"./tools/performance",
			//>>excludeEnd("tauPerformance");
			//>>excludeStart("tauUI", pragmas.tauUI);
			// namespace
			"./core/core",
			// config
			"./profile/wearable/config",
			"./core/config",
			"./core/defaults",
			// information about environment
			"./core/support/tizen",
			"./core/info",
			// router
			"./core/router/Router",
			"./core/history/manager",
			// routes
			"./core/router/route/page",
			"./core/router/route/popup",
			"./core/router/route/drawer",
			// engine
			"./core/engine",
			// utilities
			"./core/util/anchorHighlight",
			"./core/util/scrolling",
			"./core/util/polar",
			"./core/util/rotaryScrolling",
			"./core/util/date",
			"./core/util/load",
			// widget list
			// core widgets
			"./core/widget/customElements",
			"./core/widget/core/PageContainer",
			"./core/widget/core/Button",
			"./core/widget/core/Checkbox",
			"./core/widget/core/Radio",
			"./core/widget/core/Marquee",
			"./core/widget/core/viewswitcher/ViewSwitcher",
			"./core/widget/core/PageIndicator",
			"./core/widget/core/scroller/Scroller",
			"./core/widget/core/scroller/scrollbar/ScrollBar",
			"./core/widget/core/SectionChanger",
			"./core/widget/core/VirtualListviewSimple",
			"./core/widget/core/Page",
			"./core/widget/core/Interactive3D",
			"./core/widget/core/CoverFlow",
			"./core/widget/core/Dimmer",
			"./core/widget/core/Graph",
			// wearable widgets
			"./profile/wearable/widget/wearable/Scrollview",
			"./profile/wearable/widget/wearable/Popup",
			"./profile/wearable/widget/wearable/Drawer",
			"./profile/wearable/widget/wearable/Slider",
			"./profile/wearable/widget/wearable/CircleProgressBar",
			"./profile/wearable/widget/wearable/Listview",
			"./profile/wearable/widget/wearable/IndexScrollbar",
			"./profile/wearable/widget/wearable/CircularIndexScrollbar",
			"./profile/wearable/widget/wearable/Progress",
			"./profile/wearable/widget/wearable/Progressing",
			"./profile/wearable/widget/wearable/ToggleSwitch",
			"./profile/wearable/widget/wearable/VirtualListview",
			"./profile/wearable/widget/wearable/VirtualGrid",
			"./profile/wearable/widget/wearable/SnapListview",
			"./profile/wearable/widget/wearable/SwipeList",
			"./profile/wearable/widget/wearable/Selector",
			"./profile/wearable/widget/wearable/Grid",
			"./profile/wearable/widget/wearable/NumberPicker",
			"./profile/wearable/widget/wearable/TimePicker",
			"./profile/wearable/widget/wearable/ArcListview",
			"./profile/wearable/widget/wearable/ColorPicker",
			"./profile/wearable/widget/wearable/DatePicker",
			"./profile/wearable/widget/wearable/TextInput",
			"./profile/wearable/widget/wearable/Spin",
			// helpers
			"./profile/wearable/helper/SnapListStyle",
			"./profile/wearable/helper/SnapListMarqueeStyle",
			"./profile/wearable/helper/DrawerMoreStyle",
			"./profile/wearable/helper/RotaryEventBinder",
			// extended routes
			"./profile/wearable/router/route/circularindexscrollbar",
			"./profile/wearable/router/route/grid",
			// API
			"./profile/wearable/expose",
			"./profile/wearable/backward",
			// events
			"./core/event/scrolledtoedge",
			"./core/event/rotaryemulation",
			// gesture tool
			"./core/event/gesture/Manager",
			"./core/event/gesture/Instance",
			// gestures detectors
			"./core/event/gesture/Drag",
			"./core/event/gesture/Swipe",
			"./core/event/gesture/Pinch",
			"./core/event/gesture/LongPress",
			// Modules to be loaded after
			//>>excludeEnd("tauUI");
			//>>excludeStart("tauMVC", pragmas.tauMVC);
			"./core/util/pathToRegexp",
			"./core/controller",
			//>>excludeEnd("tauMVC");
			"./core/template/html",
			"./core/info",
			"./core/init"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// setup profile info
			ns.info.profile = "wearable";
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			// run engine
			ns.engine.run();
		}
	);
}());
//>>excludeEnd("tauBuildExclude");
