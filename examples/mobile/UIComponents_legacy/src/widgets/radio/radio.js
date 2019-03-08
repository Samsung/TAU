/*global $ */
/*jslint unparam: true */
$(document).one("pagecreate", "#radio-demo", function () {
	$(".choosepet input[type='radio']").on("change", function () {
		if (this.checked) {
			$(".triggered-radio").text(this.id + " is selected...");
		}
	});
});


