/* global tau */
(function () {
	var page = document.getElementById("page"),
		box = document.getElementById("box"),
		footer = document.getElementById("footer"),
		br = document.createElement("br"),
		animations,
		information,
		base,
		timer,
		index = 0,
		animationIndex = 0,
		tempFontSize,
		originalWidth,
		originalHeight,
		originalFontSize,
		halfOfWidth,
		halfOfHeight,
		autoRotationDuration = 3000,
		duration = 1000,
		t = tau.animation.target;

	function reset(target) {
		target.style.backgroundColor = "purple";
		target.style.width = originalWidth;
		target.style.height = originalHeight;
		target.style.fontSize = originalFontSize + "px";
		target.style.boxShadow = "0px 0px 0px 0px black";
	}

	function run() {
		halfOfWidth = window.innerWidth / 2;
		halfOfHeight = window.innerHeight / 2;
		base = Math.round(Math.max(halfOfWidth, halfOfHeight));

		box.style.display = "inline-block";
		box.style.backgroundColor = "purple";
		box.style.opacity = 0.7;
		box.style.borderRadius = base / 25 + "px";
		box.style.width = (base / 3) + "px";
		box.style.height = (base / 3) + "px";
		box.style.fontSize = (base / 3 / 4) + "px";
		box.style.lineHeight = (base / 3) + "px";
		box.style.verticalAlign = "middle";
		box.innerText = "CSS";

		originalFontSize = parseFloat(window.getComputedStyle(box).fontSize.match(/^[+-]?\d*(\.?\d*)/g));
		originalWidth = window.getComputedStyle(box).width;
		originalHeight = window.getComputedStyle(box).height;
		tempFontSize = originalFontSize + "px";

		animations = [
			function () {
				t(box).tween({width: (base / 2), height: (base / 2), backgroundColor: "purple", boxShadow: "0px 0px 0px 0px white", fontSize: tempFontSize}, duration)
                    .tween({width: originalWidth, height: originalHeight, backgroundColor: "purple", boxShadow: "0px 0px 0px 0px white", fontSize: tempFontSize}, duration);
			},
			function () {
				t(box).tween({width: originalWidth, height: originalHeight, backgroundColor: "red", boxShadow: "0px 0px 0px 0px white", fontSize: tempFontSize}, duration)
                    .tween({width: originalWidth, height: originalHeight, backgroundColor: "purple", boxShadow: "0px 0px 0px 0px white", fontSize: tempFontSize}, duration);
			},
			function () {
				t(box).tween({width: originalWidth, height: originalHeight, backgroundColor: "purple", boxShadow: "30px 30px 30px 5px white", fontSize: tempFontSize}, duration)
                    .tween({width: originalWidth, height: originalHeight, backgroundColor: "purple", boxShadow: "0px 0px 0px 0px white", fontSize: tempFontSize}, duration);
			},
			function () {
				t(box).tween({width: originalWidth, height: originalHeight, backgroundColor: "purple", boxShadow: "0px 0px 0px 0px white", fontSize: (originalFontSize + 20) + "px"}, duration)
                    .tween({width: originalWidth, height: originalHeight, backgroundColor: "purple", boxShadow: "0px 0px 0px 0px white", fontSize: tempFontSize}, duration);
			}
		];

		information = [
			"Width & Height", "change backgroundColor", "white boxShadow", "FontSize"
		];

		function animationChange(i, animationArray) {
			t(box).stop();

			if (i === -1) {
				index = (((index + i) < 0) ? (animationArray.length - 1) : (index + i));
			} else if (i === 1) {
				index = (index + i) % animationArray.length;
			}

			animationArray[index]();

			timer = window.setTimeout(function () {
				reset(box);
				animationChange(1, animationArray);
			}, autoRotationDuration);

			footer.innerText = information[index];
			footer.appendChild(br);
			footer.innerText += (index + 1) + " / " + animationArray.length;
		}

		animationChange(index, animations);

		page.addEventListener("click", function (e) {
			window.clearTimeout(timer);
			reset(box);

			if (halfOfWidth < e.clientX) {
				animationIndex = 1;
			} else {
				animationIndex = -1;
			}

			animationChange(animationIndex, animations);
		});
	}

	page.addEventListener("pageshow", function () {
		run();
	});

	page.addEventListener("pagehide", function () {
		t(box).stop();
		window.clearTimeout(timer);
		reset(box);
	});
}());