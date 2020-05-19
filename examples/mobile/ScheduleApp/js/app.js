(function () {
	var App = function () {
			// app constructor;
			this._store = [];
			this._ui = {}
		},
		prototype = App.prototype,
		app,
		tau = window.tau;

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

	// @todo this feature should be part of TAU
	prototype._onDateSelected = function (event) {
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
	};

	// @todo this feature should be part of TAU
	prototype._onCalendarSwitch = function (event) {
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
	};

	prototype._beforeShowCreateEvent = function (event) {
		var page = event.target,
			ui = this._ui;

		ui.doneButton = page.querySelector(".app-event-done");
		ui.cancelButton = page.querySelector(".app-event-cancel");
		ui.dateOn = page.querySelector("#date-on");
		ui.dateOff = page.querySelector("#date-off");
		ui.dayOfWeek = page.querySelector(".ui-day-of-week-picker");

		ui.doneButton.addEventListener("vclick", this, false);

		page.addEventListener("selected", this, false);
		page.addEventListener("calendarswitch", this, false);
	};

	prototype._beforeShowMain = function () {
		var page = event.target,
			themeChanger = page.querySelector("#theme-selector"),
			themeChangerButton = page.querySelector("#selector-opener");


		themeChanger.addEventListener("change", function (event) {
			tau.theme.setTheme(event.target.value);
		});

		themeChangerButton.addEventListener("click", function () {
			var dropdownmenuWidget = tau.widget.DropdownMenu(themeChanger);

			dropdownmenuWidget.open();
		});
		// @todo read data from storage
		// @todo fill page content
		// @todo refresh page
	};

	prototype._eventDoneClick = function () {
		var eventData = {},
			self = this,
			ui = self._ui,
			router;

		// collect data from UI
		eventData.on = tau.widget.DateTimePicker(ui.dateOn).value();
		eventData.off = tau.widget.DateTimePicker(ui.dateOff).value();
		eventData.dayOfWeek = tau.widget.DayOfWeekPicker(ui.dayOfWeek).value();

		// save data to app._store
		self._store.push(eventData);

		// change page to #main (or tau.history.back)
		router = tau.router.Router.getInstance();
		router.open("#main");
	}

	prototype._onClick = function (event) {
		var target = event.target,
			self = this,
			ui = self._ui;

		// done button
		if (target === ui.doneButton) {
			self._eventDoneClick();
		} else if (target === ui.cancelButton) {
			// @todo handler for cancel button
		}
	};

	prototype._onPageBeforeShow = function (event) {
		switch (event.target.id) {
			case "create-event-page":
				this._beforeShowCreateEvent(event);
				break;
			case "main":
				this._beforeShowMain(event);
				break;
		}
	};

	/**
	 * Common event handler for App
	 * @param {Event} event
	 */
	prototype.handleEvent = function (event) {
		var self = this;

		switch (event.type) {
			case "pagebeforeshow":
				self._onPageBeforeShow(event);
				break;
			case "vclick":
				self._onClick(event);
				break;
			case "selected":
				self._onDateSelected(event);
				break;
			case "calendarswitch":
				self._onCalendarSwitch(event);
				break;
		}
	};

	prototype.init = function () {
		document.addEventListener("pagebeforeshow", this, true);
	};

	// application instance
	app = new App();

	// append app to global scope (for debug)
	window.app = app;

	app.init();
}());
