/*global window, ns, define, ns */
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
/*jslint plusplus: true, nomen: true */
/**
 * #Field's Container Grouping Widget
 * FieldContain widget improves the styling of labels and form elements on wider screens. It aligns the input and associated label side-by-side and breaks to stacked block-level elements below ~480px. Moreover, it adds a thin bottom border to act as a field separator.
 *
 * ##Default selectors
 * In default all div or fieldset elements with _data-role=fieldcontain_ or class _.ui-fieldcontain_ are changed to fieldcontain widget.
 *
 * ##HTML Examples
 *
 * ###Create fieldcontain by data-role
 *
 *        @example
 *        <div data-role="fieldcontain">
 *            <label for="name">Text Input:</label>
 *            <input type="text" name="name" id="name" value="" />
 *        </div>
 *
 * ###Create fieldcontain by class
 *
 *        @example
 *        <div class="ui-fieldcontain">
 *            <label for="name">Text Input:</label>
 *            <input type="text" name="name" id="name" value="" />
 *        </div>
 *
 * ## Manual constructor
 * For manual creation of fieldcontain widget you can use constructor of widget:
 *
 *        @example
 *        <div id="fieldcontain">
 *            <label for="name">Text Input:</label>
 *            <input type="text" name="name" id="name" value="" />
 *        </div>
 *
 *        <script>
 *            var fieldcontain = tau.widget.FieldContain(document.getElementById("fieldcontain"));
 *        </script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *        @example
 *        <div id="fieldcontain">
 *            <label for="name">Text Input:</label>
 *            <input type="text" name="name" id="name" value="" />
 *        </div>
 *
 *        <script>
 *            var fieldcontain = $("#fieldcontain").fieldcontain();
 *        </script>
 *
 * ##Hiding labels accessibly
 * For the sake of accessibility, the framework requires that all form elements be paired with a meaningful label. To hide labels in a way that leaves them visible to assistive technologies — for example, when letting an element's placeholder attribute serve as a label — apply the helper class ui-hidden-accessible to the label itself:
 *
 *        @example
 *        <div data-role="fieldcontain">
 *            <label for="username" class="ui-hidden-accessible">Username:</label>
 *            <input type="text" name="username" id="username" value="" placeholder="Username"/>
 *        </div>
 *
 * To hide labels within a field container and adjust the layout accordingly, add the class ui-hide-label to the field container as in the following:
 *
 *        @example
 *        <div data-role="fieldcontain" class="ui-hide-label">
 *            <label for="username">Username:</label>
 *            <input type="text" name="username" id="username" value="" placeholder="Username"/>
 *        </div>
 *
 * While the label will no longer be visible, it will be available to assistive technologies such as screen readers.
 *
 * Because radio and checkbox buttons use the label to display the button text you can't use ui-hidden-accessible in this case. However, the class ui-hide-label can be used to hide the legend element:
 *
 *        @example
 *        <div data-role="fieldcontain" class="ui-hide-label">
 *            <fieldset data-role="controlgroup">
 *                <legend>Agree to the terms:</legend>
 *                <input type="checkbox" name="checkbox-agree" id="checkbox-agree" class="custom" />
 *                <label for="checkbox-agree">I agree</label>
 *            </fieldset>
 *        </div>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *        @example
 *        var fieldcontainElement = document.getElementById("fieldcontain"),
 *            fieldcontain = tau.widget.FieldContain(fieldcontainElement);
 *
 *        fieldcontain.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *        @example
 *        $("#fieldcontain").fieldcontain("methodName", methodArgument1, methodArgument2, ...);
 *
 *
 * @class ns.widget.mobile.FieldContain
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var FieldContain = function () {
					return;
				},
				/**
				 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
				 * @member ns.widget.mobile.FieldContain
				 * @private
				 * @static
				 */
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} engine Alias for class ns.engine
				 * @member ns.widget.mobile.FieldContain
				 * @private
				 * @static
				 */
				engine = ns.engine;

			/**
			 * Dictionary for fieldcontain related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.FieldContain
			 * @static
			 * @readonly
			 */
			FieldContain.classes = {
				uiFieldContain: "ui-field-contain",
				uiBody: "ui-body",
				uiBr: "ui-br"
			};

			FieldContain.prototype = new BaseWidget();

			/**
			 * Build structure of fieldcontain widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.FieldContain
			 */
			FieldContain.prototype._build = function (element) {
				var childNodes = element.childNodes,
					classList = element.classList,
					i = childNodes.length,
					childNode,
					classes = FieldContain.classes;
				// adding right classes

				classList.add(classes.uiFieldContain);
				classList.add(classes.uiBody);
				classList.add(classes.uiBr);
				// removing whitespace between label and form element
				while (--i >= 0) {
					childNode = childNodes[i];
					if (childNode.nodeType === 3 && !/\S/.test(childNode.nodeValue)) {
						element.removeChild(childNode);
					}
				}
				return element;
			};

			/**
			 * Removes the widget.
			 *
			 * This will return the element's style back to its pre-init state.
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          var fieldcontainWidget = tau.widget.FieldContain(document.getElementById("fieldcontain"));
			 *          fieldcontainWidget.destroy();
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          $("#fieldcontain").fieldcontain("destroy");
			 *      </script>
			 *
			 * @method destroy
			 * @inherited
			 * @member ns.widget.mobile.FieldContain
			 */
			/**
			 * Remove structure of fieldcontain widget
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.FieldContain
			 */
			FieldContain.prototype._destroy = function (element) {
				var classList = element.classList,
					classes = FieldContain.classes;
				// removing classes added during building

				classList.remove(classes.uiFieldContain);
				classList.remove(classes.uiBody);
				classList.remove(classes.uiBr);
			};

			/**
			 * The function "value" is not supported in this widget.
			 *
			 * @method value
			 * @inherited
			 * @chainable
			 * @member ns.widget.mobile.FieldContain
			 */

			/**
			 * Disable the fieldcontain
			 *
			 * Method adds disabled attribute on fieldcontain and changes look of fieldcontain to disabled state.
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          var fieldcontainWidget = tau.widget.FieldContain(document.getElementById("fieldcontain"));
			 *          fieldcontainWidget.disable();
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          $("#fieldcontain").fieldcontain("disable");
			 *      </script>
			 *
			 * @method disable
			 * @inherited
			 * @chainable
			 * @member ns.widget.mobile.FieldContain
			 */

			/**
			 * Enable the fieldcontain
			 *
			 * Method removes disabled attribute on fieldcontain and changes look of fieldcontain to enabled state.
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          var fieldcontainWidget = tau.widget.FieldContain(document.getElementById("fieldcontain"));
			 *          fieldcontainWidget.enable();
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          $("#fieldcontain").fieldcontain("enable");
			 *      </script>
			 *
			 * @method enable
			 * @inherited
			 * @chainable
			 * @member ns.widget.mobile.FieldContain
			 */

			/**
			 * The function "refresh" is not supported in this widget.
			 *
			 * @method refresh
			 * @inherited
			 * @chainable
			 * @member ns.widget.mobile.FieldContain
			 */

			/**
			 * The function "option" is not supported in this widget.
			 * This widget does not have any options.
			 *
			 * @method option
			 * @inherited
			 * @member ns.widget.mobile.FieldContain
			 */

			/**
			 * Trigger an event on widget's element.
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          var fieldcontainWidget = tau.widget.FieldContain(document.getElementById("fieldcontain"));
			 *          fieldcontainWidget.trigger("eventName");
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          $("#fieldcontain").fieldcontain("trigger", "eventName");
			 *      </script>
			 *
			 * @method trigger
			 * @inherited
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault on event object
			 * @member ns.widget.mobile.FieldContain
			 */

			/**
			 * Add event listener to widget's element.
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          var fieldcontainWidget = tau.widget.FieldContain(document.getElementById("fieldcontain"));
			 *
			 *          fieldcontainWidget.on("eventName", function() {
			 *                console.log("event fires");
			 *          });
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          $("#fieldcontain").fieldcontain("on", "eventName", function() {
			 *                console.log("event fires");
			 *          });
			 *      </script>
			 *
			 * @method on
			 * @inherited
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param tu addEventListener
			 * @member ns.widget.mobile.FieldContain
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          var fieldcontainWidget = tau.widget.FieldContain(document.getElementById("fieldcontain")),
			 *              callback = function () {
			 *                  console.log("event fires");
			 *              });
			 *
			 *          // add callback on event "eventName"
			 *          fieldcontainWidget.on("eventName", callback);
			 *          // ...
			 *          // remove callback on event "eventName"
			 *          fieldcontainWidget.off("eventName", callback);
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="fieldcontain" data-role="fieldcontain" class="ui-hide-label">
			 *          <label for="username">Username:</label>
			 *          <input type="text" name="username" id="username" value="" placeholder="Username"/>
			 *      </div>
			 *
			 *      <script>
			 *          // add callback on event "eventName"
			 *          $("#fieldcontain").fieldcontain("on", "eventName", callback);
			 *          // ...
			 *          // remove callback on event "eventName"
			 *          $("#fieldcontain").fieldcontain("off", "eventName", callback);
			 *      </script>
			 *
			 * @method off
			 * @inherited
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param tu addEventListener
			 * @member ns.widget.mobile.FieldContain
			 */

			// definition
			ns.widget.mobile.FieldContain = FieldContain;
			engine.defineWidget(
				"FieldContain",
				"[data-role='fieldcontain'], .ui-fieldcontain",
				[],
				FieldContain,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.FieldContain;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
