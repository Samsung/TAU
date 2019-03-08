# Switching your Apps to TAU

It's highly recommendable to use our framework as it lets to optimize applications to the next level.
This is a major fact for clients to be interested in applications.


## Basics

### How does the structure of folders changed
In Previous version of library, default folder structure are:
Structure of library `tizen-web-ui-fw` is like below:

```
tizen-web-ui-fw/
└── latest/
    ├── js/
    │   ├── cultures/
    │   ├── jquery.min.js
    │   ├── tizen-web-ui-fw-libs.min.js
    │   └── tizen-web-ui-fw.min.js
    └── themes/
        ├── tizen-black/
        │   ├── images/
        │   ├── theme.js
        │   └── tizen-web-ui-fw-theme.min.css
        └── tizen-white/
            ├── images/
            ├── theme.js
            └── tizen-web-ui-fw-theme.min.css

```
now structure of TAU library are:

```
tau/mobile/
├── js/
│   ├── cultures/
│   ├── jquery.js
│   ├── jquery.min.js
│   ├── tau.js
│   └── tau.min.js
└── theme/
    └── default/
        ├── images/
        ├── tau.css
        ├── tau.min.css
        ├── theme.js
        └── theme.min.js

```

TAU library with minified version is located in folder `mobile/js`. Default
TAU theme is located in folder `mobile/theme`.
TAU are loaded the same way like previous version from device location
`/usr/share/`.

###Default structure of application

When you build some application in Tizen IDE, application has folder structure
like below, all files are grouped in seperated folders.
Folder js is destination for application main files. Other files like images,
templates or styles are collected in separated folders:

```

Application/
├── css/
├── images/
├── js/
├── tizen-web-ui-fw/
│   └── latest/
│        ├── js/
│        └── themes/
├── config.xml
└── index.html

```

In new version structure of the application structure in compare to previous,
only location of tizen library changed. TAU library is located in the folder lib
with all needed files. Files `config.xml` and `index.html` lie in the main
folder of application. Recommended structure is below:
```

Application/
├── css/
├── images/
├── js/
├── lib/
│   └── tau/
│        └── mobile/
├── config.xml
└── index.html


```
### Build app with library TAU


### Change existing app to app with library TAU for example Single Page Application, from Tizen SDK

If you want use the TAU library in existing app, you should add a folder library
files and you should change source path to library from `tizen-web-ui-fw.js` to
`tau.js` and also path to `jquery.js` like below:

Before:
``` html
<script src="tizen-web-ui-fw/latest/js/jquery.min.js"></script>
<script src="tizen-web-ui-fw/latest/js/tizen-web-ui-fw-libs.min.js"></script>
```
After:
``` html
<script src="lib/tau/mobile/js/jquery.min.js"></script>
<script src="lib/tau/mobile/js/tau.min.js"></script>
```

