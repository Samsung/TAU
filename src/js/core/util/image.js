/*
 * Copyright (c) 2021 Samsung Electronics Co., Ltd
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
/*global define, ns */
/**
 * #Image Utility
 * Object supports methods for images
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @class ns.util.image
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			// fetch namespace
			"../util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var image = {
				/**
				 * @method checkTransparency
				 * @param {HTMLElement} image
				 * @param {Array} points
				 * @return {boolean}
				 * @static
				 * @member ns.util.image
				 */
				checkTransparency: function (image, points) {
					var c,
						cnx,
						imageData;

					c = document.createElement("canvas");
					cnx = c.getContext("2d");
					c.width = image.width;
					c.height = image.height;

					points = points || [
						[0, 0], [image.width - 1, 0], [image.width - 1, image.height - 1], [0, image.height - 1]
					];

					cnx.drawImage(image, 0, 0, image.width, image.height);

					return points.some(function (point) {
						imageData = cnx.getImageData(point[0], point[1], 1, 1);
						return imageData && imageData.data[3] !== 255 || false;
					});
				}
			};

			ns.util.image = image;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return image;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
