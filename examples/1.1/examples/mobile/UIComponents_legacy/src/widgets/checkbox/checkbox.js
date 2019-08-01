/*global $ */
/*jslint unparam: true */
$(document).one("pagecreate", "#checkbox-demo", function () {
	$("#check-1").on("vclick", function () {
		var value = $("#checkbox-1").prop("checked");
		// change checkbox property and update UI.

		$("#checkbox-1").prop("checked", !value);
		$("#checkbox-1").checkboxradio("refresh");
		// show checkbox1 property
		$(".checked-value").text($("#checkbox-1").prop("checked"));
	});

	$("#get-check-value").on("vclick", function () {
		$(".checked-value").text($("#checkbox-1").prop("checked"));
	});

	$("input[type='checkbox']").on("change", function () {
		$(".triggered-check").text(this.id + " is " + this.checked);
		$(".checked-value").text($("#checkbox-1").prop("checked"));
	});

});


