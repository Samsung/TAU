/*global tau: false, document: false, window: false, ok, module: false, test:false, equal: false*/
document.addEventListener("DOMContentLoaded", function () {
	"use strict";
	var Router = tau.router.Router;

	module("core/router/Router");
	test("instance", function () {
		var router = new Router();

		ok(typeof router, "Object", "router");
		ok(router instanceof Router, "router instance of Router");

		equal(typeof router.open, "function", "router.open");
		equal(typeof router.init, "function", "router.init");
		equal(typeof router.destroy, "function", "router.destroy");
		equal(typeof router.setContainer, "function", "router.setContainer");
		equal(typeof router.getContainer, "function", "router.getContainer");
		equal(typeof router.register, "function", "router.register");
		/* protected methods*/
		equal(typeof router._loadUrl, "function", "(protected method) router._loadUrl");
		equal(typeof router._loadError, "function", "(protected method) router._loadError");
		equal(typeof router._loadSuccess, "function", "(protected method) router._loadSuccess");
		equal(typeof router._getInitialContent, "function", "(protected method) router._getInitialContent");
		equal(typeof router._showError, "function", "(protected method) router._showError");
	});
});