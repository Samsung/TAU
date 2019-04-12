/* global module, test, ok, equal, tau */
module("profile/wearable/widget/wearable/CircleProgressBar", {
	teardown: function () {
		tau.engine._clearBindings();
	}
});

test("simple CircleProgressbar test", 3, function () {
	var progressBar = document.getElementById("circleprogress"),
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar),
		progressContainer = progressBar.parentElement;

	ok(progressContainer.classList.contains("ui-progressbar"),
		"container of CircleProgressBar has ui-progressbar classname");
	equal(progressBarWidget.option("size"), "medium", "Default size of CircleProgressBar is medium");
	equal(progressBarWidget.value(), progressBar.getAttribute("value") / progressBar.getAttribute("max") * 100, "Value of CircleProgressBar is equal with percent value from defined values")

	progressBarWidget.destroy();
});

test("CircleProgressbar with options", 5, function () {
	var progressBar = document.getElementById("circleprogress"),
		options = {
			thickness: 30,
			size: "full",
			containerClassName: "ui-test-class",
			endPoint: true,
			pressed: true},
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, options),
		progressContainer = progressBar.parentElement;

	equal(progressBarWidget.option("thickness"), options.thickness, "Progress Size is defined " + options.thickness);
	equal(progressBarWidget.option("size"), options.size, "Progress Size is defined " + options.size);
	ok(progressContainer.classList.contains("ui-test-class"), "Custom classname of container is defined");
	ok(progressBarWidget._ui.endPoint.classList.contains("ui-progressbar-end-point-active"),
		"Custom classname of widget end point is defined");
	ok(progressBarWidget._ui.endPoint.classList.contains("ui-progressbar-end-point-pressed"),
		"Custom classname of widget end point is defined");

	progressBarWidget.destroy();
});

test("value method of CircleProgressbar", 5, function () {
	var progressBar = document.getElementById("circleprogress"),
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "full"});

	equal(progressBarWidget.value(), 20, "progress value check");
	progressBarWidget.value(50);
	equal(progressBarWidget.value(), 50, "progress value check");
	progressBarWidget.value(100);
	equal(progressBarWidget.value(), 100, "progress value check");
	progressBarWidget.value(150);
	equal(progressBarWidget.value(), 100, "progress value(with over-value) check");
	progressBarWidget.value(-20);
	equal(progressBarWidget.value(), 0, "progress value(with over-value) check");
	progressBarWidget.destroy();
});
