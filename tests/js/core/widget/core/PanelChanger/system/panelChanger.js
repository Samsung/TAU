module("core/widget/core/PanelChanger", {});

var element = document.getElementById('qunit-fixture');
element.addEventListener('widgetbuilt', function() {

	test ( "PanelChanger" , function () {
		var panelChanger = document.getElementById("panelChanger"),
			panels = panelChanger.getElementsByClassName("ui-panel");

		ok(panelChanger.classList.contains("ui-panel-changer"), "ui-panel-changer class existed");
		ok(panels[0].classList.contains("ui-panel-active"), "ui-panel-active class existed");

	});
});
