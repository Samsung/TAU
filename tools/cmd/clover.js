#!/usr/bin/env node
/* eslint no-process-exit: off, no-console: off*/
// Tool to merge all clover xmls to one and add additional info like complexity and non comment line of code

var fs = require("fs"),
	path = require("path"),
	xml2js = require("xml2js"),
	parser = new xml2js.Parser(),
	builder = new xml2js.Builder(),
	sloc = require('sloc'),
	escomplex = require('escomplex'),
	async = require("async");

function readCoverage(profile, callback) {
	fs.readFile(path.join(__dirname, "..", "..", "report", "test", profile, "coverage", "clover", "clover.xml"), "UTF-8", function (err, data) {
		if (err) {
			console.error(err);
		}
		parser.parseString(data, function (err, result) {
			var xml;

			if (err) {
				console.error(err);
			}
			callback(result);
		});
	});
}

function moveMetricsToPackage(sourse, profile, profile2) {
	var properties = [
		"complexity", "packages", "files", "classes", "loc", "ncloc"
	],
		packages = sourse.coverage.project[0].package;
	properties.forEach((property) => {
		packages[0].metrics[0].$[property] =
			packages[0].metrics[0].$[property];
	});

	packages[0].$.name = profile;

	packages.forEach(function (package) {
		package.file.forEach(function (file) {
			file.$.path = file.$.path.replace("tests/libs/dist", "dist/" + (profile2 || profile));
		});
	})
}

function prepareElements(metricsNode) {
	var elementProperties = ["statements", "conditionals", "methods"],
		coveredElementProperties = ["coveredstatements", "coveredconditionals", "coveredmethods"];
	metricsNode.elements = "" + (elementProperties.reduce((previousValue, property) => {
			return previousValue + parseInt(metricsNode[property], 10);
		}, 0));
	metricsNode.coveredelements = "" + (coveredElementProperties.reduce((previousValue, property) => {
			return previousValue + parseInt(metricsNode[property], 10);
		}, 0));
}

function fillSLOC(fileNode, callback) {
	var path = fileNode.$.path;

	if (path.indexOf("dist") > -1) {
		path = path.substr(path.indexOf("dist/"));
	} else {
		path = path.substr(path.indexOf("src/js/"));
	}

	fs.readFile(path, "utf8", function (err, code) {
		var stats,
			complexity,
			metricsNode;

		if (typeof code === "string") {
			stats = sloc(code, "js");
		} else {
			stats = sloc("", "js");
			console.error("Problem for file ", path, err);
		}

		stats = sloc(code, "js");
		complexity = escomplex.analyse(code);
		metricsNode = fileNode.metrics[0].$;

		metricsNode.loc = stats.total;
		metricsNode.ncloc = stats.source;
		metricsNode.complexity = complexity.aggregate.cyclomatic;
		prepareElements(metricsNode);
		callback();
	});
}

readCoverage("mobile", function (mobileCoverage) {
	readCoverage("mobile_support", function (mobileSupportCoverage) {
		readCoverage("wearable", function (wearableCoverage) {
			readCoverage("karma", function (unitCoverage) {
				var fullCoverage = mobileCoverage,
					xml = "",
					statements = 0,
					coveredstatements = 0,
					conditionals = 0,
					coveredconditionals = 0,
					methods = 0,
					coveredmethods = 0,
					files = 0,
					classes = 0,
					loc = 0,
					ncloc = 0,
					complexity = 0;

				moveMetricsToPackage(wearableCoverage, "wearable");
				moveMetricsToPackage(mobileCoverage, "mobile");
				moveMetricsToPackage(mobileSupportCoverage, "mobile_support", "mobile");
				fullCoverage.coverage.project[0].package = fullCoverage.coverage.project[0].package.concat(wearableCoverage.coverage.project[0].package)
					.concat(mobileSupportCoverage.coverage.project[0].package)
					.concat(unitCoverage.coverage.project[0].package);

				async.forEach(fullCoverage.coverage.project[0].package, function (package, cb) {
					var metricsNode = package.metrics[0].$;
					statements += parseInt(metricsNode.statements, 10);
					coveredstatements += parseInt(metricsNode.coveredstatements, 10);
					conditionals += parseInt(metricsNode.conditionals, 10);
					coveredconditionals += parseInt(metricsNode.coveredconditionals, 10);
					methods += parseInt(metricsNode.methods, 10);
					coveredmethods += parseInt(metricsNode.coveredmethods, 10);

					async.forEach(package.file, fillSLOC, () => {
						var packageFiles = 0,
							packageClasses = 0,
							packageLoc = 0,
							packageNcloc = 0,
							packageComplexity = 0,
						metricsNode = package.metrics[0].$;

						package.file.forEach((file) => {
							var metricsNode = file.metrics[0].$;

							packageFiles++;
							packageClasses++;
							packageLoc += parseInt(metricsNode.loc, 10);
							packageNcloc += parseInt(metricsNode.ncloc, 10);
							packageComplexity += metricsNode.complexity;
						});

						files += packageFiles;
						classes += packageClasses;
						loc += packageLoc;
						ncloc += packageNcloc;
						complexity += packageComplexity;

						metricsNode.files = packageFiles;
						metricsNode.classes = packageClasses;
						metricsNode.loc = packageLoc;
						metricsNode.ncloc = packageNcloc;
						metricsNode.complexity = packageComplexity / packageFiles;
						metricsNode.packages = "1";
						prepareElements(metricsNode);
						cb();
					});
				}, () => {
					var metricsNode = fullCoverage.coverage.project[0].metrics[0].$;

					metricsNode.statements = statements;
					metricsNode.coveredstatements = coveredstatements;
					metricsNode.conditionals = conditionals;
					metricsNode.coveredconditionals = coveredconditionals;
					metricsNode.methods = methods;
					metricsNode.coveredmethods = coveredmethods;
					metricsNode.files = files;
					metricsNode.classes = classes;
					metricsNode.loc = loc;
					metricsNode.ncloc = ncloc;
					metricsNode.complexity = complexity / files;

					xml = builder.buildObject(fullCoverage);
					fs.mkdir(path.join(__dirname, "..", "..", "report", "test", "all"), function () {
						fs.mkdir(path.join(__dirname, "..", "..", "report", "test", "all", "coverage"), function () {
							fs.mkdir(path.join(__dirname, "", "..", "..", "report", "test", "all", "coverage", "clover"), function () {
								fs.writeFile(path.join(__dirname, "..", "..", "report", "test", "all", "coverage", "clover", "clover.xml"), xml);
							});
						});
					});
				});
			});
		});
	});
});