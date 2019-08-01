/*global $ */
/*jslint unparam: true */

// request animation frame
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (animloop) {
			return window.setTimeout(animloop, 1000 / 60);
		};
}());

window.cancelRequestAnimFrame = (function () {
	return window.cancelAnimationFrame ||
		window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame ||
		window.oCancelRequestAnimationFrame ||
		window.msCancelRequestAnimationFrame ||
		clearTimeout;
}());

$(document).one("pagecreate", "#progressbar-demo", function () {
	var progressbarRunning;

	$("#progressbar-demo").on("pageshow", function () {

		$("#progressbarTest").on("vclick", function () {
			var request,
				i = 0;

			progressbarRunning = !progressbarRunning;

			// start and run the animloop
			(function animloop() {
				if (!progressbarRunning) {
					window.cancelRequestAnimFrame(request);
					return;
				}

				$("#progressbar").progressbar("value", i++);

				request = window.requestAnimFrame(animloop);

				if (i > 100) {
					window.cancelRequestAnimFrame(request);
				}
			}());
		});

		$("#pending").progress("running", true);
		$("#progressing").progress("running", true);

		$("#pendingTest").on("vclick", function () {
			var running = $("#pending").progress("running");
			// start/stop progressing animation

			$("#pending").progress("running", !running);
		});

		$("#progressingTest").on("vclick", function () {
			var running = $("#progressing").progress("running");
			// start/stop progressing animation

			$("#progressing").progress("running", !running);

			if (running) {
				$("#progressing").progress("running", false);
			}
		});
	});

	$("#progressbar-demo").on("pagehide", function () {
		progressbarRunning = false;
		$("#pending").progress("running", false);
		$("#progressing").progress("running", false);
	});
});
