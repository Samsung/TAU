/* global tau */
document.addEventListener("cardcontentchange", function (e) {
	var card = e.target,
		apps;

	if (card.id === "apps-on-tv") {
		apps = card.querySelector(".webclip-apps");
		apps.addEventListener("vclick", function (e) {
			var currentActive = apps.querySelector(".ui-active-item"),
				selected = tau.util.selectors.getClosestBySelector(e.target, ".ui-container > *"),
				activeContainer,
				selectedContainer;

			// toggle selected
			if (currentActive && currentActive !== selected) {
				currentActive.classList.remove("ui-active-item");
				selected.classList.add("ui-active-item");

				// container change
				activeContainer = card.querySelector(".ui-container-active");
				activeContainer.classList.remove("ui-container-active");
				activeContainer.classList.add("ui-container-hidden");

				selectedContainer = card.querySelector(".app-" + selected.dataset.container);
				selectedContainer.classList.add("ui-container-active");
				selectedContainer.classList.remove("ui-container-hidden");

				// reset scroll position
				card.querySelector(".ui-content").scrollLeft = 0;
			}
		}, true)
	}

});