/* global equal, test, define, tau */
(function () {
	"use strict";
	function runTests(path, helpers, tau) {

		var pageSelector = ".ui-page";

		tau = tau || window.ns;
		path = path || window.ns.util.path;
		helpers = helpers || window.helpers;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/util/path/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/util/path", {
			setup: initHTML
		});

		test("getDocumentUrl", function () {
			var urlObject = {};

			urlObject = path.getDocumentUrl(false);
			equal(typeof urlObject, "string", "get document URL and no parse to url structure");
			urlObject = path.getDocumentUrl(true);
			equal(typeof urlObject, "object", "get document URL and parse to url structure");
		});
		test("isAbsoluteUrl", function () {
			equal(path.isAbsoluteUrl("http://localhost"), true, "isAbsoluteUrl for absolute url \"http://localhost\"");
			equal(path.isAbsoluteUrl(".."), false, "isAbsoluteUrl for relative url \"..\"");
		});
		test("makePathAbsolute", function () {
			equal(path.makePathAbsolute("", "/"), "/", "empty paths");
			equal(path.makePathAbsolute("b/", "/a/"), "/a/b/", "normal concatenate");
			equal(path.makePathAbsolute("./b/", "/a/"), "/a/b/", "relative concatenate");
			equal(path.makePathAbsolute("../b/", "/a/"), "/b/", "relative concatenate and move directory level up");
			equal(path.makePathAbsolute("/b/", "/a/"), "/b/", "relative path is absolute path");
		});
		test("makeUrlAbsolute", function () {
			equal(path.makeUrlAbsolute("", "http://localhost/"), "http://localhost/", "Make Url absolute for empty relative url & absolute Url");
			equal(path.makeUrlAbsolute("", "https://localhost:8080/"), "https://localhost:8080/", "Make Url absolute for empty relative url & absolute Url + port");
			equal(path.makeUrlAbsolute("b/", "http://localhost/a/"), "http://localhost/a/b/", "Make Url absolute for \"b/\", \"http://localhost/a/\"");
			equal(path.makeUrlAbsolute("./b/", "http://localhost/a/"), "http://localhost/a/b/", "Make Url absolute for ./\"b/\", \"http://localhost/a/\"");
			equal(path.makeUrlAbsolute("../b/", "http://localhost/a/"), "http://localhost/b/", "Make Url absolute for ../\"b/\", \"http://localhost/a/\"");
			equal(path.makeUrlAbsolute("/b/", "http://localhost/a/"), "http://localhost/b/", "Make Url absolute for /\"b/\", \"http://localhost/a/\"");
			equal(path.makeUrlAbsolute("http://localhost/", "http://localhost/"), "http://localhost/", "Make Url absolute for absolute url");
		});

		test("getAsURIParameters", function () {
			equal(path.getAsURIParameters({}), "", "getAsURIParameters for {}");
			equal(path.getAsURIParameters({a: "b", c: "d"}), "a=b&c=d", "getAsURIParameters for {a: \"b\", c:\"d\"}");
		});

		test("addSearchParams", function () {
			equal(path.addSearchParams("", {}), "?", "addSearchParams for {}");
			equal(path.addSearchParams("index.html", {a: "b", c: "d"}), "index.html?a=b&c=d", "addSearchParams for {a: \"b\", c:\"d\"}");
			equal(path.addSearchParams("index.html?a=b#embeded", {c: "d"}), "index.html?a=b#embeded?c=d", "addSearchParams test for {c:\"d\"}");
		});

		test("addHashSearchParams", function () {
			equal(path.addHashSearchParams("", {}), "#?", "addSearchParams for {}");
			equal(path.addHashSearchParams("index.html", {a: "b", c: "d"}), "index.html#?a=b&c=d", "addSearchParams for {a: \"b\", c:\"d\"}");
		});

		test("convertUrlToDataUrl", function () {
			equal(path.convertUrlToDataUrl("/index.html?a=1&b=2&c=something#page"), "/index.html?a=1&b=2&c=something#page", "convertUrlToDataUrl for \"http://localhost/index.html?a=1&b=2&c=something#page\"");
			equal(path.convertUrlToDataUrl("file://index.html?a=1&b=2&c=something#page"), "file://index.html?a=1&b=2&c=something#page", "convertUrlToDataUrl for \"file://index.html?a=1&b=2&c=something#page\"");
		});

		test("get", function () {
			equal(path.get(), window.location.hash.substr(1), "get for \"\"");
			equal(path.get("#hash"), "hash", "get for \"#hash\"");
		});

		test("set", function () {
			equal(path.set("#hash"), undefined, "set for \"#hash\"");
		});

		test("isPath", function () {
			equal(path.isPath(), false, "isPath for \"\"");
			equal(path.isPath("index.html"), false, "isPath for \"index.html\"");
			equal(path.isPath("../"), true, "isPath for \"../\"");
		});

		test("clean", function () {
			equal(path.clean("http://localhost/index.html", path.parseUrl("http://localhost/index.html")), "/index.html", "clean for \"http://localhost/index.html\"");
			equal(path.clean("http://localhost/test/index.html", path.parseUrl("http://localhost/index.html")), "/test/index.html", "clean for \"http://localhost/test/index.html\"");
		});

		test("cleanHash", function () {
			equal(path.cleanHash("#hash"), "hash", "cleanHash for {}");
			equal(path.cleanHash("#hash?asas"), "hash", "cleanHash for {a: \"b\", c:\"d\"}");
		});

		test("stripQueryParams", function () {
			equal(path.stripQueryParams("http://localhost/index.html"), "http://localhost/index.html", "string has not params", "strip query params for \"http://localhost/index.html\"");
			equal(path.stripQueryParams("http://localhost/index.html?"), "http://localhost/index.html", "only query sign", "strip query params for \"http://localhost/index.html\"");
			equal(path.stripQueryParams("http://localhost/index.html?search=test&order=inc"), "http://localhost/index.html", "query: ?search=test&order=inc", "strip query params for \"http://localhost/index.html\"");
			equal(path.stripQueryParams("?search=test&order=inc"), "", "query: ?search=test&order=inc", "strip query params for \"http://localhost/index.html\"");
		});

		test("isHashValid", function () {
			equal(path.isHashValid(), false, "isHashValid for \"\"");
			equal(path.isHashValid("/index.html#hash"), false, "isHashValid for {a: \"b\", c:\"d\"}");
			equal(path.isHashValid("#hash"), true, "isHashValid for {a: \"b\", c:\"d\"}");
		});

		test("isExternal", function () {
			equal(path.isExternal(), false, "isExternal for {}");
			equal(path.isExternal("http://localhost/index.html#hash", path.parseUrl("http://localhost2/index.html")), true, "isExternal for {a: \"b\", c:\"d\"}");
			equal(path.isExternal("#hash", path.parseUrl("http://localhost/index.html")), false, "isExternal for {a: \"b\", c:\"d\"}");
		});

		test("hasProtocol", function () {
			equal(path.hasProtocol(), "", "hasProtocol for {}");
			equal(path.hasProtocol("localhost"), false, "hasProtocol for {a: \"b\", c:\"d\"}");
			equal(path.hasProtocol("http://localhost"), true, "hasProtocol for {a: \"b\", c:\"d\"}");
		});

		test("isFirstPageUrl", function () {
			var firstPage = document.getElementById("test1");

			equal(path.isFirstPageUrl("index.html#hash", firstPage,
				path.parseUrl("http://localhost/index.html"),
				null,
				path.parseUrl("http://localhost/index.html")), false, "isFirstPageUrl for {a: \"b\", c:\"d\"}");
			equal(path.isFirstPageUrl("index.html#test1", firstPage,
				path.parseUrl("http://localhost/index.html"),
				null,
				path.parseUrl("http://localhost/index.html")), true, "isFirstPageUrl for {a: \"b\", c:\"d\"}");
		});

		test("isPermittedCrossDomainRequest", function () {
			equal(path.isPermittedCrossDomainRequest(path.parseUrl("http://localhost/aaa.html"), "http://localhost/bbb.html"), false, "isPermittedCrossDomainRequest");
			equal(path.isPermittedCrossDomainRequest(path.parseUrl("file://localhost/aaa.html"), "http://localhost2/bbb.html"), false, "isPermittedCrossDomainRequest");
			tau.setConfig("allowCrossDomainPages", true);
			equal(path.isPermittedCrossDomainRequest(path.parseUrl("http://localhost/aaa.html"), "http://localhost/bbb.html"), false, "isPermittedCrossDomainRequest");
			equal(path.isPermittedCrossDomainRequest(path.parseUrl("file://localhost/aaa.html"), "http://localhost2/bbb.html"), true, "isPermittedCrossDomainRequest");
		});

		test("isEmbedded", function () {
			equal(path.isEmbedded(), false, "isEmbedded for \"\"");
			equal(path.isEmbedded("localhost#"), false, "isEmbedded for \"localhost#\"");
			equal(path.isEmbedded("#page"), true, "isEmbedded for \"#page\"");
			equal(path.isEmbedded("http://localhost"), false, "isEmbedded for \"http://localhost\"");
			equal(path.isEmbedded("/index.html?a=1#page"), true, "isEmbedded for \"/index.html?s=query#page\"");
		});

		test("squash", function () {
			equal(path.squash("/path", "http://localhost/something/index.html#page"), "http://localhost/path", "squash for \"/path\", \"http://localhost/something/index.html#page\"");
			equal(path.squash("#something", "http://localhost/path/index.html#page?search"), "http://localhost/path/index.html#something", "squash for \"#something\" \"http://localhost/path/index.html#page?search\"");
		});

		test("isPreservableHash", function () {
			equal(path.isPreservableHash("#&ui-state"), true, "isPreservableHash for \"#&ui-state\"");
			equal(path.isPreservableHash("#start"), false, "#start");
		});

		test("hashToSelector", function () {
			equal(path.hashToSelector("something"), "something", "hashToSelector for \"something\"");
			equal(path.hashToSelector("#something"), "#something", "hashToSelector for \"#something\"");
			equal(path.hashToSelector("#som?e:t{h}i|ng"), "#som\\?e\\:t\\{h\\}i\\|ng", "hashToSelector for \"#som?e:t{h}i|ng\"");
		});

		test("getFilePath", function () {
			equal(path.getFilePath("/path/index.html&http://localhost/path/something#page"), "/path/index.html", "Return the file path");
		});

		test("getDocumentBase", function () {
			equal(typeof path.getDocumentBase(false), "string", "Get document base for asParsedObject as false");
			equal(typeof path.getDocumentBase(true), "object", "Get document base for asParsedObject as true");
		});

		test("getClosestBaseUrl", function () {
			equal(path.getClosestBaseUrl(document.getElementById("test1"), pageSelector),
				window.location.origin + window.location.pathname,
				"Return the substring of a filepath before the sub-page key, for making a server request"
			);
		});

		test("getLocation", function () {
			var popupUrl = "http://localhost/something/index.html#?popup=true";

			equal(path.getLocation(popupUrl), popupUrl, "Popup url.");
			popupUrl = "http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content?param1=true&param2=123";
			equal(path.getLocation(popupUrl), "http://mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content?param1=true&param2=123", "Abstract url.");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.util.path, window.helpers, tau);
	}

}());