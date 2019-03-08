/*
 * Unit Test: tokentextarea
 *
 * @author Kamil Stepczuk <k.stepczuk@samsung.com>
 */
'use strict';
module("support/mobile/widget/Tokentextarea.extra");


var createTest = function (element) {
    var input;

    ej.engine.instanceWidget(element, 'TokenTextarea');
    ok(element.classList.contains("ui-tokentextarea"), "Widget created");
    equal(ej.engine.instanceWidget(element).length(), 0, "Widget 0 length");
    ok(ej.engine.instanceWidget(element).inputText("bar"), "Widget input set");
    equal(ej.engine.instanceWidget(element).inputText(), "bar", "Widget input get");

    ej.engine.instanceWidget(element).add("foo");
    equal(ej.engine.instanceWidget(element).length(), 1, "Widget add 1st block with out parameter");
    ej.engine.instanceWidget(element).add("bar");
    equal(ej.engine.instanceWidget(element).length(), 2, "Widget add 2st block with out parameter");
    ej.engine.instanceWidget(element).add("baz", 1);
    equal(ej.engine.instanceWidget(element).length(), 3, "Widget add 3st block with parameter 1");

    /* test position of elements */
    equal(ej.engine.instanceWidget(element).select(0), undefined, "Widget select 1st element");
    equal(ej.engine.instanceWidget(element).select(), "foo", "Widget 1st element is ok");

    equal(ej.engine.instanceWidget(element).select(1), undefined, "Widget select 2st element");
    equal(ej.engine.instanceWidget(element).select(), "baz", "Widget 2st element is ok");

    equal(ej.engine.instanceWidget(element).select(2), undefined, "Widget select 3st element");
    equal(ej.engine.instanceWidget(element).select(), "bar", "Widget 3st element is ok");

    /* remove */
    ej.engine.instanceWidget(element).remove(2);
    equal(ej.engine.instanceWidget(element).length(), 2, "Widget remove block");

    ej.engine.instanceWidget(element).remove();
    equal(ej.engine.instanceWidget(element).length(), 0, "Widget remove all blocks");

    ej.engine.instanceWidget(element).focusOut();
    ok(element.classList.contains("ui-tokentextarea-focusout"), "Widget focus out");

    ej.engine.instanceWidget(element).focusIn();
    ok(element.classList.contains("ui-tokentextarea-focusin"), "Widget focus in");

    ej.engine.instanceWidget(element).destroy();
    ok(element.childNodes.length === 0, "Widget destroy");
};

var blockEventTests = function (element) {
    var elementQux,
        elementCorge;
    ej.engine.instanceWidget(element, 'TokenTextarea');

    ej.engine.instanceWidget(element, 'TokenTextarea');
    ej.engine.instanceWidget(element).add("qux");
    ej.engine.instanceWidget(element).add("corge");

    elementQux = element.getElementsByTagName("div")[0];
    elementCorge = element.getElementsByTagName("div")[1];
    ej.event.trigger(elementQux, "vclick");
    equal(ej.engine.instanceWidget(element).select(), "qux", "Block selected by click");

    ej.event.trigger(elementCorge, "vclick");
    equal(ej.engine.instanceWidget(element).select(), "corge", "Block change selected by click");

    ej.event.trigger(elementQux, "vclick");
    ej.event.trigger(elementQux, "vclick");
    equal(ej.engine.instanceWidget(element).length(), 1, "Block remove by click");
    ej.engine.instanceWidget(element).destroy();
};

var cssTests = function (element) {
    var classes = {
            uiTokentextarea: "ui-tokentextarea",
            uiTokentextareaLabel: "ui-tokentextarea-label",
            uiTokentextareaInput: "ui-tokentextarea-input",
            uiTokentextareaInputVisible: "ui-tokentextarea-input-visible",
            uiTokentextareaInputInvisible: "ui-tokentextarea-input-invisible",
            uiinputText: "ui-input-text",
            uiBodyS: "ui-body-s",
            uiTokentextareaLinkBase: "ui-tokentextarea-link-base",
            uiBtnBoxS: "ui-btn-box-s",
            uiTokentextareaSblock: "ui-tokentextarea-sblock",
            uiTokentextareaBlock: "ui-tokentextarea-block",
            uiTokentextareaFocusout: "ui-tokentextarea-focusout",
            uiTokentextareaFocusin: "ui-tokentextarea-focusin",
            uiTokentextareaSpanBlock: "ui-tokentextarea-span-block",
            uiTokentextareaInputArea: "ui-tokentextarea-input-area",
            uiTokentextareaDesclabel: "ui-tokentextarea-desclabel",
            uiTokentextareaInvisible: "ui-tokentextarea-invisible"
        },
        label,
        block,
        selectedBlock,
        inputArea,
        input,
        button;

    //prepare to test
    ej.engine.instanceWidget(element, 'TokenTextarea');
    ej.engine.instanceWidget(element).add("foo");
    ej.engine.instanceWidget(element).add("bar");
    ej.engine.instanceWidget(element).select(0);

    label = element.getElementsByTagName("span")[0];
    block = element.getElementsByTagName("div")[1];
    selectedBlock = element.getElementsByTagName("div")[0];
    inputArea = element.getElementsByTagName("div")[2];
    input = inputArea.getElementsByTagName("input")[0];
    button = inputArea.getElementsByTagName("a")[0];
    //test
    ok(element.classList.contains(classes.uiTokentextarea), "Widget have class ui-tokentextarea");
    ok(label.classList.contains(classes.uiTokentextareaLabel), "Label have class ui-tokentextarea-label");
    ok(block.classList.contains(classes.uiTokentextareaSpanBlock), "Block have class ui-tokentextarea-span-block");
    ok(block.classList.contains(classes.uiTokentextareaBlock), "Block have class ui-tokentextarea-block");

    equal(selectedBlock.classList.contains(classes.uiTokentextareaBlock), false, "Selected block havent class ui-tokentexarea-block");
    ok(selectedBlock.classList.contains(classes.uiTokentextareaSblock), "Selected block have class ui-tokentextarea-sblock");
    ok(selectedBlock.classList.contains(classes.uiTokentextareaSpanBlock), "Selected block have class ui-tokentextarea-span-block");

    ok(inputArea.classList.contains(classes.uiTokentextareaInputArea), "Input area have class ui-tokentextarea-input-area");
    ok(input.classList.contains(classes.uiTokentextareaInputVisible), "Input have class ui-tokentextarea-input-visible");
    ok(input.classList.contains(classes.uiinputText), "Input have class ui-input-text");
    ok(input.classList.contains(classes.uiBodyS), "Input have class ui-body-s");

    ok(button.classList.contains(classes.uiBtnBoxS), "Button have class ui-btn-box-s");
    ok(button.classList.contains(classes.uiTokentextareaLinkBase), "Button have class ui-tokentextarea-link-base");

    ej.engine.instanceWidget(element).destroy();
};

test("API", function () {
    var element = document.getElementById("foo");
    createTest(element);
});

test("Block event tests", function () {
    var element = document.getElementById("foo");
    blockEventTests(element);
});

test("CSS tests", function () {
    var element = document.getElementById("foo");
    cssTests(element);
});