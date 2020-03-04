$().ready(function() {
	module("profile/mobile/widget/mobile/Drawer", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "Drawer" , function () {
		var drawerLeft = document.getElementById("drawer-left"),
			drawerRight = document.getElementById("drawer-right"),
			drawerLeftPosition = drawerLeft.getAttribute("data-position"),
			drawerRightPosition = drawerRight.getAttribute("data-position"),
			leftWidget = ej.engine.instanceWidget(drawerLeft, "Drawer", {
				dragEdge: 1
			}),
			rightWidget = ej.engine.instanceWidget(drawerRight, "Drawer", {
				dragEdge: 1
			});

		ok(drawerLeft.classList.contains("ui-drawer"), 'Drawer has ui-drawer class');
		ok(drawerLeft.classList.contains("ui-drawer-" + drawerLeftPosition), "Drawer has ui-drawer-" + drawerLeftPosition + " class");
		equal(typeof leftWidget._onSwipe, "function", "Method Drawer.onSwipe exists");

		// test swipe event handler of drawer
		leftWidget._isDrag = true;
		$("#drawer-left").trigger("swiperight");
		ok(drawerLeft.classList.contains("ui-drawer-open"), "Drawer can be opened by swipe");

		ok(drawerRight.classList.contains("ui-drawer"), 'Drawer has ui-drawer class');
		ok(drawerRight.classList.contains("ui-drawer-" + drawerRightPosition), "Drawer has ui-drawer-" + drawerRightPosition + " class");
		equal(typeof rightWidget._onSwipe, "function", "Method Drawer.onSwipe exists");

		// test swipe event handler of drawer
		rightWidget._isDrag = true;
		$("#drawer-right").trigger("swipeleft");
		ok(drawerRight.classList.contains("ui-drawer-open"), "Drawer can be opened by swipe");
	});
});
