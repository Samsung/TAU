(function( $, undefined ) {
//$.mobile.page.prototype.options.backBtnTheme	= "s";

if ($.mobile.page) {
// Clear default theme for child elements
$( function ( o ) {
	o.headerTheme = "s";
	o.footerTheme = "s";
} ( $.mobile.page.prototype.options ) );
}

if ($.mobile.listview) {
// clear listview
( function ( o ) {
	o.theme = "s";
	o.countTheme = "s";
	o.headerTheme = "s";
	o.dividerTheme = "s";
	o.splitTheme = "s";
} ( $.mobile.listview.prototype.options ) );
}

if ($.mobile.collapsible) {
// Collapsible
( function ( o ) {
	o.heading = o.heading + ',li';		// Add listitem as a heading
	o.inset = false;
	o.iconPos = "right";	// Move iconPos to right position
	o.collapsedIcon = "arrow-u";
	o.expandedIcon = "arrow-d";
	o.animation = true;
	o.customEventHandler = function ( isCollapse ) {
		var self = this,
			c = $(self).children('.ui-collapsible-content')[0];

		function _getHeight( el ) {
			var h = 0,
				heading = $( el ).children('.ui-collapsible-heading')[0],
				content = $( el ).children('.ui-collapsible-content')[0];

			h += heading.clientHeight;
			$( content ).children().each ( function ( idx, _el ) {
				if ( $( _el ).hasClass( 'ui-collapsible' ) ) {	// recursive call for nested collapsible list
					h += _getHeight( _el );

				} else {
					h += _el.clientHeight;
				}
			} );
			return h;
		}

		if ( isCollapse ) {	// collapse!
			// remember current height
			$( c ).data( 'max-height', _getHeight( self ) );
			$( self ).parentsUntil( '.ui-page', '.ui-collapsible' ).each( function( idx, el ) {
				var content = $( el ).children('.ui-collapsible-content')[0];
				$( content ).data( 'max-height', _getHeight( el ) );
			} );

		} else {	// expand!
			h = $( c ).data( 'max-height' );
			if ( !h ) {
				h = document.body.clientHeight;
				$( c ).data( 'max-height', h );
			}
			$( c ).css( 'max-height', h );
			$( self ).parentsUntil( '.ui-page', '.ui-collapsible' ).each( function( idx, el ) {
				var content = $( el ).children('.ui-collapsible-content')[0];
				$( content ).css( 'max-height', _getHeight( el ) );
			} );
		}
	};
} ( $.mobile.collapsible.prototype.options ) );
}

if ($.mobile.button) {
//clear button theme
$.mobile.button.prototype.options.theme = "s";
$.fn.buttonMarkup.defaults.theme = "s";
}

if ($.mobile.page) {
// Default theme swatch
$.mobile.page.prototype.options.theme = "s";
}

if ($.tizen.frameworkData) {
// Original scale of the theme
$.tizen.frameworkData.defaultViewportWidth = 360;	// Fit to device-width
$.tizen.frameworkData.defaultFontSize = 22;
}

})(jQuery);
