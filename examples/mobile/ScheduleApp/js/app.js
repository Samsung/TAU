(function () {
	var tau = window.tau;

	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageId = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageId = page ? page.id : "";

			if (pageId === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});

	document.addEventListener("pagebeforeshow", function (event) {
		var page = event.target;

		if (page.id === "create-event-page") {
			page.addEventListener("selected", function (event) {
				var calendarEl,
					calendar;

				if (event.target.id === "date-on") {
					calendarEl = document.getElementById("calendar-on");
				} else if (event.target.id === "date-off") {
					calendarEl = document.getElementById("calendar-off");
				}
				if (calendarEl) {
					calendar = tau.widget.Calendar(calendarEl);
					calendar.value(event.detail.datetime);
					calendar.element.classList.remove("app-hidden");
					event.target.classList.add("app-hidden");
				}
			});
			page.addEventListener("calendarswitch", function (event) {
				var dateEl,
					date;

				if (event.target.id === "calendar-on") {
					dateEl = document.getElementById("date-on");
				} else if (event.target.id === "calendar-off") {
					dateEl = document.getElementById("date-off");
				}
				if (dateEl) {
					date = tau.widget.DateTimePicker(dateEl);
					date.value(event.detail.date);
					date.element.classList.remove("app-hidden");
					event.target.classList.add("app-hidden");
				}
			});
		}
	}, true);
}());