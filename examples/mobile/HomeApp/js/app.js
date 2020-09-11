(function () {
	"use strict";
	var tau = window.tau,

		webClipList = [],
		activeWebClipList = [
			"webclip/tv-remote-control",
			"webclip/restaurant",
			"webclip/weather"
		];

	function changeTheme(event) {
		tau.theme.setTheme(event.target.value);
	}

	function loadWebClipList() {
		const requestURL = "api/webcliplist";

		fetch(requestURL)
			.then((response) => response.json())
			.then((data) => {
				webClipList = data;
			})
			.catch(() => {
				// use default webclip list is sth wrong
				webClipList =
					[
						"webclip/tv-remote-control",
						"webclip/restaurant",
						"webclip/weather",
						"webclip/apps-on-tv",
						"webclip/latest-news",
						"webclip/now-on-tv"
					]
			})
			.finally(() => {
				// make sure that default active webclip list contains only available elements
				activeWebClipList = activeWebClipList.filter(function (webClip) {
					return webClipList.includes(webClip);
				})
				updateWebClipsUI();
				updateWebClipListPopup();
			});
	}

	function onPopupSubmit() {

		activeWebClipList = [];
		webClipList.forEach(function (webclip) {
			const webClipName = getWebClipName(webclip),
				checkbox = document.querySelector("#" + webClipName);

			if (checkbox.checked) {
				activeWebClipList.push(webclip)
			}
		})
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

		// add new
		activeWebClipList.forEach(function (webclip) {
			var card = document.createElement("div");

			// add slash for name of webClip
			if (!webclip.match(/\/$/)) {
				webclip += "/";
			}
			webclip += "webclip.html";

			card.classList.add("ui-card");
			card.setAttribute("data-src", webclip);

			webclipsContainer.appendChild(card);
		});

		tau.engine.createWidgets(webclipsContainer);
	}

	//TODO: provide mechanism for getting web clip name from webClip meta data
	//		and separate from getting ID
	function getWebClipName(webClip) {
		webClip = webClip.replace("webclip/", "").replace("/", "");
		return webClip;
	}

	function updateWebClipListPopup() {

		var popupList = document.getElementById("popup-list");

		// remove previous
		popupList.childNodes.forEach(function (li) {
			popupList.removeChild(li);
		});

		webClipList.forEach(function (webclip) {
			var li = document.createElement("li"),
				input = document.createElement("input"),
				label = document.createElement("label"),
				webClipName = getWebClipName(webclip);

			li.classList.add("ui-li-has-checkbox");
			li.classList.add("ui-group-index");

			input.setAttribute("type", "checkbox");
			input.setAttribute("id", webClipName);

			label.setAttribute("for", "latest-news-ckeck");
			label.classList.add("ui-li-text");
			label.innerHTML = webClipName;


			li.appendChild(input);
			li.appendChild(label);
			popupList.appendChild(li);
		});
		tau.engine.createWidgets(popupList);
		webClipList.forEach(function (webclip) {

			if (activeWebClipList.includes(webclip)) {
				const webClipName = getWebClipName(webclip),
					checkbox = document.querySelector("#" + webClipName);

				if (checkbox) {
					checkbox.checked = true;
				}
			}
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

		loadWebClipList();
	}

	function onPageBeforeShow(event) {
		if (event.target.id === "main") {
			init();
		}
	}

	document.addEventListener("pagebeforeshow", onPageBeforeShow);
}());