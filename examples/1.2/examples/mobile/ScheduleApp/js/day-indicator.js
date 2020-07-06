class DayControl extends HTMLElement {

	connectedCallback() {
		this.classList.add("day-control");
	}
}

customElements.define("day-control", DayControl);

class DayIndicator extends HTMLElement {

	constructor() {
		super();
		this.daysLabels = ["S", "M", "T", "W", "T", "F", "S"];
	}

	connectedCallback() {
		this.classList.add("day-indicator");
		this._build();
		this._updateActiveDays();
	}

	attributeChangedCallback(attrName) {
		if (attrName == "active" && this.days) {
			this._updateActiveDays();
		}
	}

	static get observedAttributes() {
		return ["active"];
	}

	get active() {
		return this.getAttribute("active");
	}

	set active(value) {
		this.setAttribute("active", value);
		this._updateActiveDays();
	}

	_build() {
		var i;

		this.innerHTML = "";
		this.days = [];
		for (i = 0; i < 7; i++) {
			this.days[i] = document.createElement("day-control");
			this.days[i].innerText = this.daysLabels[i];
			this.appendChild(this.days[i]);
		}
	}

	_parseActiveDays() {
		return this.active ? this.active.split(" ").map((el) => +el) : [];
	}

	_updateActiveDays() {
		this.days.forEach((el) => {
			el.classList.remove("day-control-active");
		});

		this._parseActiveDays().forEach((el) => {
			this.days[el].classList.add("day-control-active");
		});

	}
}


customElements.define("day-indicator", DayIndicator);