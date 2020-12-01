import Storage from "./clipping-storage.js";

(function () {

	"use strict";
	var tau = window.tau,
		HomeApp = function () {
			this.version = "0.1";
			this.appsList = [];
		},
		prototype = HomeApp.prototype,

		storage = new Storage(),
		socket = null,
		homeApp;

	const defaultList = [{
			"appID": "vUf39tzQ3s.UIComponents",
			"isInstalled": true,
			"isActive": true,
			"webClipsList": [
				{
					url: "webclip/apps-on-tv",
					isSelected: true
				},
				{
					url: "webclip/latest-news",
					isSelected: false
				}
			]
		},
		{
			"appID": "vUf40tzQ4s.Netflix",
			"isInstalled": false,
			"isActive": false,
			"webClipsList": [
				{
					url: "webclip/netflix",
					isSelected: true
				}
			]
		},
		{
			"appID": "vUf39tzQ6s.NetflixAds",
			"isInstalled": false,
			"isActive": false,
			"webClipsList": [
				{
					url: "webclip/netflix-ads",
					isSelected: true
				}
			]
		},
		{
			"appID": "vUf39tzQ5s.TVPlusChannels",
			"isInstalled": true,
			"isActive": true,
			"webClipsList": [
				{
					url: "webclip/tv-plus-channels",
					isSelected: true
				}
			]
		},
		{
			"appID": "vUf19tzQ4s.Sketch",
			"isInstalled": false,
			"isActive": false,
			"webClipsList": [
				{
					url: "webclip/sketch-app",
					isSelected: true
				}
			]
		},
		{
			"appID": "vUf20tzQ4s.Karaoke",
			"isInstalled": false,
			"isActive": false,
			"webClipsList": [
				{
					url: "webclip/karaoke-app",
					isSelected: true
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
					isSelected: true
				},
				{
					url: "webclip/restaurant",
					isSelected: false
				}
			]
		},
		{
			"appID": "vUf18tzQ4s.YouTube",
			"isInstalled": false,
			"isActive": false,
			"webClipsList": [
				{
					url: "webclip/youtube",
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
					isSelected: false
				},
				{
					url: "webclip/weather",
					isSelected: false
				}
			]
		},
		{
			"appID": "vUf39tzQvi.Video",
			"isInstalled": false,
			"isActive": false,
			"webClipsList": [
				{
					url: "webclip/video-service",
					isSelected: true
				}
			]
		}],
		getAppsList = new Promise((resolve, reject) => {
			const requestURL = "api/register";

			fetch(requestURL)
				.then((response) => response.json())
				.then((response) => {
					addWSListener(response.data.wsPort);
					resolve(response.data.apps);
				})
				.catch((e) => {
					reject(e);
				})
		});


	homeApp = new HomeApp();

	prototype.createControlCard = function (data) {
		var controlCard = document.createElement("div"),
			title = document.createElement("span"),
			icon = document.createElement("div"),
			img = document.createElement("img"),
			a = document.createElement("a");

		controlCard.classList.add("ui-content-area");
		icon.classList.add("ui-icon");
		title.classList.add("ui-title");
		title.textContent = data.title;
		img.src = data.icon;
		a.href = data.href || "#next-control";
		a.setAttribute("data-style", "flat");
		a.setAttribute("data-inline", true);
		a.setAttribute("data-icon", "next");
		a.classList.add("ui-btn");

		icon.appendChild(img);

		controlCard.appendChild(icon);
		controlCard.appendChild(title);
		controlCard.appendChild(a);

		return controlCard;
	}

	prototype.addControlCard = function (data) {
		var controlCard = this.createControlCard(data),
			appBarElement = document.querySelector(".ui-page-active header"),
			appBar = tau.widget.Appbar(appBarElement);

		controlCard.setAttribute("data-title", data.title);

		appBar.addInstantContainer(controlCard);
	}

	prototype.removeControlCard = function (card) {
		var appBarElement = document.querySelector(".ui-page-active header"),
			appBar = tau.widget.Appbar(appBarElement);

		appBar.removeInstantContainer(card);
	}

	function updateAppsList(message) {
		if (message.type === "full") {
			return updateAppsListFull(message.data);
		} else if (message.type === "diff") {
			updateAppsListDiff(message.data);
			return true;
		} else {
			console.warn("app.js: unsupported type of applist.");
		}
		return false;
	}

	function updateAppsListDiff(apps) {
		apps.forEach(function (remoteApp) {
			if (remoteApp.action === "add") { // add (or update if app already added)
				const localApp = homeApp.appsList.filter(function (localApp) {
					return remoteApp.appID === localApp.appID;
				})[0];

				delete remoteApp.action;

				if (!localApp) { // add new
					homeApp.appsList.push(remoteApp);
				} else { // update local app
					/**
					 * @todo
					 * Which properties we need update
					 */
					localApp.isActive = remoteApp.isActive;
				}
			} else if (remoteApp.action === "remove") { // remove local app
				homeApp.appsList = homeApp.appsList.filter(function (localApp) {
					return remoteApp.appID !== localApp.appID;
				});
			} else {
				console.warn("Unsupported action:", remoteApp.action);
			}

		});

		updateOrderOfApplist();
	}

	function updateOrderOfApplist() {
		var change = false,
			currentOrder = "";

		currentOrder = homeApp.appsList.reduce(function (prev, app) {
			return prev + app.appID;
		}, "");

		// check apps order
		homeApp.appsList = homeApp.appsList.sort(function (app1, app2) {
			return (app1.isActive) ?
				(app2.isActive) ? 0 : -1 : 1
		});

		// order has been changed
		if (currentOrder !== homeApp.appsList.reduce(function (prev, app) {
			return prev + app.appID;
		}, "")) {
			change = true;
		}

		return change;
	}

	function updateAppsListFull(apps) {
		var change = false,
			appsCount = homeApp.appsList.length;

		// remove app from local apps list if not exists on remote host
		homeApp.appsList = homeApp.appsList.filter(function (localApp) {
			return apps.some(function (remoteApp) {
				return remoteApp.appID === localApp.appID;
			});
		});

		if (appsCount !== homeApp.appsList.length) {
			change = true;
		}

		// filter app which should be add to local apps list
		const added = apps.filter(function (remoteApp) {
			return !homeApp.appsList.some(function (localApp) {
				return localApp.appID === remoteApp.appID;
			});
		});

		if (added.length) {
			change = true;
		}

		// add apps to local apps list
		added.forEach(function (remoteApp) {
			homeApp.appsList.push(remoteApp);
		});

		// update active items
		homeApp.appsList.forEach(function (localApp) {
			apps.forEach(function (remoteApp) {
				if (remoteApp.appID === localApp.appID) {
					if (localApp.isActive !== remoteApp.isActive) {
						localApp.isActive = remoteApp.isActive;
						change = true;
					}
				}
			})
		});

		if (updateOrderOfApplist()) {
			change = true;
		}

		return change;
	}

	function onWSMessage(message) {
		const data = (typeof message.data === "string") ? JSON.parse(message.data) : message;

		socket.send(JSON.stringify({cmd: "echo"}));

		if (updateAppsList(data)) {
			tau.log("change");

			storage.refreshStorage(Storage.elements.APPSLIST, homeApp.appsList);

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

	async function getManifests() {
		const promisesList = [],
			indexesList = [];

		let	responses = [];

		homeApp.appsList.forEach(function (app, appIndex) {
			app.webClipsList.forEach(function (webClip, webClipIndex) {
				promisesList.push(
					fetch(webClip.url + "\\manifest.json")
				);
				indexesList.push({appIndex: appIndex, webClipIndex: webClipIndex});
			});
		});

		responses = await Promise.allSettled(promisesList);

		for (let responseIndex = 0; responseIndex < responses.length; responseIndex++) {
			const response = responses[responseIndex];

			if (response.status === "rejected" || !response.value.ok) {
				homeApp.appsList[indexesList[responseIndex].appIndex].webClipsList.splice(indexesList[responseIndex].webClipIndex, 1);
			} else {
				const contentPromise = await response.value.json();

				homeApp.appsList[indexesList[responseIndex].appIndex].webClipsList[indexesList[responseIndex].webClipIndex].manifest = contentPromise;
			}
		}
	}

	function changeTheme(event) {
		tau.theme.setTheme(event.target.value);
	}

	function onPopupSubmit() {
		homeApp.appsList.forEach(function (app) {
			app.webClipsList.forEach(function (webClip) {
				const webClipName = getWebClipNameFromUrl(webClip.url),
					checkbox = document.getElementById("popup-checkbox-" + webClipName);

				webClip.isSelected = checkbox.checked;
			})
		});
		storage.refreshStorage(Storage.elements.APPSLIST, homeApp.appsList);

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

	function createWebClipCard(webClip) {
		var card = document.createElement("div"),
			webClipUrl = webClip.url;

		// add slash for name of webClip
		if (!webClipUrl.match(/\/$/)) {
			webClipUrl += "/";
		}
		webClipUrl += "webclip.html";

		card.classList.add("ui-card");
		card.setAttribute("data-src", webClipUrl);

		return card;
	}

	function updateWebClipsUI() {
		var webclipsContainer = document.getElementById("web-clips"),
			// get Cards elements and convert NodeList to array
			currentWebClipsCards = [].slice.call(webclipsContainer.querySelectorAll(".ui-card[data-url],.ui-card[data-src]")),
			// list of webClips url in order
			webClipsUrlList = homeApp.appsList.reduce(function (prev, app) {
				return prev.concat(
					app.webClipsList.filter((webClip) => webClip.isSelected)
						.map((webClip) => webClip.url));
			}, []);

		// remove card
		currentWebClipsCards.forEach(function (card) {
			const found = webClipsUrlList.filter(function (webClipUrl) {
				return card.dataset.url && card.dataset.url.indexOf(webClipUrl) > -1 ||
					card.dataset.src && card.dataset.src.indexOf(webClipUrl) > -1;
			});

			// remove card from UI if not exists on list
			if (found.length === 0) {
				card.parentElement.removeChild(card);
			}
		});

		// add card
		homeApp.appsList.forEach(function (app) {
			app.webClipsList.forEach((webClip) => {
				const found = currentWebClipsCards.filter(function (card) {
					return card.dataset.url && card.dataset.url.indexOf(webClip.url) > -1 ||
						card.dataset.src && card.dataset.src.indexOf(webClip.url) > -1;
				});

				if (found.length === 0 &&
					webClip.manifest && webClip.manifest.cardType !== "control") {
					if (webClip.isSelected) {
						webclipsContainer.appendChild(
							createWebClipCard(webClip)
						);
					}
				}
			});
		});

		// set proper order of cards
		// @todo change inline styles to css class after merge HomeApp branches
		webclipsContainer.style.display = "flex";
		webclipsContainer.style.flexDirection = "column";
		currentWebClipsCards = [].slice.call(webclipsContainer.querySelectorAll(".ui-card[data-url],.ui-card[data-src]"));

		webClipsUrlList.forEach(function (url, order) {
			const card = currentWebClipsCards.filter(function (card) {
				return card.dataset.url && card.dataset.url.indexOf(url) > -1 ||
					card.dataset.src && card.dataset.src.indexOf(url) > -1;
			})[0];

			if (card) {
				card.style.order = order;
			}
		});

		// add/remove mini control cards
		homeApp.appsList.forEach(function (app) {
			app.webClipsList.forEach((webClip) => {
				if (webClip.manifest && webClip.manifest.cardType === "control") {
					if (webClip.isSelected) {
						if (!document.querySelector("[data-title='" + webClip.manifest.description + "']")) {
							homeApp.addControlCard({
								title: webClip.manifest.description,
								href: "#open-control-card",
								icon: "images/Icon.png"}
							);
						}
					} else if (document.querySelector("[data-title='" + webClip.manifest.description + "']")) {
						// remove mini controll card
						homeApp.removeControlCard(document.querySelector("[data-title='" + webClip.manifest.description + "']"));
					}
				}
			});
		});

		tau.engine.createWidgets(webclipsContainer);
	}

	//TODO: provide mechanism for getting web clip name from webClip meta data
	//		and separate from getting ID
	function getWebClipNameFromUrl(webClip) {
		// remove all text to the last \
		return webClip.replace(/.*\//, "");
	}

	function updateWebClipListPopup() {
		var popupList = document.getElementById("popup-list");

		// remove previous li items
		while (popupList.firstChild) {
			popupList.firstChild.remove()
		}

		homeApp.appsList.forEach(function (app) {
			app.webClipsList.forEach(function (webClip) {
				var li = document.createElement("li"),
					input = document.createElement("input"),
					label = document.createElement("label"),
					webClipName = getWebClipNameFromUrl(webClip.url);

				li.classList.add("ui-li-has-checkbox");
				li.classList.add("ui-group-index");

				input.setAttribute("type", "checkbox");
				input.setAttribute("id", "popup-checkbox-" + webClipName);

				label.setAttribute("for", "popup-checkbox-" + webClipName);
				label.classList.add("ui-li-text");
				label.innerHTML = webClip.manifest && webClip.manifest.description || webClipName;

				li.appendChild(input);
				li.appendChild(label);
				popupList.appendChild(li);
			});
		});

		tau.engine.createWidgets(popupList);

		homeApp.appsList.forEach(function (app) {
			app.webClipsList.forEach(function (webClip) {
				if (webClip.isSelected) {
					const webClipName = getWebClipNameFromUrl(webClip.url),
						checkbox = document.getElementById("popup-checkbox-" + webClipName);

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
		homeApp.appsList = storage.readAllFromStorage(Storage.elements.APPSLIST);

		// upate webclips from remote server
		getAppsList.then((apps) => {
			updateAppsListFull(apps);
		}).catch((e) => {
			console.warn("Error getting app lits: " + e.message);
			if (homeApp.appsList.length === 0) {
				updateAppsListFull(defaultList);
			}
		}).finally(() => {
			// check webclips access
			getManifests().then(() => {
				storage.refreshStorage(Storage.elements.APPSLIST, homeApp.appsList);
				updateWebClipsUI();
				updateWebClipListPopup();
			});
		});
	}

	function onPageBeforeShow(event) {
		if (event.target.id === "main") {
			init();
		}
	}

	document.addEventListener("pagebeforeshow", onPageBeforeShow);

	window.homeApp = homeApp;
}());