/*global ns, define */
/*
 * Copyright (c) 2020 Samsung Electronics Co., Ltd
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
 * #Card
 *
 * @class ns.widget.core.Card
 * @extends ns.widget.BaseWidget
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util/selectors",
			"../../util/path",
			"../BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				/**
				 * Local alias for ns.event
				 * @property {Object} eventUtils Alias for {@link ns.event}
				 * @member ns.widget.core.Card
				 * @static
				 * @private
				 */
				eventUtils = ns.event,
				classes = {
					/**
					 * Standard widget
					 * @style ui-card
					 * @member ns.widget.core.Card
					 */
					CARD: "ui-card"
				},
				Card = function () {
					this._ui = {};
					this.options = {
						src: ""
					}
				},
				// regexp for filename in URL string
				URL_FILE_REGEXP = /([^/])+$/,
				// selectors used by this module
				selectors = {
					LINKS: "link[href]",
					IMAGES: "img[src]"
				},
				prototype = new BaseWidget();

			Card.classes = classes;
			Card.prototype = prototype;

			/**
			 * Build Card component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Card
			 * @protected
			 */
			prototype._build = function (element) {
				element.classList.add(classes.CARD);

				return element;
			};

			/**
			 * Init Card component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Card
			 * @protected
			 */
			prototype._init = function (element) {
				var router = ns.router.Router.getInstance();

				if (this.options.src !== "") {
					router.open(this.options.src, {
						rel: "card",
						card: this
					});
				}

				return element;
			};

			/**
			* This method adds an element as a card content.
			* @method _include
			* @param {HTMLElement} content content an element to add
			* @return {HTMLElement}
			* @member ns.widget.core.Card
			* @protected
			*/
			prototype._include = function (content, options) {
				var element = this.element,
					links,
					images,
					relativePath,
					relativeFile,
					urlObject;

				if (!content.parentNode || content.ownerDocument !== document) {
					// load styles.css
					links = content.querySelectorAll(selectors.LINKS);
					links.forEach(function (link) {
						if (link.href.indexOf(ns.util.path.parseLocation(options.url).domain) === 0) {
							urlObject = ns.util.path.parseLocation(options.url);
							relativeFile = link.href.replace(urlObject.domain, "").replace(urlObject.directory, "");
							ns.util.load.cssSync(link.href, function (styleElement) {
								ns.util.load.addElementToHead(styleElement, true);
							}, function (xhrObj, xhrStatus) {
								ns.warn("There was a problem when loading, status: " + xhrStatus);
							});
						}
						link.parentElement.removeChild(link);
					});

					// evaluate scripts
					content = ns.util.importEvaluateAndAppendElement(content, element);

					// make images urls relative to base dir
					if (options && options.url) {
						urlObject = ns.util.path.parseLocation(options.url);
						relativePath = options.url.replace(URL_FILE_REGEXP, "");

						images = content.querySelectorAll(selectors.IMAGES);
						images.forEach(function (source) {
							if (source.src.indexOf(ns.util.path.parseLocation(options.url).domain) === 0) {
								relativeFile = source.src.replace(urlObject.domain, "").replace(urlObject.directory, "");
								source.src = relativePath + relativeFile;
							}
						});
					}
				}
				return content;
			};

			prototype.changeContent = function (content, options) {
				var self = this;

				if (self.element.parentElement) {
					content = self._include(content, options);
					ns.engine.createWidgets(content);
					eventUtils.trigger(content, "cardcontentchange");
				} else {
					eventUtils.trigger(content, "cardcontentabort");
				}

			};

			/**
			 * Destroy Card component
			 * @method _destroy
			 * @member ns.widget.core.Card
			 * @protected
			 */
			prototype._destroy = function () {
				this._unbindEvents();
			};

			// definition
			ns.widget.core.Card = Card;

			engine.defineWidget(
				"Card",
				".ui-card",
				[],
				Card,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
