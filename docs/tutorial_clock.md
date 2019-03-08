# Clock

In this tutorial we will create a basic clock application for wearable devices. Our
goals will include:

1. Basic clock face
2. Settings page
3. Face color changing
4. 24/12 clock type change
5. Alarms

The purpose of this tutorial is to create a Tizen web application step by step, find
out how this is accomplished from project startup to packaging. This lesson does not
focus on JavaScript code itself (like code quality, performance or code patterns) as
this exceeds the scope of the tutorial.

## Starting the project

Let's start by creating a new Tizen Web Project. To do this, open Tizen SDK IDE, and
click _File->New->Tizen Web Project_ then in the dialog window choose _Basic_ template
and type _Clock_ in the project name input box.

This will create a new clock project which we will implement with our code to accomplish
defined goals.

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

We start by creating our clock face page, which will be the starting point of our whole
application. It's really basic, just the time and AM/PM indicator. The following code
should be placed inside of body tag.

```wearable
<div class="ui-page ui-page-active" id="main">
	<div class="ui-content">
		<div id="time">00:00</div>
		<div id="ampm"></div>
	</div>
</div>
```

Now we have to program our clock measure and display the time. The JavaScript code
should be placed in separate file for more readability (and this is done in the
finished demo application, the link is placed at the end of the tutorial) but here
in the examples we will write it at the markup level.

```wearable
<div class="ui-page ui-page-active" id="main">
	<div class="ui-content">
		<div id="time"></div>
		<div id="ampm"></div>
	</div>
</div>

<script>
	(function () {
		"use strict";

		function setTime() {
			var date = new Date(),
					hours = date.getHours(),
					minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
					seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
					ampm = hours >= 12 ? 'PM' : 'AM',
					time = "";
			// Displays proper format 12/24h.
			if (localStorage.timeFormat === '12') {
					hours = hours > 12 ? hours - 12 : hours;
					document.getElementById('ampm').innerHTML = ampm;
					document.getElementById('time').className = '';
			} else {
					document.getElementById('ampm').innerHTML = '';
					document.getElementById('time').className = 'full';
			}

			hours = hours < 10 ? '0' + hours : hours;

			if (localStorage.timeSettings === 'show-seconds') {
					time = hours + ':' + minutes + ':' + seconds;
			} else {
					time = hours + ':' + minutes;
			}
			document.getElementById('time').innerHTML = time;
			window.setTimeout(setTime, 1000);
		}
		setTime();
	}());
</script>
```

As seen above we added support for AM/PM format by checking a localStorage value that
we will implement in the next chapter.

## Settings page

So now let's do the settings page. This will be fairly simple, just two elements (three
on Tizen devices, see alarm section) like 12/24h mode and color change. We will use
one addition to the page widget, mainly the header, since we need to show the user where
he is now. We will also use the `Listview` widget to list option elements.

First, let's start with the markup:

```wearable
<div class="ui-page" id="settings">
		<header class="ui-header">
				 <h2 class="ui-title">Settings</h2>

		</header>
		<div class="ui-content">
				<ul class="ui-listview">
						<li class="li-has-checkbox">
								<label>24h
										<input id="am_pm_toggle" type="checkbox">
								</label>
						</li>
						<li><a href="#color">color</a></li>
				</ul>
		</div>
</div>
```

This gives us a nice list of elements. We should implement the logic time mode set.
This is pretty straightforward, the color changing will be more fun ^\_^

```wearable
<div class="ui-page" id="settings">
		<header class="ui-header">
			 <h2 class="ui-title">Settings</h2>
		</header>
		<div class="ui-content">
			<ul class="ui-listview">
				<li class="li-has-checkbox">
					<label>24h
						<input id="am_pm_toggle" type="checkbox">
						</label>
				</li>
			<li><a href="#color">color</a></li>
		</ul>
	</div>
</div>
<script>
	(function () {
		"use strict";
		var am_pm = document.querySelector("#am_pm_toggle");
		function getAndSetAmPm() {
			if (am_pm.checked === true) {
					localStorage.timeFormat = '24';
				} else {
					localStorage.timeFormat = '12';
				}
		}
		if (localStorage.timeFormat === null) {
			localStorage.timeFormat = '12';
		}
		am_pm.addEventListener('change', function () {
			getAndSetAmPm();
		});
	}());
</script>
```

Now we should combine this with previous code and add some page changing ability, let's
make the clock face clickable and it should open the settings page.

```wearable
	<div class="ui-page ui-page-active" id="main">
		<div class="ui-content">
			<div id="time"></div>
			<div id="ampm"></div>
		</div>
	</div>
	<div class="ui-page" id="settings">
			<header class="ui-header">
				 <h2 class="ui-title">Settings</h2>
			</header>
			<div class="ui-content">
				<ul class="ui-listview">
					<li class="li-has-checkbox">
						<label>24h
							<input id="am_pm_toggle" type="checkbox">
							</label>
					</li>
				<li><a href="#color">color</a></li>
			</ul>
		</div>
	</div>

	<script>
		(function () {
			"use strict";

			function setTime() {
				var date = new Date(),
					hours = date.getHours(),
					minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
					seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
					ampm = hours >= 12 ? 'PM' : 'AM',
					time = "";
				// Displays proper format 12/24h.
				if (localStorage.timeFormat === '12') {
					hours = hours > 12 ? hours - 12 : hours;
					document.getElementById('ampm').innerHTML = ampm;
					document.getElementById('time').className = '';
				} else {
					document.getElementById('ampm').innerHTML = '';
					document.getElementById('time').className = 'full';
				}

				hours = hours < 10 ? '0' + hours : hours;

				if (localStorage.timeSettings === 'show-seconds') {
					time = hours + ':' + minutes + ':' + seconds;
				} else {
					time = hours + ':' + minutes;
				}
				document.getElementById('time').innerHTML = time;
				window.setTimeout(setTime, 1000);
			}

			setTime();

			var am_pm = document.getElementById('am_pm_toggle');
			function getAndSetAmPm() {
				if (am_pm.checked === true) {
						localStorage.timeFormat = '24';
					} else {
						localStorage.timeFormat = '12';
					}
					setTime();
			}
			if (localStorage.timeFormat === null) {
				localStorage.timeFormat = '12';
			}
			am_pm.addEventListener('change', function () {
				getAndSetAmPm();
			});

			var watchface = document.getElementById("main");
			watchface.addEventListener('vclick', function (ev) {
				tau.changePage('#settings');
			});
		}());
	</script>
```

