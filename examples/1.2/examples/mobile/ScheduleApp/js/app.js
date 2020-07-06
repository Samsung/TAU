(function () {
	var App = function () {
			// app constructor;
			this._store = [];
			this._ui = {}
		},
		tempDate = new Date(),
		defaultStore = [{
			on: tempDate.getTime(),
			off: tempDate.getTime() + 3900 * 1000, // + 1h 5m
			type: "onoff",
			dayOfWeek: [1, 2, 3]
		}],
		prototype = App.prototype,
		app,
		tau = window.tau;

	prototype._onHWKey = function (ev) {
		var activePopup = null,
			page = null,
			pageId = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.querySelector(".ui-page-active");
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
	};

	// reset app storage
	prototype._resetApp = function () {
		var page = document.querySelector(".ui-page-active");

		// deep copy of object
		this._store = JSON.parse(JSON.stringify(defaultStore));
		this._buildEventList(page.querySelector(".ui-content"));
		tau.engine.createWidgets(page);
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
	};

	prototype._beforeShowMain = function (event) {
		var self = this,
			ui = self._ui,
			page = event.target,
			themeChanger = page.querySelector("#theme-selector"),
			themeChangerButton = page.querySelector("#selector-opener");

		ui.mainBackButton = page.querySelector("header .ui-btn-icon-back");

		if (self._store.length === 0) {
			self._store = JSON.parse(JSON.stringify(defaultStore));
		}

		themeChanger.addEventListener("change", function (event) {
			tau.theme.setTheme(event.target.value);
		});

		themeChangerButton.addEventListener("vclick", function () {
			var dropdownmenuWidget = tau.widget.DropdownMenu(themeChanger);

			dropdownmenuWidget.open();
		});
		ui.mainBackButton.addEventListener("vclick", self, false);

		self._buildEventList(page.querySelector(".ui-content"));
		tau.engine.createWidgets(page);
	};

	prototype._eventDoneClick = function (target) {
		var eventData = {},
			self = this,
			ui = self._ui,
			router;

		// collect data from UI
		eventData.on = tau.widget.DateTimePicker(ui.dateOn).value().getTime();
		eventData.off = tau.widget.DateTimePicker(ui.dateOff).value().getTime();
		eventData.dayOfWeek = tau.widget.DayOfWeekPicker(ui.dayOfWeek).value();
		eventData.type = target.getAttribute("data-type");

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
			self._eventDoneClick(target);
		} else if (target === ui.mainBackButton) {
			self._resetApp();
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

	prototype._buildEventList = function (container) {
		container.innerHTML = "";
		this._store.forEach(function (item) {
			var timeOn = (new Date(item.on)).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true }).split(" "),
				timeOff = (new Date(item.off)).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true }).split(" "),
				type = item.type,
				HTMLTemplateOn = `<div class="ui-content-area content-area">
			<div class="ui-text content-header">
				Turn device on
			</div>
			<div class="content-container">
				<div class="hour-container">
					<span class="ui-text hour-value">
						${timeOn[0]}
					</span>
					<span class="ui-text hour-signature">
						${timeOn[1]}
					</span>
				</div>
				<div class="ui-li-action action-container">
					<day-indicator active="${item.dayOfWeek.join(" ")}"></day-indicator>
					<select class="ui-on-off-switch">
						<option value="off"></option>
						<option value="on" selected></option>
					</select>
				</div>
			</div>
			<div class="content-footer">
				Cool / 18°C / High
			</div>
		</div>`,
				HTMLTemplateOff = `<div class="ui-content-area content-area">
			<div class="ui-text content-header">
				Turn device off
			</div>
			<div class="content-container">
				<div class="hour-container">
					<span class="ui-text hour-value">
						${timeOff[0]}
					</span>
					<span class="ui-text hour-signature">
						${timeOff[1]}
					</span>
				</div>
				<div class="ui-li-action action-container">
					<day-indicator active="${item.dayOfWeek.join(" ")}"></day-indicator>
					<select class="ui-on-off-switch">
						<option value="off"></option>
						<option value="on" selected></option>
					</select>
				</div>
			</div>
			<div class="content-footer">
				Cool / 18°C / High
			</div>
		</div>`

			switch (type) {
				case "on":
					container.innerHTML += HTMLTemplateOn;
					break;
				case "off":
					container.innerHTML += HTMLTemplateOff;
					break;
				case "onoff":
					container.innerHTML += HTMLTemplateOn;
					container.innerHTML += HTMLTemplateOff;
					break;
				default:
					break;
			}
		});
	}

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
			case "tizenhwkey":
				self._onHWKey(event);
				break;
		}
	};

	prototype.init = function () {
		document.addEventListener("pagebeforeshow", this, true);
		window.addEventListener("tizenhwkey", this, false);
	};

	// application instance
	app = new App();

	// append app to global scope (for debug)
	window.app = app;

	app.init();
}());
