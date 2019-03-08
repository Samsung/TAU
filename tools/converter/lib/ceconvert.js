// Count all of the links from the io.js build page
var cheerio = require("cheerio"),
	fs = require("fs"),
	path = require("path"),
	widgetDefinitions = require("./definitions.json"),
	i,
	definition,
	elements,
	controlElements = {"input": 1, "select": 1, "textarea": 1, "button": 1},
	controlTypes = {"search": 1, "text": 1, "slider": 1, "checkbox": 1, "radio": 1, "button": 1, "range": 1},
	config = {
		"supportForIs": true
	};

function configure(profile) {
	if (profile === "wearable") {
		config.supportForIs = false;
	}
}

/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 * @param {string} profile to make recursiveSync on.
 */
function copyRecursiveSync(src, dest, profile) {
	var exists = fs.existsSync(src),
		stats = exists && fs.statSync(src),
		isDirectory = exists && stats.isDirectory();

	configure(profile);

	if (exists && isDirectory) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
		fs.readdirSync(src).forEach(function (childItemName) {
			copyRecursiveSync(path.join(src, childItemName),
				path.join(dest, childItemName));
		});
	} else {
		if (src.indexOf(".html") >= 0) {
			console.log("HTML " + src);
			convertHMTL(src, dest);
		} else {
			if (!fs.existsSync(dest)) {
				fs.linkSync(src, dest);
			}
		}
	}
}


function isControlElement($element) {
	var tagName,
		inputType;

	tagName = $element.get(0).name;
	if (controlElements[tagName] === 1) {
		if (tagName === "input") {
			inputType = $element.attr("type");
			if (inputType && controlTypes[inputType] === 1) {
				return true;
			} else {
				return false;
			}
		}
		// else
		return true;
	}
	// else
	return false;
}

function convertElement($, index, element) {
	var $element = $(element),
		attrs = $element.attr(),
		j,
		newJ,
		newElement,
		removeData = true,
		name = definition.name,
		nameLowerCase = definition.name.toLowerCase();

	if (isControlElement($element) && nameLowerCase !== "toggleswitch") {
		if (config.supportForIs) {
			// add "is" attribute
			$element.attr("is", "tau-" + nameLowerCase);
			if (name !== "Slider") {
				$element.removeAttr("type");
			}
			// clear "data-" prefix from attributes
			for (j in attrs) {
					// Several widgets still need full data-* attributes for proper working
					// patch for conflict scrollview selector and section changer selector
					// both need full data-scroll="none" for proper build
				removeData = true;
				if (j === "data-type" && name === "Slider") {
					removeData = false;
				}
					//-- end patch&&
				newJ = j;
				if (removeData && j.indexOf("data") === 0) {
						// remove "data-", five first chars
					newJ = j.substr(5);
					$element.attr(newJ, attrs[j]);
					$element.removeAttr(j);
				}
			}
		}
	} else {
		if (name !== "Scrollview") {
			// convert
			newElement = $("<tau-" + name + "></tau-" + name + ">");
			$element.removeAttr("type");

			$element.replaceWith(newElement);

			// copy attributes
			for (j in attrs) {
				// Several widgets still need full data-* attributes for proper working
				// patch for conflict scrollview selector and section changer selector
				// both need full data-scroll="none" for proper build
				removeData = true;
				if (j === "data-scroll" &&
					(name === "Scrollview" || name === "SectionChanger")) {
					removeData = false;
				}
				//-- end patch&&
				newJ = j;
				if (removeData && j.indexOf("data") === 0) {
					// remove "data-", five first chars
					newJ = j.substr(5);
				}
				newElement.attr(newJ, attrs[j]);
			}
			newElement.html($element.html());
		}
	}
}

function convertHMTL(src, dest) {
	var html = fs.readFileSync(src),
		$ = cheerio.load(html),
		output,
		$convertElement = convertElement.bind(null, $);

	for (i in widgetDefinitions) {
		definition = widgetDefinitions[i];
		if (definition.selector && definition.name !== "pagecontainer") {
			elements = $(definition.selector);
			elements.each($convertElement);
		}
	}

	output = $.html();
	// corrections
	output = output.replace(/<br>/gm, "<br/>");

	fs.writeFileSync(dest, output);
}

module.exports = copyRecursiveSync;

