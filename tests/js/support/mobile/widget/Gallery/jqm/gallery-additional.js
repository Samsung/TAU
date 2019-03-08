/*
 * Unit Test: gallery
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$( document ).ready( function ( ) {
	module("gallery");

	var unit_gallery = function ( widget, count ) {
		var imagesldier,
			refresh = function ( widget ) {
				widget.gallery("refresh", "1");
				return widget.find(".ui-gallery-bg");
			},
			imageWrapperDiv,
			imageCount,
			index,
			alignment,
			gallery,
			temp_img;

		/* Create */
		widget.gallery( );

		gallery = widget.find(".ui-gallery-bg");
		ok( gallery, "Create");

		/* Show */
		// After calling method 'show', gallery prepares containers with images inside
		widget.gallery("show");
		imageWrapperDiv = widget.find(".ui-gallery-bg");
		imageCount = widget.find(".ui-gallery-bg img");
		index = widget.jqmData("index");
		alignment = widget.jqmData("vertical-align");

		/* Initialize */
		equal( gallery.length, count, "Initialize");

		/*Initail image count*/
		equal( imageCount.length, 3, "Makrup : image tag count");
		equal( imageWrapperDiv.length, count, "Markup : wrapper div count");

		/* current image*/
		equal( index , 3, "Property: data-index");

		/* vartical alignment image*/
		equal( alignment , "middle", "Property: data-vertical-align");

		/*Current Image Check*/
		temp_img = widget.find('.ui-gallery-bg:eq(' + index + ' ) img');
		equal( temp_img.attr("src") , "04.jpg", "Current Image Check");

		/* API: length */
		equal( widget.gallery("length"), count, "API: length");

		/* API: del */
		widget.gallery("remove", count - 1 );
		gallery = refresh( widget );
		equal( gallery.length, count - 1, "API: del");

		/* API: add */
		widget.gallery("add", "06.jpg");
		gallery = refresh( widget );
		equal( gallery.length, count , "API: add");

		/* vartical alignment image*/
		widget.jqmData("vertical-align", 'top') ;
		gallery = refresh( widget );
		alignment = widget.jqmData("vertical-align") ;
		equal( alignment , "top", "Property change: data-vertical-align");

		/* vartical alignment image*/
		widget.jqmData("vertical-align", 'bottom') ;
		gallery = refresh( widget );
		alignment = widget.jqmData("vertical-align") ;
		equal( alignment , "bottom", "Property change: data-vertical-align");

		/* API: length */
		equal( widget.gallery("value"), 1, "API: value");

		/* API: del */
		widget.gallery("remove", -1 );
		gallery = refresh( widget );
		equal( gallery.length, count , "API: remove with invalid index");
		widget.gallery("remove", 1 );
		gallery = refresh( widget );
		count-- ;
		equal( gallery.length, count , "API: remove with index less then current index");

		widget.gallery("remove", 3 );
		gallery = refresh( widget );
		count-- ;
		// Problem in WebUI
		equal( gallery.length, count , "API: remove with index greater then current index");

		widget.gallery("remove", 2 );
		gallery = refresh( widget );
		count-- ;
		equal( gallery.length, count, "API: remove with current index");

		/* API: empty */
		widget.gallery("empty");
		gallery = refresh( widget );
		equal( gallery.length, 0, "API: empty");
		count = 0 ;

		/* API: add */
		widget.gallery("add", "06.jpg");
		widget.gallery("add", "07.jpg");
		widget.gallery("add", "08.jpg");
		count = 3;
		gallery = refresh( widget );
		equal( gallery.length, count , "API: add");
		widget.gallery("remove", 1 );
		gallery = refresh( widget );
		count-- ;
		equal( gallery.length, count, "API: remove with current index");
		widget.gallery("remove", 0 );
		gallery = refresh( widget );
		count-- ;
		equal( gallery.length, count, "API: remove with current index");

		widget.gallery("hide");
		gallery = refresh( widget );
		equal( gallery.find('ui-gallery-bg').attr('style'), undefined , "API: hide");
		widget.gallery("show");
		gallery = refresh( widget );
		equal( gallery.find('ui-gallery-bg').attr('style'), undefined , "API: show");
	};

	test("gallery", function ( ) {
		$('#gallery-page-test').page( );
		unit_gallery( $("#gallery"), 5 );
	} );

	test("Gallery Dynamic", function ( ) {

		// Line "'<img src="05.jpg"/>' +" was added, because this gallery should contain 5 photos (not 4).
		// Later we check 'unit_gallery( $("#gallery2"), 5 )', so we expect 5 img elements.
		var markup = '<div data-role="gallery"id="gallery2"data-index="3"data-vertical-align="middle">' +
								'<img src="01.jpg"/>' +
								'<img src="02.jpg"/>' +
								'<img src="03.jpg"/>' +
								'<img src="04.jpg"/>' +
								'<img src="05.jpg"/>' +
							'</div>';
		$('#gallery-page-test-dynamic').page( );
		$('#gallery-page-test-dynamic').find(":jqmData(role=content)").append( markup ) ;
		$('#gallery-page-test-dynamic').find(":jqmData(role=content)").trigger('create') ;

		unit_gallery( $("#gallery2"), 5 );

	} );

} );
