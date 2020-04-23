(function () {
	var page = document.getElementById("radio-demo"),
		idx,
		radios = document.querySelectorAll("input[name='radio-el']"),
		radioText1 = document.getElementById("radio-text-1"),
		radioText2 = document.getElementById("radio-text-2");

	function setRadioResultFromTarget(target) {
		var marqueeContent1 = radioText1.querySelector(".ui-marquee-content") || radioText1.querySelector(".ui-marquee"),
			marqueeContent2 = radioText2.querySelector(".ui-marquee-content") || radioText2.querySelector(".ui-marquee");

		if (target.id === "radio-1") {
			marqueeContent1.innerHTML = "Radio on";
			marqueeContent2.innerHTML = "Radio off";
		} else if (target.id === "radio-2") {
			marqueeContent1.innerHTML = "Radio off";
			marqueeContent2.innerHTML = "Radio on";
		}
	}

	page.addEventListener("pageshow", function () {
		for (idx = 0; idx < radios.length; idx++) {
			radios[idx].addEventListener("change", function (event) {
				setRadioResultFromTarget(event.target);
			});
		}
	});
}());
