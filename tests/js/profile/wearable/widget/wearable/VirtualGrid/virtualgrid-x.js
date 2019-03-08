/* global JSON_DATA, tau */
(function () {
	"use strict";

	window.addEventListener("load", function () {
		var elGrid = document.getElementById("vgrid2"),
			config = {
				//Declare total number of items
				dataLength: JSON_DATA.length,
				//Set buffer size
				bufferSize: 40,
				orientation: "x"
			},
			vGrid = tau.widget.VirtualGrid(elGrid, config);

		// Update listitem
		vGrid.setListItemUpdater(function (elItem, newIndex) {
			//TODO: Update listitem here
			var data = JSON_DATA[newIndex];

			elItem.innerHTML = "<a><div class='ui-demo-rotation-namecard'>" +
			"<div class='ui-demo-namecard-pic'>" +
			"</div>" +
			"<div class='ui-demo-namecard-contents'>" +
			"<span class='name ui-li-text-main'>" + data.NAME + "</span>" +
			"</div>" +
			"</div></a>";
		});
		// Draw child elements
		vGrid.draw();
	}, false);
}());
