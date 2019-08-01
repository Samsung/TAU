/*global tau */
(function () {
	var page = document.getElementById("marqueeTest"),
		marqueeEl = document.getElementById("marquee"),
		startBtn = document.getElementById("start"),
		startFlag = true,
		marqueeWidget,
		pageShowHandler,
		pageHideHandler;

	/**
	 * Initializes global variables
	 */
	function clearVariables() {
		page = null;
		marqueeEl = null;
		startBtn = null;
		marqueeWidget = null;
	}

	/**
	 * marqueeend event handler
	 */
	function marqueeEndHandler() {
		startFlag = false;
		startBtn.textContent = "START";
	}

	/**
	 * marqueestart event handler
	 */
	function marqueeStartHandler() {
		startFlag = true;
	}

	/**
	 * marqueestopped event handler
	 */
	function marqueeStoppedHandler() {
		startFlag = false;
	}

	/**
	 * click event handler for start button
	 */
	function marqueeStartandStop() {
		if (startFlag) {
			startBtn.textContent = "START";
			marqueeWidget.stop();
		} else {
			startBtn.textContent = "STOP";
			marqueeWidget.start();
		}
	}

	/**
	 * Adds event listeners
	 */
	function bindEvents() {
		marqueeEl.addEventListener("marqueeend", marqueeEndHandler);
		marqueeEl.addEventListener("marqueestart", marqueeStartHandler);
		marqueeEl.addEventListener("marqueestopped", marqueeStoppedHandler);
		startBtn.addEventListener("vclick", marqueeStartandStop);
	}

	/**
	 * Removes event listeners
	 */
	function unbindEvents() {
		page.removeEventListener("pageshow", pageShowHandler);
		page.removeEventListener("pagehide", pageHideHandler);
		startBtn.removeEventListener("vclick", marqueeStartandStop);
		marqueeEl.removeEventListener("marqueeend", marqueeEndHandler);
		marqueeEl.removeEventListener("marqueestart", marqueeStartHandler);
		marqueeEl.removeEventListener("marqueestopped", marqueeStoppedHandler);
	}

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageShowHandler = function () {
		bindEvents();
		marqueeWidget = new tau.widget.Marquee(marqueeEl, {marqueeStyle: "endToEnd"});
	};

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageHideHandler = function () {
		marqueeWidget.destroy();
		unbindEvents();
		clearVariables();
	};

	page.addEventListener("pageshow", pageShowHandler, false);
	page.addEventListener("pagehide", pageHideHandler, false);
}());

