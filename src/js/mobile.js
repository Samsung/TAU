/*global define, ns */
/**
 * #Tizen Advanced UI Framework
 *
 * Tizen Advanced UI Framework(TAU) is new name of Tizen Web UI framework. It provides tools, such as widgets, events, effects, and animations, for Web application development. You can leverage these tools by just selecting the required screen elements and creating applications.
 *
 * TAU service is based on a template and works on a Web browser, which runs on the WebKit engine. You can code Web applications using the TAU, standard HTML5, and Tizen device APIs. You can also use different widgets with CSS animations and rendering optimized for Tizen Web browsers.
 *
 * For more information about the basic structure of a page in the Web application using the TAU, see [Application Page Structure](page/app_page_layout.htm).
 *
 * ##Framework Services
 *
 * The Web UI framework consists of the following services:
 *
 *  - Page navigation
 *
 *    Navigation JavaScript library is provided to allow smooth navigation between TAU based application [pages](page/layout.htm).
 *  - Web widgets and themes
 *
 *    We support APIs and CSS themes for Tizen web [widgets](widget/widget_reference.htm)
 *  - Element Events
 *
 *    Some special [events](event/event_reference.htm) are available with TAU that optimized for the Web applications.
 *  - Useful utility
 *
 *    Some special [utility](util/util_reference.htm) are available with TAU that supporting easy DOM methods for the Web applications.
 *
 * !!!The framework runs only on browsers supporting the HTML5/CSS standards. The draft version of the W3C specification is not fully supported.!!!
 * @class ns.mobile
 * @title Tizen Advanced UI Framework
 */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function () {
	"use strict";

	window.nsConfig = {
		autostart: false
	};

	define(
		[
			"require",
			//>>excludeStart("tauPerformance", pragmas.tauPerformance);
			"./tools/performance",
			//>>excludeEnd("tauPerformance")
			//>>excludeStart("tauUI", pragmas.tauUI);
			"./core/core",
			"./profile/mobile/config",
			"./core/config",
			"./core/defaults",
			"./core/support",
			"./core/info",
			"./jqm/all",
			"./core/engine",
			"./core/frameworkData",
			"./core/util/anchorHighlight",
			"./core/util/grid",
			"./core/util/data",
			"./core/util/array",
			"./core/util/DOM",
			"./core/util/selectors",
			"./core/util/object",
			"./core/util/date",
			"./core/util/callbacks",
			"./core/util/deferred",
			"./core/util/deferredWhen",
			"./core/util/path",
			"./core/util/bezierCurve",
			"./core/util/zoom",
			"./core/util/anim/Keyframes",
			"./core/util/anim/Animation",
			"./core/util/anim/Chain",
			"./core/event/vmouse",
			"./core/event/hwkey",
			"./core/event/throttledresize",
			"./core/event/orientationchange",
			"./core/event/gesture/Manager",
			"./core/event/gesture/Instance",
			"./core/event/gesture/Drag",
			"./core/event/gesture/Swipe",
			"./core/event/gesture/Pinch",
			"./core/event/gesture/LongPress",
			"./core/widget/core/scroller/Scroller",
			"./core/widget/core/scroller/scrollbar/ScrollBar",
			"./core/widget/core/SectionChanger",
			"./core/widget/core/Dimmer",
			// widget list
			"./core/widget/core/Checkbox",
			"./core/widget/core/Radio",
			"./core/widget/core/PanelChanger",
			"./core/widget/core/PageIndicator",
			"./core/widget/core/Slider",
			"./core/widget/core/progress/Progress",
			"./core/widget/core/Page",
			"./core/widget/core/Appbar",
			"./core/widget/core/Interactive3D",
			"./core/widget/core/CoverFlow",
			"./core/widget/core/Graph",
			"./profile/mobile/widget/Popup",
			"./profile/mobile/widget/Scrollview",
			"./profile/mobile/widget/Expandable",
			"./profile/mobile/widget/Listview",
			"./core/widget/core/Marquee",
			"./core/widget/core/tab/Tabbar",
			"./core/widget/core/OnOffSwitch",
			"./profile/mobile/widget/TextInput",
			"./profile/mobile/widget/DropdownMenu",
			"./profile/mobile/widget/TextEnveloper",
			"./profile/mobile/widget/VirtualListview",
			"./core/widget/core/VirtualListviewSimple",
			"./profile/mobile/widget/VirtualGrid",
			"./profile/mobile/widget/Loader",
			"./profile/mobile/widget/Drawer",
			"./profile/mobile/widget/ToggleSwitch",
			"./profile/mobile/widget/Navigation",
			"./profile/mobile/widget/IndexScrollbar",
			"./profile/mobile/widget/Button",
			"./profile/mobile/widget/FloatingActions",
			"./profile/mobile/widget/ScrollHandler",
			"./core/widget/core/Tabs",
			"./profile/mobile/widget/GridView",
			"./profile/mobile/expose",
			// router modules
			"./core/router/Router",
			"./core/router/route/page",
			"./core/router/route/popup",
			"./core/router/route/popup",
			"./core/router/route/drawer",
			"./core/router/route/panel",
			"./core/history/manager",
			// Modules to be loaded after
			//>>excludeEnd("tauUI");
			//>>excludeStart("tauMVC", pragmas.tauMVC);
			"./core/util/pathToRegexp",
			"./core/controller",
			//>>excludeEnd("tauMVC");
			"./core/template/html",
			"./core/info",
			"./core/init",
			// globalize
			"./core/util/globalize",
			// theme manager
			"./core/theme/themeManager"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.info.profile = "mobile";
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			ns.engine.run();
		}
	);
}());
//>>excludeEnd("tauBuildExclude");
