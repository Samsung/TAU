/*
 * mobile navigation base tag unit tests
 */
(function($){

	asyncTest( "can navigate internal pages", function(){

		helper.pageSequence([

			function() {

				gear.ui.changePage( "#internal-page-1" );

			},

			function() {

				helper.assertUrlLocation({
					msg: "navigate to internal page",
					hash:"#internal-page-1",
					id: "internal-page-1"
				});

				$( "[href=#internal-page-2]" )[0].click();

			},

			function() {

				helper.assertUrlLocation({
					msg: "navigate to internal page by link click",
					hash:"#internal-page-2",
					id: "internal-page-2"
				});

				window.history.back();

			},

			function() {

				helper.assertUrlLocation({
					msg: "window.history.back() from internal to internal page",
					hash:"#internal-page-1",
					id: "internal-page-1"
				});

				gear.ui.back();

			},

			function() {

				helper.assertUrlLocation({
					msg: "gear.ui.back() from internal to internal page",
					path: helper.path,
					id: "main"
				});

				gear.ui.changePage( $("#internal-page-2")[0] );

			},

			function() {

				helper.assertUrlLocation({
					msg: "navigate to internal page by element",
					hash:"#internal-page-2",
					id: "internal-page-2"
				});

			}

		], 	true);
	});

	asyncTest( "can navigate external pages", function(){

		helper.pageSequence([

			function() {

				gear.ui.changePage( "path-test/index.html" );

			},

			function() {

				helper.assertUrlLocation({
					msg: "navigate to external page",
					path: "path-test/index.html",
					id: "path-test-path-test"
				});

				gear.ui.changePage( "sub-dir/index.html" );

			},

			function() {

				helper.assertUrlLocation({
					msg: "navigate to external page by relative link",
					path: "path-test/sub-dir/index.html",
					id: "path-test-sub-dir"
				});

				helper.virtualLinkClick( "../parent/index.html" );

			},

			function() {

				helper.assertUrlLocation({
					msg: "navigate to external page by link click",
					path: "path-test/parent/index.html",
					id: "path-test-parent"
				});

				window.history.back();

			},

			function() {

				helper.assertUrlLocation({
					msg: "window.history.back() from external to external page",
					path: "path-test/sub-dir/index.html",
					id: "path-test-sub-dir"
				});

				gear.ui.back();

			},

			function() {

				helper.assertUrlLocation({
					msg: "gear.ui.back() from external to external page",
					path: "path-test/index.html",
					id: "path-test-path-test"
				});

			}

		], true);
	});

	asyncTest( "can navigate between internal and external pages", function(){

		helper.pageSequence([

			function(){

				gear.ui.changePage( "#internal-page-2" );

			},

			function(){

				helper.assertUrlLocation({
					msg: "navigate to internal page",
					hash:"#internal-page-2",
					id: "internal-page-2"
				});

				helper.virtualLinkClick( "path-test/index.html" );

			},

			function(){

				helper.assertUrlLocation({
					msg: "navigate from internal page to page in path-test directory",
					path: "path-test/index.html",
					id: "path-test-path-test"
				});

				helper.virtualLinkClick( "index2.html" );

			},

			function(){

				helper.assertUrlLocation({
					msg: "navigate to another page within the same directory hierarchy",
					path: "path-test/index2.html",
					id: "path-test-path-test2"
				});

				helper.virtualLinkClick( "#internal-page-1" );
			},

			function(){

				helper.assertUrlLocation({
					msg: "fail to navigate when use only id in external page.",
					path: "path-test/index2.html",
					id: "path-test-path-test2"
				});

				helper.virtualLinkClick( "../index.html#internal-page-1" );
			},

			function(){

				helper.assertUrlLocation({
					msg: "navigate to internal page from external page",
					hash:"#internal-page-1",
					id: "internal-page-1"
				});

				helper.virtualLinkClick( "path-test/sub-dir/../parent/index.html" );
			},

			function(){

				helper.assertUrlLocation({
					msg: "navigate from base directory page to a page in a different directory hierarchy",
					path: "path-test/parent/index.html",
					id: "path-test-parent"
				});

				helper.virtualLinkClick( helper.path );
			},

			function(){

				helper.assertUrlLocation({
					msg: "navigate from a page in a sub directory to an internal page",
					path: helper.path,
					id: "main"
				});

				helper.virtualLinkClick( "#internal-page-2" );
			},

			function(){

				helper.assertUrlLocation({
					msg: "navigate to internal page after navigated from external page",
					hash:"#internal-page-2",
					id: "internal-page-2"
				});

				gear.ui.changePage("internal-page-1");
			},

			function(){

				helper.assertUrlLocation({
					msg: "calling changePage() with a page id that is not prefixed with '#' should not change page",
					hash:"#internal-page-2",
					id: "internal-page-2"
				});

			}
		], true);
	});

	asyncTest( "can gear.ui.back() in pages", function(){
		helper.pageSequence([
			function() {
				gear.ui.changePage( "#internal-page-1" );
			},

			function() {
				helper.assertUrlLocation({
					msg: "prepare move to internal page",
					hash:"#internal-page-1",
					id: "internal-page-1"
				});

				gear.ui.changePage( "#internal-page-2" );
			},

			function() {
				helper.assertUrlLocation({
					msg: "prepare move to internal page",
					hash:"#internal-page-2",
					id: "internal-page-2"
				});

				gear.ui.back();
			},

			function() {

				helper.assertUrlLocation({
					msg: "gear.ui.back() from internal to internal page",
					hash:"#internal-page-1",
					id: "internal-page-1"
				});

				gear.ui.changePage( helper.makePathAbsolute("path-test/index.html", helper.path) );

			},

			function() {
				helper.assertUrlLocation({
					msg: "prepare move to external page",
					path:"path-test/index.html",
					id: "path-test-path-test"
				});

				gear.ui.changePage( helper.makePathAbsolute("path-test/index2.html", helper.path) );
			},

			function() {
				helper.assertUrlLocation({
					msg: "prepare move to external page",
					path:"path-test/index2.html",
					id: "path-test-path-test2"
				});

				gear.ui.back();
			},

			function(){

				helper.assertUrlLocation({
					msg: "gear.ui.back() from external page to external page",
					path: "path-test/index.html",
					id: "path-test-path-test"
				});

				gear.ui.back();

			},

			function() {

				helper.assertUrlLocation({
					msg: "gear.ui.back() from external page to internal page",
					hash:"#internal-page-1",
					id: "internal-page-1"
				});

				gear.ui.changePage( helper.makePathAbsolute("path-test/index2.html", helper.path) );
			},

			function() {

				helper.assertUrlLocation({
					msg: "prepare move to external page",
					path: "path-test/index2.html",
					id: "path-test-path-test2"
				});

				gear.ui.changePage( "../index.html#internal-page-1" );
			},

			function() {
				helper.assertUrlLocation({
					msg: "prepare move to internal page",
					hash:"#internal-page-1",
					id: "internal-page-1"
				});

				gear.ui.back();
			},

			function() {

				helper.assertUrlLocation({
					msg: "gear.ui.back() from internal page to external page",
					path: "path-test/index2.html",
					id: "path-test-path-test2"
				});

			}
		], true);
	});

	asyncTest( "external empty page does not result in any contents", function() {
		helper.pageSequence([
			function() {
				gear.ui.changePage( helper.makePathAbsolute("path-test/blank.html", helper.path) );
			},

			function() {
				helper.assertUrlLocation({
					msg: "A blank page should not change page",
					path: helper.path,
					id: "main"
				});
			}
		], true);
	});

	asyncTest( "external page is removed from the DOM after pagehide", function(){
		helper.pageSequence([
			function() {
				gear.ui.changePage( helper.makePathAbsolute("path-test/index.html", helper.path) );
			},

			// page is pulled and displayed in the dom
			function() {
				deepEqual( $( "#path-test-path-test" ).length, 1 );
				gear.ui.back();
			},

			// external-test is *NOT* cached in the dom after transitioning away
			function( timedOut ) {
				deepEqual( $( "#path-test-path-test" ).length, 0 );
			}
		], true);
	});

	asyncTest( "failed to navigate", function(){
		var firedLoadFailEvent = false;

		document.addEventListener("loadfailed", function( event ) {
			firedLoadFailEvent = true;
		}, false);

		helper.eventSequence("changefailed", [
			function() {
				firedLoadFailEvent = false;
				gear.ui.changePage( "#internal-not-exist" );
			},

			function() {
				ok( !firedLoadFailEvent, "page change failed and doesn't load page." );
				firedLoadFailEvent = false;
				gear.ui.changePage( "external-not-exist.html" );
			},

			function() {
				ok( firedLoadFailEvent, "page change failed and recived loadfail event." );
				firedLoadFailEvent = false;
			}
		], true);
	});	

})(jQuery);
