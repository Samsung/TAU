/*global test, ok, equal*/
/**
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ej){
	"use strict";

	var engine = ej.engine;

	module("core/engine");

	test("engine object", function() {
		ok(!!engine, "Engine exists");
	});

	test("engine properties are set", function () {
		equal(typeof engine.justBuild, "boolean", ".justBuild is set");

		ok(!!engine.dataTau, ".dataTau exists");
		equal(engine.dataTau.built, 'data-tau-built', ".dataTau.built === 'data-tau-built'");
		equal(engine.dataTau.name, 'data-tau-name', ".dataTau.name === 'data-tau-name'");
		equal(engine.dataTau.bound, 'data-tau-bound', ".dataTau.bound === 'data-tau-bound'");
		equal(engine.dataTau.separator, ',', ".dataTau.separator === ','");
	});

	test("core engine methods", function () {
		// Bindings
		equal(typeof engine.getBinding, "function", ".getBinding exists");
		equal(typeof engine.setBinding, "function", ".setBinding exists");
		equal(typeof engine.removeBinding, "function", ".removeBinding exists");
		equal(typeof engine.removeAllBindings, "function", ".removeAllBindings exists");
		// Many Bindings
		equal(typeof engine.getAllBindings, "function", ".getBindings exists");
		// Widget creation
		equal(typeof engine.build, "function", ".build exists");
		equal(typeof engine.destroyWidget, "function", ".destroyWidget exits");
		equal(typeof engine.createWidgets, "function", ".createWidgets exists");
		equal(typeof engine.getDefinitions, "function", ".getDefinitions exists");
		equal(typeof engine.getWidgetDefinition, "function", ".getWidgetDefinition exists");
		equal(typeof engine.defineWidget, "function", ".defineWidget exists");
		// Start / Stop
		equal(typeof engine.run, "function", ".run exists");
		equal(typeof engine.stop, "function", ".stop exists");
		equal(typeof engine.getRouter, "function", ".getRouter exists");
		equal(typeof engine.instanceWidget, "function", ".instanceWidget exists");
		// Properties change
		equal(typeof engine.setJustBuild, "function", ".setJustBuild exists");
		equal(typeof engine.getJustBuild, "function", ".getJustBuild exists");
		// Private methods
		equal(typeof engine._clearBindings, "function", "._clearBindings exists");
		equal(typeof engine._createEventHandler, "function", "._createEventHandler exists");
	});

}(window.ej));