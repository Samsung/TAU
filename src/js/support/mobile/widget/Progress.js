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
 * #Progress Widget
 * The progress widget shows that an operation is in progress.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - HTML elements with data-role equal "progress"
 *  - HTML elements with class ui-progress
 *
 * ###HTML Examples
 *
 * ####Create simple text input on INPUT element
 *
 *        @example
 *        <div id="progress" data-role="progress"></div>
 *
 * ## Manual constructor
 * For manual creation of button widget you can use constructor of widget from
 * **tau** namespace:
 *
 *        @example
 *        <div id="progress"></div>
 *        <script>
 *            var element = document.getElementById("progress"),
 *                progress = tau.widget.Progress(element);
 *        </script>
 *
 * Constructor has one required parameter **element** which is base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter **options** and it is a object
 * with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *        @example
 *        <div id="progress"></div>
 *        <script>
 *            $("#progress").progress();
 *        </script>
 *
 * jQuery Mobile constructor has one optional parameter **options** and it is
 * a object with options for widget.
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or supplied as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *        @example
 *        <div id="progress"></div>
 *        <script>
 *            var element = document.getElementById("progress"),
 *                progress = tau.widget.Progress(element);
 *
 *            // progress.methodName(argument1, argument2, ...);
 *            // for example
 *            progress.value(2);
 *        </script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *        @example
 *        <div id="progress"></div>
 *        <script>
 *            // $(".selector").progress("methodName", argument1, argument2, ...);
 *            // for example
 *            $("#progress").progress("value", 2);
 *        </script>
 *
 * @extends ns.widget.BaseWidget
 * @class ns.widget.mobile.Progress
 */

