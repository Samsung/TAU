/*global define, ns, Mustache*/

/**
 * #HTML template engine
 *
 * Parser for HTML files.
 *
 * This class hasn't public interface. This class is registered as template engine
 * in template manager.
 *
 * This engine give support of load HTML(Webclip) files for give URL.
 *
 * @class ns.template.webclip
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
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
			var template = ns.template;

			/**
			 * Object export as JSON string
			 * @param {*} data
			 * @return {string}
			 */
			function escape(data) {
				if (typeof data === "object") {
					return JSON.stringify(data);
				} else {
					return Mustache.escape(data);
				}
			}

			function fillMarkup(text, data) {
				if (Mustache) {
					return Mustache.render(text, data, null, {escape: escape});
				} else {
					ns.warn("Mustache library is required (https://github.com/janl/mustache.js)");
				}
			}

			/**
			 * Fill webclip content
			 * @param {string} template template
			 * @param {Object} data Data passed to render function
			 * @return {HTMLElement}
			 */
			function fillWebClip(template, data) {
				var doc = document.implementation.createHTMLDocument("for-create-webclip-elements"),
					element;

				template = fillMarkup(template, data);
				element = doc.createElement("div");
				element.innerHTML = template;

				element = element.firstElementChild;
				element.parentElement.removeChild(element);

				return element;
			}

			/**
			 * Callback for event load and error on  XMLHttpRequest
			 * @param {Function} callback Function called after parse response
			 * @param {Object} data Data passed to render function
			 * @param {Event} event event object
			 */
			function callbackFunction(callback, data, event) {
				var request = event.target,
					status = {},
					templateData = {},
					element;

				if (request.readyState === 4) {
					status.success = (request.status === 200 || (request.status === 0 && request.responseXML));

					if (data.element.getAttribute("data-template-data")) {
						try {
							templateData = JSON.parse(data.element.getAttribute("data-template-data"));
						} catch (err) {
							ns.warn("Card data-template-data wrong value: ", err);
						}
					}
					element = fillWebClip(request.responseText, templateData);

					element.setAttribute("data-template-html", encodeURI(request.responseText));
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
			function webclipTemplate(globalOptions, path, data, callback) {
				var absUrl = path,
					request,
					eventCallback = callbackFunction.bind(null, callback, data);

				// Load the new content.
				request = new XMLHttpRequest();
				request.responseType = "text";
				request.overrideMimeType("text/html");
				request.open("GET", absUrl);
				request.addEventListener("error", eventCallback);
				request.addEventListener("load", eventCallback);
				request.send();
			}

			webclipTemplate.fillWebClip = fillWebClip;

			template.register("webclip", webclipTemplate);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
