/*global ok, equal, module, test, $, jQM2, Element, Window, Document, ns */
/*jslint forin: true*/
module("compare");

(function (ns) {
	"use strict";
	var key,
		exclude = ['$.mobile.nsNormalizeDict', '$.mobile.tizen._disableContextMenu'],
		excludeWidgetsFields = {
			'button': {
				'button': true
			},
			'listview' : {
				'parentPage' : true,
				'childPages' : true
			},
			'virtuallistview' : {
				'parentPage' : true,
				'childPages' : true
			},
			'popup' : {
				'_globalHandlers': true,
				'_orientationchangeInProgress': true,
				'_resizeData': true,
				'_tolerance': true,
				'_isPreOpen': true,
				'_prereqs': true,
				'_currentTransition': true,
				'_fallbackTransition': true
			},
			'pagelayout' : {
				'show' : true,
				'hide' : true,
				'toggle' : true
			},
			'widget' : {
				'uuid': 'notval',
				'eventNamespace': 'notval'
			},
			'gallery' : {
				'destory' : true
			}
		};

	function checkWidget(orginalObject, newObject, name) {
		var key2,
			orginalWidget = orginalObject('<div>').appendTo('#test')[name]().data(name),
			newWidget = newObject('<div>').appendTo('#ej-test')[name]().data(name),
			newWidgetKey2,
			orginalWidgetKey2;
		test('Widget test - ' + name, function () {
			ok(newWidget, name + ' exists');
			equal(typeof newWidget, typeof orginalWidget, name + ' should be type ' + (typeof orginalWidget));
			if (typeof orginalWidget === 'object') {
				for (key2 in orginalWidget) {
					if ((key2.substr(0, 1) !== '_') &&
							(!excludeWidgetsFields[name] ||
									(excludeWidgetsFields[name] && !excludeWidgetsFields[name][key2]))) {
						newWidgetKey2 = newWidget[key2];
						orginalWidgetKey2 = orginalWidget[key2];
						ok(newWidgetKey2 + ' exists');
						equal(typeof newWidgetKey2, typeof orginalWidgetKey2, key2 + ' should be type ' + (typeof orginalWidgetKey2));
						if (typeof orginalWidgetKey2 !== 'object' && typeof orginalWidgetKey2 !== 'function' &&
								(!excludeWidgetsFields[name] ||
										(excludeWidgetsFields[name] && !excludeWidgetsFields[name][key2] !== 'notval')) &&
										excludeWidgetsFields['widget'][key2] !== 'notval') {
							equal(newWidgetKey2, orginalWidgetKey2, key2 + ' should have value ' + orginalWidgetKey2);
						}
					}
				}
			}
		});
	}

	function checkProperty(key, orginalObject, newObject, name) {
		var key2,
			object,
			newObjectKey = newObject[key],
			orginalObjectKey = orginalObject[key];
		ok(newObject.hasOwnProperty(key), name + '.' + key + ' exists');
		equal(typeof newObjectKey, typeof orginalObjectKey, name + '.' + key + ' should be type ' + (typeof orginalObjectKey));
		if (typeof orginalObjectKey !== 'object' && typeof orginalObjectKey !== 'function') {
			equal(newObjectKey, orginalObjectKey, name + '.' + key + ' should have value ' + orginalObjectKey);
		}
		if (typeof orginalObjectKey === 'function') {
			try {
				object = new orginalObjectKey();
				if (object && object instanceof $.mobile.widget) {
					checkWidget($, jQM2, key);
				}
			} catch (ignore) {
				//ignore
			}
		} else if ((exclude.indexOf(name + '.' + key) === -1)
				&& (typeof orginalObjectKey === 'object')
				&& !(orginalObjectKey instanceof $)
				&& !(orginalObjectKey instanceof Element)
				&& !(orginalObjectKey === window)
				&& !(orginalObjectKey === document)) {
			for (key2 in orginalObjectKey) {
				if (orginalObjectKey.hasOwnProperty(key2)) {
					test(name + '.' + key + '.' + key2, checkProperty.bind(null, key2, orginalObjectKey, newObjectKey, '$.mobile.' + key));
				}
			}
		}
	}

	ns.engine.run();
	for (key in $.mobile) {
		if ($.mobile.hasOwnProperty(key)) {
			test('$.mobile.' + key, checkProperty.bind(null, key, $.mobile, jQM2.mobile, '$.mobile'));
		}
	}
	for (key in $.mobile.tizen) {
		if ($.mobile.tizen.hasOwnProperty(key)) {
			test('$.mobile.tizen.' + key, checkProperty.bind(null, key, $.mobile.tizen, jQM2.mobile.tizen, '$.mobile.tizen'));
		}
	}
	for (key in $.tizen) {
		if ($.tizen.hasOwnProperty(key)) {
			test('$.tizen.' + key, checkProperty.bind(null, key, $.tizen, jQM2.tizen, '$.tizen'));
		}
	}
	for (key in $.support) {
		if ($.support.hasOwnProperty(key)) {
			test('$.support.' + key, checkProperty.bind(null, key, $.support, jQM2.support, '$.support'));
		}
	}
}(tau._export));