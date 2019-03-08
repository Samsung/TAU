/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
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
/*global $ */
/*jslint unparam: true */
$(document).one("pageshow", "#pinch_page", function () {
	var lastRatio = 1,
		currentRatio;

	function getRatio(ratio) {
		var v = lastRatio + ratio - 1;

		if (v < $.mobile.pinch.min) {
			v = $.mobile.pinch.min;
		} else if (v > $.mobile.pinch.max) {
			v = $.mobile.pinch.max;
		}

		return v;
	}

	$("#pinch_demo").on("pinch", function (e, p) {
		var ratio;

		ratio = getRatio(p.ratio);

		if (currentRatio === ratio) {
			return;
		}

		currentRatio = ratio;

		$("#pinch_demo").find("img")
			.css({
				"-webkit-transform": "scale(" + currentRatio + ")",
				"-webkit-transition": "-webkit-transform 0.15s ease"
			});
	});

	$("#pinch_demo").on("pinchstart", function () {
		return;
	});

	$("#pinch_demo").on("pinchend", function (e, p) {
		lastRatio = getRatio(p.ratio);
	});

	$(window).bind("galleryorientationchanged", function () {
		lastRatio = 1;
	});
});
