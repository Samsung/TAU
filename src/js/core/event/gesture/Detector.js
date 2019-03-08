/*global ns, window, define */
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
 * #Gesture.Detector class
 * Base class for create detectors in gestures.
 *
 * @class ns.event.gesture.Detector
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../gesture",
		"../../util/object"
	],
		function () {
		//>>excludeEnd("tauBuildExclude");
			var gesture = ns.event.gesture,

				objectMerge = ns.util.object.merge,

				Detector = function (strategy, sender) {
					this.sender = sender;
					this.strategy = strategy.create();
					this.name = this.strategy.name;
					this.index = this.strategy.index || 100;
					this.options = this.strategy.options || {};
				};

			/**
			 * Start of gesture detection of given type
			 * @method detect
			 * @param {string} gestureEvent
			 * @return {Object}
			 * @member ns.event.gesture.Detector
			 */
			Detector.prototype.detect = function (gestureEvent) {
				return this.strategy.handler(gestureEvent, this.sender, this.strategy.options);
			};

			Detector.Sender = {
				sendEvent: function () {
				// Empty function for creating interface
				}
			};

		/**
			 * Create plugin namespace.
			 * @property {Object} plugin
			 * @member ns.event.gesture.Detector
			 */
			Detector.plugin = {};

		/**
			 * Methods creates plugin
			 * @method create
			 * @param {Object} gestureHandler
			 * @return {ns.event.gesture.Detector} gestureHandler
			 * @member ns.event.gesture.Detector.plugin
			 */
			Detector.plugin.create = function (gestureHandler) {
				var detector;

				if (!gestureHandler.types) {
					gestureHandler.types = [gestureHandler.name];
				}

				detector = function (options) {
					this.options = objectMerge({}, gestureHandler.defaults, options);
				};

				detector.prototype.create = function () {
					return objectMerge({
						options: this.options
					}, gestureHandler);
				};

				Detector.plugin[gestureHandler.name] = detector;

				return detector;
			};

		// definition
			gesture.Detector = Detector;

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
