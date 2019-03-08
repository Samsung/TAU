/*global $, jQM2, document, window */
(function (document, window, $, jQM2) {
	"use strict";
	var orgDispatch = $.event.dispatch,
		orgjQM2Dispatch = jQM2.event.dispatch;
	$.event.dispatch = function (event) {
		var args = [].slice.call(arguments),
			pageContainerTest = $(event.target).closest(document.getElementById('webui-page-container'));
		if (pageContainerTest[0] || event.target === document || event.target === window) {
			return orgDispatch.apply($(this), args);
		}
		pageContainerTest = $(document.getElementById('webui-page-container')).closest(event.target);
		if (pageContainerTest[0]) {
			return orgDispatch.apply($(this), args);
		}
		return false;
	};

	jQM2.event.dispatch = function (event) {
		var args = [].slice.call(arguments),
			pageContainerTest = jQM2(event.target).closest(document.getElementById('ej-page-container'));
		if (pageContainerTest[0] || event.target === document || event.target === window) {
			return orgjQM2Dispatch.apply(jQM2(this), args);
		}
		pageContainerTest = jQM2(document.getElementById('webui-page-container')).closest(event.target);
		if (pageContainerTest[0]) {
			return orgjQM2Dispatch.apply(jQM2(this), args);
		}
		return false;
	};
	//$.cache = jQM2.cache;
	$(document).bind("mobileinit", function () {
		$.mobile.loadPage.defaults.pageContainer = $('#webui-page-container');
		$.mobile.changePage.defaults.pageContainer = $('#webui-page-container');
	});
}(document, window, $, jQM2));