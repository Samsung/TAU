module('support/mobile/widget/Controlgroup', {
	teardown: function () {
		ej.engine._clearBindings();
	}
});

test("Controlgroup content is wrapped with div with proper css classes", function () {
	tau.widget.Controlgroup(document.getElementById('test1'));
	equal($('#test1').children().length, 1, 'Controlgroup content is wrapped with 1 element');
	equal($('#test1').children().get(0).tagName, 'DIV', 'Controlgroup content is wrapped with div element');
	ok($('#test1').children().eq(0).hasClass('ui-controlgroup-controls'), 'Controlgroup content wrapper has ui-controlgroup-controls class');
});

test("Controlgroup legend was replaced with stylable div", function () {
	tau.widget.Controlgroup(document.getElementById('test2'));
	equal($('#test2').find('legend').length, 0, 'Legend element was removed');
	equal($('#test2').children().length, 2, 'New element was added instead of legend element');
	ok($('#test2').children().eq(0).hasClass('ui-controlgroup-label'), 'Replacement element has ui-controlgroup-label class');
	equal($('#test2').children().eq(0).text(), 'Test2 Legend', 'Replacement element has removed legend text');
});

test("Controlgroup heading was moved to the top if already exist", function () {
	tau.widget.Controlgroup(document.getElementById('test3'));
	ok($('#test3').children().eq(0).hasClass('ui-controlgroup-label'), 'Existing label was moved to the top of container');
	equal($('#test3').children().eq(0).text(), 'Test3 Legend', 'Moved element has correct content');
});

test("Controlgroup container has appropriate css styles", function () {
	var container;

	tau.widget.Controlgroup(document.getElementById('test4'));
	container = $('#test4');
	ok(container.hasClass('ui-corner-all'), 'Controlgroup must contain ui-corner-all class');
	ok(container.hasClass('ui-controlgroup'), 'Controlgroup must contain ui-controlgroup class');
	ok(container.hasClass('ui-controlgroup-vertical'), 'Controlgroup must contain ui-controlgroup-vertical class as default');
	ok(!container.hasClass('ui-shadow'), 'Controlgroup must not contain ui-shadow class as default');
	ok(!container.hasClass('ui-mini'), 'Controlgroup must not contain ui-mini class as default');
});

test("Controlgroup container has appropriate css styles when data attributes are set", function () {
	var container;

	tau.widget.Controlgroup(document.getElementById('test5'));
	container = $('#test5');
	ok(container.hasClass('ui-corner-all'), 'Controlgroup must contain ui-corner-all class');
	ok(container.hasClass('ui-controlgroup'), 'Controlgroup must contain ui-controlgroup class');
	ok(container.hasClass('ui-controlgroup-horizontal'), 'Controlgroup must contain ui-controlgroup-horizontal when data-type is set to horizontal');
	ok(container.hasClass('ui-shadow'), 'Controlgroup must contain ui-shadow class when data-shadow is set to true');
	ok(container.hasClass('ui-mini'), 'Controlgroup must contain ui-mini class when data-mini is set to true');
});

test("Controlgroup buttons has appropriate css styles in vertical mode", function () {
	var buttons;

	tau.widget.Controlgroup(document.getElementById('test6'));

	buttons = $('.ui-btn', '#test6');

	buttons.each(function (item) {
		ok(!$(item).hasClass('ui-btn-corner-all'), 'Controlgroup elements must not contain ui-btn-corner-all class');
	});

	buttons.each(function (item) {
		ok(!$(item).hasClass('ui-shadow'), 'Controlgroup elements must not contain ui-shadow class');
	});

	buttons.each(function (item) {
		ok(!$(item).hasClass('ui-corner-left'), 'Controlgroup elements must not contain ui-corner-left class');
	});

	buttons.each(function (item) {
		ok(!$(item).hasClass('ui-corner-right'), 'Controlgroup elements must not contain ui-corner-right class');
	});

	ok(buttons.eq(0).hasClass('ui-corner-top'), 'First controlgroup item must contain ui-corner-top class');
	ok(buttons.last().hasClass('ui-corner-bottom'), 'Last controlgroup item must contain ui-corner-bottom class');
	ok(buttons.last().hasClass('ui-controlgroup-last'), 'Last controlgroup item must contain ui-controlgroup-last class');

	ok(!buttons.eq(1).hasClass('ui-corner-top'), 'Middle controlgroup item must not contain ui-corner-top class');
	ok(!buttons.eq(1).hasClass('ui-corner-bottom'), 'Middle controlgroup item must not contain ui-corner-bottom class');
	ok(!buttons.eq(1).hasClass('ui-controlgroup-last'), 'Middle controlgroup item must not contain ui-controlgroup-last class');
});

test("Controlgroup buttons has appropriate css styles in horizontal mode", function () {
	var buttons;

	tau.widget.Controlgroup(document.getElementById('test7'));

	buttons = $('.ui-btn', '#test7');

	buttons.each(function (item) {
		ok(!$(item).hasClass('ui-btn-corner-all'), 'Controlgroup elements must not contain ui-btn-corner-all class');
	});

	buttons.each(function (item) {
		ok(!$(item).hasClass('ui-shadow'), 'Controlgroup elements must not contain ui-shadow class');
	});

	buttons.each(function (item) {
		ok(!$(item).hasClass('ui-corner-top'), 'Controlgroup elements must not contain ui-corner-top class');
	});

	buttons.each(function (item) {
		ok(!$(item).hasClass('ui-corner-bottom'), 'Controlgroup elements must not contain ui-corner-bottom class');
	});

	ok(buttons.eq(0).hasClass('ui-corner-left'), 'First controlgroup item must contain ui-corner-left class');
	ok(buttons.last().hasClass('ui-corner-right'), 'Last controlgroup item must contain ui-corner-right class');
	ok(buttons.last().hasClass('ui-controlgroup-last'), 'Last controlgroup item must contain ui-controlgroup-last class');

	ok(!buttons.eq(1).hasClass('ui-corner-left'), 'Middle controlgroup item must not contain ui-corner-left class');
	ok(!buttons.eq(1).hasClass('ui-corner-right'), 'Middle controlgroup item must not contain ui-corner-right class');
	ok(!buttons.eq(1).hasClass('ui-controlgroup-last'), 'Middle controlgroup item must not contain ui-controlgroup-last class');
});