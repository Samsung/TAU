# Introduction to widgets

What is a widget? Basically its an UI control that has a specific functionality, like
for example input textbox, dropdown menu or touch slider etc. Widgets build your app
interface, can be used anywhere in the application and speed up development since much
work for handling app UI is implemented in them. Some widgets can be directly visible
and some are not (like layout widgets).

In the base terms a "widget" stands for:
* Graphical element
* Displays data and/or modifies other elements
* Allows of modification of the data
* ... eases development ^\_^

## TAU Widgets

TAU widgets were created with performance in mind. The previous **web-ui-fw** framework was
based on **jQuery Mobile**, it actually was an extension. It defined new, conforming to
**Tizen** platform, widgets and the look was redefined. TAU goes a step further, breaking
the dependence on jQuery and jQuery Mobile, while still being compatible with the latter.

TAU widgets were rewritten from scratch, with different architecture in half. In plain
words, the building phase (which means creating, modifying, removing elements and props)
which ensures "the look" of the widget and it's structure was and the control logic were
separated. This allows pre-building markup for faster application runtime and startup.

Key features of TAU widgets
* Performance
* Pre-building
* Easy to use API
* Compatibility with **jQuery Mobile**
* Look'n'Feel

## Widget surgery

So what's inside? Well, a basic widget implements 5 protected methods:
1. **build** which is responsible for widget creation
2. **configure** which is expected to configure all the options for the widget
3. **init** which handles initialization, like searching for widget sub-elements
4. **bindEvents** which handles all event binding (from user interaction)
5. **destroy** which removes all listeners, and cleans up after the widget

!warning
Conditional build
Please remember that the build method is not executed every time the widget is created,
it will not run when the markup is already built.

Also, the widget is registered in the core engine by `tau.engine.defineWidget` method,
with it's name, selector and public methods list for jQuery Mobile compatibility (if
it's needed).

A given document element **can** have multiple widgets created from it, which really means
that one element is two or more widgets at the same time. This behavior prevents much
of the code duplication an can be used to create widgets which are complementary (like
and input widgets with a dropdown list). This saves time, code and money ^\_^

## Basic usage

A widget can be created through multiple ways, the first and recommended one is to create
a specific markup which conforms to widget selector, for example to create a `Button`
widget we could write:

```mobile
<button id="myButton">This is a button</button>
```

And tau will create a `Button`, because the `button` tag matches widget's selector.
Some widgets have multiple selectors:

```wearable
<a href="#hashtag" class="ui-btn">Button</a>
```

This will also create a button since the `ui-btn` class is also matching `Button` widget
selector.

Widgets can also be created on ambiguous elements, that don't match specific selectors,
using JavaScript code:

```mobile
<div id="myButton">Hello</div>
<script>
	document.addEventListener("pageshow", function (event) {
		tau.engine.instanceWidget(document.querySelector("#myButton"), "Button");
	});
</script>
```

You can also create an element dynamically and make a widget from it, which could be
used in dynamic UI's.

```mobile
<script>
	document.addEventListener("pageshow", function (event) {
		var buttonElement = document.createElement("div");

		buttonElement.textContent = "Hello!";

		event.target.appendChild(buttonElement);
		tau.engine.instanceWidget(buttonElement, "Button");
	});
</script>
```

!warning
Dynamic UI's
Creating widgets dynamically from JavaScript code is not recommended as this prevents pre-building markup

## Widget flavours

Almost all widgets support options which change their look and behaviour. Those parameters
can be changed either on widget creation or runtime (most). If you want you can specify
the options by three methods.

The first and the basic one is by using `data-\*` attributes, where `\*` stands for
the option name.

```mobile
This button is <button id="myButton" data-inline="true">inlined</button> with text.
```

But what to do when your widget is created dynamically? Well, pass the options to the
`instanceWidget` method.

```mobile
This button is <div id="myButton">inline</div> with text
<script>
	document.addEventListener("pageshow", function () {
		tau.engine.instanceWidget(document.querySelector("#myButton"), "Button", {
			inline: true,
			theme: 's'
		});
	});
</script>
```

## Fetching data and modifying behaviour

While having access to a widget, the crucial thing is to fetch and store information
in it, not only modifying the look and feel of it. That's why all widgets expose their
API, with only one rule, protected methods (marked with `\_` underscore) should not be
run directly.

Some methods are getters and setters, and some modify behaviour of widgets. An example
of a setter method is the `value` method:

```mobile
<input type="checkbox" checked />
<script>
	document.addEventListener("pageshow", function () {
		var inputElement = document.querySelector("input"),
			input = tau.engine.instanceWidget(inputElement, "Checkboxradio");
			window.setTimeout(function () {
				input.value(false); // toggle checkbox
			}, 2500);
	});
</script>
```

### jQuery Mobile interface

All widgets expose some API to the jQuery object. These "public" methods conform to
**jQuery Mobile API** style and are fully compatible with the original library.

You can instance, modify, fetch data from widgets using only this interface, not using
original TAU API whatsoever.

This is fully explained in [Using jQuery with TAU](using_jquery_with_tau.html) chapter.
