## Breaking changes
 Below we compare the state of widgets in Tizen Web UI Framework and TAU

| tizen-web-ui-fw   | TAU                |  comments
|-------------------|--------------------|:--------------:|
| Button            | Button             | |
| Checkbox          | Checkboxradio      | merged         |
| Checkboxradio     |                    | |
| Circullarview     | Circullarview      | depreciated    |
| Collapsible       | Collapsible        | |
| Collapsibleset    | Collapsibleset     | |
| Controlgroup      | Controlgroup       | |
| ContextPopup      |                    | |
| DateTimePicker    | Datetimepicker     | depreciated    |
| Dialog            | Dialog             | |
|                   | Drawer             | new            |
| Extendablelist    | Extendablelist     | |
| Fastscroll        | Fastscroll         | |
| Fixedtoolbar      |                    | merged         |
| Flip toggle switch | Fieldcontain      | |
| Gallery           | Gallery            | |
| Gallery3D         |                    | |
| ListDivider       | Listdivider        | |
| Listview          | Listview           | |
| Autodivider       | ListviewAutodivider| |
| ListviewFilter    | ListviewFilter     | |
| Loader            | Loader             | |
| MutimediaView     | Multimediaview     | |
| Navbar            | Navbar             | |
| Notification      | Notification       | |
| Page              | Page               | |
| Popup             | Popup              | |
|                   | popupwindow        | |
|                   | ctxpopupwindow     | |
| Progress          | Progress           | |
| ProgressBar       | Progressbar        | |
| Handler           | ScrollHandler      | |
|                   | Scrollview         | new            |
| SearchBar         | SearchBar          | |
| Selectmenu        | SelectMenu         | |
| Slider            | Slider             | |
| Splitview         |                    | |
| Swipe             | Swipe              | |
| Tabbar            | TabBar             | |
| Textinput         | Textinput          | |
| TizenSlider       | TizenSlider        | |
| TokenTextArea     | Tokentextarea      | |
| VirtualGrid       | VirtualGrid        | |
| VirtualList       | VirtualListview    | |


First of all the number of widgets is different. TAU framework have few new widgets compared to previous library. Some widgets have the same behavior like in previous version, for example `Tokentextarea`

## Widget which is not supported in TAU
* Widget Triangle
* Widget widgetex
* Widget popupwindow
* Widget ctxpopupwindow

## Differences between selectors in widgets

### Listdivider widget
To this widget has been added new selector `ui-listdivider` additionally to the existing selector [data-role=list-divider]

### Button widget
There is no significant changes to the Button widget.

### Checkbox widget
To this widget has been added new selector `ui-checkbox` and `input[type='checkbox']:not(.ui-slider-switch-input)`

### DateTimePicker widget
There is no significant changes to the DateTimePicker widget but it is deprecated as the webkit will create native
dateTimePicker

### Extendablelist widget
To this widget has been added new selector `.ui-extendablelist`

### Fastscroll widget
To this widget has been added new selector `.ui-fastscroll`

### Gallery widget
To this widget has been added new selector `.ui-gallery-container`

### Gallery3D widget
There is no significant changes to the Gallery3D widget.

### Loader widget
To this widget has been added new selector `.ui-loader`

### Listview widget
To this widget has been added new selector `.ui-listview`

### MutimediaView widget
Default selectors `audio` and `video` has been changed to `.ui-multimediaview`

### Navbar widget
To this widget has been added new selector `.ui-navbar`

### Notification widget
To this widget has been added new selector `.ui-notification`

### Progress widget
There is no significant changes to the Progress widget.
We only add new selector `.ui-progress` additionally to `[data-role='progress']`

### ProgressBar widget
There is no significant changes to the Progress widget.
We only add new selector `.ui-progressbar-container` additionally to `[data-role='progressbar']`

### Slider widget
In Web UI Framework, Slider widget was an extension to the jQuery Mobile Slider widget.
It contained wide range of "dragable" smaller widgets like:
1. toggleswitch with label based on `select` tag
2. toggleswitch without label based on `select` tag
3. slider based on `input` type range

In TAU framework the slider widget break up into toggleswitch and slider.
Where toggleswitch will contain:
1. toggleswitch with label based on `select` tag
2. toggleswitch without label based on `select` and `input` tag

Then slider is based on input type range.

Select tag for toggle is still supported in order to make the old applications workable.
Also the new selector was added `select[data-role='toggleswitch']` to the toggleswitch widget.
The slider can be built by `select[data-role='slider']`. In Web UI Framework the slider widget was
builded by all input type="rage" tags and toggle switch was builded with the help of `select[data-role='slider']` selector.

### Splitview widget
There is no significant changes to the SplitView widget.
We only add new selector `.ui-splitview` additionally to `[data-role="splitview"]`

### SearchBar widget
There is no significant changes to the SearchBar widget.
We only add new selector `.ui-searchbar` additionally to `input[type='search']`

### Swipe widget
There is no significant changes to the Swipe widget.
We only add new selector `.ui-swipe` additionally to `[data-role='swipe']`

### TokenTextArea widget
There is no significant changes to the Swipe widget.
We only add new selector `.ui-tokentextarea` additionally to `[data-role='tokentextarea']`
