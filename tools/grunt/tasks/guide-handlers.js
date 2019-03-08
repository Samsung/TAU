/*global module, console */
(function () {
	"use strict";
	module.exports = {
		baloon: function (match, group, type, title, body) {
			return "\n\n<div class=\"bs-callout bs-callout-" + type.trim().replace("!", "") + "\">" +
					"<h4>" + title + "</h4>" +
					"<p>" + body + "</p></div>\n\n";
		}
	};
}());
