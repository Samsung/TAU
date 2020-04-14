/*global tau*/
(function () {
	var page = document.getElementById("static-graph-page"),
		garphEl = document.getElementById("graph"),
		titleMarquee = page.querySelector("header .ui-marquee"),
		graphWidget,
		marquee;

	page.addEventListener("pagebeforeshow", function () {
		graphWidget = tau.widget.Graph(garphEl);
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
		graphWidget.destroy();
		marquee.destroy();
	});
})();