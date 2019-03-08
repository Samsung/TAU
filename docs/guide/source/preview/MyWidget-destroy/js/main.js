document.addEventListener("pageshow", function () {
	document.getElementById('destroy-button').addEventListener('vclick', function () {
		var widgetElement = document.getElementById("my-widget");
		tau.widget.MyWidget(widgetElement).destroy();
	});
});