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

	module("support/mobile/widget/ExtendableList");

	config = {
		//Declare total number of items
		dataLength: JSON_DATA.length,
		//Set buffer size
		bufferSize: 50,
		listItemUpdater: function (newIndex, elListItem) {
			var data =  JSON_DATA[newIndex];
			elListItem.innerHTML = '<span class="ui-li-text-main">' + data.NAME + '</span>';
		},
		listItemLoader: function (elListItem, numMoreItems) {
			var loader = ns.engine.getBinding(document.getElementById('load_more_message'));

			if (!loader) {
				loader = document.createElement('div');
				loader.id = 'load_more_message';
				elListItem.appendChild(loader);
				loader = ns.engine.instanceWidget(loader, 'Button');
			}

			loader.element.innerHTML = 'Load ' + numMoreItems + ' more items';
		}
	};

	test("ns.widget.Extendablelist markup and options checking",  function () {
		var children,
			options,
			widget,
			element = document.getElementById("extendable_list_main"),
			newUpdater = function (newIndex, elListItem) {
				var data =  JSON_DATA[newIndex];
				elListItem.innerHTML = '<span class="ui-li-text-main">' + newIndex + '. ' + data.NAME + '</span>';
			},
			newLoader = function (elListItem, numMoreItems) {
				elListItem.innerHTML = 'Load next ' + numMoreItems + ' items';
			};

		// Instance widget
		widget = ns.engine.instanceWidget(element, 'ExtendableList');
		widget.create(config);

		children = widget.element.children;
		options = widget.options;

		equal(options.bufferSize, 50, 'Buffer size is correct');
		equal(options.dataLength, 1047, 'Data length is correct');
		equal(options.listItemUpdater, config.listItemUpdater, 'Updater function is correct');
		equal(options.listItemLoader, config.listItemLoader, 'Loader function is correct');

		equal(children.length, 51, 'Widget created 51 li elements');
		equal(children[0].innerHTML, '<span class="ui-li-text-main">Abdelnaby, Alaa</span>', 'First element of list has proper value');
		equal(children[49].innerHTML, '<span class="ui-li-text-main">Almond, Morris</span>', 'One before last element of list has proper value');
		equal(children[50], document.getElementById('load_more_message').parentNode, 'Last element of list contains button element');
		ok(ns.engine.getBinding(document.getElementById('load_more_message'), 'Button') instanceof ns.widget.core.Button, 'Load more button was bound');

		widget.option("listItemUpdater", newUpdater);
		equal(options.listItemUpdater, newUpdater, 'Updater function after setListItemUpdater() is correct');

		widget.option("listItemLoader", newLoader);
		equal(options.listItemLoader, newLoader, 'Loader function after setListItemLoader() is correct');


		widget.destroy();
	});

	test("ns.widget.Extendablelist loading data checking",  function () {
		var children,
			loader,
			button,
			trigger,
			i,
			widget,
			element = document.getElementById("extendable_list_main");

		// Instance widget
		widget = ns.engine.instanceWidget(element, 'ExtendableList', config);
		widget.create();

		children = widget.element.children;
		loader = element.lastElementChild;
		button = document.getElementById('load_more_message');
		trigger = ns.event.trigger;

		equal(children.length, 51, 'Initial number of elements is correct');
		trigger(loader, 'click');
		equal(children.length, 101, 'Number of elements after 1st load elements is correct');
		equal(button.innerHTML, 'Load 50 more items', 'Text value is ok, after 1st load');
		trigger(loader, 'click');
		equal(children.length, 151, 'Number of elements after 2nd load elements is correct');
		equal(button.innerHTML, 'Load 50 more items', 'Text value is ok, after 2nd load');

		for (i = 10; i > 0; i -= 1) {
			trigger(loader, 'click');
		}
		equal(children.length, 651, 'Number of elements after 12th load elements is correct');
		equal(button.innerHTML, 'Load 50 more items', 'Text value is ok, after 12th load');

		for (i = 6; i > 0; i -= 1) {
			trigger(loader, 'click');
		}
		equal(children.length, 951, 'Number of elements after 18th load elements is correct');
		equal(button.innerHTML, 'Load 50 more items', 'Text value is ok, after 18th load');

		trigger(loader, 'click');
		equal(children.length, 1001, 'Number of elements after 19th load elements is correct');
		equal(button.innerHTML, 'Load 46 more items', 'Text value is ok, after 19th load');

		button = null;
		trigger(loader, 'click');
		equal(children.length, 1046, 'Number of elements after 20th load elements is correct');
		equal(document.getElementById('load_more_message'), null, 'Loader was removed');

		widget.destroy();
	});

}(ej));
