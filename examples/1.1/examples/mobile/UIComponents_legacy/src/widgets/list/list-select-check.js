/*global tau */
/* eslint no-unused-vars: off */
var checkboxWidgets = [
	tau.widget.Checkboxradio(document.getElementsByName("select-check1")[0]),
	tau.widget.Checkboxradio(document.getElementsByName("select-check2")[0]),
	tau.widget.Checkboxradio(document.getElementsByName("select-check3")[0])
];

function checkAllCheckbox(allChecked) {
	var len = checkboxWidgets.length,
		i;

	for (i = 0; i < len; i++) {
		checkboxWidgets[i].element.checked = !allChecked;
		checkboxWidgets[i].refresh();
	}
}

function checkAll() {
	var allChecked = watchCheckboxes();

	checkAllCheckbox(allChecked);
}

function watchCheckboxes() {
	"use strict";
	var allSelected = true,
		i = checkboxWidgets.length - 1;

	while (i >= 0 && allSelected) {
		allSelected = checkboxWidgets[i].value() !== null;
		i--;
	}

	return allSelected;
}