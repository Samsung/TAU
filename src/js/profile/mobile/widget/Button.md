## Default selectors
In default all **BUTTON** tags and all **INPUT** tags with type equals _button_, _submit_ or _reset_ are change to Tizen WebUI buttons.
In addition all elements with _data-role=button_ and class _ui-button_ are changed to Tizen Web UI buttons.
To prevent auto enhance element to Tizen Web UI buttons you can use _data-role=none_ attribute on **BUTTON** or **INPUT** element.

### Create simple button from link using data-role

		@example
		<a href="#page2" data-role="button">Link button</a>

### Create simple button from link using class selector

		@example
		<a href="#page2" class="ui-button">Link button</a>

### Create simple button using button's tag

		@example
		<button>Button element</button>

### Create simple button from input using type

		@example
		<input type="button" value="Button" />
		<input type="submit" value="Submit Button" />
		<input type="reset" value="Reset Button" />

## Manual constructor
For manual creation of button widget you can use constructor of widget from **tau** namespace:

		@example
		<div id="button"></div>
		<script>
			var buttonElement = document.getElementById('button'),
				button = tau.widget.Button(buttonElement, {mini: true});
		</script>

Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend to get this element by method **document.getElementById**. Second parameter is **options** and it is a object with options for widget.

If jQuery library is loaded, its method can be used:

		@example
		<div id="button"></div>
		<script>
			$('#button').button({mini: true});
		</script>

jQuery Mobile constructor has one optional parameter is **options** and it is a object with options for widget.

## Options for Button Widget

Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.

You can change option for widget using method **option**.

### Mini version
For a more compact version that is useful in toolbars and tight spaces, add the data-mini="true" attribute to the button to create a mini version. This will produce a button that is not as tall as the standard version and has a smaller text size.

		@example
		<a href="index.html" data-role="button" data-mini="true">Link button</a>


### Inline buttons
By default, all buttons in the body content are styled as block-level elements so they fill the width of the screen. However, if you want a more compact button that is only as wide as the text and icons inside, add the data-inline="true" attribute to the button.

		@example
		<a href="index.html" data-role="button" data-inline="true">Cancel</a>

If you have multiple buttons that should sit side-by-side on the same line, add the data-inline="true" attribute to each button. This will style the buttons to be the width of their content and float the buttons so they sit on the same line.

		@example
		<a href="index.html" data-role="button" data-inline="true">Cancel</a>
		<a href="index.html" data-role="button" data-inline="true" data-theme="b">Save</a>

### Icon positioning
By default, all icons in buttons are placed to the left of the button text. This default may be overridden using the data-iconpos attribute.

		@example
		<a href="index.html" data-role="button" data-icon="delete" data-iconpos="right">Delete</a>

Possible values of data-iconpos:<br>

 - "left"  - creates the button with left-aligned icon<br>
 - "right"  - creates the button with right-aligned icon<br>
 - "top"  - creates the button with icon positioned above the text<br>
 - "bottom"  - creates the button with icon positioned below the text

You can also create an icon-only button, by setting the data-iconpos attribute to notext. The button plugin will hide the text on-screen, but add it as a title attribute on the link to provide context for screen readers and devices that support tooltips.

		@example
		<a href="index.html" data-role="button" data-icon="delete" data-iconpos="notext">Delete</a>

## Methods

To call method on widget you can use one of existing API:

First API is from tau namespace:

		@example
		<div id="button" data-role="button"></div>
		<script>
			var buttonElement = document.getElementById('button'),
				button = tau.widget.Button(buttonElement);

			// button.methodName(methodArgument1, methodArgument2, ...);
			// for example:

			button.value("text");
		</script>

Second API is jQuery Mobile API and for call _methodName_ you can use:

		@example
	    <div id="button"></div>
		<script>
			// $("#button").button('methodName', argument1, argument2, ...);
			// for example:
		</script>
