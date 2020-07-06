/* global tau */
(function () {
	var page = document.getElementById("page"),
		box = document.getElementById("box"),
		footer = document.getElementById("footer"),
		br = document.createElement("br"),
		effectList,
		animations,
		timer,
		base,
		index = 0,
		animationIndex = 0,
		halfOfWidth = window.innerWidth / 2,
		halfOfHeight = window.innerHeight / 2,
		autoRotationDuration = 3000,
		duration = 1000,
		t = tau.animation.target;

	function reset(target) {
		t(target).transform({translateX: 0, translateY: 0, translateZ: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, rotateX: 0, rotateY: 0, rotateZ: 0});
		target.style.opacity = 0.7;
		target.style.visibility = "visible";
	}

	function run() {
		base = Math.round(Math.max(halfOfWidth, halfOfHeight));

		box.style.display = "inline-block";
		box.style.backgroundColor = "purple";
		box.style.opacity = 0.7;
		box.style.borderRadius = base / 25 + "px";
		box.style.width = (base / 2.5) + "px";
		box.style.height = (base / 2.5) + "px";
		box.style.fontSize = (base / 3 / 5) + "px";
		box.style.lineHeight = (base / 2.5) + "px";
		box.style.verticalAlign = "middle";
		box.innerText = "Effects";

		animations = [
			function (i) {
				t(box).tween(effectList[i], {duration: duration,
					onComplete: function () {
						reset(box);
					}});
			}
		];

		effectList = [
			"bounce", "flash", "pulse", "rubberBand", "shake", "swing", "tada", "wobble", "jello",
			"bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp",
			"bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp",
			"fadeIn", "fadeInDown", "fadeInLeft", "fadeInRight", "fadeInUp",
			"fadeOut", "fadeOutDown", "fadeOutLeft", "fadeOutRight", "fadeOutUp",
			"flip", "flipInX", "flipInY", "flipOutX", "flipOutY",
			"lightSpeedIn", "lightSpeedOut",
			"rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight",
			"rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight",
			"slideInUp", "slideInDown", "slideInLeft", "slideInRight",
			"slideOutUp", "slideOutDown", "slideOutLeft", "slideOutRight",
			"zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp",
			"zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "zoomOutUp",
			"hinge", "rollIn", "rollOut"
		];

		function animationChange(i, animationArray) {
			t(box).stop();

			if (i === -1) {
				index = (((index + i) < 0) ? (effectList.length - 1) : (index + i));
			} else if (i === 1) {
				index = (index + i) % effectList.length;
			}

			animationArray[0](index);

			timer = window.setTimeout(function () {
				reset(box);
				animationChange(1, animationArray);
			}, autoRotationDuration);

			footer.innerText = effectList[index];
			footer.appendChild(br);
			footer.innerText += (index + 1) + " / " + effectList.length;
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