/*global define, XMLHttpRequest, ns*/
/**
 * #HTML template engine
 *
 * Parser for HTML files.
 *
 * This class hasn't public interface. This class is registered as template engine
 * in template manager.
 *
 * This engine give support of load HTML files for give URL.
 *
 * @class ns.template.html
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../template",
			"../util/path"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var template = ns.template,
				util = ns.util,
				utilPath = util.path;

			/**
			 * Callback for event load and error on  XMLHttpRequest
			 * @param {Function} callback Function called after parse response
			 * @param {Object} data Data passed to render function
			 * @param {Event} event event object
			 */
			function callbackFunction(callback, data, event) {
				var request = event.target,
					status = {},
					element;

				if (request.readyState === 4) {
					status.success = (request.status === 200 || (request.status === 0 && request.responseXML));
					element = request.responseXML;
					// if option fullDocument is set then return document element
					// Router require full document
					if (!data.fullDocument) {
						// otherwise return first child of body
						// controller require only element
						element = element.body.firstChild;
					}
					callback(status, element);
				}
			}

			/**
			 * Function process given path, get file by XMLHttpRequest and return
			 * HTML element.
			 * @param {Object} globalOptions
			 * @param {string} path
			 * @param {Object} data
			 * @param {Function} callback
			 */
			function htmlTemplate(globalOptions, path, data, callback) {
				var absUrl = path,
					request,
					eventCallback = callbackFunction.bind(null, callback, data);

				// If the caller provided data append the data to the URL.
				if (data) {
					absUrl = utilPath.addSearchParams(path, data);
				}

				// Load the new content.
				request = new XMLHttpRequest();
				request.responseType = "document";
				request.overrideMimeType("text/html");
				request.open("GET", absUrl);
				request.addEventListener("error", eventCallback);
				request.addEventListener("load", eventCallback);
				request.send();
			}

			template.register("html", htmlTemplate);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
