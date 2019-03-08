( function () {
	window.addEventListener( 'tizenhwkey', function( ev ) {
		if( ev.keyName === "back" ) {
			var activePopup = document.querySelector( '.ui-popup-active' ),
				page = document.getElementsByClassName( 'ui-page-active' )[0],
				pageid = page ? page.id : "";

			if( pageid === "main" && !activePopup ) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	} );
} () );