(function (document, ns) {
	"use strict";

	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);


	define(
		[
			"../../../core/engine",
			"../../../core/util/object",
			"../../../profile/mobile/widget/mobile",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile",
			"../../../core/widget/core/progress/Progress"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			 * {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.mobile.Progress
			 * @private
			 */
			var ProgressExtra = ns.widget.core.progress.Progress,
				/**
				 * @property {ns.engine} engine Alias for class ns.engine
				 * @member ns.widget.mobile.Progress
				 * @private
				 * @static
				 */
				engine = ns.engine,
				objectUtil = ns.util.object,
				parentConfigure = ProgressExtra.prototype._configure,
				parentBuild = ProgressExtra.prototype._build,
				parentInit = ProgressExtra.prototype._init,

				classes = {
					uiProgressPendingRunning: "ui-progress-pending-running"
				};

			ProgressExtra.prototype._configure = function () {
				if (typeof parentConfigure === "function") {
					parentConfigure.call(this);
				}
				this.options = objectUtil.merge({}, ProgressExtra.defaults, {
					style: null,
					running: true,
					size: "medium"
				});
			};
			/**
			 * Build structure of progress widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Progress
			 */
			ProgressExtra.prototype._build = function (element) {
				if (this.options.style === "pending") {
					this.options.type = "indeterminatebar";
				}
				if (this.options.style === "circle") {
					this.options.type = "indeterminatecircle";
				}
				element.classList.add(classes.uiProgressPendingRunning);
				return parentBuild.call(this, element);
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Progress
			 */
			ProgressExtra.prototype._init = function (element) {
				var self = this,
					options = self.options;

				self._setRunning(options.running);

				return parentInit.call(this, element);
			};


			/**
			 * Method starts or stops running the progress.
			 *
			 *    @example
			 *    <div id="progress"></div>
			 *    <script>
			 *        var element = document.getElementById("progress"),
			 *            progressWidget = tau.widget.Progress(element),
			 *            // return current state of running
			 *            value = progressWidget.running();
			 *
			 *        progressWidget.running( true ); // starts running
			 *
			 *        progressWidget.running( false ); // stops running
			 *    </script>
			 *
			 *    @example
			 *    <div id="progress"></div>
			 *    <script>
			 *        // return current state of running
			 *        $( "#progress" ).progress( "running" );
			 *
			 *        // starts running
			 *        $( "#progress" ).progress( "running", true );
			 *
			 *        // stops running
			 *        $( "#progress" ).progress( "running", false );
			 *    </script>
			 *
			 * @method running
			 * @param {boolean} flag if true then set mode to running if false
			 * the stop running mode
			 * @member ns.widget.mobile.Progress
			 * @return {boolean}
			 */
			ProgressExtra.prototype.running = function (flag) {
				if (typeof flag === "boolean") {
					this._setRunning(flag);
				}
				return this.options.running;
			};

			/**
			 * Set running flag and refresh progress
			 * @method _setRunning
			 * @param {boolean} flag
			 * @protected
			 * @member ns.widget.mobile.Progress
			 */
			ProgressExtra.prototype._setRunning = function (flag) {
				if (typeof flag === "boolean") {
					this.options.running = flag;
					this._refreshRunning();
				}
			};


			/**
			 * Start progress
			 * @method _start
			 * @protected
			 * @member ns.widget.mobile.Progress
			 */
			ProgressExtra.prototype._start = function () {
				this.show();
				this.element.classList.add(classes.uiProgressPendingRunning);
			};

			/**
			 * Stop progress
			 * @method _stop
			 * @protected
			 * @member ns.widget.mobile.Progress
			 */
			ProgressExtra.prototype._stop = function () {
				this.element.classList.remove(classes.uiProgressPendingRunning);
			};

			/**
			 * Method shows progress.
			 *
			 *    @example
			 *    <div id="progress"></div>
			 *    <script>
			 *        var element = document.getElementById("progress"),
			 *            progressWidget = tau.widget.Progress(element);
			 *
			 *        progressWidget.show();
			 *    </script>
			 *
			 *    @example
			 *    <div id="progress"></div>
			 *    <script>
			 *        $( "#progress" ).progress( "show" );
			 *    </script>
			 *
			 * @method show
			 * @member ns.widget.mobile.Progress
			 */
			ProgressExtra.prototype.show = function () {
				this.element.style.display = "";
			};

			/**
			 * Method hides progress
			 *
			 *    @example
			 *    <div id="progress"></div>
			 *    <script>
			 *        var element = document.getElementById("progress"),
			 *            progressWidget = tau.widget.Progress(element);
			 *        progressWidget.hide();
			 *    </script>
			 *
			 *    @example
			 *    <div id="progress"></div>
			 *    <script>
			 *        $( "#progress" ).progress( "hide" );
			 *    </script>
			 *
			 * @method hide
			 * @member ns.widget.mobile.Progress
			 */
			ProgressExtra.prototype.hide = function () {
				this.element.style.display = "none";
			};

			/**
			 * Method refreshes a progress.
			 *
			 * This method will rebuild while DOM structure of widget. Method
			 * should be called after all manually change in HTML attributes
			 * of widget DOM structure. Refresh is called automatically after
			 * change any option of widget.
			 *
			 *    @example
			 *    <div id="progress"></div>
			 *    <script>
			 *        var element = document.getElementById("progress"),
			 *            progressWidget = tau.widget.Progress(element);
			 *
			 *        progressWidget.refresh();
			 *
			 *        // also will be called after
			 *        progressWidget.option("running", true);
			 *    </script>
			 *
			 *    @example
			 *    <div id="progress"></div>
			 *    <script>
			 *        $( "#progress" ).progress( "refresh" );
			 *    </script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.Progress
			 */

			/**
			 * Refresh progress
			 * @method _refresh
			 * @member ns.widget.mobile.Progress
			 * @protected
			 */
			ProgressExtra.prototype._refreshRunning = function () {
				if (this.options.running) {
					this._start();
				} else {
					this._stop();
				}
			};

			// definition
			ns.widget.mobile.Progress = ProgressExtra;
			engine.defineWidget(
				"Progress",
				"[data-role='progress'], .ui-progress",
				[
					"running",
					"show",
					"hide"
				],
				ProgressExtra,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Progress;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
