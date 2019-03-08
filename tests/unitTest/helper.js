var helper = {
	timeout: 2 * 1000,

	path: location.pathname,

	pageSequence: function ( sequence, autoStart ) {
		if(!$("#main").hasClass("ui-page-active")) {
			sequence.unshift(function() {
				gear.ui.changePage( helper.path );
			});
		}
		this.eventSequence( "pagechange changefailed", sequence, autoStart );
	},

	popupSequence: function ( sequence, autoStart ) {
		helper.eventSequence( "popupshow popuphide changefailed", sequence, autoStart );
	},

	eventSequence: function ( eventName, sequence, autoStart ) {
		var seq = [],
			timeout,
			execute = function( event ) {
				window.clearTimeout(timeout);
				if ( !seq.length ) return;

				if ( seq.length > 1 ) {
					timeout = window.setTimeout(execute, helper.timeout);
					$(document).unbind( eventName, execute);
					$(document).one( eventName, execute);
				}
				(seq.shift())( event );
			};

		$.each(sequence, function( i, fn ) {
			if(autoStart && i === sequence.length-1) {
				seq.push(function() {
					fn();
					start();
				});
			} else {
				seq.push(fn);
			}
		});

		execute();
	},

	one: function( elem, eventName, handler ) {
		var timeoutId;

		timeoutId = window.setTimeout(handler, helper.timeout);
		$(elem).one(eventName, function(event) {
			window.clearTimeout(timeoutId);
			handler(event);
		});
	},

	assertUrlLocation: function( arg ) {
		var loc = window.location,
			path = loc.pathname,
			hash = loc.hash,
			orgUrl = path + hash,
			argUrl = (arg.path ? this.makePathAbsolute(arg.path, this.path) : path) + (arg.hash || ""),
			id = arg.id,
			msg = arg.msg,
			active = false,
			activePage = $(".ui-page-active");

		if( activePage.length === 1 &&
				activePage[0] === $("#"+id)[0] ) {
			active = true;
		}

		equal(orgUrl, argUrl, msg);
		ok(active, id + " page is active.");
	},

	makePathAbsolute: function( relPath, absPath ) {
		var absStack,
			relStack,
			i, d;

		if ( relPath && relPath.charAt( 0 ) === "/" ) {
			return relPath;
		}

		relPath = relPath || "";
		absPath = absPath ? absPath.replace( /^\/|(\/[^\/]*|[^\/]+)$/g, "" ) : "";

		absStack = absPath ? absPath.split( "/" ) : [];
		relStack = relPath.split( "/" );

		for ( i = 0; i < relStack.length; i++ ) {
			d = relStack[ i ];
			switch ( d ) {
				case ".":
					break;
				case "..":
					if ( absStack.length ) {
						absStack.pop();
					}
					break;
				default:
					absStack.push( d );
					break;
			}
		}
		return "/" + absStack.join( "/" );
	},

	virtualLinkClick: function( url ) {
		var $link = $( '<a href="'+ url +'">go</a>' ).appendTo("body");
		$link[0].click()
		$link.remove();
	}
};