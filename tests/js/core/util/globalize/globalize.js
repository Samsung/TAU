/*global module, test, expect, stop, start, ej, ok, strictEqual, equal, notStrictEqual */
/*jslint plusplus: true, nomen: true */
module("core/util/globalize");

var globalize = tau.util.globalize;

asyncTest("tau.util.globalize - setLocale()", function () {
	'use strict';

	globalize.setLocale("ko").done(function(instance){
		start();
		strictEqual(instance.getLocale(), "ko", "getLocale() is ok");
	});

});

test("tau.util.globalize - getLocale()", function(){
	strictEqual(globalize.getLocale(), "ko", "static getLocale() is ok");
});

test("tau.util.globalize - getCalendar()", function(){
	strictEqual(typeof globalize.getCalendar(), "object", "static getLocale() is ok");
});

asyncTest("tau.util.globalize - RTL", function(){
	globalize.setLocale("ar").done(function(instance){

		var classList = document.body.classList;

		start();
		strictEqual(instance.rtl, true, "static getLocale() is ok");
		strictEqual(classList.contains("ui-script-direction-rtl"), true , "static getLocale() is ok");
	})

});

