
window.onload = function () {
	var testEls = document.querySelectorAll('.test'),
		width,height,el;
	for (var i=0;i<testEls.length;i+=1) {
		el = testEls[i];
		width = el.offsetWidth;
		height = el.offsetHeight;
		el.innerHTML += '<br>width = ' + width + ' height = ' + height;
	}
}