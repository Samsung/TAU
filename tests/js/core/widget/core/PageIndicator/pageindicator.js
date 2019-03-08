/* global test, ok, equal, tau, helpers, ns */
module("tau.widget.core.PageIndicator");

function checkMarkUp(widget) {
	var i,
		element = widget.element,
		len = element.children.length;

	ok(element.classList.contains("ui-page-indicator"), "PageIndicator has ui-page-indicator class");

	for (i = 0; i < len; i++) {
		ok(element.children[i].classList.contains("ui-page-indicator-item"), "Dot has ui-page-indicator-item class");
	}
}

(function () {
	var pageWidget = document.getElementById("pageIndicatorPage"),
		helpers = window.helpers,
		page = new tau.widget.Page(),
		pos,
		i;

	test("tau.widget.core.PageIndicator Test - style=dashed and layout=circular", function () {
		var elPageIndicator1 = document.getElementById("pageIndicator1"),
			pageIndicator1 = tau.widget.PageIndicator(elPageIndicator1);

		// # of pages < maximum # of dots
		checkMarkUp(pageIndicator1);
		for (i = 0; i < 3; i++) {
			pageIndicator1.setActive(i);
			ok(elPageIndicator1.children[i].classList.contains("ui-page-indicator-active"), "corresponding dash is active");
		}
		equal(elPageIndicator1.children.length, pageIndicator1.options.numberOfPages, "ok");

		pageIndicator1.refresh();
	});

	test("tau.widget.core.PageIndicator Test - style=dotted and layout=linear", function () {
		var elPageIndicator2 = document.getElementById("pageIndicator2"),
			pageIndicator2 = tau.widget.PageIndicator(elPageIndicator2);

		// # of pages > maximum # of dots
		checkMarkUp(pageIndicator2);
		for (i = 0; i < 10; i++) {
			pos = 0;
			pageIndicator2.setActive(i);
			if (i < 3) {
				pos = i;
			} else if (i >= 3 && i < 8) {
				pos = 2;
			} else {
				pos = i - 5;
			}
			ok(elPageIndicator2.children[pos].classList.contains("ui-page-indicator-active"), "corresponding dot is active");
		}
		equal(elPageIndicator2.children.length, pageIndicator2._getMaxPage(), "ok");

		pageIndicator2.setActive();
		ok(pageIndicator2.element.childElementCount > 0, 'there are some elements');
		pageIndicator2.destroy();
		ok(pageIndicator2.element.childElementCount === 0, 'children are cleared');
	});

	test("tau.widget.core.PageIndicator Test - without number of pages", 2, function () {
		var elPageIndicator3 = document.getElementById("pageIndicator3");

		helpers.stub(tau, "error", function() {
			ok(true, "error was thrown");
		});
		pageIndicator3 = tau.widget.PageIndicator(elPageIndicator3);
		pageIndicator3.setActive(1);
		helpers.restoreStub(tau, "error");
	});

	test("tau.widget.core.PageIndicator Test - with 0 number of pages", function () {
		var elPageIndicator4 = document.getElementById("pageIndicator4"),
			pageIndicator4 = tau.widget.PageIndicator(elPageIndicator4);

		ok(pageIndicator4.element.childElementCount === 0, 'there is zero children');
		pageIndicator4.setActive(1);
	});
}());
