/* global module, test, ok, equal, tau */
module("Slider tests (circular)", {
	setup: function () {
		tau.support.shape.circle = true;
	},
	teardown: function () {
		tau.engine._clearBindings();
		tau.support.shape.circle = false;
	}
});

test("simple Slider test", 3, function () {
	var progressBar = document.getElementById("slider"),
		sliderWidget = new tau.widget.Slider(progressBar),
		sliderContainer = progressBar.parentElement;

	ok(sliderContainer.classList.contains("ui-progressbar"), "container of Slider has ui-progressbar classname");
	equal(sliderWidget.option("size"), "full", "Default size of Slider is full");
	equal(sliderWidget.value(), progressBar.getAttribute("value"), "Value of Slider is equal with percent value from defined values");

	sliderWidget.destroy();

});

test("Slider with options", 6, function () {
	var progressBar = document.getElementById("slider"),
		options = {
			thickness: 30,
			size: "full",
			containerClassName: "ui-test-class",
			margin: 10,
			endPoint: false,
			bgcolor: "red"},
		progressBarWidget = new tau.widget.Slider(progressBar, options),
		progressContainer = progressBar.parentElement;

	equal(progressBarWidget.option("thickness"), options.thickness, "Progress Thickness is defined " + options.thickness);
	equal(progressBarWidget.option("size"), options.size, "Progress Size is defined " + options.size);
	equal(progressBarWidget.option("margin"), options.margin, "Progress Margin is defined " + options.margin);
	equal(progressBarWidget.option("endPoint"), options.endPoint, "Progress End Point is defined " + options.endPoint);
	equal(progressBarWidget.option("bgcolor"), options.bgcolor, "Progress Background Color is defined " + options.bgcolor);
	ok(progressContainer.classList.contains("ui-test-class"), "Custom classname of container is defined");

	progressBarWidget.destroy();
});

test("value method of Slider", 5, function () {
	var progressBar = document.getElementById("slider"),
		slider = new tau.widget.Slider(progressBar, {size: "full"});

	equal(slider.value(), 50, "progress value check");
	slider.value(50);
	equal(slider.value(), 50, "progress value check");
	slider.value(100);
	equal(slider.value(), 100, "progress value check");
	slider.value(150);
	equal(slider.value(), 100, "progress value(with over-value) check");
	slider.value(-20);
	equal(slider.value(), 0, "progress value(with over-value) check");
	slider.destroy();
});

test("Slider getContainer method", 4, function () {
	var progressBar = document.getElementById("slider"),
		slider = new tau.widget.Slider(progressBar, {type: "circle"}),
		sliderContainer;

	sliderContainer = slider.getContainer();

	ok(sliderContainer instanceof HTMLElement, "Slider.getContainer returns HTMLElement");
	equal(sliderContainer.tagName, "DIV", "Container is div element");
	ok(sliderContainer !== progressBar, "Container element is different than original input element");
	ok(sliderContainer.classList.contains("ui-progressbar"), "Slider container has ui-progressbar class");

	slider.destroy();
});