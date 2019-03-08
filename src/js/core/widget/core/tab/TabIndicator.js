/*global window, ns, define, Event, console */
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
 * #TabIndicator Widget
 * Widget create tabs indicator.
 * @class ns.widget.core.TabIndicator
 * @since 2.3
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../engine",
			"../../../util/object",
			"../Tab",
			"../../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Tab = ns.widget.core.Tab,
				engine = ns.engine,
				object = ns.util.object,

				TabIndicator = function () {
					this.tabSize = 0;
					this.width = 0;
				},

				TabPrototype = Tab.prototype,
				prototype = new Tab();

			TabIndicator.prototype = prototype;

			prototype._init = function (element) {
				var o = this.options;

				this.width = element.offsetWidth;
				element.classList.add(o.wrapperClass);
			};

			prototype._configure = function () {
				/**
				 * @property {Object} options Options for widget
				 * @property {number} [options.margin=2]
				 * @property {boolean} [options.triggerEvent=false]
				 * @property {string} [options.wrapperClass="ui-tab-indicator]
				 * @property {string} [options.itemClass="ui-tab-item"]
				 * @property {string} [options.activeClass="ui-tab-active"]
				 * @member ns.widget.core.TabIndicator
				 */
				object.merge(this.options, {
					margin: 4,
					triggerEvent: false,
					wrapperClass: "ui-tab-indicator",
					itemClass: "ui-tab-item",
					activeClass: "ui-tab-active",
					active: 0
				});
			};

			prototype._createIndicator = function () {
				var o = this.options,
					wrap = document.createDocumentFragment(),
					widthTable = [],
					margin = o.margin,
					i = 0,
					len = this.tabSize,
					width = this.width - margin * (len - 1),
					std = Math.floor(width / len),
					remain = width % len,
					span,
					offset = 0;

				for (i = 0; i < len; i++) {
					widthTable[i] = std;
				}

				for (i = Math.floor((len - remain) / 2); remain > 0; i++, remain--) {
					widthTable[i] += 1;
				}

				for (i = 0; i < len; i++) {
					span = document.createElement("span");
					span.classList.add(o.itemClass);
					span.style.width = widthTable[i] + "px";
					span.style.left = offset + "px";
					offset += widthTable[i] + margin;

					if (i === o.active) {
						span.classList.add(o.activeClass);
					}
					wrap.appendChild(span);
				}

				this.element.appendChild(wrap);
			};

			prototype._removeIndicator = function () {
				this.element.innerHTML = "";
			};

			prototype._refresh = function () {
				this._removeIndicator();
				this._createIndicator();
			};

			/**
			 * @method setActive
			 * @param {number} index
			 * @member ns.widget.core.TabIndicator
			 */
			prototype._setActive = function (index) {
				var o = this.options,
					nodes = this.element.children;

				o.active = index;

				[].forEach.call(nodes, function (element) {
					element.classList.remove(o.activeClass);
				});

				if (index < nodes.length) {
					nodes[index].classList.add(o.activeClass);

					TabPrototype._setActive.call(this, index);
				}
			};

			/**
			 * @method setSize
			 * @param {number} size
			 * @member ns.widget.core.TabIndicator
			 */
			prototype.setSize = function (size) {
				var needRefresh = this.tabSize !== size;

				this.tabSize = size;
				if (needRefresh) {
					this.refresh();
				}
			};

			prototype._destroy = function () {
				var o = this.options;

				this._removeIndicator();

				this.element.classList.remove(o.wrapperClass);
			};

			ns.widget.core.TabIndicator = TabIndicator;

			engine.defineWidget(
				"TabIndicator",
				".ui-tab",
				["setActive", "getActive", "setSize"],
				TabIndicator
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
