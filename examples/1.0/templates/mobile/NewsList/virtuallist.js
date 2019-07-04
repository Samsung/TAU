(function(pageId, listId, templateId, itemClass) {
	var page = document.getElementById(pageId),
		vlist;

	page.addEventListener("pageshow", function() {
		// Get HTML element reference
		var elList = document.getElementById(listId);

		// Initialize VirtualListview widget
		// As a options give the:
		// -length of the entries in data object
		// -number of rows which need to be cached
		// (this is a specially important when data object contains many rows)
		// length of the entries in data file
		vlist = tau.widget.VirtualListview(elList, {
			dataLength: JSON_DATA.length,
			bufferSize: 40
		});
		// Update list items
		// The attached callback is responsible for parsing and inserting HTML elements
		vlist.setListItemUpdater( function (listElement, newIndex) {
			var data = JSON_DATA[newIndex],
				template = document.getElementById(templateId).innerHTML;

			template = template.replace(/\$\{([\w]+)\}/ig, function (pattern, field) {
				return data[field];
			});

			listElement.innerHTML = template;
			if (Array.isArray(itemClass)) {
				itemClass.forEach(function(value) {
					listElement.classList.add(value);
				});
			} else {
				listElement.classList.add(itemClass);
			}
		});

		// Draw child elements
		vlist.draw();
	});

	// cleanup widget in order to avoid memory leak
	tau.event.one(page, "pagehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});
}(pageId, listId, templateId, itemClass));
