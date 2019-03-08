(function () {

	var testData = window.location.hash.substr(1).split("/"),
		profile = testData[0],
		testName = testData[1];

	function readTextFile(file, callback) {
		var rawFile = new XMLHttpRequest();

		rawFile.overrideMimeType("application/json");
		rawFile.open("GET", file, true);
		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				callback(rawFile.responseText);
			}
		};
		rawFile.send(null);
	}

	function buildCompare(testName, tests) {
		var div = document.createElement("div"),
			opacityInput = null,
			invertInput = null,
			resultImg = null,
			leftInput = null,
			topInput = null,
			left = 0,
			top = 0;

		document.body.appendChild(div);
		div.classList.add("container");
		div.innerHTML = "<div class=\"images\"><img id=\"pattern\" src=\"images/" + profile + "/" +testName +
			".png\" /><img id=\"result\" src=\"result/" + profile + "/" +testName +
			".png\" style=\"filter: invert(1)\"/></div><label class=\"small\">Result control:</label></lable><label>Opacity : <input type=\"range\" min=\"0\" max=\"1\" step=\"0.1\" value=\"0.5\" id=\"opacity\" /></label>" +
			"<label>Invert: <input type=\"range\" min=\"0\" max=\"1\" step=\"0.1\" value=\"1\" id=\"invert\" /></label>" +
			"<label>Left: <input type=\"number\" id=\"left\" min=\"-120\" max=\"120\" step=\"1\" value=\"0\" /></label>" +
			"<label>Top: <input type=\"number\"  id=\"top\" min=\"-120\" max=\"120\" step=\"1\" value=\"0\"/></label>";

		opacityInput = document.getElementById("opacity");
		invertInput = document.getElementById("invert");
		leftInput = document.getElementById("left");
		topInput = document.getElementById("top");
		resultImg = document.getElementById("result");
		opacityInput.addEventListener("mousemove", function (event) {
			var value = event.target.value;

			resultImg.style.opacity = value;
		});
		invertInput.addEventListener("mousemove", function (event) {
			var value = event.target.value;

			resultImg.style.filter = "invert(" + value + ")";
		});
		function positionEvent(event) {
			if (event.target === leftInput) {
				left = event.target.value;
			} else {
				top = event.target.value;
			}
			console.log(event.target.value);

			resultImg.style.transform = "translate(" + left +
				"px, " + top + "px)";
		}

		leftInput.addEventListener("keyup", positionEvent);
		topInput.addEventListener("keyup", positionEvent);
	}

	readTextFile("app/" + profile + "/test.txt", function (testNameFile) {
		testName = testName || testNameFile;
		readTextFile("app/" + profile + "/screenshots.json", function (text) {
			var tests = JSON.parse(text);

			if (testName) {
				tests = tests.filter(function (item) {
					return item.name === testName;
				});
			}
			buildCompare(testName, tests);
		});
	});

})();