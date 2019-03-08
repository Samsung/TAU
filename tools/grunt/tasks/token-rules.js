module.exports = {
	code: {
		start: /^([ ]{4,}|[\t]{1,})[^\n]+$/gi,
		end: /^\s?[^\s]+/gi
	},
	info: {
		start: /^!!!(.*)!!!$/
	}
};
