/*global tau, test, module, equal */
module("core/history/api/history");
test ( "ns.history" , function () {
	var history = tau.history;
	equal(typeof tau, "object", "Class tau exists");
	equal(typeof tau.history, "object", "Class tau.history exists");
	equal(typeof history.activeState, "object", "Object tau.history.activeState exists");
	equal(typeof history.replace, "function", "Method tau.history.replace exists");
	equal(typeof history.back, "function", "Method tau.history.back exists");
	equal(typeof history.setActive, "function", "Method tau.history.setActive exists");
	equal(typeof history.getDirection, "function", "Method tau.history.getDirection exists");
	equal(typeof history.enableVolatileMode, "function", "Method tau.history.enableVolatileRecord exists");
	equal(typeof history.disableVolatileMode, "function", "Method tau.history.disableVolatileMode exists");
});