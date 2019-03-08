/*jslint unparam: true */
(function () {
	var page = document.getElementById("page_webkitui");

	page.addEventListener("pagecreate", function () {
		var btn = document.getElementById("button_webkitui_hiddendateopener"),
			itime = document.getElementById("input_webkitui_hiddentime"),
			val = document.getElementById("webkitui_hiddentime_value");

		btn.addEventListener("click", function () {
			itime.click();
		});
		itime.addEventListener("change", function () {
			val.innerText = itime.value;
		});
	});

}());