Important note: Before Tizen Web UI Framework supported templates by default.
Currently if you want to use jQuery templates in application then you need to add
[jQuery Templates](http://github.com/jquery/jquery-tmpl) manually like below.
Download file from website to your project.

When migrating application a specially pay attention when the widgets:
ExtendableList, VirtualList, VirtualGrid use templates.

``` html
<script src="lib/tau/mobile/js/jquery.min.js"></script>
<script src="js/jquery.tmpl.min.js"></script>
<script src="lib/tau/mobile/js/tau.min.js"></script>
```

Next step you can add path to source to default css style `tau.css`.

Before:
``` html

<script src="tizen-web-ui-fw/latest/js/tizen-web-ui-fw.min.js" data-framework-theme="tizen-white"></script>
```
After:
``` html
<link rel="stylesheet" type="text/css" href="lib/tau/mobile/theme/default/tau.css" />

```

Adding this css style is not required, because if you do not add css library, the framework loads the `tau.css` automatically.


## Stay with jQuery Mobile syntax

Using TAU doesn't mean that you need to resign from jQuery Mobile syntax. Our Library supports
jQuery syntax and lets you to define widgets in the same way. Regarding the API please refer to
[jQuery UI API](http://api.jqueryui.com/).

### Supported components and features

DOM structure for widgets is same as widgets defined by jQuery.
Framework widgets can be used like in jQuery Mobile. Currently in TAU there is 70% widgets
with same API and behaviour like in jQuery Mobile.


List of the common widgets for both frameworks:

1. Button Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <div id="button">button</div>
        </div>
    </div>
<script>
    $('#button').button({mini: true});
</script>
```

2. Checkboxradio Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <input type="checkbox" name="checkbox-yes" id="checkbox-yes" />
            <label for="checkbox-yes">Yes</label>
        </div>
    </div>
<script>
    $('#checkbox-yes').checkbox('enable');
</script>
```

3. Collapsible Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <div id="collapsible" data-role="collapsible" data-inset="false">
                <h1>Collapsible head</h1>
                <div>Content</div>
            </div>
        </div>
    </div>
<script>
    var collapsible = $("#collapsible").collapsible({mini: true});
</script>
```

4. Collapsibleset Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <div id="collapsibleset" data-theme="c" data-content-theme="d">
                <div data-role="collapsible" data-inset="false">
                    <h6>Collapsible head 1</h6>
                    <div>Content</div>
                </div>
                <div data-role="collapsible" data-inset="false">
                    <h6>Collapsible head 2</h6>
                    <div>Content</div>
                </div>
            </div>
        </div>
    </div>
<script>
    var collapsibleset = $("#collapsibleset").collapsibleset();
</script>
```

5. Controlgroup Widget
```mobile
    <div data-role="controlgroup" id="mycontrolgroup">
        <a href="#" data-role="button">Yes</a>
        <a href="#" data-role="button">No</a>
        <a href="#" data-role="button">Cancel</a>
    </div>
<script>
    $('#mycontrolgroup').controlgroup();
</script>
```

7. Flipswitch Widget (in TAU framework its implemented as a part of Slider widget)
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <label for="flip-3">2. Text toggle switch:</label>
            <select name="flip-3" id="flip-3" data-role="slider">
                <option value="nope">Nope</option>
                <option value="yep">Yep</option>
            </select>
        </div>
    </div>
    <script>
        $('#lip-3').slider();
    </script>
```

8. Footer Widget (it's a part of page widget)
```mobile
    <div class="ui-page">
        <div data-role="footer">
            footer
        </div>
    </div>
```

9. Header Widget (it's a part of page widget)
```mobile
    <div class="ui-page">
        <div data-role="header">
            header
        </div>
    </div>
```

10. Listview Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <ul id="list">
                <li>Anton</li>
                <li>Arabella</li>
                <li>Barry</li>
                <li>Bill</li>
            </ul>
        </div>
    </div>
<script>
    $('#list').listview();
</script>
```

11. Navbar Widget
```mobile
    <div class="ui-page">
        <div class="ui-header" data-role="header">
            <div id="ns-navbar">
                <ul>
                     <li><a href="a.html">One</a></li>
                     <li><a href="b.html">Two</a></li>
                </ul>
            </div>
        </div>
    </div>
<script>
    $("#ns-navbar").navbar();
</script>
```

13. Page Widget
```mobile
    <div id="myPage">Content</div>
<script>
    var page = $("#myPage").page();
</script>
```

14. Popup Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <div id="popup">
	        <p>This is a completely basic popup, no options set.</p>
            </div>
        </div>
    </div>
<script>
    $(document).on("pageshow", function(){
        var popup = $("#popup").popup();
    	popup.popup("open");
    });
</script>
```

15. SelectMenu Widget
```mobile
    <select id="selectmenu" data-native-menu="false">
        <option value="1">The 1st Option</option>
        <option value="2">The 2nd Option</option>
    </select>
<script>
    $(document).on("pageshow", function(){
        $("#selectmenu").selectmenu();
    });
</script>
```

16. Slider Widget
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <select id="slider" name="flip-11" data-role="slider">
                 <option value="off"></option>
                 <option value="on"></option>
            </select>
        </div>
    </div>
<script>
    $( "#slider" ).slider();
</script>
```

17. Textinput Widget
```mobile
    <div class="ui-page" id="popupwindow-demo">
        <div class="ui-content" data-role="content">
            <form>
                <label for="text-1">Text input:</label>
                <input type="text" name="text-1" id="text-1" value="">
            </form>
        </div>
     </div>
<script>
    $("#text-1").textinput();
</script>
```

18. Tabbar Widget
```mobile
    <div class="ui-page">
        <div class="ui-header">
            <div class="ui-tabbar">
                <ul>
                    <li><a href="#" class="ui-btn-active">First</a></li>
                    <li><a href="#">Second</a></li>
                    <li><a href="#">Third</a></li>
                </ul>
            </div>
        </div>
        <div class="ui-content">
            This page has three tabs in the header.
        </div>
    </div>
    <script>
        $("#ready-for-tab-bar").tabbar();
    </script>
```

When jQuery is loaded then it's possible to control their behaviour by calling public methods.
Public methods can be called like in jQuery mobile.

For example let assume that we have popup widget and we want to close with
 jQuery syntax.
```mobile
    <div class="ui-page">
        <div class="ui-content" data-role="content">
            <a href="#mypopup" data-role="button" id="myButton" data-inline="true" data-rel="popup" data-position-to="window">Popup with text</a>
            <div id="mypopup" data-role="popup">
                <div class="ui-popup-text">
                    <p>
                        Pop-up dialog box, a child window that blocks user inter-act to the parent windows
                    </p>
                </div>
            </div>
        </div>
     </div>

<script>
   $('#myButton').bind('vclick', function() {
	$('#mypopup').popup("open");
        window.setTimeout(function() {
            $('#mypopup').popup("close")
        }, 1600);
   }) ;
   window.setTimeout(function() {
       $('#myButton').trigger("vclick");
   }, 100);
</script>
```

### Framework's jQM layer explained

TAU framework contains jqm module which works as a proxy between TAU framework and jQuery Mobile.
It contains eight sub-modules:

1. `defaults` - add TAU framework properties to the jQuery object
2. `widget` - register tau widgets in jQuery
3. `engine` - maps engine object from TAU namespace to jQuery Mobile namespace
4. `event` - proxy events between frameworks
5. `loader` - loader widget API
6. `router` - this object maps router from TAU namespace to jQuery Mobile namespace
7. `support` - maps support object from TAU namespace to jQuery Mobile namespace
8. `colors` - maps color support object from TAU namespace to jQuery Mobile namespace


## Moving from jQuery Mobile to pure TAU

It's very easy to move from jQuery Mobile to pure TAU. First of all,
there is no need of changing the DOM structure of the application.

To move away from jQuery you may use the TAU constructors for widgets (examples in `supported` components and features chapter or below).
TAU library doesn't need jQuery to be included if you have only used it for including Web UI widgets you may now remove it completely.

Pure TAU which is similar to jQuery Mobile has a wide support for the additional
 API.

This APIs are highly optimized for Webkit engine. This ensures that the library runs as fast as possible.
Which is very important for applications written for smaller devices.
Handy methods are located in utils, events, theme objects.

### Handling syntax differences

The jQuery constructors of widgets
```mobile
<div class="ui-page ui-page-active">
    <div class="ui-content">
        <div id="button">button</div>
    </div>
</div>
<script>
    $('#button').button({mini: true});
</script>
```

With TAU native constructors like
```mobile
<div class="ui-page ui-page-active">
    <div class="ui-content">
        <div id="button">button</div>
    </div>
</div>
<script>
    var buttonElement = document.getElementById("button"),
        button = tau.widget.Button(buttonElement, {mini: true});
</script>
```

### Why?

It's highly recommendable to switch intro pure TAU framework because:

1. TAU is optimize for WebKit engine.
2. Contains only the code written for WebKit. There is no code dependent on IE
 and Geco.
3. Thanks to the pre-build phase the applications start faster.
4. Has a powerful APIs to handle DOM and Events.

### TAU Widget instance explained

All the widgets inherit from BaseWidget. BaseWidget provides common methods
 which are used to control widgets:
1. `disable` - Disable widget.

2. `enable` - Enables widget.

3. `configure` - Configures widget object from definition.

4. `build` - Builds widget

5. `init` - Initializes widget.

6. `bindEvents` - Binds widget events.

7. `destroy` - Destroys widget.

8. `refresh` - Refreshes widget.

9. `option` - Gets or sets options of the widget.

10. `value` - Gets or sets value of the widget

11. `on` - Adds event listener to widget's element.

12. `off` - Removes event listener from  widget's element.

The instances of the widgets is created automatically when the first page is
 loaded or during the navigation.


### TAU Utils / helpers

Utils object contains:

1. `animation` library - simplify using animations
2. `DOM` manipulation APIs
3. `anchor` enabling / disabling
4. `array` manipulation methods
5. `bezierCurve` calculation
6. `handling callbacks`
7. `colors` formats
8. `data attributes managment` - getting / setting data for DOM elements
9. `deffering events`
10. `easing` utility - calculates time function for animations
11. `globalize` - support for globalize options
12. `grids` - helps to create grids
13. `loading` external resources
14. `object` API - helps to work with objects
15. `paths` - helps with parsing of the URL addresses
16. `selectors` - API to select DOM elements
17. `zoom` - enabling and disabling zooming

Events object contains:

1. definition of `gestures`
2. `hardwarekey` support
3. adds `orientation change` support
4. `page` - responsible for changing pages
5. `pinch` - ads new events
6. `throttledresize` - supports throttledresize event
7. `touch` - reimplementation of jQuery Mobile touch events
8. `virtual mouse events` - reimplementation of jQuery Mobile virtual mouse events

## Keeping old Web UI Framework

Old framework `Web UI Framework` is deprecated. Currently its provided on the devices and emulators but
it will be removed anytime. If you still want to use it, then please make the copies of the framework.
If the `Web UI Framework` will be removed then you will have to attach it manually.
