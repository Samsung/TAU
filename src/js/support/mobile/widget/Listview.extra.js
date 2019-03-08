/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * # ListviewExtra Widget
 * The list widget is used to display, for example, navigation data, results,
 * and data entries.
 *
 * !!!When implementing the list widget:!!!
 *
 *    - A button widget (data-role="button") placed in the *a* tag is
 *     not supported in the list widget. The button must be placed in a *div* tag.
 *    - If you implement the list widget differently than described in
 *     the examples shown below, application customization (set element
 *     positioning) is required.
 *
 *
 * ## Default selectors
 * By default UL or OL elements with _data-role=listview_ are changed to
 * Tizen Web UI Listview.
 *
 * Additionally all UL or OL elements with class _ui-listview_ are changed to
 * Tizen Web UI Listview.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li>Anton</li>
 *            <li>Arabella</li>
 *            <li>Barry</li>
 *            <li>Bill</li>
 *        </ul>
 *
 * #### Create Listview widget using tau method:
 *
 *        @example
 *        <ul id="list">
 *            <li>Anton</li>
 *            <li>Arabella</li>
 *            <li>Barry</li>
 *            <li>Bill</li>
 *        </ul>
 *        <script>
 *            tau.widget.Listview(document.getElementById("list"));
 *        </script>
 *
 * #### Create FastScroll widget using jQueryMobile notation:
 *
 *        @example
 *        <ul id="list">
 *            <li>Anton</li>
 *            <li>Arabella</li>
 *            <li>Barry</li>
 *            <li>Bill</li>
 *        </ul>
 *        <script>
 *            $('#list').listview();
 *        </script>
 *
 * ## Options
 *
 * ### Inset
 * _data-inset_ If this option is set to **true** the listview is wrapped by
 * additionally layer
 *
 *        @example
 *        <ul data-role="listview" data-inset="true">
 *            <li>Anton</li>
 *            <li>Arabella</li>
 *            <li>Barry</li>
 *            <li>Bill</li>
 *        </ul>
 *
 * ### Theme
 * _data-theme_ Sets the theme of listview
 *
 *        @example
 *        <ul data-role="listview" data-theme="s">
 *            <li>Anton</li>
 *            <li>Arabella</li>
 *            <li>Barry</li>
 *            <li>Bill</li>
 *        </ul>
 *
 * ### Divider theme
 * _data-divider-theme_ Sets the divider theme of listview
 *
 *        @example
 *        <ul data-role="listview" data-divider-theme="s">
 *            <li>Anton</li>
 *            <li>Arabella</li>
 *            <li data-role="divider">B</li>
 *            <li>Barry</li>
 *            <li>Bill</li>
 *        </ul>
 *
 *
 * ## HTML example code
 *
 * ### Basic 1-line list item with anchor.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li><a href="#">Anton</a></li>
 *            <li><a href="#">Barry</a></li>
 *            <li><a href="#">Bill</a></li>
 *        </ul>
 *
 * ### Basic 1-line list item without anchor.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li>Anton</li>
 *            <li>Barry</li>
 *            <li>Bill</li>
 *        </ul>
 *
 * ### 1-line list item with a subtext.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li><a href="#">
 *                Anton
 *                <span class="ui-li-text-sub">subtext</span>
 *                </a>
 *            </li>
 *            <li><a href="#">
 *                Barry
 *                <span class="ui-li-text-sub">subtext</span>
 *                </a>
 *            </li>
 *            <li><a href="#">
 *                Bill
 *                <span class="ui-li-text-sub">subtext</span>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### List with sub text below the main text.
 *
 * If this attribute is not used, the sub text position is right next to
 * the main text.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-multiline">Anton
 *                <span class="ui-li-text-sub">subtext</span>
 *            </li>
 *            <li class="ui-li-multiline">Barry
 *                <span class="ui-li-text-sub">subtext</span>
 *            </li>
 *            <li class="ui-li-multiline">Bill
 *                <span class="ui-li-text-sub">subtext</span>
 *            </li>
 *        </ul>
 *
 * ### List with thumbnail
 *
 *        @example
 *        <ul data-role="listview">
 *            <li><img src="a.jpg" class="ui-li-bigicon" />Anton</li>
 *            <li><img src="a.jpg" class="ui-li-bigicon" />Barry</li>
 *            <li><img src="a.jpg" class="ui-li-bigicon" />Bill</li>
 *        </ul>
 *
 * ### List with thumbnail to the right.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-thumbnail-right">
 *                <img src="a.jpg" class="ui-li-bigicon" />
 *                Anton
 *            </li>
 *            <li class="ui-li-thumbnail-right">
 *                <img src="a.jpg" class="ui-li-bigicon" />
 *                Barry
 *            </li>
 *            <li class="ui-li-thumbnail-right">
 *                <img src="a.jpg" class="ui-li-bigicon" />
 *                Bill
 *            </li>
 *        </ul>
 *
 * ### 1-line list item with a text button, or with a circle-shaped button.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li><a href="#">
 *                    Anton
 *                    <div data-role="button" data-inline="true">Button</div>
 *                </a>
 *            </li>
 *            <li><a href="#">
 *                    Barry
 *                    <div data-role="button" data-inline="true" data-icon="plus"
 *                        data-style="circle"></div>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 1-line list item with a toggle switch.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li>
 *                Anton
 *                <select name="flip-11" id="flip-11" data-role="slider">
 *                    <option value="off"></option>
 *                    <option value="on"></option>
 *                </select>
 *            </li>
 *            <li>
 *                Barry
 *                <select name="flip-12" id="flip-12" data-role="slider">
 *                    <option value="off"></option>
 *                    <option value="on"></option>
 *                </select>
 *            </li>
 *            <li>
 *                Bill
 *                <select name="flip-13" id="flip-13" data-role="slider">
 *                    <option value="off"></option>
 *                    <option value="on"></option>
 *                </select>
 *            </li>
 *        </ul>
 *
 * ### 1-line list item with thumbnail image
 * #### - and a subtext,
 * #### - and text button,
 * #### - and circle-shaped button
 * #### - and a toggle switch.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li><a href="#">
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                    Anton
 *                </a>
 *            </li>
 *            <li><a href="#">
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                    Barry
 *                    <span class="ui-li-text-sub">subtext</span>
 *                </a>
 *            </li>
 *            <li><a href="#">
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                    Barry
 *                    <div data-role="button" data-inline="true">Button</div>
 *                </a>
 *            </li>
 *            <li><a href="#">
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                    Barry
 *                    <div data-role="button" data-inline="true" data-icon="plus"
 *                        data-style="circle"></div>
 *                </a>
 *            </li>
 *            <li>
 *                <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                Barry
 *                <select name="flip-13" id="flip-13" data-role="slider">
 *                    <option value="off"></option>
 *                    <option value="on"></option>
 *                </select>
 *            </li>
 *        </ul>
 *
 * ### 1-line list item with check box,
 * #### - and thumbnail,
 * #### - and thumbnail and circle-shaped button.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li>
 *                <form><input type="checkbox" name="c1line-check1" /></form>
 *                Anton
 *            </li>
 *            <li>
 *                <form><input type="checkbox" /></form>
 *                Barry
 *                <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *            </li>
 *            <li>
 *                <form><input type="checkbox" name="c1line-check4" /></form>
 *                <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                Barry
 *                <div data-role="button" data-inline="true" data-icon="plus"
 *                    data-style="circle"></div>
 *            </li>
 *        </ul>
 *
 * ### 1-line list item with radio button,
 * #### - and thumbnail,
 * #### - and thumbnail and circle-shaped button.
 *
 *        @example
 *        <form>
 *        <ul data-role="listview">
 *            <li>
 *                <input type="radio" name="radio"/>
 *                Anton
 *            </li>
 *            <li>
 *                <input type="radio" name="radio"/>
 *                Barry
 *                <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *            </li>
 *            <li>
 *                <input type="radio" name="radio"/>
 *                <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                Barry
 *                <div data-role="button" data-inline="true" data-icon="plus"
 *                    data-style="circle"></div>
 *            </li>
 *        </ul>
 *        <form>
 *
 * ### Basic 2-line list item.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Anton
 *                    <span class="ui-li-text-sub">subtext</span>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Barry
 *                    <span class="ui-li-text-sub">subtext</span>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Bill
 *                    <span class="ui-li-text-sub">subtext</span>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with 2 subtexts.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Anton
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <span class="ui-li-text-sub2">subtext 2</span>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Barry
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <span class="ui-li-text-sub2">subtext 2</span>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Bill
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <span class="ui-li-text-sub2">subtext 2</span>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with a text or circle-shaped button.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Anton
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <div data-role="button" data-inline="true">button</div>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Barry
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <div data-role="button" data-inline="true" data-icon="call"
 *                        data-style="circle"></div>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with 2 subtexts
 * #### - and a star-shaped icon next to the first subtext
 * #### - and 1 subtext and 2 star-shaped icons
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Anton
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <span style="position:absolute; right:16px; top:80px">
 *                        <img class= "ui-li-icon-sub-right"
 *                            src="00_winset_icon_favorite_on.png" />
 *                    </span>
 *                    <span class="ui-li-text-sub2">subtext 2</span>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Barry
 *                    <span class="ui-li-text-sub">
 *                        <img class="ui-li-icon-sub"
 *                            src="00_winset_icon_favorite_on.png" />
 *                        subtext
 *                    </span>
 *                    <span>
 *                        <img class="ui-li-icon-sub-right"
 *                            src="00_winset_icon_favorite_on.png" />
 *                    </span>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line setting list item,
 * #### - with optionally also a toggle switch
 * #### - or circle-shaped button.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Anton
 *                    <span class="ui-li-text-sub">subtext</span>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                Barry
 *                <span class="ui-li-text-sub">subtext</span>
 *                <select name="flip-13" id="flip-13" data-role="slider">
 *                    <option value="off"></option>
 *                    <option value="on"></option>
 *                </select>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Bill
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <div data-role="button" data-inline="true" data-icon="call"
 *                        data-style="circle"></div>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with a subtext,
 * #### - and also a star-shaped icon and a circle-shaped button,
 * #### - thumbnail and a second subtext,
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    Anton
 *                    <span class="ui-li-text-sub">
 *                        subtext
 *                        <img class="ui-li-icon-sub"
 *                            src="00_winset_icon_favorite_on.png" />
 *                    </span>
 *                    <div data-role="button" data-inline="true" data-icon="call"
 *                        data-style="circle"></div>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                    Barry
 *                    <span class="ui-li-text-sub">subtext 1</span>
 *                    <span class="ui-li-text-sub2">subtext 2</span>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with a subtext and check box
 * #### - and thumbnail
 * #### - and a circle-shaped button.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <form><input type="checkbox" name="check1" /></form>
 *                Anton
 *                <span class="ui-li-text-sub">subtext</span>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <form><input type="checkbox" name="check2" /></form>
 *                <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                Barry
 *                <span class="ui-li-text-sub">subtext</span>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <form><input type="checkbox" name="check3" /></form>
 *                Bill
 *                <span class="ui-li-text-sub">subtext</span>
 *                <div data-role="button" data-inline="true" data-icon="call"
 *                    data-style="circle"></div>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with a subtext and radio button,
 * #### - and thumbnail
 * #### - and a circle-shaped button.
 *
 *        @example
 *        <form>
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                    <input type="radio" name="radio1" />
 *                    Anton
 *                    <span class="ui-li-text-sub">subtext</span>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                    <input type="radio" name="radio1" />
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                    Barry
 *                    <span class="ui-li-text-sub">subtext</span>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                    <input type="radio" name="radio1" />
 *                    Barry
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <div data-role="button" data-inline="true" data-icon="call"
 *                        data-style="circle"></div>
 *            </li>
 *        </ul>
 *        </form>
 *
 * ### 2-line list item with a color bar,
 * #### - subtext, text button and 3 star-shaped icons,
 * #### - thumbnail, subtext, text button, and 1 star-shaped icon,
 * #### - thumbnail, subtext, and circle-shaped button.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    <span class="ui-li-color-bar"
 *                        style="background-color: red;"></span>
 *                    Anton
 *                    <span class="ui-li-text-sub">subtext
 *                        <img src="00_winset_icon_favorite_on.png" />
 *                        <img src="00_winset_icon_favorite_on.png" />
 *                        <img src="00_winset_icon_favorite_on.png" />
 *                    </span>
 *                    <div data-role="button" data-inline="true">button</div>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    <span class="ui-li-color-bar"
 *                        style="background-color:rgba(72, 136, 42, 1);"></span>
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                    Barry
 *                    <span>
 *                        <img class="ui-li-icon-sub"
 *                            src="00_winset_icon_favorite_on.png" />
 *                    </span>
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <div data-role="button" data-inline="true">button</div>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    <span class="ui-li-color-bar"
 *                        style="background-color: blue;"></span>
 *                    Bill
 *                    <span>
 *                        <img class="ui-li-icon-sub"
 *                            src="00_winset_icon_favorite_on.png" />
 *                    </span>
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <div data-role="button" data-inline="true" data-icon="call"
 *                        data-style="circle"></div>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with a subtext and thumbnail at right
 * #### and 2 star-shaped icons
 * #### and a star-shaped icons, subtext, and thumbnail.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline ui-li-thumbnail-right">
 *                <a href="#">
 *                    Anton
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon">
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline ui-li-thumbnail-right">
 *                <a href="#">
 *                    Barry
 *                    <span>
 *                        <img class="ui-li-icon-sub"
 *                            src="00_winset_icon_favorite_on.png" />
 *                    </span>
 *                    <span class="ui-li-text-sub">
 *                        <img class="ui-li-icon-sub"
 *                            src="00_winset_icon_favorite_on.png" />
 *                        subtext
 *                    </span>
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with a subtext before the main text and a thumbnail.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline ui-li-thumbnail-right">
 *                <a href="#">
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    Anton
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline ui-li-thumbnail-right">
 *                <a href="#">
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    Barry
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline ui-li-thumbnail-right">
 *                <a href="#">
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    Bill
 *                    <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with a thumbnail and a progress bar.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    <img scr="thumbnail.jpg" class="ui-li-bigicon">
 *                    Anton
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <div data-role="progressbar" id="progressbar"></div>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    <img scr="thumbnail.jpg" class="ui-li-bigicon">
 *                    Barry
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <div data-role="progressbar" id="progressbar"></div>
 *                </a>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <a href="#">
 *                    <img scr="thumbnail.jpg" class="ui-li-bigicon">
 *                    Bill
 *                    <span class="ui-li-text-sub">subtext</span>
 *                    <div data-role="progressbar" id="progressbar"></div>
 *                </a>
 *            </li>
 *        </ul>
 *
 * ### 2-line list item with a check box, thumbnail, subtext
 * ### and circle-shaped button.
 *
 *        @example
 *        <ul data-role="listview">
 *            <li class="ui-li-has-multiline">
 *                <form><input type="checkbox" name="checkbox" /></form>
 *                <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                Anton
 *                <span class="ui-li-text-sub">subtext</span>
 *                <div data-role="button" data-inline="true" data-icon="call"
 *                    data-style="circle"></div>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <form><input type="checkbox" name="checkbox" /></form>
 *                <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                Barry
 *                <span class="ui-li-text-sub">subtext</span>
 *                <div data-role="button" data-inline="true" data-icon="call"
 *                    data-style="circle"></div>
 *            </li>
 *            <li class="ui-li-has-multiline">
 *                <form><input type="checkbox" name="checkbox" /></form>
 *                <img src="thumbnail.jpg" class="ui-li-bigicon" />
 *                Bill
 *                <span class="ui-li-text-sub">subtext</span>
 *                <div data-role="button" data-inline="true" data-icon="call"
 *                    data-style="circle"></div>
 *            </li>
 *        </ul>
 *
 * @class ns.widget.mobile.ListviewExtra
 * @extends ns.widget.mobile.Listview
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/attributes",
			"../../../core/util/DOM/css",
			"../../../core/util/selectors",
			"../../../core/event",
			"../../../core/event/vmouse",
			"../../../profile/mobile/widget/mobile",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile",
			"../../../profile/mobile/widget/mobile/Listview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ListviewExtra = ns.widget.mobile.Listview,

				/**
				 * Backup of _build methods for replacing it
				 * @method parentBuild
				 * @member ns.widget.mobile.ListviewExtra
				 * @private
				 */
				parentBuild = ListviewExtra.prototype._build,

				/**
				 * Backup of _configure methods for replacing it
				 * @method parentConfigure
				 * @member ns.widget.mobile.ListviewExtra
				 * @private
				 */
				parentConfigure = ListviewExtra.prototype._configure,

				/**
				 * Backup of _init methods for replacing it
				 * @method parentInit
				 * @member ns.widget.mobile.ListviewExtra
				 * @private
				 */
				parentInit = ListviewExtra.prototype._init,

				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.ListviewExtra
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for class {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.widget.mobile.ListviewExtra
				 * @private
				 * @static
				 */
				DOM = ns.util.DOM,
				/**
				 * Alias for object ns.widget.mobile.ListviewExtra.classes
				 * @property {Object} classes
				 * @member ns.widget.mobile.ListviewExtra
				 * @static
				 * @private
				 * @readonly
				 * @property {string} classes.uiListview Main class of listview
				 * @property {string} classes.uiLinkInherit class inherit link on listview
				 * @property {string} classes.uiLiThumb class of thumb included in li element
				 * @property {string} classes.uiLiHasThumb class of li element which has thumb
				 * @property {string} classes.uiLiIcon class of icon included in li element
				 * @property {string} classes.uiLiHasIcon class of li element which has icon
				 * @property {string} classes.uiLiHasCheckbox class of li element which has checkbox
				 * @property {string} classes.uiLiHasCheckboxDisabled class of li element which has checkbox disabled
				 * @property {string} classes.uiLiHasRadio class of li element which has radio button
				 * @property {string} classes.uiLiHasRadioDisabled class of li element which has radio button disabled
				 * @property {string} classes.uiLiHasRightCircleBtn class of li element which has circle button
				 * @property {string} classes.uiLiHasRightBtn class of li element which has button align to right
				 * @property {string} classes.uiLiCount class of count included in li element
				 * @property {string} classes.uiLiHasCount class of li element which has count
				 * @property {string} classes.uiLiStatic class of li static element
				 * @property {string} classes.uiLiHeading class of li heading
				 */
				classes = {
					uiListview: "ui-listview",
					uiLinkInherit: "ui-link-inherit",
					uiLiThumb: "ui-li-thumb",
					uiLiHasThumb: "ui-li-has-thumb",
					uiLiIcon: "ui-li-icon",
					uiLiHasIcon: "ui-li-has-icon",
					uiLiHasCheckbox: "ui-li-has-checkbox",
					uiLiHasCheckboxDisabled: "ui-li-has-checkbox-disabled",
					uiLiHasRadio: "ui-li-has-radio",
					uiLiHasRadioDisabled: "ui-li-has-radio-disabled",
					uiLiHasRightCircleBtn: "ui-li-has-right-circle-btn",
					uiLiHasRightBtn: "ui-li-has-right-btn",
					uiLiCount: "ui-li-count",
					uiLiHasCount: "ui-li-has-count",
					uiLiAnchor: "ui-li-anchor",
					uiLiStatic: "ui-li-static",
					uiLiHeading: "ui-li-heading"
				},
				/**
				 * Alias to ns.util.selectors
				 * @property {Object} selectors
				 * @member ns.widget.mobile.ListviewExtra
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * Alias to ns.event
				 * @property {Object} eventUtils
				 * @member ns.widget.mobile.ListviewExtra
				 * @private
				 * @static
				 */
				eventUtils = ns.event,
				/**
				 * Alias to Array.slice
				 * @method slice
				 * @member ns.widget.mobile.ListviewExtra
				 * @private
				 */
				slice = [].slice;

			ListviewExtra.classes = classes;

			ListviewExtra.prototype._configure = function () {
				var self = this;

				if (typeof parentConfigure === "function") {
					parentConfigure.call(this);
				}

				self.options = self.options || {};
			};

			/**
			 * Add thumb classes img
			 * @method addThumbClassesToImg
			 * @param {HTMLElement} img
			 * @private
			 * @static
			 * @member ns.widget.mobile.ListviewExtra
			 */
			function addThumbClassesToImg(img) {
				var parentNode = selectors.getClosestByTag(img.parentNode, "li");

				img.classList.add(classes.uiLiThumb);
				if (parentNode) {
					parentNode.classList.add(
						img.classList.contains(classes.uiLiIcon) ?
							classes.uiLiHasIcon :
							classes.uiLiHasThumb
					);
				}
			}

			/**
			 * Add thumb classes to first img of container
			 * @method addThumbClasses
			 * @param {HTMLElement} container
			 * @private
			 * @static
			 * @member ns.widget.mobile.ListviewExtra
			 */
			function addThumbClasses(container) {
				var img;

				img = selectors.getChildrenByTag(container, "img");
				if (img.length) {
					addThumbClassesToImg(img[0]);
				}
			}

			/**
			 * Add checkbox classes to first input of container
			 * @method addCheckboxRadioClasses
			 * @param {HTMLElement} container HTML LI element.
			 * @private
			 * @static
			 * @member ns.widget.mobile.ListviewExtra
			 */
			function addCheckboxRadioClasses(container) {
				var inputAttr = container.querySelector("input"),
					typeOfInput,
					containerClassList = container.classList,
					disabled = false;

				if (inputAttr) {
					typeOfInput = inputAttr.getAttribute("type");
					disabled = inputAttr.hasAttribute("disabled");
					if (typeOfInput === "checkbox" && inputAttr.getAttribute("data-role") !== "toggleswitch") {
						containerClassList.add(classes.uiLiHasCheckbox);
						if (disabled) {
							containerClassList.add(classes.uiLiHasCheckboxDisabled);
						}
					} else if (typeOfInput === "radio") {
						containerClassList.add(classes.uiLiHasRadio);
						if (disabled) {
							containerClassList.add(classes.uiLiHasRadioDisabled);
						}
					}
				}
			}

			/**
			 * Function add ui-li-heading class to all headings elements in list
			 * @method addHeadingClasses
			 * @param {HTMLElement} container HTML LI element.
			 * @private
			 * @static
			 * @member ns.widget.mobile.ListviewExtra
			 */
			function addHeadingClasses(container) {
				var headings = [].slice.call(container.querySelectorAll("h1, h2, h3, h4, h5, h6")),
					i = headings.length - 1;

				while (i >= 0) {
					headings[i].classList.add(classes.uiLiHeading);
					i--;
				}
			}

			/**
			 * Add right button classes to first button of container
			 * @method addRightBtnClasses
			 * @param {HTMLElement} container HTML LI element
			 * @private
			 * @static
			 * @member ns.widget.mobile.ListviewExtra
			 */
			function addRightBtnClasses(container) {
				var btnAttr = container.querySelector("[data-role='button'],input[type='button'],select[data-role='slider'],input[type='submit'],input[type='reset'],button");

				if (btnAttr) {
					if (DOM.getNSData(btnAttr, "style") === "circle") {
						container.classList.add(classes.uiLiHasRightCircleBtn);
					} else {
						container.classList.add(classes.uiLiHasRightBtn);
					}
				}
			}

			/**
			 * Build Listview widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.ListviewExtra
			 */
			ListviewExtra.prototype._build = function (element) {
				//@todo check if this is ol list
				this._refreshItems(element, true);
				return parentBuild.call(this, element);
			};

			/**
			 * Initialize Listview widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ListviewExtra
			 */
			ListviewExtra.prototype._init = function (element) {
				var popup = selectors.getClosestBySelector(element, "[data-role=popup]"),
					drawer = selectors.getClosestBySelector(element, "[data-role=drawer]"),
					elementType = element.tagName.toLowerCase();

				//for everything what is not a list based on ul set the following width
				if (!popup && elementType !== "ul" && !drawer) {
					element.style.width = window.innerWidth + "px";
				}

				return (typeof parentInit === "function") ?
					parentInit.call(this, element) :
					element;
			};

			/**
			 * Change Checkbox/Radio state when list clicked
			 * @method _clickCheckboxRadio
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ListviewExtra
			 */
			ListviewExtra.prototype._clickCheckboxRadio = function (element) {
				var checkboxRadio = slice.call(element.querySelectorAll(".ui-checkbox, .ui-radio")),
					i = checkboxRadio.length,
					input;

				while (--i >= 0) {
					input = checkboxRadio[i];
					if (input.type === "checkbox") {
						input.checked = !input.checked;
						eventUtils.trigger(input, "change");
					} else {
						if (!input.checked) {
							input.checked = true;
							eventUtils.trigger(input, "change");
						}
					}
				}
			};

			/**
			 * Registers widget's event listeners
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ListviewExtra
			 */
			ListviewExtra.prototype._bindEvents = function (element) {
				var self = this;

				element.addEventListener("vclick", function (event) {
					var target = event.target;

					if (target.classList.contains(classes.uiLiHasCheckbox) || target.classList.contains(classes.uiLiHasRadio)) {
						self._clickCheckboxRadio(target);
					} else if (target.type === "checkbox" || target.type === "radio") {
						event.stopPropagation();
						event.preventDefault();
					}
				}, false);
			};

			/**
			 * Adds checkboxradio, thumb and right button classes
			 * if it is essential.
			 * @method addItemClasses
			 * @param {HTMLElement} item Element to add classes to
			 * @static
			 * @private
			 * @member ns.widget.mobile.ListviewExtra
			 */
			function addItemClasses(item) {
				addCheckboxRadioClasses(item);
				addThumbClasses(item);
				addRightBtnClasses(item);
			}

			/**
			 * Refreshes item elements with "a" tag
			 * @method refreshLinks
			 * @param {HTMLElement} item HTML LI element
			 * @static
			 * @private
			 * @member ns.widget.mobile.ListviewExtra
			 */
			function refreshLinks(item) {
				var links = selectors.getChildrenByTag(item, "a"),
					itemClassList = item.classList;

				if (links.length) {
					addItemClasses(links[0]);
					itemClassList.add(classes.uiLiAnchor);
				} else {
					itemClassList.add(classes.uiLiStatic);
					item.setAttribute("tabindex", "0");
				}
			}

			/**
			 * Refreshes single item of a list
			 * @method refreshItem
			 * @param {HTMLElement} item HTML LI element
			 * @param {boolean} create True if item is forced to be created
			 * @static
			 * @private
			 * @member ns.widget.mobile.ListviewExtra
			 */
			function refreshItem(item, create) {
				var itemClassList = item.classList;

				if (create || (!item.hasAttribute("tabindex") && DOM.isOccupiedPlace(item))) {

					if (item.querySelector("." + classes.uiLiCount)) {
						itemClassList.add(classes.uiLiHasCount);
					}

					if (item.hasAttribute("tabindex") === false) {
						item.setAttribute("tabindex", 0);
					}

					if (!selectors.matchesSelector(item, engine.getWidgetDefinition("ListDivider").selector)) {
						refreshLinks(item);
						addHeadingClasses(item);
					}
				}
				addItemClasses(item);
			}

			/**
			 * Refreshes list images
			 * @method refreshImages
			 * @param {HTMLElement} ul HTML UL element
			 * @static
			 * @private
			 * @member ns.widget.mobile.ListviewExtra
			 */
			function refreshImages(ul) {
				var imgs = ul.querySelectorAll("." + classes.uiLinkInherit + " > img:first-child"),
					i,
					length = imgs.length;

				for (i = 0; i < length; i++) {
					addThumbClassesToImg(imgs[i]);
				}
			}

			/**
			 * Refreshes items of list
			 * @method _refreshItems
			 * @param {HTMLElement} ul HTML UL element
			 * @param {boolean} create
			 * @protected
			 * @member ns.widget.mobile.ListviewExtra
			 */
			ListviewExtra.prototype._refreshItems = function (ul, create) {
				var self = this,
					items;

				eventUtils.trigger(ul, "beforerefreshitems");

				items = selectors.getChildrenByTag(ul, "li");

				items.forEach(function (item) {
					refreshItem(item, create);
				}, self);

				refreshImages(ul);
			};

			/**
			 * Refresh ListviewExtra widget
			 * @method refresh
			 * @protected
			 * @member ns.widget.mobile.ListviewExtra
			 */
			ListviewExtra.prototype.refresh = function () {
				this._refreshItems(this.element, false);
				eventUtils.trigger(this.element, this.name.toLowerCase() + "afterrefresh");
			};

			/**
			 * Adds item to widget and refreshes layout.
			 * @method addItem
			 * @param {HTMLElement} listItem new LI item
			 * @param {number} position position on list
			 * @member ns.widget.mobile.ListviewExtra
			 */
			ListviewExtra.prototype.addItem = function (listItem, position) {
				var element = this.element,
					childNodes = element.children,
					tempDiv,
					liItem,
					liButtons,
					i;

				if (typeof listItem === "string") {
					tempDiv = document.createElement("div");
					tempDiv.innerHTML = listItem;
					liItem = tempDiv.firstChild;
				} else {
					liItem = listItem;
				}

				liButtons = liItem.querySelectorAll("[data-role='button'], button");

				if (position < childNodes.length) {
					element.insertBefore(liItem, childNodes[position]);
				} else {
					element.appendChild(liItem);
				}

				for (i = 0; i < liButtons.length; i++) {
					engine.instanceWidget(liButtons[i], "Button");
				}

				this.refresh();
			};

			/**
			 * Removes item from widget and refreshes layout.
			 * @method removeItem
			 * @param {number} position position on list
			 * @member ns.widget.mobile.ListviewExtra
			 */
			ListviewExtra.prototype.removeItem = function (position) {
				var element = this.element,
					childNodes = element.children;

				if (position < childNodes.length) {
					element.removeChild(childNodes[position]);
				}
				this.refresh();
			};

			engine.defineWidget(
				"Listview",
				"[data-role='listview'], .ui-listview",
				["addItem", "removeItem"],
				ListviewExtra,
				"mobile",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ListviewExtra;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
