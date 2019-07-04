/* global tau */
(function () {
	var footer = document.getElementById("footer"),
		page = document.getElementById("page"),
		br = document.createElement("br"),
		animations,
		information,
		base,
		index = 0,
		i = 0,
		len,
		animationIndex = 0,
		objects = [],
		timer,
		halfOfWidth = window.innerWidth / 2,
		halfOfHeight = window.innerHeight / 2,
		autoRotationDuration = 3000,
		duration = 1000,
		t = tau.animation.target;

	function reset(target) {
		var i;

		for (i = 0, len = target.length; i < len; i++) {
			t(target[i]).transform({
				translateX: 0,
				translateY: 0,
				translateZ: 0,
				scaleX: 1,
				scaleY: 1,
				skewX: 0,
				skewY: 0,
				rotateX: 0,
				rotateY: 0,
				rotateZ: 0
			});
			target[i].style.backgroundColor = "purple";
			target[i].innerText = "";
		}
	}

	function run() {
		base = Math.round(Math.max(halfOfWidth, halfOfHeight));

		objects = t(".boxes");

		for (i = 0, len = objects.length; i < len; i++) {
			objects[i].style.width = (base / 4) + "px";
			objects[i].style.height = (base / 4) + "px";
			objects[i].style.backgroundColor = "purple";
			objects[i].style.opacity = 0.7;
			objects[i].style.borderRadius = base / 25 + "px";
			objects[i].style.fontSize = (base / 4 / 5) + "px";
			objects[i].style.lineHeight = (base / 4) + "px";
			objects[i].style.verticalAlign = "middle";
			objects[i].style.display = "inline-block";
		}

		animations = [
			function () {
				objects.tween({translateY: 150, rotateZ: 180}, {duration: duration, ease: "linear"});
			},
			function () {
				objects.tween({translateY: 150, rotateZ: 180}, {duration: duration, ease: "bounceInOut"});
			},
			function () {
				t(objects[0]).tween({translateY: 150, rotateZ: 180}, {duration: duration, delay: 500});
				t(objects[1]).tween({translateY: 150, rotateZ: 180}, duration);
				t(objects[2]).tween({translateY: 150, rotateZ: 180}, duration);
				t(objects[3]).tween({translateY: 150, rotateZ: 180}, duration);
			},
			function () {
				objects.tween({translateY: 150, rotateZ: 180}, {duration: duration, stagger: 300});
			},
			function () {
				objects.tween({translateY: 150, rotateZ: 180}, {
					duration: duration,
					onStart: function () {
						for (i = 0, len = objects.length; i < len; i++) {
							objects[i].innerText = (i + 1) + "";
						}
					},
					onComplete: function () {
						objects.tween({backgroundColor: "silver"}, {duration: duration});
					}
				});
			}
		];

		information = [
			"Ease: linear", "Ease: bounceInOut",
			"Box1 delay",
			"Stagger",
			"Callback"
		];

		function animationChange(i, animationArray) {
			if (i === -1) {
				index = (((index + i) < 0) ? (animationArray.length - 1) : (index + i));
			} else if (i === 1) {
				index = (index + i) % animationArray.length;
			}

			animationArray[index]();

			timer = window.setTimeout(function () {
				reset(objects);
				animationChange(1, animationArray);
			}, autoRotationDuration);

			footer.innerText = information[index];
			footer.appendChild(br);
			footer.innerText += (index + 1) + " / " + animationArray.length;
		}

		animationChange(index, animations);

		page.addEventListener("click", function (e) {
			for (i = 0, len = objects.length; i < len; i++) {
				t(objects[i]).stop();
			}

			reset(objects);

			window.clearTimeout(timer);

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
		for (i = 0, len = objects.length; i < len; i++) {
			t(objects[i]).stop();
		}
		reset(objects);
		window.clearTimeout(timer);
	});
}());