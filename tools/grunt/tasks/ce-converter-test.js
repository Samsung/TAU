/*jslint nomen: true, plusplus: true */
/*global module, require, __dirname, console */

/**
 * Tasks for testing Custom Elements converter.
 * It compares file after conversion with the the target file.
 *
 * Before running the test two files needs to be prepared "base.html"
 * and "target.html". They are located in "ce-converter-test" * sub-directory.
 *
 * Algorithm compares the structure by number of child nodes and attributes.
 * The basic file for conversion and target file needs to be prepared manually.
 * Examples of files are in ce-converter-test
 *
 * The task is registered in grunt task folder which is included in main Gruntfile.js.
 * It means that the task can be run form "tau" folder
 *
 * To run the test use the following command:
 * grunt test-convert-ce:mobile
 * For now only mobile template is prepared.
 *
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 */
var ceconverter = require("../../converter/index"),
	cheerio = require("cheerio"),
	path = require("path"),
	fs = require("fs");

module.exports = function (grunt) {
	var resultHtml = null,
		targetHtml = null,
		$result = null,
		$target = null;

	/**
	 * Compares attributes for result and target elements
	 * @method compareTree
	 * @param {Object} result cheerio Object represening the DOM for result File
	 * @param {Object} target cheerio Object represening the DOM for target File
	 * @private
	 */
	function compareAttr(result, target) {
		var equal = true,
			prop = "",
			wrongTargetAttr;

		if (target && result) {
			for (prop in target) {
				if (!result[prop] || result[prop] !== target[prop]) {
					equal = false;
					wrongTargetAttr = prop;
					break;
				}
			}
			return {"equal": equal,
				"wrongAttr": wrongTargetAttr};
		}
	}

	/**
	 * Recursive calls for all the DOM elements
	 * @method compareTree
	 * @param {Object} resultElement cheerio Object represening the DOM for result File
	 * @param {Object} targetElement cheerio Object represening the DOM for target File
	 * @private
	 */
	function compareTree(resultElement, targetElement) {
		var resultAttr = null,
			targetAttr = null,
			targetChildren = null,
			resultChildren = null,
			attrResult = null,
			i;

		//get the attributes for comparisment
		targetAttr = targetElement.attribs || targetElement.attr();
		resultAttr = resultElement.attribs || resultElement.attr();

		attrResult = compareAttr(resultAttr, targetAttr);
		if (attrResult.equal) {

			targetChildren = typeof targetElement.children === "function" ? targetElement.children() : targetElement.children,
			resultChildren = typeof resultElement.children === "function" ? resultElement.children() : resultElement.children;

			if (targetChildren && resultChildren) {
				if (resultChildren.length !== targetChildren.length) {
					grunt.log.error("Number: " + targetChildren.length + " of nodes in the following parent element: " + targetElement.name + " " + JSON.stringify(targetElement.attribs) + " is not equal with the " + resultChildren.length + "elements: " + resultElement.name + " " + JSON.stringify(resultElement.attribs));
					return false;
				}
				if (targetElement.name !== resultElement.name) {
					grunt.log.error("HTML tag name is deferent between targetElement: " + targetElement.name + " " + JSON.stringify(targetElement.attribs) +
							" and resultElement: " + resultElement.name + " " + JSON.stringify(resultElement.attribs));
					return false;
				}
				if (targetChildren.length > 0) {
					for (i = 0; i < targetChildren.length; i++) {
						//we compare only dom elements which are tags
						if (targetChildren[i].type === "tag") {
							compareTree(resultChildren[i], targetChildren[i]);
						}
					}
				}
			}
		} else {
			grunt.log.error("The attribute '" + attrResult.wrongAttr + "' from expected element: " + targetElement.name + " " + JSON.stringify(targetElement.attribs) +
					" dosen't match current result: " + resultElement.name + " " + JSON.stringify(resultElement.attribs));
		}
	}

	/**
	 * Initialize data and load virtual DOM
	 * @method compareResultWithTarget
	 * @param {string} result Path to the result file
	 * @param {string} target Path to the target file
	 * @private
	 */
	function compareResultWithTarget(result, target) {
		var resultElements = null,
			targetElements = null;

		resultHtml = fs.readFileSync(result);
		targetHtml = fs.readFileSync(target);
		$result = cheerio.load(resultHtml);
		$target = cheerio.load(targetHtml);

		//starting point for comparing
		//It's recommended to set it for page
		resultElements = $result(".ui-page");
		targetElements = $target(".ui-page");

		compareTree(resultElements, targetElements);
	}

	grunt.registerTask("test-convert-ce", "converting application with widgets and compare it to the target file", function (profile) {
		var sourcePath;

		profile = profile || "mobile";
		sourcePath = path.join(__dirname, "/ce-converter-test", profile) + "/";

		//generate test file
		ceconverter(sourcePath + "base.html", sourcePath + "result.html", profile);

		//compare with result with target
		compareResultWithTarget(sourcePath + "result.html", sourcePath + "target.html");
	});
};
