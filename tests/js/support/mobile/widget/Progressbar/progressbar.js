$().ready(function() {
	module("support/mobile/widget/Progressbar", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "Progressbar progressbar style", function () {
		var progressBar = document.getElementById("progressBar"),
			progressBarWidget = tau.widget.ProgressBar(progressBar);

		ok(progressBar.classList.contains("ui-progressbar"), 'Progressbar has ui-progressbar class');
		equal(progressBar.getAttribute("aria-valuemin"), 0, 'progressbar has aria tag' );
		equal(progressBar.getAttribute("aria-valuenow"), 0, 'progressbar has aria tag' );
		equal(progressBar.getAttribute("aria-valuemax"), 100, 'progressbar has aria tag' );
		equal(progressBarWidget.option("value"), 0, 'progressbar option check');
		ok(progressBar.children[0].classList.contains("ui-progressbar-bg"), 'progressbar has bg node');
		ok(progressBar.children[0].children[0].classList.contains("ui-progressbar-value"), 'progressbar bg has value node');
	});
});
