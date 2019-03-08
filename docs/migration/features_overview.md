# Features overview

Main features of the new release:

1. **Compatibility with Web UI Framework** - backward compatibility is a very important aspect when releasing a new
 platform version. We designed the new core to be compatible with previous Web UI Framework and jQuery Mobile version.
1. **jQuery Mobile independence** - for all developers who want to create ultra fast applications without
 jQuery Mobile flavor.
1. **Enhanced widgets** - holding backward compatibility is important, but what makes the difference is the new lighter
 implementation of well-known widgets. We have not only changed the look but also what happens under the hood to save
 more juice inside your battery.
1. **Performance** - we have constantly have improved the performance of single widgets using Vanilla JS and profit from
 all the goodies inside Tizen's WebKit engine.

## New widgets overview

#### Same structure and classes
One of the goals for TAU was to stay compatible with Web UI Framework. As we could do deep improvements thanks to resigning
 from any code depended on jQuery inside JavaScript engine, we could not do the same for widget structure.
We understand that every developer wants to give unique experience for his users, so we were spending much time on
 making sure we have the same structure for compatible widgets. You do not need to change many of your CSS selectors to
 archive the same effect after migrating to TAU.

#### Two way of creating widgets
We leave you the choice how to use our Framework.
The first is to just make sure if everything works as expected after changing the library path to TAU.
The second is to dive into the new API and use `tau.widget.` namespace instead of old jQuery syntax.
Now your apps do not need to be dependent on jQuery. If you like you can even go Vanilla JS.

#### Building process split
Every widget creation has been separated into phases.
The first step is fetching widget options and building the whole required DOM structure. Later framework adds all the
 required event listeners and sets the initial configuration which may be required by the widget to run properly.

One of the most important benefit gained by splitting the process is that we are now able to prebuilt the whole
 application before start.
The prebuilder (called `TAU Builder`) is a wide subject.

## Introducing TAU Widget API

One of the key features of the new release was to introduce a jQuery Mobile free version. That required some major
 changes under the hood but also allowed to introduce something new.

### Widget instancing

The key part of any UI Framework are the components. In TAU we call them UI widgets (same naming as jQuery).
Most of the applications created with old Web UI Framework probably use the jQuery syntax for creating user interface
 components. Same goes for the TAU, but here we can archive the same effect in two ways.

#### jQuery Style
The first one stays jQuery Mobile (although underneath some other magic is happening).

For better comparison we will remind how it looks:

```
$(".element-to-select").widgetname(/* options */);
```

That creates a standard `widgetname` widget for selected elements and registers all the required events.

#### TAU Style
The second way is to use the new TAU API and become independent of jQuery (for example when you prefer to use other libs
 ).

```
var element; // Any HTMLElement eg. element = document.querySelector('.element-to-select');
tau.widget.WidgetName(element /*, options */);
```

This may not look like simpler code to use, but has the big advantage of not running through jQuery layer.
`tau.widget.[widgetName]` will return a widget instance, that can be used to manipulate various properties and
 call methods upon.

!warning
NOTE: Elements count
jQuery syntax allows build widget on a collection of elements (or jQuery object). TAU allows only one element as the
 parameter for widget creation.

### Methods call

As the new UI Framework shares most of the widget with jQuery Mobile, developers expect to use the same API.
And that's true. We have provided the same public API for all jQM-like widgets.

Simple example below (using `Popup` and `.open()` method).

**jQuery**

```
$(".popup-to-select").popup('open');
```

**TAU**
```
tau.widget.Popup(element).open();
// or
var instance = tau.widget.Popup(element);
instance.open();
```

## Framework flow

### First start

In general we can separate few stages of framework start.

1. Internal setup (including widget registration)
1. Engine start and router initialization
	1. First page initialization
	1. Widget creation
	1. Widget event binding

In those stages engine does prepare all required widget definitions,
 adds the core event listeners and afterwards opens first page and creates
 all found widgets.

More detailed description below:

#### Internal setup

In this stage we gain as much as possible information about the application to store it internally for faster lookups.
Than we load the theme for the app if the CSS file was not included before.

During initialization, the engine registers all widgets that use `engine.defineWidget()` and are shipped with
 TAU library. You do not need to know the details how the whole process works. The most interesting
 part is that after every widget registration a `widgetdefined` event is triggered on the `document` object.
 While listening to that event you may know what widgets got loaded into the engine (this could be helpful when defining
 your own widgets).

#### Engine start and router initialization

At first the engine starts by triggering `tauinit` event on `document` object.
This event is responsible for many processes inside the library, one of the most important is the start of jQM layer.

When using TAU with jQuery we do initialize the jQM layer (jQuery Mobile layer) for backward compatibility.
There is a lot going on underneath including registering widgets inside jQuery namespace and initialization of the core
 objects of jQM. Those operations take much time (when looking on the general TAU launch time) and that's why we
 encourage you to use [pure TAU version](./migration/switching_apps_to_tau.html#Moving-from-jQuery-Mobile-to-pure-TAU) in your
 apps. The most important thing here is to mention that jQM layer triggers `mobileinit` event (which is very important
 for all apps that stay with jQuery Mobile).

Next comes the `beforerouterinit` event triggered right before the router starts processing.
The router is one of the core components in TAU framework. It is responsible for changing `Pages` and handling `Popups`
 and `Dialogs` routines. Just after engine start, router tries to find the first page to show. For the first page to
 show Router component checks if it requires building (as it may not because of `TAU Builder`). In case something needs
 to be build engine travels across the whole page in search of widgets and build them in tree order.

Before each widget build a `[widgetname]beforecreate` event is triggered (eg. `buttonbeforecreate` in case of `Button`
 widget).
Later few other events appear, in following order:
* `widgetbuilt` and `[widgetname]create` - after widget build phase (whole DOM should be ready)
* `widgetbound` - after widget binding phase (widget event listeners are attached)

In case of events mentioned above, you will get a widget instance reference as data inside the `Event` object.
