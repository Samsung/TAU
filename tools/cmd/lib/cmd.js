/* eslint no-console: 0, no-process-exit: 0 */

var exec = require("child_process").exec,
	async = require("async"),
	cmd = {
		/**
		 * Run chain of commands and callbacks
		 */
		chain: function () {
			var args = [].slice.call(arguments);

			async.eachSeries(args, function (item, callback) {
				var command = "",
					processFunction = null;

				// if only string is in array then it is command without callback
				if (typeof item === "string") {
					command = item;
					// if only function is in array then it is function to call, not operation
				} else if (typeof item === "function") {
					processFunction = item;
					// if item is Array
				} else if (item instanceof Array) {
					// if first item is string then it is command
					if (typeof item[0] === "string") {
						command = item[0];
						// if first item is function, then it is command template function
					} else if (typeof item[0] === "function") {
						command = item[0]();
					}

					// if second item is function, then it is callback for command
					if (typeof item[1] === "function") {
						processFunction = item[1];
					}
				}

				// if command exists then run it
				if (command) {
					console.log("Running: " + command);
					exec(
						command,
						function (err, data, stderr) {
							// if stderr is not empty then display it
							if (stderr) {
								console.error(stderr);
							}
							// when command return code different from 0 then display it and finish
							if (err) {
								if (data) {
									console.log(data);
								}
								console.error("exec error: " + err);
								process.exit(err);
							}
							// if process callback is defined then process it with stdout
							if (processFunction) {
								processFunction(data, callback);
							} else {
								// otherwise got to next operation
								callback();
							}
						}
					);
				} else {
					// if process callback is defined without command then run it
					if (processFunction) {
						processFunction(callback);
					} else {
						// otherwise got to next operation
						callback();
					}
				}
			});
		}
	};

module.exports = cmd;