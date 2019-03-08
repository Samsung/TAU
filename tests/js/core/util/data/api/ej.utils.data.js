var data = ej.util.data;

module("core/util/data");

test("ej.util.data - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.util, "object", "ej.util exists");
	equal(typeof ej.util.data, "object", "ej.util.data exists");
	equal(typeof data.set, "function", "function set");
	equal(typeof data.get, "function", "function get");
	equal(typeof data.remove, "function", "function remove");
});

test("ej.util.data - check function set", function () {
	var elem1 = document.getElementById("data1");

	equal(typeof data.set(elem1, "newstring", "newvalue"), "string", "function set returns string value");
	equal(data.set(elem1, "newstring", "newvalue"), "newvalue", "function set returns value");
	equal(typeof data.set(elem1, "newboolean", true), "boolean", "function set returns boolean value");
	equal(data.set(elem1, "newboolean", true), true, "function set returns value");
	equal(typeof data.set(elem1, "newnumber", 1), "number", "function set returns number value");
	equal(data.set(elem1, "newnumber", 1), 1, "function set returns value");
});

test("ej.util.data - check function get", function () {
	var elem1 = document.getElementById("data1");
	data.set(elem1, "newstring", "newvalue");
	data.set(elem1, "newboolean", true);
	data.set(elem1, "newnumber", 1);

	equal(typeof data.get(elem1, "newstring"), "string", "function get returns string");
	equal(data.get(elem1, "newstring"), "newvalue", "function get returns value");
	equal(typeof data.get(elem1, "newboolean"), "boolean", "function get returns boolean");
	equal(data.get(elem1, "newboolean"), true, "function get returns value");
	equal(typeof data.get(elem1, "newnumber"), "number", "function get returns number");
	equal(data.get(elem1, "newnumber"), 1, "function get returns value");
});

test("ej.util.data - check function remove", function () {
	var elem1 = document.getElementById("data1");
	data.set(elem1, "newnumber", 1);

	equal(typeof data.remove(elem1, "newdata"), "boolean", "function remove returns boolean");
	equal(typeof data.remove(elem1, "newnumber"), "boolean", "function remove returns boolean");

	data.set(elem1, "newnumber", 1);

	equal(data.remove(elem1, "new"), false, "function remove returns false");
	equal(data.remove(elem1, "newnumber"), true, "function remove returns true");
});