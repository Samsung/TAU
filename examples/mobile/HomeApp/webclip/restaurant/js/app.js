var sectionChanger = document.querySelector(".ui-section-changer"),
	tau = window.tau;

tau.engine.createWidgets(sectionChanger);

// refresh section changer
window.setTimeout(function () {
	tau.engine.getBinding(sectionChanger).refresh();
}, 200);
