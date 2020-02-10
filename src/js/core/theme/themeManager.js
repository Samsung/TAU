/*global window, ns, define */
/*
* Copyright (c) 2019 Samsung Electronics Co., Ltd
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
 *
 * Class for managing application theme
 * @class ns.theme
 */
(function (document, ns) {
	"use strict";
    //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		function () {
            //>>excludeEnd("tauBuildExclude");

			var THEME_CLASS_PREFIX = "ui-theme-",
				themeManager = {
                    /**
                     * A function used to set newtheme for application
                     * @param {string?} newTheme - new theme to set. If it is undefined or empty string default theme will be set.
                     */
					setTheme: function (newTheme) {
						var classList = document.body.classList,
							classArray = [].slice.call(classList);

                        //Remove current theme if exists
						classArray.forEach(function (className) {
							if (className.startsWith(THEME_CLASS_PREFIX)) {
								classList.remove(className);
							}
						});
						if (newTheme) {
							classList.add(THEME_CLASS_PREFIX + newTheme);
						}
					},
					getTheme: function () {
						var classList = document.body.classList,
							classArray = [].slice.call(classList);


						classArray = classArray.filter(function (className) {
							return className.startsWith(THEME_CLASS_PREFIX);
						});

						if (classArray.length) {
							return classArray[0].replace(THEME_CLASS_PREFIX, "");
						}
						return "";
					}
				};

			ns.theme = themeManager;
            //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.theme;
		}
    );
    //>>excludeEnd("tauBuildExclude");
}(window.document, ns));