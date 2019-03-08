/*
 * segmentcontrol unit tests
 */

(function ($) {
	module( "SegmentControl" );

	var unit_segmentcontrol = function ( widget, inputCount ) {
		var segmentGroup = widget;

		/* Create */
		ok( segmentGroup, "Create" );

		equal( "fieldcontain", segmentGroup.jqmData("role"), "segment control generate" );

		equal( segmentGroup.find( "input" ).length, inputCount, "segment control listitem count test" );

		equal( segmentGroup.find( "input" ).is( ":jqmData(icon='segment-titlestyle-segonly')" ), true, "segment control style test" );
	};

	test( "segmentcontrol 2btn test", function () {
		unit_segmentcontrol( $("#segmentcontrol-2btn"), 2 );
	});

	test( "segmentcontrol 3btn test", function () {
		unit_segmentcontrol( $("#segmentcontrol-3btn"), 3 );
	});

	test( "segmentcontrol 4btn test", function () {
		unit_segmentcontrol( $("#segmentcontrol-4btn"), 4 );
	});

})(jQuery);
