module("ej.jqm.events", {});

asyncTest ( "swiepe events", function () {
	var elem1 = document.getElementById("elem1"),
		elem2 = document.getElementById("elem2");
	expect(2);

	elem1.addEventListener("swipeleft", function () {
		ok('swipeleft');
	}, false);
	elem2.addEventListener("swiperight", function () {
		ok('swiperight');
		start();
	}, false);

	$(elem1).trigger("swipeleft");
	$(elem2).trigger("swiperight");
});
