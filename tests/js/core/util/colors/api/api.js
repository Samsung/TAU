var colors = tau.util.colors;

module("core/util/colors");

test("check the existence of objects/functions", function () {
    equal(typeof tau, "object", "tau exists");
    equal(typeof tau.util, "object", "tau.util exists");
    equal(typeof tau.util.colors, "object", "tau.util.colors exists");
});

test("nearestInt", function () {
    equal(colors.nearestInt(1), 1, "Correctly found nearest int for 1");
    equal(colors.nearestInt(1.25), 1, "Correctly found nearest int for 1.25");
    equal(colors.nearestInt(0.99), 1, "Correctly found nearest int for 0.99");
    equal(colors.nearestInt(0.5), 0, "Correctly found nearest int for 0.5");
});

test("HTMLToRGB", function () {
    var rgbColour = colors.HTMLToRGB("#ffffff");
    ok(rgbColour[0] === 1 && rgbColour[1] === 1 && rgbColour[2] === 1, "Correctly found rgb for #ffffff");
});

test("RGBToHTML", function () {
    equal(colors.RGBToHTML([0.5,1,0]), "#7fff00", "Correctly found html for rgb[0.5,1,0]");
});

test("HSLToRGB", function () {
    var rgbColour = colors.HSLToRGB([71,0.84,0.44]);
    ok(rgbColour[0] === 0.6740799999999998 && rgbColour[1] === 0.8096 && rgbColour[2] === 0.07040000000000002, "Correctly found rgb for hsl[71,0.84,0.44]");
});

test("HSVToRGB", function () {
    var rgbColour = colors.HSVToRGB([60,0.5,1]);
    ok(rgbColour[0] === 0.9999999999999999 && rgbColour[1] === 1 && rgbColour[2] === 0.5, "Correctly found rgb for hsv[60,0.5,1]");
});

test("RGBToHSV", function () {
    var hsvColour = colors.RGBToHSV([1,1,0.5]);
    ok(hsvColour[0] === 60 && hsvColour[1] === 0.5 && hsvColour[2] === 1, "Correctly found hsv for rgb[1,1,0.5]");
});

test("HSVToHSL", function () {
    var hslColour = colors.HSVToHSL([60,0.5,1]);
    ok(hslColour[0] === 60 && hslColour[1] === 1 && hslColour[2] === 0.75, "Correctly found hsl for hsv[60,0.5,1]");
});

test("RGBToHSL", function () {
    var hslColour = colors.RGBToHSL([1,1,0.5]);
    ok(hslColour[0] === 60 && hslColour[1] === 1 && hslColour[2] === 0.75, "Correctly found hsl for rgb[1,1,0.5]");
});