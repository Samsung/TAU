module("core/router/Router");

asyncTest('By default first page is active', 3, function () {
	function checkFirstPage () {
		var page = document.getElementById('first');
		equal(page.getAttribute('data-tau-bound'), "Page", 'First page is enhanced');
		ok(page.classList.contains('ui-page-active'), 'First page is active');
		equal(document.querySelectorAll('[data-role="page"].ui-page-active').length, 1, 'Only one page is active');
		document.body.removeEventListener('pagechange', checkFirstPage);
		start();
	}

	document.body.addEventListener('pagechange', checkFirstPage);
	ej.engine.run();
});

asyncTest('Engine.changePage', 3, function () {
	var page = document.getElementById('second');
	function checkFirstPage () {
		equal(page.getAttribute('data-tau-bound'), "Page", 'First page is enhanced');
		ok(page.classList.contains('ui-page-active'), 'First page is active');
		equal(document.querySelectorAll('[data-role="page"].ui-page-active').length, 1, 'Only one page is active');
		document.body.removeEventListener('pagechange', checkFirstPage);
		start();
	}
	document.body.addEventListener('pagechange', checkFirstPage);
	ej.engine.getRouter().open(page);
});

asyncTest('Location.hash changes page which is loaded first', 3, function () {
	function checkFirstPage () {
		var page = document.getElementById('third');
		equal(page.getAttribute('data-tau-bound'), "Page", 'First page is enhanced');
		ok(page.classList.contains('ui-page-active'), 'First page is active');
		equal(document.querySelectorAll('[data-role="page"].ui-page-active').length, 1, 'Only one page is active');
		document.body.removeEventListener('pagechange', checkFirstPage);
		location.hash = '';
		start();
	}

	location.hash = '#third';
	document.body.addEventListener('pagechange', checkFirstPage);
	ej.engine.run();
});