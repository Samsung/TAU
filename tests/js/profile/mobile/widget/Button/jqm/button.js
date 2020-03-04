/*
 * Unit Test: Button
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */
$ ( document ).ready ( function ( ) {

	$('#page1').one('pageshow', function() {

		module("profile/mobile/widget/mobile/Button");

		test( "button elements in the keepNative set shouldn't be enhanced", function() {
			deepEqual( $("button.should-be-native").siblings("div.ui-slider").length, 0 );
		});

		test( "button elements should be enhanced", function() {
			ok( $("#enhanced").hasClass( "ui-btn" ) );
		});

		test( "button markup text value should be changed on refresh", function() {
			var textValueButton = $("#hidden-element-addition"), valueButton = $("#value");

			// the value shouldn't change unless it's been altered
			textValueButton.button( 'refresh' );
			deepEqual( textValueButton.val(), "foo" );

			// use the text where it's provided
			deepEqual( textValueButton.val(), "foo" );
			textValueButton.val( "bar" ).button( 'refresh' );
			deepEqual( textValueButton.val(), "bar" );

			// prefer the text to the value
			textValueButton.text( "bar" ).val( "baz" ).button( 'refresh' );
			deepEqual( textValueButton.text(), "bar" );
		});

		test( "Enhanced button elements should allow for phrasing content.", function() {
			var $htmlstring = $( "#contains-html" ),
			    $htmlval = $( "#val-contains-html" );

			ok( $htmlstring.find("sup").length, "HTML contained within a button element should carry over to the enhanced version" );
		});

		// @TODO jqm support bug has to fixed
		// When disable property is set (button.prop("disabled", true)),
		// disable property of widgetInstance.element is not changed.
		// So we can not find widgetInstance to call refresh method.
		/*
		test( "Button's disabled state synced via refresh()", function() {
			var button = $( "#disabled-state" );

			button.prop( "disabled", true ).button( "refresh" );

			deepEqual( button.hasClass( "ui-state-disabled" ), true, "class ui-state-disabled has been added to button" );
			deepEqual( button.button( "option", "disabled" ), true, "option disabled is now true" );
		});
		*/

		// @TODO BaseWidget destroy issue has to fixed
		// When widget is destoryed, some properties set in init are not reset (id, classes, aria-disabled...)
		/*
		test( "Destroying a button works correctly", function() {
			var button = $( "<input id='destroy-test-button' class='ui-btn' type='button' value='Destroy Test'>" ),
				container = $( "#destroy-test-container" ).append( button ),
				pristineDOM = container.clone();

			button.button().button( "destroy" );

			deepEqual(container, pristineDOM, "_destroy() leaves DOM unmodified" );
		});
		*/
	});
});
