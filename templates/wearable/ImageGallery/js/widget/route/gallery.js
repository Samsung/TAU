/*global window, define */
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
 * #Route gallery
 * Support class for router to control gallery widget in profile Wearable.
 * @class ns.router.route.gallery
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	var gallery = ns.widget.wearable.Gallery,
		history = ns.router.history,
		routeGallery = {
			orderNumber: 1000,
			filter: ".ui-gallery",

			/**
			 * Returns default route options used inside Router.
			 * But, gallery router has not options.
			 * @method option
			 * @static
			 * @member ns.router.route.gallery
			 * @return null
			 */
			option: function () {
				return null;
			},

			open: function (toPage, options) {
				history.replace({
					url: options.url,
					rel: options.rel
				},
					options.url,
					options.title
				);
			},
			onHashChange: function (url, options, prev) {
				return null;
			},
			find: function (absUrl) {
				return null;
			}

		};

	ns.router.route.gallery = routeGallery;

}(window.document, window.tau));
