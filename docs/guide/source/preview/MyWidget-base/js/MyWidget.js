/*global window*/
document.addEventListener("tauinit", function (event) {
	"use strict";
	var tau = event.detail.tau,
		MyWidget = function () {
			// constructor for every instance
		};

	// All widgets have to have the widget's prototype
	MyWidget.prototype = new tau.widget.BaseWidget();

	tau.engine.defineWidget(
		"MyWidget",     // widget's name
		".my-widget",   // widget's selector
		[],             // jquery public methods
		MyWidget        // constructor
	);
});
