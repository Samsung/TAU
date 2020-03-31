/*global define, ns */
/*jslint nomen: true, plusplus: true */
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
 *
 */
/**
 * #Spin
 *
 * @class ns.widget.wearable.Spin
 * @since 5.0
 * @extends ns.widget.core.BaseWidget
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
/**
 * Main file of applications, which connect other parts
 */
// then we can load plugins for libraries and application
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../../../../core/widget/core/Spin",
		"../../../../core/engine",
		"../../../../core/util/object"
	],
	function () {
		//>>excludeEnd("tauBuildExclude");
		var CoreSpin = ns.widget.core.Spin,
			engine = ns.engine,
			objectUtil = ns.util.object,
			classes = objectUtil.copy(CoreSpin.classes),
			Spin = function () {
				var self = this;

				CoreSpin.call(self);
			},
			prototype = new CoreSpin();

		Spin.prototype = prototype;
		Spin.classes = classes;
		Spin.timing = CoreSpin.timing;

		ns.widget.wearable.Spin = Spin;

		engine.defineWidget(
			"Spin",
			".ui-spin",
			[],
			Spin,
			"wearable"
		);

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return ns.widget.wearable.Spin;
	});
	//>>excludeEnd("tauBuildExclude");

})(window, ns);
