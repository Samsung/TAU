/*global tau */
/*jslint unparam: true */

(function (tau) {
	"use strict";
	/**
	 * Cache for anim states
	 * @property {Array} anims
	 */
	var anims = [];

	/**
	 * Timing function - EaseOutQuad
	 * @param {number} startTime
	 * @param {number} startValue
	 * @param {number} endValue
	 * @param {number} endTime
	 * @returns {number}
	 */
	function easeOutQuad(startTime, startValue, endValue, endTime) {
		return - endValue * (startTime / endTime) * (startTime - 2) + startValue;
	}

	function render(state) {
		var dTime = Date.now() - state.startTime,
			progress = dTime / state.duration;

		if (!state.end) {
			state.current = easeOutQuad(Math.min(progress, 1), state.from, state.to, 1);

			// apply scroll value to element
			state.element[state.propertyName] = state.current;

			// register callback for next request animation frame;
			state.requestHandler = window.requestAnimationFrame(state.render);
		}

		if (progress > 1) {
			state.end = true;
			window.cancelAnimationFrame(state.requestHandler);
			state.requestHandler = null;
		}
	}

	function createState(from, to, element, duration, options) {
		var state = {
			from: from,
			to: to,
			current: from,
			startTime: Date.now(),
			duration: duration,
			end: true,
			render: null,
			requestHandler: null,
			element: element,
			propertyName: options && options.propertyName || "scrollTop"
		};
		state.render = render.bind(null, state);
		anims.push(state);
		return state;
	}

	function find(element) {
		return anims.filter(function (state) {
			return state.element === element;
		})[0];
	}

	/**
	 * Scroll a element content with animation
	 * @param {HTMLElement} element
	 * @param {number} changeValue
	 * @param {number} duration
	 * @param {Object} [options=null]
	 * @param {string} [options.propertyName=scrollTop] element property name to animate
	 */
	function scrollTo(element, changeValue, duration, options) {
		var propertyName = options && options.propertyName || "scrollTop",
			state = find(element) ||
				createState(element[propertyName], changeValue, element, duration, options);

		state.startTime = Date.now();

		if (!state.end) {
			state.from = state.current;
			// snap to multiplication of change value
			state.to += 2 * changeValue - (state.current + state.to) % changeValue;
		} else {
			state.end = false;
			state.from = element[propertyName];
			state.to = changeValue;
			state.duration = duration;
			state.render();
		}
	}

	// add to tau namespace
	//tau.util.anim.scrollTo = scrollTo;
	window._animScrollTo = scrollTo
}(tau));