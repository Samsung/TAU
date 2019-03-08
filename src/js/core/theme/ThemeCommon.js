/*global define, ns */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
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
 * #Class with functions which help changing themes.
 *
 * @class ns.theme.ThemeCommon
 */
(function (ns) {
	"use strict";
	define(
		[
			"../util/object",
			"../theme" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				nsTheme = ns.theme,
				ThemeCommon = function () {
					var self = this;

					self.enabled = false;
					self.backup = null;
				},
				protoThemeCommon = {};

			protoThemeCommon._enable = function () {
				var self = this;
				// disable it active theme

				if (nsTheme._activeTheme) {
					nsTheme._activeTheme.disable();
				}
				self.backup = {};
				self.backup.frameworkData = utilsObject.copy(ns.frameworkData);
				self.backup.widgetOptions = {};
				self.storeAllWidgetOptions();
				nsTheme._activeTheme = self;
				self.enabled = true;
			};

			protoThemeCommon._disable = function () {
				var self = this,
					prop,
					backupFrameworkData;

				self.restoreAllWidgetOptions();

				backupFrameworkData = self.backup.frameworkData;

				if (backupFrameworkData) {
					for (prop in backupFrameworkData) {
						if (backupFrameworkData.hasOwnProperty(prop)) {
							ns.frameworkData[prop] = backupFrameworkData[prop];
						}
					}

					self.backup.frameworkData = null;
				}
				nsTheme._activeTheme = null;
				self.enabled = false;
			};

			/**
			 * This function stores the options of widgets.
			 * It is used by scripts of a custom themes on its activation to remember
			 * the default options of widgets and be able to restore them later.
			 * @method storeAllWidgetOptions
			 * @member ns.theme.ThemeCommon
			 */
			protoThemeCommon.storeAllWidgetOptions = function () {
				var self = this,
					i,
					widgets = ns.engine.getDefinitions(),
					widgetClass;

				for (i in widgets) {
					if (widgets.hasOwnProperty(i)) {
						widgetClass = widgets[i].widgetClass;
						if (widgetClass) {
							self.backup.widgetOptions[i] = utilsObject.copy(widgetClass.prototype.options);
						}
					}
				}
			};

			/**
			 * This function restores the options of widgets.
			 * It is used by scripts of a custom themes on its deactivation
			 * to restore default options of widgets
			 * @method restoreAllWidgetOptions
			 * @member ns.theme.ThemeCommon
			 */
			protoThemeCommon.restoreAllWidgetOptions = function () {
				var self = this,
					i,
					widgets = ns.engine.getDefinitions(),
					backup = self.backup.widgetOptions;

				for (i in backup) {
					if (backup.hasOwnProperty(i)) {
						widgets[i].widgetClass.prototype.options = utilsObject.copy(backup[i]);
					}
				}
			};
			ThemeCommon.prototype = protoThemeCommon;
			nsTheme.ThemeCommon = ThemeCommon;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
}(ns));
//>>excludeEnd("tauBuildExclude");
