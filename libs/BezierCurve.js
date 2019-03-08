/*global define*/
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../src/js/core/util"
	], function () {
		//>>excludeEnd("tauBuildExclude");
		/*eslint-disable*/
		/**
		 * BezierEasing - use bezier curve for transition easing function
		 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
		 *
		 * Credits: is based on Firefox's nsSMILKeySpline.cpp
		 * Usage:
		 * var spline = BezierEasing([ 0.25, 0.1, 0.25, 1.0 ])
		 * spline.get(x) => returns the easing value | x must be in [0, 1] range
		 *
		 * @class utils.BezierCurve
		 */


			// These values are established by empiricism with tests (tradeoff: performance VS precision)
		var NEWTON_ITERATIONS = 4;
		var NEWTON_MIN_SLOPE = 0.001;
		var SUBDIVISION_PRECISION = 0.0000001;
		var SUBDIVISION_MAX_ITERATIONS = 10;

		var kSplineTableSize = 11;
		var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

		var float32ArraySupported = typeof Float32Array === "function";

		/**
		 *
		 * @param aA1
		 * @param aA2
		 * @returns {number}
		 */
		function a (aA1, aA2) {
			return 1.0 - 3.0 * aA2 + 3.0 * aA1;
		}

		/**
		 *
		 * @param aA1
		 * @param aA2
		 * @returns {number}
		 */
		function b (aA1, aA2) {
			return 3.0 * aA2 - 6.0 * aA1;
		}

		/**
		 *
		 * @param aA1
		 * @returns {number}
		 */
		function c (aA1) {
			return 3.0 * aA1;
		}

		/**
		 * Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
		 * @param aT
		 * @param aA1
		 * @param aA2
		 * @returns {number}
		 */
		function calcBezier (aT, aA1, aA2) {
			return ((a(aA1, aA2)*aT + b(aA1, aA2))*aT + c(aA1))*aT;
		}


		/**
		 * Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
		 * @param aT
		 * @param aA1
		 * @param aA2
		 * @returns {*}
		 */
		function getSlope (aT, aA1, aA2) {
			return 3.0 * a(aA1, aA2)*aT*aT + 2.0 * b(aA1, aA2) * aT + c(aA1);
		}

		/**
		 *
		 * @param aX
		 * @param aA
		 * @param aB
		 * @param mX1
		 * @param mX2
		 * @returns {*}
		 */
		function binarySubdivide (aX, aA, aB, mX1, mX2) {
			var currentX, currentT, i = 0;
			do {
				currentT = aA + (aB - aA) / 2.0;
				currentX = calcBezier(currentT, mX1, mX2) - aX;
				if (currentX > 0.0) {
					aB = currentT;
				} else {
					aA = currentT;
				}
			} while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
			return currentT;
		}

		/**
		 *
		 * @param aX
		 * @param aGuessT
		 * @param mX1
		 * @param mX2
		 * @returns {*}
		 */
		function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
			for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
				var currentSlope = getSlope(aGuessT, mX1, mX2);
				if (currentSlope === 0.0) {
					return aGuessT;
				}
				var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
				aGuessT -= currentX / currentSlope;
			}
			return aGuessT;
		}

		function validateArguments(points) {
			if (!points || points.length !== 4) {
				throw new Error("BezierEasing: points must contains 4 values");
			}
			for (var i = 0; i < 4; ++i) {
				if (typeof points[i] !== "number" || isNaN(points[i]) || !isFinite(points[i])) {
					throw new Error("BezierEasing: points should be integers.");
				}
			}
			if (points[0] < 0 || points[0] > 1 || points[2] < 0 || points[2] > 1) {
				throw new Error("BezierEasing x values must be in [0, 1] range.");
			}
		}

		/**
		 * points is an array of [ mX1, mY1, mX2, mY2 ]
		 * @param points
		 * @param _b
		 * @param _c
		 * @param _d
		 * @returns {BezierEasing}
		 * @constructor
		 */
		function BezierEasing (points, _b, _c, _d) {
			if (arguments.length === 4) {
				return new BezierEasing([points, _b, _c, _d]);
			}
			if (!(this instanceof BezierEasing)) {
				return new BezierEasing(points);
			}

			validateArguments(points);

			this._str = "BezierEasing(" + points + ")";
			this._css = "cubic-bezier(" + points + ")";
			this._p = points;
			this._mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : [];
			this._precomputed = false;

			this.get = this.get.bind(this);
			return this;
		}

		BezierEasing.prototype = {

			/**
			 *
			 * @param x
			 * @returns {*}
			 */
			get: function (x) {
				var mX1 = this._p[0],
					mY1 = this._p[1],
					mX2 = this._p[2],
					mY2 = this._p[3];
				if (!this._precomputed) {
					this._precompute();
				}
				if (mX1 === mY1 && mX2 === mY2) {
					return x;
				} // linear
				// Because JavaScript number are imprecise, we should guarantee the extremes are right.
				if (x <= 0) {
					return 0;
				}
				if (x >= 1) {
					return 1;
				}
				return calcBezier(this._getTForX(x), mY1, mY2);
			},

			/**
			 *
			 * @private
			 */
			_precompute: function () {
				var mX1 = this._p[0],
					mY1 = this._p[1],
					mX2 = this._p[2],
					mY2 = this._p[3];
				this._precomputed = true;
				if (mX1 !== mY1 || mX2 !== mY2) {
					this._calcSampleValues();
				}
			},

			/**
			 *
			 * @private
			 */
			_calcSampleValues: function () {
				var mX1 = this._p[0],
					mX2 = this._p[2];
				for (var i = 0; i < kSplineTableSize; ++i) {
					this._mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
				}
			},

			/**
			 * getTForX chose the fastest heuristic to determine the percentage value precisely from a
			 * given X projection.
			 * @param aX
			 * @returns {*}
			 * @private
			 */
			_getTForX: function (aX) {
				var mX1 = this._p[0],
					mX2 = this._p[2],
					mSampleValues = this._mSampleValues;

				var intervalStart = 0.0;
				var currentSample = 1;
				var lastSample = kSplineTableSize - 1;

				for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX;
				       ++currentSample) {
					intervalStart += kSampleStepSize;
				}
				--currentSample;

				// Interpolate to provide an initial guess for t
				var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] -
					mSampleValues[currentSample]);
				var guessForT = intervalStart + dist * kSampleStepSize;

				var initialSlope = getSlope(guessForT, mX1, mX2);
				if (initialSlope >= NEWTON_MIN_SLOPE) {
					return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
				} else if (initialSlope === 0.0) {
					return guessForT;
				} else {
					return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
				}
			}
		};

		// CSS mapping
		BezierEasing.css = {
			ease:        BezierEasing.ease = new BezierEasing(0.25, 0.1, 0.25, 1.0),
			easeIn:     BezierEasing.easeIn = new BezierEasing(0.42, 0.0, 1.00, 1.0),
			easeOut:    BezierEasing.easeOut = new BezierEasing(0.00, 0.0, 0.58, 1.0),
			easeInOut: BezierEasing.easeInOut = new BezierEasing(0.42, 0.0, 0.58, 1.0)
		};

		if (ns && ns.util) {
			ns.util.bezierCurve = BezierEasing;
		}

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return BezierEasing;
		/*eslint-enable*/
	});
	//>>excludeEnd("tauBuildExclude");
}());
