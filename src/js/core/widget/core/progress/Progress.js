/*global window, define, ns */
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
 * #Progress
 * Progress component shows that an operation is in progress.
 *
 * #Crete widget
 *
 * Shows a control that indicates the progress percentage of an on-going operation by circular shape.
 *
 *     @example template tau-progress
 *         <progress class="ui-circle-progress" max="${1:100}" value="${2:20}"></progress>
 *
 *
 * ##Set and Get the value
 * You can set or get the value with the value() method
 *
 * @since 2.0
 * @class ns.widget.core.progress.Progress
 * @component-selector .ui-circle-progress, .ui-progress
 * @extends ns.widget.BaseWidget
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../util",
			"../../../util/selectors",
			"../../../util/DOM",
			"../../../util/object",
			"../../../event",
			"../../core", // fetch namespace
			"../../BaseWidget",
			"../progress",
			"./type/activitybar",
			"./type/activitycircle",
			"./type/progressbar",
			"./type/progresscircle",
			"../Page"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,
				events = ns.event,
				engine = ns.engine,
				util = ns.util,
				selectors = ns.util.selectors,
				utilsObject = ns.util.object,
				Page = ns.widget.core.Page,
				eventType = {
					/**
					 * Event is triggered when value of widget is changing.
					 * @event change
					 * @member ns.widget.mobile.ProgressBar
					 */
					CHANGE: "change"
				},

				progressType = {
					PROGRESS_BAR: "bar",
					PROGRESS_CIRCLE: "circle",
					ACTIVITY_BAR: "activitybar",
					ACTIVITY_CIRCLE: "activitycircle"
				},

				circleSize = {
					SMALL: "small",
					MEDIUM: "medium",
					LARGE: "large",
					FULL: "full"
				},
				/**
				 * Progress constructor
				 * @method Progress
				 */
				Progress = function () {
					var self = this;

					self.options = utilsObject.merge({}, Progress.defaults);
					self._ui = {};
					self._type = null;
					self._progress = null;
					self._isAnimating = false;
					self._callbacks = {};
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @member ns.widget.core.progress.Progress
				 * @private
				 * @static
				 * @readonly
				 */
				classes = {
					uiProgress: "ui-progress"
				},
				defaults = {
					type: progressType.PROGRESS_BAR,
					size: circleSize.MEDIUM,
					value: 100,
					min: 0,
					max: 100
				},

				prototype = new BaseWidget();

			Progress.prototype = prototype;
			Progress.classes = classes;
			Progress.events = eventType;
			Progress.defaults = defaults;

			/**
			 * Build structure of Progress component
			 * @method _build
			 * @param {HTMLElement} element
			 * @member ns.widget.core.progress.Progress
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this,
					options = self.options;

				self._type = options.type;

				element.classList.add(classes.uiProgress);
				self._progress = ns.widget.core.progress.type[options.type];
				self._progress.build(self, element);

				return element;
			};

			/**
			 * Initialization of Progress component
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.core.progress.Progress
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this;

				self._progress.init(self, element);
				element.setAttribute("value", self.options.value);

				return element;
			};

			/**
			 * Refresh of Progress
			 * @method _refresh
			 * @param {HTMLElement} element
			 * @member ns.widget.core.progress.Progress
			 * @protected
			 */
			prototype._refresh = function (element) {
				var self = this,
					options = self.options;

				if (self._type !== options.type) {
					self._destroy();
					return ns.widget.Progress(element, {type: options.type});
				} else {
					self._progress.refresh(self);
					self._setValue(self.options.value);
				}

				return element;
			};

			prototype._setValue = function (value) {
				var self = this,
					options = self.options,
					element = self.element;

				self._oldValue = options.value;


				if (typeof value === "number") {
					value = Math.min(options.max, Math.max(options.min, value));
					// value changed
					if (value !== self._oldValue) {
						options.value = value;
						if (!self.isCustomElement) {
							element.setAttribute("data-value", value);
						}
						element.setAttribute("value", value);
						events.trigger(element, eventType.CHANGE);
						self._progress.changeValue(self, self._oldValue, value);
					}
					return true;
				}
				return false;
			};

			/**
			 * Return value of progress
			 * @return {number}
			 * @private
			 */
			prototype._getValue = function () {
				return parseInt(this.element.getAttribute("value"), 10);
			};

			prototype._animate = function (duration, progressCallback, finishCallback) {
				var self = this,
					startTime = null;

				self._isAnimating = true;

				util.requestAnimationFrame(function step(timeStamp) {
					var currentTimeGap = 0;

					if (startTime === null) {
						startTime = timeStamp;
					}
					currentTimeGap = timeStamp - startTime;

					progressCallback(currentTimeGap);

					if (self._isAnimating && duration > currentTimeGap) {
						util.requestAnimationFrame(step);
					} else {
						self._isAnimating = false;
						finishCallback();
					}
				});
			};

			/**
			 * Callback on event pagebeforeshow
			 * @method pageBeforeShow
			 * @param {ns.widget.core.progress.Progress} self
			 * @private
			 * @member ns.widget.core.progress.Progress
			 */
			function pageBeforeShow(self) {
				self.refresh();
			}

			/**
			 * Bind events to Progress
			 * @method _bindEvents
			 * @member ns.widget.core.progress.Progress
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					page = selectors.getClosestByClass(element, Page.classes.uiPage);

				self._callbacks.onPageBeforeShow = pageBeforeShow.bind(null, self);
				page.addEventListener(Page.events.BEFORE_SHOW, self._callbacks.onPageBeforeShow, false);
			};

			/**
			 * Destroys Progress component
			 * @method _destroy
			 * @member ns.widget.core.progress.Progress
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element,
					page;

				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}

				self._ui = null;
				self._oldValue = null;

				if (self._callbacks.onPageBeforeShow) {
					page = selectors.getClosestByClass(element, Page.classes.uiPage);
					page.removeEventListener(Page.events.BEFORE_SHOW, self._callbacks.onPageBeforeShow, false);
				}

				return element;
			};

			ns.widget.core.progress.Progress = Progress;

			engine.defineWidget(
				"Progress",
				"[data-role='progress'], .ui-progress",
				[],
				Progress,
				"core"
			);

			return Progress;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
