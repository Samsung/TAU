/*global tau, JSON_DATA*/
(function () {
	var page = document.getElementById("virtualgrid_normal_page"),
		vgrid;

	page.addEventListener("pageshow", function () {
		var gridElement = document.getElementById("virtualgrid-demo");

		if (gridElement) {
			vgrid = tau.widget.VirtualGrid(gridElement);
			vgrid.option({
				numItemData: JSON_DATA.length,
				listItemUpdater: function (gridElementItem, newIndex) {
					var data = JSON_DATA[newIndex];

					gridElementItem.innerHTML = "<div class=\"ui-demo-rotation-namecard " + data.ID + "\">" +
						"<div class=\"ui-demo-namecard-pic\">" +
							"<img class=\"ui-demo-namecard-pic-img\" src=\"" + data.TEAM_LOGO + "\"/>" +
						"</div>" +
						"<div class=\"ui-demo-namecard-contents\">" +
							"<span class=\"name ui-li-text-main\">" + data.NAME + "</span>" +
						"</div></div>";
				}
			});
			// Create widget
			vgrid.create();
		}
	});
	page.addEventListener("pagehide", function () {
		// Remove all children in the vgrid
		if (vgrid) {
			vgrid.destroy();
		}
	});
}());