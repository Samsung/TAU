# How to use Controller

Controller controls navigation in applications.
It is a part of TAU but can work standalone without the rest of the TAU.
If it is combine with TAU then it cooperates with router module from TAU.

## Creating pages on the fly

Example below shows how to create dynamic page.
It is important to use `deferred.resolve(page);` this operation runs router on element which is applied to resolve and builds page/popup on element.

```
<script type="text/javascript">
	var controller = tau.Controller.getInstance();
	controller.addRoute("page-dynamic", function (deferred) {
		var page = document.createElement("div");
		page.dataset.role = "page";
		page.textContent = "Hello world!";
		deferred.resolve(page);
	});
</script>
```

The code above has the following flow:
* "page-dynamic" route is registered
* user is navigated to "page-dynamic"
* callback is called
* the dynamic page is created
* the page is showed by router

## Using params in routes

Example below shows how to pass params to next page.

```
<script type="text/javascript">
	var controller = tau.Controller.getInstance();
	controller.addRoute("page-params/:param1/:param2", function (deferred, param1, param2) {
		deferred.resolve(
			'<div data-role="page">' +
				'<div>param1: <strong>' + param1 + '</strong></div>' +
				'<div>param2: <strong>' + param2 + '</strong></div>' +
			'</div>'
		);
	});
</script>
```

The code above has the following flow:
* "page-params" route is registered
* parameter is added to the registered route
* user is navigated to "page-params"
* callback which pass parameters is called
* the page with the given parameters is created in callback

## Loading pages from string

Example of simple page created from string.

```
<script type="text/javascript">
	var controller = tau.Controller.getInstance();
	controller.addRoute("page-string", function (deferred) {
		deferred.resolve('<div data-role="page">Hello world!</a>');
	});
</script>
```

The code above has the following flow:
* "page-string" route is registered
* user is navigated to "page-string"
* callback is called
* the page is rendered from string

## Loading pages from templates

Open a page defined in template.

```
<script type="text/javascript">
	var controller = tau.Controller.getInstance();
	controller.addRoute("page-template", function (deferred) {
		tau.template.render("templates/page-template.html", {}, function (status, data) {
			if (status.success) {
				deferred.resolve(data);
			} else {
				deferred.reject();
			}
		});
	});
</script>
```

The code above has the following flow:
* "page-template" route is registered
* user is navigated to "page-template"
* template is downloaded by `tau.template.render`
* template is loaded
* data to router is passed by template
* template is rendered if the data was retrieved
* if not then the router will stop the action and page from template will not be loaded. This is done by `deferred.reject` method

TAU has template mechanism that supports multiple view based on which device you are working.
You can define multiple views of one template:

Files in MyApplication/src/templates:

 - page-template.html _file with default template_
 - page-template.mobile.html _file with template for mobile profile_
 - page-template.tv.html _file with template for TV profile_
 - page-template.wearable.html _file with template for wearable profile_

Open a page defined in template.

	<script type="text/javascript">
		var controller = tau.Controller.getInstance();
		controller.addRoute("page-template", function (deferred) {
			tau.template.render("templates/page-template.html", {}, function (status, data) {
				if (status.success) {
					deferred.resolve(data);
				} else {
					deferred.reject();
				}
			});
		});
	</script>

At first it tries to find template with the name of current profile in suffix. If it can't find specific view it will choose "page-template.html".

