/*global $ */
/*jslint unparam: true */
$(document).one("pagecreate", "#genlist-dialog-edit", function () {
	$(this).on("vclick", ".ui-li-dialogue-edit .ui-btn", function () {
		$(this).siblings("input").val("");
	});
});
