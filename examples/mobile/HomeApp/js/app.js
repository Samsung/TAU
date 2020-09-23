import Storage from "./clipping-storage.js";

(function () {

	"use strict";
	var tau = window.tau,

		storage = new Storage(),
		appsList = [];

	const defaultList = [
			{
				"appID": "vUf39tzQ3s.UIComponents",
				"isInstalled": true,
				"isActive": true,
				"webClipsList": [
					{
						url: "webclip/apps-on-tv",
						isSelected: false
					},
					{
						url: "webclip/latest-news",
						isSelected: false
					}
				]
			},
			{
				"appID": "vUf39tzQ3t.UIComponents",
				"isInstalled": true,
				"isActive": false,
				"webClipsList": [
					{
						url: "webclip/now-on-tv",
						isSelected: false
					},
					{
						url: "webclip/restaurant",
						isSelected: true
					}
				]
			},
			{
				"appID": "vUf39tzQ3r.UIComponents",
				"isInstalled": false,
				"isActive": false,
				"webClipsList": [
					{
						url: "webclip/tv-remote-control",
						isSelected: true
					},
					{
						url: "webclip/weather",
						isSelected: true
					}
				]
			}
		],
		getAppsList = new Promise((resolve) => {
			const requestURL = "api/appslist";

			fetch(requestURL)
				.then((response) => response.json())
				.then((data) => {
					data.forEach((app) => {
						app.webClipsList.forEach((webclip) => {
							webclip.isSelected = false;
						});
					});
					resolve(data);
				})
				.catch(() => {
					// use default apps list if sth wrong
					resolve(defaultList);
				})
		});


	function changeTheme(event) {
		tau.theme.setTheme(event.target.value);
	}


	function onPopupSubmit() {
		appsList.forEach(function (app) {
			app.webClipsList.forEach(function (webclip) {
				const webClipName = getWebClipName(webclip.url),
					checkbox = document.querySelector("#" + webClipName);

				webclip.isSelected = checkbox.checked;
			})
		});
		storage.refreshStorage(Storage.elements.APPSLIST, appsList);
		updateWebClipsUI();
		tau.history.back();
	}

	/**
     * Click button event handler
     * Opens drawer
     */
	function onButtonClick() {
		var drawerWidget = tau.widget.Drawer(document.querySelector(".ui-drawer"));

		drawerWidget.open();
	}

	function updateWebClipsUI() {
		var current = document.querySelectorAll(".ui-card"),
			webclipsContainer = document.getElementById("web-clips");

		// remove previous
		current.forEach(function (card) {
			card.parentElement.removeChild(card);
		});

		appsList.forEach(function (app) {
			app.webClipsList.forEach((webclip) => {
				let card,
					webClipUrl;

				if (webclip.isSelected) {
					card = document.createElement("div"),
					webClipUrl = webclip.url;

					// add slash for name of webClip
					if (!webClipUrl.match(/\/$/)) {
						webClipUrl += "/";
					}
					webClipUrl += "webclip.html";

					card.classList.add("ui-card");
					card.setAttribute("data-src", webClipUrl);

					webclipsContainer.appendChild(card);
				}
			});
		});

		tau.engine.createWidgets(webclipsContainer);
	}

	//TODO: provide mechanism for getting web clip name from webClip meta data
	//		and separate from getting ID
	function getWebClipName(webClip) {
		// remove all text to the last \
		return webClip.replace(/.*\//, "");
	}

	function updateWebClipListPopup() {

		var popupList = document.getElementById("popup-list");

		// remove previous li items
		while (popupList.firstChild) {
			popupList.firstChild.remove()
		}

		appsList.forEach(function (app) {
			app.webClipsList.forEach(function (webclip) {
				var li = document.createElement("li"),
					input = document.createElement("input"),
					label = document.createElement("label"),
					webClipName = getWebClipName(webclip.url);

				li.classList.add("ui-li-has-checkbox");
				li.classList.add("ui-group-index");

				input.setAttribute("type", "checkbox");
				input.setAttribute("id", webClipName);

				label.setAttribute("for", "latest-news-ckeck");
				label.classList.add("ui-li-text");
				//TODO: we should read webclip description for label
				label.innerHTML = webClipName;

				li.appendChild(input);
				li.appendChild(label);
				popupList.appendChild(li);
			});
		});

		tau.engine.createWidgets(popupList);
		appsList.forEach(function (app) {
			app.webClipsList.forEach(function (webclip) {
				if (webclip.isSelected) {
					const webClipName = getWebClipName(webclip.url),
						checkbox = document.querySelector("#" + webClipName);

					if (checkbox) {
						checkbox.checked = true;
					}
				}
			});
		});
	}

	function init() {
		var themeChanger = document.querySelector("#theme-selector"),
			page = document.querySelector(".ui-page"),
			themeChangerButton = page.querySelector("#selector-opener"),
			burgerButton = page.querySelector(".app-btn-icon-burger"),
			popupButton = page.querySelector("#popup-submit");

		themeChanger.addEventListener("change", changeTheme);

		themeChangerButton.addEventListener("vclick", function () {
			var dropdownmenuWidget = tau.widget.DropdownMenu(themeChanger);

			dropdownmenuWidget.open();
		});

		burgerButton.addEventListener("click", onButtonClick);
		popupButton.addEventListener("click", onPopupSubmit);

		appsList = storage.readAllFromStorage(Storage.elements.APPSLIST) || [];

		//TODO: all webclips url should checked if they are valid

		if (!appsList.length) {
			getAppsList((apps) => {
				appsList = apps;
				updateWebClipsUI();
				updateWebClipListPopup();
				storage.refreshStorage(Storage.elements.APPSLIST, apps);
			});
		} else {
			updateWebClipsUI();
			updateWebClipListPopup();
		}
	}

	function onPageBeforeShow(event) {
		if (event.target.id === "main") {
			init();
		}
	}

	document.addEventListener("pagebeforeshow", onPageBeforeShow);
}());