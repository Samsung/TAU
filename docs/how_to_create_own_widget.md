# Custom widget step by step

The TAU framework has a package of widgets that will be useful for most use
cases in apps. Very often requirements of the application force the developer
to modify, extend widgets or create the new ones requirements.

The API of TAU framework allows creating custom and adding them to the framework
while maintaining the required widget's structure.

## Adding widgets to the framework

Suppose that already we have prepared our widget which we want to add to
the framework, there are two ways to do this.

### Breaking the framework flow and append the custom widget

* Developer need to prepare the framework startup by setting tau configuration
	`autorun` on false
* Append the custom widget
* Resume flow of framework startup.

The widget code has to be placed __after__ the TAU library.

```
<script type="text/javascript">
	var tauConfig = {
		"autorun": false
	};
</script>
<script type="text/javascript" src="../lib/tau/mobile/js/tau.js" data-build-remove="false"></script>
<link rel="stylesheet" href="../lib/tau/mobile/theme/default/tau.css">

<script type="text/javascript" src="./js/MyWidget.js" data-build-remove="false"></script>
<link rel="stylesheet" href="./css/MyWidget.css">
<script>
	tau.engine.run();
</script>
```

Widget's file

```js
(function (tau) {
	"use strict";

	// the widget code;

}(tau));
```

### Append the custom widget on event `tauinit`

The `tauinit` event is the moment when framework has defined all inner
requires and all build in widgets are defined.

In this case widget code has to be placed __before__ the TAU library.

```
<script type="text/javascript" src="./js/MyWidget.js" data-build-remove="false"></script>
<link rel="stylesheet" href="./css/MyWidget.css">

<script type="text/javascript" src="../lib/tau/mobile/js/tau.js" data-build-remove="false"></script>
<link rel="stylesheet" href="../lib/tau/mobile/theme/default/tau.css">
```

```js
document.addEventListener("tauinit", function (event) {
	"use strict";
	var tau = event.detail.tau,

	// the widget code;

});
```

## I'm widget

Now we can append custom widget to the TAU and then we can concentrate
of the minimal code required for a widget definition:

```js-mobile(MyWidget-base/index.html)
	var MyWidget = function () {
		// constructor for every instance
	}

	// All widgets have to have the widget's prototype
	MyWidget.prototype = new tau.widget.BaseWidget();

	tau.engine.defineWidget(
		"MyWidget",     // widget's name
		".my-widget",   // widget's selector
		[],             // public jQuery methods
		MyWidget        // constructor
	);
```

Three sections are exposed:

* Constructor

	This is the *only* place to define all widget properties and their default
	values.

* Prototype inheritance

	The prototype of each TAU widget has to be BaseWidget provided by TAU engine.
	We can also use any widget constructor inherited from BaseWidget,
	for example this may be a ListView.

* Widget's definition

	This is method of TAU engine which registers all widget in the framework engine.
	The method requires following arguments:
	- name

		The name of the widget has to be unique for the framework. The only
		exception is when we want redefine existing widget.

	- selector

		The parameter determines CSS selector which will be used to find HTML
		elements. Instance of widget will be created for each element.

	- methods (required only when we want jQuery Mobile like interface)

		Represents which widget's methods will be publicated by jQuery Mobile
		interface. Several base methods like "destroy", disable", "enable",
		"option", "refresh", "value" are inherited from BaseWidget.

	- constructor

		Widget's constructor.

## I look better

The most simple widget, as above, does not provide many functionalities than
adding styles on markup. Developer usually needs more sophisticated widget with
complex HTML structure. For this reason we define protected method `_build`.
Developer should remember about "underscore" as a prefix before name. It is
contractual way of marking methods as protected because JS does not support
protected methods.

!!!Warning
Base widget has a `build` method, which can be easily overloaded by a missing \_ prefix in the extending widget instance.

Let's suppose that widget builds a black and white chessboard.
The `_build` method can be written like as below.

```js-mobile(MyWidget-build/index.html)
(function () {
	var MyWidget = function () {
			// constructor for every instance
		},

		// some a const, variables and methods
		// common for all MyWidget's instances
		GRID_SIZE = 8;

	// All widgets have to have the widget's prototype
	MyWidget.prototype = new tau.widget.mobile.BaseWidgetMobile();

	function createChessboardInWrapper(wrapper) {
		var i, cell;

		for (i = 0; i < Math.pow(GRID_SIZE, 2); i++) {
			cell = document.createElement("div");
			cell.classList.add("cell");
			cell.classList.add(
				// little magic code for creating chessboard;
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

	tau.engine.defineWidget(
		"MyWidget",     // widget's name
		".my-widget",   // widget's selector
		[],             // public jQuery methods
		MyWidget        // constructor
	);

})();
```

