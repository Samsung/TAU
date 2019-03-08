/*global window, ns, define */
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
 * #Legacy TizenSlider is provided this extra js file.
 *
 * @class ns.widget.mobile.Slider
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"./Slider.extra"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				TizenSlider = ns.widget.mobile.SliderExtra;

			ns.widget.mobile.TizenSlider = TizenSlider;
			engine.defineWidget(
				"TizenSlider",
				"",
				[],
				TizenSlider,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.TizenSlider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
