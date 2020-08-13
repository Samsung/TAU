class Storage {
	constructor() {
		this.activeWebClips = JSON.parse(localStorage.getItem("activeWebClips")) || [];
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

Storage.elements = {ACTIVEWEBCLIPS: "activeWebClips"};

export default Storage;