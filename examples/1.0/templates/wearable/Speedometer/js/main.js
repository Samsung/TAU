/*global window, tizen*/
/**
 * Start app when HTML content has been loaded
 */
document.addEventListener("DOMContentLoaded", function () {
	"use strict";

	// main page of app
	var mainPageId = "one";

	// Handle for app exit
	window.addEventListener("tizenhwkey", function (ev) {
		var // get active page
			page = document.getElementsByClassName("ui-page-active")[0],
			// find active page Id
			pageId = page ? page.id : "";

		if (ev.keyName === "back") {
			if (pageId === mainPageId) {
				// exit from app only from main page
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
					// catch exception
				}
			} else {
				window.history.back();
			}
		}
	});
});

