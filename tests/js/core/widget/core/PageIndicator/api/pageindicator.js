module("core/widget/core/PageIndicator", {});

test("API", function () {
    var elPageIndicator = document.getElementById("pageIndicator"),
        widget;
    equal(typeof tau, 'object', 'Class tau exists');
    equal(typeof tau.widget, 'object', 'Class tau.widget exists');
    equal(typeof tau.widget.core, 'object', 'Class tau.widget.wearable exists');
    equal(typeof tau.widget.core.PageIndicator, 'function', 'Class tau.widget.wearable.PageIndicator exists');
    widget = tau.widget.PageIndicator(elPageIndicator);

    equal(typeof widget.configure, 'function', 'Method PageIndicator.configure exists');
    equal(typeof widget._createIndicator, 'function', 'Method PageIndicator._getCreateOptions exists');
    equal(typeof widget.build, 'function', 'Method PageIndicator.build exists');
    equal(typeof widget.init, 'function', 'Method PageIndicator.init exists');
    equal(typeof widget.destroy, 'function', 'Method PageIndicator.destroy exists');
    equal(typeof widget.disable, 'function', 'Method PageIndicator.disable exists');
    equal(typeof widget.enable, 'function', 'Method PageIndicator.enable exists');
    equal(typeof widget.refresh, 'function', 'Method PageIndicator.refresh exists');
    equal(typeof widget.option, 'function', 'Method PageIndicator.option exists');

    equal(typeof widget.setActive, 'function', 'Method PageIndicator.setActive exists');
});
