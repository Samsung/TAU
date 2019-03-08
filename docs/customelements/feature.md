## Introduction to Custom Elements
While building a web applications average developer use hundreds of tags. Just a fast look with `Inspector` shows
how many of `divs` and other tags are mixed together.

![structure](images/markupexample4.png "case1")

### Benefits of `CE`

The Custom Elements will help to embed those markup in to clean and understandable tags.

The second huge advantage is giving to the developers less things to remember about widgets structure.

### Benefits of `CE` in `TAU`

Widgets which are created with the `CE` tags are [pre-builded](builder/prebuilding-apps-with-tau-builder.html),
there is no need to run building phase.

Before custom elements developer had to know a complex structure for widgets.
It was easy to miss some particular attribute or tag and build process failed.
With some `CE` its enough to know just one tag.

As well as structure there is also less attributes in custom elements.
Instead of writing new `div` with `data-type` attribute we can just declare tag `tau-progress`.
For example initializing progress widget in CE is simpler:

```mobile
<tau-progress type="bar" value="30" id="progressbar" class="ui-progress">
```

in compare to

```mobile
<div data-type="bar" data-value="30" id="progressbar" class="ui-progress">
```

