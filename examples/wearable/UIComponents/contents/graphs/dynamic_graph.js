/*global tau*/
(function () {
	var page = document.getElementById("dynamic-graph-page"),
		garphEl = document.getElementById("graph"),
		buttonEl = document.getElementById("button"),
		titleMarquee = page.querySelector("header .ui-marquee"),
		graphWidget,
		buttonWidget,
		marquee,
		generatingData = false,
		intervalId;

	function addSample() {
		graphWidget.value(Math.random() * 20);
	}

	page.addEventListener("pagebeforeshow", function () {
		graphWidget = tau.widget.Graph(garphEl);
		buttonWidget = tau.widget.Button(buttonEl);

		buttonEl.addEventListener("click", function () {
			generatingData = !generatingData;
			if (generatingData) {
				buttonWidget.value("Stop");
				intervalId = window.setInterval(addSample, 1000);
			} else {
				buttonWidget.value("Start");
				window.clearInterval(intervalId);
			}
		});
	});

	page.addEventListener("pageshow", function () {
		marquee = tau.widget.Marquee(titleMarquee, {
			iteration: "infinite",
			marqueeStyle: "scroll",
			ellipsisEffect: "none",
			speed: 40,
			delay: 1000
		});
	});

	page.addEventListener("pagebeforehide", function () {
		if (generatingData) {
			window.clearInterval(intervalId);
		}
		graphWidget.destroy();
		buttonWidget.destroy();
		marquee.destroy();
	});
})();