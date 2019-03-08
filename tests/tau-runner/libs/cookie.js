(function () {

	/**
	 * Sets a value of coocie
	 * @param {string} cookieName name of cookie
	 * @param {string} cookieValue value to set
	 * @param {?number} [expireDate] number of milliseconds to expire
	 */
	function set(cookieName, cookieValue, expireDate) {
		var today = new Date();
		today.setDate(today.getDate() + parseInt(expireDate));
		document.cookie = cookieName + "=" + escape(cookieValue) + "; path=/; expires=" + today.toGMTString() + ";";
	}

	/**
	 * Returns a value of cookie
	 * @param {string} name name of coockie
	 * @returns {?string}
	 */
	function get(name) {
		var cookieName = name + "=",
			begin,
			end;
		var dc = document.cookie;
		if (dc.length > 0) {
			begin = dc.indexOf(cookieName);
			if (begin != -1) {
				begin += cookieName.length;
				end = dc.indexOf(";", begin);
				if (end == -1) {
					end = dc.length;
				}
				return unescape(dc.substring(begin, end));
			}
		}
		return null;
	}

	window.cookieHelper = {
		set: set,
		get: get
	}

}());