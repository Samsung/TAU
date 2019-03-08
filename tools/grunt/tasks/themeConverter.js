var xml2js = require("xml2js"),
	fs = require("fs"),
	path = require("path");

module.exports = function (grunt) {
	var options,
		range = {
			MAX_ANGLE: 360,
			MIN_ANGLE: 0,
			MAX_PERCENTAGE: 100,
			MIN_PERCENTAGE: 0
		},

		tableType = {
			UNKNOWN_TABLE: 0,
			INPUT_COLOR_TABLE: 1,
			COLOR_TABLE: 2
		};

	grunt.registerMultiTask("themeConverter", "tau changeable theme converter", function () {
		options = this.options();
		this.files.forEach(function (file) {
			run(options.index, options.style, file.src[0], file.dest);
		});
	});

	function run(index, style, src, dest) {
		var inputColorTable = {
				colorList: [],
				index: index,
				type: tableType.INPUT_COLOR_TABLE
			},
			colorTable = {
				colorList: [],
				style: style,
				type: tableType.COLOR_TABLE
			};

		inputColorTable = parseTable(inputColorTable);
		colorTable = parseTable(colorTable);
		replaceTemplate(inputColorTable, colorTable, src, dest);

	}

	function replaceTemplate(inputColorTable, colorTable, src, dest) {
		// replace color-code
		var rgba = {r: 0, g: 0, b: 0, a: 1},
			template = fs.readFileSync(src, "utf-8"),
			len = colorTable.colorList.length,
			i;

		//replace color
		for (i = 0; i < len; i++) {
			rgba = calculateColor(inputColorTable.colorList, colorTable.colorList[i].$);
			template = replaceColor(colorTable.colorList[i].$.id, rgba, template);
		}

		grunt.file.mkdir(path.dirname(dest));
		fs.writeFileSync(dest, template);

	}

	function parseTable(table) {
		var parser = new xml2js.Parser(),
			data,
			path;

		if (table.type === tableType.INPUT_COLOR_TABLE) {
			path = options.inputColorTableXML;
		} else if (table.type === tableType.COLOR_TABLE) {
			path = options.changeableColorTableXML;
		}

		data = fs.readFileSync(path);
		parser.parseString(data, function (err, result) {
			if (err) {
				grunt.log.error(err);
			}
			// result is parsing data
			table = parseAttribute(result, table);
		});
		return table;
	}

	function parseAttribute(result, table) {
		// parse attribute from result
		var value = [],
			themesLength,
			valueLength,
			i;

		if (table.type === tableType.INPUT_COLOR_TABLE) {
			// input color
			// It has a different xml structure to between mobile and wearable.
			if (result.InputColorTable.Themes) {
				themesLength = result.InputColorTable.Themes.length;
				for (i = 0; i < themesLength; i++) {
					value = value.concat(result.InputColorTable.Themes[i].Theme);
				}
			} else {
				value = result.InputColorTable.Theme;
			}

			// value is input color array
			valueLength = value.length;
			for (i = 0; i < valueLength; i++) {
				if (value[i].$.index === table.index) {
					table.colorList = value[i].InputColorInfo;
				}
			}
		} else {
			// changeable color
			value = result.ChangeableColorTable.Theme;
			// value is changeable color array
			for (i = 0; i < value.length; i++) {
				if (value[i].$.style === table.style) {
					table.colorList = value[i].ChangeableColorInfo;
				}
			}
		}
		return table;
	}

	function replaceColor(id, rgba, template) {
		var reg = new RegExp("\\b" + id + "\\b", "g");

		template = template.replace(reg, "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")");
		return template;
	}

	function determineColorRange(value, maxRange, minRange, maxInput, minInput) {
		var result,
			max,
			min;

		max = (maxInput > maxRange) ? maxRange : maxInput;
		min = (minInput < minRange) ? minRange : minInput;

		if (value > max) {
			result = max;
		} else if (value < min) {
			result = min;
		} else {
			result = value;
		}
		return result;
	}

	function HSVtoRGB(h, s, v, a) {
		var r,
			g,
			b,
			i,
			f,
			p,
			q,
			t;

		i = Math.floor(h * 6);
		f = h * 6 - i;
		p = v * (1 - s);
		q = v * (1 - f * s);
		t = v * (1 - (1 - f) * s);

		switch (i % 6) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = v;
				b = p;
				break;
			case 2:
				r = p;
				g = v;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = v;
				break;
			case 4:
				r = t;
				g = p;
				b = v;
				break;
			case 5:
				r = v;
				g = p;
				b = q;
				break;
		}
		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255),
			a: a
		};

	}

	function calculateColor(inputColorList, color) {
		var hue,
			saturation,
			value,
			alpha,
			inputColor = {
				hue: 0,
				saturation: 0,
				value: 0
			},
			maxHue = color.maxHue ? color.maxHue : 360,
			minHue = color.minHue ? color.minHue : 0,
			maxSaturation = color.maxSaturation ? color.maxSaturation : 100,
			minSaturation = color.minSaturation ? color.minSaturation : 0,
			maxValue = color.maxValue ? color.maxValue : 100,
			minValue = color.minValue ? color.minValue : 0;

		if (!color || !inputColorList) {
			return false;
		}

		if (color.inputColor) {
			if (color.inputColor === "1") {
				inputColor = inputColorList[0].$;
			} else if (color.inputColor === "2") {
				inputColor = inputColorList[1].$;
			} else if (color.inputColor === "3") {
				inputColor = inputColorList[2].$;
			} else if (color.inputColor === "4") {
				inputColor = inputColorList[3].$;
			} else if (color.inputColor === "5") {
				inputColor = inputColorList[4].$;
			} else if (color.inputColor === "6") {
				inputColor = inputColorList[5].$;
			} else if (color.inputColor === "K") {
				inputColor = {hue: 0, saturation: 0, value: 0};
			} else if (color.inputColor === "W") {
				inputColor = {hue: 0, saturation: 0, value: 98};
			}
		}

		// determine color's hue
		hue = Math.abs((color.fixedHue === "true") ? (parseInt(color.hue, 10)) : (parseInt(inputColor.hue, 10) + parseInt(color.hue, 10)));
		hue = determineColorRange(hue, range.MAX_ANGLE, range.MIN_ANGLE, parseInt(maxHue, 10), parseInt(minHue, 10));

		// determine color's saturation
		saturation = Math.abs((color.fixedSaturation === "true") ? (parseInt(color.saturation, 10)) : (parseInt(inputColor.saturation, 10) + parseInt(color.saturation, 10)));
		saturation = determineColorRange(saturation, range.MAX_PERCENTAGE, range.MIN_PERCENTAGE, parseInt(maxSaturation, 10), parseInt(minSaturation, 10));

		// determine color's value
		value = Math.abs((color.fixedValue === "true") ? (parseInt(color.value, 10)) : (parseInt(inputColor.value, 10) + parseInt(color.value, 10)));
		value = determineColorRange(value, range.MAX_PERCENTAGE, range.MIN_PERCENTAGE, parseInt(maxValue, 10), parseInt(minValue, 10));

		// check the range of alpha
		if (parseInt(color.alpha, 10) > range.MAX_PERCENTAGE) {
			alpha = range.MAX_PERCENTAGE;
		} else if (parseInt(color.alpha, 10) < range.MIN_PERCENTAGE) {
			alpha = range.MIN_PERCENTAGE;
		} else {
			alpha = color.alpha;
		}

		hue /= range.MAX_ANGLE;
		saturation /= range.MAX_PERCENTAGE;
		value /= range.MAX_PERCENTAGE;
		alpha /= range.MAX_PERCENTAGE;

		return HSVtoRGB(hue, saturation, value, alpha);
	}
};
