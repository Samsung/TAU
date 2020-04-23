/*global tau */
(function () {
	var page = document.getElementById("page-text-input"),
		inputName = page.querySelector("input[name=\"name\"]"),
		inputPhone = page.querySelector("input[name=\"phonenumber\"]"),
		inputPhone2 = page.querySelector("input[name=\"phonenumber2\"]"),
		saveButton = page.querySelector(".ui-btn"),
		nameWidget,
		phoneWidget,
		phone2Widget;

	function init() {
		nameWidget = tau.widget.TextInput(inputName);
		phoneWidget = tau.widget.TextInput(inputPhone);
		phone2Widget = tau.widget.TextInput(inputPhone2);
		saveButton.addEventListener("vclick", saveData);

		inputName.value = window.sessionStorage.getItem("name");
		inputPhone.value = window.sessionStorage.getItem("phone1");
		inputPhone2.value = window.sessionStorage.getItem("phone2");
	}

	function saveData() {
		window.sessionStorage.setItem("name", inputName.value);
		window.sessionStorage.setItem("phone1", inputPhone.value);
		window.sessionStorage.setItem("phone2", inputPhone2.value);
		tau.back();
	}

	function destroy() {
		nameWidget.destroy();
		phoneWidget.destroy();
		phone2Widget.destroy();
		saveButton.removeEventListener("vclick", saveData);
	}

	page.addEventListener("pagebeforeshow", init);
	page.addEventListener("pagehide", destroy);
}());
