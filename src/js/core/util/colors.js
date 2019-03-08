/*global window, ns, define, ns */
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
 * #Colors Utility
 * Class supports converting between color formats
 * @class ns.util.colors
 */

(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.util.colors = {
				/**
				 * Round to the nearest Integer
				 * @method nearestInt
				 * @param {number} val
				 * @return {number}
				 * @member ns.util.colors
				 * @static
				 */
				nearestInt: function (val) {
					var theFloor = Math.floor(val);

					return (((val - theFloor) > 0.5) ? (theFloor + 1) : theFloor);
				},

				/**
				 * Converts html color string to rgb array.
				 * @method HTMLToRGB
				 * @param {string} clrStr is of the form "#aabbcc"
				 * @return {number[]} Returns: [ r, g, b ], where
				 * r is in [0, 1]
				 * g is in [0, 1]
				 * b is in [0, 1]
				 * @member ns.util.colors
				 * @static
				 */
				HTMLToRGB: function (clrStr) {
					clrStr = (("#" === clrStr.charAt(0)) ? clrStr.substring(1) : clrStr);
					return ([
						clrStr.substring(0, 2),
						clrStr.substring(2, 4),
						clrStr.substring(4, 6)
					].map(function (val) {
						return parseInt(val, 16) / 255.0;
					}));
				},

				/**
				 * Converts rgb array to html color string.
				 * @method RGBToHTML
				 * @param {number[]} rgb Input: [ r, g, b ], where
				 * r is in [0, 1]
				 * g is in [0, 1]
				 * b is in [0, 1]
				 * @return {string} Returns string of the form "#aabbcc"
				 * @member ns.util.colors
				 * @static
				 */
				RGBToHTML: function (rgb) {
					return ("#" +
					rgb.map(function (val) {
						var ret = val * 255,
							theFloor = Math.floor(ret);

						ret = ((ret - theFloor > 0.5) ? (theFloor + 1) : theFloor);
						ret = (((ret < 16) ? "0" : "") + (ret & 0xff).toString(16));
						return ret;
					})
						.join(""));
				},

				/**
				 * Converts hsl to rgb.
				 * @method HSLToRGB
				 * @param {number[]} hsl Input: [ h, s, l ], where
				 * h is in [0, 360]
				 * s is in [0,   1]
				 * l is in [0,   1]
				 * @return {number[]} Returns: [ r, g, b ], where
				 * r is in [0, 1]
				 * g is in [0, 1]
				 * b is in [0, 1]
				 * @member ns.util.colors
				 * @static
				 */
				HSLToRGB: function (hsl) {
					var h = hsl[0] / 360.0,
						s = hsl[1],
						l = hsl[2],
						temp1,
						temp2,
						temp3,
						ret;

					if (0 === s) {
						ret = [l, l, l];
					} else {
						temp2 = ((l < 0.5) ? l * (1.0 + s) : l + s - l * s);
						temp1 = 2.0 * l - temp2;
						temp3 = {
							r: h + 1.0 / 3.0,
							g: h,
							b: h - 1.0 / 3.0
						};

						temp3.r = ((temp3.r < 0) ? (temp3.r + 1.0) : ((temp3.r > 1) ? (temp3.r - 1.0) : temp3.r));
						temp3.g = ((temp3.g < 0) ? (temp3.g + 1.0) : ((temp3.g > 1) ? (temp3.g - 1.0) : temp3.g));
						temp3.b = ((temp3.b < 0) ? (temp3.b + 1.0) : ((temp3.b > 1) ? (temp3.b - 1.0) : temp3.b));

						ret = [
							(((6.0 * temp3.r) < 1) ? (temp1 + (temp2 - temp1) * 6.0 * temp3.r) :
								(((2.0 * temp3.r) < 1) ? temp2 :
									(((3.0 * temp3.r) < 2) ? (temp1 + (temp2 - temp1) * ((2.0 / 3.0) - temp3.r) * 6.0) :
										temp1))),
							(((6.0 * temp3.g) < 1) ? (temp1 + (temp2 - temp1) * 6.0 * temp3.g) :
								(((2.0 * temp3.g) < 1) ? temp2 :
									(((3.0 * temp3.g) < 2) ? (temp1 + (temp2 - temp1) * ((2.0 / 3.0) - temp3.g) * 6.0) :
										temp1))),
							(((6.0 * temp3.b) < 1) ? (temp1 + (temp2 - temp1) * 6.0 * temp3.b) :
								(((2.0 * temp3.b) < 1) ? temp2 :
									(((3.0 * temp3.b) < 2) ? (temp1 + (temp2 - temp1) * ((2.0 / 3.0) - temp3.b) * 6.0) :
										temp1)))
						];
					}

					return ret;
				},

				/**
				 * Converts hsv to rgb.
				 * @method HSVToRGB
				 * @param {number[]} hsv Input: [ h, s, v ], where
				 * h is in [0, 360]
				 * s is in [0,   1]
				 * v is in [0,   1]
				 * @return {number[]} Returns: [ r, g, b ], where
				 * r is in [0, 1]
				 * g is in [0, 1]
				 * b is in [0, 1]
				 * @member ns.util.colors
				 */
				HSVToRGB: function (hsv) {
					return this.HSLToRGB(this.HSVToHSL(hsv));
				},

				/**
				 * Converts rgb to hsv.
				 * @method HSVToRGB
				 * @param {number[]} rgb Input: [ r, g, b ], where
				 * r is in [0,   1]
				 * g is in [0,   1]
				 * b is in [0,   1]
				 * @return {number[]} Returns: [ h, s, v ], where
				 * h is in [0, 360]
				 * s is in [0,   1]
				 * v is in [0,   1]
				 * @member ns.util.colors
				 * @static
				 */
				RGBToHSV: function (rgb) {
					var min,
						max,
						delta,
						h,
						s,
						v,
						r = rgb[0],
						g = rgb[1],
						b = rgb[2];

					min = Math.min(r, Math.min(g, b));
					max = Math.max(r, Math.max(g, b));
					delta = max - min;

					h = 0;
					s = 0;
					v = max;

					if (delta > 0.00001) {
						s = delta / max;

						if (r === max) {
							h = (g - b) / delta;
						} else {
							if (g === max) {
								h = 2 + (b - r) / delta;
							} else {
								h = 4 + (r - g) / delta;
							}
						}

						h *= 60;

						if (h < 0) {
							h += 360;
						}
					}

					return [h, s, v];
				},

				/**
				 * Converts Converts hsv to hsl.
				 * @method HSVToHSL
				 * @param {number[]} hsv Input: [ h, s, v ], where
				 * h is in [0, 360]
				 * s is in [0,   1]
				 * v is in [0,   1]
				 * @return {number[]} Returns: [ h, s, l ], where
				 * h is in [0, 360]
				 * s is in [0,   1]
				 * l is in [0,   1]
				 * @member ns.util.colors
				 * @static
				 */
				HSVToHSL: function (hsv) {
					var max = hsv[2],
						delta = hsv[1] * max,
						min = max - delta,
						sum = max + min,
						halfSum = sum / 2,
						sDivisor = ((halfSum < 0.5) ? sum : (2 - max - min));

					return [hsv[0], ((0 === sDivisor) ? 0 : (delta / sDivisor)), halfSum];
				},

				/**
				 * Converts rgb to hsl
				 * @method RGBToHSL
				 * @param {number[]} rgb Input: [ r, g, b ], where
				 * r is in [0,   1]
				 * g is in [0,   1]
				 * b is in [0,   1]
				 * @return {number[]} Returns: [ h, s, l ], where
				 * h is in [0, 360]
				 * s is in [0,   1]
				 * l is in [0,   1]
				 * @member ns.util.colors
				 */
				RGBToHSL: function (rgb) {
					return this.HSVToHSL(this.RGBToHSV(rgb));
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.colors;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