The widget's css styles can be placed in outer file.

```css
.my-widget .container {
	width: 100vw;
	height: 100vw;
	display: inline-block;
}
.my-widget .cell {
	width: 10vw;
	height: 10vw;
	float: left;
}

.my-widget .cell.white {
	background-color: white;
}
.my-widget .cell.black {
	background-color: black;
}
```

The `_build` method is called by BaseWidget and the element that matches widget
selector is passed as the first argument. Essential reason using of build method
is to rebuild DOM tree, develop new elements or adding new CSS styles to
elements.
If any HTML elements will be used in later work, the good practice is to store
them in the widget. For this purpose in widget's constructor we can add object
named "_ui" as property of widget instance.

## We are

Basically each widget can be assembled from any count of other widgets, it is
developer wishes.

Good example for above may be add figure to the our widget of chessboard.
The figure will be button widget.

```js-mobile(MyWidget-addButton/index.html)
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
```


## I wait for your order

The widget has to look properly but also be responsive for user actions.
For this reason developer should append listeners on actions
of users. In this way the widget will be waiting for events.
This feature is provided in building widget process. Developer should define
protected method `_bindEvents` which concentrate all attaching of event handlers
in one method.

```js-mobile(MyWidget-bindEvents/index.html)
MyWidget.prototype._bindEvents = function () {
	this._onTap = onTap.bind(null, this);
	this.element.addEventListener("vclick", this._onTap, true);
};
```

The `tap` event handler might look like below:
```js-mobile(MyWidget-bindEvents/index.html)
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

	self.options.figureX = x;
	self.options.figureY = y;
}
```

The important thing at this stage is to save event handlers for listeners
in protected properties of widget instance because later we have to remove those
listeners from widget.


## I will miss you. See you!

The developer has to have in mind that his widget may be destroyed in any time.
For that reason he should define in widget protected method `_destroy`.
The method should takes into account following actions:
* remove added event handlers,
* remove HTML elements added in `_build` method,
* remove or recover the old CSS styles,
* erase any cache from widget instances.

```js-mobile(MyWidget-destroy/index.html)
function unbindEvents(self) {
	self.element.removeEventListener("vclick", self._onTap, true);
};

MyWidget.prototype._destroy = function () {
	unbindEvents(this);
	this.element.removeChild(this._ui.board);
	this._ui.board = null;
};
```

## I need some things more fitted

Part of widget properties are dependent to additional factors which from
different reasons cannot be included in build method or basically we
do not known yet and they need a some initialization.
From above reasons the widget has a protected method `_init`. The method has the
to customize the widget in current environment and application state.
Below example shows how to use `_init` method to place a figure on chessboard.

```js-mobile(MyWidget-init/index.html)
MyWidget.prototype._init = function (element) {
	// set figure position
	placeFigure(this._ui.figureElement, this.options.figureX, this.options.figureY);
};
```

## Widget configuration

In the build flow of widget creation the developer can use method `_configure`.

Configuration data collected at this moment the developer can use in
`_init` method.

```js-mobile(MyWidget-configure/index.html)
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
```

At this stage of widget instantiate, the process of widget creation,
is searching for attributes which are pushed to widgets options

For example, we can add attribute to HTML element __data-figure-icon="home"__,
then define in widget's constructor the option property as __figureIcon__.
During widget instantiate this value will be found. The method search only
attributes defined early as options property.

```mobile(MyWidget-attribute/index.html)
<div class="my-widget" data-figure-icon="home"></div>
```


## Some widget's option needs more action

The developer can also define getter and setter for particular option,
just add protected methods with appropriate names.
The method name should be prefixed by `_set` or `_get` and contains name of
option property in __camelCase__ style.

For example:
`_getFigureIcon` and `_setFigureIcon`

```js-mobile(MyWidget-configure/index.html)
MyWidget.prototype._getFigureIcon = function () {
	return this.options.figureIcon;
};

MyWidget.prototype._setFigureIcon = function (element, value) {
	// make somethig special before set value
	this.options.figureIcon = value;
};
```


## How to speed up the app

The process of widget build is not parted accidentally. The main idea which
inspired to this solution was exactly the speed up web application start.
The App built based on TAU can be pre built, this mean that all widgets from
the app will built on developer machine and at the moment of app's start
on device the browser engine will not be wasted time for this.
