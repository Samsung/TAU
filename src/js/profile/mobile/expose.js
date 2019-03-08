/*global window, define, ns */
/*jslint plusplus: true, nomen: true */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/core",
			"../../core/util/object",
			"./widget/mobile/Loader",
			"../../core/router/Router"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var object = ns.util.object;

			/**
			 * Look to ns.router.Page#open
			 * @method changePage
			 * @inheritdoc ns.router.Page#open
			 * @member ns
			 */
			ns.changePage = function (toPage, options) {
				var router = ns.router.Router.getInstance();

				if (router) {
					router.open(toPage, options);
				}
			};

			/**
			 * Back in history.
			 * @method back
			 * @static
			 * @member ns
			 */
			ns.back = function () {
				window.history.back();
			};

			/**
			 * Look to ns.router.Page#open
			 * @method openPopup
			 * @inheritdoc ns.router.Page#open
			 * @member ns
			 */
			ns.openPopup = function (to, options) {
				var router = ns.router.Router.getInstance();

				if (router) {
					router.open(to, object.merge({}, options, {
						rel: "popup"
					}));
				}
			};

			/**
			 * Close active popup
			 * @method closePopup
			 * @static
			 * @member ns
			 */
			ns.closePopup = function () {
				var activePopup = ns.activePopup;

				if (activePopup) {
					activePopup.close();
				}
			};

			/**
			 * Returns active page element
			 * @inheritdoc ns.router.Router#getActivePageElement
			 * @method getActivePage
			 * @member tau
			 */
			ns.getActivePage = function () {
				var router = ns.router.Router.getInstance();

				if (router) {
					return router.getActivePageElement();
				}
				return null;
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns));
