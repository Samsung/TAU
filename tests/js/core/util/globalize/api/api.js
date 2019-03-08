module("core/util/globalize");

var globalize = tau.util.globalize;

test("globalize - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof tau.util.globalize, "object", "tau.util.globalize exists");
	equal(typeof tau.util.globalize.importModule, "function", "tau.util.globalize.importModule exists");
	equal(typeof tau.util.globalize.setLocale, "function", "tau.util.globalize.setLocale exists");
	equal(typeof tau.util.globalize.getLocale, "function", "tau.util.globalize.getLocale exists");
	equal(typeof tau.util.globalize.getCalendar, "function", "tau.util.globalize.getCalendar exists");
});
