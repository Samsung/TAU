/*global window, ns, define */
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
 * #Globalize Utility
 * Object supports globalize options.
 * @class ns.util.globalize
 */

(function (window, document, ns, Globalize) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"core/util/deferred"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var isGlobalizeInit = false,
				cldrDataCategory = {main: "main", supplemental: "supplemental"},
				cldrDataCache = {
					main: {},
					supplemental: {}
				},
				customDataCache = {},
				cldrJsonNames = {
					main: [ //has language dependency
						"currencies",
						"ca-gregorian",
						"numbers"
					],
					supplemental: [
						"scriptMetaData",
						"likelySubtags",
						"currencyData",
						"plurals",
						"timeData",
						"weekData",
						"numberingSystems" // this is for arab locale
					]
				},
				UtilDeferred = ns.util.deferred,
				globalizeInstance = null,
				rtlClassName = "ui-script-direction-rtl",
				extension = ".json",
				cldrDataName = "cldr-data",
				libPath = "lib",
				customLocalePathName = "locale";

			/**
			 * Get filtered path from array
			 * @method pathFilter
			 * @param {Array} path
			 * @return {string}
			 * @private
			 */
			function pathFilter(path) {
				return path.filter(function (item) {
					return item;
				}).join("/");
			}

			/**
			 * Get Language code
			 * @method getLang
			 * @param {string} language
			 * @return {string}
			 * @private
			 */
			function getLang(language) {
				var lang = language ||
						document.getElementsByTagName("html")[0].getAttribute("lang") ||
						window.navigator.language.split(".")[0] || // Webkit, Safari + workaround for Tizen
						"en",
					countryCode,
					countryCodeIdx = lang.lastIndexOf("-"),
					ignoreCodes = ["Cyrl", "Latn", "Mong"];	// Not country code!

				if (countryCodeIdx !== -1) {	// Found country code!
					countryCode = lang.substr(countryCodeIdx + 1);
					if (ignoreCodes.join("-").indexOf(countryCode) < 0) {
						// countryCode is not found from ignoreCodes.
						// Make countryCode to uppercase.
						lang = [lang.substr(0, countryCodeIdx), countryCode.toUpperCase()].join("-");
					}
				}
				// NOTE: "en-US"" to "en" because we do not use CLDR full data TODO:Make Guide document for CLDR full data
				lang = getNeutralLang(lang);
				return lang;
			}

			/**
			 * Get neutral language
			 * @method getNeutralLang
			 * @param {string} lang
			 * @return {string}
			 * @private
			 */
			function getNeutralLang(lang) {
				var neutralLangIdx = lang.lastIndexOf("-"),
					neutralLang;

				if (neutralLangIdx !== -1) {
					neutralLang = lang.substr(0, neutralLangIdx);
				} else {
					neutralLang = lang;
				}
				return neutralLang;
			}

			/**
			 * Get path of CLDR data
			 * @method getCldrFilesPath
			 * @param {string} subPath
			 * @param {string} lang
			 * @param {string} jsonName
			 * @return {string}
			 * @private
			 */
			function getCldrFilesPath(subPath, lang, jsonName) {
				var path;

				lang = (subPath === "supplemental") ? null : lang;

				// Default Globalize culture file path
				path = [
					libPath,
					cldrDataName,
					subPath,
					lang,
					jsonName + extension //TODO:Use gregorian
				];

				return pathFilter(path);
			}

			/**
			 * Get path of Custom data which is matched with language
			 * @method getCustomFilesPath
			 * @param {string} lang
			 * @return {string}
			 * @private
			 */
			function getCustomFilesPath(lang) {
				return pathFilter([
					customLocalePathName,
					lang + extension
				]);
			}

			/**
			 * Loads json file
			 * @method loadJSON
			 * @param {string} path
			 * @return {Deferred}
			 * @private
			 */
			function loadJSON(path) {
				var xhrObj,
					jsonObj,
					info,
					deferred = new UtilDeferred();

				if (path) {	// Invalid path -> Regard it as "404 Not Found" error.
					try {
						xhrObj = new XMLHttpRequest();
						xhrObj.onreadystatechange = function () {
							if (xhrObj.readyState === 4) {
								switch (xhrObj.status) {
									case 0:
									case 200:
										jsonObj = JSON.parse(xhrObj.responseText);
										info = {"state": xhrObj.status, "path": path, "data": jsonObj};
										deferred.resolve(info);
										break;
									case 404:
										info = {"state": xhrObj.status, "path": path, "data": null};
										deferred.reject(info);
										break;
									default:
										jsonObj = JSON.parse(xhrObj.responseText);
										info = {"state": xhrObj.status, "path": path, "data": jsonObj};
										deferred.reject(info);
										break;
								}
							}
						};
						xhrObj.open("GET", path, true);
						xhrObj.send("");
					} catch (e) {
						info = {"state": -1, "path": path, "data": null};
						deferred.reject(info);
					}
				} else {
					info = {"state": -2, "path": path, "data": null};
					deferred.reject(info);

				}
				return deferred;
			}

			/**
			 * Loads CLDR data
			 * @method loadCldrData
			 * @param {string|null} language
			 * @param {string} category
			 * @return {Deferred}
			 * @private
			 */
			function loadCldrData(language, category) {
				var path,
					cldrDataTotal = cldrJsonNames[category].length,
					cache = null,
					deferred = new UtilDeferred();

				if (language) { // when category is "main" , language must have value like "en" , "ko" .etc
					if (!cldrDataCache[category].hasOwnProperty(language)) {
						cache = cldrDataCache[category][language] = {};
					} else {
						cache = cldrDataCache[category][language];
					}
				} else { // when category is "supplement" language is empty
					cache = cldrDataCache[category];
				}

				cldrJsonNames[category].forEach(function (fileName) {

					path = getCldrFilesPath(category, language, fileName);

					if (!cache[path]) {
						loadJSON(path).then(function (info) {
							var jsonObj = info.data,
								key = info.path;

							cache[key] = jsonObj; //cache likelySubtags for Globalize
							Globalize.load(jsonObj); //load likelySubtags json
							if (Object.keys(cache).length === cldrDataTotal) {
								deferred.resolve(language);
							}

						}, deferred.reject);

					} else {
						//Globalize.load(cache[path]);
						deferred.resolve(language);
					}
				});

				return deferred;
			}

			/**
			 * Loads custom data
			 * @method loadCustomData
			 * @param {string} localeId
			 * @return {Deferred}
			 * @private
			 */
			function loadCustomData(localeId) {
				var path = null,
					deferred = new UtilDeferred(),
					cache = customDataCache;

				path = getCustomFilesPath(localeId);
				if (!cache[path]) {
					loadJSON(path).then(function (info) {
						cache[path] = info;
						deferred.resolve(info);
					},
						deferred.reject);
				} else {
					deferred.resolve(cache[path]);
				}
				return deferred;
			}

			/**
			 * Init Globalize
			 * @method initGlobalize
			 * @return {Deferred}
			 * @private
			 */
			function initGlobalize() {
				var deferred = new UtilDeferred();

				isGlobalizeInit = true;
				loadCldrData(null, cldrDataCategory.supplemental).then(deferred.resolve, deferred.reject);
				return deferred;
			}

			/**
			 * Check script direction of locale
			 * @method isRTL
			 * @param {string} locale
			 * @private
			 */
			function isRTL(locale) {
				var path = getCldrFilesPath(cldrDataCategory.supplemental, locale, cldrJsonNames.supplemental[0]),
					scriptMetaData = cldrDataCache.supplemental[path] || null,
					result = null;

				locale = Globalize.locale().attributes.script;

				if (scriptMetaData) {
					scriptMetaData.some(function (item) {
						if (item.IDENTIFIER === locale) {
							switch (item.RTL) {
								case "YES":
									result = true;
									break;
								case "NO":
									result = false;
									break;
								case "UNKNOWN":
									result = true;
									break;
							}
							return true;
						}
						return false;
					});
					return result;
				} else {
					throw new Error("Globalize is not initialized");
				}
			}


			/**
			 * Load Basic Locale files for "locale id" in cldr-data directory
			 * @method loadLocaleData
			 * Language code. ex) en-US, en, ko-KR, ko, If language is not
			 * given,
			 * first. Check window.tizen.systeminfo to get locale information
			 * second. Check language from html "lang" attribute.
			 * @param {string} localeId
			 * @return {Deferred}
			 * @private
			 */
			function loadLocaleData(localeId) {
				var deferred = new UtilDeferred();

				if (!isGlobalizeInit) {
					initGlobalize().then(function () {
						loadLocaleData(localeId).then(function (locale) {
							deferred.resolve(locale);
						}, deferred.reject);
					});
				} else {
					if (window.tizen && !localeId) {
						window.tizen.systeminfo.getPropertyValue("LOCALE", function (locale) {
							var countryLang = locale.country;

							if (countryLang) {
								countryLang = getNeutralLang(countryLang.replace("_", "-")); //TODO: Need to fix local id type
							}
							loadCldrData(countryLang, cldrDataCategory.main).then(function (locale) {
								deferred.resolve(locale);
							}, deferred.reject);
						});
					} else {
						//first  find "lang" attribute in html
						//second find "locale" in navigator in window.navigator
						loadCldrData(localeId, cldrDataCategory.main).then(function (locale) {
							deferred.resolve(locale);
						}, deferred.reject);

					}
				}
				return deferred;
			}

			/**
			 * Update class of body to indicate right-to-left language
			 * @method updateScriptDirectionClass
			 * if give language is rtl type than add class ("ui-script-direction-rtl") in body element
			 * @private
			 */
			function updateScriptDirectionClass() {
				var rtl = isRTL(Globalize.locale().locale),
					body = document.body,
					classList = body.classList;

				if (rtl) {
					if (!classList.contains(rtlClassName)) {
						classList.add(rtlClassName);
					}
					Globalize.prototype.rtl = true;
				} else {
					if (classList.contains(rtlClassName)) {
						classList.remove(rtlClassName);
					}
					Globalize.prototype.rtl = false;
				}
			}

			/**
			 * Update Globalize prototype
			 * @method updateGlobalize
			 * @private
			 */
			function updateGlobalize() {
				Globalize.prototype.getLocale = ns.util.globalize.getLocale;
				Globalize.prototype.getCalendar = ns.util.globalize.getCalendar;
			}

			/**
			 * Check Globalize and Cldr object in window object to use core/util/globalize.js
			 * @method checkDependency
			 * @private
			 */
			function checkDependency() {
				return (window.Globalize && window.Cldr);
			}

			ns.util.globalize = {

				/**
				 * Put the module into module array of core.util.globalize
				 * @method importModule
				 * @param {string} fileName
				 * @member ns.util.globalize
				 * @static
				 */
				importModule: function (fileName) {
					var module = fileName.split("/"),
						path = module.shift(),
						moduleMain = cldrJsonNames.main,
						moduleSupplemental = cldrJsonNames.supplemental,
						i = 0,
						j;

					fileName = module.shift();

					switch (path) {
						case "main":
							for (j = moduleMain.length; i < j; i++) {
								if (moduleMain[i] === fileName) {
									return;
								}
							}
							moduleMain.push(fileName);
							break;
						case "supplemental":
							for (j = moduleSupplemental.length; i < j; i++) {
								if (moduleSupplemental[i] === fileName) {
									return;
								}
							}
							moduleSupplemental.push(fileName);
							break;
					}
				},

				/**
				 * Set Locale. This API is Async API.
				 * Please use deferred callback functions which are returned( .done(), .then() .etc)
				 * @method setLocale
				 * @param {string} localeId
				 * @member ns.util.globalize
				 * @return {Deferred}
				 * @static
				 */
				setLocale: function (localeId) {
					var deferred = new UtilDeferred();

					localeId = getLang(localeId);
					if (checkDependency()) {
						loadLocaleData(localeId)
							.then(function (locale) {
								Globalize.locale(locale);
								globalizeInstance = new Globalize(locale);
								return locale;
							}, deferred.reject)
							.done(function (locale) {
								loadCustomData(locale)
									.then(function (info) {
										Globalize.loadMessages(info.data);
										globalizeInstance = new Globalize(locale);
										deferred.resolve(globalizeInstance);
									}, function () {
										globalizeInstance = new Globalize(locale);
										deferred.resolve(globalizeInstance); //we do not care of failure of "loadCustomData on purpose"
									});
							})
							.done(updateScriptDirectionClass)
							.done(updateGlobalize);

						return deferred;
					} else {
						throw new Error("Globalize is not loaded");
					}

				},

				/**
				 * Get Locale.
				 * @method getLocale
				 * @return {string} Current locale
				 * @member ns.util.globalize
				 * @static
				 */
				getLocale: function () {
					if (checkDependency()) {
						return Globalize.locale().locale;
					} else {
						throw new Error("Globalize is not loaded");
					}

				},

				/**
				 * Get gregorian calendar.
				 * @method getCalendar
				 * @return {Object} gregorian calendar data given locale.
				 * @member ns.util.globalize
				 * @static
				 */
				getCalendar: function () {
					//default is gregorian calendar
					//TODO: Need to implementation in jquery/globalize
					//TODO: Need to implement validation
					if (checkDependency() && globalizeInstance) {
						return globalizeInstance.cldr.main("dates/calendars/gregorian");
					} else {
						throw new Error("Globalize is not initialized");
					}

				}

			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.globalize;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, window.Globalize));
