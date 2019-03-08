var load = tau.util.load;

module("core/util/load");

test("tau.util.load - check the existence of objects/functions", function() {
    equal(typeof tau, "object", "tau exists");
    equal(typeof tau.util, "object", "tau.util exists");
    equal(typeof tau.util.load, "object", "tau.util.data exists");
    equal(typeof load.addElementToHead , "function", "function addElementToHead");
    equal(typeof load.cacheBust , "string", "member cacheBust ");
    equal(typeof load.makeLink , "function", "function makeLink");
    equal(typeof load.scriptSync , "function", "function scriptSync");
    equal(typeof load.themeCSS , "function", "function themeCSS");
});

test("cacheBurst", function() {
    equal(load.cacheBurst, undefined, "Without debug enabled - empty");
});

test("makeLink", function() {
    var linkString = "./tizen/themes/test.css",
        link = load.makeLink(linkString);
    equal(typeof link, "object", "Link is a proper object");
    equal(link.getAttribute("rel"), "stylesheet", "Rel attribute is set properly");
    equal(link.getAttribute("href"), linkString, "Href attribute is set properly");
    equal(link.getAttribute("name"), "tizen-theme", "tizen-theme attribute is set properly");
});

test("addElementToHead", function() {
    var url1 = "./themes/test1.css",
        url2 = "./themes/test2.css",
        link1 = load.makeLink(url1),
        link2 = load.makeLink(url2),
        currentChildrenLength = document.head.children.length;
    load.addElementToHead(link1, false);
    load.addElementToHead(link2, true);
    equal(document.head.children.length, currentChildrenLength+2, "Elements have been successfully added");
    equal(document.head.children[currentChildrenLength+1], link1, "Link has been added on the end");
    equal(document.head.children[0], link2, "Link has been added at the beginning");
});

test("scriptSync", function() {
    var x;
    function success() {
        ok(true, "Script sync works fine");
    }
    function failure() {
        ok(false, "Script sync fails");
    }
    load.scriptSync("./script/fake.js", success, failure);
});

test("themeCSS", function() {
    var path = "../../../../libs/dist/theme/default/tau.css",
        stylesheets, successFlag = false;
    load.themeCSS(path, "tau", true);
    ok(document.querySelector("style[data-name='tizen-theme'][data-theme-name='tau']"), "Css was changed");
});
