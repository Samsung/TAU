(function() {
	var page = document.getElementById( "verticalScroller" ),
		vele = document.getElementById( "vscroller" ),
		gesture, pageGesture;

	page.addEventListener( "pageshow", function() {
		var Gesture = tau.gesture;
		// make SectionChanger object
		gesture = new Gesture(vele, {
							dragOrientation: tau.gesture.Orientation.VERTICAL
						})
						.on("drag dragend dragcancel swipe", function( event ) {
							console.debug( "scroller", event );
						});
		pageGesture = new Gesture(page, {
							triggerEvent: true,
							dragOrientation: tau.gesture.Orientation.HORIZONTAL
						})
						.on("drag dragend dragcancel", function( event ) {
							console.debug( "page", event );
						});
	});

	page.addEventListener( "pagehide", function() {
		// release object
		gesture.destroy();
		pageGesture.destroy();
	});

	page.addEventListener( "click", function(e) {
		console.debug(e.type, e.target);
	});

})();