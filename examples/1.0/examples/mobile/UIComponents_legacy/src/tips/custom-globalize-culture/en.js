/* global Globalize */

(function () {
	var cultureInfo = {
			messages: {
				"hello": "hello",
				"translate": "translate"
			}
		},
		supportLang = ["en", "en-US"],
		i,
		lang;

	for (i in supportLang) {
		if (supportLang.hasOwnProperty(i)) {
			lang = supportLang[i];
			Globalize.addCultureInfo(lang, cultureInfo);
		}
	}
})();
