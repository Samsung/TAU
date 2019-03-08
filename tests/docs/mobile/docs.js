/*global ok, equal, module, test, $, jQM2, Element, Window, Document, ns */
/*jslint forin: true*/
module("compare");

(function (tau, doocumentation, showProtected) {
	"use strict";
	var key;

	function findDocumentationObject(name) {
		return doocumentation.filter(function(classObject) {
			return classObject.name === name;
		})[0];
	}

	function findProperty(name, key) {
		var objectDocumentation = findDocumentationObject(name),
			objectNameArray = name.split("."),
			parentObjectKey = objectNameArray.pop() + "." + key,
			parentObjectName =  objectNameArray.join("."),
			parentObjectDocumentation = findDocumentationObject(parentObjectName);
		return ((key.substring(0, 7) === "options" ? (objectDocumentation && objectDocumentation.options && (objectDocumentation.options.filter(function(methodObject) {
			return  methodObject.name === "data-" + key.replace("options.", "").replace(/[A-Z]/g, function (c) {
				return "-" + c.toLowerCase();
			});
		})[0])) : (objectDocumentation && objectDocumentation.properties && (objectDocumentation.properties.filter(function(methodObject) {
			return  methodObject.name === key;
		})[0])) || (parentObjectDocumentation && parentObjectDocumentation.properties && (parentObjectDocumentation.properties.filter(function(methodObject) {
			return  methodObject.name === key;
		})[0]))));
	}

	function checkProperty(key, name) {
		var topLevelProperty = findProperty(name, key),
			objectNameArray = name.split("."),
			parentObjectKey = objectNameArray.pop() + "." + key,
			parentObjectName =  objectNameArray.join(".");
		ok(topLevelProperty || findProperty(parentObjectName, parentObjectKey), "property " + name + '.' + key + ' exists');
	}

	function isClass(object) {
		var i,
			count = 0;
		for (i in object.prototype) {
			count++;
		}
		return !!count;
	}

	function checkAll(object, name) {
		var key;
		for (key in object) {
			if (object.hasOwnProperty(key) && (showProtected || key[0] !== "_") && (key !== "constructor") && key !== "options") {
				if (typeof object[key] === "object" && !(object[key] instanceof HTMLElement)) {
					if (findProperty(name, key)) {
						checkProperty(key, name);
					} else {
						checkClass(object[key], name + "." + key);
					}
				} else if (typeof object[key] === "function") {
					if (isClass(object[key])) {
						checkClass(object[key], name + "." + key);
					} else {
						checkMethod(key, name);
					}
				} else {
					checkProperty(key, name);
				}
			}
		}
	}

	function checkClass(object, name) {
		test(name, function () {
			ok(findDocumentationObject(name), name + ' exists');
			checkAll(object, name);
			if (object) {
				checkAll(object.prototype, name);
			}
		});
	}

	function checkMethod(key, name) {
		var objectDocumentation = findDocumentationObject(name);
		ok(objectDocumentation && objectDocumentation.methods && (objectDocumentation.methods.filter(function(methodObject) {
			return  methodObject.name === key;
		})).length, "method " + name + '.' + key + ' exists');
	}

	checkClass(tau, 'ns');

}(window.tau, window.tauDocumentation, window.showProtected));