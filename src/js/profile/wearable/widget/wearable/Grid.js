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
 *
 */
/*global window, ns, define */
/**
 * #Grid
 *
 * @class ns.widget.wearable.Grid
 * @since 3.0
 * @extends ns.widget.wearable.Listview
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/engine",
			"./Listview",
			"../../../../core/util/easing"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Listview = ns.widget.wearable.Listview,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.wearable.Grid
				 * @private
				 * @static
				 */
				engine = ns.engine,

				/* Alias for helper methods from Array */
				slice = [].slice,
				min = Math.min,
				max = Math.max,
				round = Math.round,
				ceil = Math.ceil,

				easeOutQuad = ns.util.easing.easeOutQuad,

				/**
				 * Cache for anim states
				 * @property {Array} anims
				 */
				anims = [],

				render = function (state) {
					var dTime = Date.now() - state.startTime,
						progress = dTime / state.duration;

					if (!state.end) {
						state.current = easeOutQuad(Math.min(progress, 1), state.from, state.to, 1);

						// apply scroll value to element
						state.element[state.propertyName] = state.current;

						// register callback for next request animation frame;
						state.requestHandler = window.requestAnimationFrame(state.render);
					}

					if (progress > 1) {
						state.end = true;
						window.cancelAnimationFrame(state.requestHandler);
						state.requestHandler = null;
					}
				},

				createState = function (from, to, element, duration, options) {
					var state = {
						from: from,
						to: to,
						current: from,
						startTime: Date.now(),
						duration: duration,
						end: true,
						render: null,
						requestHandler: null,
						element: element,
						propertyName: options && options.propertyName || "scrollTop"
					};

					state.render = render.bind(null, state);
					anims.push(state);
					return state;
				},

				find = function (element) {
					return anims.filter(function (state) {
						return state.element === element;
					})[0];
				},


				request = function (state, items) {
					var len = items.length,
						i = 0,
						duration = state.duration,
						progress = (Date.now() - state.startTime) / duration,
						draw = state.drawFn,
						timing = state.timingFn;

					// calculation
					for (; i < len; ++i) {
						timing(items[i], min(progress, 1));
					}

					// draw
					for (i = 0; i < len; ++i) {
						draw(items[i], i);
					}

					// add request animation frame
					if (!state.end) {
						state.handler = window.requestAnimationFrame(state.request);
					} else {
						if (typeof state.onEnd === "function") {
							state.onEnd();
						}
					}
					if (progress > 1) {
						state.end = true;
					}
				},

				/**
				 * Method to create animation on object properties
				 * @param {Array|Object} items
				 * @param {number} duration
				 * @param {Function} timingFn
				 * @param {Function} drawFn
				 * @param {Function} onEnd
				 * @return {Object}
				 */
				anim = function (items, duration, timingFn, drawFn, onEnd) {
					// item (or items) should has properties: from, to

					var state = {
						end: false,
						startTime: Date.now(),
						duration: duration,
						timingFn: timingFn,
						drawFn: drawFn,
						onEnd: onEnd
					};

					items = (Array.isArray(items)) ? items : [items];
					state.request = request.bind(null, state, items);

					// animation run
					state.handler = window.requestAnimationFrame(state.request);

					return state;
				},
				// setting for Grid which depend from options
				GRID_SETTINGS = {
					// setting for lines = 2
					2: {
						circle: {
							marginTop: -75,
							marginLeft: 38,
							marginRight: 140,
							scale: 0.3833,
							scaleThumbnail: 0.6,
							scaleThumbnailX: 0.6,
							marginThumbnail: 26,
							size: 146
						},
						rectangle: {
							marginTop: -66,
							marginLeft: 57,
							marginRight: 230,
							scale: 0.325,
							scaleThumbnail: 0.715,
							scaleThumbnailX: 0.4722,
							marginThumbnail: -8,
							size: 130
						}
					},
					// setting for lines = 3
					3: {
						circle: {
							marginTop: 0,
							marginLeft: 11,
							marginRight: 179,
							scale: 0.3027,
							scaleThumbnail: 0.6,
							scaleThumbnailX: 0.6,
							marginThumbnail: 26,
							size: 115
						},
						rectangle: {

						}
					}
				},
				/**
				 * Alias for class Grid
				 * @method Grid
				 * @member ns.widget.wearable.Grid
				 * @private
				 * @static
				 */
				Grid = function () {
					var self = this;

					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.mode="3x3"] grid mode
					 * @property {boolean} [options.scrollbar=true] enable/disable scrollbar
					 * @property {number} [options.lines=3] number of lines in grid view: 2 or 3
					 * @property {string} [options.mode="circle"] shape of block: circle or rectangle
					 * @member ns.widget.wearable.Grid
					 */
					self.options = {
						// default Grid mode is Thumbnail 3x3
						mode: "3x3",
						scrollbar: true,
						lines: 3,
						shape: "circle",
						orientation: "horizontal"
					};
					self._ui = {
						container: null
					};
					self._currentIndex = -1;
					self._settings = GRID_SETTINGS[3].circle;
				},
				CLASS_PREFIX = "ui-grid",
				CLASSES = {
					SHAPE_PREFIX: CLASS_PREFIX + "-",
					MODE3X3: CLASS_PREFIX + "-3x3",
					THUMBNAIL: CLASS_PREFIX + "-thumbnail",
					IMAGE: CLASS_PREFIX + "-image",
					THUMB: "thumb",
					POSITIONED: "ui-positioned"
				},
				GALLERY_SIZE = 360,
				HEIGHT_IN_GRID_MODE = 101,
				GRID_MARGIN = 5,
				SCROLL_DURATION = 250,
				TRANSFORM_DURATION = 450, // [ms]
				SCALE = {
					IMAGE: 1
				},
				THUMBNAIL_OPACITY = 0.75,
				IMAGE_OPACITY = 1,
				prototype = new Listview();

			/**
			 * Method scroll element content with animation
			 * Extension for TAU (animated-scroll.js)
			 * @method scrollTo
			 * @param {HTMLElement} element
			 * @param {number} changeValue
			 * @param {number} duration
			 * @param {Object} [options=null]
			 * @param {string} [options.propertyName=scrollTop] element property name to animate
			 * @member ns.widget.wearable.Grid
			 * @protected
			 */
			prototype._scrollTo = function (element, changeValue, duration, options) {
				var propertyName = options.propertyName || "scrollTop",
					state = find(element) ||
						createState(element[propertyName], changeValue, element, duration, options);

				state.startTime = Date.now();

				if (!state.end) {
					state.from = state.current;
					// snap to multiplication of change value
					state.to += 2 * changeValue - (state.current + state.to) % changeValue;
				} else {
					state.end = false;
					state.from = element[propertyName];
					state.to = changeValue;
					state.duration = duration;
					state.render();
				}
			};

			/**
			 * Toggle selected item by changing class
			 * @protected
			 * @param {boolean} visible
			 * @method _toggleSelectedItem
			 * @member ns.widget.wearable.Grid
			 * @protected
			 */
			prototype._toggleSelectedItem = function (visible) {
				var self = this,
					item = this._items[self._currentIndex];

				if (visible) {
					item.element.classList.add("ui-selected");
				} else {
					item.element.classList.remove("ui-selected");
				}
			};

			function createThumbnail(url, href) {
				var li = document.createElement("li"),
					a = document.createElement("a"),
					img = document.createElement("img");

				href = href || "#";
				img.setAttribute("src", url);
				img.setAttribute("class", CLASSES.THUMB);
				a.setAttribute("href", href);

				a.appendChild(img);
				li.appendChild(a);
				li.setAttribute("class", CLASSES.POSITIONED);

				return li;
			}

			/**
			 * Return size of item for given mode
			 * @param {string} mode
			 * @return {number}
			 * @member ns.widget.wearable.Grid
			 * @protected
			 */
			prototype._getItemSize = function (mode) {
				var self = this,
					settings = self._settings;

				switch (mode || self.options.mode) {
					case "3x3":
						return GALLERY_SIZE * settings.scale + GRID_MARGIN;
					case "image":
						// full screen
						return GALLERY_SIZE;
					case "thumbnail":
						return GALLERY_SIZE * settings.scaleThumbnailX + settings.marginThumbnail;
					default:
						return 0;
				}
			};

			prototype._prepareInsertItem = function (items, index, size, scale) {
				var self = this,
					newItem = items[index],
					beforeItems = items.filter(function (item, key) {
						return key < index;
					}),
					afterItems = items.filter(function (item, key) {
						return key > index;
					});

				// apply "to" properties on items
				self._applyItemsTo(beforeItems);

				// set how to items after insert position will be moved on right
				setItemsPositionTo(afterItems, size, self._scrollDimension, self._nonScrollDimension);

				// prepare starting position for new item
				setItemsPositionTo([newItem], size * index, self._scrollDimension,
					self._nonScrollDimension);

				// apply "to" properties at new item
				self._applyItemsTo([newItem]);
				// set new item scale before show
				newItem.scale = 0;

				// set item scale on end
				setItemsScaleTo([newItem], scale);

				// prepare items.from
				updateItemsFrom(items);
			};

			prototype._prepareRemoveItem = function (items, index, size) {
				var self = this,
					afterItems = items.filter(function (item, key) {
						return key > index;
					});

				// set how to items after removed item will be moved on left
				setItemsPositionTo(afterItems, -1 * size, self._scrollDimension, self._nonScrollDimension);
			};

			/**
			 * Add image to grid
			 * @param {string} url image url
			 * @param {number} [index] list index where image will be added
			 * @return {ns.widget.wearable.Grid}
			 * @method add
			 * @member ns.widget.wearable.Grid
			 */
			prototype.add = function (url, index) {
				var self = this,
					element = self.element,
					thumb = createThumbnail(url),
					snapPoint = self._createSnapPoint(),
					items = self._items;

				// Add new item to "items" array in grid widget
				if (index !== undefined && index < element.children.length) {
					items.splice(index, 0, createItem(thumb));
					self._snapPoints.splice(index, 0, snapPoint);
					element.insertBefore(thumb, element.children[index]);
				} else {
					items.push(createItem(thumb));
					self._snapPoints.push(snapPoint);
					element.appendChild(thumb);
				}

				self._updateSnapPointPositions();

				// Add thumbnail HTMLElement to grid with animation
				switch (self.options.mode) {
					case "3x3" :
						updateItemsFrom(items);
						self._assembleItemsTo3x3(items);
						break;
					case "image" :
						self._prepareInsertItem(items, index, self._getItemSize(), SCALE.IMAGE);
						break;
					case "thumbnail" :
						self._prepareInsertItem(items, index, self._getItemSize(), self.settings.scaleThumbnailX);
						break;
				}
				anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
					element.style[self._scrollSize] = getGridSize(self, self.options.mode) + "px";
				});

				// chain
				return self;
			};

			/**
			 * Remove image from grid
			 * @param {number} index image index
			 * @return {ns.widget.wearable.Grid}
			 * @method remove
			 * @member ns.widget.wearable.Grid
			 */
			prototype.remove = function (index) {
				var self = this,
					element = self.element,
					style = element.style,
					items = self._items,
					item = items[index],
					itemTo = item.to,
					thumb = item.element,
					snapPoints = self._snapPoints;

				if (index !== undefined && index < element.children.length) {

					updateItemsFrom([item]);


					switch (self.options.mode) {
						case "3x3" :
							// hide item with animation
							itemTo.scale = 0;
							// move to center of item during disappearing
							itemTo.position = {};
							itemTo.position[self._scrollDimension] = item.position[self._scrollDimension] +
								self._getItemSize() / 2;
							itemTo.position[self._nonScrollDimension] = item.position[self._nonScrollDimension];

							anim(item, TRANSFORM_DURATION, changeItems, transformItem);

							items.splice(index, 1);
							snapPoints.splice(index, 1);

							// refresh grid 3x3
							updateItemsFrom(items);
							self._assembleItemsTo3x3(items);

							anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
								self._updateSnapPointPositions();
								element.removeChild(thumb);
								style[self._scrollSize] = getGridSize(self, "3x3") + "px";
							});
							break;
						case "image" :
						case "thumbnail" :
							// hide item with animation
							itemTo.scale = 0;

							// move items after removed item to left
							updateItemsFrom(items);
							self._prepareRemoveItem(items, index, self._getItemSize());

							// transformation
							anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
								self._updateSnapPointPositions();
								element.removeChild(thumb);
								style[self._scrollSize] = getGridSize(self, self.options.mode) + "px";

								items.splice(index, 1);
								snapPoints.splice(index, 1);
							});
							break;
					}
				}

				// chain
				return self;
			};

			prototype._changeModeTo3x3 = function () {
				var self = this,
					element = self.element,
					classList = element.classList;

				// remove previous classes;
				classList.remove(CLASSES.IMAGE);

				// add new classes
				classList.add(CLASSES.MODE3X3);

				// set proper mode in options
				self.options.mode = "3x3";

				element.style[self._scrollSize] = self._getGridSize("3x3") + "px";
			};

			function changeModeToImage(self) {
				var element = self.element,
					elementClassList = element.classList;

				if (self._currentIndex > -1) {

					elementClassList.remove(CLASSES.MODE3X3);
					elementClassList.remove(CLASSES.THUMBNAIL);

					// set grid mode to image
					elementClassList.add(CLASSES.IMAGE);

					// set proper mode in options
					self.options.mode = "image";
				}
			}

			prototype._changeModeToThumbnail = function () {
				// thumbnail mode is accessible only from image mode
				if (this._currentIndex !== -1) {
					this.element.classList.add(CLASSES.THUMBNAIL);
				}
			};

			/**
			 * Change grid mode
			 * @param {"3x3"|"thumbnail"|"image"} toMode Grid works in three mode
			 * @return {ns.widget.wearable.Grid}
			 * @method mode
			 * @member ns.widget.wearable.Grid
			 */
			prototype.mode = function (toMode) {
				var self = this,
					currentMode = self.options.mode;

				switch (toMode) {
					case "3x3" :
						if (currentMode === "image") {
							self.trigger("modechange", {
								mode: toMode
							});
							self._imageToGrid();
						} else {
							self.trigger("modechange", {
								mode: toMode
							});
							self._changeModeTo3x3();
						}
						break;
					case "image" :
						if (currentMode === "3x3") {
							self.trigger("modechange", {
								mode: toMode
							});
							self._gridToImage();
						} else if (currentMode === "thumbnail") {
							self.trigger("modechange", {
								mode: toMode
							});
							self._thumbnailToImage();
						}
						break;
					case "thumbnail" :
						if (currentMode === "image") {
							self.trigger("modechange", {
								mode: toMode
							});
							self._imageToThumbnail();
						} else if (currentMode === "3x3") {
							ns.warn("thumbnail mode is not allowed directly from 3x3 mode," +
								"change to image mode before");
						}
						break;
					default:
						ns.warn("unsupported grid mode, available: 3x3 | image | thumbnail");
						break;
				}

				// chain
				return self;
			};

			/**
			 * Change current exposed image to image indicated by index
			 * @param {number} index Image index
			 * @return {ns.widget.wearable.Grid}
			 * @method changeIndex
			 * @member ns.widget.wearable.Grid
			 */
			prototype.changeIndex = function (index) {
				var self = this,
					container = self._ui.container,
					scrollProperty = self._scrollProperty;

				self._currentIndex = index;
				self._scrollTo(
					container,
					self._getGridScrollPosition(self.options.mode) - container[scrollProperty],
					SCROLL_DURATION,
					{
						propertyName: scrollProperty
					}
				);

				// chain
				return self;
			};

			/**
			 * Get current exposed image
			 * @method getIndex
			 * @member ns.widget.wearable.Grid
			 * @return {number}
			 */
			prototype.getIndex = function () {
				var self = this;

				self._currentIndex = self._findItemIndexByScroll(self._ui.container);

				return self._currentIndex;
			};

			prototype._createSnapPoint = function () {
				var point = document.createElement("div");

				point.className = "snap-point";
				return point;
			};

			prototype._createSnapPoints = function () {
				var self = this,
					fragment = document.createDocumentFragment(),
					items = self._items,
					length = items.length,
					i = 0,
					point,
					snapPoints = [];

				for (; i < length; i++) {
					point = self._createSnapPoint();
					snapPoints.push(point);
					fragment.appendChild(point);
				}
				self._ui.container.appendChild(fragment);
				self._snapPoints = snapPoints;
			};

			prototype._updateSnapPointPositions = function () {
				var self = this,
					snapPoints = self._snapPoints,
					len = snapPoints.length,
					start = 0,
					delta = 0,
					interval = 3,
					point,
					i = 0,
					settings = self._settings,
					scale = settings.scale;

				switch (self.options.mode) {
					case "3x3" :
						start = GALLERY_SIZE * scale / 2 + settings.marginLeft;
						delta = GALLERY_SIZE * scale / 3;
						interval = 3;
						break;
					case "image" :
						start = GALLERY_SIZE / 2;
						delta = GALLERY_SIZE;
						interval = 1;
						break;
					case "thumbnail" :
						start = GALLERY_SIZE / 2;
						delta = GALLERY_SIZE * settings.scaleThumbnailX + settings.marginThumbnail;
						interval = 1;
						break;
				}

				for (; i < len; i++) {
					point = snapPoints[i];
					point.style[self._scrollDimension] = start + delta * (i - i % interval) + "px";
				}
			};

			/**
			 * Widget build method
			 * @protected
			 * @method _build
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Grid
			 * @return {HTMLElement}
			 */
			prototype._build = function (element) {
				var self = this,
					container = document.createElement("div");

				self._ui.container = container;
				container.setAttribute("class", "ui-grid-container");
				self._setScrollbar(element, self.options.scrollbar);
				element.parentElement.replaceChild(container, element);

				container.appendChild(element);

				return element;
			};

			prototype._setScrollbar = function (element, value) {
				var container = this._ui.container;

				if (value) {
					container.setAttribute("tizen-circular-scrollbar", "");
				} else {
					container.removeAttribute("tizen-circular-scrollbar");
				}
			};

			/**
			 * Parse, validate and set lines option and set correct settings for option
			 * @param {HTMLElement} element
			 * @param {number|string} value
			 * @protected
			 * @method _setLines
			 * @memberof ns.widget.wearable.Grid
			 */
			prototype._setLines = function (element, value) {
				var linesCount = parseInt(value, 10),
					options = this.options;

				// validation: possible values 2 or 3, all values different from 2 will be change to 3
				// (default)
				if (linesCount !== 2) {
					linesCount = 3;
				}
				this._settings = GRID_SETTINGS[linesCount][options.shape];
				options.lines = linesCount;
			};

			/**
			 *
			 * @param {HTMLElement} element
			 * @param {number|string} value
			 * @protected
			 * @method _setOrientation
			 * @memberof ns.widget.wearable.Grid
			 */
			prototype._setOrientation = function (element, value) {
				var self = this,
					options = self.options;

				// validation: possible values vertical or horizontal, all values different from vertical
				// will be change to horizontal (default)
				if (value !== "vertical") {
					value = "horizontal";
				}
				if (value === "horizontal") {
					self._scrollProperty = "scrollLeft";
					self._scrollDimension = "left";
					self._nonScrollDimension = "top";
					self._scrollSize = "width";
				} else {
					self._scrollProperty = "scrollTop";
					self._scrollDimension = "top";
					self._nonScrollDimension = "left";
					self._scrollSize = "height";
				}
				options.orientation = value;
				element.classList.add(CLASS_PREFIX + "-" + value);
				self._ui.container.classList.add(CLASS_PREFIX + "-" + value);
			};

			/**
			 * Validate and set shape style option
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @method _setShape
			 * @memberof ns.widget.wearable.Grid
			 */
			prototype._setShape = function (element, value) {
				var shape = value,
					options = this.options,
					classList = element.classList;

				// validation
				if (shape !== "rectangle") {
					shape = "circle";
				}

				classList.remove(CLASSES.SHAPE_PREFIX + options.shape);
				classList.add(CLASSES.SHAPE_PREFIX + shape);

				this._settings = GRID_SETTINGS[options.lines][shape];
				options.shape = shape;
			};

			/**
			 * Widget init method
			 * @protected
			 * @method _init
			 * @memberof ns.widget.wearable.Grid
			 */
			prototype._init = function () {
				var self = this,
					items = [],
					element = self.element,
					options = self.options;

				self._items = items;

				element.classList.add("ui-children-positioned");

				self._setLines(element, options.lines);
				self._setShape(element, options.shape);
				self._setOrientation(element, options.orientation);

				// collect grid items from DOM
				self._getItems();

				self._assembleItemsTo3x3(items);
				// apply transformations to items immediately
				self._transformItems();

				// snap points are used as places where scroll will be stopped
				self._createSnapPoints();
				self._updateSnapPointPositions();

				// set proper grid look
				self.mode(options.mode);

				// disable tau rotaryScroller the widget has own support for rotary event
				ns.util.rotaryScrolling && ns.util.rotaryScrolling.lock();
			};

			function findChildIndex(self, target) {
				var children = slice.call(self.element.children, 0),
					index = -1;

				while (target !== null && index < 0) {
					index = children.indexOf(target);
					if (index > -1) {
						return index;
					} else {
						target = target.parentNode;
					}
				}
				return index;
			}

			prototype._findChildIndex = function (target) {
				return findChildIndex(this, target);
			};

			/**
			 * Method used by animation to apply transformation on grid element
			 * @param {Object} item
			 * @private
			 * @method transformItem
			 * @member ns.widget.wearable.Grid
			 */
			function transformItem(item) {
				var element = item.element,
					style = element.style,
					transform = "translate3d(" + item.position.left + "px, " + item.position.top + "px, 0)",
					scale = "scale(" + item.scale + ")";

				style.transform = transform + " " + scale;
				style.webkitTransform = transform + " " + scale;
				style.opacity = item.opacity;
			}

			prototype._transformItems = function () {
				var self = this,
					items = self._items;

				self._applyItemsTo(items);
				items.forEach(transformItem);
			};

			/**
			 * Calculation of item position
			 * @param {Object} item
			 * @param {number} progress
			 * @private
			 * @method changeItems
			 * @member ns.widget.wearable.Grid
			 */
			function changeItems(item, progress) {
				var to = item.to,
					from = item.from,
					position = item.position,
					fromPosition,
					toPosition;

				if (to && from) {
					fromPosition = from.position;
					toPosition = to.position;

					if (toPosition && fromPosition) {
						position.top = easeOutQuad(
							progress, fromPosition.top, toPosition.top - fromPosition.top, 1
						);
						position.left = easeOutQuad(
							progress, fromPosition.left, toPosition.left - fromPosition.left, 1
						);
					}
					item.scale = easeOutQuad(
						progress, from.scale, to.scale - from.scale, 1
					);
					item.opacity = easeOutQuad(
						progress, from.opacity, to.opacity - from.opacity, 1
					);
				}
			}

			/*
			 *
			 * Items transformations
			 *
			 */
			function createItem(element, item) {
				if (typeof item !== "object") {
					item = {};
				}
				item.element = element;
				item.position = {
					left: 0,
					top: 0
				};
				item.scale = 0;
				item.opacity = 1;
				item.to = {
					position: {},
					scale: 1,
					opacity: 1
				};
				item.from = {
					position: {},
					scale: 0,
					opacity: 1
				};
				return item;
			}

			prototype._applyItemsTo = function (items) {
				var len = items.length,
					item,
					to,
					i = 0;

				for (; i < len; ++i) {
					item = items[i];
					to = item.to;
					if (to.position) {
						item.position.left = to.position.left;
						item.position.top = to.position.top;
					}
					if (to.scale) {
						item.scale = to.scale;
					}
					if (to.opacity) {
						item.opacity = to.opacity;
					}
				}
			};

			function updateItemsFrom(items) {
				var len = items.length,
					item,
					i = 0,
					from;

				for (; i < len; ++i) {
					item = items[i];
					from = item.from;
					from.position = {
						left: item.position.left,
						top: item.position.top
					};
					from.scale = item.scale;
					from.opacity = item.opacity;
				}
			}

			prototype._assembleItemsTo3x3 = function (items) {
				var self = this,
					length = items.length,
					i = 0,
					index,
					scrollDimension,
					nonScrollDimension,
					to,
					settings = self._settings,
					size = settings.size,
					// pattern of positioning elements in 3x3 mode, relative position [x, y] in column
					pattern = [[size / 2, -HEIGHT_IN_GRID_MODE], [0, 0], [size / 2, HEIGHT_IN_GRID_MODE]];

				for (; i < length; ++i) {
					to = items[i].to;

					if (self.options.lines === 3) {
						index = i % 3;
						scrollDimension = pattern[index][0] + ((i / 3) | 0) * size;
						nonScrollDimension = pattern[index][1];
					} else {
						scrollDimension = ((i / 2) | 0) * size;
						nonScrollDimension = (i % 2) * size;
					}
					to.scale = settings.scale;
					to.position = {};
					to.position[self._scrollDimension] = scrollDimension + settings.marginLeft;
					to.position[self._nonScrollDimension] = nonScrollDimension + settings.marginTop
				}
			};

			prototype._assembleItemsToImages = function () {
				var self = this,
					items = self._items,
					len = items.length,
					to,
					i = 0,
					size = self._getItemSize("image");

				for (; i < len; ++i) {
					to = items[i].to;
					to.position = {};
					to.position[self._scrollDimension] = i * size;
					to.position[self._nonScrollDimension] = 0;

					to.scale = SCALE.IMAGE;
				}
			};

			prototype._scaleItemsToThumbnails = function () {
				var self = this,
					items = self._items,
					currentIndex = self._currentIndex,
					itemsLength = items.length,
					targetState,
					size = self._getItemSize("thumbnail"),
					settings = self._settings,
					scaleThumbnailX = settings.scaleThumbnailX,
					// is used to calculate scrolled position between items, this value is used to calculate
					// scale of items
					scrolledModPosition = 2 * ((self._ui.container[self._scrollProperty] -
						settings.marginThumbnail) % size) / size - 1,
					scrolledAbsModPosition = Math.abs(scrolledModPosition) / 2,
					itemScale,
					i = 0;

				for (; i < itemsLength; ++i) {
					targetState = items[i].to;
					targetState.position = {};
					targetState.position[self._scrollDimension] = i * size;
					targetState.position[self._nonScrollDimension] = 0;
					targetState.scale = scaleThumbnailX;
					itemScale = settings.scaleThumbnail - scaleThumbnailX;
					targetState.opacity = THUMBNAIL_OPACITY;

					if (i === currentIndex) {
						targetState.scale += itemScale * (0.5 + scrolledAbsModPosition);
						targetState.opacity += (1 - THUMBNAIL_OPACITY) * (0.5 + scrolledAbsModPosition);
					} else if (((i - currentIndex) === 1 && scrolledModPosition < 0) ||
						((i - currentIndex) === -1 && scrolledModPosition >= 0)) {
						targetState.scale += itemScale * (0.5 - scrolledAbsModPosition);
						targetState.opacity += (1 - THUMBNAIL_OPACITY) * (0.5 - scrolledAbsModPosition);
					}
				}
			};

			function setItemsPositionTo(items, deltaX, scrollDimension, nonScrollDimension) {
				var len = items.length,
					item,
					i = 0,
					to;

				for (; i < len; ++i) {
					item = items[i];
					to = item.to;
					to.position = {};
					to.position[scrollDimension] = item.position[scrollDimension] + deltaX;
					to.position[nonScrollDimension] = item.position[nonScrollDimension];
				}
			}

			function setItemsScaleTo(items, scale) {
				var len = items.length,
					i = 0;

				for (; i < len; ++i) {
					items[i].to.scale = scale;
				}
			}

			prototype._moveItemsToImages = function () {
				var self = this,
					items = self._items,
					len = items.length,
					to,
					i = 0;

				for (; i < len; ++i) {
					to = items[i].to;
					to.position = {};
					to.position[self._scrollDimension] = i * self._getItemSize("image");
					to.position[self._nonScrollDimension] = 0;
					to.scale = self._settings.scaleThumbnail;
					to.opacity = IMAGE_OPACITY;
				}
			};

			function moveItemsToThumbnails(self) {
				var items = self._items,
					len = items.length,
					to,
					i = 0;

				for (; i < len; ++i) {
					to = items[i].to;
					to.position = {};
					to.position[self._scrollDimension] = i * self._getItemSize("thumbnail") +
						(i - self._currentIndex) * 200;
					to.position[self._nonScrollDimension] = 0;
					to.scale = SCALE.IMAGE;
					if (self.options.shape === "rectangle") {
						to.opacity = (i === self._currentIndex) ? IMAGE_OPACITY : THUMBNAIL_OPACITY;
					}
				}
			}

			prototype._getItems = function () {
				var self = this,
					children = slice.call(self.element.children),
					len = children.length,
					child,
					items = self._items,
					i = 0;

				for (; i < len; ++i) {
					child = children[i];
					items[i] = createItem(child, items[i]);
					child.classList.add("ui-positioned");
				}
			};

			function getGridSize(self, mode) {
				var size,
					length = self._items.length,
					options = self.options,
					settings = self._settings;

				switch (mode) {
					case "3x3" :
						size = max(ceil(length / options.lines) * ceil(GALLERY_SIZE * settings.scale) +
							settings.marginLeft + settings.marginRight, GALLERY_SIZE);
						break;
					case "image" :
						size = length * GALLERY_SIZE;
						break;
					case "thumbnail" :
						size = length * GALLERY_SIZE * settings.scaleThumbnailX +
							(length - 1.5) * settings.marginThumbnail +
							GALLERY_SIZE * (1 - settings.scaleThumbnailX);
						break;
					default:
						size = GALLERY_SIZE;
				}
				return size;
			}

			prototype._getGridSize = function (mode) {
				return getGridSize(this, mode);
			};

			prototype._getGridScrollPosition = function (mode) {
				var self = this,
					scroll,
					itemSize = self._getItemSize(mode),
					currentIndex = self._currentIndex;

				switch (mode) {
					case "3x3" :
						scroll = (((currentIndex - 1) / 3) | 0) * ceil(itemSize);
						break;
					case "image" :
					case "thumbnail" :
						scroll = currentIndex * itemSize;
						break;
					default:
						scroll = 0;
				}
				return scroll;
			};

			prototype._setGridSize = function (mode) {
				var self = this,
					element = self.element;

				// set proper mode in options
				self.options.mode = "image";
				element.style[self._scrollSize] = getGridSize(self, mode) + "px";
				element.parentElement[self._scrollProperty] = self._getGridScrollPosition(mode);
			};

			prototype._findItemIndexByScroll = function (element) {
				var self = this,
					scroll = element[self._scrollProperty],
					itemSize = self._getItemSize(),
					items = self._items;

				switch (self.options.mode) {
					case "image" :
						return min(
							round(scroll / itemSize),
							items.length - 1
						);
					case "thumbnail" :
						return min(
							round((scroll - self._settings.marginThumbnail) / itemSize),
							items.length - 1
						);
					default :
						return -1;
				}
			};

			prototype._gridToImage = function () {
				var self = this,
					element = self.element;

				if (self._currentIndex === -1) {
					self._currentIndex = 0;
				}

				self._dispersionItems(self._currentIndex);
				updateItemsFrom(self._items);

				anim(self._items, TRANSFORM_DURATION, changeItems, transformItem, function () {
					changeModeToImage(self);

					self._assembleItemsToImages();
					self._transformItems();

					self._setGridSize("image");
					self._updateSnapPointPositions();
				});

				// change history
				ns.router.Router.getInstance().open(element, {
					url: "#image", rel: "grid"
				});
			};

			prototype._imageToThumbnail = function () {
				var self = this,
					element = self.element,
					items = self._items;

				moveItemsToThumbnails(self);
				self._transformItems();

				// set proper mode in options
				self.options.mode = "thumbnail";
				self._changeModeToThumbnail();

				element.parentElement[self._scrollProperty] = self._getGridScrollPosition("thumbnail");
				updateItemsFrom(items);
				self._scaleItemsToThumbnails();

				anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
					element.style[self._scrollSize] = getGridSize(self, "thumbnail") + "px";
					self._updateSnapPointPositions();
				});

				// change history
				ns.router.Router.getInstance().open(element, {
					url: "#thumbnail", rel: "grid"
				});
			};

			prototype._imageToGrid = function () {
				var self = this,
					element = self.element,
					items = self._items,
					scrollValue = self._getGridScrollPosition("3x3");

				self._assembleItemsTo3x3(items);
				self._transformItems();

				self._dispersionItems(self._currentIndex);
				self._transformItems();

				self._changeModeTo3x3();

				element.parentElement[self._scrollProperty] = min(scrollValue, getGridSize(self, "3x3") -
					GALLERY_SIZE);
				items[self._currentIndex].position[self._scrollDimension] = min(scrollValue,
					getGridSize(self, "3x3") - GALLERY_SIZE);

				updateItemsFrom(items);
				self._assembleItemsTo3x3(items);

				anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
					element.style[self._scrollSize] = getGridSize(self, "3x3") + "px";
					self._updateSnapPointPositions();
				});
			};

			prototype._thumbnailToImage = function () {
				var self = this,
					items = self._items;

				self._moveItemsToImages();
				self._transformItems();

				self._setGridSize("image");

				self._assembleItemsToImages();
				updateItemsFrom(items);
				changeModeToImage(self);

				anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
					self._updateSnapPointPositions();
				});
			};

			prototype._dispersionItems = function (fromItemIndex) {
				var self = this,
					element = self.element,
					items = self._items,
					center = items[fromItemIndex],
					item,
					length = items.length,
					i = 0,
					state;

				for (; i < length; ++i) {
					item = items[i];
					state = item.position;
					if (i !== fromItemIndex) {
						item.to = {
							position: {
								left: state.left + 2.2 * (state.left - center.position.left),
								top: state.top + 2.2 * (state.top - center.position.top)
							},
							scale: self._settings.scale
						};
					} else {
						item.to = {
							position: {},
							scale: SCALE.IMAGE
						};
						item.to.position[self._scrollDimension] = element.parentElement[self._scrollProperty];
						item.to.position[self._nonScrollDimension] = 0;
					}
				}
			};

			/**
			 * Event handlers
			 * @param {Event} event
			 */
			prototype._onClick = function (event) {
				var self = this;

				self._currentIndex = self._findChildIndex(event.target);

				switch (self.options.mode) {
					case "3x3" :
						self.mode("image");
						break;
					case "image" :
						self.mode("thumbnail");
						break;
				}
			};

			prototype._onPopState = function (event) {
				var self = this;

				self._currentIndex = self._findItemIndexByScroll(self._ui.container);

				switch (self.options.mode) {
					case "image":
						event.preventDefault();
						event.stopImmediatePropagation();
						self.mode("3x3");
						break;
					case "thumbnail":
						event.preventDefault();
						event.stopImmediatePropagation();
						self.mode("image");
						break;
				}
			};

			prototype._onHWKey = function (event) {
				switch (event.keyName) {
					case "back" :
						this._onPopState(event);
						break;
				}
			};

			prototype._onRotary = function (ev) {
				var self = this,
					itemSize = self._getItemSize(),
					direction = (ev.detail.direction === "CW") ? 1 : -1,
					container = self._ui.container;

				if (itemSize !== 0) {
					self._scrollTo(container, direction * itemSize, SCROLL_DURATION, {
						propertyName: self._scrollProperty
					});
				}
			};

			prototype._onScroll = function () {
				var self = this,
					newIndex = self._findItemIndexByScroll(self._ui.container),
					options = self.options;

				if (options.shape === "rectangle" && options.mode === "thumbnail") {
					self._currentIndex = newIndex;
					self._scaleItemsToThumbnails();
					anim(self._items, 0, changeItems, transformItem, function () {
						self._updateSnapPointPositions();
					});
				}

				self.trigger("change", {
					active: newIndex
				});
			};

			/**
			 * Event handler for widget
			 * @param {Event} event
			 * @method handleEvent
			 * @member ns.widget.wearable.Grid
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "rotarydetent" :
						self._onRotary(event);
						break;
					case "click" :
						self._onClick(event);
						break;
					case "tizenhwkey" :
						self._onHWKey(event);
						break;
					case "popstate" :
						self._onPopState(event);
						break;
					case "scroll":
						self._onScroll();
				}
			};

			/**
			 * Bind event listeners to widget instance
			 * @protected
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Grid
			 * @protected
			 */
			prototype._bindEvents = function (element) {
				var self = this;

				document.addEventListener("rotarydetent", self, true);
				window.addEventListener("popstate", self, true);
				element.addEventListener("click", self, true);
				window.addEventListener("tizenhwkey", self, true);
				self._ui.container.addEventListener("scroll", self, true);
			};

			/**
			 * Remove event listeners from widget instance
			 * @protected
			 * @method _unbindEvents
			 * @member ns.widget.wearable.Grid
			 * @protected
			 */
			prototype._unbindEvents = function () {
				var self = this;

				document.removeEventListener("rotarydetent", self, true);
				window.removeEventListener("popstate", self, true);
				self.element.removeEventListener("click", self, true);
				window.removeEventListener("tizenhwkey", self, true);
				self._ui.container.removeEventListener("scroll", self, true);
			};

			/**
			 * Destroy widget instance
			 * @protected
			 * @method _destroy
			 * @member ns.widget.wearable.Grid
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					items = self._items,
					len = items.length,
					i = 0;

				self._unbindEvents();

				// remove items
				for (; i < len; ++i) {
					items[i] = null;
				}
				self._items = [];
			};

			Grid.prototype = prototype;
			ns.widget.wearable.Grid = Grid;

			engine.defineWidget(
				"Grid",
				"." + CLASS_PREFIX,
				[],
				Grid,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Grid;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
