/*jslint nomen: true, plusplus: true */
/*global module, require, __dirname */
var path = require("path"),
	mu = require("mu2"),
	fs = require("fs"),
	m = require("marked"),
	dox = require("dox"),
	customParser = require("./guide-custom-parser.js"),
	tokenParser = require("./token-parser.js");

module.exports = function (grunt) {
	"use strict";
	var sep = path.sep,
		widgetFiles = {
			tv: [],
			mobile: [],
			wearable: [],
			core: []
		};

	// marked options
	m.setOptions({
		renderer: new m.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: false,
		smartypants: false
	});

	function convertMarkdown(inFile, onDone, onError) {
		fs.readFile(inFile, {flag: "r", encoding: "utf8"}, function (fileError, data) {
			if (fileError) {
				onError(fileError);
			}
			customParser.parse(data, function (customContent) {
				m(customContent, function (markedError, content) {
					if (markedError) {
						onError(markedError);
					}
					onDone(content);
				});
			}, function (customParserError) {
				onError(customParserError);
			});
		});
	}

	function copyResources(grunt, sourceDir, src, dst, done) {
		var i = src.length,
			destination;

		grunt.log.write("Copy resources...");
		try {
			while (--i >= 0) {
				destination = src[i].replace(sourceDir, dst);
				grunt.file.copy(src[i], destination);
				grunt.verbose.writeln("Copying " + src[i] + " => " + destination);
			}
			done(true);
			grunt.log.ok();

			grunt.log.write("Finished. Check " + dst + " directory to see the result html.\n");
		} catch (err) {
			grunt.log.error(err);
			done(false);
		}

	}

	function processDocument(file, destination, extraParams, success, fail) {
		var buffer = "";

		convertMarkdown(file, function (data) {
			if (fs.existsSync(destination)) {
				fs.unlinkSync(destination);
			}

			mu.compileAndRender("guide.html",
				{
					content: data,
					relativePathPrefix: extraParams.relativePathPrefix,
					wearableMenu: extraParams.wearableMenu,
					tvMenu: extraParams.tvMenu,
					mobileMenu: extraParams.mobileMenu,
					coreMenu: extraParams.coreMenu,
					widgetGuide: extraParams.widgetGuide,
					version: extraParams.version
				}
			).on("error", function (err) {
				grunt.log.error(err);
				fail(file);
			}).on("data", function (data) {
				buffer += data.toString();
			}).on("end", function () {
				grunt.file.write(destination, buffer);
				success(file);
			});
		}, function (err) {
			grunt.log.error(err);
			fail(file);
		});
	}

	grunt.registerMultiTask("developer-guide-extract", "Extracts markdown comments from file headers", function () {
		var files = [],
			matchingTagName = "class",
			filesGenerated = 0,
			profile = this.target;

		function preparePaths(file) {
			var fileSrc = file.src,
				fileDest = file.dest,
				fileDestBase = file.destBase;

			// Merge all expanded paths
			files = files.concat(grunt.file.expandMapping(fileSrc, fileDest, {
				ext: ".md",
				rename: function (dest, matchedSrcPath) {
					// We check first how the destination paths look like
					var foundInPath = matchedSrcPath.indexOf(fileDestBase);

					if (fileDestBase && foundInPath === 0) {
						// if a match is found the begimning is removed
						return path.join(dest, matchedSrcPath.substr(fileDestBase.length)).toLowerCase();
					}

					return path.join(dest, matchedSrcPath).toLowerCase();
				}
			}));
		}

		function parseFileComments(file) {
			var srcFile = file.src,
				destFile = file.dest,
				content = grunt.file.read(srcFile),
				docs,
				interestingComments = [],
				output = "",
				widget;

			grunt.verbose.writeln("Parsing file [" + srcFile + "]");

			// check if file is widget
			// and filter out instantiable classes (to avoid namespaces 0_o)
			if (destFile.indexOf("widget") > -1 && /^[A-Z].+/.test(path.basename(srcFile))) {
				widget = {
					name: path.basename(srcFile, ".js"),
					file: destFile.replace(path.extname(destFile), ".html")
				};
				if (destFile.indexOf("mobile") > -1) {
					widgetFiles.mobile.push(widget);
				} else if (destFile.indexOf("wearable") > -1) {
					widgetFiles.wearable.push(widget);
				} else if (destFile.indexOf("core") > -1) {
					widgetFiles.core.push(widget);
				} else {
					widgetFiles.tv.push(widget);
				}
			}

			docs = dox.parseComments(content, {raw: true});

			// Find only comments with 'class' tags within current file
			docs.filter(function (comment) {
				// Check if any tag has class name
				return comment.tags.some(function (tag) {
					return tag.type === matchingTagName;
				});
			}).forEach(function (comment) {
				grunt.log.debug("Adding comment for [" + (comment.description.summary) + "]");
				interestingComments.push(comment);
			});

			interestingComments.forEach(function (comment) {
				if (comment.description) {
					output += comment.description.full + "\n";
				}
			});

			// In case we have generated some output for that file we may save it
			if (output.length > 0) {
				grunt.file.write(destFile, tokenParser.parse(output, profile));
				filesGenerated++;
			} else {
				grunt.verbose.error("Docs missing for file [" + srcFile + "]");
			}
		}

		// First we prepare the paths
		this.files.forEach(preparePaths);

		grunt.log.subhead("Parsing source code for " + this.target);

		// Later we parse all comments found in those paths
		files.forEach(parseFileComments);

		if (filesGenerated > 0) {
			grunt.log.ok("Created " + filesGenerated + " files");
		} else {
			grunt.log.error("No file was generated");
		}
	});

	function generateMenuForWidgets(widgets) {
		var buffer = "",
			i,
			length;

		for (i = 0, length = widgets.length; i < length; ++i) {
			buffer += "<li><a href=\"" + widgets[i].file + "\">" + widgets[i].name + "</a></li>";
		}

		return buffer;
	}

	function fixWidgetPaths(substring, widget) {
		widget.file = widget.file.replace(substring, "");
		return widget;
	}

	grunt.registerTask("developer-guide-build", "Builds developer guide", function () {
		var opts = this.options(),
			files = [],
			res = [],
			version = opts.version || "1.0",
			src = opts.sourceDir,
			dest = opts.destinationDir,
			widgetGuide = opts.extractFromJsDuck || false,
			done = this.async(),
			doneFiles = 0,
			file,
			fileName,
			fullFileName,
			destination,
			mobileMenu = "",
			tvMenu = "",
			coreMenu = "",
			wearableMenu = "",
			relativePathPrefix = "/",
			i,
			resources = opts.sourceResources.map(function (item) {
				return src + sep + item;
			}),
			markdownFiles = opts.sourceMarkdown.map(function (item) {
				return src + sep + item;
			}),
			success = function () {
				if (files.length === ++doneFiles) {
					copyResources(grunt, src, res, dest, done);
				}
			},
			fail = function (file) {
				grunt.log.error("Convertion of " + file + " failed!");
				done(false);
			};

		if (widgetGuide) {
			grunt.task.requires("developer-guide-extract");
		}

		mu.root = path.resolve("./guide-templates");

		files = grunt.file.expand(markdownFiles);
		res = grunt.file.expand(resources);

		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}

		if (widgetGuide) {
			widgetFiles.mobile.map(fixWidgetPaths.bind(null, src + "/"));
			widgetFiles.tv.map(fixWidgetPaths.bind(null, src + "/"));
			widgetFiles.core.map(fixWidgetPaths.bind(null, src + "/"));
			widgetFiles.wearable.map(fixWidgetPaths.bind(null, src + "/"));

			mobileMenu = generateMenuForWidgets(widgetFiles.mobile);
			tvMenu = generateMenuForWidgets(widgetFiles.tv);
			wearableMenu = generateMenuForWidgets(widgetFiles.wearable);
			coreMenu = generateMenuForWidgets(widgetFiles.core);
		}

		grunt.log.write("Generating html...");
		i = files.length;
		while (--i >= 0) {
			file = files[i];
			if (grunt.file.isFile(file)) {
				fullFileName = path.basename(file);
				fileName = path.basename(fullFileName, "md");
				relativePathPrefix = path.relative(file, src).replace(/\.\.$/, "");
				destination = file.replace(src, dest).replace(fullFileName, fileName + "html");


				grunt.verbose.writeln("Converting " + file + " => " + destination);
				processDocument(
					file,
					destination,
					{
						relativePathPrefix: relativePathPrefix,
						mobileMenu: mobileMenu,
						tvMenu: tvMenu,
						wearableMenu: wearableMenu,
						coreMenu: coreMenu,
						widgetGuide: widgetGuide,
						version: version
					},
					success,
					fail
				);
			}
		}
		grunt.log.ok();
	});

	// the following was disabled for now, please dont remove the comment
	// grunt.registerTask("developer-guide", ['clean:guide', 'developer-guide-extract', 'developer-guide-build']);
	grunt.registerTask("developer-guide", ["clean:guide", "developer-guide-build"]);
};
