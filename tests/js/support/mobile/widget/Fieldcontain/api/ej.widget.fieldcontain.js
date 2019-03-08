(function (ns) {
	'use strict';
	module("support/mobile/widget/Fieldcontain");
	test("ns.widget.mobile.Fieldcontain - check the existence of objects/functions", function () {
		var field, Fieldcontain;
		equal(typeof ns, "object", "ns exists");
		equal(typeof ns.widget, "object", "ns.widget exists");
		equal(typeof ns.widget.mobile, "object", "ns.widget.mobile exists");
		equal(typeof ns.widget.mobile.FieldContain, "function", "ns.widget.mobile.Fieldcontain exists");

		field = new ns.widget.mobile.FieldContain();
		Fieldcontain = ns.widget.mobile.FieldContain;

		equal(typeof field._build, "function", "function _build");
		equal(typeof field.build, "function", "function build");
		equal(typeof field.configure, "function", "function configure");
		equal(typeof field._getCreateOptions, "function", "function _getCreateOptions");
		equal(typeof field.init, "function", "function init");
		equal(typeof field.bindEvents, "function", "function bindEvents");
		equal(typeof field.destroy, "function", "function destroy");
		equal(typeof field.disable, "function", "function disable");
		equal(typeof field.enable, "function", "function enable");
		equal(typeof field.refresh, "function", "function refresh");
		equal(typeof field.option, "function", "function option");

		equal(typeof Fieldcontain.classes, "object", "classes property");
		equal(Fieldcontain.classes.uiFieldContain, "ui-field-contain", "ui-field-contain class");
		equal(Fieldcontain.classes.uiBody, "ui-body", "ui-body class");
		equal(Fieldcontain.classes.uiBr, "ui-br", "ui-br class");
	});
}(ej));