/*global tau,JSON_DATA,pageId,listId,templateId,itemClass */
/*jslint unparam: true */
(function (pageId, listId, templateId, itemClass) {
	var page = document.getElementById(pageId),
		vlist;

	tau.event.one(page, "pageshow", function () {
		var elList = document.getElementById(listId);

		vlist = tau.widget.VirtualListview(elList, {
			dataLength: JSON_DATA.length,
			bufferSize: 40,
			listItemUpdater: function (listElement, newIndex) {
				var template = document.getElementById(templateId).innerHTML;

				template = template.replace(/\$\{([\w]+)\}/ig, function (pattern, field) {
					return JSON_DATA[newIndex][field];
				});

				listElement.classList.add(itemClass);
				listElement.innerHTML = template;
			}
		});
		// Draw child elements
		vlist.draw();
	});

	tau.event.one(page, "pagebeforehide", function () {
		// Remove all children in the vlist
		vlist.destroy();
	});
}(pageId, listId, templateId, itemClass));