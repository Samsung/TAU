/*global window*/
document.addEventListener("tauinit", function (event) {
	"use strict";
	var my_name_space = {},
		tau = event.detail.tau,
		MyWidget = function () {
			// constructor for every instance

			// set default widget's options
			this.options = {};

			// cache for html elements;
			this._ui = {};
		},

		// some a const, variables and methods
		//  common for all widget's instances
		GRID_SIZE = 8;

	// All widgets have to have the widget's prototype
	MyWidget.prototype = new tau.widget.BaseWidget();

	function createChessboardInWrapper(wrapper) {
		var i, cell;

		for (i = 0; i < Math.pow(GRID_SIZE, 2); i++) {
			cell = document.createElement("div");
			cell.classList.add("cell");
			cell.classList.add(
				((i + Math.floor(i / GRID_SIZE)) % 2 === 1) ? "white" : "black"
			);
			wrapper.appendChild(cell);
		}
	}

	MyWidget.prototype._build = function (element) {
		var board = document.createElement("div");

		element.classList.add("my-widget");
		board.classList.add("container");

		createChessboardInWrapper(board);

		this._ui.board = board;
		element.appendChild(board);

		return element;
	};

	// You can store widget constructor in your name space;
	my_name_space.MyWidget = MyWidget;

	tau.engine.defineWidget(
		"MyWidget",     // widget's name
		".my-widget",   // widget's selector
		[],             // jquery public methods
		MyWidget        // constructor
	);
});
