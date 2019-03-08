$().ready(function() {
	module("core/event/orientationchange", {});
	asyncTest ("orientationchange event", 2, function () {
		setTimeout(function() {
			start();
		}, 10);
		$(window).on( "orientationchange", function( event ) {
			ok(true, 'orientationchange event called');
			ok(typeof event.orientation, "string", 'event.orientation is set');
		});
		$(window).orientationchange();
	});
});