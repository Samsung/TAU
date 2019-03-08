/*jslint nomen: true */
/*global document:false, window:false,
 module:false, test:false, ok:false, equal:false, $:false,
 dividerTests:false*/
(function (document, ej) {
	'use strict';

	module('support/mobile/widget/ListviewAutodivider', {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test('Listview with autodividers', function () {
		var list = document.getElementById('test'),
			li1 = document.getElementById('li1'),
			li2 = document.getElementById('li2'),
			li4 = document.getElementById('li4');

		equal(list.getAttribute('data-tau-bound'), "Listview", "List widget is created");
		ok(list.classList.contains('ui-listview'), 'List has ui-listview class');

		dividerTests(li1.previousElementSibling);
		dividerTests(li4.previousElementSibling);

		ok(!(li2.previousElementSibling.classList.contains('ui-li-divider')), 'List item has not ui-li-divider class');
	});

}(document, window.ej));