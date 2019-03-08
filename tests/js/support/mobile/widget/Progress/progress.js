$().ready(function() {
	module("support/mobile/widget/Progress", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "Progress pending style support", function () {
		var progressPending = document.getElementById("pending");

		ok(progressPending.classList.contains("ui-progress"), "progress support ok");
		ok(progressPending.classList.contains("ui-progress-pending-running"), "progress support class ok");
		ok(progressPending.classList.contains("ui-activity-bar"), 'Activity style has been created');

		var progressCircle = document.getElementById("circle");

		ok(progressCircle.classList.contains("ui-progress"), "progress support ok");
		ok(progressCircle.classList.contains("ui-progress-pending-running"), "progress support class ok");
		ok(progressCircle.classList.contains("ui-activity-circle"), 'Activitycircle style has been created');

		var widget = tau.widget.Progress(document.getElementById("test"));

		equal(typeof widget.running, 'function', 'Method running exists');
		equal(typeof widget.show, 'function', 'Method show exists');
		equal(typeof widget.hide, 'function', 'Method hide exists');
	});
});
