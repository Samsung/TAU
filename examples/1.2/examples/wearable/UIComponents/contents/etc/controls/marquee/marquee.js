/*global tau */
(function () {
	var page = document.getElementById("marqueeTest"),
		marqueeEl1 = document.getElementById("marquee1"),
		marqueeEl2 = document.getElementById("marquee2"),
		marqueeEl3 = document.getElementById("marquee3"),
		marqueeEl4 = document.getElementById("marquee4"),
		marqueeEl5 = document.getElementById("marquee5"),
		startBtn = document.getElementById("start"),
		startFlag = true,
		marqueeWidget1,
		marqueeWidget2,
		marqueeWidget3,
		marqueeWidget4,
		marqueeWidget5,
		pageShowHandler,
		pageHideHandler;

	/**
	 * Initializes global variables
	 */
	function clearVariables() {
		page = null;
		marqueeEl1 = null;
		marqueeEl2 = null;
		marqueeEl3 = null;
		marqueeEl4 = null;
		marqueeEl5 = null;
		startBtn = null;
		marqueeWidget1 = null;
		marqueeWidget2 = null;
		marqueeWidget3 = null;
		marqueeWidget4 = null;
		marqueeWidget5 = null;
	}

	/**
	 * click event handler for start button
	 */
	function marqueeStartandStop() {
		if (startFlag) {
			startBtn.textContent = "START";
			marqueeWidget1.stop();
			marqueeWidget2.stop();
			marqueeWidget3.stop();
			marqueeWidget4.stop();
			marqueeWidget5.stop();
		} else {
			startBtn.textContent = "STOP";
			marqueeWidget1.start();
			marqueeWidget2.start();
			marqueeWidget3.start();
			marqueeWidget4.start();
			marqueeWidget5.start();
		}
		startFlag = !startFlag;
	}

	/**
	 * Adds event listeners
	 */
	function bindEvents() {
		startBtn.addEventListener("vclick", marqueeStartandStop);
	}

	/**
	 * Removes event listeners
	 */
	function unbindEvents() {
		page.removeEventListener("pageshow", pageShowHandler);
		page.removeEventListener("pagehide", pageHideHandler);
		startBtn.removeEventListener("vclick", marqueeStartandStop);
	}

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageShowHandler = function () {
		bindEvents();
		marqueeWidget1 = new tau.widget.Marquee(marqueeEl1);
		marqueeWidget2 = new tau.widget.Marquee(marqueeEl2);
		marqueeWidget3 = new tau.widget.Marquee(marqueeEl3);
		marqueeWidget4 = new tau.widget.Marquee(marqueeEl4);
		marqueeWidget5 = new tau.widget.Marquee(marqueeEl5);

		marqueeWidget1.start();
		marqueeWidget2.start();
		marqueeWidget3.start();
		marqueeWidget4.start();
		marqueeWidget5.start();
	};

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageHideHandler = function () {
		marqueeWidget1.destroy();
		marqueeWidget2.destroy();
		marqueeWidget3.destroy();
		marqueeWidget4.destroy();
		marqueeWidget5.destroy();
		unbindEvents();
		clearVariables();
	};

	page.addEventListener("pageshow", pageShowHandler, false);
	page.addEventListener("pagehide", pageHideHandler, false);
}());

