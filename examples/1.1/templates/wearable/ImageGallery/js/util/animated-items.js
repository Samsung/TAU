/*global tau */
/*jslint unparam: true */
(function () {
	"use strict";

	var min = Math.min;

	function request(state, items) {
		var len = items.length,
			i = 0,
			duration = state.duration,
			progress = (Date.now() - state.startTime) / duration,
			draw = state.drawFn,
			timing = state.timingFn;

		// calculation
		for (; i < len; ++i) {
			timing(items[i], min(progress, 1));
		}

		// draw
		for (i = 0; i < len; ++i) {
			draw(items[i], i);
		}

		// add request animation frame
		if (!state.end) {
			state.handler = window.requestAnimationFrame(state.request);
		} else {
			if (typeof state.onEnd === "function") {
				state.onEnd();
			}
		}
		if (progress > 1) {
			state.end = true;
		}
	}

	/**
	 * Create animation
	 * @param {Array|Object} items
	 * @param {number} duration
	 * @param {Function} timingFn
	 * @param {Function} drawFn
	 * @param {Function} onEnd
	 * @returns {{end: boolean, startTime: number, duration: number, timingFn: Function, drawFn: Function, onEnd: Function}}
	 */
	function anim(items, duration, timingFn, drawFn, onEnd) {
		// item (or items) should has properties: from, to

		var state = {
			end: false,
			startTime: Date.now(),
			duration: duration,
			timingFn: timingFn,
			drawFn: drawFn,
			onEnd: onEnd
		};

		items = (Array.isArray(items)) ? items : [items];
		state.request = request.bind(null, state, items);

		// animation run
		state.handler = window.requestAnimationFrame(state.request);

		return state;
	}

	tau.util.anim = tau.util.anim || {};
	tau.util.anim.animItems = anim;
}(tau));