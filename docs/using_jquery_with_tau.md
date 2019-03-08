# Using jQuery with TAU

The TAU framework is standalone library and doesn't need other tools.
Developers who like to use jQuery in projects can do this like before.
The TAU has a very strong compatibility with jQuery Mobile in the scope
of the public API but you should know that this feature is available only in
mobile profile [see: TAU profiles](framework_profiles.html).


## Placed TAU and jQuery in HTML file

First of all JQuery has to be placed before TAU library.

```html
<script src="../lib/tau/mobile/js/jquery.js"></script>
<script src="../lib/tau/mobile/js/tau.js"></script>
```

TAU framework directory contains the jQuery in version 1.11.0.
Developer can use this jQuery package or replace by own version.

Developers can use TAU widgets with the same syntax as in jQuery Mobile.

## Construct widget

Example below shows how to build widget by constructor.

```mobile
<div data-role="page">
	<div data-role="content">
		<div id="sample-button">button</div>
	</div>
</div>
<script>
	$(document).on("pagebeforeshow", function (e) {
		$("#sample-button").button();
	});
</script>
```

!warning
Developer can create many widgets on the one HTML element, but only one instance of the same class.


## Get value of widget property

The below example shows how to get widget value using jQuery Mobile syntax.

```mobile
<div data-role="page" id="main-page">
	<div data-role="content">
		<input type="range" name="slider-1" id="sample-slider" value="60" min="0" max="100">
		<button id="get-value">Get slider value</button>
		<div id="result"></div>
	</div>
</div>

<script>
	$("#get-value").on("vclick", function (e) {
		var value = $("#sample-slider").slider("value");
		$("#result").html("Value: " + value);
	});
</script>
```


## Set widget's value

Widgets which have a value also provide method to set this value

```mobile
<div data-role="page" id="main-page">
	<div data-role="content">
		<div id="sample-progress" data-role="progressbar"></div>
		<div data-role="button" id="button">Change value to 50</div>
	</div>
</div>
<script>
	$("#button").on("vclick", function (e) {
		$("#sample-progress").progressbar("value", 50);
	});
</script>
```


## Set widget option

Almost all widgets have an options which have impact on the widget behavior
or appearance.

```mobile
<div data-role="page" id="main-page">
	<div data-role="content">
		<ul id="sample-list" data-role="listview">
			<li>Apple</li>
			<li>Banana</li>
			<li>Grapes</li>
			<li>Melon</li>
			<li>Pear</li>
			<li>Strawberry</li>
		</ul>
		<div data-role="button" id="button">Change option autodividers to "true"</div>
	</div>
</div>

<script>
	$("#button").on("vclick", function (e) {
		$("#sample-list").listview("option", "autodividers", true);
	});
</script>
```


## Call widget's method

Developer can call widget method in the same way as set option or value.

```mobile
<div data-role="page" id="main-page">
	<div data-role="content">
		<div data-role="gallery" id="sample-gallery">
			<img src="images/sample-image-01.jpg" />
		</div>
	</div>

	<div data-role="footer">
		<div data-role="button" id="button">Add images to gallery</div>
	</div>
</div>

<script>
	$("#button").on("vclick", function (e) {
		$("#sample-gallery").gallery("add", "images/sample-image-02.jpg");
		$("#sample-gallery").gallery("value", 1);
		$("#sample-gallery").gallery("refresh");
	});
</script>
```


## Add event listener to the widget

At the below example we can see how to add listener on widget's event.

Simple button is listening on `vclick` event

```mobile
<div data-role="page" id="main-page">
	<div data-role="content">
		<button id="show-message">tap the button shows a message</button>
		<div id="result"></div>
	</div>
</div>

<script>
	$("#show-message").on("vclick", function (e) {
		$("#result").html("Message is shown");
	});
</script>
```

In second example the text content will changed when the `popup` widget will
be open.

```mobile
<div data-role="page" id="main-page">
	<div data-role="content">
		<a href="#sample-popup" data-role="button">open popup</a>
	</div>
	<div data-role="popup" id="sample-popup" class="ui-popup center_title_1btn">
		<div class="ui-popup-text">
			<div id="message">... in progress</div>
		</div>
		<div class="ui-popup-button-bg">
			<a data-role="button" data-rel="back" data-inline="true">Back button</a>
		</div>
	</div>
</div>

<script>
	$("#sample-popup").on("popupafteropen", function (e) {
		$("#message").html("Popup is open");
	});
</script>
```


## What should you remember when use TAU with jQuery?

* TAU framework uses existed implementations of HTML5, EcmaScript5, DOM3, CSS4
in today web browsers.
* TAU framework doesn't modify prototypes of native objects.
* TAU API methods doesn't take jQuery object as argument and doesn't return
jQuery objects.
* Because of differences in architecture of TAU widgets and jQuery Mobile widgets
the `extend()` method is not supported.


### Document Loading

The jQuery recommends to attach application logic to `ready` event, because
after this the DOM is ready. In TAU framework the application logic should be
attach to `pagebeforeshow` or `pageshow` which is started from main page.
After `pagebeforeshow` event the developer may be sure that DOM is completed,
widgets are built and initialized (similarly like it is in jQuery Mobile).

```mobile
<div data-role="page" id="sample-page">
	<div data-role="header"><h1>Header</h1></div>
	<div data-role="content">
		<div id="result"></div>
	</div>
	<div data-role="footer">Footer</div>
</div>
<script>
	function appStart() {
		$("#result").html("DOM is ready and shown ");
	}
	$("#sample-page").on("pageshow", appStart);
</script>
```


