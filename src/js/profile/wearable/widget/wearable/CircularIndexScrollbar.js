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
/**
 * # Circular index scroll bar
 * Shows a circular index scroll bar which uses rotary.
 *
 * The circularindexscrollbar component shows on the screen a circularscrollbar with indices.
 * The indices can be selected by moving the rotary.
 * And it fires a select event when the index characters are selected.
 *
 * ## Manual constructor
 * For manual creation of UI Component you can use constructor of component from **tau** namespace:
 *
 *              @example
 *              var circularIndexElement = document.getElementById('circularIndex'),
 *                  circularIndexscrollbar = tau.widget.CircularIndexScrollbar(circularIndexElement, {index: "A,B,C"});
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create component.
 * We recommend get this element by method *document.getElementById*. Second parameter is **options**
 * and it is a object with options for component.
 *
 * To add an CircularIndexScrollbar component to the application, use the following code:
 *
 *      @example
 *      <div id="foo" class="ui-circularindexscrollbar" data-index="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z"></div>
 *      <script>
 *          (function() {
 *              var elem = document.getElementById("foo");
 *              tau.widget.CircularIndexScrollbar(elem);
 *              elem.addEventListener("select", function( event ) {
 *                  var index = event.detail.index;
 *                  console.log(index);
 *              });
 *          }());
 *      </script>
 *
 * The index value can be retrieved by accessing event.detail.index property.
 *
 * In the following example, the list scrolls to the position of the list item defined using
 * the li-divider class, selected by the circularindexscrollbar:
 *
 *      @example
 *         <div id="pageCircularIndexScrollbar" class="ui-page">
 *             <header class="ui-header">
 *                 <h2 class="ui-title">CircularIndexScrollbar</h2>
 *             </header>
 *             <div id="circularindexscrollbar"class="ui-circularindexscrollbar" data-index="A,B,C,D,E"></div>
 *             <section class="ui-content">
 *                 <ul class="ui-listview" id="list1">
 *                     <li class="li-divider">A</li>
 *                     <li>Anton</li>
 *                     <li>Arabella</li>
 *                     <li>Art</li>
 *                     <li class="li-divider">B</li>
 *                     <li>Barry</li>
 *                     <li>Bibi</li>
 *                     <li>Billy</li>
 *                     <li>Bob</li>
 *                     <li class="li-divider">D</li>
 *                     <li>Daisy</li>
 *                     <li>Derek</li>
 *                     <li>Desmond</li>
 *                 </ul>
 *             </section>
 *             <script>
 *                 (function () {
 *                     var page = document.getElementById("pageIndexScrollbar"),
                           circularIndexScrollbar;
 *                     page.addEventListener("pagecreate", function () {
 *                         var elisb = document.getElementById("circularindexscrollbar"), // circularIndexScrollbar element
 *                                 elList = document.getElementById("list1"), // List element
 *                                 elDividers = elList.getElementsByClassName("li-divider"), // List items (dividers)
 *                                 elScroller = elList.parentElement, // List's parent item
 *                                 dividers = {}, // Collection of list dividers
 *                                 indices = [], // List of index
 *                                 elDivider,
 *                                 i, idx;
 *
 *                         // For all list dividers
 *                         for (i = 0; i < elDividers.length; i++) {
 *                             // Add the list divider elements to the collection
 *                             elDivider = elDividers[i];
 *                             // li element having the li-divider class
 *                             idx = elDivider.innerText;
 *                             // Get a text (index value)
 *                             dividers[idx] = elDivider;
 *                             // Remember the element
 *
 *                             // Add the index to the index list
 *                             indices.push(idx);
 *                         }
 *
 *                         // Create CircularIndexScrollbar
 *                         circularIndexScrollbar = new tau.widget.CircularIndexScrollbar(elisb, {index: indices});
 *
 *                         // Bind the select callback
 *                         elisb.addEventListener("select", function (ev) {
 *                             var elDivider,
 *                                     idx = ev.detail.index;
 *                             elDivider = dividers[idx];
 *                             if (elDivider) {
 *                                 // Scroll to the li-divider element
 *                                 elScroller.scrollTop = elDivider.offsetTop - elScroller.offsetTop;
 *                             }
 *                         });
 *                     });
 *                 }());
 *             </script>
 *         </div>
 *
 * @author Junyoung Park <jy-.park@samsung.com>
 * @author Hagun Kim <hagun.kim@samsung.com>
 * @class ns.widget.wearable.CircularIndexScrollbar
 * @component-selector .ui-circularindexscrollbar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/event/gesture",
			"../../../../core/widget/BaseWidget",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilsEvents = ns.event,
				eventTrigger = utilsEvents.trigger,
				gesture = ns.event.gesture,
				prototype = new BaseWidget(),
				DRAG_STEP_TO_VALUE = 60,
				VIBRATION_DURATION = 10,
				lastDragValueChange = 0,
				dragGestureInstance = null,
				swipeGestureInstance = null,
				swipeNumber = 0,
				SECOND_SWIPE_TIMEOUT = 500, //ms
				swipeTimeout = null,

				CircularIndexScrollbar = function () {
					this._phase = null;
					this._tid = {
						phaseOne: 0,
						phaseThree: 0
					};
					this._detent = {
						phaseOne: 0
					};
					this.options = {};
					this._activeIndex = 0;
				},

				rotaryDirection = {
					// right rotary direction
					CW: "CW",
					// left rotary direction
					CCW: "CCW"
				},

				EventType = {
					/**
					 * Event triggered after select index by user
					 * @event select
					 * @member ns.widget.wearable.CircularIndexScrollbar
					 */
					SELECT: "select",
					/**
					 * Event triggered before show popup with letter
					 * @event show
					 * @member ns.widget.wearable.CircularIndexScrollbar
					 */
					SHOW: "show",
					/**
					 * Event triggered before hide popup with letter
					 * @event show
					 * @member ns.widget.wearable.CircularIndexScrollbar
					 */
					HIDE: "hide"
				},

				classes = {
					/**
					 * Standard circular index scroll bar widget
					 * @style ui-circularindexscrollbar
					 * @member ns.widget.wearable.CircleProgressBar
					 */
					INDEXSCROLLBAR: "ui-circularindexscrollbar",
					/**
					 * Circle progress bar widget with indicator
					 * @style ui-circularindexscrollbar-indicator
					 * @member ns.widget.wearable.CircleProgressBar
					 */
					INDICATOR: "ui-circularindexscrollbar-indicator",
					/**
					 * Circular progress bar widget with text indicator
					 * @style ui-circularindexscrollbar-indicator-text
					 * @member ns.widget.wearable.CircleProgressBar
					 */
					INDICATOR_TEXT: "ui-circularindexscrollbar-indicator-text",
					/**
					 * Show circular progress bar widget
					 * @style ui-circularindexscrollbar-show
					 * @member ns.widget.wearable.CircleProgressBar
					 */
					SHOW: "ui-circularindexscrollbar-show"
				};

			CircularIndexScrollbar.prototype = prototype;

			/**
			 * This method configure component.
			 * @method _configure
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._configure = function () {
				/**
				 * All possible component options
				 * @property {Object} options
				 * @property {string} [options.delimiter=","] delimiter in index
				 * @property {string|Array} [options.index=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1"]] indices list
				 * String with list of letters separate be delimiter or array of letters
				 * @property {number} [options.maxVisibleIndex=30] maximum length of visible indices
				 * @property {number} [options.duration=500] duration of show/hide animation time
				 * @member ns.widget.wearable.CircularIndexScrollbar
				 */
				this.options = {
					delimiter: ",",
					index: [
						"A", "B", "C", "D", "E", "F", "G", "H",
						"I", "J", "K", "L", "M", "N", "O", "P", "Q",
						"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"
					]
				};
			};

			/**
			 * This method build component.
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._build = function (element) {
				var indicator,
					indicatorText;

				indicator = document.createElement("div");
				indicator.classList.add(classes.INDICATOR);
				indicatorText = document.createElement("span");
				indicatorText.classList.add(classes.INDICATOR_TEXT);
				indicator.appendChild(indicatorText);
				element.appendChild(indicator);
				element.classList.add(classes.INDEXSCROLLBAR);

				return element;
			};

			/**
			 * This method inits component.
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._init = function (element) {
				var self = this,
					options = self.options;

				self._phase = 1;

				self._setIndices(options.index);
				self._setValueByPosition(self._activeIndex, true);

				return element;
			};

			/**
			 * This method set indices prepared from parameter
			 * or index of component.
			 * @method _setIndices
			 * @param {string} [value] Indices to prepared
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._setIndices = function (value) {
				var self = this,
					options = self.options;

				if (value === null) {
					ns.warn("CircularIndexScrollbar must have indices.");
					options.index = null;
					return;
				}

				if (typeof value === "string") {
					value = value.split(options.delimiter); // delimiter
				}

				options.index = value;
			};

			/**
			 * This method select the index
			 * @method _setValueByPosition
			 * @protected
			 * @param {string} index index number
			 * @param {boolean} isFireEvent whether "select" event is fired or not
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._setValueByPosition = function (index, isFireEvent) {
				var self = this,
					indicatorText;

				if (!self.options.index) {
					return;
				}

				indicatorText = self.element.querySelector("." + classes.INDICATOR_TEXT);

				self._activeIndex = index;
				indicatorText.innerHTML = self.options.index[index];
				if (isFireEvent) {
					eventTrigger(self.element, EventType.SELECT, {index: self.options.index[index]});
				}
			};

			/**
			 * This method select next index
			 * @method _nextIndex
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._nextIndex = function () {
				var self = this,
					activeIndex = self._activeIndex,
					indexLen = self.options.index.length,
					nextIndex;

				if (activeIndex < indexLen - 1) {
					nextIndex = activeIndex + 1;
				} else {
					return;
				}
				self._setValueByPosition(nextIndex, true);
			};

			/**
			 * This method select previous index
			 * @method _prevIndex
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._prevIndex = function () {
				var self = this,
					activeIndex = self._activeIndex,
					prevIndex;

				if (activeIndex > 0) {
					prevIndex = activeIndex - 1;
				} else {
					return;
				}

				self._setValueByPosition(prevIndex, true);
			};

			/**
			 * Get or Set index of the CircularIndexScrollbar
			 *
			 * Return current index or set the index
			 *
			 *        @example
			 *        <progress class="ui-circularindexscrollbar" id="circularindexscrollbar"></progress>
			 *        <script>
			 *            var circularIndexElement = document.getElementById("circularIndex"),
			 *                circularIndexScrollbar = tau.widget.CircleProgressBar(circularIndexElement),
			 *            // return current index value
			 *            value = circularIndexScrollbar.value();
			 *            // sets the index value
			 *            circularIndexScrollbar.value("C");
			 *        </script>
			 * @method value
			 * return {string} In get mode return current index value
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			/**
			 * This method select the index
			 * @method _setValue
			 * @protected
			 * @param {string} value of index
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._setValue = function (value) {
				var self = this,
					index = self.options.index,
					indexNumber;

				if (index && (indexNumber = index.indexOf(value)) >= 0) {
					self._setValueByPosition(indexNumber, false);
				}
			};

			/**
			 * This method gets current index
			 * @method _getValue
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._getValue = function () {
				var self = this,
					index = self.options.index;

				if (index) {
					return index[self._activeIndex];
				} else {
					return null;
				}
			};

			/**
			 * This method is a "rotarydetent" event handler
			 * @method _rotary
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._rotary = function (event) {
				var self = this,
					direction = event.detail.direction;

				if (!self.options.index) {
					return;
				}

				if (self._phase === 1) {
					self._rotaryPhaseOne();
				} else if (self._phase === 3) {
					event.stopPropagation();
					self._rotaryPhaseThree(direction);
				}
			};

			/**
			 * This method is for phase 1 operation.
			 * @method _rotaryPhaseOne
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._rotaryPhaseOne = function () {
				var self = this;

				clearTimeout(self._tid.phaseOne);
				self._tid.phaseOne = setTimeout(function () {
					if (self._phase === 1) {
						self._detent.phaseOne = 0;
					}
				}, 100);

				if (self._detent.phaseOne > 3) {
					self._phase = 3;
					clearTimeout(self._tid.phaseOne);
					self._detent.phaseOne = 0;
				} else {
					self._detent.phaseOne++;
				}
			};

			function hideWithTimeout(self) {
				// disable previous timeout
				clearTimeout(self._tid.phaseThree);

				self._tid.phaseThree = setTimeout(function () {
					self._hidePopup();
					self._disableDrag();
					// enable swipe event listener previously disabled on show indicator
					utilsEvents.on(document, "swipe", self);
				}, 1000);
			}

			prototype._onDrag = function (ev) {
				var self = this,
					dragValue;

				hideWithTimeout(self);

				if (self._phase === 3) {
					dragValue = ev.detail.deltaY - lastDragValueChange;

					if (Math.abs(dragValue) > DRAG_STEP_TO_VALUE) {
						lastDragValueChange = ev.detail.deltaY;
						// direction described in guideline doesn't make sense,
						// the direction was changed to the opposite
						if (ev.detail.deltaY < 0) {
							self._nextIndex();
						} else {
							self._prevIndex();
						}
						window.navigator.vibrate(VIBRATION_DURATION);
					}
				}
			}

			prototype._onDragEnd = function () {
				lastDragValueChange = 0;
			};

			function resetSwipeWithTimeout() {
				swipeNumber = 0;
				swipeTimeout = null;
			}

			prototype._onSwipe = function () {
				var self = this;

				window.clearTimeout(swipeTimeout);
				if (swipeNumber === 1) {
					utilsEvents.off(document, "swipe", self);
					self._phase = 3;
					swipeNumber = 0;
					self._showPopup();
					self._enableDrag();

					hideWithTimeout(self);
				} else {
					swipeNumber = 1;
					swipeTimeout = window.setTimeout(resetSwipeWithTimeout, SECOND_SWIPE_TIMEOUT);
				}
			};

			prototype._enableDrag = function () {
				var self = this;

				self.element.style.pointerEvents = "all";
				utilsEvents.on(document, "drag dragend", self);
			};

			prototype._disableDrag = function () {
				var self = this;

				self.element.style.pointerEvents = "none";
				utilsEvents.off(document, "drag dragend", self);
			};

			prototype._showPopup = function () {
				var self = this;

				eventTrigger(self.element, EventType.SHOW);
				self.element.classList.add(classes.SHOW);
			};

			prototype._hidePopup = function () {
				var self = this;

				eventTrigger(self.element, EventType.HIDE);
				self.element.classList.remove(classes.SHOW);
				self._phase = 1;
			};

			/**
			 * This method is for phase 3 operation.
			 * @method _rotaryPhaseThree
			 * @protected
			 * @param {string} direction direction of rotarydetent event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._rotaryPhaseThree = function (direction) {
				var self = this;

				hideWithTimeout(self);

				if (self._phase === 3) {
					self._showPopup();
					self._enableDrag();

					if (direction === rotaryDirection.CW) {
						self._nextIndex();
					} else {
						self._prevIndex();
					}
				}
			};

			/**
			 * This method handles events
			 * @method handleEvent
			 * @public
			 * @param {Event} event Event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "rotarydetent":
						self._rotary(event);
						break;
					case "drag":
						self._onDrag(event);
						break;
					case "dragend":
						self._onDragEnd(event);
						break;
					case "swipe":
						self._onSwipe(event);
						break;
				}
			};

			/**
			 * This method binds events to component.
			 * method _bindEvents
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._bindEvents = function () {
				var self = this;

				// enabled drag gesture for document
				if (dragGestureInstance === null) {
					dragGestureInstance = new gesture.Drag({
						blockHorizontal: true
					});
					utilsEvents.enableGesture(document, dragGestureInstance);
				}
				// enabled drag gesture for document
				if (swipeGestureInstance === null) {
					swipeGestureInstance = new gesture.Swipe({
						orientation: gesture.Orientation.VERTICAL
					});
					utilsEvents.enableGesture(document, swipeGestureInstance);
				}

				utilsEvents.on(document, "rotarydetent", self);
				utilsEvents.on(document, "swipe", self);
			};

			/**
			 * This method unbinds events to component.
			 * method _unbindEvents
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._unbindEvents = function () {
				var self = this;

				utilsEvents.disableGesture(document, dragGestureInstance);
				utilsEvents.disableGesture(document, swipeGestureInstance);
				utilsEvents.off(document, "rotarydetent", self);
				utilsEvents.off(document, "swipe", self);
			};

			/**
			 * This method refreshes component.
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._refresh = function () {
				var self = this,
					options = self.options;

				self._unbindEvents();
				self._setIndices(options.index);
				self._setValueByPosition(self._activeIndex, true);
				self._bindEvents();
			};

			/**
			 * This method destroys component.
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._destroy = function () {
				var self = this;

				self._unbindEvents();
			};

			// definition
			ns.widget.wearable.CircularIndexScrollbar = CircularIndexScrollbar;
			engine.defineWidget(
				"CircularIndexScrollbar",
				".ui-circularindexscrollbar",
				[],
				CircularIndexScrollbar,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return CircularIndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
