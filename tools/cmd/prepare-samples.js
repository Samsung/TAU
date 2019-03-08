#!/usr/bin/env node
/* eslint no-process-exit: off, no-console: off*/

var cmd = require("./lib/cmd"),
	config = require("./config/apps.json"),
	fs = require('fs'),
	xml2js = require("xml2js"),
	parser = new xml2js.Parser(),
	builder = new xml2js.Builder(),
	branch = "tizen_3.0",
	actions = [
		// build TAU
		"grunt build",
		// rm artifacts directory
		"rm -rf artifacts/demos",
		// create new artifacts demos directory
		(callback) => {
			fs.mkdir("artifacts", () => {
				fs.mkdir("artifacts/demos", () => {
					callback();
				});
			});
		},
		// go to directory
		chdir("artifacts/demos")
	],
	sampleName = "",
	tauVersion;

/**
 * Change dir function
 * @param {string} dir
 * @returns {function(*)}
 */
function chdir(dir) {
	return (callback) => {
		console.log(`Running: cd ${dir}`);
		process.chdir(dir);
		callback();
	}
}

/**
 * Increase version of sample
 * @param {function} callback
 */
function descriptionVersionUp(callback) {
	fs.readFile("description.xml", "UTF-8", function (err, data) {
		if (err) {
			console.error(err);
			callback();
		} else {
			// read XML
			parser.parseString(data, function (err, result) {
				var sampleVersion,
					lastVersionNumber;

				if (err) {
					console.error(err);
					callback();
				} else {
					// get version
					sampleVersion = result.Overview.SampleVersion[0].split(".");
					lastVersionNumber = parseInt(sampleVersion.pop(), 10);

					// get sample name
					sampleName = result.Overview.SampleName[0];
					// prepare new version
					lastVersionNumber++;
					sampleVersion.push(lastVersionNumber);

					// save new version
					result.Overview.SampleVersion[0] = sampleVersion.join(".");

					// prepare and write XML
					fs.writeFile("description.xml", builder.buildObject(result), function (error) {
						if (error) {
							console.error(error);
						}
						callback();
					});
				}
			});
		}
	});
}

/**
 * Read TAU version from file
 * @param callback
 */
function getTAUVersion(callback) {
	fs.readFile("project/lib/tau/VERSION", "UTF-8", function (err, data) {
		if (err) {
			console.error(err);
		} else {
			tauVersion = data.trim();
		}
		callback();
	});
}

config.apps.forEach((sample) => {
	var dir = sample.project.split("/").pop(),
		profile = sample.profile,
		app = sample.app;
	// clone repository of sample
	actions.push(`git clone ssh://165.213.149.170:29418/${sample.project}`);
	actions.push(chdir(dir));
	// get hook
	actions.push("scp -p -P 29418 165.213.149.170:hooks/commit-msg .git/hooks/");
	// get branch
	actions.push("git fetch --all");
	actions.push(`git checkout ${branch}`);
	// clear old files
	actions.push("rm -rf project/*");
	// copy new files
	actions.push(`cp -a ../../../demos/${app}/* project/`);
	// rm TAU link
	actions.push("rm -rf project/lib/tau");
	// copy TAU files
	actions.push(`mkdir -p project/lib/tau/${profile}`);
	actions.push(`cp -a ../../../dist/${profile}/* project/lib/tau/${profile}/`);
	actions.push("cp -a ../../../dist/LICENSE.Flora project/lib/tau");
	actions.push("cp -a ../../../dist/VERSION project/lib/tau");
	// version UP
	actions.push(descriptionVersionUp);
	actions.push(getTAUVersion);
	// add files to git
	actions.push("git add -A");
	// do commit
	actions.push([() => "git commit -m \"" + sampleName.replace(/ /g, "") + "-TAU(" + tauVersion + ")release\""]);
	// push to gerrit
	actions.push("git push origin HEAD:refs/for/" + branch);
	// go back for next sample
	actions.push(chdir(".."));
});

// start command chain
cmd.chain.apply(cmd.chain, actions);