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
		"../../../core/util/selectors"
	],
	function () {
		//>>excludeEnd("tauBuildExclude");
		var CoreSpin = ns.widget.core.Spin,
			CoreSpinPrototype = CoreSpin.prototype,
			engine = ns.engine,
			selectors = ns.util.selectors,
			utilsEvents = ns.event,
			objectUtil = ns.util.object,
			classes = objectUtil.copy(CoreSpin.classes),
			Spin = function () {
				var self = this;

				CoreSpin.call(self);
			},
			prototype = new CoreSpin();

		Spin.prototype = prototype;
		Spin.classes = classes,
		Spin.timing = CoreSpin.timing;

		prototype._vclick = function (event) {
			var target = event.target;

			if (selectors.getClosestBySelector(target, "." + classes.SPIN) === null) {
				this.option("enabled", false);
			} else {
				if (!this.option("enabled")) {
					this.option("enabled", true);
				} else if (target.classList.contains(classes.SELECTED)) {
					this.option("enabled", false);
				}
			}
		}

		prototype.handleEvent = function (event) {
			var self = this;

			CoreSpinPrototype.handleEvent.call(self, event);

			if (event.type === "vclick") {
				self._vclick(event);
			}
		}

		prototype._bindEvents = function () {
			var self = this;

			CoreSpinPrototype._bindEvents.call(self);

			utilsEvents.on(document, "vclick", self);
		}

		prototype._unbindEvents = function () {
			var self = this;

			CoreSpinPrototype._unbindEvents.call(self);

			utilsEvents.off(document, "vclick", self);
		}

		ns.widget.mobile.Spin = Spin;

		engine.defineWidget(
			"Spin",
			".ui-spin",
			[],
			Spin,
			"mobile"
		);

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return ns.widget.mobile.Spin;
	});
	//>>excludeEnd("tauBuildExclude");

})(window, ns);
