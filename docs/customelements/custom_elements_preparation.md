## Custom elements preparation

There are two ways to create custom elements widgets in `TAU`.
It depends on tag associated with widget.
If it needs to inherit the semantics of the element type it extends.
Some widgets can be defined by extension with `is` attribute and also by tag name.

### Custom Elements by tag

Custom elements in `TAU` are used with the usage of `tau` hyphen and the name for widget.
The registered tags are given in the widget definition.

List of `TAU` widgets for mobile and their definition by tags:

* widget progress | `<tau-progress type="activitybar" class="ui-progress"></tau-progress>`
* widget scrollview | `<tau-scrollview class="ui-content"></tau-scrollview>`
* widget listview | `<tau-listview class="ui-listview"></tau-listview>`
* widget pageindicator | `<tau-pageindicator class="ui-page-indicator" id="pageIndicator" number-of-pages="4" style="transform: translate3d(-50%, -100%, 0); bottom: 0; z-index: 101;"></tau-pageindicator>`
* widget textenveloper | `<tau-textenveloper id="textEnveloper" class="ui-text-enveloper"></tau-textenveloper>`
* widget sectionchanger | `<tau-sectionchanger id="gallerySection" class="ui-content ui-section-changer" data-scroll="none" orientation="horizontal">	</tau-sectionchanger>`
* widget page | `<tau-page class="ui-page" id="demo-page"></tau-page>`
* widget gridview | `<tau-gridview id="gridview" class="ui-gridview" label="out"></tau-gridview>`
* widget expandable | `<tau-expandable class="ui-expandable"></tau-expandable>`
* widget panel | `<tau-panel id="panel2" class="ui-panel" style="background-color: #EE5757"></tau-panel>`
* widget panelchanger | `<tau-panelchanger id="panelChanger" class="ui-panel-changer"></tau-panelchanger>`
* widget tabbar | `<tau-tabbar class="ui-tabbar"></tau-tabbar>`
* widget indexscrollbar | `<tau-indexscrollbar class="ui-indexscrollbar" id="indexscrollbar"></tau-indexscrollbar>`
* widget popup | `<tau-popup id="ctxpopup_horizontal_basic" class="horizontal-ctxpopup ui-popup" overlay="false"></tau-popup>`
* widget button | `<tau-button class="ui-btn" id="button1test" inline="false" style="circle"></tau-button>`
* widget floatingactions | `<tau-floatingactions class="ui-floatingactions">`

### Type Extension Custom Elements

This way is a specially used for controls tags. For example type extension for button element.

```
<button is="tau-button">Go</button>
```

To use the element, use the original tag and specify the custom tag name using the `is` attribute like above.

It would inherit the `button` element's name, role, state and properties.
Custom Element will have inherit focus and keyboard interaction behaviours.

List of `TAU` widgets for mobile and their definition by `is` extension:

* widget search | `<input name="search" id="demo-page-search-input" value="" is="tau-searchinput">`
* widget checkbox | `<input name="checkbox-1" id="checkbox-1" is="tau-checkbox">`
* widget dropdownmenu |	`<select name="select-custom-8" id="select-custom-8" is="tau-dropdownmenu" native-menu="false"></select>`
* widget radio | `<input name="radio-choice" id="radio-choice-1" value="choice-1" checked="checked" is="tau-radio">`
* widget slider | `<input id="normal2" name="mySlider1" type="range" value="5" min="0" max="10" is="tau-slider">`
* widget toggleswitch | `<select name="flip-1" id="flip-1" class="ui-toggleswitch" is="tau-toggleswitch">`
* widget textarea | `<textarea class="code-textarea formfield" readonly="readonly" disabled is="tau-textinput">&lt;button&gt;Button&lt;/button&gt;</textarea>`
* widget button | `<button is="tau-formbutton" inline="true">DataInline True</button>`

There are widgets which can be defined in both ways, for example button wideget.