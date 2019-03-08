# TAU Introduction

TAU is the standard web UI library for Tizen platform. The acronym stands for Tizen
Advanced UI Library. It is a collection of UI controls called *widgets* which simplify
application coding.

## History

TAU originated from Tizen Web UI Framework Library (standard library for Tizen 2.2.1),
which was mainly based as an extension to jQuery Mobile. Key features of the former were
coding simplification and app creation speed. With that in mind TAU was created as the
framework *advanced to the next level*. TAU is a standalone UI library, without jQuery
overhead, but that duo can be used as explained in this [guide later](using_jquery_with_tau.html).

## Benefits

When using TAU you will get many benefits usable in your code.

* A standalone library, meaning no additional libraries are needed
* Can be used with jQuery, TAU exposes a special API to the jQuery object which is
  identical to jQuery Mobile, migration is painless
* Written with speed in mind, all of the code is tweaked for maximum performance
* Application can be _built_ to dramatically improve startup performance
* ECMAScript5 and HTML5 compliant
* Large and open API, methods and core function (event utility functions) are available and not hidden to the developer
* Customizable, easy to extend (and create new widgets)
* Optimized for wearable, mobile and TV devices
* Supports device profiles (mobile, wearable and TV)

## Simple example

```mobile-wearable-tv
<div class="ui-page ui-page-active">
  <div class="ui-header">MyApplication</div>
  <div class="ui-content">Hello world</div>
  <div class="ui-footer">
    <button id="closeBtn" class="ui-btn">Close</button>
  </div>
</div>
<script>
    var page = document.querySelector(".ui-page");
    page.addEventListener("pageshow", function () {
      document.getElementById("closeBtn").addEventListener("click", function () {
        window.close();
      });
    });
</script>
```

!warning
Examples in browsers
Some of the functionality shown in the examples may not work properly in a desktop browser, to fully get the TAU experience use a real Tizen device or Tizen emulator from the Tizen SDK.

The example above shows a simple application, with a header and a button in the footer
that closes the application. Click on the preview to check out how it works on different
framework profiles.

!danger
Example for profiles
TAU Profiles (mobile, TV, wearable) have differences, so some of the examples will not have preview buttons for specific profiles.

## Where to get it

The framework is included on all Tizen devices and the SDK emulator (starting from Tizen 2.3). Just create
a new web application in the Tizen SDK IDE.

## What next?

If you are new to the whole standalone web application concept please checkout [Application visual layout](application_visual_layout.html) part.

But if you can wait to get to the fun, checkout the widget guide or the tutorials.

__Have some coding fun!__

