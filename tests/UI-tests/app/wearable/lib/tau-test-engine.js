/*global tau, tizen */

var timerHandler = 0,
	FIRST_DELAY = 100,
	TEST_REQUEST_DIR = "downloads",
	// path on device: /opt/usr/home/owner/media/Downloads/test-status.txt
	TEST_REQUEST_FILE_NAME = "test-request.txt",
	TEST_RESPONSE_FILE_NAME = "test-response.txt",
	dir = null,
	first = true,
	tests,
	testCase = {};

function openCommunication(onSuccess) {
	if (window.tizen) {
		tizen.filesystem.resolve(TEST_REQUEST_DIR, function (resultDir) {
			// set global variable
			dir = resultDir;
			getResponse(function (response) {
				var lastIndex = tests.indexOf(response);

				if (lastIndex > -1) {
					tests = tests.slice(lastIndex);
				}

				// Remove old request file
				dir.deleteFile(TEST_REQUEST_FILE_NAME);
				onSuccess();
			}, true);
		});
	} else {
		onSuccess();
	}
}

function getResponse(onSuccess, doNotWait) {
	dir.listFiles(function (list) {
		var length = list.length,
			fileHandle = null,
			i;

		// important!
		// wait on request file delete
		for (i = 0; i < length; i++) {
			if (list[i].name === TEST_REQUEST_FILE_NAME) {
				fileHandle = list[i];
				break;
			}
		}

		if (fileHandle) {
			// Wait for remove request file
			if (doNotWait !== true) {
				requestAnimationFrame(getResponse.bind(null, onSuccess));
			} else {
				onSuccess("");
			}
		} else {
			// IF REQUEST FILE NAME HAS BEEN DELETED THEN GET RESPONSE
			if (!fileHandle) {
				// check if response file exists;
				for (i = 0; i < length; i++) {
					if (list[i].name === TEST_RESPONSE_FILE_NAME) {
						fileHandle = list[i];
						break;
					}
				}
			}

			if (fileHandle) {
				fileHandle.openStream("r",
					function (fileStream) {
						var status = fileStream.read(fileHandle.fileSize);

						fileStream.close();

						fileHandle = dir.deleteFile(TEST_RESPONSE_FILE_NAME);

						if (onSuccess) {
							onSuccess(status);
						}
					},
					function (err) {
						tau.log(err);
					});
			} else {
				// Wait for remove response file
				if (doNotWait !== true) {
					requestAnimationFrame(getResponse.bind(null, onSuccess));
				} else {
					onSuccess("");
				}
			}
		}
	});
}

function sendRequest(status, onSuccess) {
	var fileHandle,
		length,
		i;

	dir.listFiles(function (list) {
		length = list.length;

		// check request
		for (i = 0; i < length; i++) {
			if (list[i].name === TEST_REQUEST_FILE_NAME) {
				fileHandle = list[i];
				break;
			}
		}

		if (!fileHandle) {
			fileHandle = dir.createFile(TEST_REQUEST_FILE_NAME);
		}

		fileHandle.openStream("w",
			function (fileStream) {
				fileStream.write(status);
				fileStream.close();

				// wait for response from server;
				getResponse(onSuccess);
			},
			function (err) {
				tau.log(err);
			});
	});
}

function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();

	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4 && (rawFile.status == "200" ||
			rawFile.status === 0)) {
			callback(rawFile.responseText);
		}
	};
	rawFile.send(null);
}

function nextTestCase() {
	// prepare next test case
	testCase = tests.shift();

	if (testCase) {
		timerHandler = setTimeout(
			startTestCase,
			200
		);
	} else {
		setTimeout(function () {
			sendRequest("end!");
		}, 100);
	}
}

function startTestCase() {
	var dir = first ? "" : "../";

	first = false;

	if (testCase) {
		tau.changePage(dir + "tests/" + testCase.name + ".html");
	} else {
		clearTimeout(timerHandler);
	}
}

function onRequestSuccess() {
	nextTestCase();
}

function onPageChange(event) {
	var target = event.target,
		path = tau.util.path.parseUrl(target.dataset.url),
		timeoutFunction = testCase.time ? setTimeout : requestAnimationFrame;

	// wait 1s and take a screenshot, requered by gridview
	timeoutFunction(function () {
		sendRequest("take-screenshot:" + path.filename, onRequestSuccess);
	}, testCase.time);
}

function main() {
	readTextFile("_screenshots.json", function (text) {
		tests = JSON.parse(text);
		first = true;
		openCommunication(function () {
			if (tests.length > 0) {
				document.addEventListener("pageshow", onPageChange, true);
				testCase = tests.shift();
				timerHandler = setTimeout(startTestCase, FIRST_DELAY);
			} else {
				sendRequest("end!:Test case list is empty!");
			}
		});
	});
}

// start test;
main();

window.onerror = function (messageOrEvent, source, lineno, colno, error) {
	console.log("[E] " + source + " " + lineno + ":" + colno + " " + (error.stack || error || messageOrEvent));
	if (window.tizen !== undefined) {
		tizen.application.getCurrentApplication().exit();
	}
};
