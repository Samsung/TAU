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
			"../../template/webclip",
			"../BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				templateManager = ns.template,
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
						src: "",
						templateData: "",
						templateBasePath: ""
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
				var router = ns.router.Router.getInstance(),
					_data = {},
					templateBasePath = this.options.templateBasePath;

				if (templateBasePath && !templateBasePath.match(/\/$/)) {
					this.options.templateBasePath = templateBasePath + "/";
				}

				// save latest template source
				this._src = this.options.src;

				if (this.options.src !== "") {
					if (this.options.templateData) {
						try {
							_data = JSON.parse(this.options.templateData);
						} catch (err) {
							ns.warn("Card data-template-data wrong value: ", err);
						}
					}

					// read webclip html from file
					router.open(this.options.src, {
						rel: "card",
						card: this,
						data: {
							data: _data,
							element: element
						}
					});
				}

				this._bindEvents();

				return element;
			};

			prototype._refresh = function () {
				var router = ns.router.Router.getInstance(),
					templateEngine,
					_data,
					element;

				if (this.options.src !== "") {
					if (this.options.templateData) {
						try {
							_data = JSON.parse(this.options.templateData);
						} catch (err) {
							ns.warn("Card data-template-data wrong value: ", err);
						}
					}

					if (this.options.src !== this._src) {
						router.open(this.options.src, {
							rel: "card",
							card: this,
							data: {
								data: _data,
								element: this.element
							}
						});
					} else if (this._template) {
						templateEngine = templateManager.engine("webclip");
						element = templateEngine.fillWebClip(this._template, _data);
						this.changeContent(element, {url: this._url});
					}

					this._src = this.options.src;
				}
			};

			prototype.handleEvent = function (event) {

				switch (event.type) {
					case "vclick":
						this._onClick(event);
						break;
					case "webclip-update":
						this._onWebClipUpdate(event);
						break;
				}
			};

			prototype._bindEvents = function () {
				this.element.addEventListener("vclick", this, true);
				this.element.addEventListener("webclip-update", this, false);
			};

			prototype._unbindEvents = function () {
				this.element.removeEventListener("vclick", this, true);
				this.element.removeEventListener("webclip-update", this, false);
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
					scripts,
					relativePath,
					relativeFile,
					urlObject,
					templateBasePath = this.options.templateBasePath,
					dataTemplate;

				if (!content.parentNode || content.ownerDocument !== document) {
					dataTemplate = content.getAttribute("data-template-html");
					if (dataTemplate) {
						this._template = decodeURI(dataTemplate);
					}
					content.removeAttribute("data-template-html");

					// load styles.css
					links = content.querySelectorAll(selectors.LINKS);
					links.forEach(function (link) {
						if (link.href.indexOf(ns.util.path.parseLocation(options.url).domain) === 0) {
							// set path to file
							if (templateBasePath && link.getAttribute("data-template-rel") !== "origin") {
								relativePath = templateBasePath;
							} else {
								relativePath = options.url.replace(URL_FILE_REGEXP, "");
							}
							urlObject = ns.util.path.parseLocation(options.url);
							relativeFile = link.href.replace(urlObject.domain, "").replace(urlObject.directory, "");
							ns.util.load.cssSync(relativePath + relativeFile, function (styleElement) {
								ns.util.load.addElementToHead(styleElement, true);
							}, function (xhrObj, xhrStatus) {
								ns.warn("There was a problem when loading, status: " + xhrStatus);
							});
						}
						link.parentElement.removeChild(link);
					});

					// make scripts urls relative to base dir
					if (options && options.url) {
						urlObject = ns.util.path.parseLocation(options.url);

						scripts = content.querySelectorAll("script[src]");
						scripts.forEach(function (source) {
							// set path to file
							if (templateBasePath && source.getAttribute("data-template-rel") !== "origin") {
								relativePath = templateBasePath;
							} else {
								relativePath = options.url.replace(URL_FILE_REGEXP, "");
							}

							if (source.src.indexOf(ns.util.path.parseLocation(options.url).domain) === 0) {
								relativeFile = source.src.replace(urlObject.domain, "").replace(urlObject.directory, "");
								source.src = relativePath + relativeFile;
							}
						});
					}

					// evaluate scripts
					content = ns.util.importEvaluateAndAppendElement(content, element);

					// make images urls relative to base dir
					if (options && options.url) {
						urlObject = ns.util.path.parseLocation(options.url);

						images = content.querySelectorAll(selectors.IMAGES);
						images.forEach(function (source) {
							// set path to file
							if (templateBasePath && source.getAttribute("data-template-rel") !== "origin") {
								relativePath = templateBasePath;
							} else {
								relativePath = options.url.replace(URL_FILE_REGEXP, "");
							}
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
					// remove old content
					while (self.element.firstElementChild) {
						self.element.removeChild(self.element.firstElementChild);
					}
					content = self._include(content, options);
					ns.engine.createWidgets(content);
					eventUtils.trigger(content, "cardcontentchange");
				} else {
					eventUtils.trigger(content, "cardcontentabort");
				}
			};

			prototype._onClick = function (ev) {
				var actionData,
					actionElement = ns.util.selectors.getClosestBySelector(ev.target, "[data-action]");

				if (actionElement) {
					actionData = JSON.parse(actionElement.getAttribute("data-action"));

					if (actionData) {
						actionData.remoteui = true;
						ns.event.trigger(this.element, "webclip-message", actionData);
					}
				}
			};

			prototype._onWebClipUpdate = function (ev) {
				var data = ev.detail;

				this.option("template-data", JSON.stringify(data));
			};

			prototype.updateTemplate = function () {
				var data = JSON.parse(this.element.getAttribute("data-template-data") || ""),
					template = window.decodeURI(this.element.getAttribute("data-template-html") || ""),
					matches = template.match(/\{\{([a-z-_0-9]+)\}\}/gi);

				if (matches) {
					matches.forEach(function (match) {
						var variable = match.replace(/[{}]/g, "");

						if (data && data[variable]) {
							template = template.replace(match, data[variable]);
						}
					});
				}

				this.element.innerHTML = template;
			};

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
