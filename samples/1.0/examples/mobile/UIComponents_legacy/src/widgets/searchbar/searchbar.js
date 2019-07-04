/*global $ */
/* eslint no-alert: off */
$(document).one("pageshow", ":jqmData(role='page')", function (ev) {
	var page = ev.target;

	$("#" + page.id + "-search").on("input change", function (ev) {
		var regEx,
			sbar = ev.target,
			content = $(page).children(":jqmData(role='content')")[0];

		regEx = new RegExp(".*" + $(sbar).val().toLowerCase());

		$(content).find("li").each(function () {
			if ($(this).text().toLowerCase().match(regEx)) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});

		$(content).scrollview("scrollTo", 0, 0, 0);
	});

	$(".ui-btn-search-front-icon").on("vclick", function () {
	//JIRA - bug fix N_SE-47442
		setTimeout(function (self) {
			$(self).removeClass("ui-focus");
			self.blur();
			window.alert("front button in searchbar pressed!");
		}, 300, this);
	});
});


