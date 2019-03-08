/*
 * mobile init tests
 */
$().ready(function(){

		module("core");

		test( "page element is generated when not present in initial markup", function(){
			ok( $( ".ui-page" ).length, 1 );
		});


});
