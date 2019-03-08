(function(tau) {
	var page = document.getElementById("emailinput-demo"),
		textEnveloperElement = document.getElementById("textEnveloper"),
		textEnveloper,
		newValueBound;

	/**
	 * Adds a new item
	 */
	function onNewValue(event) {
		textEnveloper.add(event.detail.value);
	}

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function() {
		textEnveloper = tau.widget.TextEnveloper(textEnveloperElement);
		newValueBound = onNewValue.bind(this);
		textEnveloperElement.addEventListener("newvalue", newValueBound);
		textEnveloper.add("Sunder Mohan");
		textEnveloper.add("Marry");
		textEnveloper.add("Sunde");
		textEnveloper.add("Joe Peters");
		textEnveloper.add("Ann");
		textEnveloper.add("Park");
		textEnveloper.add("Sam Ock");
		textEnveloper.add("John Lee");
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function() {
		textEnveloperElement.removeEventListener("newvalue", newValueBound);
	});
}(window.tau));
