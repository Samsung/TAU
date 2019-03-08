/*global $, document, CustomEvent, asyncTest, ok, start */
$().ready(function () {
	"use strict";
	module('support/mobile/event/touch');
	QUnit.config.testTimeout = 5000;

	function fireEvent(type, props) {
		var el = document.body,
			evt = new CustomEvent(type, {
				"bubbles": true,
				"cancelable": true
			}),
			prop;
		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				evt[prop] = props[prop];
			}
		}
		try {
			return el.dispatchEvent(evt);
		} catch (err) {
			console.log(err);
		}
		return false;
	}

	function tapTest(event) {
		document.body.removeEventListener('tap', tapTest, false);
		equal(event.type, 'tap', 'tap');
		start();
	}

	asyncTest('tap', 1, function () {
		document.body.addEventListener('tap', tapTest, false);
		fireEvent('mousedown', {
			"pageX": 50,
			"pageY": 50
		});
		setTimeout(function () {
			fireEvent('click', {
				"pageX": 50,
				"pageY": 50
			});
		}, 1);
	});

	function tapHoldTest(event) {
		document.body.removeEventListener('taphold', tapHoldTest, false);
		equal(event.type, 'taphold', 'taphold');
		start();
	}

	asyncTest('taphold', 1, function () {
		document.body.addEventListener('taphold', tapHoldTest, false);
		fireEvent('mousedown', {
			"pageX": 50,
			"pageY": 50
		});
		setTimeout(function () {
			fireEvent('mousedown', {
				"pageX": 50,
				"pageY": 50
			});
			// timeout must be greater than taphold
		}, 800);
	});

});