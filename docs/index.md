# TAU Introduction

TAU is the standard web UI library for Tizen platform. The acronym stands for Tizen
Advanced UI Library. It is a collection of UI controls called *widgets* which simplify
application coding.

## Benefits

When using TAU you will get many benefits usable in your code:

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

## Getting started
There are few simple possibilites to get started using TAU

### Using Tizen Studio
1. Download and install (Tizen SDK)[https://developer.tizen.org/]
2. Create Sample Web App TAU project. TAU library will be already included

### Using WATT
Note: Online WATT server is currently under preparation.
You can find out more about WATT
(Tizen SDK)[https://github.com/Samsung/WATT]

### Including TAU in your source code
```html
<script src="../lib/tau/mobile/js/tau.js"></script>
```
## Where to get it
* [TAU source code](https://github.com/Samsung/TAU/)
* [TAU releases](https://github.com/Samsung/TAU/releases)

## Simple usage example
```html
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

## Documentation

* [TAU API Reference](https://developer.tizen.org/dev-guide/5.0.0/org.tizen.web.apireference/html/ui_fw_api/ui_fw_api_cover.htm)

If you are new to the whole standalone web application concept please checkout [Application visual layout](application_visual_layout.html) part.

But if you can wait to get to the fun, checkout the more stuff like:
* [widget introduction](introduction_to_widgets.md)
* how tos
  * [widget creation](how_to_create_own_widget.md)
  * [controller usage](how_to_use_controller.md)
  * [globalize usage](how_to_use_globalize.md)
  * [declarative widgets](how_to_write_declarative.md)
* tutorials
  * [clock](tutorial_clock.md)
  * [gallery](tutorial_gallery.md)
  * [notes](tutorial_notes.md).


## History

TAU originated from Tizen Web UI Framework Library (standard library for Tizen 2.2.1),
which was mainly based as an extension to jQuery Mobile. Key features of the former were
coding simplification and app creation speed. With that in mind TAU was created as the
framework *advanced to the next level*. TAU is a standalone UI library, without jQuery
overhead, but that duo can be used as explained in this [guide later](using_jquery_with_tau.html).

__Have some coding fun!__

