(function (document, tau) {
    var page = document.getElementById("page-ctxpopup-horizontal-icons"),
        popupElement = document.getElementById("ctxpopup_horizontal_icons"),
        popup = tau.widget.Popup(popupElement, {
            positionTo: "#popup-open-button"
        }),
        onPageShow = function () {
            popup.open();
        };

    page.addEventListener("pageshow", onPageShow);

}(window.document, window.tau));

