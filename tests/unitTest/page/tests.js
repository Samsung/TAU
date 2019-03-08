(function($){

	var pageEvents = "pagebeforecreate pagecreate pagebeforehide pagebeforeshow pagehide pageshow pagechange".split(" "),
		eventStack = [],
		showEvents = [],
		hideEvents = [],
		checkPageLayout = function( page ) {
			var screenWidth = $(window).width(),
				screenHeight = $(window).height(),
				$page = $( page ),
				pageHeaderHeight = $page.children(".ui-header").outerHeight(),
				pageFooterHeight = $page.children(".ui-footer").outerHeight(),
				pageContentHeight = $page.children(".ui-content").outerHeight();
			return pageHeaderHeight + pageFooterHeight + pageContentHeight === screenHeight;
		};

		pageEvents.forEach(function(eventName, idx) {
		document.addEventListener(eventName, function( event ) {
			eventStack.push({
				type: event.type,
				target: event.target
			});
		}, false);
	});

	test( "initialize page events", function() {
		var main = $("#main")[0];

		ok(eventStack[0].type === "pagebeforecreate" && eventStack[0].target === main, "pagebeforecreate event fires when page is initialized");
		ok(eventStack[1].type === "pagecreate" && eventStack[1].target === main, "pagecreate event fires when page is initialized");
		ok(eventStack[2].type === "pagebeforeshow" && eventStack[2].target === main, "pagebeforeshow event fires when page is initialized");
		ok(eventStack[3].type === "pageshow" && eventStack[3].target === main, "pageshow event fires when page is initialized");
		ok(eventStack[4].type === "pagechange", "pagechange event fires when page is initialized");

		eventStack.length = 0;

	});

	test( "initialize page layout", function() {
		var screenWidth = $(window).width(),
			screenHeight = $(window).height(),
			$page = $("#main"),
			pageWidth = $page.outerWidth(),
			pageHeight = $page.outerHeight();

		ok($page.hasClass("ui-page-active"), "set active class on changed page.");
		ok(screenWidth === pageWidth && screenHeight === pageHeight, "set page width and height");
	});

	asyncTest( "fire page events during changing page", function(){

		var hideEventHandler = function( event ) {
				hideEvents.push({
					type: event.type,
					target: event.target
				});
			},
			showEventHandler = function( event ) {
				showEvents.push({
					type: event.type,
					target: event.target
				});
			};

		helper.pageSequence([
			function() {
				gear.ui.changePage( "#internal-page-hide" );
			},

			function() {
				eventStack.length = 0;
				showEvents.length = 0;
				hideEvents.length = 0;

				pageEvents.forEach(function(eventName, idx) {
					$("#internal-page-hide")[0].addEventListener(eventName, hideEventHandler, false);
				});

				pageEvents.forEach(function(eventName, idx) {
					$("#internal-page-show")[0].addEventListener(eventName, showEventHandler, false);
				});

				gear.ui.changePage( "#internal-page-show" );
			},

			function() {
				var showElem = $("#internal-page-show")[0],
					hideElem = $("#internal-page-hide")[0];

				ok(showEvents[0].type === "pagebeforecreate" && showEvents[0].target === showElem, "pagebeforecreate event fires when changing page");
				ok(showEvents[1].type === "pagecreate" && showEvents[1].target === showElem, "pagecreate event fires when changing page");
				ok(showEvents[2].type === "pagebeforeshow" && showEvents[2].target === showElem, "pagebeforeshow event fires when changing page");
				ok(showEvents[3].type === "pageshow" && showEvents[3].target === showElem, "pageshow event fires when changing page");

				ok(hideEvents[0].type === "pagebeforehide" && hideEvents[0].target === hideElem, "pagebeforehide event fires when changing page");
				ok(hideEvents[1].type === "pagehide" && hideEvents[1].target === hideElem, "pagehide event fires when changing page");

				ok(eventStack[6].type === "pagechange", "pagechange event fires when changing page");

				pageEvents.forEach(function(eventName, idx) {
					var a = $("#internal-page-hide")[0];
					$("#internal-page-hide")[0].removeEventListener(eventName, hideEventHandler, false);
				});

				pageEvents.forEach(function(eventName, idx) {
					$("#internal-page-show")[0].removeEventListener(eventName, showEventHandler, false);
				});
			}
		], true);
	});

	asyncTest( "various page layout", function(){
		helper.pageSequence([
			function() {
				gear.ui.changePage( "#layout-test-header-footer" );
			},

			function() {
				ok(checkPageLayout("#layout-test-header-footer"), "set page layout with header and footer");
				gear.ui.changePage( "#layout-test-header" );
			},

			function() {
				ok(checkPageLayout("#layout-test-header"), "set page layout with header");
				gear.ui.changePage( "#layout-test-footer" );
			},

			function() {
				ok(checkPageLayout("#layout-test-footer"), "set page layout with footer");
				gear.ui.changePage( "#layout-test-only-content" );
			},

			function() {
				ok(checkPageLayout("#layout-test-only-content"), "set page layout that has only content");
				gear.ui.changePage( "#layout-test-only-custom-header" );
			},

			function() {
				ok(checkPageLayout("#layout-test-only-custom-header"), "set page layout with custom header");
				gear.ui.changePage( "#layout-test-only-custom-footer" );
			},

			function() {
				ok(checkPageLayout("#layout-test-only-custom-footer"), "set page layout with custom footer");
			}

			], true);
	});

})(jQuery);