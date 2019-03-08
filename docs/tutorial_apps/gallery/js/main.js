/*global window, document, $, tau, JSON, console */
/*jslint plusplus: true*/

(function () {
    'use strict';

    /**
    * Closing application
    */
    var closeApp = function () {
        tizen.application.getCurrentApplication().exit();
    };

    /**
    * Animation for scrolling view to top
    */
    var moveToTop = function(currentTop, stepTop) {
        var section = document.getElementById("galleryPageSection"),
            secTop = currentTop || section.scrollTop,
            stepTop = stepTop || Math.floor(secTop / 25);
        if (secTop >= stepTop) {
            setTimeout(function() {
                section.scrollTop = secTop - stepTop;
                moveToTop(secTop - stepTop, stepTop);
            }, 20);
        } else {
            section.scrollTop = 0;
        }
    };

    /**
    * Initialize function
    */
    var init = function () {
        var galleryPage = document.getElementById("galleryPage"),
            imagePage = document.getElementById("imagePage"),
            imageToShow = document.getElementById("imageToShow"),
            moveToTopBtn = document.getElementById("moveToTop");

        // Calculate proper size for image in gallery page
        galleryPage.addEventListener("pageshow", function(ev) {
            var section = document.getElementById("galleryPageSection"),
                sectionHeight = Math.ceil(0.5 * parseInt(section.style.height)) + "px",
                sectionWidth = Math.ceil(0.5 * parseInt(document.width)) + "px",
                imageDivs = document.querySelectorAll(".img-container"),
                i = imageDivs.length;
            while (i--) {
                imageDivs[i].style.height = sectionHeight;
                imageDivs[i].style.width = sectionWidth;
                // Add Click event to gallery element
                // for changing page and load proper image
                imageDivs[i].addEventListener("click", function(ev) {
                    var imgSrc = this.getAttribute("data-url");
                    ev.stopPropagation();
                    ev.preventDefault();
                    imagePage.style.backgroundImage = "url(" + imgSrc + ")";
                    imageToShow.setAttribute("src", imgSrc);
                    imageToShow.style.display = "none";
                    tau.changePage("#imagePage");
                });
            }
        });

        // center image
        imagePage.addEventListener("click", function(ev) {
            if (imageToShow.style.display === "none") {
                imageToShow.style.display = "block";
                window.scrollTo(
                    (imageToShow.offsetWidth  - window.innerWidth ) / 2,
                    (imageToShow.offsetHeight - window.innerHeight) / 2
                );
            } else {
                window.scrollTo(0, 0);
                imageToShow.style.display = "none";
            }
        });

        // Add click event to button for view scrolling top
        moveToTopBtn.addEventListener("click", function(ev) {
            moveToTop();
        });

        // add eventListener for tizenhwkey
        document.addEventListener('tizenhwkey', function(e) {
            // no tau.activePage.id on mobile profile
            var activePageId = document.querySelector(".ui-page-active").getAttribute("id");
            if(e.keyName == "back") {
                if (activePageId === "galleryPage") {
	                closeApp();
                } else {
                    window.history.back();
                }
            }
        });
    };

    // init functions when all DOM content is loaded
    document.addEventListener('DOMContentLoaded', function(e) {
        init();
    });

}());
