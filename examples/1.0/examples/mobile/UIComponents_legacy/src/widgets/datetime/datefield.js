/*global $ */
$(document).one("pagecreate", "#datetimepicker-demo", function () {

	$("#demo-date").on("change", function () {
		$("#selected-date1").text($(this).datetimepicker("value"));
	});

	$("#demo-date2").on("change", function () {
		$("#selected-date2").text($(this).datetimepicker("value"));
	});

	$("#demo-date3").on("change", function () {
		$("#selected-date3").text($(this).datetimepicker("value"));
	});

	$("#demo-date4").on("change", function () {
		$("#selected-date4").text($(this).datetimepicker("value"));
	});

	$("#demo-date5").on("change", function () {
		$("#selected-date5").text($(this).datetimepicker("value"));
	});

	$("#demo-date6").on("change", function () {
		$("#selected-date6").text($(this).datetimepicker("value"));
	});
});