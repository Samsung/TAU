module("jqm/events", {});

test ( "eventBlocker" , function () {
	var elem1 = document.getElementById("elem1"),
		elem2 = document.getElementById("elem2"),
		page = ej.engine.getBinding("test1");

	elem1.addEventListener("vclick", function () {elem1.classList.add("clicked");});
	elem2.addEventListener("vclick", function () {elem2.classList.add("clicked");});

	ej.event.trigger(elem1, "vclick");
	ok(elem1.classList.contains("clicked"), "vclick event was triggered");

	$.mobile.addEventBlocker();

	ej.event.trigger(elem2, "vclick");
	ok(!elem2.classList.contains("clicked"), "vclick event wasn't triggered after adding blocker");

	$.mobile.removeEventBlocker();

	ej.event.trigger(elem2, "vclick");
	ok(elem2.classList.contains("clicked"), "vclick event was triggered after removing blocker");
});
