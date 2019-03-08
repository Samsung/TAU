# How to write apps using declarative widgets

TAU widgets are, at the ground level, normal HTML markup elements that are _enchanced_
with JavaScriot logic. The problem with normal basic HTML markup is that it does not
exactly help to access the logic, so a global variable/namespace has to be used to
get the JS logic for a specific widget ex. `window.tau` object. TAU supports CustomElements
API to allow easy access to JavaScript widget code and to simplify widget markup.

An example can be shown of two ways we can create a widget and access the JS representation
of that element.

```mobile
<div data-role="page" id="myPage">hello world!</div>
<script>
	document.addEventListener("pageshow", function (e) {
		var pageElement = document.getElementById("myPage"),
			pageWidget = tau.engine.instanceWidget(pageElement, "page");
	}, false);
</script>
```

As we can see the markup is a little bloated and the JS code is not optimal. When
CustomElements are used we can write as in example:

```mobile
<tau-page id="myPage">hello world!</tau-page>
<script>
	document.addEventListener("pageshow", function () {
		var pageWidget = document.getElementById("myPage")._tauWidget;
	}, false);
</script>
```

The code is simple and straightforward.

## Element properties

As seen in the example in the previous chapter, `class` and/or `data-role` attributes
are not used to create widgets. Each widget has its own tag, like in the mentioned example,
the `Page` widget is creating by using `<tau-page>` tag.

```
<tau-page>my page content <tau-button>my button</tau-button></tau-page>
```

When using TAU with its declarative markup API, almost all properties stay the same
with one difference. The `data-` prefix is not needed anymore, we can lose it in most
widgets. For example, when we want to disable the overlay layer for a popup:

```
<tau-popup overlay="false">
	Popup
</tau-popup>
```

## Control elements

The only difference that is visible is when using control elements like `input`, `select` etc.
They are written as before but we add the `is` attribute, which tells the browser what
widget the element represents.

```mobile
<input is="tau-textinput">
```

This is still CustomElements specification and is implement this way to properly handle
extending of native browser elements

## Simple notes application

So, having the basics covered, we can write a simple Notes application to demonstrate
the usage of the declarative API. First we need 2 pages, first of the note list and
second for edit/add form

```mobile
<tau-page id="main">
	<header>Notes</header>
	<tau-scrollview class="ui-content">
		<tau-listview id="list" class="ui-listview">
			<li class="ui-li-static">Example note (click to edit)</li>
		</tau-listview>
	</tau-scrollview>
	<footer><button id="add">Add</button></footer>
</tau-page>
<tau-page id="form">
	<header>Notes</header>
	<tau-scrollview class="ui-content">
		<textarea is="tau-textarea" id="data" rows="10"></textarea>
	</tau-scrollview>
	<footer>
		<button id="cancel">Cancel</button>
		<button id="save">Save</button>
	</footer>
</tau-page>
```


We also need some JS logic to handle managing of note data. As show in the example by
using the simplified API that is bound to the element itself we can ease the process of
interacting with TAU widgets.

```mobile
<tau-page id="main">
	<header>Notes</header>
	<tau-scrollview class="ui-content">
		<tau-listview id="list" class="ui-listview">
			<li class="ui-li-static">Example note (click to edit)</li>
		</tau-listview>
	</tau-scrollview>
	<footer><button id="add">Add</button></footer>
</tau-page>
<tau-page id="form">
	<header>Notes</header>
	<tau-scrollview class="ui-content">
		<textarea is="tau-textarea" id="data" rows="10"></textarea>
	</tau-scrollview>
	<footer>
		<button id="cancel">Cancel</button>
		<button id="save">Save</button>
	</footer>
</tau-page>
<script>
	// initialize the code on first pageshow call
	tau.event.one(document, "pageshow", function () {
		var list = document.getElementById("list"),
			listPage = document.getElementById("main"),
			addPage = document.getElementById("form"),
			addButton = document.getElementById("add"),
			cancelButton = document.getElementById("cancel"),
			saveButton = document.getElementById("save"),
			inputData = document.getElementById("data")._tauWidget,
			currentNoteIndex = -1,
			notes = [];

		list._tauWidget.refresh();

		// load existing data
		[].slice.call(list.children).forEach(function (note) {
			notes.push(note.textContent);
		});

		function addNoteElement(data) {
			var listElement = document.createElement("li");
			listElement.textContent = data;
			listElement.className = "ui-li-static";
			list.appendChild(listElement);
		}

		function updateNoteElement(index, data) {
			if (index > -1) {
				list.children[index].textContent = data;
			}
		}

		function removeNoteElement(index) {
			if (index > -1) {
				list.removeChild(list.children[index]);
			}
		}

		tau.event.on(addButton, "click", function () {
			tau.changePage(addPage);
		});

		tau.event.on(cancelButton, "click", function () {
			currentNode = -1;
			tau.history.back();
		});

		// handle adding of new, editing and deletion
		tau.event.on(saveButton, "click", function () {
			var value = inputData.value().trim();
			if (currentNoteIndex === -1 && value.length > 0) {
				addNoteElement(value);
				notes.push(value);
			} else {
				if (value.length > 0) {
					notes[currentNoteIndex] = value
					updateNoteElement(currentNoteIndex, value);
				} else {
					notes.splice(currentNoteIndex, 1);
					removeNoteElement(currentNoteIndex);
				}
				currentNoteIndex = -1;
			}
			tau.changePage(listPage);
		});

		tau.event.on(addPage, "pagebeforeshow", function () {
			if (currentNoteIndex > -1) {
				inputData.value(notes[currentNoteIndex]);
			} else {
				inputData.value("");
			}
			inputData.refresh();
			addPage._tauWidget.refresh();
		});

		tau.event.on(listPage, "pagebeforeshow", function (event) {
			event.target._tauWidget.refresh();
		});

		tau.event.on(list, "click", function (event) {
			var target = event.target;
			if (target.parentNode === list && target.tagName.toLowerCase() === "li") {
				currentNoteIndex = [].slice.call(list.children).indexOf(target);
				tau.changePage(addPage);
			}
		});
	});
</script>
```
