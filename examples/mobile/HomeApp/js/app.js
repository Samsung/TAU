import Storage from "./clipping-storage.js";

(function () {

	"use strict";
	var tau = window.tau,

		storage = new Storage(),
		appsList = [],
		socket = null;

	const defaultList = [{
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
		}],
		getAppsList = new Promise((resolve, reject) => {
			const requestURL = "api/register";

			fetch(requestURL)
				.then((response) => response.json())
				.then((data) => {
					addWSListener(data.wsPort);
					resolve(data.apps);
				})
				.catch(() => {
					reject();
				})
		});

	function updateAppsList(apps) {
		var change = false,
			appsCount = appsList.length,
			currentOrder = "";

		// remove app from local apps list if not exists on remote host
		appsList = appsList.filter(function (localApp) {
			return apps.some(function (remoteApp) {
				return remoteApp.appID === localApp.appID;
			});
		});

		if (appsCount !== appsList.length) {
			change = true;
		}

		// filter app which should be add to local apps list
		const added = apps.filter(function (remoteApp) {
			return !appsList.some(function (localApp) {
				return localApp.appID === remoteApp.appID;
			});
		});

		if (added.length) {
			change = true;
		}

		// add apps to local apps list
		added.forEach(function (remoteApp) {
			remoteApp.webClipsList.forEach((webclip) => {
				webclip.isSelected = !!remoteApp.isSelected;
			});
			appsList.push(remoteApp);
		});

		// update active items
		appsList.forEach(function (localApp) {
			apps.forEach(function (remoteApp) {
				if (remoteApp.appID === localApp.appID) {
					if (localApp.isActive !== remoteApp.isActive) {
						localApp.isActive = remoteApp.isActive;
						change = true;
					}
				}
			})
		});

		currentOrder = appsList.reduce(function (prev, app) {
			return prev + app.appID;
		}, "");

		// check apps order
		appsList = appsList.sort(function (app1, app2) {
			return (app1.isActive) ?
				(app2.isActive) ? 0 : -1 : 1
		});

		// order has been changed
		if (currentOrder !== appsList.reduce(function (prev, app) {
			return prev + app.appID;
		}, "")) {
			change = true;
		}

		return change;
	}

	function onWSMessage(message) {
		const messageObj = JSON.parse(message.data);

		socket.send(JSON.stringify({cmd: "echo"}));

		if (updateAppsList(messageObj.apps)) {
			tau.log("change");

			storage.refreshStorage(Storage.elements.APPSLIST, appsList);

			updateWebClipsUI();
			updateWebClipListPopup();
		} else {
			tau.log("nothing change");
		}

	}

	function addWSListener(wsPort) {
		var wsURL = "ws://" + window.location.hostname + ":" + wsPort + "/ws";

		socket = new WebSocket(wsURL);
		socket.addEventListener("message", onWSMessage);
	}

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

				label.setAttribute("for", webClipName);
				label.classList.add("ui-li-text");

				fetch(`${webclip.url}/manifest.json`)
					.then((out) => out.json())
					.then((manifest) => {
						label.innerHTML = manifest.description;
					})
					.catch((err) => {
						console.error(err);
					});

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

		// use apps list from storage or default apps list if sth wrong
		appsList = storage.readAllFromStorage(Storage.elements.APPSLIST);
		if (appsList.length === 0) {
			updateAppsList(defaultList);
		}

		// check webclips on remote server
		getAppsList.then((apps) => {
			updateAppsList(apps);
		}).finally(() => {
			storage.refreshStorage(Storage.elements.APPSLIST, appsList);
			updateWebClipsUI();
			updateWebClipListPopup();
		});
	}

	function onPageBeforeShow(event) {
		if (event.target.id === "main") {
			init();
		}
	}

	document.addEventListener("pagebeforeshow", onPageBeforeShow);
}());