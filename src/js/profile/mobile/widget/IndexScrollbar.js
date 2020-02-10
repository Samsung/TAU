/*global define, ns */
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
/*jslint nomen: true, plusplus: true */
/**
 * # Index Scrollbar
 * Index scrollbar component shows a shortcut list that is bound to its parent scroll bar and list view.
 *
 * If you move the mouse on the shortcut column then a pop-up with the text currently
 * under the cursor is also displayed.
 *
 *
 * ## Default selectors
 *
 * In default all elements with class _ui-indexscrollbar_ are changed to Tizen Web UI Index Scrollbar
 *
 *		@example
 *		<div data-role="page" id="main">
 *		    <div data-role="indexscrollbar" id="indexscrollbar"></div>
 *			<div data-role="content">
 *				<ul data-role="listview">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Billy</li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * #### Create Index Scrollbar widget using tau method:
 *
 *		@example
 *		<div data-role="page" id="main">
 *		    <div data-role="indexscrollbar" id="indexscrollbar"></div>
 *			<div data-role="content">
 *				<ul id="list">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Billy</li>
 *				</ul>
 *			</div>
 *		</div>
 *		<script>
 *			var isb = tau.widget.IndexScrollbar(document.getElementById("indexscrollbar"));
 *		</script>
 *
 * #### Create Index Scrollbar widget using jQueryMobile notation:
 *
 *		@example
 *		<div data-role="page" id="main">
 *		    <div data-role="indexscrollbar" id="indexscrollbar"></div>
 *			<div data-role="content">
 *				<ul id="list">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Billy</li>
 *				</ul>
 *			</div>
 *		</div>
 *		<script>
 *			var isb = $("#indexscrollbar").IndexScrollbar();
 *		</script>
 *
 * ## Options
 *
 * ### Index Scrollbar
 * _data-fastscroll_ option set to true, creates a fast scroll using the HTML unordered list (&lt;ul&gt;) element.
 *
 *		@example
 *		<div data-role="page" id="main">
 *		    <div data-role="indexscrollbar" id="indexscrollbar"></div>
 *			<div data-role="content">
 *				<ul id="contacts" data-role="listview">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Billy</li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		<div data-role="page" id="main">
 *		    <div data-role="indexscrollbar" id="indexscrollbar"></div>
 *			<div data-role="content">
 *				<ul id="contacts">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Billy</li>
 *				</ul>
 *			</div>
 *		</div>
 *		<script>
 *			var element = document.getElementById("contacts"),
 *				contacts = tau.widget.IndexScrollbar(element);
 *
 *			contacts.methodName(methodArgument1, methodArgument2, ...);
 *
 *			// or JQueryMobile notation:
 *			$(element).contacts("methodName", methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * @class ns.widget.mobile.IndexScrollbar
 * @extends ns.widget.core.IndexScrollbar
 * @since 2.0
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/util/selectors",
			"../../../core/widget/core/Page",
			"../../../core/widget/core/Scrollview",
			"../../../core/widget/core/indexscrollbar/IndexScrollbar",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var engine = ns.engine,
				selectors = ns.util.selectors,
				Page = ns.widget.core.Page,
				Scrollview = ns.widget.core.Scrollview,
				CoreIndexScrollbar = ns.widget.core.IndexScrollbar,
				CoreISBPrototype = CoreIndexScrollbar.prototype,
				prototype = new CoreIndexScrollbar(),
				IndexScrollbar = function () {
					var self = this;

					self._ui = {};
					CoreIndexScrollbar.call(self);
				},
				classes = {
					PAGE: Page.classes.uiPage,
					CONTENT: Page.classes.uiContent,
					SCROLLVIEW_CLIP: Scrollview.classes.clip,
					FLOATING_BUTTON_CONTAINER: "ui-floatingactions",
					GROUP_INDEX: "ui-group-index"
				},
				DEFAULT = {
					INDEX_HEIGHT: 20,
					MORE_CHAR_LINEHEIGHT: 4
				};

			IndexScrollbar.classes = classes;

			function getIndices(elements) {
				var indices = [],
					i,
					len;

				len = elements.length;
				for (i = 0; i < len; i++) {
					indices.push(elements[i].textContent.trim());
				}
				return indices;
			}
			/**
			 * Configure IndexScrollbar component
			 * @method _configure
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.IndexScrollbar
			 */
			prototype._configure = function (element) {
				var self = this,
					page = selectors.getClosestByClass(element, classes.PAGE),
					clip = page.querySelector("." + classes.CONTENT),
					indices = getIndices(page.getElementsByClassName(classes.GROUP_INDEX));

				CoreISBPrototype._configure.call(self);
				if (!self.options.container) {
					self.options.container = clip || element.parentNode;
				}
				if (indices.length) {
					self.options.index = indices;
				}
				self.options.indexHeight = DEFAULT.INDEX_HEIGHT;
				self.options.moreCharLineHeight = DEFAULT.MORE_CHAR_LINEHEIGHT;
				self.options.verticalCenter = false;
			};

			/**
			 * Init IndexScrollbar component
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.IndexScrollbar
			 */
			prototype._init = function (element) {
				var self = this;

				CoreISBPrototype._init.call(self, element);
				self._fitHeight();
			};

			/**
			 * Set IndexScrollbar layout
			 * @method _setInitialLayout
			 * @protected
			 * @member ns.widget.mobile.IndexScrollbar
			 */
			prototype._setInitialLayout = function () {
				var self = this,
					indexScrollbar = self.element,
					options = self.options,
					container = options.container,
					indexScrollbarStyle = indexScrollbar.style,
					containFloating = container.parentElement.querySelector("." + classes.FLOATING_BUTTON_CONTAINER);

				//if we need to shorten the height of the index, for example when
				//floatingButton is presented
				if (containFloating) {
					options.paddingBottom = container.offsetHeight -
							containFloating.offsetTop + container.offsetTop;
				}

				indexScrollbarStyle.height = container.offsetHeight + "px";
				indexScrollbarStyle.top = container.offsetTop + "px";
			};

			/**
			 * Fit IndexScrollbar height
			 * @method _fitHeight
			 * @protected
			 * @member ns.widget.mobile.IndexScrollbar
			 */
			prototype._fitHeight = function () {
				var self = this,
					element = self.element,
					wrapper = element.getElementsByTagName("ul")[0],
					lastChild = wrapper.lastChild,
					space;

				space = element.offsetHeight - wrapper.offsetHeight;
				if (lastChild) {
					lastChild.style.height = lastChild.offsetHeight + space + "px";
				}
			};

			// definition
			IndexScrollbar.prototype = prototype;
			ns.widget.mobile.IndexScrollbar = IndexScrollbar;

			engine.defineWidget(
				"IndexScrollbar",
				"[data-role='indexscrollbar'], .ui-indexscrollbar",
				[],
				IndexScrollbar,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.IndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
