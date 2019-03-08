/*global module, test, expect, stop, start, ej, ok, strictEqual, equal */
/*jslint plusplus: true, nomen: true */
module("core/util/object");

(function (ns) {
	var SimpleObject = function (prop1) {
		this.prop1 = prop1;
	};
	SimpleObject.prototype.protProp1 = "prototyp";

	test("ns.util.object.copy - checking copy function", function () {
		var data = ns.util.object,
			orgObject = {},
			newObject;

		orgObject.prop1 = "one";
		orgObject.prop2 = 2;
		newObject = data.copy(orgObject);
		equal(typeof newObject, "object", "The returned value is an object");
		equal(newObject.prop1, orgObject.prop1, "New Object has same properties as orginal Object properties by copy");
		equal(newObject.prop2, orgObject.prop2, "New Object has same properties as orginal Object properties by copy");

		orgObject = new SimpleObject("one");
		newObject = data.copy(orgObject);
		equal(newObject.prop1, orgObject.prop1, "New Object has same properties as orginal Object properties by copy");
		notEqual(newObject.protProp1, orgObject.prop1, "The prototype property wasn't copied");
	});

	test("ns.util.object.merge - checking merge function", function () {
		var data = ns.util.object,
			newObject,
			orgObject;

		newObject = new SimpleObject("one");
		newObject.prop2 = "twonew";
		orgObject = {};
		orgObject.propertyToMerge = "original";
		orgObject.prop2 = "twooriginal";
		orgObject.prop3 = [1,2,3];

		data.merge(newObject, orgObject);
		equal(newObject.propertyToMerge, orgObject.propertyToMerge, "New Object has same properties as orginal Object properties by copy");
		equal(newObject.prop2, orgObject.prop2, "New Object has same properties as orginal Object properties by copy");
		equal(newObject.prop3, orgObject.prop3, "New Object has same properties as orginal Object properties by copy");
		orgObject.prop3.push(4);
		equal(newObject.prop3, orgObject.prop3, "Both objects point to this same array, its not a deep copy");

		newObject = new SimpleObject("one");
		newObject.prop2 = "twonew";
		data.merge(newObject, orgObject, true);
		equal(newObject.prop2, orgObject.prop2, "New Object has same properties as orginal Object properties by copy");

		newObject = new SimpleObject("one");
		newObject.prop2 = "twonew";
		data.merge(newObject, orgObject, false);
		equal(newObject.prop2, newObject.prop2, "New Object has same properties as new Object properties by copy");
	});

	test("ns.util.object.inherit - checking inherit function", function () {
		var data = ns.util.object,
			newClass = function () {},
			orgClass = function () {},
			newObject;

		orgClass.prototype = {
			method: function () {
				return true;
			}
		};

		data.inherit(newClass, orgClass, {
			method: function () {
				return this._super();
			},
			newMethod: function() {
				return this._super();
			}
		});

		newObject = new newClass();

		equal(newObject.method(), true, "New class method return value from original class");
		equal(newObject.newMethod(), null, "New class method return null");
	});

	test("ns.util.object.merge - checking merge function", function () {
		var data = ns.util.object,
			newObject,
			orgObject1,
			orgObject2;

		orgObject1 = {};
		orgObject2 = {};
		newObject = {};
		orgObject1.prop1o = "orgObject1";
		orgObject2.prop2o = "orgObject2";
		newObject.prop1 = "newObject";

		data.merge(newObject, orgObject1, orgObject2);
		equal(newObject.prop1o, orgObject1.prop1o, "New Object has same properties as orgObject1 Object properties by copy");
		equal(newObject.prop2o, orgObject2.prop2o, "New Object has same properties as orgObject2 Object properties by copy");

	});

	test("util.object.hasPropertiesOfValue", function (){
		"use strict";

		var objectUtils = ns.util.object,
			obj = { a: 1, c: function() { return 1; }, test: "a"},
			reference = obj,
			emptyObject = {},
			objectPropsFullOfUndefined = {a: undefined, b: undefined, c: undefined, d: undefined, e: undefined},
			objectPropsFullOfNull = {a: null, b: null, c: null, d: null},
			objectPropsFullOfStrings = {a: 'abc', b:'abc', c: 'abc', d: 'abc', e: 'abc', f: 'abc', g: 'abc'},
			objectPropsFullOfNumbers = {a: 5, b: 5, c: 5, d: 5},
			objectPropsFullOfObjectReferences = {a: reference, b: reference, c: reference, d: reference},
			objectPropsFullOfObjectThatLookThatSame = {a: {a:1}, b: {a:1}, c: {a:1}},
			objectPropsMixedNullZeroUndefined = {a: null, b: null, c: null, d: undefined, e: undefined, f: 0, g: 0},
			objectPropsMixedReferenceUndefined = {a: reference, b: reference, c: undefined, d: reference},
			objectPropsMixedReferenceNull = {a: reference, b: reference, c: null, d: reference};

		strictEqual(objectUtils.hasPropertiesOfValue(emptyObject), false, "Empty object returns false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsFullOfUndefined), true, "Object full of props `undefined` returns true");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsFullOfNull, null), true, "Object full of props `null` returns true");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsFullOfStrings, "abc"), true, "Object full of props `\"abc\"` asked for \"abc\" returns true");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsFullOfNumbers, 5), true, "Object full of props `5` asked for `5` returns true");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsFullOfNumbers, "5"), false, "Object full of props `5` asked for `\"5\"` returns false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsFullOfObjectReferences, reference), true, "Object full of props with reference as value asked for that reference returns true");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsFullOfObjectThatLookThatSame, {a: 1}), false, "Object full of props with objects that look that same asked for that same object returns false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsMixedNullZeroUndefined, null), false, "Object mixed (null, 0, undefined) asked for `null` return false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsMixedNullZeroUndefined, undefined), false, "Object mixed (null, 0, undefined) asked for `undefined` return false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsMixedNullZeroUndefined, 0), false, "Object mixed (null, 0, undefined) asked for `0` return false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsMixedReferenceUndefined, undefined), false, "Object mixed (reference, undefined) asked for `undefined` return false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsMixedReferenceUndefined, reference), false, "Object mixed (reference, undefined) asked for `undefined` return false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsMixedReferenceNull, null), false, "Object mixed (reference, null) asked for `null` returns false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsMixedReferenceNull, reference), false, "Object mixed (reference, null) asked for `reference` returns false");
		strictEqual(objectUtils.hasPropertiesOfValue(objectPropsMixedReferenceNull, undefined), false, "Object mixed (reference, null) asked for `undefined` returns false");
	});

	test("ns.util.object.removeProperties - checking removeProperties function", function () {
		var data = ns.util.object,
			object;

		object = {
			a: 1,
			b: 2,
			c: 3
		};

		equal(Object.keys(object).length, 3, "Object has 3 properties before removing");
		equal(object.a, 1, "Property a has value 1");
		data.removeProperties(object, []);
		equal(Object.keys(object).length, 3, "Object has 3 properties after not removing anything");
		data.removeProperties(object, ["a"]);
		equal(Object.keys(object).length, 2, "Object has 2 properties after removing property a");
		equal(object.a, undefined, "Property a is undefined after removing");
		data.removeProperties(object, ["a", "b", "c"]);
		equal(Object.keys(object).length, 0, "Object has no property");
	});
}(window.tau));