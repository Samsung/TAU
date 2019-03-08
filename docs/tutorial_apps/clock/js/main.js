/*global window, tizen */
(function (window, document) {
    "use strict";
    window.addEventListener("load", function () {
        var textbox = document.querySelector('.contents');
        // Sample code
        textbox.addEventListener("click", function () {
            var box = document.querySelector('#textbox');
            box.innerHTML = box.innerHTML === "Basic" ? "Sample" : "Basic";
        });
    });
}(window, window.document));
