/* global define, ns */
/**
 * #Scrolling by rotary event
 *
 * Tool to enable scrolling by rotary event.
 *
 * ##How tu use
 *
 *    @example
 *      <div class="ui-page" id="page>
 *        <div class="ui-content">
 *          Long content to scroll
 *        </div>
 *        <script>
 *          var page = document.getElementById("page");
 *          page.addEventListener("pagebeforeshow", function (event) {
 *            tau.util.rotaryScrolling.enable(event.target.firstElementChild);
 *          });
 *          page.addEventListener("pagehide", function () {
 *            tau.util.rotaryScrolling.disable();
 *          });
 *        </script>
 *      </div>
 *
 * @class ns.util.rotaryScrolling
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var rotaryScrolling = {},
				element = null,
				/**
				 * Scroll step
				 * @type {number}
				 */
				scrollStep = 40;

			/**
			 * Handler for rotary event
			 * @param {Event} event Event object
			 */
			function rotaryDetentHandler(event) {
				if (element.getAttribute("data-lock-rotary-scroll") !== "true") {
					if (event.detail.direction === "CW") {
						element.scrollTop += scrollStep;
					} else {
						element.scrollTop -= scrollStep;
					}
				}
			}

			/**
			 * Enable Rotary event scrolling
			 * @param {HTMLElement} newElement Base element to scroll
			 * @param {number} newScrollDiff Value of scroll step
			 * @method enable
			 * @memberof ns.util.rotaryScrolling
			 */
			function enable(newElement, newScrollDiff) {
				element = newElement;
				if (newScrollDiff) {
					scrollStep = newScrollDiff;
				}
				document.addEventListener("rotarydetent", rotaryDetentHandler);
			}

			/**
			 * Disable rotary event scrolling
			 * @method disable
			 * @memberof ns.util.rotaryScrolling
			 */
			function disable() {
				scrollStep = 40;
				document.removeEventListener("rotarydetent", rotaryDetentHandler);
				element = null;
			}

			/**
			 * Lock rotary scrolling for current scrolling container
			 * @method lock
			 * @memberof ns.util.rotaryScrolling
			 */
			function lock() {
				element && element.setAttribute("data-lock-rotary-scroll", true);
			}

			/**
			 * Unlock rotary scrolling for current scrolling container
			 * @method unlock
			 * @memberof ns.util.rotaryScrolling
			 */
			function unlock() {
				element && element.removeAttribute("data-lock-rotary-scroll");
			}

			/**
			 * Get value of step which is changed in each rotate
			 * @method getScrollStep
			 * @memberof ns.util.rotaryScrolling
			 * @return {number}
			 */
			function getScrollStep() {
				return scrollStep;
			}

			/**
			 * Set value of step which is changed in each rotate
			 * @param {number} newScrollStep New value of scroll step
			 * @method setScrollStep
			 * @memberof ns.util.rotaryScrolling
			 */
			function setScrollStep(newScrollStep) {
				scrollStep = newScrollStep;
			}

			rotaryScrolling.enable = enable;
			rotaryScrolling.disable = disable;
			rotaryScrolling.lock = lock;
			rotaryScrolling.unlock = unlock;
			rotaryScrolling.setScrollStep = setScrollStep;
			rotaryScrolling.getScrollStep = getScrollStep;

			ns.util.rotaryScrolling = rotaryScrolling;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return rotaryScrolling;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
