/*global ns, define, ns */
/*jslint nomen: true */
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
/**
 * #Route Card
 * Support class for router to fill content of card.
 * @class ns.router.route.card
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/object",
			"../../util/DOM/attributes",
			"../../util/path",
			"../route"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var routeCard,
				objectUtil = ns.util.object,
				path = ns.util.path,
				DOM = ns.util.DOM,
				defaults = {
					volatileRecord: true,
					orderNumber: 2
				},
				CardRoute = function () {
					this.filter = ".ui-card";
					this.options = defaults;
				},
				prototype = CardRoute.prototype;

			CardRoute.prototype = prototype;

			prototype.option = function () {
				return objectUtil.merge({}, defaults);
			};

			prototype.find = function () {
				return null;
			};

			/**
			 * This method creates data url from absolute url given as argument.
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @protected
			 * @static
			 * @member ns.router.route.card
			 * @return {string}
			 */
			prototype._createDataUrl = function (absoluteUrl) {
				return path.convertUrlToDataUrl(absoluteUrl, true);
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed card content
			 * @member ns.router.route.card
			 * @return {?HTMLElement} Element of content in parsed document.
			 */
			prototype.parse = function (html, absUrl) {
				var self = this,
					card,
					dataUrl = self._createDataUrl(absUrl);

				// Finding matching page inside created element
				card = html.querySelector(self.filter);

				// If a card exists...
				if (card) {
					DOM.setNSData(card, "url", dataUrl);
					DOM.setNSData(card, "external", true);
				}
				return card;
			};


			/**
			 * This method changes card content.
			 * @method open
			 * @param {HTMLElement|string} content The content which will be attached
			 * @param {Object} [options]
			 * @param {string} [options.dataUrl] Sets if card has url attribute.
			 * @member ns.router.route.card
			 */
			prototype.open = function (content, options) {
				var url = DOM.getNSData(content, "url"),
					card = options.card;

				// if no url is set, apply the address of chosen card to data-url attribute
				if (!url && options.href) {
					url = options.href;
					DOM.setNSData(content, "url", url);
				}

				if (url && !options.fromHashChange) {
					if (!path.isPath(url) && url.indexOf("#") < 0) {
						url = path.makeUrlAbsolute("#" + url, path.documentUrl.hrefNoHash);
					}
				}

				if (card) {
					card.changeContent(content, options);
				}

			};

			routeCard = new CardRoute();

			ns.router.route.card = routeCard;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routeCard;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
