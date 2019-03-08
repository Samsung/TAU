/*global window*/
document.addEventListener("tauinit", function (event) {
	"use strict";
	var my_name_space = {},
		tau = event.detail.tau,
		MyWidget = function () {
			// constructor for every instance

			// set default widget's options
			var options = this.options || {};
			options.figureIcon = "star";
			options.figureX = 1;
			options.figureY = 1;
			this.options = options;

			// cache for html elements;
			this._ui = {};

			// tap event handler
			this._onTap = null;
		},

		// some a const, variables and methods
		//  common for all widget's instances
		GRID_SIZE = 8,
		CELL_SIZE = 100 / GRID_SIZE,
		inRange = function (value, min, max) {
			return Math.min(max, Math.max(min, value));
		};

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

	function createFigure(icon) {
		var figureElement = document.createElement('div');

		figureElement.classList.add("figure");
		return tau.widget.Button(figureElement, {
			inline: true,
			style: "circle",
			icon: icon,
			iconpos: "notext"
		});
	}

	function placeFigure(figure, x, y) {
		var elementStyle = figure.style;

		elementStyle.left = x * CELL_SIZE + "vw";
		elementStyle.top = y * CELL_SIZE + "vw";
	}

	function getDirection(figureElement, x, y) {
		var width = tau.util.DOM.getElementWidth(figureElement),
			height = tau.util.DOM.getElementHeight(figureElement),
			position = tau.util.DOM.getElementOffset(figureElement);

		return {
			x: (position.left + width / 2) > x ? -1 : 1,
			y: (position.top + height / 2) > y ? -1 : 1
		};
	}

	function onTap(self, event) {
		var directions = getDirection(
				self._ui.figureElement,
				event.clientX,
				event.clientY
			),
			x = inRange(self.options.figureX + directions.x, 0, 7),
			y = inRange(self.options.figureY + directions.y, 0, 7);

		placeFigure(self._ui.figureElement, x, y);
		saveFigurePosition(x, y);

		self.options.figureX = x;
		self.options.figureY = y;
	}

	function saveFigurePosition(x, y) {
		localStorage.setItem('figurePosition', JSON.stringify({x: x, y: y}));
	}

	function loadFigurePosition() {
		var data = localStorage.getItem('figurePosition');
		return data ? JSON.parse(data) : null;
	}

	MyWidget.prototype._configure = function () {
		var options = this.options || {},
			lastPosition = loadFigurePosition();

		if (lastPosition) {
			options.figureX = lastPosition.x;
			options.figureY = lastPosition.y;
		}

		this.options = options;
	};

	MyWidget.prototype._build = function (element) {
		var board = document.createElement("div"),
			figure;

		element.classList.add("my-widget");
		board.classList.add("container");

		createChessboardInWrapper(board);

		// Create one figure and append to board
		figure = createFigure(this.options.figureIcon);
		board.appendChild(figure.element);

		this._ui.board = board;
		this._ui.figureElement = figure.element;

		element.appendChild(board);

		return element;
	};

	MyWidget.prototype._init = function (element) {
		// set figure position
		placeFigure(this._ui.figureElement, this.options.figureX, this.options.figureY);
	};

	MyWidget.prototype._bindEvents = function () {
		this._onTap = onTap.bind(null, this);
		this.element.addEventListener("vclick", this._onTap, true);
	};

	MyWidget.prototype._unbindEvents = function () {
		this.element.removeEventListener("vclick", this._onTap, true);
	};

	MyWidget.prototype._destroy = function () {
		this._unbindEvents();
		this.element.removeChild(this._ui.board);
		this._ui.board = null;
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
