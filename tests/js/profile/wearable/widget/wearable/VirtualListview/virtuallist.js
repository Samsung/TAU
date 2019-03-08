/* global tau, JSON_DATA */
window.addEventListener("load", function() {
	var listElement = document.getElementById("vlist1"),
		config = {
			//Declare total number of items
			dataLength: JSON_DATA.length,
			//Set buffer size
			bufferSize: 100
		},
		virtualList = tau.widget.VirtualListview(listElement, config);

	// Update listitem
	virtualList.setListItemUpdater(function(listElementItem, newIndex) {
		//TODO: Update listitem here
		var data =  JSON_DATA[newIndex];
		listElementItem.classList.add("ui-li-1line-bigicon5");
		listElementItem.innerHTML = "<a><span class='ui-li-text-main' style='overflow:hidden; white-space:nowrap'>" + data.NAME+"</span>" +
			"<div data-role='button' data-inline='true' data-icon='plus' data-style='box'></div></a>";
	});
	// Draw child elements
	virtualList.draw();
});
