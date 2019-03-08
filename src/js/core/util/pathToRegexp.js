/*global define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Path to Regexp Utility
 * Convert string to regexp and can match path string to one defined regex path
 *
 * Syntax of paths is the same as in Express for nodejs
 *
 * Library based on https://github.com/pillarjs/path-to-regexp
 * @class ns.util.pathToRegexp
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 *
 */
(function (window) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
			"../../../../libs/path-to-regexp"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			ns.util.pathToRegexp = window.pathToRegexp;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.pathToRegexp;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window));
