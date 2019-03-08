# Framework Profiles

TAU was designed to work with various device types. Each device type has different
specification and computation power. TAU profiling gives you ability to use widgets
designed and optimized for each device type, to deliver the best look & feel
experience to your app end users.

As you could noticed, some code example contains preview with following symbols:
- ![Wearable Profile](images/devices-wearable.svg "Wearable Profile") opens
preview with TAU wearable profile
- ![Mobile Profile](images/devices-mobile.svg "Mobile Profile") opens preview
 with TAU mobile profile
- ![TV Profile](images/devices-tv.svg "TV Profile") opens preview with TAU tv
 profile

!info
Example previews
Clicking on specified icon, you will see, how the same code snippet behaves
in different profiles. However some of the functionality shown in examples may
not work properly in a desktop browser. To fully get the TAU experience use a real
Tizen device or device emulator from the Tizen SDK.

## Wearable profile

Wearable profile is designed for the smallest Tizen devices with graphic displays,
such as Samsung's Gear family devices. Smaller display and more restrict power
management forces us to create TAU profile strictly designed for these needs.
In mind of better performance and user experience this profile contains basic
widgets. That helps you to create app in an eye blink.

## Mobile profile

Mobile profile is designed for middle size Tizen devices, such as smartphones.
It contains the most featured widgets, from simple progress bar widget to
complicated and various list implementations.

## TV profile

Creating apps for large screens, such as TVs, you should use appropriate profile,
which was designed for. Big screen doesn't mean, that you have a lot of space
for tiny UI elements. Don't force your end user to search navigation elements
using a spyglass!
This profile contains widgets and useful utils, that will help you to create
easy use and intuitive app navigation and layout.

# Widget list and availability

TAU has various widgets, that you can use and be sure, that will work properly
on devices. Easy-use and well documented API makes app developing enjoyable.
Each profile has separate list of widgets, but most of them are exchangeable.


| Widget          | Wearable           | Mobile | TV |
|-----------------|--------------------|--------|----|
| Button          | ✓                  | ✓      | ✓  |
| Checkboxradio   | -                  | ✓      | ✓  |
| Circularview    | -                  | ✓      | -  |
| Collapsible     | -                  | ✓      | -  |
| CollapsibleSet  | -                  | ✓      | -  |
| Controlgroup    | -                  | ✓      | ✓  |
| Datetimepicker  | -                  | ✓      | -  |
| Dialog          | -                  | ✓      | -  |
| Drawer          | -                  | ✓      | ✓  |
| ExtendableList  | -                  | ✓      | -  |
| FastScroll      | ✓ (IndexScrollbar) | ✓      | -  |
| FieldContain    | -                  | ✓      | -  |
| Gallery         | -                  | ✓      | -  |
| ListDivider     | -                  | ✓      | ✓  |
| Listview        | ✓                  | ✓      | ✓  |
| Loader          | -                  | ✓      | -  |
| MultimediaView  | -                  | ✓      | -  |
| NavBar          | -                  | ✓      | -  |
| Notification    | -                  | ✓      | -  |
| Page            | ✓                  | ✓      | ✓  |
| Popup           | -                  | ✓      | -  |
| Progress        | ✓                  | ✓      | ✓  |
| ProgressBar     | ✓ (progressing)    | ✓      | -  |
| ScrollHandler   | -                  | ✓      | -  |
| Scrollview      | -                  | ✓      | ✓  |
| SearchBar       | -                  | ✓      | -  |
| SelectMenu      | -                  | ✓      | -  |
| SectionChanger  | ✓                  | -      | -  |
| Slider          | -                  | ✓      | -  |
| SplitView       | -                  | ✓      | -  |
| Swipe           | ✓ (SwipeList)      | ✓      | -  |
| TabBar          | ✓ (TabIndicator)   | ✓      | -  |
| TextInput       | -                  | ✓      | ✓  |
| TizenSlider     | -                  | ✓      | ✓  |
| ToggleSwitch    | ✓                  | ✓      | -  |
| TokenTextarea   | -                  | ✓      | -  |
| VirtualGrid     | ✓                  | ✓      | ✓  |
| VirtualListview | ✓                  | ✓      | ✓  |

## Be careful with API

Common framework API and widgets for wearable, mobile and TV devices makes your
application universal and deployed faster. However there are some differences,
that you should noticed. Due device physical limits and the way how they are
used for, some widgets may behave and look different. As you can see from the
above table, some widgets are named different or not supported for each profile.
There are few differences, that you should take into account during development:

- All profiles have Virtual Keyboard implemented, but only TV using remote
control to input text.
- Mobile and TV profile supports `data-role` selectors, which are compatible
with jQuery Mobile.
- Differences between mobile and wearable profile is that in mobile profile
all widgets are build automatically, so developer no need to worry (or mind)
to build them. In Wearable profile widgets are not build by default.
Widgets such as button have style css so will they look good but doesn't
have an instance in javascript. Developer need to build them.
- Mobile and wearable profiles differ when it comes to framework engine start.
TAU will not engage on wearable devices if not set to do so. But that's only a part
of the difference. Mobile profile needs markup to get properly created and modified
by the widget instance build method, while for performance gain on wearable, only
the basic classes are used and the markup does not require a widget instance to look
good

Check [Using jQuery with TAU](using_jquery_with_tau.html) for further details.
