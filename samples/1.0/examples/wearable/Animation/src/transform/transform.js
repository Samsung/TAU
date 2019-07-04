/* global tau */
(function () {
	var page = document.getElementById("page"),
		footer = document.getElementById("footer"),
		box = document.getElementById("box"),
		br = document.createElement("br"),
		animations,
		information,
		base,
		index = 0,
		animationIndex = 0,
		timer,
		halfOfWidth,
		halfOfHeight,
		autoRotationDuration = 3000,
		duration = 1000,
		t = tau.animation.target;

	function reset(target) {
		t(target).transform({translateX: 0, translateY: 0, translateZ: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, rotateX: 0, rotateY: 0, rotateZ: 0});
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
		box.style.fontSize = (base / 3 / 5) + "px";
		box.style.lineHeight = (base / 3) + "px";
		box.style.verticalAlign = "middle";
		box.innerText = "Transform";

		animations = [
			function () {
				t(box).tween({translateY: 150, rotateZ: 180, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0}, duration)
                    .tween({translateY: 0, rotateZ: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0}, duration);
			},
			function () {
				t(box).tween({translateY: 0, rotateZ: 0, scaleX: 1.5, scaleY: 1.5, skewX: 30, skewY: 30}, duration)
                    .tween({translateY: 0, rotateZ: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0}, duration);
			}
		];

		information = [
			"Translate & Rotate", "Scale & Skew"
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