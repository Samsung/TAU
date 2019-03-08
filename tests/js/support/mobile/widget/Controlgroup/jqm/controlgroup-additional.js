/*
 * segmentcontrol unit tests
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
( function ( $ ) {
	module( "SegmentControl" );

	var unit_segmentcontrol = function ( widget, inputCount, layout ) {
		var segmentGroup = widget;

		/* Create */
		ok( segmentGroup, "Create" );
		equal( "fieldcontain", segmentGroup.jqmData("role" ), "segment control generate" );
		equal( segmentGroup.find( "input" ).length, inputCount, "segment control listitem count test" );
		equal( segmentGroup.find( "input" ).is( ":jqmData(icon=segment-titlestyle-segonly)" ), true, "segment control style test" );

		/*Markup Check*/
		equal( segmentGroup.hasClass("ui-field-contain" ), true, "ui-field-contain class added" ) ;
		equal( segmentGroup.find(":jqmData(role=controlgroup )" ).hasClass("ui-controlgroup-" + layout ), true ) ;
		equal( segmentGroup.find(":jqmData(role=controlgroup )" ).jqmData("type" ) , layout, "data-type" ) ;

	};

	test( "segmentcontrol 2btn-h test", function ( ) {
		unit_segmentcontrol( $("#segmentcontrol-2btn" ), 2 , "horizontal" );
	} );

	test( "segmentcontrol 3btn-h test", function ( ) {
		unit_segmentcontrol( $("#segmentcontrol-3btn" ), 3, "horizontal" );
	} );

	test( "segmentcontrol 4btn-h test", function ( ) {
		unit_segmentcontrol( $("#segmentcontrol-4btn" ), 4, "horizontal" );
	} );

	test( "segmentcontrol 2btn-v test", function ( ) {
		unit_segmentcontrol( $("#segmentcontrol-2btn-v" ), 2, "vertical" );
	} );

	test( "segmentcontrol 3btn-v test", function ( ) {
		unit_segmentcontrol( $("#segmentcontrol-3btn-v" ), 3 , "vertical" );
	} );

	test( "segmentcontrol 4btn-v test", function ( ) {
		unit_segmentcontrol( $("#segmentcontrol-4btn-v" ), 4, "vertical" );
	} );


	test( "segmentcontrol 2btn-h test - dynamic", function ( ) {

		/* Create */
		var segmentControlHTML = '<div data-nstest-role= "content">' +
														'<div data-role= "fieldcontain" id= "segmentcontrol-2btn">' +
															'<fieldset data-role= "controlgroup" data-type= "horizontal">' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment1" value= "on" checked= "checked" />' +
																'<label for= "segment1">List</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment2" value= "off" />' +
																'<label for= "segment2">Grid</label>' +
															'</fieldset>' +
													'</div>';
		/* Clean */
		$('#segmentcontrol_page').find(":jqmData(role=content)" ).empty( );
		$('#segmentcontrol_page').find(":jqmData(role=content)" ).append( segmentControlHTML ).trigger('create') ;
		unit_segmentcontrol( $("#segmentcontrol-2btn" ), 2 , "horizontal" );
	} );

	test( "segmentcontrol 3btn test-h - dynamic", function ( ) {

		/* Create */
		var segmentControlHTML = '<div data-nstest-role= "content">' +
														'<div data-role= "fieldcontain" id= "segmentcontrol-2btn">' +
															'<fieldset data-role= "controlgroup" data-type= "horizontal">' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment1" value= "on" checked= "checked" />' +
																'<label for= "segment1">List</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment2" value= "off" />' +
																'<label for= "segment2">Grid</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment3" value= "off" />' +
																'<label for= "segment3">Grid</label>' +
															'</fieldset>' +
													'</div>';
		/* Clean */
		$('#segmentcontrol_page').find(":jqmData(role=content)" ).empty( );

		$('#segmentcontrol_page').find(":jqmData(role=content)" ).append( segmentControlHTML ).trigger('create') ;
		unit_segmentcontrol( $("#segmentcontrol-3btn" ), 3, "horizontal" );
	} );

	test( "segmentcontrol 4btn test-h - dynamic", function ( ) {

		/* Create */
		var segmentControlHTML = '<div data-nstest-role= "content">' +
														'<div data-role= "fieldcontain" id= "segmentcontrol-2btn">' +
															'<fieldset data-role= "controlgroup" data-type= "horizontal">' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment1" value= "on" checked= "checked" />' +
																'<label for= "segment1">List</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment2" value= "off" />' +
																'<label for= "segment2">Grid</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment3" value= "off" />' +
																'<label for= "segment3">Grid</label>' +
																	'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment4" value= "off" />' +
																'<label for= "segment4">Grid</label>' +
															'</fieldset>' +
													'</div>';
		/* Clean */
		$('#segmentcontrol_page').find(":jqmData(role=content)" ).empty( );

		$('#segmentcontrol_page').find(":jqmData(role=content)" ).append( segmentControlHTML ).trigger('create') ;
		unit_segmentcontrol( $("#segmentcontrol-4btn" ), 4, "horizontal" );
	} );

	test( "segmentcontrol 2btn-v test - dynamic", function ( ) {

		/* Create */
		var segmentControlHTML = '<div data-nstest-role= "content">' +
														'<div data-role= "fieldcontain" id= "segmentcontrol-2btn">' +
															'<fieldset data-role= "controlgroup" data-type= "vertical">' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment1" value= "on" checked= "checked" />' +
																'<label for= "segment1">List</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment2" value= "off" />' +
																'<label for= "segment2">Grid</label>' +
															'</fieldset>' +
													'</div>';
		/* Clean */
		$('#segmentcontrol_page').find(":jqmData(role=content)" ).empty( );

		$('#segmentcontrol_page').find(":jqmData(role=content)" ).append( segmentControlHTML ).trigger('create') ;
		unit_segmentcontrol( $("#segmentcontrol-2btn-v" ), 2, "vertical" );
	} );

	test( "segmentcontrol 3btn-v test - dynamic", function ( ) {

		/* Create */
		var segmentControlHTML = '<div data-nstest-role= "content">' +
														'<div data-role= "fieldcontain" id= "segmentcontrol-2btn">' +
															'<fieldset data-role= "controlgroup" data-type= "vertical">' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment1" value= "on" checked= "checked" />' +
																'<label for= "segment1">List</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment2" value= "off" />' +
																'<label for= "segment2">Grid</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment3" value= "off" />' +
																'<label for= "segment3">Grid</label>' +
															'</fieldset>' +
													'</div>';
		/* Clean */
		$('#segmentcontrol_page').find(":jqmData(role=content)" ).empty( );
		$('#segmentcontrol_page').find(":jqmData(role=content)" ).append( segmentControlHTML ).trigger('create') ;
		unit_segmentcontrol( $("#segmentcontrol-3btn-v" ), 3 , "vertical" );
	} );

	test( "segmentcontrol 4btn-v test - dynamic", function ( ) {
		/* Create */
		var segmentControlHTML = '<div data-nstest-role= "content">' +
														'<div data-role= "fieldcontain" id= "segmentcontrol-2btn">' +
															'<fieldset data-role= "controlgroup" data-type= "vertical">' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment1" value= "on" checked= "checked" />' +
																'<label for= "segment1">List</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment2" value= "off" />' +
																'<label for= "segment2">Grid</label>' +
																'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment3" value= "off" />' +
																'<label for= "segment3">Grid</label>' +
																	'<input type= "radio" name= "radio-view-1" data-icon= "segment-titlestyle-segonly" id= "segment4" value= "off" />' +
																'<label for= "segment4">Grid</label>' +
															'</fieldset>' +
													'</div>';
		/* Clean */
		$('#segmentcontrol_page').find(":jqmData(role=content)" ).empty( );

		$('#segmentcontrol_page').find(":jqmData(role=content)" ).append( segmentControlHTML ).trigger('create') ;
		unit_segmentcontrol( $("#segmentcontrol-4btn-v" ), 4, "vertical" );
	} );



} ( jQuery ) );
