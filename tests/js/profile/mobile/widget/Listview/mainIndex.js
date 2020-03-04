/*jslint nomen: true */
/*global window:false,
 test:false, ok:false, equal:false, module:false, deepEqual:false, expect:false,
 listviewItemTests: false, dividerTests:false, dividerBuildTests:false,
 $:false, console:false */
(function (document, ej) {
	'use strict';

	module('Listview', {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});



	test('Default listview', function () {
		var list = document.querySelector('#listview1'),
			divider;

		equal(list.getAttribute('data-tau-bound'), "true", "List widget is created");
		ok(list.classList.contains('ui-listview'), 'List has ui-listview class');

		//test normal items
		listviewItemTests(document.getElementById('li1'));
		//test second normal items
		listviewItemTests(document.getElementById('li2'));
		//list divider;
		divider = document.getElementById('li_divider');
		dividerTests(divider);
		dividerBuildTests(divider);
	});


	test('List divider constructor', function () {
		// listDivider widget, build test
		var li = document.getElementById('li_divider');
		$(li).listdivider();
		dividerBuildTests(li);
	});



	test('Append new items to listview', function () {
		var li3, li4, divider,
			$li3, $li4, $divider,
			list = document.querySelector('#listview2'),
			ref = document.getElementById('ref2'),
			eventsCalled = {},
			returnValue;

		$(document).on("listviewbeforecreate listviewcreate", function (e) {
			eventsCalled[e.type] = true;
		});

		// append new li element and refresh list;
		$li3 = $('<li id="li3">added li 3</li>');
		$li4 = $('<li id="li4">added li 4</li>');
		$(list).append($li3);
		$(list).append($li4);
		$(list).listview();
		$(list).listview('refresh');
		li3 = $li3.get(0);
		li4 = $li4.get(0);
		listviewItemTests(li3);
		listviewItemTests(li4);
		ok(eventsCalled.listviewbeforecreate, 'listviewbeforecreate called');
		ok(eventsCalled.listviewcreate, 'listviewcreate called');
		$(document).off("listviewbeforecreate listviewcreate");

		// append new divider li element and refresh list;
		$divider = $('<li id="li_divider2" data-role="list-divider"><span id="ref2">Divider</span></li>');
		$(list).append($divider);
		returnValue = $(list).listview('refresh');
		deepEqual($(list), returnValue, "compare object listview and return value of method refresh on listview");
		$(list).trigger('create');

		ok(true, 'After refresh, check newly added divider');
		divider = $divider.get(0);
		dividerTests(divider);
		dividerBuildTests(divider);

		// ListDivider as last element
		ok(divider.classList.contains('ui-li-last'), 'divider, Last item has ui-li-last class');

		equal(document.getElementById('ref2'), ref, "Earlier created reference not lost");
	});



	test("Listview after refresh, test of event", function () {
		expect(1);
		var $li3,
			list = document.querySelector('#listview1');

		$(list).listview();
		$(list).on('listviewafterrefresh', function () {
			ok(true, "listviewafterrefresh event triggered");
		});
		// append new li element and refresh list;
		$li3 = $('<li id="li3">added li 3</li>');
		$(list).append($li3);
		$(list).listview('refresh');
	});

}(window.document, window.ej));
