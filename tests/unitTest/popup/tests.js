(function($){

	var popupEvents = "popupbeforecreate popupcreate popupbeforehide popupbeforeshow popuphide popupshow".split(" "),

		eventStack = [],

		checkPopupLayout = function( popup ) {
			var screenWidth = $(window).width(),
				screenHeight = $(window).height(),
				$popup = $( popup ),
				popupHeaderHeight = $popup.children(".ui-popup-header").outerHeight(),
				popupFooterHeight = $popup.children(".ui-popup-footer").outerHeight(),
				popupContentHeight = $popup.children(".ui-popup-content").outerHeight();
			return popupHeaderHeight + popupFooterHeight + popupContentHeight === $popup.innerHeight()
				&& $popup.outerHeight(true) === screenHeight;
		},

		checkActivePopup = function( popup ) {
			var active = $(".ui-popup-active"),
				popupkey = "popup=true";
			return location.hash.indexOf( popupkey ) > -1 &&
				active.length === 1 &&
				active[0] === $(popup)[0];
		},

		checkHasNotActivePopup = function( ) {
			var active = $(".ui-popup-active"),
				popupkey = "popup=true";
			return location.hash.indexOf( popupkey ) === -1 &&
			active.length === 0;
		};

		popupEvents.forEach(function(eventName, idx) {
			document.addEventListener(eventName, function( event ) {
				eventStack.push({
					type: event.type,
					target: event.target
				});
			}, false);
		});

	asyncTest( "fire popup events", function() {
		var popup = $("#popup")[0];

		helper.one(document, "popupshow", function() {
			ok(eventStack[0].type === "popupbeforecreate" && eventStack[0].target === popup, "popupbeforecreate event is fired");
			ok(eventStack[1].type === "popupcreate" && eventStack[1].target === popup, "popupcreate event is fired");
			ok(eventStack[2].type === "popupbeforeshow" && eventStack[2].target === popup, "popupbeforeshow event is fired");
			ok(eventStack[3].type === "popupshow" && eventStack[3].target === popup, "popupshow event is fired");

			helper.one(document, "popuphide", function() {
				ok(eventStack[4].type === "popupbeforehide" && eventStack[3].target === popup, "popupbeforehide event is fired");
				ok(eventStack[5].type === "popuphide" && eventStack[3].target === popup, "popuphide event is fired");

				eventStack.length = 0;
				start();
			});

			gear.ui.closePopup();
		});

		eventStack.length = 0;
		gear.ui.openPopup(popup);
	});

	asyncTest( "test popup apis", function(){
		helper.popupSequence([
			function() {
				gear.ui.openPopup( "#layout-test-header-footer" );
			},

			function() {
				ok(checkActivePopup("#layout-test-header-footer"), "call gear.ui.openPopup() with dom element id");
				gear.ui.closePopup();
			},

			function() {
				gear.ui.openPopup( "external.html" );
			},

			function() {
				ok(checkActivePopup("#externalPopup"), "open external popup.");
				gear.ui.closePopup();
			},

			function() {
				gear.ui.openPopup( "#layout-test-header" );
			},

			function() {
				ok(checkActivePopup("#layout-test-header"), "call open popup alreay another popup is opend");
				gear.ui.closePopup();
			},

			function() {
				gear.ui.openPopup( $("#layout-test-footer")[0] );
			},

			function() {
				ok(checkActivePopup("#layout-test-footer"), "call gear.ui.openPopup() with dom element ");
				gear.ui.closePopup();
			},

			function() {
				ok(checkHasNotActivePopup(), "call gear.ui.closePopup()");
			}

		], true);
	});

	asyncTest( "various popup layout", function(){
		helper.popupSequence([
			function() {
				gear.ui.openPopup( "#layout-test-header-footer" );
			},

			function() {
				ok(checkPopupLayout("#layout-test-header-footer"), "set popup layout with header and footer");
				gear.ui.closePopup();
			},

			function() {
				gear.ui.openPopup( "#layout-test-header" );
			},

			function() {
				ok(checkPopupLayout("#layout-test-header"), "set popup layout with header");
				gear.ui.closePopup();
			},

			function() {
				gear.ui.openPopup( "#layout-test-footer" );
			},

			function() {
				ok(checkPopupLayout("#layout-test-footer"), "set popup layout with footer");
				gear.ui.closePopup();
			},

			function() {
				gear.ui.openPopup( "#layout-test-content-padding" );
			},

			function() {
				ok(checkPopupLayout("#layout-test-content-padding"), "set popup layout with custom content");
				gear.ui.closePopup();
			},

			function() {
			}

		], true);
	});

	asyncTest( "Open internal popup in external page", function() {
		helper.pageSequence([
			function() {
				gear.ui.changePage( "externalPage.html" );
			},

			function() {
				helper.popupSequence([
					function() {
						gear.ui.openPopup( "#popup-in-externl-page" );
					},

					function() {
						ok(checkActivePopup("#popup-in-externl-page"), "open internal popup in external page");
						gear.ui.closePopup();
					},

					function() {
						gear.ui.back();
					}
				]);
			},

			function() {
			}
		], true);
	});

	asyncTest( "Navigating away from the page closes the popup", function() {
		var popup = $("#has-external-link-popup");

		helper.pageSequence([
			function() {
				helper.one(document, "popupshow", function() {
					popup.find("a")[0].click();
				});

				gear.ui.openPopup( popup );
			},

			function() {
				ok(checkHasNotActivePopup(), "closed popup on page change.");

				helper.one(document, "popupshow", function() {
					gear.ui.changePage( "index.html" );
				});

				gear.ui.openPopup( "#popup-in-externl-page" );
			},

			function() {
				ok(checkHasNotActivePopup(), "closed popup on gear.ui.back().");
			}
		], true);
	});

	asyncTest( "Opening another popup from the popup closes the popup", function() {
		var popup = $( "#has-popup-link-popup" );

		helper.popupSequence([
			function() {
				gear.ui.openPopup( popup );
			},

			function() {
				// another popup link click.
				popup.find( "a" )[0].click();
			},

			function() {
				ok( !popup.hasClass(".ui-popup-active"), "old popup closed" );
			},

			function() {
				ok(checkActivePopup("#another-popup"), "new popup opened ");
				gear.ui.closePopup();
			},

			function() {
			}

		], true);
	});

	asyncTest( "Opening another page from the popup leaves no trace of the popup in history", function() {
		var popup = $("#has-external-link-popup");

		helper.pageSequence([
			function() {
				helper.one(document, "popupshow", function() {
					popup.find("a")[0].click();
				});

				gear.ui.openPopup( popup );
			},

			function() {
				ok(checkHasNotActivePopup(), "closed popup on page change.");
				gear.ui.back();
			},

			function() {
				ok(checkHasNotActivePopup(), "doesn't have popup hash.");
			}
		], true);
	});

})(jQuery);