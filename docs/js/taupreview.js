/*global window, console */
/*jslint browser: true, plusplus: true */
(function (document) {
	"use strict";
	var previewIDNum = 0,
		webkit = window.navigator.userAgent.toLowerCase().indexOf("webkit") > -1,
		TEXTS = {
			"PREVIEW": "preview",
			"mobile": "Preview mobile version",
			"tv": "Preview tv version",
			"wearable": "Preview wearable version"
		},
		previewWindows = {
			"wearable": null,
			"mobile": null,
			"tv": null
		},
		windowOptions = {
			"wearable": "height=320,width=320,menubar=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no",
			"mobile": "height=800,width=480,menubar=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no",
			"tv": "height=540,width=960,menubar=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no"
		},
		LANG_SPLIT_REGEXP = /\-(mobile|wearable|tv)(\(([^\)]+)\))?/mgi,
		prettyPrint = window.prettyPrint;

	function buttonHandler(event) {
		var target = event.target,
			type = target.getAttribute("data-type"),
			url = target.getAttribute("data-url") || type,
			previewID = target.getAttribute("data-preview"),
			preview = document.querySelector("code[data-preview=p" + previewID + "]"),
			pwindow = previewWindows[type];

		if (pwindow) {
			pwindow.close();
		}

		pwindow = window.open("preview/" + url + ".html", "", windowOptions[type]);

		pwindow.addEventListener("load", function () {
			try {
				if (type === url) {
					this.loadExample(preview.textContent);
				}
			} catch (e) {
				window.alert("Problem rendering preview");
			}
		});

		previewWindows[type] = pwindow;

		event.stopPropagation();
		event.preventDefault();

		return true;
	}

	function clickHandler(event) {
		if (event.target && event.target.classList.contains("preview_button")) {
			return buttonHandler(event);
		}
		return false;
	}

	function createButton(container, type, previewID, title, url) {
		var button = document.createElement("a");
		button.setAttribute("class", "preview_button preview_" + type);
		button.setAttribute("data-type", type);
		if (url) {
			button.setAttribute("data-url", url.replace(/[\(\)]|(.html)/g, ""));
		}
		button.setAttribute("data-preview", previewID);
		button.setAttribute("title", title);

		container.appendChild(button);
	}

	function createButtons() {
		var previews = document.querySelectorAll("pre > code"),
			i = previews.length,
			found,
			preview,
			className,
			buttonContainer,
			parent,
			nextSibling,
			span,
			profileUrl,
			profile,
			regexpCallback = function (unused, profile, url) {
				profileUrl[profile] = url;
				return '';
			};

		while (--i >= 0) {
			found = 0;
			profileUrl = {};
			preview = previews.item(i);
			className = preview.className;
			className.replace(
				LANG_SPLIT_REGEXP,
				regexpCallback
			);
			preview.setAttribute("data-preview", "p" + previewIDNum);

			parent = preview.parentNode;
			nextSibling = preview.nextSibling;

			buttonContainer = document.createElement("div");
			buttonContainer.setAttribute("class", "preview_buttons");

			span = document.createElement("span");
			span.textContent = TEXTS.PREVIEW;

			buttonContainer.appendChild(span);

			for (profile in profileUrl) {
				if (profileUrl.hasOwnProperty(profile)) {
					createButton(
						buttonContainer,
						profile,
						previewIDNum,
						TEXTS[profile],
						profileUrl[profile]
					);
				}
				++found;
			}

			if (found > 0) {
				if (nextSibling) {
					parent.insertBefore(buttonContainer, nextSibling);
				} else {
					parent.appendChild(buttonContainer);
				}
			}

			previewIDNum++;
		}
	}

	function prettyPrintHandler() {
		var codes = document.querySelectorAll("pre > code"),
			i = codes.length,
			code;
		while (--i >= 0) {
			code = codes[i];
			if (code.className.match(/lang-js|lang-javascript/)) {
				code.className = "lang-js prettyprint";
			} else {
				code.className = "lang-html prettyprint";
			}
		}
		if (prettyPrint) {
			prettyPrint();
		}
	}

	document.addEventListener("DOMContentLoaded", function () {
		if (webkit) {
			createButtons();
		}
		prettyPrintHandler();
	});
	document.addEventListener("click", clickHandler);
}(window.document));
