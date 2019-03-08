/*global ok, equal, module, test, $, jQM2, Element, Window, Document, ej */
/*jslint forin: true*/
module("compare");

(function () {
	"use strict";
	var exclude = ['tau.$window', 'tau.$document', 'tau.$firstPage'],
		ejPageContainer = document.getElementById('ej-page-container'),
		pageContainer = document.getElementById('webui-page-container'),
		excludeWidgetsFields = {
			'button': {
				'button': true
			},
			'listview' : {
				'parentPage' : true
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
			'widget' : {
				'uuid': 'notval',
				'eventNamespace': 'notval',
				'bindings': true,
				'hoverable': true,
				'focusable': true,
				'document': true,
				'window': true
			}
		};

	function checkWidget(orginalObject, newObject, name) {
		test('Widget test - ' + name, function () {
			var key2,
				element = document.createElement('div'),
				element2 = document.createElement('div'),
				orginalWidget,
				newWidget,
				newWidgetKey2,
				orginalWidgetKey2;

			element.innerHTML = '<div></div>';
			element2.innerHTML = '<div></div>';
			element.classList.add('ui-indexscrollbar');
			element2.classList.add('ui-indexscrollbar');
			ejPageContainer.appendChild(element);
			pageContainer.appendChild(element2);
			orginalWidget = new orginalObject[name](element);
			newWidget = new newObject[name](element2);
			ok(newWidget, name + ' exists');
			equal(typeof newWidget, typeof orginalWidget, name + ' should be type ' + (typeof orginalWidget));
			if (typeof orginalWidget === 'object') {
				for (key2 in orginalWidget) {
					if ((key2.substr(0, 1) !== '_') &&
						(!excludeWidgetsFields['widget'][key2]) &&
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
		ok(newObject[key], name + '.' + key + ' exists');
		equal(typeof newObjectKey, typeof orginalObjectKey, name + '.' + key + ' should be type ' + (typeof orginalObjectKey));
		if (typeof orginalObjectKey !== 'object' && typeof orginalObjectKey !== 'function') {
			equal(newObjectKey, orginalObjectKey, name + '.' + key + ' should have value ' + orginalObjectKey);
		}
		if (typeof orginalObjectKey === 'function') {
			if (orginalObjectKey.prototype && orginalObjectKey.prototype._create) {
				checkWidget(orginalObject, newObject, key);
			}
		} else if ((typeof orginalObjectKey === 'object')
				&& !(orginalObjectKey instanceof Element)
				&& !(orginalObjectKey.jquery)
				&& !(orginalObjectKey === window)
				&& !(orginalObjectKey === document)) {
			for (key2 in orginalObjectKey) {
				if (orginalObjectKey[key2]) {
					if (exclude.indexOf(name + '.' + key + '.' + key2) === -1) {
						test(name + '.' + key + '.' + key2, checkProperty.bind(null, key2, orginalObjectKey, newObjectKey, name + '.' + key));
					}
				}
			}
		}
	}

    function onPageShow() {
        var key,
            newGear = window.tau,
            tau = oldTau;

        document.getElementById('ej-test').removeEventListener('pageshow', onPageShow, false);
        for (key in tau) {
            if (tau.hasOwnProperty(key)) {
                if (exclude.indexOf('tau.' + key) === -1) {
                    test('tau.' + key, checkProperty.bind(null, key, tau, newGear, 'tau'));
                }
            }
        }
    }

	document.getElementById('ej-test').addEventListener('pageshow', onPageShow, false);

	tau.engine.run();
}());
