/*global window, define, ns*/
/*jslint nomen: true */
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
/**
 * # ScrollView Widget
 * Widgets allows for creating scrollable panes, lists, etc.
 *
 * ## Default selectors
 * All elements with _data-role=content attribute or _.ui-scrollview
 * css class will be changed to ScrollView widgets, unless they specify
 * _data-scroll=none attribute.
 *
 * ### HTML Examples
 *
 * #### Data attribute
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content"><!-- this will become scrollview //-->
 *				content data
 *			</div>
 *		</div>
 *
 * #### CSS Class
 *
 *		@example
 *		<div data-role="page">
 *			<div class="ui-content"><!-- this will become scrollview //-->
 *				content data
 *			</div>
 *		</div>
 *
 * ## Manual constructor
 *
 * To create the widget manually you can use 2 different APIs, the TAU
 * API or jQuery API.
 *
 * ### Create scrollview by TAU API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				page content
 *			</div>
 *		</div>
 *		<script>
 *			var page = tau.widget.Page(document.getElementById("myPage")),
 *				scrollview = tau.widget.Scrollview(page.ui.content);
 *		</script>
 *
 * ### Create scrollview using jQuery API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				page content
 *			</div>
 *		</div>
 *		<script>
 *			$("#myPage > div[data-role='content']").scrollview();
 *		</script>
 *
 * ## Options for Scrollview widget
 *
 * Options can be set using data-* attributes or by passing them to
 * the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * jQuery mobile format is also supported.
 *
 * ## Scroll
 *
 * This options specifies of a content element should become Scrollview
 * widget.
 *
 * You can change this by all available methods for changing options.
 *
 * ### By data-scroll attribute
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content" data-scroll="none">
 *				content
 *			</div>
 *		</div>
 *
 * ### By config passed to constructor
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			var contentElement = document.querySelector(".myPageClass > div[data-role=content]");
 *			tau.widget.Scrollview(contentElement, {
 *				"scroll": false
 *			});
 *		</script>
 *
 * ### By using jQuery API
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			$(".myPageClass > div[data-role='content']").scrollview({
 *				"scroll": false
 *			});
 *		</script>
 *
 * ## ScrollJumps
 *
 * Scroll jumps are small buttons which allow the user to quickly
 * scroll to top or left
 *
 * You can change this by all available methods for changing options.
 *
 * ### By data-scroll-jump
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content" data-scroll-jump="true">
 *				content
 *			</div>
 *		</div>
 *
 * ### By config passed to constructor
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			var contentElement = document.querySelector(".myPageClass > div[data-role=content]");
 *			tau.widget.Scrollview(contentElement, {
 *				"scrollJump": true
 *			});
 *		</script>
 *
 * ### By using jQuery API
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			$(".myPageClass > div[data-role='content']").scrollview({
 *				"scrollJump": true
 *			});
 *		</script>
 *
 * ## Methods
 *
 * Page methods can be called trough 2 APIs: TAU API and jQuery API
 * (jQuery mobile-like API)
 *
 * @class ns.widget.mobile.Scrollview
 * @extends ns.widget.core.Scrollview
 *
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Grzegorz Osimowicz <g.osimowicz@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 */
/**
 * Triggered when scrolling operation starts
 * @event scrollstart
 * @member ns.widget.mobile.Scrollview
 */
/**
 * Triggered when scroll is being updated
 * @event scrollupdate
 * @member ns.widget.mobile.Scrollview
 */
/**
 * Triggered when scrolling stops
 * @event scrollstop
 * @member ns.widget.mobile.Scrollview
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/widget/core/Scrollview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Scrollview = ns.widget.core.Scrollview;

			ns.widget.mobile.Scrollview = Scrollview;
			ns.engine.defineWidget(
				"Scrollview",
				".ui-content:not([data-scroll='none']):not([data-handler='true']):not(.ui-scrollview-clip)" +
						":not(.ui-scrolllistview):not(.ui-scrollhandler)" +
						", [data-scroll]:not([data-scroll='none']):not([data-handler='true']):not(.ui-scrollhandler)" +
						", .ui-scrollview:not([data-scroll='none']):not([data-handler='true']):not(.ui-scrollhandler)",
				[
					"scrollTo",
					"ensureElementIsVisible",
					"centerToElement",
					"getScrollPosition",
					"skipDragging",
					"translateTo"
				],
				Scrollview,
				"tizen",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Scrollview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
