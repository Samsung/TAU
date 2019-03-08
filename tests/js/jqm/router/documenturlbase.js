//module("ej.jqm.mobile");
module("jqm/router", {});

test('getDocumentUrl', function () {
	var urlObject = {};

	urlObject = $.mobile.getDocumentUrl(false);
	equal(typeof urlObject, 'string', 'get document URL and no parse to url structure');
	urlObject = $.mobile.getDocumentUrl(true);
	equal(typeof urlObject, 'object', 'get document URL and parse to url structure');
});
test('getDocumentBase', function () {
	var urlObject = {};

	urlObject = $.mobile.getDocumentBase(false);
	equal(typeof urlObject, 'string', 'get document Base and no parse to url structure');
	urlObject = $.mobile.getDocumentBase(true);
	equal(typeof urlObject, 'object', 'get document Base and parse to url structure');
});