## Color picker

!warning
Big examples
As the code is growing we will restrain ourselves from posting full examples, just functionalities that we want to emphasis. The full code can be viewed in the demo app at the tutorial end

The color picker is failry simple, as the main UI element is implemented by the browser
so we only need to get it's value.

```wearable
<div class="ui-page" id="color">
	<header class="ui-header">
		 <h2 class="ui-title">Clock Color</h2>
	</header>
	<div class="ui-content">
		Please choose color: <input type="color" id="cpicker" />
	</div>
	<footer class="ui-footer">
		<a href="#" class="ui-btn" id="color_save">Save</a>
	</footer>
</div>
<script>
	(function () {
		"use strict";
		var color_picker = document.querySelector("#cpicker"),
			color_save = document.querySelector("#color_save"),
			tempColor = "#fff";

		color_save.addEventListener('vclick', function () {
			tau.changePage('#main');
			localStorage.timeColor = tempColor;
		});

		color_range.addEventListener('change', function () {
			tempColor = this.value;
		});

		if (localStorage.timeColor === null) {
			localStorage.timeColor = "#fff";
		}
	}());
</script>
```

## Alarms

To get our alarm working we need to use Tizen Alaram API. We could also save our alarm
event locally and poll the time using setInterval, upon closing, we would lose the alarm
information (meaning, the application would have to run always for alarm function to work).
Tizen Alarm API starts the application when the alarm occurs.

For the API to work we first need to get the appId from current application:

```javascript
var appId = tizen.application.getCurrentApplication().appInfo.id;
```

To set an alarm event we need to create a new `ApplicationControl` object, and specify
the operation, operation uri and it's mime type

```javascript
var appControl = new tizen.ApplicationControl(
	'http://tizen.org/appcontrol/operation/main',
	'sounds/my_alarm_sound.mp3',
	'audio/*',
	null);
```

We obviously need to create the time object of the desired startup time and pass it
to `Tizen Alarm API` with the `appControl` and `appId` variables. Event adding can trigger
`WebAPIException` so it's best to enclose the code with a try-catch statement. Let's
make the alarm run on 2020-05-04 01:00:00 which will be the Star Wars day in 2020 ^\_^

```javascript
var appId = tizen.application.getCurrentApplication().appInfo.id,
appControl = new tizen.ApplicationControl(
	'http://tizen.org/appcontrol/operation/main',
	'sounds/my_alarm_sound.mp3',
	'audio/*',
	null),
alarmTime = new Date(2012, 5, 4, 1, 0, 0);

try {
	tizen.alarm.add(alarmTime, appId, appControl);
} catch (exception) {
	// handle error
}
```

OK, so the alarm is set, what now? Well now we have to handle the startup of our
application when the event occurs. Tizen will execute our clock app on that day,
we just need to get those parameters we have just set.

First of lets add and `audio` element to our markup, does not matter where, just inside
the body.

```html
<audio id="soundPlayer"></audio>
```

OK, we have got that, now let's cover the startup. We need to get the application id,
and the requested `ApplicationControl` object thats bound to the event, from that we
will extract the uri and set it as the src for the `audio` element.

```javascript
var appId = tizen.application.getCurrentApplication().appInfo.id,
	requestedControl = tizen.application.getCurrentApplication().getRequestedAppControl(),
	audioElement = document.querySelector("audio");

if (requestedControl.uri !== null) {
	audioElement.src = requestedControl.uri;
	audioElement.play();
}
```

And thats it, our app will start and happily play the sound we have set to play on
given date.

But to a user that's not obvious, we need to add something that will pop out to the
user, so let's use the simplest, a `Popup` widget. The markup is fairly simple:

```html
<div id="alarmPopup" class="ui-popup">
	<div class="ui-popup-header">Wake Up!</div>
	<div class="ui-popup-content">
		That's an alarm, wake up!
	</div>
	<div class="ui-popup-footer">
		<button id="alarmPopupClose" class="ui-btn">Close</button>
	</div>
</div>
```

Let's enhance our alarm starting code by adding close functionality and opening the
popup on start.

```javascript
var appId = tizen.application.getCurrentApplication().appInfo.id,
	requestedControl = tizen.application.getCurrentApplication().getRequestedAppControl(),
	audioElement = document.querySelector("audio");

if (requestedControl.uri !== null) {
	audioElement.src = requestedControl.uri;
	tau.openPopup("#alarmPopup");
	audioElement.play();
}

document.querySelector("alarmPopupClose", function () {
	tau.closePopup("#alaramPopup");
	audioElement.pause();
	tizen.alarm.removeAll();
});
```

## Wrap up

OK, so now we have to put it all together. Link to the finished demo application is
added at bottom. You can check it out in the browser, but bare in mind that alarms
wont work since there is no Tizen API in a normal browser. Still the app can be downloaded
and imported to Tizen SDK IDE and deployed to a device or emulator to checkout.

[Clock Application DEMO](tutorial_apps/clock/)

[Clock Application DEMO Project ZIP archive](tutorial_apps/clock_application.zip)


