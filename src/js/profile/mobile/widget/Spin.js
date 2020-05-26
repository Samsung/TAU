/*global define, ns */
/*jslint nomen: true, plusplus: true */
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
 *
 */
/**
 * #Spin
 *
 * @class ns.widget.mobile.Spin
 * @since 1.2
 * @extends ns.widget.core.BaseWidget
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Hunseop Jeong <hs85.jeong@samsung.com>
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../../../core/widget/core/Spin",
		"../../../core/engine",
		"../../../core/util/object",
	],
	function () {
		//>>excludeEnd("tauBuildExclude");
		var CoreSpin = ns.widget.core.Spin,
			CoreSpinPrototype = CoreSpin.prototype,
			engine = ns.engine,
			objectUtil = ns.util.object,
			classes = objectUtil.copy(CoreSpin.classes),
			Spin = function () {
				var self = this,
					options = {
						scaleFactor: 0,
						moveFactor: 0.5,
						itemHeight: 54,
						dragTarget: "self"
					};

				CoreSpin.call(self);

				// Merge options from prototype
				self.options = (!self.options) ?
					options :
					objectUtil.fastMerge(self.options, options);
			},
			prototype = new CoreSpin();

		prototype._init = function () {
			var self = this;

			CoreSpinPrototype._init.call(self);

			// Enable the spin by default
			self.option("enabled", true);
		}

		Spin.prototype = prototype;
		Spin.classes = classes;
		Spin.timing = CoreSpin.timing;

		ns.widget.mobile.Spin = Spin;

		engine.defineWidget(
			"Spin",
			".ui-spin",
			[],
			Spin,
			"mobile",
			true
		);

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return ns.widget.mobile.Spin;
	});
	//>>excludeEnd("tauBuildExclude");

})(window, ns);
