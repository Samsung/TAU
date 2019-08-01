/*global $ */
/*jslint unparam: true */
$(document).one("pagecreate", "#list-sample", function () {
	var id = 0,
		addItem = function () {
			var li = "<li class=\"ui-li-1line-btn1\" id=\"li" + id + "\">" +
				"<span class=\"ui-li-text-main\">Item " + id + "</span>" +
				"<div data-role=\"button\" data-inline=\"true\" id=\"" + id + "\">delete</div>" +
				"</li>";

			id++;

			$("#mylist").append(li).trigger("create");
		};

	$("#add").on("vclick", function () {
		addItem();
		$("#mylist").listview("refresh");
	});

	$("#add2").on("vclick", function () {
		var i;

		for (i = 0; i < 20; i++) {
			addItem();
		}

		$("#mylist").listview("refresh");
	});

	$("#new").on("vclick", function () {
		var i;

		$("#mylist").html("").trigger("create");

		for (i = 0; i < 3; i++) {
			addItem();
		}
		$("#mylist").listview("refresh");
	});

	$("#mylist").on("vclick", ".ui-btn", function () {
		$("#li" + this.id).remove();
		$("#mylist").listview("refresh");
	});
});
