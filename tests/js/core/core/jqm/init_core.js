/* global asyncTest, expect, tau, test, ok, start, deepEqual, jQuery */
/*
 * mobile init tests
 */
(function ($) {
	var mobilePage,
		libName = "jquery.mobile.init.js",
		extendFn = $.extend,
		setGradeA = function (value) {
			tau.support.gradeA = function () {
				return value;
			};
		},
		reloadCoreNSandInit = function () {
			tau.engine.run();
		};

	module(libName, {
		setup: function () {
			// NOTE reset for gradeA tests
			$("html").removeClass("ui-mobile");
		},

		teardown: function () {
			$.extend = extendFn;
			// clear the classes added by reloading the init
			$("html").attr("class", "");
			tau.engine._clearBindings();
		}
	});

	// NOTE important to use $.fn.one here to make sure library reloads don't fire
	//	the event before the test check below
	$(document).one("mobileinit", function () {
		mobilePage = $.mobile.page;

		$.mobile.loader.prototype.options.text = "mobileinit";
		$.mobile.loader.prototype.options.textVisible = true;
	});

	// NOTE for the following two tests see index html for the binding
	test("mobile.page is available when mobile init is fired", function () {
		reloadCoreNSandInit();
		ok(mobilePage !== undefined, "$.mobile.page is defined");
	});

	$.testHelper.excludeFileProtocol(function () {
		var findFirstPage = function () {
			return $(":jqmData(role='page')").first();
		};

		$.testHelper.reloadLib = function () {
			tau.engine.run();
		};
		asyncTest("loading the init library triggers mobilinit on the document", function () {
			var initFired = false;

			expect(1);

			$(window.document).one("mobileinit", function () {
				initFired = true;
			});

			$.testHelper.reloadLib(libName);

			setTimeout(function () {
				ok(initFired, "init fired");
				start();
			}, 1000);
		});

		test("enhancments are skipped when the browser is not grade A", function () {
			setGradeA(false);
			$.testHelper.reloadLib(libName);

			//NOTE easiest way to check for enhancements, not the most obvious
			ok(!$("html").hasClass("ui-mobile"), "html elem doesn't have class ui-mobile");
		});

		asyncTest("useFastClick is configurable via mobileinit", function () {
			$(document).one("mobileinit", function () {
				$.mobile.useFastClick = false;
				start();
			});

			$.testHelper.reloadLib(libName);

			deepEqual($.mobile.useFastClick, false, "fast click is set to false after init");
			$.mobile.useFastClick = true;
		});

		test("mobile page container is the first page's parent", function () {
			var firstPage;

			expect(1);
			$.testHelper.reloadLib(libName);
			firstPage = findFirstPage();

			deepEqual($.mobile.pageContainer[0], firstPage.parent().parent()[0], "");
		});

		test("pages without a data-url attribute have it set to their id", function () {
			reloadCoreNSandInit();
			deepEqual($("#foo").jqmData("url"), "#foo", "");
		});

		test("pages with a data-url attribute are left with the original value", function () {
			reloadCoreNSandInit();
			deepEqual($("#bar").jqmData("url"), "bak", "");
		});

		// NOTE the next two tests work on timeouts that assume a page will be
		// created within 2 seconds it'd be great to get these using a more
		// reliable callback or event
		asyncTest("page does auto-initialize at domready when autoinitialize option is true (default) ", function () {

			$("<div />", { "data-role": "page", "id": "autoinit-on" }).prependTo("body");

			var timeout = setTimeout(function () {
				false("Test timeout");
				start();
			}, 4000);

			$(document).one("mobileinit", function () {
				$.mobile.autoInitializePage = true;

				setTimeout(function () {
					clearTimeout(timeout);
					deepEqual($("#autoinit-on.ui-page").length, 1, "");

					start();
				}, 2000);
			});

			location.hash = "";

			reloadCoreNSandInit();
		});


		asyncTest("page does not initialize at domready when autoinitialize option is false ", function () {
			$(document).one("mobileinit", function () {
				$.mobile.autoInitializePage = false;
			});

			$("<div />", { "data-role": "page", "id": "autoinit-off" }).prependTo("body");

			location.hash = "";


			reloadCoreNSandInit();

			setTimeout(function () {
				deepEqual($("#autoinit-off.ui-page").length, 0, "");

				$(document).bind("mobileinit", function () {
					$.mobile.autoInitializePage = true;
				});

				reloadCoreNSandInit();

				start();
			}, 2000);
		});
	});
}(jQuery));
