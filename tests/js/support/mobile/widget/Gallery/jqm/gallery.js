/*
 * Unit Test: gallery
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

$ ( document ).ready ( function ( ) {
	module("gallery");

	var unit_gallery = function ( widget, count ) {
		var imagesldier,
			refresh = function ( widget ) {
				widget.gallery("refresh", "1");
				return widget.find(".ui-gallery-bg");
			};

		/* Create */
		widget.gallery();

		gallery = widget.find(".ui-gallery-bg");
		ok( gallery, "Create" );

		/* Initialize */
		equal( gallery.length, count, "Initialize" );

		/* API: length */
		equal( widget.gallery("length"), count, "API: length" );

		/* API: del */
		widget.gallery("remove");
		gallery = refresh( widget );
		equal( gallery.length, count - 1, "API: del" );

		/* API: add */
		widget.gallery("add", "05.jpg");
		widget.gallery("add", "06.jpg");
		gallery = refresh( widget );
		equal( gallery.length, count + 1, "API: add" );

		/* API: length */
		equal( widget.gallery("value"), 1, "API: value" );

		/* API: empty */
		widget.gallery("empty");
		gallery = refresh( widget );
		equal( gallery.length, 0, "API: empty" );
	};

	test( "gallery", function () {
		unit_gallery($("#gallery"), 4);
	});
});
