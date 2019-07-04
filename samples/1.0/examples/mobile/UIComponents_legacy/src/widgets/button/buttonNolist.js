/*global $ */
/*jslint unparam: true */
// Expand all textarea height automatically
$(document).on("tizenhwkey", function (ev) {
	if (ev.originalEvent.keyName === "back") {
		//bind callbacks to the H/W keys
		window.history.back();
	}
});


$("#ButtonNolist").one("pagecreate", function () {
	$(this).on({
		"pageshow": function () {
			//resize textareas
			var $textarea = $(this).find("textarea");

			$textarea.each(function (idx, el) {
				var h = Math.max(el.clientHeight, el.scrollHeight);

				$(el).height(h);
			});
		},
		"pagebeforehide": function () {
			//unbind callbacks to the H/W keys
			$(document).off("tizenhwkey");
		}
	});
});
