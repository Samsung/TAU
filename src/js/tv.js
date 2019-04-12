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
			"./core/config",
			"./profile/tv/config",
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
			"./core/widget/customElements",
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
			"./core/widget/core/Interactive3D",
			"./core/widget/core/CoverFlow",
			"./core/widget/core/Graph",
			"./profile/mobile/widget/mobile/Popup",
			"./profile/mobile/widget/mobile/Scrollview",
			"./profile/mobile/widget/mobile/Expandable",
			"./profile/mobile/widget/mobile/Listview",
			"./core/widget/core/tab/Tabbar",
			"./profile/mobile/widget/mobile/TextInput",
			"./profile/mobile/widget/mobile/DropdownMenu",
			"./profile/mobile/widget/mobile/TextEnveloper",
			"./profile/mobile/widget/mobile/VirtualListview",
			"./core/widget/core/VirtualListviewSimple",
			"./profile/mobile/widget/mobile/VirtualGrid",
			"./profile/mobile/widget/mobile/Loader",
			"./profile/mobile/widget/mobile/Drawer",
			"./profile/mobile/widget/mobile/ToggleSwitch",
			"./profile/mobile/widget/mobile/Navigation",
			"./profile/mobile/widget/mobile/IndexScrollbar",
			"./profile/mobile/widget/mobile/Button",
			"./profile/mobile/widget/mobile/FloatingActions",
			"./profile/mobile/widget/mobile/ScrollHandler",
			"./core/widget/core/Tabs",
			"./profile/mobile/widget/mobile/GridView",
			"./profile/mobile/expose",
			// router modules
			"./core/router/Router",
			"./core/router/route/page",
			"./core/router/route/popup",
			"./core/router/route/popup",
			"./core/router/route/drawer",
			"./core/router/route/panel",
			"./core/history/manager",
			"./profile/wearable/expose",
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
			"./core/util/globalize"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.info.profile = "tv";
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			ns.engine.run();
		}
	);
}());
//>>excludeEnd("tauBuildExclude");
