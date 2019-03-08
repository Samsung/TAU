/* global asyncTest, helper, tau, jQuery, ok, deepEqual */
(function ($) {

	asyncTest("can navigate internal pages", function () {

		helper.pageSequence([

			function () {

				tau.changePage("#internal-page-1");

			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to internal page",
					hash: "#internal-page-1",
					id: "internal-page-1"
				});

				$("[href=#internal-page-2]")[0].click();

			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to internal page by link click",
					hash: "#internal-page-2",
					id: "internal-page-2"
				});

				window.history.back();

			},

			function () {

				helper.assertUrlLocation({
					msg: "window.history.back() from internal to internal page",
					hash: "#internal-page-1",
					id: "internal-page-1"
				});

				tau.back();

			},

			function () {

				helper.assertUrlLocation({
					msg: "tau.back() from internal to internal page",
					path: helper.path,
					id: "main"
				});

				tau.changePage($("#internal-page-2")[0]);

			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to internal page by element",
					hash: "#internal-page-2",
					id: "internal-page-2"
				});

			}

		], 	true);
	});

	asyncTest("can navigate external pages", function () {

		helper.pageSequence([

			function () {

				tau.changePage("test-data/index.html");

			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to external page",
					path: "test-data/index.html",
					id: "test-data-test-data"
				});

				tau.changePage("sub-dir/index.html");

			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to external page by relative link",
					path: "test-data/sub-dir/index.html",
					id: "test-data-sub-dir"
				});

				helper.virtualLinkClick("../parent/index.html");

			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to external page by link click",
					path: "test-data/parent/index.html",
					id: "test-data-parent"
				});

				window.history.back();

			},

			function () {

				helper.assertUrlLocation({
					msg: "window.history.back() from external to external page",
					path: "test-data/sub-dir/index.html",
					id: "test-data-sub-dir"
				});

				tau.back();

			},

			function () {

				helper.assertUrlLocation({
					msg: "tau.back() from external to external page",
					path: "test-data/index.html",
					id: "test-data-test-data"
				});

			}

		], true);
	});

	asyncTest("can navigate between internal and external pages", function () {

		helper.pageSequence([

			function () {

				tau.changePage("#internal-page-2");

			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to internal page",
					hash: "#internal-page-2",
					id: "internal-page-2"
				});

				helper.virtualLinkClick("test-data/index.html");

			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate from internal page to page in test-data directory",
					path: "test-data/index.html",
					id: "test-data-test-data"
				});

				helper.virtualLinkClick("index2.html");

			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to another page within the same directory hierarchy",
					path: "test-data/index2.html",
					id: "test-data-test-data2"
				});

				helper.virtualLinkClick("#internal-page-1");
			},

			function () {

				helper.assertUrlLocation({
					msg: "fail to navigate when use only id in external page.",
					path: "test-data/index2.html#internal-page-1",
					id: "internal-page-1"
				});

				helper.virtualLinkClick("../index.html#internal-page-1");
			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to internal page from external page",
					hash: "#internal-page-1",
					id: "internal-page-1"
				});

				helper.virtualLinkClick(helper.path);
			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate from a page in a sub directory to an internal page",
					path: helper.path,
					id: "main"
				});

				helper.virtualLinkClick("#internal-page-2");
			},

			function () {

				helper.assertUrlLocation({
					msg: "navigate to internal page after navigated from external page",
					hash: "#internal-page-2",
					id: "internal-page-2"
				});

				tau.changePage("internal-page-1");
			},

			function () {

				helper.assertUrlLocation({
					msg: "calling changePage() with a page id that is not prefixed with '#' should not change page",
					hash: "#internal-page-1",
					id: "internal-page-1"
				});

			}
		], true);
	});

	asyncTest("can tau.back() in pages", function () {
		helper.pageSequence([
			function () {
				tau.changePage("#internal-page-1");
			},

			function () {
				helper.assertUrlLocation({
					msg: "prepare move to internal page",
					hash: "#internal-page-1",
					id: "internal-page-1"
				});

				tau.changePage("#internal-page-2");
			},

			function () {
				helper.assertUrlLocation({
					msg: "prepare move to internal page",
					hash: "#internal-page-2",
					id: "internal-page-2"
				});

				tau.back();
			},

			function () {

				helper.assertUrlLocation({
					msg: "tau.back() from internal to internal page",
					hash: "#internal-page-1",
					id: "internal-page-1"
				});

				tau.changePage(helper.makePathAbsolute("test-data/index.html", helper.path));

			},

			function () {
				helper.assertUrlLocation({
					msg: "prepare move to external page",
					path: "test-data/index.html",
					id: "test-data-test-data"
				});

				tau.changePage(helper.makePathAbsolute("test-data/index2.html", helper.path));
			},

			function () {
				helper.assertUrlLocation({
					msg: "prepare move to external page",
					path: "test-data/index2.html",
					id: "test-data-test-data2"
				});

				tau.back();
			},

			function () {

				helper.assertUrlLocation({
					msg: "tau.back() from external page to external page",
					path: "test-data/index.html",
					id: "test-data-test-data"
				});

				tau.back();

			},

			function () {

				helper.assertUrlLocation({
					msg: "tau.back() from external page to internal page",
					hash: "#internal-page-1",
					id: "internal-page-1"
				});

				tau.changePage(helper.makePathAbsolute("test-data/index2.html", helper.path));
			},

			function () {

				helper.assertUrlLocation({
					msg: "prepare move to external page",
					path: "test-data/index2.html",
					id: "test-data-test-data2"
				});

				tau.changePage("../index.html#internal-page-1");
			},

			function () {
				helper.assertUrlLocation({
					msg: "prepare move to internal page",
					hash: "#internal-page-1",
					id: "internal-page-1"
				});

				tau.back();
			},

			function () {

				helper.assertUrlLocation({
					msg: "tau.back() from internal page to external page",
					path: "test-data/index2.html",
					id: "test-data-test-data2"
				});

			}
		], true);
	});

	asyncTest("external empty page does not result in any contents", function () {
		helper.pageSequence([
			function () {
				tau.changePage(helper.makePathAbsolute("test-data/blank.html", helper.path));
			},

			function () {
				helper.assertUrlLocation({
					msg: "A blank page should not change page",
					path: helper.path,
					id: "main"
				});
			}
		], true);
	});

	asyncTest("external page is removed from the DOM after pagehide", function () {
		helper.pageSequence([
			function () {
				tau.changePage(helper.makePathAbsolute("test-data/index.html", helper.path));
			},

			// page is pulled and displayed in the dom
			function () {
				deepEqual($("#test-data-test-data").length, 1);
				tau.back();
			},

			// external-test is *NOT* cached in the dom after transitioning away
			function () {
				deepEqual($("#test-data-test-data").length, 0);
			}
		], true);
	});

	asyncTest("failed to navigate", function () {
		var firedLoadFailEvent = false;

		document.addEventListener("loadfailed", function () {
			firedLoadFailEvent = true;
		}, false);

		helper.eventSequence("changefailed", [
			function () {
				firedLoadFailEvent = false;
				tau.changePage("#internal-not-exist");
			},

			function () {
				ok(!firedLoadFailEvent, "page change failed and doesn't load page.");
				firedLoadFailEvent = false;
				tau.changePage("external-not-exist.html");
			},

			function () {
				if (!window.navigator.userAgent.match("PhantomJS")) {
					ok(firedLoadFailEvent, "page change failed and recived loadfail event.");
					firedLoadFailEvent = false;
				}
			}
		], true);
	});

})(jQuery);
