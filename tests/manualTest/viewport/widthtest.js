var writeroot,
	testEl,
	testLayer,
	counter=0;

function init() {
	writeroot = document.getElementById('writeroot');
	testEl = document.getElementById('testEl');
	testLayer = document.getElementById('huge');
	document.getElementById('testButton').onclick = refreshTest;
//	document.getElementById('stretch').onclick = stretchDiv;
	refreshTest();
	refreshTest(); //repeat so that the writeroot is filled with data at the moment its height is measured.
}

function refreshTest() {
	log('Iteration ' + counter);
	counter +=1;
	log('screen.width/height = ' + screen.width + ' / ' + screen.height); // + ' = ' + screen.width/screen.height);
	log('documentElement.offset = ' + document.documentElement.offsetWidth + ' / ' + document.documentElement.offsetHeight);
	log('documentElement.client = ' + document.documentElement.clientWidth + ' / ' + document.documentElement.clientHeight);
//	log('documentElement.scroll = ' + document.documentElement.scrollLeft + ' / ' + document.documentElement.scrollTop);
//	log('writeroot.offset = ' + writeroot.offsetWidth + ' / ' + writeroot.offsetHeight);
	log('window.innerWidth/Height = ' + window.innerWidth + ' / ' + window.innerHeight);
	log('window.outerWidth/Height = ' + window.outerWidth + ' / ' + window.outerHeight);
	if (window.devicePixelRatio) {
		log('window.devicePixelRatio = ' + window.devicePixelRatio);
	}
	if (screen.deviceXDPI) {
		log('screen.deviceX/YDPI= ' + screen.deviceXDPI +' / ' + screen.deviceYDPI);
		log('screen.logicalX/YDPI= ' + screen.logicalXDPI +' / ' + screen.logicalYDPI);
	}
	log('window.page = ' + window.pageXOffset+ ' / ' + window.pageYOffset);
	set();
}


var logString;

function log(msg) {
	logString += msg + '<br>';	
}

function set () {
	writeroot.innerHTML = logString;
	logString = '';
}

if (!window.onload) {
	window.onload = init;
}