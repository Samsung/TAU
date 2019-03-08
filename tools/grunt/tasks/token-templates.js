/**
 * Render templates for tokens
 * @type {{code: function, info: function, text: function}}
 */
module.exports = {
	code: function (data, profile) {
		var firstSpace = /^([\s]+)([^]+)$/,
			lines = data.split("\n"),
			indents = [],
			removeFirstLine = lines[0].match(/@example$/) !== null,
			minSpace = 0;

		// Remove the example line
		if (removeFirstLine) {
			lines.shift();
		}

		// Collect indentation size from every line inside the of the block
		lines.forEach(function (line) {
			var match = firstSpace.exec(line);

			if (match) {
				indents.push(match[1].length);
			}
		});

		// Find the smallest code indentation
		minSpace = Math.min.apply(null, indents);

		// Remove leading whitespace (constant cut through the whole block)
		data = lines.map(function (line) {
			return line.substr(minSpace);
		}).join("\n");

		return "```" + profile + "\n" + data + "```\n";
	},
	info: function (data) {
		return "!info\nNOTE\n" + data.replace(/^!!!(.*)!!!$/, "$1");
	},
	text: function (data) {
		return data;
	}
};