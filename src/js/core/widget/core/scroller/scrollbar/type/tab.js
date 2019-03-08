/*global window, define, Event, console, ns */
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
 * #Tab Type
 * Tab type support for scroll bar widget.
 * @class ns.widget.core.scroller.scrollbar.type.tab
 * @extends ns.widget.core.scroller.scrollbar.type.interface
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../type",
			"./interface",
			"../../Scroller",
			"../../../../../../core/util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var utilsObject = ns.util.object,
				type = ns.widget.core.scroller.scrollbar.type,
				typeInterface = type.interface,
				Scroller = ns.widget.core.scroller.Scroller;

			type.tab = utilsObject.merge({}, typeInterface, {
				options: {
					wrapperClass: "ui-scrollbar-tab-type",
					barClass: "ui-scrollbar-indicator",
					margin: 1
				},
				/**
				 * ...
				 * @method insertAndDecorate
				 * @param {Object} data
				 * @static
				 * @member ns.widget.core.scroller.scrollbar.type.tab
				 */
				insertAndDecorate: function (data) {
					var scrollbarElement = data.wrapper,
						barElement = data.bar,
						container = data.container,
						clip = data.clip,
						sections = data.sections,
						orientation = data.orientation,
						margin = this.options.margin,
						clipWidth = clip.offsetWidth,
						clipHeight = clip.offsetHeight,
						containerWidth = container.offsetWidth,
						containerHeight = container.offsetHeight,
						clipSize = orientation === Scroller.Orientation.VERTICAL ? clipHeight : clipWidth,
						containerSize = orientation === Scroller.Orientation.VERTICAL ? containerHeight : containerWidth,
						sectionSize = clipSize / containerSize,
						height,
						barHeight,
						i,
						len;

					this.containerSize = containerWidth;
					this.maxScrollOffset = clipSize - containerSize;
					this.scrollZoomRate = containerWidth / clipSize;
					this.barSize = window.parseInt((containerWidth - margin * 2 * (sectionSize - 1)) / sectionSize);

					scrollbarElement.className = this.options.wrapperClass;
					barElement.className = this.options.barClass;

					barElement.style.width = this.barSize + "px";
					barElement.style.left = "0px";

					container.insertBefore(scrollbarElement, clip);

					// reset page container and section layout.
					barHeight = barElement.offsetHeight;
					height = clipHeight - barHeight;
					clip.style.height = height + "px";
					if (sections && sections.length) {
						for (i = 0, len = sections.length; i < len; i++) {
							sections[i].style.height = height + "px";
						}
					}
				},

				/**
				 * ...
				 * @method remove
				 * @param {Object} data
				 * @static
				 * @member ns.widget.core.scroller.scrollbar.type.tab
				 */
				remove: function (data) {
					var scrollbarElement = data.wrapper,
						container = data.container;

					if (container && scrollbarElement) {
						container.removeChild(scrollbarElement);
					}
				},

				/**
				 * ...
				 * @method offset
				 * @param {string} orientation
				 * @param {number} offset
				 * @static
				 * @member ns.widget.core.scroller.scrollbar.type.tab
				 */
				offset: function (orientation, offset) {
					return {
						x: offset === 0 ? -1 :
							offset === this.maxScrollOffset ? this.containerSize - this.barSize - this.options.margin : offset * this.scrollZoomRate,
						y: 0
					};
				}

			});
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
