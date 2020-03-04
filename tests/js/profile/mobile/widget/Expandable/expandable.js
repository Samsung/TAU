(function () {
	"use strict";

	var handlers = {};

	module('profile/mobile/widget/mobile/Expandable', {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	function testExpandableBaseStructure(Expandable, name) {
		var chead = Expandable.firstElementChild,
			headLink = chead.firstElementChild;

		name = name ? ' ' + name : '';

		equal(Expandable.classList.contains('ui-expandable'), true, 'Expandable widget' + name + ' sets proper class');
		ok(chead.nextElementSibling, 'Sibling of widget' + name + ' content exists');
		equal(chead.nextElementSibling && chead.nextElementSibling.tagName, 'DIV', 'Expandable' + name + ' sibling is div');
		equal(chead.nextElementSibling && chead.nextElementSibling.classList.contains('ui-expandable-content'), true, 'Expandable' + name + ' sibling has class ui-expandable-content');

		// Check header structure
		strictEqual(chead.children.length, 1, 'Header contains one child');
		equal(headLink && headLink.tagName, 'A', 'Header only child is <a>');
		ok(headLink && headLink.classList.contains('ui-expandable-heading-toggle'), 'Link has proper heading-toggle class');
		//ok(headLink && headLink.classList.contains('ui-btn'), 'Link has ui-btn class');
		//@TODO add tests for all btn options
	}

	test('Widget creates proper structure', function () {
		var expandable1 = document.getElementById('expandable1'),
			expandable2 = document.getElementById('expandable2'),
			expandable3 = document.getElementById('expandable3'),
			expandable4 = document.getElementById('expandable4'),
			expandable5 = document.getElementById('expandable5'),
			expandable6 = document.getElementById('expandable6'),
			expandable7 = document.getElementById('expandable7'),
			chead7 = document.getElementById('c-head-7'),
			preSwapHTMLRegExp;

		tau.widget.Expandable(expandable1);
		testExpandableBaseStructure(expandable1, 'with <h1>');

		// wrapps content in div with classes ui-expandable-content
		tau.widget.Expandable(expandable2);
		testExpandableBaseStructure(expandable2, 'with <h2>');

		tau.widget.Expandable(expandable3);
		testExpandableBaseStructure(expandable3, 'with <h3>');

		tau.widget.Expandable(expandable4);
		testExpandableBaseStructure(expandable4, 'with <h4>');

		tau.widget.Expandable(expandable5);
		testExpandableBaseStructure(expandable5, 'with <h5>');

		tau.widget.Expandable(expandable6);
		testExpandableBaseStructure(expandable6, 'with <h6>');

		// Change <legend> header to simple div
		preSwapHTMLRegExp = new RegExp(chead7.innerHTML, 'g');
		tau.widget.Expandable(expandable7);
		testExpandableBaseStructure(expandable7, 'with <legend>');
		chead7 = expandable7.children[0];
		equal(chead7.tagName, 'DIV', 'Legend was changed to div');
		// @todo consider changing regex test to something more DOM manipulation friendly
		ok(preSwapHTMLRegExp.test(chead7.innerHTML), 'Heading content after swaping stayed the same');
	});

	asyncTest('Widget destroy', function () {
		var afterDestroy = function (event) {
				ok(true, '"destroyed" event was triggered on document');
				equal(event.detail.widget, 'Expandable', 'destroyed event has detail.widget == "Expandable"');
				ok(event.detail.parent !== undefined, 'destroyed event sends parent node as detail.parent');

				start();
			};

		var expandable8 = tau.widget.Expandable(document.getElementById('expandable8'));

		document.addEventListener('destroyed', afterDestroy, true);
		expandable8.destroy();
	});
}());
