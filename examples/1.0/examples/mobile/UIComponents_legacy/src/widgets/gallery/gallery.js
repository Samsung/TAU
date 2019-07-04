/*global $ */
/*jslint unparam: true */
$(document).one("pagecreate", "#gallery-demo", function () {
	$("#gallery-demo").on("pageshow", function () {
		$("#gallery").gallery("add", "../test/01.jpg");
		$("#gallery").gallery("add", "../test/02.jpg");
		$("#gallery").gallery("add", "../test/03.jpg");
		$("#gallery").gallery("add", "../test/04.jpg");
		$("#gallery").gallery("add", "../test/05.jpg");
		$("#gallery").gallery("add", "../test/06.jpg");
		$("#gallery").gallery("add", "../test/07.jpg");
		$("#gallery").gallery("add", "../test/08.jpg");
		$("#gallery").gallery("add", "../test/09.jpg");
		$("#gallery").gallery("refresh", 3);

		$("#gallery-add").on("vmouseup", function () {
			$("#gallery").gallery("add", "../test/10.jpg");
			$("#gallery").gallery("add", "../test/11.jpg");
			if (0 === ($("#gallery").gallery("length"))) {
				$(".ui-page-active .ui-tabbar").tabbar("enable", 1);
			}
			$("#gallery").gallery("refresh");
		});

		$("#gallery-del").on("vmouseup", function () {
			$("#gallery").gallery("remove");
			if (0 === ($("#gallery").gallery("length"))) {
				$(".ui-page-active .ui-tabbar").tabbar("disable", 1);
			}
		});
	});

	$("#gallery-demo").on("pagebeforehide", function () {
		$("#gallery").gallery("empty");
	});

});
