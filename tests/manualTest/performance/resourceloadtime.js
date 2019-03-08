// Resource load time measured javascript file
// This time is measured for between DOMContentLoaded and load event fired
// And time measured repeatedly 30 times and alert popup that has average time

( function( document ) {
	// RLTime -> Resource Load Time
	var msg = "Do you want to measure RLTime?",
	option = {
		RNUMBER : 30 //repeat number
	},
	number = parseInt( localStorage.getItem( "number" ), 10 ),
	startTime,
	endTime;

	if ( !number ) {
		// localStorage number is null
		localStorage.setItem( "number", 0 );
		localStorage.setItem( "total", 0 );
		if ( confirm( msg ) != 0 ) {
			// yes
			_create();
			return;
		} else {
			//no
			return;
		}
	} else {
		// localStorage number exist
		_create();
		return;
	}

	function _create() {
		startTime = 0;
		endTime = 0;
		_bind();
	}

	function _bind() {
		document.addEventListener( "DOMContentLoaded", _domContentLoadedHandler );
		window.addEventListener( "load", _loadHandler );
	}

	function _unbind() {
		document.removeEventListener( "DOMContentLoaded", _domContentLoadedHandler );
		window.removeEventListener( "load", _loadHandler );
	}

	function _domContentLoadedHandler() {
		startTime = new Date().getTime();
	}

	function _loadHandler() {
		endTime = new Date().getTime();
		_repeat();
	}

	function _repeat() {
		var number = parseInt( localStorage.getItem( "number" ), 10),
		total;

		if ( number === option.RNUMBER ) {
			_showResult();
			_unbind();
			localStorage.clear();
			return;
		}
		total = parseInt( localStorage.getItem( "total" ), 10 ) + ( endTime - startTime );
		localStorage.setItem( "total", total );
		localStorage.setItem( "number", number + 1 );
		_unbind();
		location.reload( true ); // ignore the cache
	}

	function _showResult() {
		alert( "Resource Load Time = " + ( localStorage.getItem( "total" ) / option.RNUMBER ) );
	}
	
	function setRNumber( number ) {
		// Repeat number set
		option.RNUMBER = number;
	}
} ) ( document );
