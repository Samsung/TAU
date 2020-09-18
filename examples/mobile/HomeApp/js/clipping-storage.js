class Storage {
	constructor() {
		this.appsList = JSON.parse(localStorage.getItem("appsList")) || [];
	}

	refreshStorage(element, data = []) {
		this[element] = data;
		localStorage.setItem(element, JSON.stringify(this[element]));
	}

	writeToStorage(element, link) {
		this[element].push(link);
		localStorage.setItem(element, JSON.stringify(this[element]));
	}

	readAllFromStorage(element) {
		return this[element];
	}

}

Storage.elements = {APPSLIST: "appsList"};

export default Storage;