### TAU methods do not allows arguments as jQuery objects.

The example of wrong implementation:

```mobile
<ul id="sample-list">
	<li>element 1</li>
	<li>element 2</li>
</ul>
<div id="result"></div>

<script>
	var elements = tau.util.selectors.getChildrenByTag($("#sample-list"), "li");
	$("#result").html("Items found: " + elements.length);
</script>
```

In this case the argument has to be provide as HTML element,
eg. as first element of jQuery object.

```mobile
<ul id="sample-list">
	<li>element 1</li>
	<li>element 2</li>
</ul>
<div id="result"></div>

<script>
	var elements = tau.util.selectors.getChildrenByTag($("#sample-list").get(0), "li");
	$("#result").html("Items found: " + elements.length);
</script>
```

### Selectors

The TAU API selectors in compare to [DOM selectors](http://www.w3.org/TR/css3-selectors/)
return always array (instance of `Array`).

```mobile
<ul id="sample-list">
	<li>element 1</li>
	<li>element 2</li>
</ul>
<div id="result"></div>

<script>
	var list = document.getElementById("sample-list"),
		items = tau.util.selectors.getChildrenByTag(list, "li");
	$("#result").html("List length: " + items.length);
</script>
```

For comparison the DOM selectors (querySelectorAll) returns list of elements
as `NodeList` instance. You should know that the `NodeList` do not inherited
from `Array` class. This means that has no methods like `forEach`, `filter` etc.

```mobile
<ul id="sample-list">
	<li>element 1</li>
	<li>element 2</li>
</ul>
<div id="result"></div>

<script>
	var items = document.querySelectorAll("#sample-list > li");
	$("#result").html("List length: " + items.length);
</script>
```

On the other hand the jQuery's selectors return jQuery object.

```mobile
<ul id="sample-list">
	<li>element 1</li>
	<li>element 2</li>
</ul>
<div id="result"></div>

<script>
	var items = $("#sample-list > li");
	$("#result").html("List length: " + items.length);
</script>
```

### The TAU methods do not return jQuery objects

The example of wrong implementation:
```mobile
<ul id="sample-list">
	<li>element 1</li>
	<li>element 2</li>
</ul>

<script>
	var list = document.getElementById("sample-list"),
		items = tau.util.selectors.getChildrenByTag(list, "li");
	items.css("background-color", "blue");
</script>
```

We can use EcmaScript5 methods to iterate result by methods like `filter`,
`forEach` ect.

```mobile
<ul id="sample-list">
	<li>element 1</li>
	<li>element 2</li>
</ul>

<script>
	var list = document.getElementById("sample-list"),
		items = tau.util.selectors.getChildrenByTag(list, "li");
	items.forEach(function (element) {
		element.style.backgroundColor = "blue";
	})
</script>
```

Or change TAU method result to jQuery object (not recommended but possible)

```mobile
<ul id="sample-list">
	<li>element 1</li>
	<li>element 2</li>
</ul>
<script>
	var list = document.getElementById("sample-list"),
		items = tau.util.selectors.getChildrenByTag(list, "li");
	$(items).css("backgroundColor", "red");
</script>
```

## Events

Developer has several ways to handle events.

The below example shows how developer can register event listener and trigger
own event on HTML element.

```mobile
<div data-role="page" id="sample-page">
	<div data-role="header"><h1>Trigger event on checkbox</h1></div>
	<div data-role="content">
		<input type="checkbox" id="sample-checkbox">
		<button id="by-jquery">trigger event by jQuery</button>
		<button id="by-tau">trigger event by TAU</button>
	</div>
	<div data-role="footer">Footer</div>
</div>

<script>
	// trigger event by jQuery API
	$("#by-jquery").on("click", function (e) {
		$("#sample-checkbox").trigger("click");
	});

	// trigger event by TAU API
	document.getElementById("by-tau").addEventListener("click", function (e) {
		tau.event.trigger(document.getElementById("sample-checkbox"), "click");
	});
</script>
```

!warning
The TAU triggers `CustomEvent` also on DOM tree, then the event is propagating across DOM. In case of jQuery the `CustomEvent` doesn't propagate by DOM only target element.


Example show how to add listeners by DOM methods, TAU API methods and jQuery API
methods.

```mobile
<div data-role="page" id="sample-page">
	<div data-role="header"><h1>Header</h1></div>
	<div data-role="content">
		<div id="sample-element"> Some DIV element.</div>
		<ul id="result" data-role="listview"></ul>
	</div>
	<div data-role="footer">Footer</div>
</div>

<script>
	var element = document.getElementById("sample-element");

	// add listener
	element.addEventListener("click", function (e) {
		$("#result").append("<li>click (listener added by addEventListener)</li>");
	});

	// by TAU
	tau.event.on(element, "click", function (e) {
		$("#result").append("<li>click (listener added by TAU)</li>");
	});

	// by jQuery
	$(element).on("click", function (e) {
		$("#result").append("<li>click (listener added by jQuery)</li>");
	});

	$("#sample-page").on("pageshow", function () {
		$("#result").append("<li data-role='list-divider'>--- Event triggered by jQuery ---</li>");

		// trigger listener by jQuery
		$(element).trigger("click");

		$("#result").append("<li data-role='list-divider'>--- Event triggered by TAU ---</li>");

		// trigger listener by TAU
		tau.event.trigger(element, "click");

		// refresh listview widget with result;
		$("#result").listview("refresh");
	})

</script>
```

!warning
Developer may use above methods exchangeably in the same application but it's better decide which one to use.
