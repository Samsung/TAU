/* global tau */
const tmpl = document.createElement("template"),
	requestURL = "webclip/restaurant/hotel-breakfast.html";

class HotelBreakfast extends HTMLElement {
	connectedCallback() {
		var s;

		if (!this.firstElementChild) {
			this.appendChild(tmpl.content.cloneNode(true));
			tau.engine.createWidgets(this);
		}
		s = this.querySelector(".ui-section-changer");

		// temporary fix for refresh section changer
		window.setTimeout(function () {
			tau.engine.getBinding(s).refresh();
		}, 200);
	}
}

fetch(requestURL)
	.then((response) => response.text())
	.then((data) => {
		tmpl.innerHTML = data;
	})
	.catch(() => {
		tmpl.innerHTML = "Unable to load WebClip content";
	})
	.finally(() => {
		customElements.define("hotel-breakfast", HotelBreakfast);
	});

