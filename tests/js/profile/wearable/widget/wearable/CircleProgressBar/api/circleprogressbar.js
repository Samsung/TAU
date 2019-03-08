/* global test, equal, tau */
(function (ns) {
    module("profile/wearable/widget/wearable/CircleProgressBar/api/circleprogressbar");test("API of CircleProgressBar Widget", function () {
        var widget, circleProgress;
        equal(typeof ns, "object", "Class tau exists");
        equal(typeof ns.widget, "object", "Class tau.widget exists");
        equal(typeof ns.widget.wearable, "object", "Class tau.widget.wearable exists");
        equal(typeof ns.widget.wearable.CircleProgressBar, "function", "Class tau.widget.wearable.CircleProgressBar exists");

		widget = ns.engine.instanceWidget(document.getElementById("circleprogress"), "CircleProgressBar");
		circleProgress = ns.widget.wearable.CircleProgressBar;

		equal(typeof widget.configure, "function", "Method CircleProgressBar.configure exists");
		equal(typeof widget.build, "function", "Method CircleProgressBar.build exists");
		equal(typeof widget.init, "function", "Method CircleProgressBar.init exists");
		equal(typeof widget.destroy, "function", "Method CircleProgressBar.destroy exists");
		equal(typeof widget.refresh, "function", "Method CircleProgressBar.refresh exists");
		equal(typeof widget.option, "function", "Method CircleProgressBar.option exists");
		equal(typeof widget._setValue, "function", "Method CircleProgressBar._setValue exists");
		equal(typeof widget._getValue, "function", "Method CircleProgressBar._getValue exists");

		equal(typeof widget.options, "object", "Property CircleProgressBar.options exists");
		equal(typeof circleProgress.classes, "object", "Property CircleProgressBar.classes exists");
	});
}(tau));