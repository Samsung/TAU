/*global $,Globalize */
$("#localepage").ready(function () {
	// add current datetime with browser language format
	// NOTE: Globalize.* functions must be run after docoument ready.
	$("#current_language").html(Globalize.culture().name);
	$("#current_date").html(Globalize.format(new Date(), "F"));
	$("#html_font_size").html("html font size:" + $("html").css("font-size"));
});
