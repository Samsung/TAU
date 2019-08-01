( function () {
	var page1 = document.getElementById("one"),
		page2 = document.getElementById("two"),
		getChildren = tau.util.selectors.getChildrenByTag;

	window.addEventListener( "tizenhwkey", function( ev ) {
		if( ev.keyName === "back" ) {
			var activePopup = document.querySelector( ".ui-popup-active" ),
				page = document.getElementsByClassName( "ui-page-active" )[0],
				pageid = page ? page.id : "";

			if( pageid === "one" && !activePopup ) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	} );

	function init() {
		var view = page2.querySelector("img");

		function onClick(ev) {
			var img = getChildren(ev.target, "img")[0];

			if (img) {
				view.src = img.getAttribute("src");
			}
		}

		page1.addEventListener("pagebeforeshow", function () {
			page1.addEventListener("vclick", onClick, true);
		});

		page1.addEventListener("pagebeforehide", function () {
			page1.removeEventListener("vclick", onClick, true);
		});
	}

	init();
} () );