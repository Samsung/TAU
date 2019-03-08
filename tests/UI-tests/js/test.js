/* global $, resemble */
$(function () {
	var resembleControl,
		buttons = $(".buttons button"),
		testCount = 0,
		testDiff = 0;

	function onComplete(mode, data) {
		var diffImage = new Image(),
			color = "red",
			percent = parseFloat(data.misMatchPercentage);

		if (mode === "show") {
			diffImage.src = data.getImageDataUrl();

			$("#image-diff").html(diffImage);

			$(".buttons").show();

			if (data.misMatchPercentage == 0) {
				$("#thesame").show();
				$("#diff-results").hide();
			} else {
				$("#mismatch").text(data.misMatchPercentage);
				if (!data.isSameDimensions) {
					$("#differentdimensions").show();
				} else {
					$("#differentdimensions").hide();
				}
				$("#diff-results").show();
				$("#thesame").hide();
			}
		} else {
			if (data.misMatchPercentage === "0.00") {
				color = "green";
			} else if (percent < 10) {
				color = "gold";
			} else if (percent < 25) {
				color = "darkorange";
			}
			if (data.misMatchPercentage) {
				document.getElementById(mode).innerHTML = data.misMatchPercentage;
				document.getElementById(mode).style.backgroundColor = color;
				testDiff += percent;
				testCount++;
				document.getElementById("sumarize").innerHTML = "Avg diff: " + Math.round(testDiff / testCount * 100) / 100 + "%";
			} else {
				document.getElementById(mode).parentElement.style.opacity = 0.3;
			}
		}
	}

	buttons.click(function () {
		var $this = $(this);

		$this.parent(".buttons").find("button").removeClass("active");
		$this.addClass("active");

		if ($this.is("#raw")) {
			resembleControl.ignoreNothing();
		} else if ($this.is("#less")) {
			resembleControl.ignoreLess();
		}
		if ($this.is("#colors")) {
			resembleControl.ignoreColors();
		} else if ($this.is("#antialising")) {
			resembleControl.ignoreAntialiasing();
		} else if ($this.is("#same-size")) {
			resembleControl.scaleToSameSize();
		} else if ($this.is("#original-size")) {
			resembleControl.useOriginalSize();
		} else if ($this.is("#pink")) {
			resemble.outputSettings({
				errorColor: {
					red: 255,
					green: 0,
					blue: 255
				}
			});
			resembleControl.repaint();
		} else if ($this.is("#yellow")) {
			resemble.outputSettings({
				errorColor: {
					red: 255,
					green: 255,
					blue: 0
				}
			});
			resembleControl.repaint();
		} else if ($this.is("#flat")) {
			resemble.outputSettings({
				errorType: "flat"
			});
			resembleControl.repaint();
		} else if ($this.is("#movement")) {
			resemble.outputSettings({
				errorType: "movement"
			});
			resembleControl.repaint();
		} else if ($this.is("#flatDifferenceIntensity")) {
			resemble.outputSettings({
				errorType: "flatDifferenceIntensity"
			});
			resembleControl.repaint();
		} else if ($this.is("#movementDifferenceIntensity")) {
			resemble.outputSettings({
				errorType: "movementDifferenceIntensity"
			});
			resembleControl.repaint();
		} else if ($this.is("#opaque")) {
			resemble.outputSettings({
				transparency: 1
			});
			resembleControl.repaint();
		} else if ($this.is("#transparent")) {
			resemble.outputSettings({
				transparency: 0.3
			});
			resembleControl.repaint();
		}
	});

	function show(profile, testType, testName) {
		$("#dropzone1").html("<img src=\"result/" + profile + "/" + testType + "/" + testName + ".png\"/>");
		$("#dropzone2").html("<img src=\"images/" + profile + "/" + testType + "/" + testName + ".png\"/>");
		load(profile, testType, testName, "show");
	}

	function load(profile, testType, testName, mode) {
		var xhr = new XMLHttpRequest(),
			xhr2 = new XMLHttpRequest(),
			done = $.Deferred(),
			dtwo = $.Deferred();

		xhr.open("GET", "result/" + profile + "/" + testType + "/" + testName + ".png", true);
		xhr.responseType = "blob";
		xhr.onload = function () {
			done.resolve(this.response);
		};
		xhr.send();

		xhr2.open("GET", "images/" + profile + "/" + testType + "/" + testName + ".png", true);
		xhr2.responseType = "blob";
		xhr2.onload = function () {
			dtwo.resolve(this.response);
		};
		xhr2.send();

		$.when(done, dtwo).done(function (file, file1) {
			resembleControl = resemble(file).compareTo(file1).onComplete(onComplete.bind(null, mode || (profile + testType + testName)));
		});

		return false;
	}

	(function () {
		var xhr = new XMLHttpRequest();

		xhr.open("GET", "config.json", true);
		xhr.onload = function () {
			var config = JSON.parse(this.responseText),
				tests = [];

			config.forEach(function (item) {
				item.screens.forEach(function (test) {
					test.profile = item.profile;
					test.type = item.type;
					tests.push(test);
				})
			});

			$("#list").html(tests.map(function (test) {
				load(test.profile, test.type, test.name);

				return "<a href='#" + test.profile + "/" + test.type + "/" + test.name + "'" + (test.pass ? " class='pass'" : "") + ">" + test.name + " <span class='badge'>" + test.profile[0] + "</span> <span class='badge'>" + test.type + "</span> <span class='badge' id='" + test.profile + test.type + test.name + "'></span></a>";
			}).join(""));
		};
		xhr.send();


		window.onhashchange = function () {
			var testData = window.location.hash.substr(1).split("/"),
				profile = testData[0],
				testType = testData[1],
				testName = testData[2];

			show(profile, testType, testName);
		};
	}());

});