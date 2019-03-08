# Basic page routing

TAU basically is just an UI framework, but since one of our goals was to provide a tool
to ease application building, it also provides basic functionality for changing pages
which is a requirement for multi-screen applications. The mechanics behind page routing
is pretty simple and straightforward. It works out for the box without any additional
JavaScript code in your application, or if you want, you can use the API to get more
powerful functionalities.

TAU routing is based on URL hash changes, it gives built in mechanism for history tracking
and it is easy to use. The framework responds to `#hashtag` changes and tries to display
the page that has the `id` attribute equal to hashtag value. This works for pages inside
the same html document.

A little different behaviour is reserved for external resources, which is as follows.
When an external pages is supplied to the routing engine it will fetch that page and
append it to current document, while changing the `base` elements `href` attribute to
that page path. This ensures all other resources like _css_, _js_ or _images_ will be
loaded from the correct path, but no real page reload does happen. Instead TAU switches
the current page to the new page.

## Routing without JavaScript

TAU will use use every `<A>` element in the page and bind routing methods for it. Also
all button instances that are based on that tag and have a proper `href` attribute will
be working with the frameworks router. The active page has an `ui-page-active` class
assigned. It's good to set that class for yourself to be sure the page you want will
be displayed.

```mobile-wearable-tv
<div class="ui-page ui-page-active" id="first">
	<div class="ui-content">
		<a href="#two">Go to page two</a>
	</div>
</div>

<div class="ui-page" id="two">
	<div class="ui-content">
		<a href="#first">Go to page one</a>
	</div>
</div>
```

If you remember [application visual layout](application_visual_layout.html) chapter
this was used in the tabbar example. As tabbar elements are links we just created three
pages and duplicated the header content, just changing the active element in the tabbar.
TAU router handled everything else.

```mobile
<div class="ui-page" id="first">
  <div class="ui-header">
    <div class="ui-tabbar" data-auto-change="false">
      <ul>
        <li><a href="#first" class="ui-btn-active">First</a></li>
        <li><a href="#second">Second</a></li>
        <li><a href="#third">Third</a></li>
      </ul>
    </div>
  </div>
  <div class="ui-content">
    First page
  </div>
</div>
<div class="ui-page" id="second">
  <div class="ui-header">
    <div class="ui-tabbar" data-auto-change="false">
      <ul>
        <li><a href="#first">First</a></li>
        <li><a href="#second" class="ui-btn-active">Second</a></li>
        <li><a href="#third">Third</a></li>
      </ul>
    </div>
  </div>
  <div class="ui-content">
    Second page
  </div>
</div>
<div class="ui-page" id="third">
  <div class="ui-header">
    <div class="ui-tabbar" data-auto-change="false">
      <ul>
        <li><a href="#first">First</a></li>
        <li><a href="#second">Second</a></li>
        <li><a href="#third" class="ui-btn-active">Third</a></li>
      </ul>
    </div>
  </div>
  <div class="ui-content">
    Third page
  </div>
</div>
```

## Routing API

You can also change pages trough TAU API, this basically consists of using `tau.changePage()`
method.

```mobile-wearable-tv
<div class="ui-page ui-page-active" id="first">
	<div class="ui-content">
		You are viewing the first page of the example.
		<button id="first-button">Click here to change to page two</button>
	</div>
</div>
<div class="ui-page" id="second">
	<div class="ui-content">
		This is the second page of the example.
		<button id="second-button">Click here to change to page one</button>
	</div>
</div>
<script>
	var el1 = document.getElementById("first-button"),
		el2 = document.getElementById("second-button");
	el1.addEventListener("click", function () {
		tau.changePage("#second");
	});
	el2.addEventListener("click", function () {
		tau.changePage("#first");
	});
</script>
```

If the `ID` of the element is not known (you did not set it yourself) you can get it from
the HTMLElement, since TAU __always__ adds a unique `ID` property if none is found

```mobile-wearable-tv
<div class="ui-page ui-page-active">
	<div class="ui-content">
		<button id="first-button">Click here to change to page two</button>
	</div>
</div>
<div class="ui-page">
	<div class="ui-content">
		<button id="second-button">Click here to change to page one</button>
	</div>
</div>
<script>
	var pages = document.querySelectorAll(".ui-page"),
		el1 = document.getElementById("first-button"),
		el2 = document.getElementById("second-button");

	pages[0].addEventListener("pageshow", function () {

		tau.engine.instanceWidget(pages[1], "Page");

		el1.addEventListener("click", function () {
			tau.changePage("#" + pages[1].id);
		});
		el2.addEventListener("click", function () {
			tau.changePage("#" + pages[0].id);
		});
	});

</script>
```

## External resources

TAU can also load pages from external resources. This is pretty straightforward. Just
supply the proper local adress in the `href` attribute of the link like so:

```mobile-wearable-tv
<div class="ui-page">
	<div class="ui-content">
		<a href="external_text.html">Change to external</a>
	</div>
</div>
```

But how to create an external link that is not supposed to be handled by TAU router?
It's pretty much simple, just either `rel="external"`, `data-ajax="false"` or `target="_self"`
attributes.

```mobile-wearable-tv
<div class="ui-page">
	<div class="ui-content">
		<a href="external_text.html" target="_self">Change to external</a>
	</div>
</div>
```

