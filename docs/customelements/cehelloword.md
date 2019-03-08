# Custom Elements

In this tutorial we will create a simple application based on `custom elements`. Our
goals will include:

1. Basic structure with Page, Header, Footer and Popup
2. Controls elements: Button in Footer, Progress
3. Logic: activate Progress on Button click and if Progress is complited then show Popup notification

The purpose of this tutorial is to create a Tizen web application with the help of custom elements, find
out how this is accomplished from project startup to packaging. This lesson does not
focus on JavaScript code itself (like code quality, performance or code patterns) as
this exceeds the scope of the tutorial. 

## How to start coding

As this is a fairly simple application we don't need the emulator for now, we can use
**Chrome** or **Chromium** browser to test our code while incrementally writing the application.


!info
Developer environment
We have specified above browsers as examples, the key thing to remember is to use a webkit based browser since Tizen uses this engine for application runtime

You can open the `index.html` file in your browser directly but the proposed solution
is to use a simple server to host the application. You can use ngix, lighttpd, apache
or the simplest *Python*

To start a simple server with python, navigate in the command prompt (terminal application)
or your choosing to the project folder and type:

```bash
python -m SimpleHTTPServer
```

And if you are using Python 3.\* type:

```bash
python -m http.server
```

Now start your browser and open [http://localhost:8000](http://localhost:8000)

## Creating the main page

We start by creating our custom elements face page, which will be the starting point of our whole
application. The following code should be placed inside of body tag. Notice that DOM Tree is same with standard tags.
Only the way we define tags for custom elements is different.

```mobile
<tau-page id="main">
	<div class="ui-header" data-position="fixed">
		<h1>Simple application based on custom elements</h1>
	</div>
	<tau-scrollview class="ui-content">
		<p>Progress bar, when the action ends it will notify you</p>
			<tau-progress type="bar" value="0" min=0 max=100 id="progressbar" class="ui-progress">
		</tau-progress>
		<tau-popup id="progress_popup" class="ui-popup">
			<div class="ui-popup-header">Popup Header</div>
			<div class="ui-popup-content popup-content-padding">
				Action was finalized
			</div>
			<div class="ui-popup-footer">
				<tau-button class="ui-btn" rel="back" inline="true">Cancel</tau-button>
			</div>
		</tau-popup>
	</tau-scrollview><!-- /content -->
	<div class="ui-footer" data-position="fixed">
		<button is="tau-formbutton" id="button">Button1</button>
	</div>
</tau-page>
```

Now we have to program our logic. The JavaScript code
should be placed in separate file for more readability (and this is done in the
finished demo application, the link is placed at the end of the tutorial) but here
in the examples we will write it at the markup level.

```mobile
<tau-page id="main">
	<div class="ui-header" data-position="fixed">
		<h1>Simple application based on custom elements</h1>
	</div>
	<tau-scrollview class="ui-content">
		<p>Progress bar, when the action ends it will notify you</p>
			<tau-progress type="bar" value="0" min=0 max=100 id="progressbar" class="ui-progress">
		</tau-progress>
		<tau-popup id="progress_popup" class="ui-popup">
			<div class="ui-popup-header">Popup Header</div>
			<div class="ui-popup-content popup-content-padding">
				Action was finalized
			</div>
			<div class="ui-popup-footer">
				<tau-button class="ui-btn" rel="back" inline="true">Cancel</tau-button>
			</div>
		</tau-popup>
	</tau-scrollview><!-- /content -->
	<div class="ui-footer" data-position="fixed">
		<button is="tau-formbutton" id="button">Button1</button>
	</div>
</tau-page>

<script>
	(function(){
		var progressBar = document.getElementById("progressbar"),
			popup = document.getElementById("progress_popup"),
			button = document.getElementById("button"),
			page = document.getElementById("main"),
			progressBarWidget,
			pageShowHandler,
			pageHideHandler,
			popupWidget,
			idInterval,
			timeout1,
			timeout2;

		pageClickHandler = function () {
			progressBarWidget = new tau.widget.Progress(progressBar);
			popupWidget = new tau.widget.Popup(popup),

			timeout1 = setTimeout(function() {
				progressBarWidget.value(50);
			}, 500);

			timeout2 = setTimeout(function() {
				progressBarWidget.value(100);
				idInterval = setInterval(function() {
					if (!progressBarWidget._isAnimating) {
						popupWidget.open();
					}
				}, 100);
			}, 1000);

		};

		clearHandler = function () {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
			clearInterval(idInterval);
		}

		button.addEventListener("click", pageClickHandler, false);
		page.addEventListener("pagehide", clearHandler, false);
		popup.addEventListener("popupafteropen", clearHandler, false);
	}());
</script>
```

In code we first take the reference to the `Custom Elements` elements. 
Then on `Button` click we initialize `Progress` and `Popup` widgets.
Next we update progress values up to 100%.
If `Progress` is not active (It means that the animation for moving bar stopped) we show the popup.
In `clearHandler` we clean up the code.


And thats it, our app will start and wait for user action.

## Wrap up

OK, so now we have to put it all together. Link to the finished demo application is
added at bottom. You can check it out in the browser. The app can be downloaded
and imported to Tizen SDK IDE and deployed to a device or emulator to checkout.

[Custom Elements DEMO](tutorial_apps/custom_elements/)

[Clock Application DEMO Project ZIP archive](tutorial_apps/custom_elements.zip)


