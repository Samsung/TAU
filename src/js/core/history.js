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
 *
 */
/**
 * #History
 * Object controls history changes.
 *
 * @class ns.history
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var historyVolatileMode,
				object = ns.util.object,
				historyUid = 0,
				historyActiveIndex = 0,
				windowHistory = window.history,
				history = {
					/**
					 * Property contains active state in history.
					 * @property {Object} activeState
					 * @static
					 * @member ns.history
					 */
					activeState: null,

					/**
					 * This method replaces or pushes state to history.
					 * @method replace
					 * @param {Object} state The state object
					 * @param {string} stateTitle The title of state
					 * @param {string} url The new history entry's URL
					 * @static
					 * @member ns.history
					 */
					replace: function (state, stateTitle, url) {
						var newState = object.merge({}, state, {
							uid: historyVolatileMode ? historyActiveIndex : ++historyUid,
							stateUrl: url,
							stateTitle: stateTitle
						});

						windowHistory[historyVolatileMode ? "replaceState" : "pushState"](newState, stateTitle, url);
						history.setActive(newState);
					},

					/**
					 * This method moves backward through history.
					 * @method back
					 * @static
					 * @member ns.history
					 */
					back: function () {
						windowHistory.back();
					},

					/**
					 * This method sets active state.
					 * @method setActive
					 * @param {Object} state Activated state
					 * @static
					 * @member ns.history
					 */
					setActive: function (state) {
						if (state) {
							history.activeState = state;
							historyActiveIndex = state.uid;

							if (state.volatileRecord) {
								history.enableVolatileMode();
								return;
							}
						}

						history.disableVolatileMode();
					},

					/**
					 * This method returns "back" if state is in history or "forward" if it is new state.
					 * @method getDirection
					 * @param {Object} state Checked state
					 * @return {"back"|"forward"}
					 * @static
					 * @member ns.history
					 */
					getDirection: function (state) {
						if (state) {
							return state.uid <= historyActiveIndex ? "back" : "forward";
						}
						return "back";
					},

					/**
					 * This method sets volatile mode to true.
					 * @method enableVolatileMode
					 * @static
					 * @member ns.history
					 */
					enableVolatileMode: function () {
						historyVolatileMode = true;
					},

					/**
					 * This method sets volatile mode to false.
					 * @method disableVolatileMode
					 * @static
					 * @member ns.history
					 */
					disableVolatileMode: function () {
						historyVolatileMode = false;
					}
				};

			ns.history = history;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return history;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window));
