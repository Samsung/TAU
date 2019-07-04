/*global $,tau,JSON_DATA*/
/*jslint unparam: true */
$("#genlist_extendable_normal_page").one("pagecreate", function () {
	/*?_=ts code for no cache mechanism*/
	$.getScript("./virtuallist-db-demo.js", function () {
		var config = {
				//Declare total number of items
			dataLength: JSON_DATA.length,
				//Set buffer size
			bufferSize: 50,
			// Set list item updater
			listItemUpdater: function (processedIndex, listItem) {
					//TODO: Update listitem here
				var data = JSON_DATA[processedIndex];

				listItem.innerHTML = "<span class=\"ui-li-text-main\">" + data.NAME + "</span>";
			},
			listItemLoader: function (elListItem, numMoreItems) {
					// @TODO tau._export should not be used in application development,
					// @TODO but it's currently the only way of fixing this issue

				var loader = document.getElementById("extendableListButton");

				if (!loader) {
					loader = document.createElement("div");
					loader.id = "extendableListButton";
					elListItem.appendChild(loader);

				}
				loader = tau.widget.Button(loader);
					// @TODO: quick fix for button, please fix button widget
				loader.element.innerHTML = "Load " + numMoreItems + " more items";
					// loader.option('value', 'Load ' + numMoreItems + ' more items');
			}
		};

		$("ul.ui-extendable-list-container").extendablelist("create", config);
	});
});