/*
 * Unit Test: Extendable list
 *
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */
/*jslint nomen: true, white: true, plusplus: true*/
/*global $, jQuery, test, equal, ok, JSON_DATA, ej, document*/


(function(ns) {
	'use strict';

	var config;

	config = {
		itemData: function ( idx ) { return JSON_DATA[idx]; },
		numitemdata: JSON_DATA.length
	};

	module("support/mobile/widget/ExtendableList");

	test("ns.widget.Extendablelist jTmpl markup and options checking",  function () {
		var children,
			options,
			widget,
			element = document.getElementById("extendable_list_main");

		// Instance widget
		widget = ns.engine.instanceWidget(element, 'ExtendableList');
		widget.create(config);

		children = widget.element.children;

		equal(children.length, 51, 'Widget created 51 li elements');
		equal(children[0].innerHTML, '<span class="ui-li-text-main">Abdelnaby, Alaa</span>', 'First element of list has proper value');
		equal(children[49].innerHTML, '<span class="ui-li-text-main">Almond, Morris</span>', 'One before last element of list has proper value');
		equal(children[50], document.getElementById('load_more_message').parentNode, 'Last element of list contains button element');
		ok(ns.engine.getBinding(document.getElementById('load_more_message'), 'Button') instanceof ns.widget.core.Button, 'Load more button was bound');

		widget.destroy();
	});

	test("ns.widget.Extendablelist loading data checking",  function () {
		var children,
			button,
			trigger,
			i,
			widget,
			element = document.getElementById("extendable_list_main");

		// Instance widget
		widget = ns.engine.instanceWidget(element, 'ExtendableList', config);
		widget.create(config);

		children = widget.element.children;
		button = document.getElementById('load_more_message');
		trigger = ns.event.trigger;

		equal(children.length, 51, 'Initial number of elements is correct');
		trigger(element.lastElementChild, 'click');
		button = document.getElementById('load_more_message');

		equal(children.length, 101, 'Number of elements after 1st load elements is correct');
		equal(button.innerHTML, 'Load 50 more items', 'Text value is ok, after 1st load');
		trigger(element.lastElementChild, 'click');

		button = document.getElementById('load_more_message');
		equal(children.length, 151, 'Number of elements after 2nd load elements is correct');
		equal(button.innerHTML, 'Load 50 more items', 'Text value is ok, after 2nd load');

		for (i = 10; i > 0; i -= 1) {
			trigger(element.lastElementChild, 'click');
		}
		button = document.getElementById('load_more_message');
		equal(children.length, 651, 'Number of elements after 12th load elements is correct');
		equal(button.innerHTML, 'Load 50 more items', 'Text value is ok, after 12th load');

		for (i = 6; i > 0; i -= 1) {
			trigger(element.lastElementChild, 'click');
		}
		button = document.getElementById('load_more_message');

		equal(children.length, 951, 'Number of elements after 18th load elements is correct');
		equal(button.innerHTML, 'Load 50 more items', 'Text value is ok, after 18th load');

		trigger(element.lastElementChild, 'click');
		button = document.getElementById('load_more_message');

		equal(children.length, 1001, 'Number of elements after 19th load elements is correct');
		equal(button.innerHTML, 'Load 46 more items', 'Text value is ok, after 19th load');


		widget.destroy();
	});

	test("ns.widget.Extendablelist recreate() checking",  function () {
		var children,
			loader,
			trigger,
			i,
			widget,
			newJSON = [],
			element = document.getElementById("extendable_list_main");

		// Instance widget
		widget = ns.engine.instanceWidget(element, 'ExtendableList', config);
		widget.create(config);

		children = widget.element.children;
		loader = element.lastElementChild;
		trigger = ns.event.trigger;

		equal(children.length, 51, 'Initial number of elements is correct');
		trigger(loader, 'click');
		equal(children.length, 101, 'Number of elements after 1st load elements is correct');

		/* make short JSON array */
		for ( i = 0; i < 200; i++ ) {
			newJSON.push( JSON_DATA[ ( i + 100 ) ] );
		}

		/* Call recreate */
		widget.recreate(newJSON);

		children = widget.element.children;
		equal(children.length, 51, 'Number of elements after recreate is correct');
		equal(children[0].firstChild.innerHTML, JSON_DATA[100].NAME, 'First element after recreate is correct');

		widget.destroy();
	});

	test("ns.widget.Extendablelist other options checking",  function () {
		var children,
			loader,
			trigger,
			widget,
			element = document.getElementById("extendable_list_main");

		element.setAttribute('data-loadmore', 'tmp_custom_load_more');
		element.setAttribute('data-extenditems', '100');

		// Instance widget
		widget = ns.engine.instanceWidget(element, 'ExtendableList', config);
		widget.create();

		children = widget.element.children;
		loader = element.lastElementChild;
		trigger = ns.event.trigger;

		equal(children.length, 101, 'Initial number of elements is correct');
		trigger(loader, 'click');
		equal(children.length, 201, 'Number of elements after 1st load elements is correct');
		equal(loader.innerText, 'Load 100!', 'Loader template is correct');

		widget.destroy();
	});

}(ej));
