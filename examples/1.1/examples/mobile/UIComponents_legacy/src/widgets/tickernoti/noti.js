/*global $ */
/*jslint unparam: true */
$("div.noti-demo").on("pagecreate", function () {
	$("#noti-demo").on("vmouseup", function () {
		$("#notification").notification("open");
	});

	$("#noti-icon1").on("vclick", function () {
		$("#notification").notification("icon", "../test/icon02.png");
	});

	$("#noti-icon2").on("vclick", function () {
		$("#notification").notification("icon", "../test/icon01.png");
	});

});
