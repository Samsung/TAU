$().ready(function() {
	module("profile/mobile/widget/mobile/DropdownMenu", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test ( "DropdownMenu" , function () {
		var selectTag = document.getElementById("select"),
			id = selectTag.id,
			placeHolder = document.getElementById(id+"-placeholder"),
			options = document.getElementById(id+"-options"),
			wrapper = document.getElementById(id+"-dropdownmenu"),
			screenFilter = document.getElementById(id+"-overlay");

		ok(wrapper.classList.contains("ui-dropdownmenu"), 'SelectMenu wrapper has ui-dropdownmenu class');
		ok(placeHolder.classList.contains("ui-dropdownmenu-placeholder"), "Placeholder has ui-dropdownmenu-placeholder class");
		ok(options.classList.contains("ui-dropdownmenu-options"), "Options container has ui-dropdownmenu-options class");
		ok(screenFilter.classList.contains("ui-dropdownmenu-overlay"), "Screen Filter has ui-dropdownmenu-overlay class");
	});
});
