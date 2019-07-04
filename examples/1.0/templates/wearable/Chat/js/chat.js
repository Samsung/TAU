document.addEventListener("DOMContentLoaded", function() {
	"use strict";

	var page = document.getElementById("one"),
		classes = ["ui-li-static", "li-has-multiline", "li-dialog"],
		vlist;

	function initVirtuallist(data, listId, templateId, itemClasses) {
		// Get HTML element reference
		var elList = document.getElementById(listId);

		// create virtuallist widget
		vlist = tau.widget.VirtualListview(elList, {
			dataLength: data.length,
			bufferSize: 40
		});

		// Update list items
		// The attached callback is responsible for parsing and inserting HTML elements
		vlist.setListItemUpdater( function (listElement, newIndex) {
			var template = document.getElementById(templateId).innerHTML,
				dataItem = data[newIndex];

			template = template.replace(/\$\{([\w]+)\}/ig, function (pattern, field) {
				return dataItem[field];
			});

			listElement.innerHTML = template;

			listElement.setAttribute("class", itemClasses);
			listElement.classList.add(
				(dataItem["FROM"] === "<Me>") ?
					"li-dialog-left" :
					"li-dialog-right"
			);
		});

		// Draw child elements
		vlist.draw();
	}

	page.addEventListener("pageshow", function () {
		initVirtuallist(JSON_DATA, "virtuallist-chat", "chat-template", classes.join(" "));
	});

	// cleanup widget in order to avoid memory leak
	tau.event.one(page, "pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});
});