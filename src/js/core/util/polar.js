/*global window, ns, define */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
			"./object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var PI = Math.PI,
				cos = Math.cos,
				sin = Math.sin,
				SVGNS = "http://www.w3.org/2000/svg",
				objectUtils = ns.util.object,
				classes = {
					polar: "ui-polar",
					animated: "ui-animated"
				},
				defaultsArc = {
					x: 180,
					y: 180,
					r: 170,
					arcStart: 0,
					arcEnd: 90,
					width: 5,
					color: "black",
					animation: false,
					linecap: "butt",
					referenceDegree: 0
				},
				defaultsRadius = {
					x: 180,
					y: 180,
					r: 170,
					degrees: 0,
					length: 180,
					direction: "in",
					width: 5,
					color: "black"
				},
				defaultsText = {
					x: 180,
					y: 180,
					text: "Text",
					position: "middle",
					color: "white"
				},
				defaultsCircle = {
					x: 180,
					y: 180,
					r: 170,
					color: "white"
				},
				polar;

			/**
			 * Calculate polar coords to cartesian
			 * @param {number} centerX
			 * @param {number} centerY
			 * @param {number} radius
			 * @param {number} angleInDegrees
			 * @return {{x: number, y: number}}
			 */
			function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
				var angleInRadians = angleInDegrees * PI / 180.0;

				return {
					x: centerX + (radius * sin(angleInRadians)),
					y: centerY - (radius * cos(angleInRadians))
				};
			}

			/**
			 * Create description of path for arc
			 * @param {number} x
			 * @param {number} y
			 * @param {number} radius
			 * @param {number} startAngle Angle in degrees where arc starts
			 * @param {number} endAngle Angle in degrees where arc ends
			 * @return {string}
			 */
			function describeArc(x, y, radius, startAngle, endAngle) {
				var start = polarToCartesian(x, y, radius, endAngle),
					end = polarToCartesian(x, y, radius, startAngle),
					arcSweep = endAngle - startAngle <= 180 ? "0" : "1",
					clockWise = 0;

				return [
					"M", start.x, start.y,
					"A", radius, radius, 0, arcSweep, clockWise, end.x, end.y
				].join(" ");
			}

			function addPath(svg, options) {
				var path = document.createElementNS(SVGNS, "path");

				path.setAttribute("class", options.classes);
				path.setAttribute("fill", "none");
				path.setAttribute("stroke", options.color);
				path.setAttribute("stroke-width", options.width);
				path.setAttribute("d", describeArc(options.x, options.y, options.r,
					options.referenceDegree + options.arcStart, options.referenceDegree + options.arcEnd));
				path.setAttribute("data-initial-degree", options.referenceDegree);
				path.setAttribute("stroke-linecap", options.linecap);

				svg.appendChild(path);
			}

			function addAnimation(element, options) {
				var style = element.style,
					value = options.x + "px " + options.y + "px",
					degrees = (options.referenceDegree + options.arcStart) || options.degrees;

				// phantom not support classList on SVG
				if (element.classList) {
					// add class for transition
					element.classList.add(classes.animated);
				}

				// set transform
				style.webkitTransformOrigin = value;
				style.mozTransformOrigin = value;
				style.transformOrigin = value;

				value = "rotate(" + degrees + "deg)";
				style.webkitTransform = value;
				style.mozTransform = value;
				style.transform = value;
			}

			function addRadius(svg, options) {
				var line = document.createElementNS(SVGNS, "line"),
					positionStart,
					positionEnd;

				line.setAttribute("class", options.classes);
				line.setAttribute("stroke", options.color);
				line.setAttribute("stroke-width", options.width);
				if (options.direction === "out") {
					positionStart = polarToCartesian(options.x, options.y, options.r, options.degrees);
					positionEnd = polarToCartesian(options.x, options.y, options.r - options.length,
						options.degrees);
				} else {
					positionStart = polarToCartesian(options.x, options.y, options.r - options.length,
						options.degrees);
					positionEnd = polarToCartesian(options.x, options.y, options.r, options.degrees);
				}
				line.setAttribute("x1", positionStart.x);
				line.setAttribute("y1", positionStart.y);
				line.setAttribute("x2", positionEnd.x);
				line.setAttribute("y2", positionEnd.y);

				svg.appendChild(line);
				return line;
			}

			function addText(svg, options) {
				var text = document.createElementNS(SVGNS, "text");

				text.setAttribute("x", options.x);
				text.setAttribute("y", options.y);
				text.setAttribute("text-anchor", options.position);
				text.setAttribute("fill", options.color);
				text.setAttribute("transform", options.transform);
				text.textContent = options.text;

				svg.appendChild(text);
			}

			function addCircle(svg, options) {
				var circle = document.createElementNS(SVGNS, "circle");

				circle.setAttribute("stroke", options.color);
				circle.setAttribute("stroke-width", options.width);
				circle.setAttribute("cx", options.x);
				circle.setAttribute("cy", options.y);
				circle.setAttribute("r", options.r);
				circle.setAttribute("fill", options.fill);

				svg.appendChild(circle);
				return circle;
			}

			function updatePathPosition(path, options) {
				var reference;

				if (options.animation) {
					addAnimation(path, options);
				} else {
					if (path) {
						reference = parseInt(path.getAttribute("data-initial-degree"), 10) || options.referenceDegree;
						path.setAttribute("data-initial-degree", reference);
						path.setAttribute("d", describeArc(options.x, options.y, options.r,
							reference + options.arcStart, reference + options.arcEnd));
					}
				}
			}

			function updateLinePosition(line, options) {
				var positionStart,
					positionEnd;

				if (options.animation) {
					addAnimation(line, options);
				} else {
					if (line) {
						positionStart = polarToCartesian(options.x, options.y, options.r, options.degrees);
						positionEnd = polarToCartesian(options.x, options.y, options.r - options.length, options.degrees);

						line.setAttribute("x1", positionStart.x);
						line.setAttribute("y1", positionStart.y);
						line.setAttribute("x2", positionEnd.x);
						line.setAttribute("y2", positionEnd.y);
					}
				}
			}

			polar = {
				default: {
					arc: defaultsArc,
					radius: defaultsRadius,
					text: defaultsText
				},
				classes: classes,

				polarToCartesian: polarToCartesian,

				/**
				 * creates SVG element
				 * @method createSVG
				 * @member ns.util.polar
				 * @param {HTMLElement} element
				 * @return {SVGElement}
				 * @static
				 */
				createSVG: function (element) {
					var svg = document.createElementNS(SVGNS, "svg");

					// phantom not support classList on SVG
					if (svg.classList) {
						// add class to svg element
						svg.classList.add(classes.polar);
					}
					// if element is set, add svg as child node
					if (element) {
						element.appendChild(svg);
					}
					return svg;
				},

				/**
				 * draw arc on the svg element
				 * @method addArc
				 * @member ns.util.polar
				 * @param {SVGElement} svg
				 * @param {Object} options
				 * @return {SVGElement}
				 * @static
				 */
				addArc: function (svg, options) {
					// read or create new svg
					svg = svg || this.createSVG();
					// set options
					options = objectUtils.merge({}, defaultsArc, options || {});
					// add path with arc
					addPath(svg, options);

					return svg;
				},

				/**
				 * draw radius on the svg element
				 * @method addRadius
				 * @member ns.util.polar
				 * @param {SVGElement} svg
				 * @param {Object} options
				 * @return {SVGElement}
				 * @static
				 */
				addRadius: function (svg, options) {
					// read or create new svg
					svg = svg || this.createSVG();
					// add path with radius
					options = objectUtils.merge({}, defaultsRadius, options || {});
					return addRadius(svg, options);
				},

				/**
				 * draw text on the svg element
				 * @method addText
				 * @member ns.util.polar
				 * @param {SVGElement} svg
				 * @param {Object} options
				 * @return {SVGElement}
				 * @static
				 */
				addText: function (svg, options) {
					// read or create new svg
					svg = svg || this.createSVG();
					// add path with radius
					options = objectUtils.merge({}, defaultsText, options || {});
					addText(svg, options);

					return svg;
				},

				/**
				 * updatePosition for path or for line drawings in svg
				 * @method updatePosition
				 * @member ns.util.polar
				 * @param {SVGElement} svg
				 * @param {string} selector
				 * @param {Object} options
				 * @static
				 */
				updatePosition: function (svg, selector, options) {
					var path = svg && svg.querySelector("path" + selector),
						line;

					if (path) {
						// set options
						options = objectUtils.merge({}, defaultsArc, options || {});
						updatePathPosition(path, options);
					} else {
						line = svg && svg.querySelector("line" + selector);
						if (line) {
							updateLinePosition(line, options);
						}
					}
				},

				/**
				 * draw circle on the svg element
				 * @method addCircle
				 * @member ns.util.polar
				 * @param {SVGElement} svg
				 * @param {Object} options
				 * @return {SVGElement}
				 * @static
				 */
				addCircle: function (svg, options) {
					var self = this;

					// read or create svg
					svg = svg || self.createSVG();

					options = objectUtils.merge({}, defaultsCircle, options || {});
					addCircle(svg, options);

					return svg;
				}
			};

			ns.util.polar = polar;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return polar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
