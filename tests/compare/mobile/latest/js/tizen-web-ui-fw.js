/*
* Module Name : jquery.mobile.tizen.scrollview
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

(function ( $, window, document, undefined ) {

	/**
	 * Resizes page content height according to footer
	 * header elements, and page padding
	 * @param {HTMLElement|jQuery} page
	 */
	function resizePageContentHeight( page ) {
		var $page = $( page ),
			$content = $page.children(".ui-content"),
			hh = $page.children(".ui-header").outerHeight() || 0,
			fh = $page.children(".ui-footer").outerHeight() || 0,
			pt = parseFloat( $content.css("padding-top") ),
			pb = parseFloat( $content.css("padding-bottom") ),
			wh = $( window ).height();

		$content.height( wh - (hh + fh) - (pt + pb) );
	}

	/**
	 * MomentumTracker - helper class to ease momentum
	 * movement calculations
	 * @class
	 * @param {Object} options
	 */
	function MomentumTracker( options ) {
		this.options = $.extend( {}, options );
		this.easing = "easeOutQuad";
		this.reset();
	}

	/**
	 * Scroll states dictionary
	 * @type {Object}
	 */
	var tstates = {
		scrolling: 0,
		overshot:  1,
		snapback:  2,
		done:      3
	};

	var animationID = 0;
	var animationPrevID = 0;

	/**
	 * Returns current time in miliseconds
	 * @return {number}
	 */
	function getCurrentTime() {
		return Date.now();
	};

	function bitwiseAbs( e ) {
		return ( e ^ (e>>31)) - (e>>31);
	}

	jQuery.widget( "tizen.scrollview", jQuery.mobile.widget, {
		/**
		 * Default options
		 * @type {Object}
		 */
		options: {
			/**
			 * Direction of scroll, can be:
			 * "x" for horizontal scroll
			 * "y" for vertical scroll
			 * null for horizontal and vertical scroll
			 * @type {string|null}
			 */
			direction:         null,  // "x", "y", or null for both.

			/**
			 * Internal timer inteval
			 * @type {number}
			 */
			timerInterval:     10,

			/**
			 * Duration of the scrolling animation in miliseconds
			 * @type {number}
			 */
			scrollDuration:    1000,

			/**
			 * Duration of the overshoot animation in miliseconds
			 * @type {number}
			 */
			overshootDuration: 250,

			/**
			 * Duration of snapback animation in miliseconds
			 * @type {number}
			 */
			snapbackDuration:  500,

			/**
			 * Scroll detection threshold
			 * @type {number}
			 */
			moveThreshold:     10,

			/**
			 * Maximal time between mouse movements while scrolling
			 * @type {number}
			 */
			moveIntervalThreshold:     150,

			/**
			 * Scroll method type, can be "translate" or "position"
			 * @type {string}
			 */
			scrollMethod:      "translate",

			/**
			 * The event fired when started scrolling
			 * @type {string}
			 */
			startEventName:    "scrollstart",

			/**
			 * The event fired on each scroll update (movement)
			 * @type {string}
			 */
			updateEventName:   "scrollupdate",

			/**
			 * The event fired after scroll stopped
			 * @type {string}
			 */
			stopEventName:     "scrollstop",

			/**
			 * Determines the event group for detecting scroll
			 * if $.support.touch has truthy value the group
			 * that starts scroll will be touch events, otherwise
			 * mouse events will be used
			 * @type {string}
			 */
			eventType:         $.support.touch ? "touch" : "mouse",

			/**
			 * Determines if we should show the scrollbars
			 * @type {boolean}
			 */
			showScrollBars:    true,

			/**
			 * Determines if overshoot animation is enabled
			 * @type {boolean}
			 */
			overshootEnable:   false,

			/**
			 * Determines if we enable the window scroll
			 * @type {boolean}
			 */
			outerScrollEnable: false,

			/**
			 * Determines if the overflow animation is enabled
			 * @type {boolean}
			 */
			overflowEnable:    true,

			/**
			 * Determines if we allow scroll jumps
			 * @type {boolean}
			 */
			scrollJump:        false,

			/**
			 * Determines if we scroll when element to receive focus is hidden.
			 */
			scrollToFocusEnable:     true,

			/**
			 * Scroll Distance when arrow key pressed
			 */
			scrollDistance: 30
		},

		/**
		 * Returns view height
		 * @private
		 * @return {number}
		 */
		_getViewHeight: function () {
			return this._$view.height();
		},

		/**
		 * Returns view width
		 * @private
		 * @return {number}
		 */
		_getViewWidth: function () {
			return this._$view.width();
		},

		/**
		 * Changes specified elements position to relative if
		 * previous position state was static
		 * @private
		 * @param {jQuery} $ele
		 */
		_makePositioned: function ( $ele ) {
			if ( $ele.css("position") === "static" ) {
				$ele.css( "position", "relative" );
			}
		},

		/**
		 * Creates scrollview widget,
		 * binds events and initiaties timers
		 * @private
		 */
		_create: function () {
			var direction,
				self = this;

			this._$clip = $( this.element ).addClass("ui-scrollview-clip");

			if ( this._$clip.children(".ui-scrollview-view").length ) {
				this._$view = this._$clip.children(".ui-scrollview-view");
			} else {
				this._$view = this._$clip.wrapInner("<div></div>").children()
							.addClass("ui-scrollview-view");
			}

			if ( this.options.scrollMethod === "translate" ) {
				if ( this._$view.css("transform") === undefined ) {
					this.options.scrollMethod = "position";
				}
			}

			this._$clip.css( "overflow", "hidden" );
			this._makePositioned( this._$clip );

			this._makePositioned( this._$view );
			this._$view.css( { left: 0, top: 0 } );

			this._view_height = this._getViewHeight();

			this._sx = 0;
			this._sy = 0;

			direction = this.options.direction;

			this._hTracker = ( direction !== "y" ) ?
					new MomentumTracker( this.options ) : null;
			this._vTracker = ( direction !== "x" ) ?
					new MomentumTracker( this.options ) : null;

			this._timerInterval = this.options.timerInterval;
			this._timerID = 0;

			this._timerCB = function () {
				self._handleMomentumScroll();
			};

			this._add_event();
			this._add_scrollbar();
			this._add_scroll_jump();
			this._add_overflow_indicator();
			this._moveInterval = 10; /* Add Interval */
			this._clipHeight = 0;
		},

		/**
		 * Starts momentum scroll after user stopped
		 * scrolling
		 * @private
		 * @param {number} speedX Horizontal speed
		 * @param {number} speedY Vertical speed
		 */
		_startMScroll: function ( speedX, speedY ) {
			var keepGoing = false,
				duration = this.options.scrollDuration,
				ht = this._hTracker,
				vt = this._vTracker,
				c,
				v;

			this._$clip.trigger( this.options.startEventName );

			if ( ht ) {
				c = this._$clip.width();
				v = this._getViewWidth();

				if ( (( this._sx === 0 && speedX > 0 ) ||
					( this._sx === -(v - c) && speedX < 0 )) &&
						v > c ) {
					return;
				}

				ht.start( this._sx, speedX,
					duration, (v > c) ? -(v - c) : 0, 0 );
				keepGoing = !ht.done();
			}

			if ( vt ) {
				c = this._$clip.height();
				v = this._getViewHeight();

				if ( (( this._sy === 0 && speedY > 0 ) ||
					( this._sy === -(v - c) && speedY < 0 )) &&
						v > c ) {
					return;
				}

				vt.start( this._sy, speedY,
					duration, (v > c) ? -(v - c) : 0, 0 );
				keepGoing = keepGoing || !vt.done();
			}

			if ( keepGoing ) {
				this._timerID = setTimeout( this._timerCB, this._timerInterval );
			} else {
				this._stopMScroll();
			}
		},

		/**
		 * Ends momentum scroll
		 * @private
		 */
		_stopMScroll: function () {
			if ( this._timerID ) {
				this._$clip.trigger( this.options.stopEventName );
				clearTimeout( this._timerID );
			}
			this._timerID = 0;

			if ( this._vTracker ) {
				this._vTracker.reset();
			}

			if ( this._hTracker ) {
				this._hTracker.reset();
			}

			this._hideScrollBars();
			//this._hideOverflowIndicator();
		},

		/**
		 * Updates scroll while in momentum scroll mode
		 * @private
		 */
		_handleMomentumScroll: function () {
			var keepGoing = false,
				x = 0,
				y = 0,
				scroll_height = this._getViewHeight() - this._$clip.height(),
				scroll_width = this._getViewWidth() - this._$clip.width(),
				self = this,
				vt = this._vTracker,
				ht = this._hTracker;

			if ( this._outerScrolling ) {
				return;
			}

			if ( vt ) {
				vt.update( this.options.overshootEnable );
				y = vt.getPosition();
				keepGoing = !vt.done();

				if ( vt.getRemained() > this.options.overshootDuration && this.options.outerScrollEnable ) {
					if ( !vt.isAvail() ) {
						if ( this._speedY > 0 ) {
							this._outerScroll( vt.getRemained() / 3, scroll_height );
						} else {
							this._outerScroll( y - vt.getRemained() / 3, scroll_height );
						}
					} else if ( vt.isMin() ) {
						this._outerScroll( y - vt.getRemained() / 3, scroll_height );

					} else if ( vt.isMax() ) {
						this._outerScroll( vt.getRemained() / 3, scroll_height );
					}
				}
			}

			if ( ht ) {
				ht.update( this.options.overshootEnable );
				x = ht.getPosition();
				keepGoing = keepGoing || !ht.done();
			}

			this._setScrollPosition( x, y );
			this._$clip.trigger( this.options.updateEventName,
					[ { x: x, y: y } ] );

			if ( keepGoing ) {
				this._timerID = setTimeout( this._timerCB, this._timerInterval );
			} else {
				this._stopMScroll();
			}
		},

		/**
		 * Sets css translate transformation for element
		 * @param {jQuery} $ele
		 * @param {number} x
		 * @param {number} y
		 * @param {number} duration
		 */
		_setElementTransform: function ( $ele, x, y, duration ) {
			var translate,
				transition;

			if ( !duration || duration === undefined ) {
				transition = "none";
			} else {
				transition =  "-webkit-transform " + duration / 1000 + "s ease-out";
			}

			if ( $.support.cssTransform3d ) {
				translate = "translate3d(" + x + "," + y + ", 0px)";
			} else {
				translate = "translate(" + x + "," + y + ")";
			}

			$ele.css({
				"-moz-transform": translate,
				"-webkit-transform": translate,
				"-ms-transform": translate,
				"-o-transform": translate,
				"transform": translate,
				"-webkit-transition": transition
			});
		},

		/**
		 * Applies scroll end effect according to direction
		 * @param {string} dir Direction, can be "in" or "out"
		 */
		_setEndEffect: function ( dir , calcY) {
			var scroll_height = this._getViewHeight() - this._$clip.height();

			if ( this._softkeyboard && this.options.outerScrollEnable ) {
				if ( this._effect_dir ) {
					this._outerScroll( -scroll_height - this._softkeyboardHeight, scroll_height );
				} else {
					this._outerScroll( this._softkeyboardHeight, scroll_height );
				}
			}

			if ( dir === "in" ) {
				this._setOverflowIndicator( this._effect_dir );
				this._showOverflowEffect( calcY, this._effect_dir );
				this._endEffect = true;
			} else if ( dir === "out" ) {
				if ( !this._endEffect ) {
					return;
				}

				this._endEffect = false;
			} else {
				this._endEffect = false;
				this._hideOverflowIndicator( this._effect_dir );
			}
		},

		/**
		 * Calibrates scroll position and scroll end effect
		 * @private
		 * @param {number} x
		 * @param {number} y
		 */
		_setCalibration: function ( x, y ) {
			if ( this.options.overshootEnable ) {
				this._sx = x;
				this._sy = y;
				return;
			}

			var $v = this._$view,
				$c = this._$clip,
				dirLock = this._directionLock,
				scroll_height = 0,
				scroll_width = 0,
				vh,
				ch,
				calc,
				overflowMax = 140;

			if ( dirLock !== "y" && this._hTracker ) {
				scroll_width = $v.width() - $c.width();

				if ( x >= 0 ) {
					this._sx = 0;
				} else if ( x < -scroll_width ) {
					this._sx = -scroll_width;
				} else {
					this._sx = x;
				}

				if ( scroll_width < 0 ) {
					this._sx = 0;
				}
			}

			if ( dirLock !== "x" && this._vTracker ) {
				vh = this._getViewHeight();
				ch = $c.height();
				/*
				When used changePage() function, this._getViewHeight() value set 0.
				So scroll_height has incorrect value and showed indicator incorrectly.
				Below condition is exception handling that avoid this situation.
				*/
				if ( vh != 0 && ch > 0 ) {
					scroll_height = vh - ch;
				}

				if ( y > 0 ) {
					if(this._flag == true ){
						this._flag = false;
						this._ly = this._lastY;
					} else if(this._flag == undefined ){
						this._flag = true;
					}
					if((this._lastY - this._ly) > overflowMax){
						calc = overflowMax;
					} else {
						calc = this._lastY - this._ly;
					}
					this._sy = 0;
					this._effect_dir = 0;
					this._setEndEffect( "in" ,calc);
				} else if ( y < -scroll_height ) {
					if( this._flag == true ){
						this._flag = false;
						this._ly = this._lastY;
					}

					if( ( this._ly - this._lastY ) > overflowMax ){
						calc = overflowMax;
					} else {
						calc = this._ly - this._lastY;
					}
					if ( this._sy !== -scroll_height ) {
						this._hideScrollBars();
						this._hideOverflowIndicator( this._effect_dir );
						this._sy = -scroll_height;
						this._effect_dir = 1;
					} else {
						this._sy = -scroll_height;
						this._effect_dir = 1;
						this._setEndEffect( "in" ,calc);
					}
				} else {
					if ( this._endEffect && this._sy !== y ) {
						/*
						This condition means that user scrolled to end
						and scrolled to inside area continuously
						*/
						this._setEndEffect();
					}

					this._sy = y;
				}

				if ( scroll_height < 0 ) {
					this._sy = 0;
				}
			}
		},

		/**
		 * Moves scroll to specified position
		 * @private
		 * @param {number} x
		 * @param {number} y
		 * @param {number} duration
		 */
		_setScrollPosition: function ( x, y, duration ) {
			var $v = this._$view,
				sm = this.options.scrollMethod,
				$vsb = this._$vScrollBar,
				$hsb = this._$hScrollBar,
				$sbt;

			this._setCalibration( x, y );

			x = this._sx;
			y = this._sy;

			if ( sm === "translate" ) {
				this._setElementTransform( $v, x + "px", y + "px", duration );
			} else {
				$v.css( {left: x + "px", top: y + "px"} );
			}

			if ( $vsb ) {
				$sbt = $vsb.find(".ui-scrollbar-thumb");

				if ( sm === "translate" ) {
					if ( bitwiseAbs( this._moveInterval - bitwiseAbs(y)) > 20 ) {
						/* update scrollbar every 20(clientY) move*/
						/* Add Interval */
						this._setElementTransform( $sbt, "0px",
							-y / this._getViewHeight() * this._clipHeight + "px",
							duration );
					}
				} else {
					$sbt.css( "top", -y / this._getViewHeight() * 100 + "%" );
				}
			}

			if ( $hsb ) {
				$sbt = $hsb.find(".ui-scrollbar-thumb");

				if ( sm === "translate" ) {
					this._setElementTransform( $sbt,
						-x / $v.outerWidth() * $sbt.parent().width() + "px", "0px",
						duration);
				} else {
					$sbt.css("left", -x / $v.width() * 100 + "%");
				}
			}
		},

		/**
		 * Handles window scrolling
		 * @private
		 * @param {number} y
		 * @param {number} scroll_height
		 */
		_outerScroll: function ( y, scroll_height ) {
			var self = this,
				top = $( window ).scrollTop() - window.screenTop,
				sy = 0,
				duration = this.options.snapbackDuration,
				start = getCurrentTime(),
				tfunc;

			if ( !this.options.outerScrollEnable ) {
				return;
			}

			if ( this._$clip.jqmData("scroll") !== "y" ) {
				return;
			}

			if ( this._outerScrolling ) {
				return;
			}

			if ( y > 0 ) {
				sy = ( window.screenTop ? window.screenTop : -y );
			} else if ( y < -scroll_height ) {
				sy = -y - scroll_height;
			} else {
				return;
			}

			tfunc = function () {
				var elapsed = getCurrentTime() - start;

				if ( elapsed >= duration ) {
					window.scrollTo( 0, top + sy );
					self._outerScrolling = undefined;

					self._stopMScroll();
				} else {
					ec = $.easing.easeOutQuad( elapsed / duration,
							elapsed, 0, 1, duration );

					window.scrollTo( 0, top + ( sy * ec ) );
					self._outerScrolling = setTimeout( tfunc, self._timerInterval );
				}
			};
			this._outerScrolling = setTimeout( tfunc, self._timerInterval );
		},

		/**
		 * Scrolls to specified position with easeOutQuad calculations
		 * @private
		 * @param {number} x
		 * @param {number} y
		 * @param {number} duration
		 */
		_scrollTo: function ( x, y, duration ) {
			var self = this,
				start = getCurrentTime(),
				efunc = $.easing.easeOutQuad,
				sx = this._sx,
				sy = this._sy,
				dx = x - sx,
				dy = y - sy,
				tfunc;

			x = -x;
			y = -y;

			tfunc = function () {
				var elapsed = getCurrentTime() - start,
				    ec;

				if ( elapsed >= duration ) {
					self._timerID = 0;
					self._setScrollPosition( x, y );
				} else {
					ec = efunc( elapsed / duration, elapsed, 0, 1, duration );

					self._setScrollPosition( sx + ( dx * ec ), sy + ( dy * ec ) );
					self._timerID = setTimeout( tfunc, self._timerInterval );
				}
			};

			this._timerID = setTimeout( tfunc, this._timerInterval );
		},

		/**
		 * Scrolls to specified position
		 * If scroll method is css translation or duration is a
		 * falsy value, the position is changed via translation,
		 * otherwise it's animated to that position
		 * @param {number} x
		 * @param {number} y
		 * @param {number} duration
		 */
		scrollTo: function ( x, y, duration ) {
			this._stopMScroll();
			this._didDrag = false;

			if ( !duration || this.options.scrollMethod === "translate" ) {
				this._setScrollPosition( x, y, duration );
			} else {
				this._scrollTo( x, y, duration );
			}
			this._hideOverflowIndicator();
		},

		/**
		 * Centers scroll to view the specified child element
		 * @param {Element|jQuery} target
		 */
		centerToElement: function ( element ) {
			var $clip = this._$clip,
				$view = this._$view,
				$element = 0,
				delta = 0,
				elementPosition = null,
				elementPositionTop = 0;

			if ( element.is( "textarea" ) ) {
				return;
			}

			if ( element ) {
				$element = element.get ? element : $( element );
				delta = ( $clip.height() / 2 ) - ( $element.height() / 2 );
				elementPosition = $element.position();
				elementPositionTop = elementPosition ? elementPosition.top : 0;

				$element.parentsUntil( $view ).each( function () {
					var $parent = $( this );
					elementPositionTop += ( $parent.position().top + parseFloat( $parent.css( "marginTop" ) ) + parseFloat( $parent.css( "paddingTop" ) ) );
				});

				this.scrollTo( this._sx, -( elementPositionTop - delta ) );
			}
		},

		/**
		 * Checks if the specified child element is visible
		 * and centers the scroll on it if it's not visible
		 * @param {Element|jQuery}
		 */
		ensureElementIsVisible: function ( element ) {
			var $element = null,
				$clip = this._$clip,
				clipTop = 0,
				clipBottom = 0,
				clipHeight = 0,
				elementHeight = 0,
				elementTop = 0,
				elementBottom = 0,
				elementFits = 0,
				$anchor = null,
				anchorPosition = 0;

			if ( element ) {
				/*
				 * Below valuable name has rules
				 * 1) ~Top is calculated offset().top value
				 * 2) ~Height is calculated height() function return value
				 * 3) ~Bottom is calculated only based clip's top
				 */
				$element = element.get ? element : $( element );
				elementHeight = $element.outerHeight(true);
				elementTop = $element.offset().top;
				elementBottom = elementTop + elementHeight;
				clipHeight = $clip.height();
				clipTop = $clip.offset().top;
				clipBottom = clipTop + clipHeight;
				elementFits = clipHeight > elementHeight;

				switch( true ) {
				case elementFits && clipTop < elementTop && clipBottom > elementBottom: // element fits in view is inside clip area
					// pass, element position is ok
					break;
				case elementFits && clipTop < elementTop && clipBottom < elementBottom: // element fits in view but its visible only at top
				case elementFits && clipTop > elementTop && clipBottom > elementBottom: // element fits in view but its visible only at bottom
				case elementFits: // element fits in view but is not visible
					this.centerToElement($element);
					break;
				case clipTop < elementTop && clipBottom < elementBottom: // element visible only at top
				case clipTop > elementTop && clipBottom > elementBottom: // element visible only at bottom
					// pass, we cant do anything, if we move the scroll
					// the user could lost view of something he scrolled to
					break;
				}
			}
		},

		_setTextareaPosition: function ( element ) {
			// textarea set position why ensure textarea visible
			var $input = element,
				input = $input.get( 0 ),
				$c = this._$clip,
				clipHeight = $c.height(),
				dit = $input.offset().top - $c.offset().top,	// input's top position from clip
				lh,	// input's line height for calculating caret's Y position
				lhCSS = $input.css( "line-height" ),	// CSS value of line-height
				cp,	// caret's position in px
				dct;	// caret's top from clip

			if ( lhCSS === "normal" ) {
				lh = $input.css( "font-size" ).replace( "px" , "" ) * 1.23;
			} else {
				//css( "line-height" ) returns "normal" or actual value in px unit
				lh = parseInt( lhCSS );
			}

			// current relative vertical caret position
			// = estimated line number * line-height
			cp = input.value.substr( 0, input.selectionStart ).split( "\n" ).length * lh;

			dct = dit + cp;
			if ( cp > $input.height() ){
				// Overflow scroll in the input area. No need to move.
				return;
			} else if ( dct + lh < clipHeight && dct - lh >= 0 ) {
				// caret position is shown on the clip. No need to move.
				return;
			} else {
				// caret position doesn't be shown. Need to move.
				this.scrollTo( 0 , - ( dit - this._sy + cp - lh ), 0 );
				return;
			}

			return;
		},
		/**
		 * Returns current scroll position {x,y}
		 * @return {Object}
		 */
		getScrollPosition: function () {
			return { x: -this._sx, y: -this._sy };
		},

		/**
		 * Skipps dragging
		 * @param {Boolean}
		 */
		skipDragging: function ( value ) {
			this._skip_dragging = value;
		},

		/**
		 * Returns scroll hierarchy in an array of elements
		 * @private
		 * @return {Array}
		 */
		_getScrollHierarchy: function () {
			var svh = [],
				d;

			this._$clip.parents( ".ui-scrollview-clip").each( function () {
				d = $( this ).jqmData("scrollview");
				if ( d ) {
					svh.unshift( d );
				}
			} );
			return svh;
		},

		/**
		 * Returns ancestor for specified direction
		 * @private
		 * @param {string} dir
		 */
		_getAncestorByDirection: function ( dir ) {
			var svh = this._getScrollHierarchy(),
				n = svh.length,
				sv,
				svdir;

			while ( 0 < n-- ) {
				sv = svh[n];
				svdir = sv.options.direction;

				if (!svdir || svdir === dir) {
					return sv;
				}
			}
			return null;
		},

		/**
		 * Handles dragstart event
		 * @private
		 * @param {Event} e
		 * @param {number} ex Event x position
		 * @param {number} ey Event y position
		 */
		_handleDragStart: function ( e, ex, ey ) {
			this._stopMScroll();
			clearTimeout(this._hideScrollBarsTimeout);

			this._didDrag = false;
			this._skip_dragging = false;
			this._clipHeight = this._$clip.height();
			var target = $( e.target ),
				self = this,
				$c = this._$clip,
				svdir = this.options.direction;

			/* should prevent the default behavior when click the button */
			this._is_button = target.is( '.ui-btn' ) ||
					target.is( '.ui-btn-text' ) ||
					target.is( '.ui-btn-inner' ) ||
					target.is( '.ui-btn-inner .ui-icon' );

			/* should prevent the default behavior when click the slider */
			if ( target.parents('.ui-slider').length || target.is('.ui-slider') ) {
				this._skip_dragging = true;
				return;
			}

			if ( target.is('textarea') ) {
				target.bind( "scroll", function () {
					self._skip_dragging = true;
					target.unbind("scroll");
				});
			}

			/*
			 * We need to prevent the default behavior to
			 * suppress accidental selection of text, etc.
			 */
			this._is_inputbox = target.is(':input') ||
					target.parents(':input').length > 0;

			if ( this.options.eventType === "mouse" && !this._is_inputbox && !this._is_button ) {
				e.preventDefault();
			}

			this._lastX = ex;
			this._lastY = ey;
			this._startY = ey;
			this._doSnapBackX = false;
			this._doSnapBackY = false;
			this._speedX = 0;
			this._speedY = 0;
			this._directionLock = "";

			this._lastMove = 0;
			this._enableTracking();

			this._set_scrollbar_size();
		},

		/**
		 * Propagates dragging
		 * @private
		 * @param {jQuery} sv
		 * @param {Event} e
		 * @param {number} ex
		 * @param {number} ey
		 * @param {string} dir
		 */
		_propagateDragMove: function ( sv, e, ex, ey, dir ) {
			this._hideScrollBars();
			this._hideOverflowIndicator();
			this._disableTracking();
			sv._handleDragStart( e, ex, ey );
			sv._directionLock = dir;
			sv._didDrag = this._didDrag;
		},

		/**
		 * Handles drag event
		 * @private
		 * @param {Event}
		 * @param {number} ex
		 * @param {number} ey
		 * @return {boolean|undefined}
		 */
		_handleDragMove: function ( e, ex, ey ) {
			this._moveInterval = ey;
			if ( this._skip_dragging ) {
				return;
			}

			if ( !this._dragging ) {
				return;
			}

			if ( !this._is_inputbox && !this._is_button ) {
				e.preventDefault();
			}

			var mt = this.options.moveThreshold,
				dx = ex - this._lastX,
				dy = ey - this._lastY,
				svdir = this.options.direction,
				dir = null,
				x,
				y,
				sv,
				scope,
				newX,
				newY,
				dirLock;

			this._lastMove = getCurrentTime();

			if ( !this._directionLock ) {
				x = bitwiseAbs( dx );
				y = bitwiseAbs( dy );

				if ( x < mt && y < mt ) {
					return false;
				}

				if ( x < y && (x / y) < 0.5 ) {
					dir = "y";
				} else if ( x > y && (y / x) < 0.5 ) {
					dir = "x";
				}

				if ( svdir && dir && svdir !== dir ) {
					/*
					 * This scrollview can't handle the direction the user
					 * is attempting to scroll. Find an ancestor scrollview
					 * that can handle the request.
					 */

					sv = this._getAncestorByDirection( dir );
					if ( sv ) {
						this._propagateDragMove( sv, e, ex, ey, dir );
						return false;
					}
				}

				this._directionLock = svdir || (dir || "none");
			}

			newX = this._sx;
			newY = this._sy;
			dirLock = this._directionLock;

			if ( dirLock !== "y" && this._hTracker ) {
				x = this._sx;
				this._speedX = dx;
				newX = x + dx;

				this._doSnapBackX = false;

				scope = ( newX > 0 || newX < this._maxX );

				if ( scope && dirLock === "x" ) {
					sv = this._getAncestorByDirection("x");
					if ( sv ) {
						this._setScrollPosition( newX > 0 ?
								0 : this._maxX, newY );
						this._propagateDragMove( sv, e, ex, ey, dir );
						return false;
					}

					newX = x + ( dx / 2 );
					this._doSnapBackX = true;
				}
			}

			if ( dirLock !== "x" && this._vTracker ) {
				if ( Math.abs( this._startY - ey ) < mt && dirLock !== "xy" && this._didDrag === false ) {
					return;
				}

				y = this._sy;
				this._speedY = dy;
				newY = y + dy;

				this._doSnapBackY = false;

				scope = ( newY > 0 || newY < this._maxY );

				if ( scope && dirLock === "y" ) {
					sv = this._getAncestorByDirection("y");
					if ( sv ) {
						this._setScrollPosition( newX,
								newY > 0 ? 0 : this._maxY );
						this._propagateDragMove( sv, e, ex, ey, dir );
						return false;
					}

					newY = y + ( dy / 2 );
					this._doSnapBackY = true;
				}
			}

			if ( this.options.overshootEnable === false ) {
				this._doSnapBackX = false;
				this._doSnapBackY = false;
			}

			this._lastX = ex;
			this._lastY = ey;

			this._setScrollPosition( newX, newY );

			if ( this._didDrag === false ) {
				this._didDrag = true;
				this._showScrollBars();

				this._$clip.parents(".ui-scrollview-clip").each( function () {
					$( this ).scrollview( "skipDragging", true );
				} );
			}
		},

		/**
		 * Handles drag stop event, and returns drag status
		 * @param {Event} e
		 * @return {Boolean|undefined}
		 */
		_handleDragStop: function ( e ) {
			var self = this;

			this._flag=true;

			if ( this._skip_dragging ) {
				return;
			}

			var l = this._lastMove,
				t = getCurrentTime(),
				doScroll = (l && (t - l) <= this.options.moveIntervalThreshold),
				sx = ( this._hTracker && this._speedX && doScroll ) ?
						this._speedX : ( this._doSnapBackX ? 1 : 0 ),
				sy = ( this._vTracker && this._speedY && doScroll ) ?
						this._speedY : ( this._doSnapBackY ? 1 : 0 ),
				svdir = this.options.direction,
				x,
				y;

			if ( sx || sy ) {
				if ( !this._setGestureScroll( sx, sy ) ) {
					this._startMScroll( sx, sy );
				}
			} else {
				this._hideScrollBars();
				this._hideOverflowIndicator( this._effect_dir );
			}

			this._disableTracking();

			if ( this._endEffect ) {
				self._setEndEffect( "out" );
				self._hideScrollBars();
				self._hideOverflowIndicator( self._effect_dir );
			}

			return !this._didDrag;
		},

		/**
		 * Detects gestures and sets proper gesture direction
		 * @private
		 * @param {number} sx
		 * @param {number} sy
		 * @return {boolean}
		 */
		_setGestureScroll: function ( sx, sy ) {
			var self = this,
				reset = function () {
					clearTimeout( self._gesture_timer );
					self._gesture_dir = 0;
					self._gesture_timer = undefined;
				},
				direction = {
					top: 0,
					bottom: 1,
					left: 2,
					right: 3
				};

			if ( !sy && !sx ) {
				return false;
			}

			if ( Math.abs( sx ) > Math.abs( sy ) ) {
				dir = sx > 0 ? direction.left : direction.right;
			} else {
				dir = sy > 0 ? direction.top : direction.bottom;
			}

			if ( !this._gesture_timer ) {
				this._gesture_dir = dir;

				this._gesture_timer = setTimeout( function () {
					reset();
				}, 1000 );

				return false;
			}

			if ( this._gesture_dir !== dir ) {
				reset();
				return false;
			}

			return false;
		},

		/**
		 * Enables dragging
		 * @private
		 */
		_enableTracking: function () {
			this._dragging = true;
		},

		/**
		 * Disables dragging
		 * @private
		 */
		_disableTracking: function () {
			this._dragging = false;
		},

		/**
		 * Shows scrollbars
		 * When interval is specified, the scrollbars will be
		 * hidden after the specified time in miliseconds
		 * @private
		 * @param {number} [interval]
		 */
		_showScrollBars: function ( interval ) {
			var vclass = "ui-scrollbar-visible",
				self = this;

			if ( !this.options.showScrollBars ) {
				return;
			}
			if ( this._scrollbar_showed ) {
				return;
			}

			if ( this._$vScrollBar ) {
				this._$vScrollBar.addClass( vclass );
			}
			if ( this._$hScrollBar ) {
				this._$hScrollBar.addClass( vclass );
			}

			this._scrollbar_showed = true;

			if ( interval ) {
				setTimeout( function () {
					self._hideScrollBars();
				}, interval );
			}
		},

		/**
		 * Hides scrollbars
		 * @private
		 */
		_hideScrollBars: function () {
			var vclass = "ui-scrollbar-visible";

			if ( !this.options.showScrollBars ) {
				return;
			}
			if ( !this._scrollbar_showed ) {
				return;
			}

			if ( this._$vScrollBar ) {
				this._$vScrollBar.removeClass( vclass );
			}
			if ( this._$hScrollBar ) {
				this._$hScrollBar.removeClass( vclass );
			}

			this._scrollbar_showed = false;
		},

		/**
		 * Sets opacities for the oveflow indicator
		 * according to specified direction. The direction
		 * is optional. Specify 1 for top, 0 for bottom, and
		 * a falsy value for both
		 * @private
		 * @param {number} [dir] 0
		 */
		_setOverflowIndicator: function ( dir ) {
			if ( dir === 1 ) {
				this._display_indicator_top = "none";
				this._display_indicator_bottom = "block";
			} else if ( dir === 0 ) {
				this._display_indicator_top = "block";
				this._display_indicator_bottom = "none";
			} else {
				this._display_indicator_top = "block";
				this._display_indicator_bottom = "block";
			}
		},

		/**
		 * Display overflow indicator
		 * @private
		 */
		_showOverflowIndicator: function () {
			/* 1126_UX change */
			return true;

			if ( !$( this.element ).is( ".ui-content" ) && !$( this.element ).is( ".ui-custom-scrollbar" ) ) {
				return true;
			}

			if ( (!this.options.overflowEnable && !$( this.element ).is( ".ui-custom-scrollbar" )) || !this._overflowAvail || this._softkeyboard ) {
				return;
			}

			this._overflow_top.css( "display", this._display_indicator_top );
			this._overflow_bottom.css( "display", this._display_indicator_bottom );

			this._overflow_showed = true;
		},

		_showOverflowEffect : function ( calcY, effectDirection ) {
			var calCount = 0,
				prevCount = 0,
				startImageMAX = 8,
				aniDirection = "top";
			if ( !$( this.element ).is( ".ui-content" ) && !$( this.element ).is( ".ui-custom-scrollbar" ) ) {
				return true;
			}

			if ( (!this.options.overflowEnable && !$( this.element ).is( ".ui-custom-scrollbar" )) || !this._overflowAvail || this._softkeyboard ) {
				return;
			}

			if ( !this._overflowAvail || this._softkeyboard ) {
				return;
			}

			if ( effectDirection ) {
				aniDirection = "bottom";
			}
			calCount = parseInt( calcY / 9 , 10 ) + 1;
			if ( calCount > startImageMAX ) {
				calCount = startImageMAX;
			}

			if ( calCount <= 0 ) {
				calCount = 0;
				prevCount = 0;
			} else {
				prevCount = calCount - 1;
			}

			if ( aniDirection === "top" ) {
				$( ".ui-overflow-indicator-bar-" + prevCount ).css( "display", "none" );
				$( ".ui-overflow-indicator-bar-" + calCount ).css( "display", "block" );
			} else {
				$( ".ui-overflow-indicator-b-bar-" + prevCount ).css( "display", "none" );
				$( ".ui-overflow-indicator-b-bar-" + calCount ).css( "display", "block" );
			}
			this._overflow_showed = true;
		},

		_stopOverflowAnimation: function ( id ) {
			var self = this,
				AniImageMAX = 17;

			clearInterval( id );

			for (var i=1; i<= AniImageMAX; i++) {
				$( ".ui-overflow-indicator-bar-" + i ).css( "display", "none" );
			        $( ".ui-overflow-indicator-b-bar-" + i ).css( "display", "none" );
			}
		},

		/**
		 * Hide overflow indicator
		 * @private
		 */
		_hideOverflowIndicator: function ( effectDirection ) {
			var self = this,
				AniImageMAX = 17
				EndAniImageMAX = 8;


			if ( (!this.options.overflowEnable && !$( this.element ).is( ".ui-custom-scrollbar" ))  || !this._overflowAvail || this._softkeyboard ) {
				return;
			}

			if ( this._overflow_showed === false ) {
				return;
			}

			/*
			When hide overflowIndicator, animation add that height decrease smoothly.
			*/
			animationID = setInterval( function () {
				if ( !effectDirection ) {
					$( ".ui-overflow-indicator-bar-" + (EndAniImageMAX-1) ).css( "display", "none" );
					$( ".ui-overflow-indicator-bar-" + EndAniImageMAX ).css( "display", "block" );
				} else {
					$( ".ui-overflow-indicator-b-bar-" + (EndAniImageMAX-1) ).css( "display", "none" );
					$( ".ui-overflow-indicator-b-bar-" + EndAniImageMAX ).css( "display", "block" );
				}

				if ( animationID !== 0 && animationID !== animationPrevID ) {
					self._stopOverflowAnimation( animationPrevID );
				}

				if ( EndAniImageMAX === AniImageMAX ) {
					setTimeout( function() {
						self._stopOverflowAnimation( animationID );
					}, 200 );
				}

				if ( EndAniImageMAX < AniImageMAX ) {
					EndAniImageMAX++;
				}
				animationPrevID = animationID;
			}, 35 );

			this._overflow_showed = false;
			this._setOverflowIndicator();
		},

		_isVisible: function ( ) {
			return $( this.element ).parents( ".ui-page" ).hasClass( "ui-page-active" );
		},

		refresh: function () {
			var $c = this._$clip,
				$v = this._$view,
				focused,
				view_w = $v.outerWidth(),
				cw = $c.outerWidth(),
				view_h = this._getViewHeight(),
				clip_h = $c.height(),
				scroll_x,
				scroll_y;

			if ( !this._isVisible() ) {
				return;
			}
			/*
			 * If (clip_h >= view_h) need not to scroll bar
			 * else need to show scroll bar that how set it.
			 */
			if ( clip_h >= view_h ) {
				// If Page don't need to scrollbar, scroll position that set before page need to initialization.
				this.scrollTo(0,0,0);
				this._hideScrollBars();
			} else {
				this._set_scrollbar_size();
				this._setScrollPosition( this._sx, this._sy );
			}

			if ( $(".ui-page-active").get(0) !== $c.closest(".ui-page").get(0) ) {
				return;
			}

			if ( !$c.height() || !view_h ) {
				return;
			}

			focused = $c.find(".ui-focus");

			/* manual calibration : focus element doesn't catch position when page has footer */
			if ( focused.length ) {
				var $elFooter = $c.siblings( ".ui-footer" ),
					$elFooterHeight = $elFooter.length ? $elFooter.height() : 0,
					dft = focused.offset().top - $c.offset().top, // focused element delta top from clip top
					$cHeight = $c.height();

				if ( dft > $cHeight - $elFooterHeight ) {
					this.scrollTo( 0, this._sy - dft + $cHeight - $elFooterHeight, this.options.snapbackDuration );
				}
			}

			/*
			 * When resize event handler called, view height was set '0' sometimes.
			 * But, view height have to min-height that is same clip height.
			 * If view height was set '0', this means clip do not ready.
			 * So, we first used to setTimeout function but sometimes still return '0'
			 * Below condition exception handling to this condition.
			 */
			if ( view_h === 0 ) {
				return;
			}

			if ( !$( this.element ).is( ".ui-content" ) ) {
				view_w = $v.width();
				cw = $c.width();
			}
			if ( this._sy < clip_h - view_h ) {
				scroll_y = clip_h - view_h;
				scroll_x = 0;
			}
			if ( this._sx < cw - view_w ) {
				scroll_x = cw - view_w;
				scroll_y = scroll_y || 0;
			}
			if (scroll_x || scroll_y) {
				this.scrollTo( scroll_x, scroll_y, this.options.overshootDuration );
			}

			this._view_height = view_h;
			this._clipHeight = this._$clip.height();
		},

		/**
		 * Bind events
		 * @private
		 * @return {boolean|undefined}
		 */
		_add_event: function () {
			var self = this,
				$c = this._$clip,
				$v = this._$view,
				keyCodes = $.mobile.keyCode,
				moveFocusKeycode = [
				                    keyCodes.TAB,
				                    keyCodes.UP,
				                    keyCodes.DOWN,
				                    keyCodes.LEFT,
				                    keyCodes.RIGHT
				],
				movedFocusByKeyboard = false,
				checkFocusOutTimeId;

			if ( this.options.eventType === "mouse" ) {
				this._dragEvt = "mousedown mousemove mouseup click mousewheel";

				this._dragCB = function ( e ) {
					switch ( e.type ) {
					case "mousedown":
						return self._handleDragStart( e,
								e.clientX, e.clientY );

					case "mousemove":
						return self._handleDragMove( e,
								e.clientX, e.clientY );

					case "mouseup":
						return self._handleDragStop( e );

					case "click":
						return !self._didDrag;

					case "mousewheel":
						var old = self.getScrollPosition();
						self.scrollTo( -old.x,
							-(old.y - e.originalEvent.wheelDelta) );
						break;
					}
				};
			} else {
				this._dragEvt = "touchstart touchmove touchend";
				var _in_progress = false;
				this._dragCB = function ( e ) {
					var touches = e.originalEvent.touches;

					switch ( e.type ) {
					case "touchstart":
						if ( touches.length != 1 || _in_progress ) {
							return;
						}

						_in_progress = true;

						return self._handleDragStart( e,
								touches[0].pageX, touches[0].pageY );

					case "touchmove":
						if ( !_in_progress || touches.length != 1) {
							return;
						}

						return self._handleDragMove( e,
								touches[0].pageX, touches[0].pageY );

					case "touchend":
						if ( !_in_progress ) {
							return;
						}

						_in_progress = false;

						if ( touches.length != 0 ) {
							self._hideScrollBars();
							self._hideOverflowIndicator();
							return;
						}

						return self._handleDragStop( e );
					}
				};
			};

			$v.bind( this._dragEvt, this._dragCB );

			// N_SE-35696 / N_SE-35800
			$c.on( "scroll", function () {
				if ( $c.scrollTop() != 0 ) {
					$c.scrollTop( 0 );
				}
			} );

			$v.bind( "keydown", function ( e ) {
				var $target = $( e.target );
				if ( moveFocusKeycode.indexOf( e.keyCode ) === -1 && $target.is( ":input" ) ) {
					if ( $target.is( "textarea" ) ) {
						self._setTextareaPosition( $target );
						return;
					}
					self.ensureElementIsVisible( $target );
				}
			});

			if ( this.options.scrollToFocusEnable ) {
				$v.bind({
					"keydown": function ( e ) {
						var $target = $( e.target );
						if ( !e.isDefaultPrevented() && moveFocusKeycode.indexOf( e.keyCode ) > -1 ) {
							movedFocusByKeyboard = true;

							if ( e.keyCode == keyCodes.TAB ) {
								return;
							}

							checkFocusOutTimeId = window.setTimeout( $.proxy( function( ) {
								var hasFocus = $target.is( ":focus" ),
									orgOffset = {
										top: this._sy,
										left: this._sx
									},
									offset = this._getChangedScrollOffsetByKeyboard( e.keyCode, $target, !hasFocus );

								if ( offset ) {
									this.scrollTo( offset.left, offset.top );
									if ( ( this._sx != orgOffset.left || this._sy != orgOffset.top ) && !hasFocus ) {
										movedFocusByKeyboard = false;
										$target.focus( );
									}
								}
							}, self ), 0 );
						}
					},
					"keyup": function ( e ) {
						movedFocusByKeyboard = false;
					},
					"focusin focus": function ( e ) {
						var $target = $( e.target );
						if ( movedFocusByKeyboard ) {
							if ( $target.is( "textarea" ) ) {
								self._setTextareaPosition( $target );
							} else {
								self.ensureElementIsVisible( $target );
							}
							window.clearTimeout( checkFocusOutTimeId );
						}
					}
				});
			}

			$c.bind( "updatelayout", function ( e ) {
				// When application started, updatelayout event triggered
				// Sometimes layout has especial element, for example iframe tag.
				// In this case, scrollview need to wait that this element set completely
				// because scrollview's view need to information that how this element set layout.
				// Usually case, waiting time is enough to 50ms but If especial element need to more time that this element layout set,
				// developer implement to trigger updatelayout event after efficient times
				setTimeout( function() {
					self.refresh();
				}, 50 );
			});

			$( window ).bind( "throttledresize", function ( e ) {
				var $input;

				if ( ! self._isVisible() ) {
					return;
				}

				$input = $v.find( ":input.ui-focus" ).eq(0);

				setTimeout ( function() {
					self.refresh( );
					if( $input.is( "textarea" ) ) {
						// if input is textarea tag, scrollview scroll to position
						// that user can show textarea carret position
						setTimeout( function() {
							self._setTextareaPosition( $input );
						}, 500 );
					} else if ( $input.length ) {
						self.ensureElementIsVisible( $input );
					}
				}, 250 );
			});

			$( window ).bind( "vmouseout", function ( e ) {
				var drag_stop = false;

				if ( $(".ui-page-active").get(0) !== $c.closest(".ui-page").get(0) ) {
					return;
				}

				if ( !self._dragging ) {
					return;
				}

				if ( e.pageX < 0 || e.pageX > $( window ).width() ) {
					drag_stop = true;
				}

				if ( e.pageY < 0 || e.pageY > $( window ).height() ) {
					drag_stop = true;
				}

				if ( drag_stop ) {
					self._hideScrollBars();
					self._hideOverflowIndicator();
					self._disableTracking();
				}
			});

			this._softkeyboard = false;
			this._softkeyboardHeight = 0;

			window.addEventListener( "softkeyboardchange", function ( e ) {
				if ( $(".ui-page-active").get(0) !== $c.closest(".ui-page").get(0) ) {
					return;
				}

				self._softkeyboard = ( e.state === "on" ? true : false );
				self._softkeyboardHeight = parseInt( e.height ) *
						( $( window ).width() / window.screen.availWidth );
			});

			$c.closest(".ui-page")
				.bind( "pageshow", function ( e ) {
					self._view_height = self._$view.height();

					/* should be called after pagelayout */
					setTimeout( function () {
						self._view_height = self._getViewHeight();
						self._set_scrollbar_size();
						self._setScrollPosition( self._sx, self._sy );
						self._showScrollBars( 2000 );
					}, 0 );
				});

			$c.closest(".ui-page").find( ".ui-popup" )
				.bind( "popupafteropen", function ( e ) {
					if ( !$( self.element ).parents().is( ".ui-ctxpopup" ) ) {
						return true;
					}

                                        setTimeout( function () {
                                                self._setScrollPosition( self._sx, self._sy );
						self._showScrollBars( 2000 );
                                        }, 0 );
				});
		},

		/**
		 * Adds scrollbar elements to DOM
		 * @private
		 */
		_add_scrollbar: function () {
			var $c = this._$clip,
				prefix = "<div class=\"ui-scrollbar ui-scrollbar-",
				suffix = "\"><div class=\"ui-scrollbar-track\"><div class=\"ui-scrollbar-thumb\"></div></div></div>";

			if ( !this.options.showScrollBars ) {
				return;
			}

			if ( this._vTracker ) {
				$c.append( prefix + "y" + suffix );
				this._$vScrollBar = $c.children(".ui-scrollbar-y");
			}
			if ( this._hTracker ) {
				$c.append( prefix + "x" + suffix );
				this._$hScrollBar = $c.children(".ui-scrollbar-x");
			}

			this._scrollbar_showed = false;
		},

		/**
		 * Adds scroll jump button to DOM
		 * @private
		 */
		_add_scroll_jump: function () {
			var $c = this._$clip,
				self = this,
				top_btn,
				left_btn;

			if ( !this.options.scrollJump ) {
				return;
			}

			if ( this._vTracker ) {
				top_btn = $( '<div class="ui-scroll-jump-top-bg">' +
						'<div data-role="button" data-inline="true" data-icon="scrolltop" data-style="box"></div></div>' );
				$c.append( top_btn ).trigger("create");

				top_btn.bind( "vclick", function () {
					self.scrollTo( 0, 0, self.options.overshootDuration );
				} );
			}

			if ( this._hTracker ) {
				left_btn = $( '<div class="ui-scroll-jump-left-bg">' +
						'<div data-role="button" data-inline="true" data-icon="scrollleft" data-style="box"></div></div>' );
				$c.append( left_btn ).trigger("create");

				left_btn.bind( "vclick", function () {
					self.scrollTo( 0, 0, self.options.overshootDuration );
				} );
			}
		},

		/**
		 * Adds overflow indicator to DOM
		 * @private
		 */
		_add_overflow_indicator: function () {
			AniImageMAX = 17;
			if ( !this.options.overflowEnable && !$( this.element).is( ".ui-custom-scrollbar" ) ) {
				return;
			}



//			this._overflow_top_effect = $( '<div class="ui-overflow-indicator-top ui-overflow-top"></div>' );
//			this._overflow_bottom_effect = $( '<div class="ui-overflow-indicator-bottom ui-overflow-bottom"></div>' );			

//			this._$clip.append( this._overflow_top_effect );
//			this._$clip.append( this._overflow_bottom_effect );

			for ( var i = 1 ; i <= AniImageMAX ; i++ ) {
				this._$clip.append( $( '<div class="ui-overflow-indicator-top ui-overflow-top ui-overflow-indicator-bar-' + i + '"></div>' ) );
				this._$clip.append( $( '<div class="ui-overflow-indicator-bottom ui-overflow-bottom ui-overflow-indicator-b-bar-' + i + '"></div>' ) );
			}

			this._display_indicator_top = "block";
			this._display_indicator_bottom = "block";
			this._overflow_showed = false;
		},

		/**
		 * Sets the size of the scrollbars
		 * @private
		 */
		_set_scrollbar_size: function () {
			var $c = this._$clip,
				$v = this._$view,
				cw = 0,
				vw = 0,
				ch = 0,
				vh = 0,
				thumb;

			if ( !this.options.showScrollBars ) {
				return;
			}

			if ( this._hTracker ) {
				cw = $c.width();
				vw = $v.width();
				this._maxX = cw - vw;

				if ( this._maxX > 0 ) {
					this._maxX = 0;
				}
				if ( this._$hScrollBar && vw ) {
					thumb = this._$hScrollBar.find(".ui-scrollbar-thumb");
					thumb.css( "width", (cw >= vw ? "0" :
							( ( (cw / vw * 100) | 0 ) || 1) + "%") );
				}
			}

			if ( this._vTracker ) {
				ch = $c.height();
				vh = this._getViewHeight();
				this._maxY = ch - vh;

				if ( this._maxY > 0 || vh === 0 ) {
					this._maxY = 0;
				}
				if ( ( this._$vScrollBar && vh ) || vh === 0 ) {
					thumb = this._$vScrollBar.find(".ui-scrollbar-thumb");
					thumb.css( "height", (ch >= vh ? "0" :
							( ( (ch / vh * 100) | 0 ) || 1) + "%") );

					this._overflowAvail = !!thumb.height();
				}
			}
		},

		_getChangedScrollOffsetByKeyboard: function ( keyCode, targetElem, isIgnoreDefault) {
			var $target = $(targetElem),
				dist = this.options.scrollDistance,
				keyCodes = $.mobile.keyCode,
				flags = {
					NONE: 0,
					LEFT: 1,
					RIGHT: 2,
					UP: 4,
					DOWN: 8
				},
				keyFlag = {},
				top = this._sy,
				left = this._sx,
				flag = flags.NONE,
				inputType;

			if ( !isIgnoreDefault ) {
				if( $target.is(":input") ) {
					flag = flags.UP|flags.DOWN|flags.LEFT|flags.RIGHT;

					if ( $target.is("input") ) {
						inputType = " "+$target.attr("type").trim();

						if ( " number ".indexOf(inputType) > -1 ) {
						} else if ( " checkbox radio color time date month week datetime datetime-local ".indexOf(inputType) > -1 ) {
							flag = flags.NONE;
						} else if ( $target.val().length === 0 ) { // text, password, url, email, tel, etc...
							flag = flags.NONE;
						}

					} else if ( $target.is("textarea") ) {
						if ( $target.val().length === 0 ) {
							flag = flags.NONE;
						}
					} else if ( $target.is("select") ) {
					}
				}
			}

			// keycode and flag mapping.
			keyFlag[keyCodes.LEFT] = flags.LEFT;
			keyFlag[keyCodes.RIGHT] = flags.RIGHT;
			keyFlag[keyCodes.UP] = flags.UP;
			keyFlag[keyCodes.DOWN] = flags.DOWN;

			if ( !!(flag & keyFlag[keyCode]) ) {
				return null;
			}

			switch( keyCode ) {
			case keyCodes.UP:
				top += dist;
				break;
			case keyCodes.DOWN:
				top -= dist;
				break;
			case keyCodes.LEFT:
				left += dist;
				break;
			case keyCodes.RIGHT:
				left -= dist;
				break;
			}

			return {
				top: top,
				left: left
			};
		}
	});

	/**
	 * Momentum tracker
	 */
	$.extend( MomentumTracker.prototype, {
		/**
		 * Starts momentum callculations
		 * @param {number} pos
		 * @param {number} speed
		 * @param {number} duration
		 * @param {number} minPos
		 * @param {number} maxPos
		 */
		start: function ( pos, speed, duration, minPos, maxPos ) {
			var tstate = ( pos < minPos || pos > maxPos ) ?
					tstates.snapback : tstates.scrolling,
				pos_temp;

			this.state = ( speed !== 0 ) ? tstate : tstates.done;
			this.pos = pos;
			this.speed = speed;
			this.duration = ( this.state === tstates.snapback ) ?
					this.options.snapbackDuration : duration;
			this.minPos = minPos;
			this.maxPos = maxPos;

			this.fromPos = ( this.state === tstates.snapback ) ? this.pos : 0;
			pos_temp = ( this.pos < this.minPos ) ? this.minPos : this.maxPos;
			this.toPos = ( this.state === tstates.snapback ) ? pos_temp : 0;

			this.startTime = getCurrentTime();
		},

		/**
		 * Resets momentum tracker calculations and sets
		 * state to done
		 */
		reset: function () {
			this.state = tstates.done;
			this.pos = 0;
			this.speed = 0;
			this.minPos = 0;
			this.maxPos = 0;
			this.duration = 0;
			this.remained = 0;
		},

		/**
		 * Recalculate momentum tracker estimates
		 * @param {boolean} overshootEnable
		 * @return {number} position
		 */
		update: function ( overshootEnable ) {
			var state = this.state,
				cur_time = getCurrentTime(),
				duration = this.duration,
				elapsed =  cur_time - this.startTime,
				dx,
				x,
				didOverShoot;

			if ( state === tstates.done ) {
				return this.pos;
			}

			elapsed = elapsed > duration ? duration : elapsed;

			this.remained = duration - elapsed;

			if ( state === tstates.scrolling || state === tstates.overshot ) {
				dx = this.speed *
					( 1 - $.easing[this.easing]( elapsed / duration,
								elapsed, 0, 1, duration ) );

				x = this.pos + dx;

				didOverShoot = ( state === tstates.scrolling ) &&
					( x < this.minPos || x > this.maxPos );

				if ( didOverShoot ) {
					x = ( x < this.minPos ) ? this.minPos : this.maxPos;
				}

				this.pos = x;

				if ( state === tstates.overshot ) {
					if ( !overshootEnable ) {
						this.state = tstates.done;
					}
					if ( elapsed >= duration ) {
						this.state = tstates.snapback;
						this.fromPos = this.pos;
						this.toPos = ( x < this.minPos ) ?
								this.minPos : this.maxPos;
						this.duration = this.options.snapbackDuration;
						this.startTime = cur_time;
						elapsed = 0;
					}
				} else if ( state === tstates.scrolling ) {
					if ( didOverShoot && overshootEnable ) {
						this.state = tstates.overshot;
						this.speed = dx / 2;
						this.duration = this.options.overshootDuration;
						this.startTime = cur_time;
					} else if ( elapsed >= duration ) {
						this.state = tstates.done;
					}
				}
			} else if ( state === tstates.snapback ) {
				if ( elapsed >= duration ) {
					this.pos = this.toPos;
					this.state = tstates.done;
				} else {
					this.pos = this.fromPos + (( this.toPos - this.fromPos ) *
						$.easing[this.easing]( elapsed / duration,
							elapsed, 0, 1, duration ));
				}
			}

			return this.pos;
		},

		/**
		 * Checks if momentum state is done
		 * @return {boolean}
		 */
		done: function () {
			return this.state === tstates.done;
		},

		/**
		 * Checks if the position is minimal
		 * @return {boolean}
		 */
		isMin: function () {
			return this.pos === this.minPos;
		},

		/**
		 * Checks if the position is maximal
		 * @return {boolean}
		 */
		isMax: function () {
			return this.pos === this.maxPos;
		},

		/**
		 * Check if momentum tracking is available
		 * @return {boolean}
		 */
		isAvail: function () {
			return !( this.minPos === this.maxPos );
		},

		/**
		 * Returns remaining time
		 * @return {number}
		 */
		getRemained: function () {
			return this.remained;
		},

		/**
		 * Returns current position
		 * @return {number}
		 */
		getPosition: function () {
			return this.pos;
		}
	});

	$( document ).bind( 'pagecreate create', function ( e ) {
		var $page = $( e.target ),
			content_scroll = $page.find(".ui-content").jqmData("scroll");

		/* content scroll */
		if ( $.support.scrollview === undefined ) {
			$.support.scrollview = true;
		}

		if ( $.support.scrollview === true && content_scroll === undefined ) {
			content_scroll = "y";
		}

		if ( content_scroll !== "y" ) {
			content_scroll = "none";
		}

		$page.find(".ui-content").attr( "data-scroll", content_scroll );

		$page.find(":jqmData(scroll)").not(".ui-scrollview-clip").each( function () {
			if ( $( this ).hasClass("ui-scrolllistview") ) {
				$( this ).scrolllistview();
			} else {
				var st = $( this ).jqmData("scroll"),
					dir = st && ( st.search(/^[xy]/) !== -1 ) ? st : null,
					content = $(this).hasClass("ui-content"),
					opts;

				if ( st === "none" ) {
					return;
				}

				opts = {
					direction: dir || undefined,
					overflowEnable: content,
					scrollMethod: $( this ).jqmData("scroll-method") || undefined,
					scrollJump: $( this ).jqmData("scroll-jump") || undefined
				};

				$( this ).scrollview( opts );
			}
		});
	});

	$( document ).bind( 'pageshow', function ( e ) {
		var $page = $( e.target ),
			scroll = $page.find(".ui-content").jqmData("scroll");

		if ( scroll === "y" ) {
			resizePageContentHeight( e.target );
		}
	});

}( jQuery, window, document ) );


/*
* Module Name : widgets/jquery.mobile.tizen.gallery
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/*
 * Gallery widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'gallery'
 *  data-index: start index
 *  data-vertical-align: set to top or middle or bottom.
 *
 * APIs
 *
 *  add(file): add the image (parameter: url of iamge)
 *  remove(index): remove the image (parameter: index of image)
 *  refresh(index): refresh the widget, should be called after add or remove. (parameter: start index)
 *  empty: remove all of images from the gallery
 *  length: get length of images
 *  value(index): get or set current index of gallery (parameter: index of image)
 *
 * Events
 *
 *  N/A
 *
 * Example
 *
 * <div data-role="gallery" id="gallery" data-index="3" data-vertical-align="middle">
 *	<img src="01.jpg">
 *	<img src="02.jpg">
 *	<img src="03.jpg">
 *	<img src="04.jpg">
 *	<img src="05.jpg">
 * </div>
 *
 *
 * $('#gallery-add').bind('vmouseup', function ( e ) {
 *	$('#gallery').gallery('add', '9.jpg');
 *	$('#gallery').gallery('add', '10.jpg');
 *	$('#gallery').gallery('refresh');
 * });
 *
 * $('#gallery-del').bind('vmouseup', function ( e ) {
 *	$('#gallery').gallery('remove');
 * });
 *
 */

 /**
	@class Gallery
	The gallery widget shows images in a gallery on the screen. <br/><br/> To add an gallery widget to the application, use the following code:

		<div data-role="gallery" id="gallery" data-vertical-align="middle" data-index="3">
			<img src="01.jpg">
			<img src="02.jpg">
			<img src="03.jpg">
			<img src="04.jpg">
			<img src="05.jpg">
		</div>
*/
/**
	@property {Integer} data-index
	Defines the index number of the first image in the gallery.
	<br/>The default value is 0.
*/
/**
	@property {String} data-vertical-align
	Defines the image alignment. The alignment options are top, middle, and bottom.
	<br/>The default value is top.
*/
/**
	@method add
	The add method is used to add an image to the gallery. The image_file attribute defines the image file URL.

		<div id="gallery" data-role="gallery" data-vertical-align="middle"></div>
		$("#gallery").gallery('add', [image_file]);
*/
/**
	@method remove
	The remove method is used to delete an image from the gallery. The image_index attribute defines the index of the image to be deleted. If not set removes current image.

		<div id="gallery" data-role="gallery" data-vertical-align="middle"></div>
		$("#gallery").gallery('remove', [image_index]);
*/
/**
	@method refresh
	The refresh method is used to refresh the gallery. This method must be called after adding images to the gallery.

		<div id="gallery" data-role="gallery" data-vertical-align="middle"></div>
		$("#gallery").gallery('refresh');
*/
/**
	@method empty
	The empty method is used to remove all of images from the gallery.

		<div id="gallery" data-role="gallery" data-vertical-align="middle"></div>
		$("#gallery").gallery('empty');
*/
/**
	@method length
	The length method is used to get length of images.

		<div id="gallery" data-role="gallery" data-vertical-align="middle"></div>
		length = $("#gallery").gallery('length');
*/
/**
	@method value
	The value method is used to get or set current index of gallery. The image_index attribute defines the index of the image to be set. If not get current index.

		<div id="gallery" data-role="gallery" data-vertical-align="middle"></div>
		value = $("#gallery").gallery('value');
		$("#gallery").gallery('value', [image_index]);
*/
(function ( $, window, undefined ) {
	$.widget( "tizen.gallery", $.mobile.widget, {
		options: {
			flicking: false,
			duration: 500
		},

		dragging: false,
		moving: false,
		max_width: 0,
		max_height: 0,
		org_x: 0,
		org_time: null,
		cur_img: null,
		prev_img: null,
		next_img: null,
		images: [],
		images_hold: [],
		index: 0,
		align_type: null,
		direction: 1,
		container: null,
		orientationEventFire: false,

		_resize: function ( index ) {
			var img = this.images[index],
				width = this.images[index].width(),
				height = this.images[index].height(),
				margin = 0,
				ratio,
				img_max_width = this.max_width - margin,
				img_max_height = this.max_height - margin;

			ratio = height / width;

			if( img_max_width == 0 && isNaN( img_max_height ) ) {
				/*
				Exception : When image max width and height has incorrect value.
				This exception is occured when this.max_width value is 0 and this.max_height value is NaN when page transition like rotation.
				This exception affect that image width and height values are 0.
				*/
				img.width( width );
				img.height( width * ratio );
			} else {
				if ( width > img_max_width ) {
					img.width( img_max_width );
					img.height( img_max_width * ratio );
				}

				height = img.height();

				if ( height > img_max_height ) {
					img.height( img_max_height );
					img.width( img_max_height / ratio );
				}
			}
		},

		_align: function ( index, obj ) {
			var img = this.images[index],
				img_top = 0;

			if ( !obj ) {
				return;
			}
			if ( !obj.length ) {
				return;
			}

			if ( this.align_type == "middle" ) {
				img_top = ( this.max_height - img.height() ) / 2;
			} else if ( this.align_type == "bottom" ) {
				img_top = this.max_height - img.height();
			} else {
				img_top = 0;
			}

			obj.css( 'top', img_top + 'px' );
		},

		_attach: function ( index, obj ) {
			var self = this,
				processing = function () {
					self._resize( index );
					self._align( index, obj );

				},
				loading = function () {
					if ( self.images[index] === undefined ) {
						return;
					}

					if ( !self.images[index].height() ) {
						setTimeout( loading, 10 );
						return;
					}

					processing();
				};

			if ( !obj ) {
				return;
			}
			if ( !obj.length ) {
				return;
			}
			if ( index < 0 ) {
				return;
			}
			if ( !this.images.length ) {
				return;
			}
			if ( index >= this.images.length ) {
				return;
			}

			obj.css( "display", "block" );
			obj.css( "visibility", "hidden" );
			obj.append( this.images[index] );
			loading();
		},

		_detach: function ( index, obj ) {
			if ( !obj ) {
				return;
			}
			if ( !obj.length ) {
				return;
			}
			if ( index < 0 ) {
				return;
			}
			if ( index >= this.images.length ) {
				return;
			}

			obj.css( "display", "none" );
			this.images[index].removeAttr("style");
			this.images[index].detach();
		},

		_detach_all: function () {
			var i;

			for ( i = 0; i < this.images.length; i++ ) {
				this.images[i].detach();
			}
		},

		_drag: function ( _x ) {
			var delta,
				coord_x;

			if ( !this.dragging ) {
				return;
			}

			if ( this.options.flicking === false ) {
				delta = this.org_x - _x;

				// first image
				if ( delta < 0 && !this.prev_img.length ) {
					return;
				}
				// last image
				if ( delta > 0 && !this.next_img.length ) {
					return;
				}
			}

			coord_x = _x - this.org_x;

			this._moveLeft( this.cur_img , coord_x + 'px' );
			if ( this.next_img.length ) {
				this._moveLeft( this.next_img ,  coord_x + this.window_width + 'px' );
			}
			if ( this.prev_img.length ) {
				this._moveLeft( this.prev_img ,  coord_x - this.window_width + 'px' );
			}
		},

		_move: function ( _x ) {
			var delta = this.org_x - _x,
				flip = 0,
				drag_time,
				sec,
				self;

			if ( delta == 0 ) {
				return;
			}

			if ( delta > 0 ) {
				flip = delta < ( this.max_width * 0.45 ) ? 0 : 1;
			} else {
				flip = -delta < ( this.max_width * 0.45 ) ? 0 : 1;
			}

			if ( !flip ) {
				drag_time = Date.now() - this.org_time;

				if ( Math.abs( delta ) / drag_time > 1 ) {
					flip = 1;
				}
			}

			if ( flip ) {
				if ( delta > 0 && this.next_img.length ) {
					/* next */
					this._detach( this.index - 1, this.prev_img );

					this.prev_img = this.cur_img;
					this.cur_img = this.next_img;
					this.next_img = this.next_img.next();

					this.index++;

					if ( this.next_img.length ) {
						this._moveLeft( this.next_img ,  this.window_width + 'px' );
						this._attach( this.index + 1, this.next_img );
					}

					this.direction = 1;

				} else if ( delta < 0 && this.prev_img.length ) {
					/* prev */
					this._detach( this.index + 1, this.next_img );

					this.next_img = this.cur_img;
					this.cur_img = this.prev_img;
					this.prev_img = this.prev_img.prev();

					this.index--;

					if ( this.prev_img.length ) {
						this._moveLeft( this.prev_img , -this.window_width + 'px' );
						this._attach( this.index - 1, this.prev_img );
					}

					this.direction = -1;
				}
			}

			sec = this.options.duration;
			self = this;

			this.moving = true;

			setTimeout( function () {
				self.moving = false;
			}, sec - 25 );

			this._moveLeft( this.cur_img, 0 + 'px', sec );
			if ( this.next_img.length ) {
				this._moveLeft( this.next_img, this.window_width + 'px', sec );
			}
			if ( this.prev_img.length ) {
				this._moveLeft( this.prev_img, -this.window_width + 'px', sec );
			}
		},

		_add_event: function () {
			var self = this,
				date;

			this.container.bind( 'vmousemove', function ( e ) {
				e.preventDefault();

				if ( self.moving ) {
					return;
				}
				if ( !self.dragging ) {
					return;
				}

				self._drag( e.pageX );
			} );

			this.container.bind( 'vmousedown', function ( e ) {
				e.preventDefault();

				if ( self.moving ) {
					return;
				}

				self.dragging = true;

				self.org_x = e.pageX;

				self.org_time = Date.now();
			} );

			this.container.bind( 'vmouseup', function ( e ) {
				if ( self.moving ) {
					return;
				}

				self.dragging = false;

				self._move( e.pageX );
			} );

			this.container.bind( 'vmouseout', function ( e ) {
				if ( self.moving ) {
					return;
				}
				if ( !self.dragging ) {
					return;
				}

				if ( ( e.pageX < 20 ) ||
						( e.pageX > ( self.max_width - 20 ) ) ) {
					self._move( e.pageX );
					self.dragging = false;
				}
			} );
		},

		_del_event: function () {
			this.container.unbind( 'vmousemove' );
			this.container.unbind( 'vmousedown' );
			this.container.unbind( 'vmouseup' );
			this.container.unbind( 'vmouseout' );
		},
		_setTranslateposition : function ( $ele, value ) {
			var translate,
				cssArray = null,
				self = this;

			if ( $.support.cssTransform3d ) {
				translate = "translate3d(" + value + ", 0px, 0px)";
			} else {
				translate = "translate(" + value + ", 0px)";
			}
			cssArray = {"-moz-transform": translate,
					"-webkit-transform": translate,
					"-ms-transform": translate,
					"-o-transform": translate,
					"transform": translate};

			$ele.css(cssArray);
			return $ele;
		},
		_hidePrevNext : function() {
			var self = this;

			if( self.next_img ) {
				self.next_img.css( "visibility", "hidden" );
			}
			if( self.prev_img ) {
				self.prev_img.css( "visibility", "hidden" );
			}

		},
		_hideCur : function() {
			var self = this;
			if( self.cur_img ) {
				self.cur_img.css( "visibility", "hidden" );
			}
		},
		_moveLeft : function ( $ele , value , duration ) {
			var translate,
				transition = "",
				cssArray = null,
				self = this;

			if ( $.support.cssTransform3d ) {
				translate = "translate3d(" + value + ", 0px, 0px)";
			} else {
				translate = "translate(" + value + ", 0px)";
			}
			if( duration !== undefined ) {
				transition =  "-webkit-transform " + (duration / 1000)+ "s ease";
			}
			cssArray = {"-moz-transform": translate,
					"-webkit-transform": translate,
					"-ms-transform": translate,
					"-o-transform": translate,
					"transform": translate};
			if( transition !== "" ) {
				cssArray["-webkit-transition"] = transition ;
				if( value == "0px" ) {
					$ele.one( 'webkitTransitionEnd', self._hidePrevNext );
				} else {
					$ele.one( 'webkitTransitionEnd', self._hideCur );
				}
			}
			if( value == "0px" ) {
				$ele.css( "visibility", "visible" );
			}

			$ele.css(cssArray);
			return $ele;
		},
		_show: function () {
			/* resizing */
			this.window_width = $( window ).width();
			this.max_width = this._get_width();
			this.max_height = this._get_height();
			this.container.css( 'height', this.max_height );

			this.cur_img = $( 'div' ).find( '.ui-gallery-bg:eq(' + this.index + ')' );
			this.prev_img = this.cur_img.prev();
			this.next_img = this.cur_img.next();

			this._attach( this.index - 1, this.prev_img );
			this._attach( this.index, this.cur_img );
			this._attach( this.index + 1, this.next_img );

			this.cur_img.css( 'visibility', 'visible' );
			if ( this.prev_img.length ) {
				this._setTranslateposition( this.prev_img, -this.window_width + 'px');
			}

			this._moveLeft( this.cur_img, '0px');
			if ( this.next_img.length ) {
				this._setTranslateposition( this.next_img, this.window_width + 'px' );
			}
		},

		show: function () {
			if ( !this.images.length ) {
				return;
			}

			this._show();
			this._add_event();
		},

		_hide: function () {
			this._detach( this.index - 1, this.prev_img );
			this._detach( this.index, this.cur_img );
			this._detach( this.index + 1, this.next_img );
		},

		hide: function () {
			this._hide();
			this._del_event();
		},

		_get_width: function () {
			return $( this.element ).width();
		},

		_get_height: function () {
			var $page = $( this.element ).parentsUntil( 'ui-page' ),
				$content = $page.children( '.ui-content' ),
				header_h = $page.children( '.ui-header' ).outerHeight() || 0,
				footer_h = $page.children( '.ui-footer' ).outerHeight() || 0,
				padding = parseFloat( $content.css( 'padding-top' ) )
					+ parseFloat( $content.css( 'padding-bottom' ) ),
				content_h = $( window ).height() - header_h - footer_h - padding;

			return content_h;
		},

		_create: function () {
			var temp_img,
				self = this,
				index,
				i = 0;

			$( this.element ).wrapInner( '<div class="ui-gallery"></div>' );
			$( this.element ).find( 'img' ).wrap( '<div class="ui-gallery-bg"></div>' );

			this.container = $( this.element ).find('.ui-gallery');

			temp_img = $( 'div' ).find( '.ui-gallery-bg:first' );

			while ( temp_img.length ) {
				this.images[i] = temp_img.find( 'img' );
				temp_img = temp_img.next();
				i++;
			}

			this._detach_all();

			index = parseInt( $( this.element ).jqmData( 'index' ), 10 );
			if ( !index ) {
				index = 0;
			}
			if ( index < 0 ) {
				index = 0;
			}
			if ( index >= this.images.length ) {
				index = this.images.length - 1;
			}

			this.index = index;

			this.align_type = $( this.element ).jqmData( 'vertical-align' );

			$.extend( this, {
				_globalHandlers: [
					{
						src: $( window ),
						handler: {
							orientationchange: $.proxy( this, "_orientationHandler" ),
							resize: $.proxy( this, "_resizeHandler" )
						}
					}
				]
			});

			$.each( this._globalHandlers, function( idx, value ) {
				value.src.bind( value.handler );
			});
		},

		_update: function () {
			var image_file,
				bg_html,
				temp_img;

			while ( this.images_hold.length ) {
				image_file = this.images_hold.shift();

				bg_html = $( '<div class="ui-gallery-bg"></div>' );
				temp_img = $( '<img src="' + image_file + '"></div>' );

				bg_html.append( temp_img );
				this.container.append( bg_html );
				this.images.push( temp_img );
			}

			this._detach_all();
		},
		_resizeHandler: function() {
			var self = this;
			if( self.orientationEventFire ) {
				self.refresh();
				$( event.target ).trigger( "galleryorientationchanged", this );
				self.orientationEventFire = false;
			}
		},
		_orientationHandler: function() {
			var self = this;
			self.refresh();
			self.orientationEventFire = true;
		},
		refresh: function ( start_index ) {
			this._update();

			this._hide();

			if ( start_index === undefined ) {
				start_index = this.index;
			}
			if ( start_index < 0 ) {
				start_index = 0;
			}
			if ( start_index >= this.images.length ) {
				start_index = this.images.length - 1;
			}

			this.index = start_index;

			this._show();

			return this.index;
		},

		add: function ( file ) {
			this.images_hold.push( file );
		},

		remove: function ( index ) {
			var temp_img;

			if ( index === undefined ) {
				index = this.index;
			}

			if ( index < 0 || index >= this.images.length ) {
				return;
			}

			if ( index == this.index ) {
				temp_img = this.cur_img;

				if ( this.index == 0 ) {
					this.direction = 1;
				} else if ( this.index == this.images.length - 1 ) {
					this.direction = -1;
				}

				if ( this.direction < 0 ) {
					this.cur_img = this.prev_img;
					this.prev_img = this.prev_img.prev();
					if ( this.prev_img.length ) {
						this._moveLeft( this.prev_img, -this.window_width + 'px' );
						this._attach( index - 2, this.prev_img );
					}
					this.index--;
				} else {
					this.cur_img = this.next_img;
					this.next_img = this.next_img.next();
					if ( this.next_img.length ) {
						this._moveLeft( this.next_img, this.window_width + 'px' );
						this._attach( index + 2, this.next_img );
					}
				}
				this._moveLeft( this.cur_img, '0px', this.options.duration );

			} else if ( index == this.index - 1 ) {
				temp_img = this.prev_img;
				this.prev_img = this.prev_img.prev();
				if ( this.prev_img.length ) {
					this._moveLeft( this.prev_img, -this.window_width + 'px' );
					this._attach( index - 1, this.prev_img );
				}
				this.index--;

			} else if ( index == this.index + 1 ) {
				temp_img = this.next_img;
				this.next_img = this.next_img.next();
				if ( this.next_img.length ) {
					this._moveLeft( this.next_img, this.window_width + 'px' );
					this._attach( index + 1, this.next_img );
				}

			} else {
				temp_img = $( 'div' ).find( '.ui-gallery-bg:eq(' + index + ')' );
			}

			this.images.splice( index, 1 );
			temp_img.detach();
		},

		empty: function () {
			this.images.splice( 0, this.images.length );
			this.container.find('.ui-gallery-bg').detach();
		},

		length: function () {
			return this.images.length;
		},

		value: function ( index ) {
			if ( index === undefined ) {
				return this.index;
			}

			this.refresh( index );
		},

		unbind: function() {
			$.each( this._globalHandlers, function( idx, value ) {
				value.src.unbind( value.handler );
			});
		},

		destory: function() {
			this.unbind();
		}

	}); /* End of widget */

	// auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( e.target ).find( ":jqmData(role='gallery')" ).gallery();
	});

	$( document ).bind( "pageshow", function ( e ) {
		$( e.target ).find( ":jqmData(role='gallery')" ).gallery( 'show' );
	});

	$( document ).bind( "pagebeforehide", function ( e ) {
		$( e.target ).find( ":jqmData(role='gallery')" ).gallery( 'hide' );
	} );

	$( document ).bind( "pageremove", function ( e ) {
		//unbind resize and orientationchange events
		$( e.target ).find( ":jqmData(role='gallery')" ).gallery( 'unbind' );
	});

}( jQuery, this ) );


/*
* Module Name : widgets/jquery.mobile.tizen.listdivider
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/* ***************************************************************************
* style : normal, check
* option :
*    - folded : decide to show divider press effect or not
*    - line : decide to draw divider line or not
*/
/**
	@class ListDivider
	The list divider widget is used as a list separator for grouping lists. List dividers can be used in Tizen as described in the jQueryMobile documentation for list dividers.<br/>
	To add a list divider widget to the application, use the following code:

		<li data-role="list-divider" data-style="check">
		<form><input type="checkbox" name="c2line-check1" /></form></li>

	The list divider can define callbacks for events as described in the jQueryMobile documentation for list events. <br/> You can use methods with the list divider as described in the jQueryMobile documentation for list methods.

	@since tizen2.0	
*/
/**
	@property {String} data-style
	Sets the style of the list divider. The style options are dialogue, check, expandable, and checkexpandable.
*/

(function ( $, undefined ) {
	$.widget( "tizen.listdivider", $.mobile.widget, {
		options: {
			initSelector: ":jqmData(role='list-divider')",
			folded : false,
			listDividerLine : true
		},

		_create: function () {

			var $listdivider = this.element,
				openStatus = true,
				expandSrc,
				listDividerLine = true,
				style = $listdivider.attr( "data-style" );

			if ( $listdivider.data("line") === false ) {
				this.options.listDividerLine = false;
			}

			if ( $listdivider.data("folded") === true ) {
				this.options.folded = true;
			}

			if ( style == undefined || style === "normal" || style === "check" ) {
				if ( this.options.folded ) {
					$listdivider.buttonMarkup();
				} else {
					$listdivider.wrapInner("<span class='ui-btn-text'></span>");
				}

				if ( this.options.listDividerLine ) {
					expandSrc = "<span class='ui-divider-normal-line'></span>";
					if ( this.options.folded ) {
						$( expandSrc ).appendTo( $listdivider.children( ".ui-btn-inner" ) );
					} else {
						$( expandSrc ).appendTo( $listdivider);
					}
				}
			}

			$listdivider.bind( "vclick", function ( event, ui ) {
			/* need to implement expand/collapse divider */
			});
		}
	});

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.listdivider.prototype.options.initSelector, e.target ).listdivider();
	});
}( jQuery ) );


/*
* Module Name : widgets/jquery.mobile.tizen.multimediaview
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 *
 * MultiMediaView is a widget that lets the user view and handle multimedia contents.
 * Video and audio elements are coded as standard HTML elements and enhanced by the 
 * MultiMediaview to make them attractive and usable on a mobile device.
 *
 * HTML Attributes:
 *			data-theme : Set a theme of widget.
 *				If this value is not defined, widget will use parent`s theme. (optional)
 *			data-controls : If this value is 'true', widget will use belonging controller.
 *				If this value is 'false', widget will use browser`s controller.
 *				Default value is 'true'.
 *			data-full-screen : Set a status that full-screen when inital start.
 *				Default value is 'false'.
 *
 * APIs:
 *			width( [number] )
 *					: Get or set the width of widget.
 *					The first argument is the width of widget.
 *					If no first argument is specified, will act as a getter.
 *			height( [number] )
 *					: Get or set the height of widget.
 *					The first argument is the height of widget.
 *					If no first argument is specified, will act as a getter.
 *			fullScreen( [boolean] )
 *					: Get or Set the status of full-screen.
 *					If no first argument is specified, will act as a getter.
 *
 * Events:
 *
 *			N/A
 *
 * Examples:
 *
 *			VIDEO :
 *				<video data-controls="true" style="width:100%;">
 *					<source src="media/oceans-clip.mp4" type="video/mp4" />
 *					Your browser does not support the video tag.
 *				</video>
 *
 *			AUDIO :
 *				<audio data-controls="true" style="width:100%;">
 *					<source src="media/Over the horizon.mp3" type="audio/mp3" />
 *					Your browser does not support the audio tag.
 *				</audio>
 *
 */
/**
	@class MutimediaView
	The multimedia view widget shows a player control that you can use to view and handle multimedia content. This widget uses the standard HTML video and audio elements, which have been enhanced for use on a mobile device.

	To add a multimedia view widget to the application, use the following code:
	
		// Video player control
		<video data-controls="true" style="width:100%;">
		<source src="<VIDEO_FILE_URL>" type="video/mp4" /> Your browser does not support the video tag. </video>
		// Audio player control
		<audio data-controls="true" style="width:100%;"> <source src="<AUDIO_FILE_URL>" type="audio/mp3" /> Your browser does not support the audio tag.
		</audio>
*/
/**
	@property {Boolean} data-control
	Sets the controls for the widget.
	The default value is true. If the value is set to true, the widget uses its own player controls. If the value is set to false, the widget uses the browser's player controls.
*/
/**
	@property {Boolean} data-full-screen
	Defines whether the widget opens in the fullscreen view mode.
	The default value is false.
*/
/**
	@property {String} data-theme
	Sets the widget theme.
	If the value is not set, the parent control's theme is used
*/
/**
	@method width
	The width method is used to get (if no value is defined) or set the multimedia view widget width:
		<video>
			 <source src="test.mp4" type="video/mp4" />
		</video>
		$(".selector").multimediaview("width", [value]);
*/
/**
	@method height
	The height method is used to get (if no value is defined) or set the multimedia view widget height:
		<video>
			<source src="test.mp4" type="video/mp4" />
		</video>
		$(".selector").multimediaview("height", [value]);
*/
/**
	@method fullScreen
	The fullScreen method is used to get (if no value is defined) or set the full-screen mode of the multimedia view widget. If the value is true, the full-screen mode is used; otherwise the multimedia view widget runs in the normal mode.

		<video>
			<source src="test.mp4" type="video/mp4" />
		</video>
		$(".selector").multimediaview("fullScreen", [value]);
*/
( function ( $, document, window, undefined ) {
	$.widget( "tizen.multimediaview", $.mobile.widget, {
		options: {
			theme: null,
			controls: true,
			fullScreen: false,
			initSelector: "video, audio"
		},

		_create: function () {
			var self = this,
				view = self.element,
				viewElement = view[0],
				isVideo = ( viewElement.nodeName === "VIDEO" ),
				option = self.options,
				parentTheme = $.mobile.getInheritedTheme( view, "s" ),
				theme = option.theme || parentTheme,
				width = viewElement.style.getPropertyValue( "width" ) || "",
				wrap = $( "<div class='ui-multimediaview-wrap ui-multimediaview-" + theme + "'>" ),
				control = null;

			$.extend( this, {
				role: null,
				controlTimer: null,
				isVolumeHide: true,
				backupView: null,
				_reserveVolume: -1,
				_isVideo: isVideo
			});

			view.addClass( "ui-multimediaview" );
			control = self._createControl();
			control.hide();

			$( ".ui-button", control ).addClass( "ui-shadow ui-btn-corner-all" );
			$( ".ui-volumecontrol .ui-handle", control ).addClass( "ui-shadow ui-btn-corner-circle" );

			view.wrap( wrap ).after( control );

			if ( isVideo ) {
				control.addClass( "ui-multimediaview-video" );
			} else {
				self.width( width );
				self.options.fullScreen = false;
			}

			if ( option.controls && view.attr( "controls" ) ) {
				view.removeAttr( "controls" );
			}

			self._addEvent();
		},

		_resize: function () {
			this._resizeFullscreen( this.options.fullScreen );
			this._resizeControl();
			this._updateSeekBar();
			this._updateVolumeState();
		},

		_resizeControl: function () {
			var self = this,
				view = self.element,
				viewElement = view[0],
				isVideo = self._isVideo,
				wrap = view.parent( ".ui-multimediaview-wrap" ),
				control = wrap.find( ".ui-multimediaview-control" ),
				buttons = control.find( ".ui-button" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				seekBar = control.find( ".ui-seekbar" ),
				durationLabel = control.find( ".ui-durationlabel" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				width = ( isVideo ? view.width() : wrap.width() ),
				height = ( isVideo ? view.height() : control.height() ),
				offset = view.offset(),
				controlHeight = control.height(),
				availableWidth = 0,
				controlOffset = null;

			if ( control ) {
				if ( isVideo ) {
					controlOffset = control.offset();
					controlOffset.left = offset.left;
					controlOffset.top = offset.top + height - controlHeight;
					control.offset( controlOffset );
				}
				control.width( width );
			}

			if ( seekBar ) {
				availableWidth = control.width() - ( buttons.outerWidth( true ) * buttons.length );
				availableWidth -= ( parseInt( buttons.eq( 0 ).css( "margin-left" ), 10 ) + parseInt( buttons.eq( 0 ).css( "margin-right" ), 10 ) ) * buttons.length;
				if ( !self.isVolumeHide ) {
					availableWidth -= volumeControl.outerWidth( true );
				}
				seekBar.width( availableWidth );
			}

			if ( durationLabel && !isNaN( viewElement.duration ) ) {
				durationLabel.find( "p" ).text( self._convertTimeFormat( viewElement.duration ) );
			}

			if ( viewElement.autoplay && viewElement.paused === false ) {
				playpauseButton.removeClass( "ui-play-icon" ).addClass( "ui-pause-icon" );
			}

			if ( seekBar.width() < ( volumeBar.width() + timestampLabel.width() + durationLabel.width() ) ) {
				durationLabel.hide();
			} else {
				durationLabel.show();
			}
		},

		_resizeFullscreen: function ( isFullscreen ) {
			if ( !this._isVideo ) {
				return;
			}

			var self = this,
				view = self.element,
				viewElement = view[0],
				wrap = view.parent( ".ui-multimediaview-wrap" ),
				control = wrap.find( ".ui-multimediaview-control" ),
				fullscreenButton = control.find( ".ui-fullscreenbutton" ),
				currentPage = $( ".ui-page-active" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				seekBar = control.find( ".ui-seekbar" ),
				durationBar = seekBar.find( ".ui-duration" ),
				currenttimeBar = seekBar.find( ".ui-currenttime" ),
				body = $( "body" )[0],
				header = currentPage.children( ".ui-header" ),
				footer = currentPage.children( ".ui-footer" ),
				docWidth = 0,
				docHeight = 0;

			if ( isFullscreen ) {
				if ( !self.backupView ) {
					self.backupView = {
						width: viewElement.style.getPropertyValue( "width" ) || "",
						height: viewElement.style.getPropertyValue( "height" ) || "",
						position: view.css( "position" ),
						zindex: view.css( "z-index" ),
						wrapHeight: wrap[0].style.getPropertyValue( "height" ) || ""
					};
				}
				docWidth = body.clientWidth;
				docHeight = body.clientHeight - 1;

				header.hide();
				footer.hide();
				view.parents().each( function ( e ) {
					var element = $( this );
					element.addClass( "ui-fullscreen-parents" )
						.siblings()
						.addClass( "ui-multimediaview-siblings-off" );
				});
				fullscreenButton.removeClass( "ui-fullscreen-on" ).addClass( "ui-fullscreen-off" );

				wrap.height( docHeight );
				view.width( docWidth ).height( docHeight );
			} else {
				if ( !self.backupView ) {
					return;
				}

				header.show();
				footer.show();
				view.parents().each( function ( e ) {
					var element = $( this );
					element.removeClass( "ui-fullscreen-parents" )
						.siblings()
						.removeClass( "ui-multimediaview-siblings-off" );
				});

				fullscreenButton.removeClass( "ui-fullscreen-off" ).addClass( "ui-fullscreen-on" );

				wrap.css( "height", self.backupView.wrapHeight );
				view.css( {
					"width": self.backupView.width,
					"height": self.backupView.height,
					"position": self.backupView.position,
					"z-index": self.backupView.zindex
				});
				self.backupView = null;

				$( window ).trigger( "throttledresize" );
			}
		},

		_addEvent: function () {
			var self = this,
				view = self.element,
				option = self.options,
				viewElement = view[0],
				isVideo = self._isVideo,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				durationLabel = control.find( ".ui-durationlabel" ),
				volumeButton = control.find( ".ui-volumebutton" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				volumeGuide = volumeControl.find( ".ui-guide" ),
				volumeHandle = volumeControl.find( ".ui-handle" ),
				fullscreenButton = control.find( ".ui-fullscreenbutton" ),
				seekBar = control.find( ".ui-seekbar" ),
				durationBar = seekBar.find( ".ui-duration" ),
				currenttimeBar = seekBar.find( ".ui-currenttime" ),
				touchStartEvt = ( $.support.touch ? "touchstart" : "mousedown" ),
				touchMoveEvt = ( $.support.touch ? "touchmove" : "mousemove" ) + ".multimediaview",
				touchEndEvt = ( $.support.touch ? "touchend" : "mouseup" ) + ".multimediaview",
				$document = $( document );

			view.bind( "loadedmetadata.multimediaview", function ( e ) {
				if ( !isNaN( viewElement.duration ) ) {
					durationLabel.find( "p" ).text( self._convertTimeFormat( viewElement.duration ) );
				}
				//JIRA - N_SE-47690
				if ( option.controls ) {
					control.show();
				}
				self._resize();
			}).bind( "timeupdate.multimediaview", function ( e ) {
				self._updateSeekBar();
				if ( viewElement.currentTime >= viewElement.duration && !viewElement.loop ) {
					viewElement.pause();
				}
			}).bind( "play.multimediaview", function ( e ) {
				playpauseButton.removeClass( "ui-play-icon" ).addClass( "ui-pause-icon" );
			}).bind( "pause.multimediaview", function ( e ) {
				playpauseButton.removeClass( "ui-pause-icon" ).addClass( "ui-play-icon" );
			}).bind( "volumechange.multimediaview", function ( e ) {
				if ( viewElement.muted && viewElement.volume > 0.1 ) {
					volumeButton.removeClass( "ui-volume-icon" ).addClass( "ui-mute-icon" );
					self._reserveVolume = viewElement.volume;
					viewElement.volume = 0;
				} else if ( self._reserveVolume !== -1 && !viewElement.muted ) {
					volumeButton.removeClass( "ui-mute-icon" ).addClass( "ui-volume-icon" );
					viewElement.volume = self._reserveVolume;
					self._reserveVolume = -1;
				} else if ( viewElement.volume < 0.1 ) {
					volumeButton.removeClass( "ui-volume-icon" ).addClass( "ui-mute-icon" );
				} else {
					volumeButton.removeClass( "ui-mute-icon" ).addClass( "ui-volume-icon" );
				}

				if ( !self.isVolumeHide ) {
					self._updateVolumeState();
				}
			}).bind( "durationchange.multimediaview", function ( e ) {
				if ( !isNaN( viewElement.duration ) ) {
					durationLabel.find( "p" ).text( self._convertTimeFormat( viewElement.duration ) );
				}
				self._resize();
			}).bind( "click.multimediaview", function ( e ) {
				if ( !self.options.controls ) {
					return;
				}

				control.fadeToggle( "fast" );
				self._resize();
			}).bind( "multimediaviewinit", function ( e ) {
				self._resize();
			});

			$( ".ui-button", control ).bind( touchStartEvt, function () {
				var button = $( this ).addClass( "ui-button-down" );

				$document.bind( touchMoveEvt, function () {
					button.trigger( touchEndEvt );
				});
			}).bind( touchEndEvt, function () {
				$( this ).removeClass( "ui-button-down" );
				$document.unbind( touchMoveEvt );
			});

			playpauseButton.bind( "click.multimediaview", function () {
				self._endTimer();

				if ( viewElement.paused ) {
					viewElement.play();
				} else {
					viewElement.pause();
				}

				if ( isVideo ) {
					self._startTimer();
				}
			});

			fullscreenButton.bind( "click.multimediaview", function ( e ) {
				e.preventDefault();
				self.fullScreen( !self.options.fullScreen );
				self._resize();
				self._endTimer();
				e.stopPropagation();
			});

			seekBar.bind( touchStartEvt, function ( e ) {
				var x = $.support.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX,
					duration = viewElement.duration,
					durationOffset = durationBar.offset(),
					durationWidth = durationBar.width(),
					timerate = ( x - durationOffset.left ) / durationWidth,
					time = duration * timerate;

				if ( !viewElement.played.length ) {
					return;
				}

				viewElement.currentTime = time;

				self._endTimer();

				e.preventDefault();

				control.bind( touchMoveEvt, function ( e ) {
					var x = $.support.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX,
						timerate = ( x - durationOffset.left ) / durationWidth;

					time = duration * timerate;
					viewElement.currentTime = time;
					self._updateSeekBar();

					e.stopPropagation();
				}).bind( touchEndEvt, function () {
					control.unbind( ".multimediaview" );
					$document.unbind( touchMoveEvt );

					if ( viewElement.paused ) {
						viewElement.pause();
					} else if ( time >= duration && !viewElement.loop ) {
						// Below codes have low priority to run after the end of the current task.
						setTimeout( function () {
							viewElement.pause();
						}, 0 );
					} else {
						viewElement.play();
					}

					e.stopPropagation();
				});

				$document.bind( touchMoveEvt, function () {
					control.trigger( touchEndEvt );
				});
			});

			volumeButton.bind( "click.multimediaview", function () {
				if ( self.isVolumeHide ) {
					var view = self.element,
						volume = viewElement.volume;

					self.isVolumeHide = false;
					volumeControl.stop( true, true ).fadeIn( "fast", function () {
						self._updateVolumeState();
						self._updateSeekBar();
					});
					self._resize();
				} else {
					self.isVolumeHide = true;
					volumeControl.fadeOut( "fast", function () {
						self._resize();
					});
				}
			});

			volumeBar.bind( touchStartEvt, function ( e ) {
				var baseX = $.support.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX,
					volumeGuideLeft = volumeGuide.offset().left,
					volumeGuideWidth = volumeGuide.width(),
					volumeBase = volumeGuideLeft + volumeGuideWidth,
					handlerOffset = volumeHandle.offset(),
					volumerate = ( baseX - volumeGuideLeft ) / volumeGuideWidth,
					currentVolume = ( baseX - volumeGuideLeft ) / volumeGuideWidth;

				self._endTimer();
				volumeHandle.addClass( "ui-button-down" );
				self._setVolume( currentVolume.toFixed( 2 ) );

				e.preventDefault();

				control.bind( touchMoveEvt, function ( e ) {
					var x = $.support.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX,
						currentVolume = ( x - volumeGuideLeft );
					currentVolume = ( currentVolume < 0 ) ? 0 : currentVolume / volumeGuideWidth;
					self._setVolume( ( currentVolume > 1 ) ? 1 : currentVolume.toFixed( 2 ) );

					e.stopPropagation();
				}).bind( touchEndEvt, function () {
					control.unbind( ".multimediaview" );
					$document.unbind( touchMoveEvt );
					volumeHandle.removeClass( "ui-button-down" );
					e.stopPropagation();
				});

				$document.bind( touchMoveEvt, function () {
					control.trigger( touchEndEvt );
				});
			});
		},

		_removeEvent: function () {
			var view = this.element,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				playpauseButton = control.find( ".ui-playpausebutton" ),
				fullscreenButton = control.find( ".ui-fullscreenbutton" ),
				seekBar = control.find( ".ui-seekbar" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				volumeHandle = volumeControl.find( ".ui-handle" );

			view.unbind( ".multimediaview" );
			playpauseButton.unbind( ".multimediaview" );
			fullscreenButton.unbind( ".multimediaview" );
			seekBar.unbind( ".multimediaview" );
			volumeBar.unbind( ".multimediaview" );
			volumeHandle.unbind( ".multimediaview" );
		},

		_createControl: function () {
			var view = this.element,
				viewElement = view[0],
				control = $( "<span></span>" ).addClass( "ui-multimediaview-control" ),
				playpauseButton = $( "<span></span>" ).addClass( "ui-playpausebutton ui-button ui-play-icon" ),
				seekBar = $( "<span></span>" ).addClass( "ui-seekbar ui-multimediaview-bar" ),
				timestampLabel = $( "<span><p>00:00:00</p></span>" ).addClass( "ui-timestamplabel" ),
				durationLabel = $( "<span><p>00:00:00</p></span>" ).addClass( "ui-durationlabel" ),
				volumeButton = $( "<span></span>" ).addClass( "ui-volumebutton ui-button" ),
				volumeControl = $( "<span></span>" ).addClass( "ui-volumecontrol" ),
				volumeBar = $( "<div></div>" ).addClass( "ui-volumebar ui-multimediaview-bar" ),
				volumeGuide = $( "<span></span>" ).addClass( "ui-guide ui-multimediaview-bar-bg" ),
				volumeValue = $( "<span></span>" ).addClass( "ui-value ui-multimediaview-bar-highlight" ),
				volumeHandle = $( "<span></span>" ).addClass( "ui-handle" ),
				fullscreenButton = $( "<span></span>" ).addClass( "ui-fullscreenbutton ui-button" ),
				durationBar = $( "<span></span>" ).addClass( "ui-duration ui-multimediaview-bar-bg" ),
				currenttimeBar = $( "<span></span>" ).addClass( "ui-currenttime ui-multimediaview-bar-highlight" );

			seekBar.append( durationBar ).append( currenttimeBar ).append( durationLabel ).append( timestampLabel );

			volumeButton.addClass( viewElement.muted ? "ui-mute-icon" : "ui-volume-icon" );
			volumeBar.append( volumeGuide ).append( volumeValue ).append( volumeHandle );
			volumeControl.append( volumeBar );

			control.append( playpauseButton ).append( seekBar ).append( volumeControl ).append( volumeButton );

			if ( this._isVideo ) {
				$( fullscreenButton ).addClass( "ui-fullscreen-on" );
				control.append( fullscreenButton );
			}
			volumeControl.hide();

			return control;
		},

		_startTimer: function ( duration ) {
			this._endTimer();

			if ( !duration ) {
				duration = 3000;
			}

			var self = this,
				view = self.element,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				volumeControl = control.find( ".ui-volumecontrol" );

			self.controlTimer = setTimeout( function () {
				self.isVolumeHide = true;
				self.controlTimer = null;
				control.fadeOut( "fast", function () {
					volumeControl.hide();
				} );
			}, duration );
		},

		_endTimer: function () {
			if ( this.controlTimer ) {
				clearTimeout( this.controlTimer );
				this.controlTimer = null;
			}
		},

		_convertTimeFormat: function ( systime ) {
			if ( !$.isNumeric( systime ) ) {
				return "Playback Error";
			}

			var ss = parseInt( systime % 60, 10 ).toString(),
				mm = parseInt( ( systime / 60 ) % 60, 10 ).toString(),
				hh = parseInt( systime / 3600, 10 ).toString(),
				time =	( ( hh.length < 2  ) ? "0" + hh : hh ) + ":" +
						( ( mm.length < 2  ) ? "0" + mm : mm ) + ":" +
						( ( ss.length < 2  ) ? "0" + ss : ss );

			return time;
		},

		_updateSeekBar: function ( currenttime ) {
			var view = this.element,
				viewElement = view[0],
				duration = viewElement.duration,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				seekBar = control.find(  ".ui-seekbar"  ),
				durationBar = seekBar.find( ".ui-duration" ),
				currenttimeBar = seekBar.find( ".ui-currenttime" ),
				timestampLabel = control.find( ".ui-timestamplabel" ),
				durationOffset = durationBar.offset(),
				durationWidth = durationBar.width(),
				durationHeight = durationBar.height(),
				timebarWidth = 0;

			if ( typeof currenttime === "undefined" ) {
				currenttime = viewElement.currentTime;
			}
			timebarWidth = parseInt( currenttime / duration * durationWidth, 10 );
			durationBar.offset( durationOffset );
			currenttimeBar.offset( durationOffset ).width( timebarWidth );
			timestampLabel.find( "p" ).text( this._convertTimeFormat( currenttime ) );
		},

		_updateVolumeState: function () {
			var view = this.element,
				control = view.parent( ".ui-multimediaview-wrap" ).find( ".ui-multimediaview-control" ),
				volumeControl = control.find( ".ui-volumecontrol" ),
				volumeButton = control.find( ".ui-volumebutton" ),
				volumeBar = volumeControl.find( ".ui-volumebar" ),
				volumeGuide = volumeControl.find( ".ui-guide" ),
				volumeValue = volumeControl.find( ".ui-value" ),
				volumeHandle = volumeControl.find( ".ui-handle" ),
				handlerWidth = volumeHandle.width(),
				handlerHeight = volumeHandle.height(),
				volumeGuideHeight = volumeGuide.height(),
				volumeGuideWidth = volumeGuide.width(),
				volumeGuideTop = 0,
				volumeGuideLeft = 0,
				volumeBase = 0,
				handlerOffset = null,
				volume = view[0].volume;

			volumeGuideTop = parseInt( volumeGuide.offset().top, 10 );
			volumeGuideLeft = parseInt( volumeGuide.offset().left, 10 );
			volumeBase = volumeGuideLeft;
			handlerOffset = volumeHandle.offset();
			handlerOffset.top = volumeGuideTop - parseInt( ( handlerHeight - volumeGuideHeight ) / 2, 10 );
			handlerOffset.left = volumeBase + parseInt( volumeGuideWidth * volume, 10 ) - parseInt( handlerWidth / 2, 10 );
			volumeHandle.offset( handlerOffset );
			volumeValue.offset( volumeGuide.offset() ).width( parseInt( volumeGuideWidth * ( volume ), 10 ) );
		},

		_setVolume: function ( value ) {
			var viewElement = this.element[0];

			if ( value < 0.0 || value > 1.0 ) {
				return;
			}

			viewElement.volume = value;
		},

		width: function ( value ) {
			if ( this.options.fullScreen ) {
				return;
			}

			var view = this.element,
				wrap = view.parent( ".ui-multimediaview-wrap" );

			if ( arguments.length === 0 ) {
				return view.width();
			}

			if ( !this._isVideo ) {
				wrap.width( value );
			}

			view.width( value );
			this._resize();
		},

		height: function ( value ) {
			if ( !this._isVideo || this.options.fullScreen ) {
				return;
			}

			var view = this.element;

			if ( arguments.length === 0 ) {
				return view.height();
			}

			view.height( value );
			this._resize();
		},

		fullScreen: function ( value ) {
			if ( !this._isVideo ) {
				return;
			}

			var view = this.element,
				option = this.options;

			if ( arguments.length === 0 ) {
				return option.fullScreen;
			}

			view.parents( ".ui-scrollview-clip" ).scrollview( "scrollTo", 0, 0 );

			this.options.fullScreen = value;

			this._resize();
		},

		refresh: function () {
			this._resize();
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$.tizen.multimediaview.prototype.enhanceWithin( e.target );
	}).bind( "pagechange", function ( e ) {
		$( e.target ).find( ".ui-multimediaview" ).each( function () {
			var view = $( this ),
				viewElement = view[0];

			if ( viewElement.autoplay ) {
				viewElement.play();
			}
			view.multimediaview( "refresh" );
		});
	}).bind( "pagebeforechange", function ( e ) {
		$( e.target ).find( ".ui-multimediaview" ).each( function () {
			var view = $( this ),
				viewElement = view[0],
				isFullscreen = view.multimediaview( "fullScreen" );

			if ( isFullscreen ) {
				view.multimediaview( "fullScreen", !isFullscreen );
			}

			if ( viewElement.played.length !== 0 ) {
				viewElement.pause();
			}
		});
	});

	$( window ).bind( "resize orientationchange", function ( e ) {
		$( ".ui-page-active" ).find( ".ui-multimediaview" ).multimediaview( "refresh" );
	});

} ( jQuery, document, window ) );


/*
* Module Name : widgets/jquery.mobile.tizen.circularview
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

// most of following codes are derived from jquery.mobile.scrollview.js
(function ( $, window, document, undefined ) {

	function circularNum( num, total ) {
		var n = num % total;
		if ( n < 0 ) {
			n = total + n;
		}
		return n;
	}

	function setElementTransform( $ele, x, y ) {
		var v = "translate3d( " + x + "," + y + ", 0px)";
		$ele.css({
			"-ms-transform": v,
			"-o-transform": v,
			"-moz-transform": v,
			"-webkit-transform": v,
			"transform": v
		} );
	}

	function MomentumTracker( options ) {
		this.options = $.extend( {}, options );
		this.easing = "easeOutQuad";
		this.reset();
	}

	var tstates = {
		scrolling : 0,
		done : 1
	};

	function getCurrentTime() {
		return Date.now();
	}

	$.extend( MomentumTracker.prototype, {
		start: function ( pos, speed, duration ) {
			this.state = ( speed != 0 ) ? tstates.scrolling : tstates.done;
			this.pos = pos;
			this.speed = speed;
			this.duration = duration;

			this.fromPos = 0;
			this.toPos = 0;

			this.startTime = getCurrentTime();
		},

		reset: function () {
			this.state = tstates.done;
			this.pos = 0;
			this.speed = 0;
			this.duration = 0;
		},

		update: function () {
			var state = this.state,
				duration,
				elapsed,
				dx,
				x;

			if ( state == tstates.done ) {
				return this.pos;
			}

			duration = this.duration;
			elapsed = getCurrentTime() - this.startTime;
			elapsed = elapsed > duration ? duration : elapsed;

			dx = this.speed * ( 1 - $.easing[this.easing](elapsed / duration, elapsed, 0, 1, duration ) );

			x = this.pos + dx;
			this.pos = x;

			if ( elapsed >= duration ) {
				this.state = tstates.done;
			}

			return this.pos;
		},

		done: function () {
			return this.state == tstates.done;
		},

		getPosition: function () {
			return this.pos;
		}
	} );

	jQuery.widget( "mobile.circularview", jQuery.mobile.widget, {
		options: {
			fps:				60,

			scrollDuration:		2000,

			moveThreshold:		10,
			moveIntervalThreshold:	150,

			startEventName:		"scrollstart",
			updateEventName:	"scrollupdate",
			stopEventName:		"scrollstop",

			eventType:			$.support.touch	? "touch" : "mouse",

			delayedClickSelector: "a, .ui-btn",
			delayedClickEnabled: false
		},

		_makePositioned: function ( $ele ) {
			if ( $ele.css( 'position' ) == 'static' ) {
				$ele.css( 'position', 'relative' );
			}
		},

		_create: function () {
			var self = this;

			this._items = $( this.element ).jqmData('list');
			this._$clip = $( this.element ).addClass( "ui-scrollview-clip" );
			this._$clip.wrapInner( '<div class="ui-scrollview-view"></div>' );
			this._$view = $('.ui-scrollview-view', this._$clip );
			this._$list = $( 'ul', this._$clip );

			this._$clip.css( "overflow", "hidden" );
			this._makePositioned( this._$clip );

			this._$view.css( "overflow", "hidden" );
			this._tracker = new MomentumTracker( this.options );

			this._timerInterval = 1000 / this.options.fps;
			this._timerID = 0;

			this._timerCB = function () { self._handleMomentumScroll(); };

			this.refresh();

			this._addBehaviors();
		},

		reflow: function () {
			var xy = this.getScrollPosition();
			this.refresh();
			this.scrollTo( xy.x, xy.y );
		},

		refresh: function () {
			var itemsPerView;

			this._$clip.width( $(window).width() );
			this._clipWidth = this._$clip.width();
			this._$list.empty();
			this._$list.append(this._items[0]);
			this._itemWidth = $(this._items[0]).outerWidth();
			$(this._items[0]).detach();

			itemsPerView = this._clipWidth / this._itemWidth;
			itemsPerView = Math.ceil( itemsPerView * 10 ) / 10;
			this._itemsPerView = parseInt( itemsPerView, 10 );
			while ( this._itemsPerView + 1 > this._items.length ) {
				$.merge( this._items, $(this._items).clone() );
			}
			this._rx = -this._itemWidth;
			this._sx = -this._itemWidth;
			this._setItems();
		},

		_startMScroll: function ( speedX, speedY ) {
			this._stopMScroll();

			var keepGoing = false,
				duration = this.options.scrollDuration,
				t = this._tracker,
				c = this._clipWidth,
				v = this._viewWidth;

			this._$clip.trigger( this.options.startEventName);

			t.start( this._rx, speedX, duration, (v > c ) ? -(v - c) : 0, 0 );
			keepGoing = !t.done();

			if ( keepGoing ) {
				this._timerID = setTimeout( this._timerCB, this._timerInterval );
			} else {
				this._stopMScroll();
			}
			//console.log( "startmscroll" + this._rx + "," + this._sx );
		},

		_stopMScroll: function () {
			if ( this._timerID ) {
				this._$clip.trigger( this.options.stopEventName );
				clearTimeout( this._timerID );
			}

			this._timerID = 0;

			if ( this._tracker ) {
				this._tracker.reset();
			}
			//console.log( "stopmscroll" + this._rx + "," + this._sx );
		},

		_handleMomentumScroll: function () {
			var keepGoing = false,
				v = this._$view,
				x = 0,
				y = 0,
				t = this._tracker;

			if ( t ) {
				t.update();
				x = t.getPosition();

				keepGoing = !t.done();

			}

			this._setScrollPosition( x, y );
			this._rx = x;

			this._$clip.trigger( this.options.updateEventName, [ { x: x, y: y } ] );

			if ( keepGoing ) {
				this._timerID = setTimeout( this._timerCB, this._timerInterval );
			} else {
				this._stopMScroll();
			}
		},

		_setItems: function () {
			var i,
				$item;

			for ( i = -1; i < this._itemsPerView + 1; i++ ) {
				$item = this._items[ circularNum( i, this._items.length ) ];
				this._$list.append( $item );
			}
			setElementTransform( this._$view, this._sx + "px", 0 );
			this._$view.width( this._itemWidth * ( this._itemsPerView + 2 ) );
			this._viewWidth = this._$view.width();
		},

		_setScrollPosition: function ( x, y ) {
			var sx = this._sx,
				dx = x - sx,
				di = parseInt( dx / this._itemWidth, 10 ),
				i,
				idx,
				$item;

			if ( di > 0 ) {
				for ( i = 0; i < di; i++ ) {
					this._$list.children().last().detach();
					idx = -parseInt( ( sx / this._itemWidth ) + i + 3, 10 );
					$item = this._items[ circularNum( idx, this._items.length ) ];
					this._$list.prepend( $item );
					//console.log( "di > 0 : " + idx );
				}
			} else if ( di < 0 ) {
				for ( i = 0; i > di; i-- ) {
					this._$list.children().first().detach();
					idx = this._itemsPerView - parseInt( ( sx / this._itemWidth ) + i, 10 );
					$item = this._items[ circularNum( idx, this._items.length ) ];
					this._$list.append( $item );
					//console.log( "di < 0 : " + idx );
				}
			}

			this._sx += di * this._itemWidth;

			setElementTransform( this._$view, ( x - this._sx - this._itemWidth ) + "px", 0 );

			//console.log( "rx " + this._rx + "sx " + this._sx );
		},

		_enableTracking: function () {
			$(document).bind( this._dragMoveEvt, this._dragMoveCB );
			$(document).bind( this._dragStopEvt, this._dragStopCB );
		},

		_disableTracking: function () {
			$(document).unbind( this._dragMoveEvt, this._dragMoveCB );
			$(document).unbind( this._dragStopEvt, this._dragStopCB );
		},

		_getScrollHierarchy: function () {
			var svh = [],
				d;
			this._$clip.parents( '.ui-scrollview-clip' ).each( function () {
				d = $( this ).jqmData( 'circulaview' );
				if ( d ) {
					svh.unshift( d );
				}
			} );
			return svh;
		},

		centerTo: function ( selector, duration ) {
			var i,
				newX;

			for ( i = 0; i < this._items.length; i++ ) {
				if ( $( this._items[i]).is( selector ) ) {
					newX = -( i * this._itemWidth - this._clipWidth / 2 + this._itemWidth * 1.5 );
					this.scrollTo( newX + this._itemWidth, 0 );
					this.scrollTo( newX, 0, duration );
					return;
				}
			}
		},

		scrollTo: function ( x, y, duration ) {
			this._stopMScroll();
			if ( !duration ) {
				this._setScrollPosition( x, y );
				this._rx = x;
				return;
			}

			var self = this,
				start = getCurrentTime(),
				efunc = $.easing.easeOutQuad,
				sx = this._rx,
				sy = 0,
				dx = x - sx,
				dy = 0,
				tfunc,
				elapsed,
				ec;

			this._rx = x;

			tfunc = function () {
				elapsed = getCurrentTime() - start;
				if ( elapsed >= duration ) {
					self._timerID = 0;
					self._setScrollPosition( x, y );
					self._$clip.trigger("scrollend");
				} else {
					ec = efunc( elapsed / duration, elapsed, 0, 1, duration );
					self._setScrollPosition( sx + ( dx * ec ), sy + ( dy * ec ) );
					self._timerID = setTimeout( tfunc, self._timerInterval );
				}
			};

			this._timerID = setTimeout( tfunc, this._timerInterval );
		},

		getScrollPosition: function () {
			return { x: -this._rx, y: 0 };
		},

		_handleDragStart: function ( e, ex, ey ) {
			$.each( this._getScrollHierarchy(), function ( i, sv ) {
				sv._stopMScroll();
			} );

			this._stopMScroll();

			if ( this.options.delayedClickEnabled ) {
				this._$clickEle = $( e.target ).closest( this.options.delayedClickSelector );
			}
			this._lastX = ex;
			this._lastY = ey;
			this._speedX = 0;
			this._speedY = 0;
			this._didDrag = false;

			this._lastMove = 0;
			this._enableTracking();

			this._ox = ex;
			this._nx = this._rx;

			if ( this.options.eventType == "mouse" || this.options.delayedClickEnabled ) {
				e.preventDefault();
			}
			//console.log( "scrollstart" + this._rx + "," + this._sx );
			e.stopPropagation();
		},

		_handleDragMove: function ( e, ex, ey ) {
			this._lastMove = getCurrentTime();

			var dx = ex - this._lastX,
				dy = ey - this._lastY;

			this._speedX = dx;
			this._speedY = 0;

			this._didDrag = true;

			this._lastX = ex;
			this._lastY = ey;

			this._mx = ex - this._ox;

			this._setScrollPosition( this._nx + this._mx, 0 );

			//console.log( "scrollmove" + this._rx + "," + this._sx );
			return false;
		},

		_handleDragStop: function ( e ) {
			var l = this._lastMove,
				t = getCurrentTime(),
				doScroll = l && ( t - l ) <= this.options.moveIntervalThreshold,
				sx = ( this._tracker && this._speedX && doScroll ) ? this._speedX : 0,
				sy = 0;

			this._rx = this._mx ? this._nx + this._mx : this._rx;

			if ( sx ) {
				this._startMScroll( sx, sy );
			}

			//console.log( "scrollstop" + this._rx + "," + this._sx );

			this._disableTracking();

			if ( !this._didDrag && this.options.delayedClickEnabled && this._$clickEle.length ) {
				this._$clickEle
					.trigger( "mousedown" )
					.trigger( "mouseup" )
					.trigger( "click" );
			}

			if ( this._didDrag ) {
				e.preventDefault();
				e.stopPropagation();
			}

			return this._didDrag ? false : undefined;
		},

		_addBehaviors: function () {
			var self = this;

			if ( this.options.eventType === "mouse" ) {
				this._dragStartEvt = "mousedown";
				this._dragStartCB = function ( e ) {
					return self._handleDragStart( e, e.clientX, e.clientY );
				};

				this._dragMoveEvt = "mousemove";
				this._dragMoveCB = function ( e ) {
					return self._handleDragMove( e, e.clientX, e.clientY );
				};

				this._dragStopEvt = "mouseup";
				this._dragStopCB = function ( e ) {
					return self._handleDragStop( e );
				};

				this._$view.bind( "vclick", function (e) {
					return !self._didDrag;
				} );

			} else { //touch
				this._dragStartEvt = "touchstart";
				this._dragStartCB = function ( e ) {
					var t = e.originalEvent.targetTouches[0];
					return self._handleDragStart(e, t.pageX, t.pageY );
				};

				this._dragMoveEvt = "touchmove";
				this._dragMoveCB = function ( e ) {
					var t = e.originalEvent.targetTouches[0];
					return self._handleDragMove(e, t.pageX, t.pageY );
				};

				this._dragStopEvt = "touchend";
				this._dragStopCB = function ( e ) {
					return self._handleDragStop( e );
				};
			}
			this._$view.bind( this._dragStartEvt, this._dragStartCB );
		}
	} );

	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.mobile.circularview.prototype.options.initSelector, e.target ).circularview();
	} );

}( jQuery, window, document ) ); // End Component


/*
* Module Name : widgets/jquery.mobile.tizen.fastscroll
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

// fastscroll is a scrollview controller, which binds
// a scrollview to a a list of short cuts; the shortcuts are built
// from the text on dividers in the list. Clicking on a shortcut
// instantaneously jumps the scrollview to the selected list divider;
// mouse movements on the shortcut column move the scrollview to the
// list divider matching the text currently under the touch; a popup
// with the text currently under the touch is also displayed.
//
// To apply, add the attribute data-fastscroll="true" to a listview
// (a <ul> or <ol> element inside a page). Alternatively, call
// fastscroll() on an element.
//
// The closest element with class ui-scrollview-clip is used as the
// scrollview to be controlled.
//
// If a listview has no dividers or a single divider, the widget won't
// display.

/**
	@class fastscroll
	The shortcut scroll widget shows a shortcut list that is bound to its parent scroll bar and respective list view. This widget is displayed as a text pop-up representing shortcuts to different list dividers in the list view. If you select a shortcut text from the shortcut scroll, the parent list view is moved to the location representing the selected shortcut.

	To add a shortcut scroll widget to the application, use the following code:

		<div class="content" data-role="content" data-scroll="y">
			<ul id="contacts" data-role="listview" data-fastscroll="true">
				<li>Anton</li>
			</ul>
		</div>

	For the shortcut scroll widget to be visible, the parent list view must have multiple list dividers.
*/

/**
	@property {Boolean}  data-fastscroll
	When set to true, creates a shortcut scroll using the HTML unordered list (&lt;ul&gt;) element.
*/
/**
	@method fastscroll
	The shortcut scroll is created for the closest list view with the ui-scrollview-clip class.
*/
/**
	@method indexString
	The indexString method is used to get (if no value is defined) or set the string to present the index.

		<div class="content" data-role="content" data-scroll="y">
			ul id="contacts" data-role="listview" data-fastscroll="true">
				<li data-role="list-divider">A</li>
				<li>Anton</li>
			</ul>
		</div>

		$(".selector").fastscroll( "indexString" [, indexAlphabet] );
*/
(function ( $, undefined ) {

	$.widget( "tizen.fastscroll", $.mobile.widget, {
		options: {
			initSelector: ":jqmData(fastscroll)"
		},

		_primaryLanguage: null,
		_secondLanguage: null,
		_dividerMap: {},
		_charSet: null,

		_create: function () {
			var $el = this.element,
				self = this,
				$popup,
				page = $el.closest( ':jqmData(role="page")' ),
				jumpToDivider;

			this.scrollview = $el.addClass( 'ui-fastscroll-target' ).closest( '.ui-scrollview-clip' );
			this.shortcutsContainer = $( '<div class="ui-fastscroll" aria-label="Fast scroll bar, double tap to fast scroll mode" tabindex="0"/>' );
			this.shortcutsList = $( '<ul aria-hidden="true"></ul>' );

			// popup for the hovering character
			this.scrollview.append($( '<div class="ui-fastscroll-popup"></div>' ) );
			$popup = this.scrollview.find( '.ui-fastscroll-popup' );

			this.shortcutsContainer.append( this.shortcutsList );
			this.scrollview.append( this.shortcutsContainer );

			// find the bottom of the last item in the listview
			this.lastListItem = $el.children().last();

			// remove scrollbars from scrollview
			this.scrollview.find( '.ui-scrollbar' ).hide();

			this.jumpToDivider = function ( divider ) {
				// get the vertical position of the divider (so we can scroll to it)
				var dividerY = $( divider ).position().top,
					// find the bottom of the last list item
					bottomOffset = self.lastListItem.outerHeight( true ) + self.lastListItem.position().top,
					scrollviewHeight = self.scrollview.height(),

				// check that after the candidate scroll, the bottom of the
				// last item will still be at the bottom of the scroll view
				// and not some way up the page
					maxScroll = bottomOffset - scrollviewHeight,
					dstOffset;

				dividerY = ( dividerY > maxScroll ? maxScroll : dividerY );

				// don't apply a negative scroll, as this means the
				// divider should already be visible
				dividerY = Math.max( dividerY, 0 );

				// apply the scroll
				self.scrollview.scrollview( 'scrollTo', 0, -dividerY );

				dstOffset = self.scrollview.offset();
			};

			this.shortcutsList
			// bind mouse over so it moves the scroller to the divider
				.bind( 'touchstart mousedown vmousedown touchmove vmousemove vmouseover', function ( e ) {
					// Get coords relative to the element
					var coords = $.mobile.tizen.targetRelativeCoordsFromEvent( e ),
						shortcutsListOffset = self.shortcutsList.offset();

					self.shortcutsContainer.addClass( "ui-fastscroll-hover" );

					// If the element is a list item, get coordinates relative to the shortcuts list
					if ( e.target.tagName.toLowerCase() === "li" ) {
						coords.x += $( e.target ).offset().left - shortcutsListOffset.left;
						coords.y += $( e.target ).offset().top  - shortcutsListOffset.top;
					}

					if ( e.target.tagName.toLowerCase() === "span" ) {
						coords.x += $( e.target ).parent().offset().left - shortcutsListOffset.left;
						coords.y += $( e.target ).parent().offset().top  - shortcutsListOffset.top;
					}

					self.shortcutsList.find( 'li' ).each( function () {
						var listItem = $( this );
						$( listItem )
							.removeClass( "ui-fastscroll-hover" )
							.removeClass( "ui-fastscroll-hover-down" );
					});
					// Hit test each list item
					self.shortcutsList.find( 'li' ).each( function () {
						var listItem = $( this ),
							l = listItem.offset().left - shortcutsListOffset.left,
							t = listItem.offset().top  - shortcutsListOffset.top,
							r = l + Math.abs(listItem.outerWidth( true ) ),
							b = t + Math.abs(listItem.outerHeight( true ) ),
							unit,
							baseTop,
							baseBottom,
							omitSet,
							i;

						if ( coords.x >= l && coords.x <= r && coords.y >= t && coords.y <= b ) {
							if ( listItem.text() !== "." ) {
								self._hitItem( listItem );
							} else {
								omitSet = listItem.data( "omitSet" );
								unit = ( b - t ) / omitSet.length;
								for ( i = 0; i < omitSet.length; i++ ) {
									baseTop = t + ( i * unit );
									baseBottom = baseTop + unit;
									if ( coords.y >= baseTop && coords.y <= baseBottom ) {
										self._hitOmitItem( listItem, omitSet.charAt( i ) );
									}
								}
							}
							return false;
						}
						return true;
					} );

					e.preventDefault();
					e.stopPropagation();
				} )
				// bind mouseout of the fastscroll container to remove popup
				.bind( 'touchend mouseup vmouseup vmouseout', function () {
					$popup.hide();
					$( ".ui-fastscroll-hover" ).removeClass( "ui-fastscroll-hover" );
					$( ".ui-fastscroll-hover-first-item" ).removeClass( "ui-fastscroll-hover-first-item" );
					$( ".ui-fastscroll-hover-down" ).removeClass( "ui-fastscroll-hover-down" );
					self.shortcutsContainer.removeClass( "ui-fastscroll-hover" );
				} );

			if ( page && !( page.is( ':visible' ) ) ) {
				page.bind( 'pageshow', function () { self.refresh(); } );
			} else {
				self.refresh();
			}

			// refresh the list when dividers are filtered out
			$el.bind( 'updatelayout', function () {
				self.refresh();
			} );
		},

		_findClosestDivider: function ( targetChar ) {
			var i,
				dividerMap = this._dividerMap,
				charSet = this._charSet,
				charSetLen = charSet.length,
				targetIdx = charSet.indexOf( targetChar ),
				lastDivider,
				subDivider = null;

			for ( i = 0; i < targetIdx; ++i ) {
				lastDivider = dividerMap[ charSet.charAt( i ) ];
				if ( lastDivider !== undefined ) {
					subDivider = lastDivider;
				}
			}
			if ( !subDivider ) {
				for ( ++i; i < charSetLen; ++i ) {
					lastDivider = dividerMap[ charSet.charAt( i ) ];
					if ( lastDivider !== undefined ) {
						subDivider = lastDivider;
						break;
					}
				}
			}
			return subDivider;
		},

		_hitOmitItem: function ( listItem, text ) {
			var $popup = this.scrollview.find( '.ui-fastscroll-popup' ),
				divider;

			divider = this._dividerMap[ text ] || this._findClosestDivider( text );
			if ( typeof divider !== "undefined" ) {
				this.jumpToDivider( $( divider ) );
			}

			$popup.text( text ).show();

			$( listItem ).addClass( "ui-fastscroll-hover" );
			if ( listItem.index() === 0 ) {
				$( listItem ).addClass( "ui-fastscroll-hover-first-item" );
			}
			$( listItem ).siblings().eq( listItem.index() ).addClass( "ui-fastscroll-hover-down" );
		},

		_hitItem: function ( listItem  ) {
			var $popup = this.scrollview.find( '.ui-fastscroll-popup' ),
				text = listItem.text(),
				divider;

			if ( text === "#" ) {
				divider = this._dividerMap.number;
			} else {
				divider = this._dividerMap[ text ] || this._findClosestDivider( text );
			}

			if ( typeof divider !== "undefined" ) {
				this.jumpToDivider( $( divider ) );
			}

			$popup.text( text ).show();

			$( listItem ).addClass( "ui-fastscroll-hover" );
			if ( listItem.index() === 0 ) {
				$( listItem ).addClass( "ui-fastscroll-hover-first-item" );
			}
			$( listItem ).siblings().eq( listItem.index() ).addClass( "ui-fastscroll-hover-down" );
		},

		_focusItem: function ( listItem ) {
			var self = this,
				$popup = self.scrollview.find( '.ui-fastscroll-popup' );

			listItem.focusin( function ( e ) {
				self.shortcutsList.attr( "aria-hidden", false );
				self._hitItem( listItem );
			}).focusout( function ( e ) {
				self.shortcutsList.attr( "aria-hidden", true );
				$popup.hide();
				$( ".ui-fastscroll-hover" ).removeClass( "ui-fastscroll-hover" );
				$( ".ui-fastscroll-hover-first-item" ).removeClass( "ui-fastscroll-hover-first-item" );
				$( ".ui-fastscroll-hover-down" ).removeClass( "ui-fastscroll-hover-down" );
			});
		},

		_contentHeight: function () {
			var self = this,
				$content = $( '.ui-scrollview-clip' ),
				header = null,
				footer = null,
				paddingValue = 0,
				clipSize = $( window ).height();

			if ( $content.hasClass( "ui-content" ) ) {
				paddingValue = parseInt( $content.css( "padding-top" ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
				paddingValue = parseInt( $content.css( "padding-bottom" ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
				header = $content.siblings( ".ui-header:visible" );
				footer = $content.siblings( ".ui-footer:visible" );

				if ( header ) {
					if ( header.outerHeight( true ) === null ) {
						clipSize = clipSize - ( $( ".ui-header" ).outerHeight() || 0 );
					} else {
						clipSize = clipSize - header.outerHeight( true );
					}
				}
				if ( footer ) {
					clipSize = clipSize - footer.outerHeight( true );
				}
			} else {
				clipSize = $content.height();
			}
			return clipSize;
		},

		_omit: function ( numOfItems, maxNumOfItems ) {
			var maxGroupNum = parseInt( ( maxNumOfItems - 1 ) / 2, 10 ),
				numOfExtraItems = numOfItems - maxNumOfItems,
				groupPos = [],
				omitInfo = [],
				groupPosLength,
				group,
				size,
				i;

			if ( ( maxNumOfItems < 3 ) || ( numOfItems <= maxNumOfItems ) ) {
				return;
			}

			if ( numOfExtraItems >= maxGroupNum ) {
				size = 2;
				group = 1;
				groupPosLength = maxGroupNum;
			} else {
				size = maxNumOfItems / ( numOfExtraItems + 1 );
				group = size;
				groupPosLength = numOfExtraItems;
			}

			for ( i = 0; i < groupPosLength; i++ ) {
				groupPos.push( parseInt( group, 10 ) );
				group += size;
			}

			for ( i = 0; i < maxNumOfItems; i++ ) {
				omitInfo.push( 1 );
			}

			for ( i = 0; i < numOfExtraItems; i++ ) {
				omitInfo[ groupPos[ i % maxGroupNum ] ]++;
			}

			return omitInfo;
		},

		_createDividerMap: function () {
			var primaryCharacterSet = this._primaryLanguage ? this._primaryLanguage.replace( /,/g, "" ) : null,
				secondCharacterSet = this._secondLanguage ? this._secondLanguage.replace( /,/g, "" ) : null,
				numberSet = "0123456789",
				dividers = this.element.find( '.ui-li-divider' ),
				map = {},
				matchToDivider,
				makeCharacterSet,
				indexChar,
				i;

			matchToDivider = function ( index, divider ) {
				if ( $( divider ).text() === indexChar ) {
					map[ indexChar ] = divider;
				}
			};

			makeCharacterSet = function ( index, divider ) {
				primaryCharacterSet += $( divider ).text();
			};

			if ( primaryCharacterSet === null ) {
				primaryCharacterSet = "";
				dividers.each( makeCharacterSet );
			}

			for ( i = 0; i < primaryCharacterSet.length; i++ ) {
				indexChar = primaryCharacterSet.charAt( i );
				dividers.each( matchToDivider );
			}

			if ( secondCharacterSet !== null ) {
				for ( i = 0; i < secondCharacterSet.length; i++ ) {
					indexChar = secondCharacterSet.charAt( i );
					dividers.each( matchToDivider );
				}
			}

			dividers.each( function ( index, divider ) {
				if ( numberSet.search( $( divider ).text() ) !== -1  ) {
					map.number = divider;
					return false;
				}
			});

			this._dividerMap = map;
			this._charSet = primaryCharacterSet + secondCharacterSet;
		},

		indexString: function ( indexAlphabet ) {
			var self = this,
				characterSet = [];

			if ( typeof indexAlphabet === "undefined" ) {
				return self._primaryLanguage + ":" + self._secondLanguage;
			}

			characterSet = indexAlphabet.split( ":" );
			self._primaryLanguage = characterSet[ 0 ];
			if ( characterSet.length === 2 ) {
				self._secondLanguage = characterSet[ 1 ];
			}
		},

		refresh: function () {
			var self = this,
				primaryCharacterSet = self._primaryLanguage ? self._primaryLanguage.replace( /,/g, "" ) : null,
				secondCharacterSet = self._secondLanguage ? self._secondLanguage.replace( /,/g, "" ) : null,
				contentHeight = self._contentHeight(),
				shapItem = $( '<li tabindex="0" aria-label="double to move Number list"><span aria-hidden="true">#</span><span aria-label="Number"/></li>' ),
				$popup = this.scrollview.find( '.ui-fastscroll-popup' ),
				omitIndex = 0,
				makeCharacterSet,
				makeOmitSet,
				itemHandler,
				containerHeight,
				shortcutsItems,
				shortcutItem,
				shortcutsTop,
				minClipHeight,
				maxNumOfItems,
				numOfItems,
				minHeight,
				omitInfo,
				dividers,
				listItems,
				emptySize,
				correction,
				indexChar,
				lastIndex,
				seconds,
				height,
				size,
				i;

			makeCharacterSet = function ( index, divider ) {
				primaryCharacterSet += $( divider ).text();
			};

			makeOmitSet = function ( index, length ) {
				var count,
					omitSet = "";

				for ( count = 0; count < length; count++ ) {
					omitSet += primaryCharacterSet[ index + count ];
				}

				return omitSet;
			};

			self._createDividerMap();

			self.shortcutsList.find( 'li' ).remove();

			// get all the dividers from the list and turn them into shortcuts
			dividers = self.element.find( '.ui-li-divider' );

			// get all the list items
			listItems = self.element.find('li').not('.ui-li-divider');

			// only use visible dividers
			dividers = dividers.filter( ':visible' );
			listItems = listItems.filter( ':visible' );

			if ( dividers.length < 2 ) {
				self.shortcutsList.hide();
				return;
			}

			self.shortcutsList.show();
			self.lastListItem = listItems.last();
			self.shortcutsList.append( shapItem );
			self._focusItem( shapItem );

			if ( primaryCharacterSet === null ) {
				primaryCharacterSet = "";
				dividers.each( makeCharacterSet );
			}

			minHeight = shapItem.outerHeight( true );
			maxNumOfItems = parseInt( contentHeight / minHeight - 1, 10 );
			numOfItems = primaryCharacterSet.length;

			maxNumOfItems = secondCharacterSet ? maxNumOfItems - 2 : maxNumOfItems;

			if ( maxNumOfItems < 3 ) {
				shapItem.remove();
				return;
			}

			omitInfo = self._omit( numOfItems, maxNumOfItems );

			for ( i = 0; i < primaryCharacterSet.length; i++ ) {
				indexChar = primaryCharacterSet.charAt( i );
				shortcutItem = $( '<li tabindex="0" aria-label="double to move ' + indexChar + ' list">' + indexChar + '</li>' );

				self._focusItem( shortcutItem );

				if ( typeof omitInfo !== "undefined" && omitInfo[ omitIndex ] > 1 ) {
					shortcutItem = $( '<li>.</li>' );
					shortcutItem.data( "omitSet",  makeOmitSet( i, omitInfo[ omitIndex ] ) );
					i += omitInfo[ omitIndex ] - 1;
				}

				self.shortcutsList.append( shortcutItem );
				omitIndex++;
			}

			if ( secondCharacterSet !== null ) {
				lastIndex = secondCharacterSet.length - 1;
				seconds = [];

				seconds.push( secondCharacterSet.charAt( 0 ) );
				seconds.push( secondCharacterSet.charAt( lastIndex ) );

				for ( i = 0; i < seconds.length; i++ ) {
					indexChar = seconds[ i ];
					shortcutItem = $( '<li tabindex="0" aria-label="double to move ' + indexChar + ' list">' + indexChar + '</li>' );

					self._focusItem( shortcutItem );
					shortcutItem.bind( 'vclick', itemHandler );
					self.shortcutsList.append( shortcutItem );
				}
			}

			containerHeight = self.shortcutsContainer.outerHeight( true );
			emptySize = contentHeight - containerHeight;
			shortcutsItems = self.shortcutsList.children();
			size = parseInt( emptySize / shortcutsItems.length, 10 );
			correction = emptySize - ( shortcutsItems.length * size );

			if ( emptySize > 0 ) {
				shortcutsItems.each( function ( index, item ) {
					height = $( item ).height() + size;
					if ( correction !== 0 ) {
						height += 1;
						correction -= 1;
					}
					$( item ).css( {
						height: height,
						lineHeight: height + "px"
					} );
				} );
			}

			// position the shortcut flush with the top of the first list divider
			shortcutsTop = dividers.first().position().top;
			self.shortcutsContainer.css( 'top', shortcutsTop );

			// make the scrollview clip tall enough to show the whole of the shortcutslist
			minClipHeight = shortcutsTop + self.shortcutsContainer.outerHeight() + 'px';
			self.scrollview.css( 'min-height', minClipHeight );

			$popup.text( "M" ) // Popup size is determined based on "M".
				.width( $popup.height() )
				.css( { marginLeft: -( $popup.outerWidth() / 2 ),
					marginTop: -( $popup.outerHeight() / 2 ) } );
		}
	} );

	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.fastscroll.prototype.options.initSelector, e.target )
			.not( ":jqmData(role='none'), :jqmData(role='nojs')" )
			.fastscroll();
	} );

	$( window ).bind( "resize orientationchange", function ( e ) {
		$( ".ui-page-active .ui-fastscroll-target" ).fastscroll( "refresh" );
	} );
} ( jQuery ) );


/*
* Module Name : util/ensurens
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

// Ensure that the given namespace is defined. If not, define it to be an empty object.
// This is kinda like the mkdir -p command.
(function (window) {
		window.ensureNS = (function () {
		var internalCache = {};
		return function ensureNS (ns) { // name just for debugging purposes
			var nsArr = ns.split(".").reverse(),
				nsSoFar = "",
				buffer = "",
				leaf = "",
				l = nsArr.length;
			while(--l >= 0) {
				leaf = nsArr[l];
				nsSoFar = nsSoFar + (nsSoFar.length > 0 ? "." : "") + leaf;
				if (!internalCache[nsSoFar]) {
					internalCache[nsSoFar] = true;
					buffer += "!window." + nsSoFar + ' && (window.' + nsSoFar + " = {});\n";
				}
			}
			buffer.length && (new Function(buffer))();
		};
	})();
})(this);


/*
* Module Name : util/range
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

function range( low, high, step ) {
    // Create an array containing the range of integers or characters
    // from low to high (inclusive)  
    // 
    // version: 1107.2516
    // discuss at: http://phpjs.org/functions/range
    // +   original by: Waldo Malqui Silva
    // *     example 1: range ( 0, 12 );
    // *     returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    // *     example 2: range( 0, 100, 10 );
    // *     returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    // *     example 3: range( 'a', 'i' );
    // *     returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    // *     example 4: range( 'c', 'a' );
    // *     returns 4: ['c', 'b', 'a']
	var matrix = [],
		inival,
		endval,
		plus,
		walker = step || 1,
		chars = false;

    if (!isNaN(low) && !isNaN(high)) {
        inival = low;
        endval = high;
    } else if (isNaN(low) && isNaN(high)) {
        chars = true;
        inival = low.charCodeAt(0);
        endval = high.charCodeAt(0);
    } else {
        inival = (isNaN(low) ? 0 : low);
        endval = (isNaN(high) ? 0 : high);
    }

    plus = ((inival > endval) ? false : true);
    if (plus) {
        while (inival <= endval) {
            matrix.push(((chars) ? String.fromCharCode(inival) : inival));
            inival += walker;
        }
    } else {
        while (inival >= endval) {
            matrix.push(((chars) ? String.fromCharCode(inival) : inival));
            inival -= walker;
        }
    }

    return matrix;
}


/*
* Module Name : widgets/components/webgl
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

( function ( $, undefined ) {
	$.webgl = {};

	$.webgl.shader = {
		_vertexShader: null,
		_fragmentShader: null,

		deleteShaders: function ( gl ) {
			gl.deleteShader( this._vertexShader );
			gl.deleteShader( this._fragmentShader );
		},

		addShaderProgram : function ( gl, vs, fs, isFile ) {
			var shaderProgram,
				vertexShaderSource = {},
				fragmentShaderSource = {};

			if ( isFile ) {
				vertexShaderSource = this.loadShaderFile( vs );
				fragmentShaderSource = this.loadShaderFile( fs );
			} else {
				vertexShaderSource.source = vs;
				fragmentShaderSource.source = fs;
			}

			this._vertexShader = this.getShader( gl, gl.VERTEX_SHADER, vertexShaderSource );
			this._fragmentShader = this.getShader( gl, gl.FRAGMENT_SHADER, fragmentShaderSource );

			shaderProgram = gl.createProgram();
			gl.attachShader( shaderProgram, this._vertexShader);
			gl.attachShader( shaderProgram, this._fragmentShader);
			gl.linkProgram( shaderProgram );

			if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
				window.alert( "Could not initialize Shaders!" );
			}
			return shaderProgram;
		},

		loadShaderFile : function ( path ) {
			var cache = null;
			$.ajax({
				async : false,
				url : path,
				success : function ( result ) {
					cache = {
						source: result
					};
				}
			});
			return cache;
		},

		getShader: function ( gl, type, script ) {
			var shader;

			if ( !gl || !type || !script ) {
				return null;
			}

			shader = gl.createShader( type );

			gl.shaderSource( shader, script.source );
			gl.compileShader( shader );

			if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
				window.alert( gl.getShaderInfoLog( shader ) );
				gl.deleteShader( shader );
				return null;
			}
			return shader;
		}
	};

	$.webgl.buffer = {
		attribBufferData: function ( gl, attribArray ) {
			var attribBuffer = gl.createBuffer();

			gl.bindBuffer( gl.ARRAY_BUFFER, attribBuffer );
			gl.bufferData( gl.ARRAY_BUFFER, attribArray, gl.STATIC_DRAW );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );

			return attribBuffer;
		}
	};

} ( jQuery ) );


/*
* Module Name : jquery.mobile.tizen.pinch
* Copyright (c) 2013 Samsung Electronics Co., Ltd.
* License : Flora License
*/	
/*
 * Pinch Event
 *
 * Events
 *	pinchstart: triggered when start the touched two points
 *	pinch: triggered when move the touch point after pinchstart event occured
 *	pinchend: triggered when touchend event after pinchstart event occured
 *
 * Parameters
 *	point: touched points
 *	ratio: origin point-to-current point ratio for moving distance
 *
 *	$("#pinch").bind("pinch", function (e, p) {
 *		console.log("point[0].x: " + p.point[0].x);
 *		console.log("point[0].y: " + p.point[0].y);
 *		console.log("point[1].x: " + p.point[1].x);
 *		console.log("point[1].y: " + p.point[1].y);
 *		console.log("ratio: " + p.ratio);
 *	});
 *
 * Options
 *	$.mobile.pinch.enabled: true or false
 *	$.mobile.pinch.min: minimum value of ratio
 *	$.mobile.pinch.max: maximum value of ratio
 *	$.mobile.pinch.factor: scale factor of ratio
 *	$.mobile.pinch.threshold: move threshold of ratio
 *	$.mobile.pinch.interval: interval for pinch event
 */


( function ( $, undefined ) {

	var pinch_event = {
		setup: function () {
			var thisObject = this,
				$this = $( thisObject );

			if ( !$.mobile.support.touch ) {
				return;
			}

			function getSize( point ) {
				var x = point[0].x - point[1].x,
					y = point[0].y - point[1].y;

				return Math.abs( x * y );
			}

			function getParameter( point, ratio ) {
				return { point: point, ratio: ratio };
			}

			$this.bind( "touchstart", function ( event ) {
				var data = event.originalEvent.touches,
					origin,
					last_ratio = 1,
					processing = false,
					current;

				if ( !$.mobile.pinch.enabled ) {
					return;
				}

				if ( data.length != 2 ) {
					return;
				}

				origin = [
					{ x: data[0].pageX, y: data[0].pageY },
					{ x: data[1].pageX, y: data[1].pageY }
				];

				$( event.target ).trigger( "pinchstart", getParameter( origin, undefined ) );

				function pinchHandler( event ) {
					var data = event.originalEvent.touches,
						ratio,
						delta;

					if ( processing ) {
						return;
					}

					if ( !origin ) {
						return;
					}

					current = [
						{ x: data[0].pageX, y: data[0].pageY },
						{ x: data[1].pageX, y: data[1].pageY }
					];

					delta = Math.sqrt( getSize( current ) / getSize( origin )  ) ;
					if ( delta ) {
						ratio = delta;
					}

					if ( ratio < $.mobile.pinch.min ) {
						ratio = $.mobile.pinch.min;
					} else if ( ratio > $.mobile.pinch.max ) {
						ratio = $.mobile.pinch.max;
					}

					if ( Math.abs( ratio - last_ratio ) < $.mobile.pinch.threshold ) {
						return;
					}

					$( event.target ).trigger( "pinch", getParameter( current, ratio ) );

					last_ratio = ratio;

					if ( $.mobile.pinch.interval ) {
						processing = true;

						setTimeout( function () {
							processing = false;
						}, $.mobile.pinch.interval );
					}
				}

				$this.bind( "touchmove", pinchHandler )
					.one( "touchend", function ( event ) {
						$this.unbind( "touchmove", pinchHandler );
						$( event.target ).trigger( "pinchend",
									getParameter( undefined, last_ratio ) );

						origin = undefined;
						current = undefined;
						last_ratio = 1;
						processing = false;
					});
			});
		}
	};

	$.event.special.pinch = pinch_event;

	$.mobile.pinch = {
		enabled: true,
		min: 0.1,
		max: 3,
		factor: 4,
		threshold: 0.01,
		interval: 50
	};

}( jQuery, this ) );


/*
* Module Name : widgets/components/imageloader
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

( function ( $, window, document, undefined ) {
	var _canvas = document.createElement( 'canvas' ),
		_context = _canvas.getContext( '2d' );

	function fileSystemErrorMessage( e ) {
		var FileError = window.FileError,
			msg = '';
		switch ( e.code ) {
		case FileError.QUOTA_EXCEEDED_ERR:
			msg = 'QUOTA_EXCEEDED_ERR';
			break;
		case FileError.NOT_FOUND_ERR:
			msg = 'NOT_FOUND_ERR';
			break;
		case FileError.SECURITY_ERR:
			msg = 'SECURITY_ERR';
			break;
		case FileError.INVALID_MODIFICATION_ERR:
			msg = 'INVALID_MODIFICATION_ERR';
			break;
		case FileError.INVALID_STATE_ERR:
			msg = 'INVALID_STATE_ERR';
			break;
		default:
			msg = 'Unknown Error';
			break;
		}
		return msg;
	}

	function getInternalURLFromURL( url ) {
		var internalURL = url.replace( /\//gi, "_" );
		return internalURL;
	}

	function resize( imagewidth, imageheight, thumbwidth, thumbheight, fit ) {
		var w = 0, h = 0, x = 0, y = 0,
			widthratio = imagewidth / thumbwidth,
			heightratio = imageheight / thumbheight,
			maxratio = Math.max( widthratio, heightratio );

		if ( fit ) {
			w = thumbwidth;
			h = thumbheight;
		} else {
			if ( maxratio > 1 ) {
				w = imagewidth / maxratio;
				h = imageheight / maxratio;
			} else {
				w = imagewidth;
				h = imageheight;
			}
			x = ( thumbwidth - w ) / 2;
			y = ( thumbheight - h ) / 2;
		}

		return { w: w, h: h, x: x, y: y };
	}

	function getThumbnail( img, thumbwidth, thumbheight, fit ) {
		var dimensions, url;
		_canvas.width = thumbwidth;
		_canvas.height = thumbheight;
		dimensions = resize( img.width, img.height, thumbwidth, thumbheight, fit );
		_context.fillStyle = "#000000";
		_context.fillRect ( 0, 0, thumbwidth, thumbheight );
		_context.drawImage( img, dimensions.x, dimensions.y, dimensions.w, dimensions.h );
		url = _canvas.toDataURL();
		return url;
	}

	$.imageloader = {
		_grantedBytes: 1024 * 1024,
		getThumbnail: function ( url, _callback ) {
			var internalURL, canvasDataURI;
			function errorHandler( e ) {
				var msg = fileSystemErrorMessage( e );
				if ( _callback ) {
					_callback( ( msg === "NOT_FOUND_ERR" ) ? msg : null );
				}
			}

			internalURL = getInternalURLFromURL( url );
			try {
				canvasDataURI = localStorage.getItem( internalURL );
				if ( _callback ) {
					_callback( ( canvasDataURI === null ) ? "NOT_FOUND_ERR" : canvasDataURI );
				}
			} catch ( e ) {
				if ( _callback ) {
					_callback( ( e.type === "non_object_property_load" ) ? "NOT_FOUND_ERR" : null );
				}
			}
		},

		setThumbnail: function ( url, _callback, thumbWidth, thumbHeight, fit ) {
			var image, internalURL, canvasDataURI;
			function errorHandler( e ) {
				var msg = fileSystemErrorMessage( e );
				if ( _callback ) {
					_callback( ( msg === "NOT_FOUND_ERR" ) ? msg : null );
				}
			}

			thumbWidth = thumbWidth || 128;
			thumbHeight = thumbHeight || 128;
			fit = fit || true;
			image = new Image();
			image.onload = function () {
				internalURL = getInternalURLFromURL( url );
				canvasDataURI = getThumbnail( this, thumbWidth, thumbHeight, fit );
				try {
					localStorage.setItem( internalURL, canvasDataURI );
					if ( _callback ) {
						_callback( canvasDataURI );
					}
				} catch ( e ) {
					if ( _callback ) {
						_callback( ( e.type === "non_object_property_load" ) ? "NOT_FOUND_ERR" : null );
					}
				}
			};
			image.src = url;
		},

		removeThumbnail: function ( url ) {
			var internalURL;
			function errorHandler( e ) {
				fileSystemErrorMessage( e );
			}

			internalURL = getInternalURLFromURL( url );
			try {
				localStorage.removeItem( internalURL );
			} catch ( e ) {
				throw e;
			}
		}
	};

} ( jQuery, window, document ) );


/*
* Module Name : widgets/jquery.mobile.tizen.splitview
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 *  Splitview is a widget which can show different HTML contents at the same time on each divided pane.
 *  A user can place Splitview controls on JQuery Mobile's Content area and arrange two panes on the widget.
 *  And HTML fragments or another Splitview also can be placed on the pane.
 *  The number of panes inside of Splitview is restricted as two.
 *  If a user define only one pane in Splitview, a empty pane will be added automatically,
 *  on the other hand, if 3 or more panes are defined in Splitview, the panes after two will be ignored and removed from the DOM tree.
 *  The HTML fragments of a pane should be composed of elements describing a part of Web page (e.g. <div>...</div>).
 *  Also widgets can be included in the HTML fragments.
 *
 *  HTML Attributes:
 *
 *      data-fixed : The resizing mode of panes - fixed and flexible mode.
 *              If the value is true, the panes' sizes will be fixed, or if not, it will be flexible. (Default : false)
 *      data-divider-vertical : The direction of dividers.
 *              If the value is true, the panes will be placed in horizontal direction,
 *              or if not, it will be placed in vertical direction. (Default : "true")
 *      data-ratio : The ratio of two panes' widths or heights. (Default : [ 1/2, 1/2 ]
 *
 *  APIs:
 *
 *      pane ( id [ , element ] )
 *          : This method replaces child contents of a pane indicated by id attribute with contents of inputted element.
 *            If second argument is not specified, it will act as a getter method.
 *            The string of id has to be started with "#" which means "id" of CSS selectors.
 *      maximize ( id )
 *          : This method maximizes a pane's size indicated by id.
 *            The string of id has to be started with "#" which means "id" of CSS selectors.
 *      restore ()
 *          : This method restores all panes' sizes to the ratio prior to maximization.
 *
 *  Examples:
 *
 *      <div data-role="splitview" data-fixed="false" data-divider-vertical="true" data-ratio="0.5, 0.5">
 *          <div class="ui-pane">pane0</div>
 *          <div class="ui-pane">pane1</div>
 *      </div>
 *
 */


/**
	@class Splitview
	Splitview widget enables a user to place and arrange several panes. Each divided pane can show repective HTML contents.

	To add a Splitview widget to the application, use the following code:

		<div data-role="splitview" data-fixed="false" data-divider-vertical="true" data-ratio="0.5, 0.5">
			<div class="ui-pane">pane0</div>
			<div class="ui-pane">pane1</div>
		</div>
*/

/**
	@property {Boolean} data-fixed
	The resizing mode of panes - fixed and flexible mode.
*/

/**
	@property {Boolean} data-divider-vertical
	The direction of dividers - horizontal or vertical.
 */

/**
	@property {Array} data-ratio
	The ratio of two panes' widths or heights.
*/

/**
	@method pane
	This method replaces child contents of a pane indicated by id attribute with contents of inputted element.
	If second argument is not specified, it will act as a getter method.

		<div data-role="splitview">
			<div class="ui-pane" id="pane0">pane0</div>
			<div class="ui-pane" id="pane1">pane1</div>
		</div>
		$(".selector").splitview("pane", id, element);
*/

/**
	@method maximize
	This method maximizes a pane's size indicated by id.

		<div data-role="splitview">
			<div class="ui-pane" id="pane0">pane0</div>
			<div class="ui-pane" id="pane1">pane1</div>
		</div>
		$(".selector").splitview("maximize", id);
*/

/**
	@method restore
	This method restores all panes' sizes to the ratio prior to maximization.

		<div data-role="splitview">
			<div class="ui-pane" id="pane0">pane0</div>
			<div class="ui-pane" id="pane1">pane1</div>
		</div>
		$(".selector").splitview("restore");
*/

( function ( $, window, document, undefined ) {
	$.widget( "tizen.splitview", $.mobile.widget, {
		options : {
			fixed : false,
			dividerVertical : true,
			ratio : [],
			initSelector : ":jqmData(role='splitview')"
		},

		_create : function () {
			var self = this,
				$el = self.element,
				opt = self.options,
				$panes = $el.children( ".ui-pane" ),
				panesLength = $panes.length,
				spliters = [],
				spliterBars = [],
				ratioAttr = this.element.attr( "data-ratio" ),
				containerSize = [ 0, 0 ],
				resizeTimer = null,
				i = 0;

			if ( panesLength !== 2 ) {
				if ( panesLength < 2 ) {
					for ( i = panesLength ; i < 2 ; ++i ) {
						self._addEmptyPanes();
					}
				} else {
					$panes.slice( 2 ).remove();
				}

				$panes = $el.children( ".ui-pane" );
				panesLength = $panes.length;
			}

			spliters[ 0 ] = $( "<a href='#' class='ui-spliter' aria-label='Drag scroll, double tap and move to adjust split area'></a>" ).insertAfter( $panes[ 0 ] );
			spliterBars[ 0 ] = $( "<div class='ui-spliter-bar'></div>" ).appendTo( spliters[ 0 ] );
			$( "<div class='ui-spliter-handle'></div>" ).appendTo( spliterBars[ 0 ] );

			$.extend( this, {
				moveTarget : null,
				moveData : {},
				spliters : spliters,
				spliterBars : spliterBars,
				panes : $panes,
				containerSize : containerSize,
				touchStatus : false,
				minPaneWidth : 50,
				savedRatio : []
			});

			self._bindTouchEvents();
			self._convertRatio( ratioAttr, $panes.length );

			$el.addClass( "ui-splitview ui-direction-" + self._direction( opt.dividerVertical ) );

			self._refresh();

			$( window ).unbind( ".splitview" )
				.bind( "pagechange.splitview resize.splitview", function ( event ) {
					$( ".ui-page-active .ui-splitview" ).each( function () {
						$( this ).data( "splitview" )._refresh();
					});
				});
		},

		_addEmptyPanes : function () {
			var self = this,
				$el = self.element,
				opt = self.options,
				$panes = $el.children( ".ui-pane" ),
				scrollAttribute = ( $.support.scrollview ) ? "data-scroll='y'" : "",
				pane = $( "<div class='ui-pane' " + scrollAttribute + "></div>" );

			if ( scrollAttribute.length ) {
				pane.scrollview( { direction: "y" } );
			}

			if ( !$panes.length ) {
				$el.append( pane );
			} else {
				$panes.last().after( pane );
			}
		},

		_direction : function ( isHorizontal ) {
			return isHorizontal ? "horizontal" : "vertical";
		},

		_isStyleSpecified : function ( cssString ) {
			return ( typeof cssString !== "undefined" && cssString.length );
		},

		_getContainerSize : function ( widthString, heightString ) {
			var self = this,
				$el = self.element,
				widthSpecified = self._isStyleSpecified( widthString ),
				heightSpecified = self._isStyleSpecified( heightString );

			self.containerSize[ 0 ] = ( widthSpecified ) ? $el.outerWidth( true ) : self._parentWidth();
			self.containerSize[ 1 ] = ( heightSpecified ) ? $el.outerHeight( true ) : self._parentHeight();

			if ( !self.containerSize[ 0 ] || !self.containerSize[ 1 ] ) {
				return false;
			}

			return true;
		},

		_parentWidth : function () {
			var $parent = this.element.parent();

			if ( !$parent && typeof $parent === "undefined" && !$parent.length ) {
				return $( window ).width();
			}

			return $parent.width();
		},

		_parentHeight : function () {
			var $parent = this.element.parent(),
				heightString = "",
				heightSpecified = false,
				parentHeight = 0;

			while ( $parent && typeof $parent !== "undefined" && $parent.length ) {
				if ( typeof $parent[ 0 ].style !== "undefined" ) {
					heightString = $parent[ 0 ].style.height;
					heightSpecified = ( typeof heightString !== "undefined" && heightString.length );
					if ( heightSpecified ) {
						parentHeight = $parent.height();
						break;
					}
				}

				$parent = $parent.parent();
			}

			if ( !heightSpecified ) {
				parentHeight = $(window).height();
			}

			return parentHeight;
		},

		_convertRatio : function ( ratioParam, panesLength ) {
			var self = this,
				ratio = [],
				loop = 0,
				type = typeof ratioParam,
				ratioArray = null,
				i;

			for ( i = 0; i < panesLength; ++i ) {
				ratio.push( 0 );
			}

			switch ( type ) {
			case "number":
				if ( panesLength ) {
					ratio[ 0 ] = ratioParam;
				}
				break;

			case "string":
				ratioArray = ratioParam.split( "," );
				loop = Math.min( ratioArray.length, panesLength );
				for ( i = 0; i < loop; ++i ) {
					ratio[ i ] = parseFloat( ratioArray[ i ] );
				}
				break;

			case "object":
				if ( !$.isArray( ratioParam ) ) {
					break;
				}

				loop = Math.min( ratioParam.length, panesLength );
				for ( i = 0; i < loop; ++i ) {
					type = typeof ratioParam[ i ];
					ratio[ i ] = ( type === "string" ) ? parseFloat( ratioParam[ i ] ) :
								( type === "number" ) ? ratioParam[ i ] : 0;
				}
				break;
			}

			self.options.ratio = ratio;
			self._adjustRatio( panesLength );
		},

		_adjustRatio : function ( panesLength ) {
			var self = this,
				ratio = self.options.ratio,
				sum = 0,
				remain = 0,
				value = 0,
				subValue = 0,
				subRemain = 0,
				i;

			if ( !panesLength ) {
				self.options.ratio = [];
				return;
			}

			for ( i in ratio ) {
				sum += ratio[ i ];
			}

			if ( sum !== 1 ) {
				remain = 1 - sum;
				value = remain / panesLength;

				for ( i in ratio ) {
					if ( value >= 0 ) {
						ratio[ i ] += value;
						remain = Math.max( 0, remain - value );
					} else {
						subRemain += value;
						subValue = Math.max( subRemain, ratio[ i ] * -1 );
						ratio[ i ] = Math.max( 0, ratio[ i ] + subValue );
						remain = Math.min( 0, remain - subValue );
						subRemain -= subValue;
					}
				}

				if ( remain ) {
					if ( remain > 0 ) {
						ratio[ ratio.length - 1 ] += remain;
					} else {
						for ( i = ratio.length - 1; i >= 0; --i ) {
							subValue = Math.max( remain, ratio[ i ] * -1 );
							ratio[ i ] = Math.max( 0, ratio[ i ] + subValue );
							remain = Math.min( 0, remain - subValue );
							if ( !remain ) {
								break;
							}
						}
					}
				}

				self.options.ratio = ratio;
			}
		},

		_setOption : function ( key, value ) {
			var self = this,
				orgValue = self.options[ key ];

			if ( orgValue === value ) {
				return;
			}

			$.Widget.prototype._setOption.apply( this, arguments );

			switch ( key ) {
			case "fixed":
				self._fixed( value );
				break;

			case "dividerVertical":
				self._dividerVertical( value );
				break;

			case "ratio":
				self._ratio( value );
				break;
			}
		},

		_subtractDiffWidth : function ( width, diff ) {
			var self = this;

			if ( width <= self.minPaneWidth ) {
				return {
					width: width,
					diff: diff
				};
			}

			width += diff;
			if ( width >= self.minPaneWidth ) {
				return {
					width: width,
					diff: 0
				};
			}

			return {
				width: self.minPaneWidth,
				diff: width - self.minPaneWidth
			};
		},

		_initRatio : function ( fromFirstPane, panes, isHorizontal, availableWidth ) {
			var self = this,
				sum = 0,
				widths = [],
				diff = 0,
				panesLength = panes.length,
				ret,
				i;

			panes.each( function ( i ) {
				var pane = $( this );
				widths.push( isHorizontal ? pane.width() : pane.height() );
				sum += widths[ i ];
			});

			diff = availableWidth - sum;
			if ( !diff ) {
				return widths;
			}

			if ( diff > 0 ) {
				widths[ fromFirstPane ? 0 : panesLength - 1 ] += diff;
			} else {
				if ( fromFirstPane ) {
					for ( i = 0; i < panesLength; ++i ) {
						ret = self._subtractDiffWidth( widths[ i ], diff );
						widths[ i ] = ret.width;
						diff = ret.diff;
						if ( !diff ) {
							break;
						}
					}
				} else {
					for ( i = panesLength - 1; i >= 0; --i ) {
						diff = self._subtractDiffWidth( widths[ i ], diff );
						widths[ i ] = ret.width;
						diff = ret.diff;
						if ( !diff ) {
							break;
						}
					}
				}
			}

			sum = 0;
			for ( i in widths ) {
				sum += widths[ i ];
			}

			for ( i in self.options.ratio ) {
				self.options.ratio[ i ] = widths[ i ] / sum;
			}

			return widths;
		},

		_horizontalBoundary : function () {
			var self = this,
				$el = self.element;

			return $el.outerWidth( true ) - $el.width();
		},

		_verticalBoundary : function () {
			var self = this,
				$el = self.element;

			return $el.outerHeight( true ) - $el.height();
		},

		_boundary : function ( type ) {
			var self = this,
				$el = self.element,
				computedStyle = window.getComputedStyle( $el[ 0 ], null ),
				margin = parseFloat( computedStyle[ "margin" + type ] ),
				border = parseFloat( computedStyle[ "border" + type + "Width" ] ),
				padding = parseFloat( computedStyle[ "padding" + type ] );

			return {
				margin: margin,
				border: border,
				padding: padding
			};
		},

		_layout : function ( initRatio, fromFirstPane, saveRatio ) {
			var self = this,
				$el = self.element,
				opt = self.options,
				isHorizontal = opt.dividerVertical,
				$panes = self.panes,
				spliters = self.spliters,
				spliterBars = self.spliterBars,
				spliterBar = self.spliterBars.length ? $( spliterBars[ 0 ] ) : null,
				spliterWidth = !spliterBar ? 0 :
								isHorizontal ? spliterBar.outerWidth() :
												spliterBar.outerHeight(),
				spliterBarMargin = !spliterBar ? 0 :
									isHorizontal ?
										spliterBar.outerWidth( true ) - spliterBar.outerWidth() :
										spliterBar.outerHeight( true ) - spliterBar.outerHeight(),
				panesLength = $panes.length,
				currentAvailable = 0,
				spliterSize = spliterWidth * ( panesLength - 1 ),
				parentWidth = self.containerSize[ 0 ],
				parentHeight = self.containerSize[ 1 ],
				width = parentWidth - self._horizontalBoundary(),
				height = parentHeight - self._verticalBoundary(),
				innerSize = isHorizontal ? height : width,
				availableWidth = isHorizontal ? width - spliterSize :
												height - spliterSize,
				initializedWidth = [],
				widthSum = 0,
				childSplitview = null;

			initRatio = !!initRatio;
			fromFirstPane = !!fromFirstPane;
			saveRatio = !!saveRatio;

			$el.css( {
				"min-width" : width,
				"min-height" : height
			});

			if ( initRatio ) {
				initializedWidth = self._initRatio( fromFirstPane, $panes, isHorizontal, availableWidth );
			}

			currentAvailable = availableWidth;
			$panes.each( function ( i ) {
				var $pane = $( this ),
					paneWidth = initRatio ? initializedWidth[ i ] :
										Math.round( availableWidth * self.options.ratio[i] ),
					prevPane = ( ( i ) ? $panes.eq( i - 1 ) : null ),
					posValue = 0,
					widthValue = 0,
					heightValue = 0,
					boundary = 0;

				currentAvailable -= paneWidth;
				if ( i === ( panesLength - 1 ) ) {
					if ( self.touchStatus ) {
						paneWidth = self.moveData.nextPaneWidth = availableWidth - ( self.moveData.targetPos + spliterWidth );
					} else {
						paneWidth = Math.max( Math.min( paneWidth, self.minPaneWidth ), paneWidth + currentAvailable );
					}
				}

				widthSum += paneWidth;

				if ( !prevPane ) {
					boundary = self._boundary( isHorizontal ? "Left" : "Top" );
					posValue = boundary.padding;
				} else {
					posValue = parseInt( prevPane.css( isHorizontal ? "left" : "top" ), 10 );
					posValue += isHorizontal ? prevPane.width() : prevPane.height();
					posValue += spliterWidth;
				}

				widthValue = isHorizontal ? paneWidth : innerSize;
				heightValue = isHorizontal ? innerSize : paneWidth;

				$pane.css( {
					"width" : widthValue ,
					"height" : heightValue
				} );

				$pane.css( ( isHorizontal ? "left" : "top" ), posValue );
			});

			if ( saveRatio ) {
				$panes.each( function ( i ) {
					var $pane = $( this ),
						paneWidth = isHorizontal ? $pane.width() : $pane.height();

					self.options.ratio[ i ] = paneWidth / widthSum;
				});
			}

			$.each( spliters, function ( i ) {
				var spliter = $( this ),
					prevPane = $panes.eq( i ),
					bar = spliter.children( ".ui-spliter-bar" ),
					handle = bar.children( ".ui-spliter-handle" ),
					posValue = 0;

				if ( isHorizontal ) {
					posValue = parseInt( prevPane.css( "left" ), 10 ) + prevPane.width() - spliterBarMargin;
					spliter.outerHeight( innerSize ).css( "left", posValue );
				} else {
					posValue = parseInt( prevPane.css( "top" ), 10 ) + prevPane.height() - spliterBarMargin;
					spliter.outerWidth( innerSize ).css( "top", posValue );
				}

				if ( bar.length ) {
					bar[ isHorizontal ? "outerHeight" : "outerWidth" ]( innerSize );
				}
				if ( handle.length ) {
					handle.css( isHorizontal ? "top" : "left", ( innerSize - spliterWidth ) / 2 );
				}
			});

			childSplitview = $el.find( ".ui-splitview:first" );
			if ( !childSplitview.length ) {
				return;
			}

			childSplitview = childSplitview.data( "splitview" );
			if ( childSplitview ) {
				childSplitview._refresh();
			}
		},

		_bindTouchEvents : function () {
			var self = this,
				$el = self.element,
				$panes = self.panes,
				spliters = self.spliters;

			$.each( spliters, function ( i ) {
				var spliter = $( this );
				self._bindSpliterTouchEvents.call( self, spliter );
			});
		},

		_bindSpliterTouchEvents : function ( spliter ) {
			var self = this,
				$el = self.element,
				opt = self.options,
				touchStartEvt = ( $.support.touch ? "touchstart" : "mousedown" ),
				touchMoveEvt = ( $.support.touch ? "touchmove" : "mousemove" ) + ".splitview",
				touchEndEvt = ( $.support.touch ? "touchend" : "mouseup" ) + ".splitview";

			spliter.bind( touchStartEvt, { e : spliter }, function ( event ) {
				if ( self.options.fixed ) {
					return;
				}

				var realEvent = $.support.touch ? event.originalEvent.changedTouches[0] : event,
					targetSpliter = event.data.e,
					prevPane = targetSpliter.prev(),
					nextPane = targetSpliter.next(),
					splitviewInPrev = prevPane.find( ".ui-splitview:first" ),
					splitviewInNext = nextPane.find( ".ui-splitview:first" ),
					isHorizontal = opt.dividerVertical,
					spliterWidth = isHorizontal ?
									$( self.spliterBars[0] ).outerWidth() :
									$( self.spliterBars[0] ).outerHeight();

				self.moveTarget = targetSpliter;
				self.moveData = {
					spliterWidth : spliterWidth || 0,
					prevPane : prevPane,
					nextPane : nextPane,
					splitviewInPrev : splitviewInPrev,
					splitviewInNext : splitviewInNext,
					prevPanePos : parseInt( prevPane.css( isHorizontal ? "left" : "top" ), 10 ) || 0,
					prevPaneWidth : parseInt( prevPane.css( isHorizontal ? "width" : "height" ), 10 ) || 0,
					nextPanePos : parseInt( nextPane.css( isHorizontal ? "left" : "top" ), 10 ) || 0,
					nextPaneWidth : parseInt( nextPane.css( isHorizontal ? "width" : "height" ), 10 ) || 0,
					targetPos : parseInt( targetSpliter.css( isHorizontal ? "left" : "top" ), 10 ) || 0,
					pagePos : isHorizontal ? realEvent.pageX : realEvent.pageY
				};

				targetSpliter.addClass( "ui-spliter-active" );

				$el.bind( touchMoveEvt, function ( event ) {
					if ( !self.touchStatus ) {
						return;
					}
					event.stopPropagation();
					self._drag( $.support.touch ? event.originalEvent.changedTouches[0] : event );
				}).bind( touchEndEvt, function ( event ) {
					event.stopPropagation();
					self._stop( $.support.touch ? event.originalEvent.changedTouches[0] : event );
					self.touchStatus = false;
					$el.unbind( ".splitview" );
					$( document ).unbind( ".splitview" );
				});

				$( document ).bind( touchMoveEvt + " " + touchEndEvt, function () {
					$el.trigger( touchEndEvt );
				});

				event.preventDefault();
				self.touchStatus = true;
			});
		},

		_drag : function ( e ) {
			if ( !this.moveData || typeof this.moveData === "undefined" ) {
				return;
			}

			var self = this,
				$el = self.element,
				opt = self.options,
				isHorizontal = opt.dividerVertical,
				moveData = self.moveData,
				moveTarget = self.moveTarget,
				prevPane = moveData.prevPane,
				nextPane = moveData.nextPane,
				splitviewInPrev = moveData.splitviewInPrev,
				splitviewInNext = moveData.splitviewInNext,
				spliterWidth = moveData.spliterWidth,
				movement = null,
				targetPos = null,
				nextPanePos = null,
				prevPaneWidth = null,
				nextPaneWidth = null,
				pagePos = isHorizontal ? e.pageX : e.pageY,
				splitview = null;

			movement = pagePos - moveData.pagePos;
			if ( movement > 0 ) {
				movement = Math.min( Math.max( moveData.nextPaneWidth - self.minPaneWidth, 0 ), movement );
			} else {
				movement = Math.max( Math.max( moveData.prevPaneWidth - self.minPaneWidth, 0 ) * -1, movement );
			}

			nextPanePos = moveData.nextPanePos + movement;
			prevPaneWidth = Math.max( moveData.prevPaneWidth + movement, 0 );
			nextPaneWidth = Math.max( moveData.nextPaneWidth - movement, 0 );
			targetPos = moveData.targetPos + movement;

			moveTarget.css( isHorizontal ? { left : targetPos } : { top : targetPos } );
			prevPane.css( isHorizontal ? { width : prevPaneWidth } : { height : prevPaneWidth } );
			nextPane.css( isHorizontal ? { width : nextPaneWidth, left : nextPanePos } :
											{ height : nextPaneWidth, top : nextPanePos } );

			if ( splitviewInPrev.length ) {
				splitview = splitviewInPrev.data( "splitview" );
				splitview._refresh( true, false );
			}

			if ( splitviewInNext.length ) {
				splitview = splitviewInNext.data( "splitview" );
				splitview._refresh( true, true );
			}
		},

		_stop : function ( e ) {
			if ( !this.moveData || !this.moveTarget ) {
				return;
			}

			var self = this,
				$el = self.element,
				opt = self.options,
				$panes = self.panes,
				panesLength = $panes.length,
				isHorizontal = opt.dividerVertical,
				moveData = self.moveData,
				moveTarget = self.moveTarget,
				prevPane = moveData.prevPane,
				nextPane = moveData.nextPane,
				splitviewInPrev = moveData.splitviewInPrev,
				splitviewInNext = moveData.splitviewInNext,
				spliterWidth = moveData.spliterWidth,
				spliterSize = spliterWidth * ( panesLength - 1 ),
				movement = null,
				targetPos = null,
				nextPanePos = null,
				prevPaneWidth = null,
				nextPaneWidth = null,
				displayStyle = $el.css( "display" ),
				parentWidth = self.containerSize[ 0 ],
				parentHeight = self.containerSize[ 1 ],
				width = parentWidth - self._horizontalBoundary(),
				height = parentHeight - self._verticalBoundary(),
				availableWidth = isHorizontal ?
									( width - spliterSize ) :
									( height - spliterSize ),
				sum = 0,
				i;

			moveTarget.removeClass( "ui-spliter-active" );

			for( i = 0; i < $panes.length; i++ ) {
				var $pane,
					paneWidth;

				$pane = $( $panes[i] );
				paneWidth = isHorizontal ? $pane.width() : $pane.height();

				// Get sum for ratio calculation
				sum += paneWidth;

				// Optimization: Remember width here to calculate ratio later
				self.options.ratio[ i ] = paneWidth;

				// Call refresh for all scrollview panes
				if ( $pane.hasClass( "ui-scrollview-clip" ) ) {
					$pane.scrollview( "refresh" );
				}
				$pane.find( ".ui-scrollview-clip" ).scrollview( "refresh" );
			}
			if( sum ) {	// Prevent DivideByZero. if sum==0, each ratio will be 0 already.
				for( i = 0; i < self.options.ratio.length; i++ ) {
					// Actual ratio calculation
					self.options.ratio[ i ] /= sum;
				}
			}
			self.moveData = null;
		},

		_fixed : function ( isFix ) {
			var self = this,
				spliters = self.spliters;

			$.each( spliters, function ( i ) {
				var $spliter = $( this );

				if ( isFix ) {
					$spliter.addClass( "ui-fixed" );
				} else {
					$spliter.removeClass( "ui-fixed" );
				}
			});

			self._layout();
		},

		_dividerVertical : function ( isDividerVertical ) {
			var self = this,
				$el = self.element,
				isHorizontal = isDividerVertical,
				$panes = null,
				$spliters = null,
				$bar = null,
				$handle = null;

			$panes = $el.children( ".ui-pane" );
			$spliters = $el.children( ".ui-spliter" );
			$bar = $spliters.children( ".ui-spliter-bar" );
			$handle = $bar.children( ".ui-spliter-handle" );

			$el.removeClass( "ui-direction-vertical" );
			$el.removeClass( "ui-direction-horizontal" );
			$el.addClass( "ui-splitview ui-direction-" + self._direction( isHorizontal ) );

			$panes.css( {
				"left" : "",
				"top" : "",
				"width" : "",
				"height" : ""
			});

			$spliters.css( {
				"left" : "",
				"top" : "",
				"width" : "",
				"height" : ""
			});

			$bar.css( {
				"width" : "",
				"height" : ""
			});

			$handle.css( {
				"left" : "",
				"top" : ""
			});

			if ( self._getContainerSize( $el[ 0 ].style.width, $el[ 0 ].style.height ) ) {
				self._layout();
			}
		},

		_ratio : function ( ratioParam ) {
			var self = this,
				$el = self.element,
				$panes = $el.children( ".ui-pane" ),
				panesLength = $panes.length;

			self._convertRatio( ratioParam, panesLength );
			self._layout();
		},

		_refresh : function ( initRatio, fromFirstPane ) {
			var self = this,
				$el = self.element;

			initRatio = !!initRatio;
			fromFirstPane = !!fromFirstPane;

			if ( self._getContainerSize( $el[ 0 ].style.width, $el[ 0 ].style.height ) ) {
				self._layout( initRatio, fromFirstPane, true );
			}
		},

		pane : function ( id, element ) {
			if ( typeof id !== "string" ) {
				return null;
			}

			var self = this,
				$el = self.element,
				$targetPane = $el.children( id ),
				$targetView = null,
				elementParent = null;

			if ( !$targetPane.hasClass( "ui-pane" ) ) {
				return null;
			}

			// getter
			if ( !element ) {
				return $targetPane.contents();
			}

			// setter
			if ( $targetPane.hasClass( "ui-scrollview-clip" ) ) {
				$targetPane.scrollview( "scrollTo", 0, 0, 0 );

				$targetView = $targetPane.children( ".ui-scrollview-view" );
				if ( !$targetView.length ) {
					return null;
				}
			} else {
				$targetView = $targetPane;
			}

			elementParent = element.parent();
			if ( elementParent.length && elementParent[ 0 ] === $targetView[ 0 ] ) {
				return;
			}

			$targetView.empty().append( element ).trigger( "create" );
			$targetView.fadeIn( 'fast' );
		},

		maximize : function ( id ) {
			if ( typeof id !== "string" ) {
				return;
			}

			var self = this,
				$el = self.element,
				$panes = self.panes,
				$targetPane = $el.children( id );

			if ( !$targetPane.hasClass( "ui-pane" ) ) {
				return;
			}

			self.savedRatio = self.options.ratio.slice();

			self.options.ratio = [];
			$panes.each( function ( i ) {
				self.options.ratio.push( ( this === $targetPane[ 0 ] ) ? 1 : 0 );
			});

			self._layout();
		},

		restore : function () {
			var self = this;

			if ( !self.savedRatio.length ) {
				return;
			}

			self.options.ratio = self.savedRatio.slice();
			self._adjustRatio( self.panes.length );

			self._layout();
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$.tizen.splitview.prototype.enhanceWithin( e.target );
	});
} ( jQuery, window, document ) );


/*
* Module Name : widgets/jquery.mobile.tizen.checkbox
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
	@class Checkbox
	The check box widget shows a list of options on the screen where one or more can be selected. Check boxes can be used in Tizen as described in the jQueryMobile documentation for check boxes.<br/> To add a check box widget to the application, use the following code:

		<input type="checkbox" name="mycheck" id="check-test" class="favorite" />
		<label for="check-test">Favorite</label>
		<input type="checkbox" name="check-favorite" id="check-test2" checked="checked" disabled="disabled" class="favorite" />
		<label for="check-test2">Favorite Checked, Disabled</label>

	The check box can define callbacks for events as described in the jQueryMobile documentation for check box events.
	You can use methods with the check box as described in the jQueryMobile documentation for check box methods.

*/
/**
	@property {String} class
	Defines the check box style. <br/> The default value is check. If the value is set to favorite, a star-shaped check box is created.
*/


/*
* Module Name : widgets/components/motionpath
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

( function ( $, window, undefined ) {
	var HALF_PI = Math.PI / 2,
		DEFAULT_STEP = 0.001,
		MotionPath = {},
		vec3 = window.vec3,
		arcLength3d = function ( p0, p1 ) {
			var d = [ p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2] ],
				value = Math.sqrt( d[0] * d[0] + d[1] * d[1] + d[2] * d[2] );
			return value;
		};

	MotionPath.base = function () {};
	MotionPath.base.prototype = {
		points: [],
		step: DEFAULT_STEP,
		length: 0,
		levels: [],
		init: function ( data ) {},
		calculateLevel: function ( maxLevel ) {},
		calculateTotalLength: function () {},
		getPosition: function ( percent ) {},
		getPercent: function ( start, interval ) {},
		getAngle: function ( percent ) {}
	};

	MotionPath.bezier2d = function () {};
	MotionPath.bezier2d.prototype = $.extend( true, {}, MotionPath.base.prototype, {
		init: function ( data ) {
			this.points = data.points;
			this.step = data.step || DEFAULT_STEP;
			this.length = this.calculateTotalLength();
			this.levels = this.calculateLevel( data.maxLevel ) || [];
		},

		calculateLevel: function ( maxLevel ) {
			var totalLength = this.length,
				interval = totalLength / maxLevel,
				levels = [],
				i;

			if ( !maxLevel ) {
				return null;
			}

			for ( i = 0; i < maxLevel; i += 1 ) {
				levels[maxLevel - i] = this.getPercent( 0, interval * i );
			}

			return levels;
		},

		calculateTotalLength: function () {
			var step = this.step,
				current = this.getPosition( 0 ),
				last = current,
				length = 0,
				percent;
			for ( percent = step; percent <= 1; percent += step ) {
				current = this.getPosition( percent );
				length += arcLength3d( last, current );
				last = current;
			}
			return length;
		},

		getPosition: function ( percent ) {
			var points = this.points,
				getValue = function ( p1, c1, c2, p2, t ) {
					return Math.pow(1 - t, 3) * p1 +
						3 * t * Math.pow( 1 - t, 2 ) * c1 +
						3 * Math.pow( t, 2 ) * ( 1 - t ) * c2 +
						Math.pow( t, 3 ) * p2;
				},
				result = [
					getValue( points[0][0], points[1][0], points[2][0], points[3][0], percent ),
					getValue( points[0][2], points[1][2], points[2][2], points[3][2], percent )
				];
			return [ result[0], 0, result[1] ];
		},

		getPercent: function ( start, interval ) {
			var step = this.step,
				current = this.getPosition( start = start || 0 ),
				last = current,
				targetLength = start + interval,
				length = 0,
				percent;

			for ( percent = start + step; percent <= 1; percent += step ) {
				current = this.getPosition( percent );
				length += arcLength3d( last, current );
				if ( length >= targetLength ) {
					return percent;
				}
				last = current;
			}
			return 1;
		},

		getAngle: function ( percent ) {
			var points = this.points,
				getTangent = function ( p1, c1, c2, p2, t ) {
					return 3 * t * t * ( -p1 + 3 * c1 - 3 * c2 + p2 ) + 6 * t * ( p1 - 2 * c1 + c2 ) + 3 * ( -p1 + c1 );
				},
				tx = getTangent( points[0][0], points[1][0], points[2][0], points[3][0], percent ),
				ty = getTangent( points[0][2], points[1][2], points[2][2], points[3][2], percent );
			return Math.atan2( tx, ty ) - HALF_PI;
		}

	} );

	// clamped cubic B-spline curve
	// http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node17.html
	// http://www.cs.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/B-spline/bspline-curve-coef.html
	MotionPath.bspline = function () {};
	MotionPath.bspline.prototype = $.extend( true, {}, MotionPath.base.prototype, {
		_degree: 3,
		_numberOfControls : 0,
		_knotVectors: [],
		_numberOfKnots: 0,

		init: function ( data ) {
			this.points = data.points;
			this.step = data.step || DEFAULT_STEP;
			this._numberOfPoints = this.points.length - 1;
			this._numberOfKnots = this._numberOfPoints + this._degree + 1;

			var deltaKnot = 1 / ( this._numberOfKnots - ( 2 * this._degree ) ),
				v = deltaKnot,
				i = 0;

			while ( i <= this._numberOfKnots ) {
				if ( i <= this._degree ) {
					this._knotVectors.push( 0 );
				} else if ( i < this._numberOfKnots - this._degree + 1 ) {
					this._knotVectors.push( v );
					v += deltaKnot;
				} else {
					this._knotVectors.push( 1 );
				}
				i += 1;
			}

			this.length = this.calculateTotalLength();
			this.levels = this.calculateLevel( data.maxLevel ) || [];
		},

		_Np: function ( percent, i, degree ) {
			var knots = this._knotVectors,
				A = 0,
				B = 0,
				denominator = 0,
				N0 = function ( percent, i ) {
					return ( ( knots[i] <= percent && percent < knots[i + 1] ) ? 1 : 0 );
				};

			if ( degree === 1 ) {
				A = N0( percent, i );
				B = N0( percent, i + 1 );
			} else {
				A = this._Np( percent, i, degree - 1 );
				B = this._Np( percent, i + 1, degree - 1 );
			}

			denominator = knots[i + degree] - knots[i];
			A *= ( denominator !== 0 ) ? ( ( percent - knots[i] ) / denominator ) : 0;
			denominator = knots[i + degree + 1] - knots[i + 1];
			B *= ( denominator !== 0 ) ? ( ( knots[i + degree + 1] - percent ) / denominator ) : 0;

			return A + B;
		},

		calculateLevel: function ( maxLevel ) {
			var totalLength = this.length,
				interval = totalLength / maxLevel,
				levels = [],
				i;

			if ( !maxLevel ) {
				return null;
			}

			for ( i = 0; i < maxLevel; i += 1 ) {
				levels[maxLevel - i] = this.getPercent( 0, interval * i );
			}
			return levels;
		},

		calculateTotalLength: function () {
			var step = this.step,
				current = this.getPosition( 0 ),
				last = current,
				length = 0,
				percent;
			for ( percent = step; percent <= 1; percent += step ) {
				current = this.getPosition( percent );
				length += arcLength3d( last, current );
				last = current;
			}
			return length;
		},

		getPosition: function ( percent ) {
			var result = [], i, j, sum;
			percent = percent.toFixed( 4 );
			for ( j = 0; j < 3; j += 1 ) {
				sum = 0;
				for ( i = 0; i <= this._numberOfPoints; i += 1 ) {
					sum += this.points[i][j] * this._Np( percent, i, this._degree );
				}
				result[j] = sum;
			}

			return result;
		},

		getPercent: function ( start, interval ) {
			var step = this.step,
				current = this.getPosition( start = start || 0 ),
				last = current,
				targetLength = start + interval,
				length = 0,
				percent;

			for ( percent = start + step; percent <= 1; percent += step ) {
				current = this.getPosition( percent );
				length += arcLength3d( last, current );
				if ( length >= targetLength ) {
					return percent;
				}
				last = current;
			}
			return 1;
		},

		getAngle: function ( percent ) {
			var prev = this.getPosition( percent ),
				next = this.getPosition( percent + 0.001 ),
				dir = vec3.normalize( vec3.direction( prev, next ) ),
				cosValue = vec3.dot( dir, [1, 0, 0] );

			return Math.acos( cosValue ) + Math.PI;
		}
	} );

	$.motionpath = function ( type, data ) {
		var object = new MotionPath[type]();
		object.init( data );
		return object;
	};
} ( jQuery, window ) );


/*
* Module Name : widgets/jquery.mobile.tizen.extendablelist
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 *	Extendable List Widget for unlimited data.
 *	To support more then 1,000 items, special list widget developed.
 *	Fast initialize and append some element into the DOM tree repeatedly.
 *	DB connection and works like DB cursor.
 *
 * HTML Attributes:
 *
 *		data-role:	extendablelist
 *		data-template : jQuery.template ID that populate into extendable list. A button : a <DIV> element with "data-role : button" should be included on data-template.
 *		data-dbtable : DB Table name. It used as window[DB NAME]. Loaded data should be converted as window object.
 *		data-extenditems : Number of elements to extend at once.
 *		
 *		ID : <UL> element that has "data-role=extendablelist" must have ID attribute.
 *		Class : <UL> element that has "data-role=extendablelist" should have "vlLoadSuccess" class to guaranty DB loading is completed.
 *		tmp_load_more : Template ID for "load more" message and button.
 *
 *
 *APIs:
 *		create ( {
 *				itemData: function ( idx ) { return json_obj; },
 *				numItemData: number or function () { return number; },
 *				cacheItemData: function ( minIdx, maxIdx ) {}
 *				} )
 *			: Create a extendable list widget. At this moment, _create method is called.
 *			args : A collection of options
 *				itemData: A function that returns JSON object for given index. Mandatory.
 *				numItemData: Total number of itemData. Mandatory.
 *				cacheItemData: Extendable list will ask itemData between minIdx and maxIdx.
 *				    Developers can implement this function for preparing data.
 *				    Optional.
 *
 *Examples:
 *
 *		<script id="tmp-3-1-1" type="text/x-jquery-tmpl">
 *			<li class="ui-li-3-1-1"><span class="ui-li-text-main">${NAME}</span></li>
 *		</script>
 *
 *		<script id="tmp_load_more" type="text/x-jquery-tmpl"> 
 *			<li class="ui-li-3-1-1" style="text-align:center; margin:0 auto">
 *				<div data-role="button">Load ${NUM_MORE_ITEMS} more items</div>
 *			</li>
 *		</script>
 *	
 *		<ul id = "extendable_list_main" data-role="extendablelist" data-extenditems="50" data-template="tmp-3-1-1">
 *		</ul>
 *
 */

/**
	@class Extendablelist
	In the Web environment, it is challenging to display a large amount of data in a list, such as displaying a contact list of over 1000 list items. It takes time to display the entire list in HTML and the DOM manipulation is complex.
	The extendable list widget is used to display a list of unlimited data elements on the screen for better performance. The list is extended if you click the button at the bottom of the list to load more data elements. Extendable lists are based on the jQuery.template plugin as described in the jQuery documentation for jQuery.template plugin.<br/>
	To add a extendable list widget to the application, use the following code:

			<script id="tmp-3-1-1" type="text/x-jquery-tmpl">
				<li class="ui-li-3-1-1"><span class="ui-li-text-main">${NAME}</span></li>
			</script>
			<script id="tmp_load_more" type="text/x-jquery-tmpl">
				<li class="ui-li-3-1-1" style="text-align:center; margin:0 auto">
				<div data-role="button">Load ${NUM_MORE_ITEMS} more items</div>
				</li>
			</script>
			<ul id="extendable_list_main" data-role="extendablelist" data-extenditems="50" data-template="tmp-3-1-1">
			</ul>
*/
/**
	@property {String} data-role
	Creates the extendable list view. The value must be set to extendablelist. Only the &lt;ul&gt; element, which a id attribute defined, supports this option. Also, the elLoadSuccess class attribute must be defined in the &lt;ul&gt; element to ensure that loading data from the database is complete.
*/
/**
	@property {String} data-template
	Specifies the jQuery.template element ID. The jQuery.template must be defined. The template style can use rem units to support scalability. For using the button at the bottom of the list to load more data elements, there must be list view template with the button. The attribute ID must be tmp_load_more.
*/
/**
	@property {Integer} data-extenditems
	Defines the number of data elements to be extended at a time.
*/
( function ( $, undefined ) {

	//Keeps track of the number of lists per page UID
	//This allows support for multiple nested list in the same page
	//https://github.com/jquery/jquery-mobile/issues/1617
	var listCountPerPage = {};

	$.widget( "tizen.extendablelist", $.mobile.widget, {
		options: {
			theme: "s",
			countTheme: "c",
			headerTheme: "b",
			dividerTheme: "b",
			splitIcon: "arrow-r",
			splitTheme: "b",
			inset: false,
			id:	"",						/* Extendable list UL elemet's ID */
			extenditems: 50,			/* Number of append items */
			childSelector: " li",		/* To support swipe list */
			dbtable: "",
			template : "",				/* Template for each list item */
			loadmore : "tmp_load_more",	/* Template for "Load more" message */
			scrollview: false,
			initSelector: ":jqmData(role='extendablelist')"
		},

		_stylerMouseUp: function () {
			$( this ).addClass( "ui-btn-up-s" );
			$( this ).removeClass( "ui-btn-down-s" );
		},

		_stylerMouseDown: function () {
			$( this ).addClass( "ui-btn-down-s" );
			$( this ).removeClass( "ui-btn-up-s" );
		},

		_stylerMouseOver: function () {
			$( this ).toggleClass( "ui-btn-hover-s" );
		},

		_stylerMouseOut: function () {
			$( this ).toggleClass( "ui-btn-hover-s" );
			$( this ).addClass( "ui-btn-up-s" );
			$( this ).removeClass( "ui-btn-down-s" );
		},

		_pushData: function ( template ) {
			var o = this.options,
				t = this,
				i = 0,
				myTemplate = $( "#" + template ),
				loadMoreItems = ( o.extenditems > t._numItemData - t._lastIndex ? t._numItemData - t.lastIndex : o.extenditems ),
				htmlData;

			for (i = 0; i < loadMoreItems; i++ ) {
				htmlData = myTemplate.tmpl( t._itemData( i ) );
				$( o.id ).append( $( htmlData ).attr( 'id', 'li_' + i ) );

				/* Add style */
				$( o.id + ">" + o.childSelector )
					.addClass( "ui-btn-up-s" )
					.bind( "mouseup", t._stylerMouseUp )
					.bind( "mousedown", t._stylerMouseDown )
					.bind( "mouseover", t._stylerMouseOver )
					.bind( "mouseout", t._stylerMouseOut );

				t._lastIndex += 1;
			}

			/* After push data, re-style extendable list widget */
			$( o.id ).trigger( "create" );
		},

		_loadmore: function ( event ) {
			var t = event.data,	// <li> element
				o = t.options,
				i = 0,
				myTemplate = $( "#" + o.template ),
				loadMoreItems = ( o.extenditems > t._numItemData - t._lastIndex ? t._numItemData - t._lastIndex : o.extenditems ),
				htmlData,
				more_items_to_load,
				num_next_load_items;

			/* Remove load more message */
			$( "#load_more_message" ).remove();

			/* Append More Items */
			for ( i = 0; i < loadMoreItems; i++ ) {
				htmlData = myTemplate.tmpl( t._itemData( t._lastIndex ) );
				$( o.id ).append( $( htmlData ).attr( 'id', 'li_' + t._lastIndex ) );
				t._lastIndex += 1;
			}

			/* Append "Load more" message on the last of list */
			if ( t._numItemData > t._lastIndex ) {
				myTemplate = $( "#" + o.loadmore );
				more_items_to_load = t._numItemData - t._lastIndex;
				num_next_load_items = ( o.extenditems <= more_items_to_load ) ? o.extenditems : more_items_to_load;
				htmlData = myTemplate.tmpl( { NUM_MORE_ITEMS : num_next_load_items } );
				// Button minimum height(37px)
				$( o.id ).append( $( htmlData ).attr( 'id', "load_more_message" ).css( 'min-height' , "37px") );
			}

			$( o.id ).trigger( "create" );
			$( o.id ).extendablelist( "refresh" );
		},

		recreate: function ( newArray ) {
			this._create( {
				itemData: function ( idx ) { return newArray[ idx ]; },
				numItemData: newArray.length
			} );
		},

		_initList: function (args ) {
			var t = this,
				o = this.options,
				myTemplate,
				more_items_to_load,
				num_next_load_items,
				htmlData;

			/* Make Gen list by template */
			if ( t._lastIndex <= 0 ) {
				t._pushData( o.template );

				/* Append "Load more" message on the last of list */
				if ( t._numItemData > t._lastIndex ) {
					myTemplate = $( "#" + o.loadmore );
					more_items_to_load = t._numItemData - t._lastIndex;
					num_next_load_items = ( o.extenditems <= more_items_to_load) ? o.extenditems : more_items_to_load;
					htmlData = myTemplate.tmpl( { NUM_MORE_ITEMS : num_next_load_items } );
					// Button minimum height(37px)
					$( o.id ).append( $( htmlData ).attr( 'id', "load_more_message" ).css( 'min-height' , "37px") );

					$( "#load_more_message" ).live( "click", t, t._loadmore );
				} else {
					/* No more items to load */
					$( "#load_more_message" ).die();
					$( "#load_more_message" ).remove();
				}
			}

			if ( o.childSelector == " ul" ) {
				$( o.id + " ul" ).swipelist();
			}

			$( o.id ).trigger( "create" );

			t.refresh( true );
		},

		create: function () {
			var o = this.options;

			/* external API for AJAX callback */
			this._create.apply( this, arguments );
		},

		_create: function ( args ) {
			var t = this,
				o = this.options,
				$el = this.element,
				dbtable_name;


			t.destroy();

			$.extend(this, {
				_itemData: function ( idx ) { return null; },
				_numItemData: 0,
				_cacheItemData: function ( minIdx, maxIdx ) { },
				_lastIndex: 0
			});


			// create listview markup
			t.element.addClass( function ( i, orig ) {
				return orig + " ui-listview ui-extendable-list-container" + ( t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "" );
			});

			o.id = "#" + $el.attr( "id" );

			if ( $el.data( "extenditems" ) ) {
				o.extenditems = parseInt( $el.data( "extenditems" ), 10 );
			}

			$( o.id ).bind( "pagehide", function (e) {
				$( o.id ).empty();
			});

			/* Scroll view */
			if ( $( ".ui-scrollview-clip" ).size() > 0) {
				o.scrollview = true;
			} else {
				o.scrollview = false;
			}

			if ( args ) {
				if ( !t._loadData( args ) ) {
					return;
				}
			} else {
				// Legacy support: dbtable
				console.warn("WARNING: The data interface of extendable list is changed. \nOld data interface(data-dbtable) is still supported, but will be removed in next version. \nPlease fix your code soon!");

				if ( $( o.id ).hasClass( "elLoadSuccess" ) ) {
					dbtable_name = $el.jqmData('dbtable');
					o.dbtable = window[ dbtable_name ];
					if ( !(o.dbtable) ) {
						o.dbtable = { };
					}
					t._itemData = function ( idx ) {
						return o.dbtable[ idx ];
					};
					t._numItemData = o.dbtable.length;

				} else {
					console.warn("No elLoadSuccess class");
					return;
				}
			}

			if ( $el.data( "template" ) ) {
				o.template = $el.data( "template" );

				/* to support swipe list, <li> or <ul> can be main node of extendable list. */
				if ( $el.data( "swipelist" ) == true ) {
					o.childSelector = " ul";
				} else {
					o.shildSelector = " li";
				}
			}
			t._initList( args );
		},

		_loadData : function ( args ) {
			var self = this;

			if ( args.itemData && typeof args.itemData == 'function'  ) {
				self._itemData = args.itemData;
			} else {
				return false;
			}
			if ( args.numItemData ) {
				if ( typeof args.numItemData == 'function' ) {
					self._numItemData = args.numItemData( );
				} else if ( typeof args.numItemData == 'number' ) {
					self._numItemData = args.numItemData;
				} else {
					return false;
				}
			} else {
				return false;
			}
			return true;
		},


		destroy : function () {
			var o = this.options,
				eOTAL_ITEMS = 0,
				last_index = 0;

			$( o.id ).empty();

			$( "#load_more_message" ).die();
		},

		_itemApply: function ( $list, item ) {
			var $countli = item.find( ".ui-li-count" );

			if ( $countli.length ) {
				item.addClass( "ui-li-has-count" );
			}

			$countli.addClass( "ui-btn-up-" + ( $list.jqmData( "counttheme" ) || this.options.countTheme ) + " ui-btn-corner-all" );

			// TODO class has to be defined in markup
			item.find( "h1, h2, h3, h4, h5, h6" ).addClass( "ui-li-heading" ).end()
				.find( "p, dl" ).addClass( "ui-li-desc" ).end()
				.find( ">img:eq(0), .ui-link-inherit>img:eq(0)" ).addClass( "ui-li-thumb" ).each(function () {
					item.addClass( $( this ).is( ".ui-li-icon" ) ? "ui-li-has-icon" : "ui-li-has-thumb" );
				}).end()
				.find( ".ui-li-aside" ).each(function () {
					var $this = $( this );
					$this.prependTo( $this.parent() ); //shift aside to front for css float
				});
		},

		_removeCorners: function ( li, which ) {
			var top = "ui-corner-top ui-corner-tr ui-corner-tl",
				bot = "ui-corner-bottom ui-corner-br ui-corner-bl";

			li = li.add( li.find( ".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb" ) );

			if ( which === "top" ) {
				li.removeClass( top );
			} else if ( which === "bottom" ) {
				li.removeClass( bot );
			} else {
				li.removeClass( top + " " + bot );
			}
		},

		_refreshCorners: function ( create ) {
			var $li,
				$visibleli,
				$topli,
				$bottomli;

			if ( this.options.inset ) {
				$li = this.element.children( "li" );
				// at create time the li are not visible yet so we need to rely on .ui-screen-hidden
				$visibleli = create ? $li.not( ".ui-screen-hidden" ) : $li.filter( ":visible" );

				this._removeCorners( $li );

				// Select the first visible li element
				$topli = $visibleli.first()
					.addClass( "ui-corner-top" );

				$topli.add( $topli.find( ".ui-btn-inner" ) )
					.find( ".ui-li-link-alt" )
						.addClass( "ui-corner-tr" )
					.end()
					.find( ".ui-li-thumb" )
						.not( ".ui-li-icon" )
						.addClass( "ui-corner-tl" );

				// Select the last visible li element
				$bottomli = $visibleli.last()
					.addClass( "ui-corner-bottom" );

				$bottomli.add( $bottomli.find( ".ui-btn-inner" ) )
					.find( ".ui-li-link-alt" )
						.addClass( "ui-corner-br" )
					.end()
					.find( ".ui-li-thumb" )
						.not( ".ui-li-icon" )
						.addClass( "ui-corner-bl" );
			}
			this.element.trigger( "updatelayout" );
		},

		refresh: function ( create ) {
			this.parentPage = this.element.closest( ".ui-page" );
			this._createSubPages();

			var o = this.options,
				$list = this.element,
				self = this,
				dividertheme = $list.jqmData( "dividertheme" ) || o.dividerTheme,
				listsplittheme = $list.jqmData( "splittheme" ),
				listspliticon = $list.jqmData( "spliticon" ),
				li = $list.children( "li" ),
				counter = $.support.cssPseudoElement || !$.nodeName( $list[ 0 ], "ol" ) ? 0 : 1,
				item,
				itemClass,
				itemTheme,
				a,
				last,
				splittheme,
				countParent,
				icon,
				pos,
				numli;

			if ( counter ) {
				$list.find( ".ui-li-dec" ).remove();
			}

			for ( pos = 0, numli = li.length; pos < numli; pos++ ) {
				item = li.eq( pos );
				itemClass = "ui-li";

				// If we're creating the element, we update it regardless
				if ( create || !item.hasClass( "ui-li" ) ) {
					itemTheme = item.jqmData( "theme" ) || o.theme;
					a = item.children( "a" );

					if ( a.length ) {
						icon = item.jqmData( "icon" );

						item.buttonMarkup({
							wrapperEls: "div",
							shadow: false,
							corners: false,
							iconpos: "right",
							/* icon: a.length > 1 || icon === false ? false : icon || "arrow-r",*/
							icon: false,	/* Remove unnecessary arrow icon */
							theme: itemTheme
						});

						if ( ( icon != false ) && ( a.length == 1 ) ) {
							item.addClass( "ui-li-has-arrow" );
						}

						a.first().addClass( "ui-link-inherit" );

						if ( a.length > 1 ) {
							itemClass += " ui-li-has-alt";

							last = a.last();
							splittheme = listsplittheme || last.jqmData( "theme" ) || o.splitTheme;

							last.appendTo(item)
								.attr( "title", last.getEncodedText() )
								.addClass( "ui-li-link-alt" )
								.empty()
								.buttonMarkup({
									shadow: false,
									corners: false,
									theme: itemTheme,
									icon: false,
									iconpos: false
								})
								.find( ".ui-btn-inner" )
								.append(
									$( "<span />" ).buttonMarkup( {
										shadow : true,
										corners : true,
										theme : splittheme,
										iconpos : "notext",
										icon : listspliticon || last.jqmData( "icon" ) || o.splitIcon
									})
								);
						}
					} else if ( item.jqmData( "role" ) === "list-divider" ) {

						itemClass += " ui-li-divider ui-btn ui-bar-" + dividertheme;
						item.attr( "role", "heading" );

						//reset counter when a divider heading is encountered
						if ( counter ) {
							counter = 1;
						}

					} else {
						itemClass += " ui-li-static ui-body-" + itemTheme;
					}
				}

				if ( counter && itemClass.indexOf( "ui-li-divider" ) < 0 ) {
					countParent = item.is( ".ui-li-static:first" ) ? item : item.find( ".ui-link-inherit" );

					countParent.addClass( "ui-li-jsnumbering" )
						.prepend( "<span class='ui-li-dec'>" + (counter++) + ". </span>" );
				}

				item.add( item.children( ".ui-btn-inner" ) ).addClass( itemClass );

				self._itemApply( $list, item );
			}

			this._refreshCorners( create );
		},

		//create a string for ID/subpage url creation
		_idStringEscape: function ( str ) {
			return str.replace(/\W/g , "-");

		},

		_createSubPages: function () {
			var parentList = this.element,
				parentPage = parentList.closest( ".ui-page" ),
				parentUrl = parentPage.jqmData( "url" ),
				parentId = parentUrl || parentPage[ 0 ][ $.expando ],
				parentListId = parentList.attr( "id" ),
				o = this.options,
				dns = "data-" + $.mobile.ns,
				self = this,
				persistentFooterID = parentPage.find( ":jqmData(role='footer')" ).jqmData( "id" ),
				hasSubPages,
				newRemove;

			if ( typeof listCountPerPage[ parentId ] === "undefined" ) {
				listCountPerPage[ parentId ] = -1;
			}

			parentListId = parentListId || ++listCountPerPage[ parentId ];

			$( parentList.find( "li>ul, li>ol" ).toArray().reverse() ).each(function ( i ) {
				var self = this,
					list = $( this ),
					listId = list.attr( "id" ) || parentListId + "-" + i,
					parent = list.parent(),
					nodeEls,
					title = nodeEls.first().getEncodedText(),//url limits to first 30 chars of text
					id = ( parentUrl || "" ) + "&" + $.mobile.subPageUrlKey + "=" + listId,
					theme = list.jqmData( "theme" ) || o.theme,
					countTheme = list.jqmData( "counttheme" ) || parentList.jqmData( "counttheme" ) || o.countTheme,
					newPage,
					anchor;

				nodeEls = $( list.prevAll().toArray().reverse() );
				nodeEls = nodeEls.length ? nodeEls : $( "<span>" + $.trim(parent.contents()[ 0 ].nodeValue) + "</span>" );

				//define hasSubPages for use in later removal
				hasSubPages = true;

				newPage = list.detach()
							.wrap( "<div " + dns + "role='page' " +	dns + "url='" + id + "' " + dns + "theme='" + theme + "' " + dns + "count-theme='" + countTheme + "'><div " + dns + "role='content'></div></div>" )
							.parent()
								.before( "<div " + dns + "role='header' " + dns + "theme='" + o.headerTheme + "'><div class='ui-title'>" + title + "</div></div>" )
								.after( persistentFooterID ? $( "<div " + dns + "role='footer' " + dns + "id='" + persistentFooterID + "'>" ) : "" )
								.parent()
									.appendTo( $.mobile.pageContainer );

				newPage.page();

				anchor = parent.find('a:first');

				if ( !anchor.length ) {
					anchor = $( "<a/>" ).html( nodeEls || title ).prependTo( parent.empty() );
				}

				anchor.attr( "href", "#" + id );

			}).extendablelist();

			// on pagehide, remove any nested pages along with the parent page, as long as they aren't active
			// and aren't embedded
			if ( hasSubPages &&
					parentPage.is( ":jqmData(external-page='true')" ) &&
					parentPage.data( "page" ).options.domCache === false ) {

				newRemove = function ( e, ui ) {
					var nextPage = ui.nextPage, npURL;

					if ( ui.nextPage ) {
						npURL = nextPage.jqmData( "url" );
						if ( npURL.indexOf( parentUrl + "&" + $.mobile.subPageUrlKey ) !== 0 ) {
							self.childPages().remove();
							parentPage.remove();
						}
					}
				};

				// unbind the original page remove and replace with our specialized version
				parentPage
					.unbind( "pagehide.remove" )
					.bind( "pagehide.remove", newRemove);
			}
		},

		// TODO sort out a better way to track sub pages of the extendable listview this is brittle
		childPages: function () {
			var parentUrl = this.parentPage.jqmData( "url" );

			return $( ":jqmData(url^='" +  parentUrl + "&" + $.mobile.subPageUrlKey + "')" );
		}
	});

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.extendablelist.prototype.options.initSelector, e.target ).extendablelist();
	});

}( jQuery ));


/*
* Module Name : jquery.mobile.tizen.clrlib
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/


ensureNS("jQuery.mobile.tizen.clrlib");

jQuery.extend( jQuery.mobile.tizen.clrlib, 
{
    nearestInt: function(val) { 
        var theFloor = Math.floor(val);

        return (((val - theFloor) > 0.5) ? (theFloor + 1) : theFloor);
    },

    /*
     * Converts html color string to rgb array.
     *
     * Input: string clr_str, where
     * clr_str is of the form "#aabbcc"
     *
     * Returns: [ r, g, b ], where
     * r is in [0, 1]
     * g is in [0, 1]
     * b is in [0, 1]
     */
    HTMLToRGB: function(clr_str) {
        clr_str = (('#' == clr_str.charAt(0)) ? clr_str.substring(1) : clr_str);

        return ([
            clr_str.substring(0, 2),
            clr_str.substring(2, 4),
            clr_str.substring(4, 6)
            ].map(function(val) {
                return parseInt(val, 16) / 255.0;
            }));
    },

    /*
     * Converts rgb array to html color string.
     *
     * Input: [ r, g, b ], where
     * r is in [0, 1]
     * g is in [0, 1]
     * b is in [0, 1]
     *
     * Returns: string of the form "#aabbcc"
     */
    RGBToHTML: function(rgb) {
        return ("#" + 
            rgb.map(function(val) {
                      var ret = val * 255,
                          theFloor = Math.floor(ret);

                      ret = ((ret - theFloor > 0.5) ? (theFloor + 1) : theFloor);
                      ret = (((ret < 16) ? "0" : "") + (ret & 0xff).toString(16));
                      return ret;
                  })
               .join(""));
    },

    /*
     * Converts hsl to rgb.
     *
     * From http://130.113.54.154/~monger/hsl-rgb.html
     *
     * Input: [ h, s, l ], where
     * h is in [0, 360]
     * s is in [0,   1]
     * l is in [0,   1]
     *
     * Returns: [ r, g, b ], where
     * r is in [0, 1]
     * g is in [0, 1]
     * b is in [0, 1]
     */
    HSLToRGB: function(hsl) {
        var h = hsl[0] / 360.0, s = hsl[1], l = hsl[2];

        if (0 === s)
            return [ l, l, l ];

        var temp2 = ((l < 0.5)
                ? l * (1.0 + s)
                : l + s - l * s),
            temp1 = 2.0 * l - temp2,
            temp3 = {
                r: h + 1.0 / 3.0,
                g: h,
                b: h - 1.0 / 3.0
            };

        temp3.r = ((temp3.r < 0) ? (temp3.r + 1.0) : ((temp3.r > 1) ? (temp3.r - 1.0) : temp3.r));
        temp3.g = ((temp3.g < 0) ? (temp3.g + 1.0) : ((temp3.g > 1) ? (temp3.g - 1.0) : temp3.g));
        temp3.b = ((temp3.b < 0) ? (temp3.b + 1.0) : ((temp3.b > 1) ? (temp3.b - 1.0) : temp3.b));

        ret = [
            (((6.0 * temp3.r) < 1) ? (temp1 + (temp2 - temp1) * 6.0 * temp3.r) :
            (((2.0 * temp3.r) < 1) ? temp2 :
            (((3.0 * temp3.r) < 2) ? (temp1 + (temp2 - temp1) * ((2.0 / 3.0) - temp3.r) * 6.0) :
             temp1))),
            (((6.0 * temp3.g) < 1) ? (temp1 + (temp2 - temp1) * 6.0 * temp3.g) :
            (((2.0 * temp3.g) < 1) ? temp2 :
            (((3.0 * temp3.g) < 2) ? (temp1 + (temp2 - temp1) * ((2.0 / 3.0) - temp3.g) * 6.0) :
             temp1))),
            (((6.0 * temp3.b) < 1) ? (temp1 + (temp2 - temp1) * 6.0 * temp3.b) :
            (((2.0 * temp3.b) < 1) ? temp2 :
            (((3.0 * temp3.b) < 2) ? (temp1 + (temp2 - temp1) * ((2.0 / 3.0) - temp3.b) * 6.0) :
             temp1)))]; 

        return ret;
    },

    /*
     * Converts hsv to rgb.
     *
     * Input: [ h, s, v ], where
     * h is in [0, 360]
     * s is in [0,   1]
     * v is in [0,   1]
     *
     * Returns: [ r, g, b ], where
     * r is in [0, 1]
     * g is in [0, 1]
     * b is in [0, 1]
     */
    HSVToRGB: function(hsv) {
        return $.mobile.tizen.clrlib.HSLToRGB($.mobile.tizen.clrlib.HSVToHSL(hsv));
    },

    /*
     * Converts rgb to hsv.
     *
     * from http://coecsl.ece.illinois.edu/ge423/spring05/group8/FinalProject/HSV_writeup.pdf
     *
     * Input: [ r, g, b ], where
     * r is in [0,   1]
     * g is in [0,   1]
     * b is in [0,   1]
     *
     * Returns: [ h, s, v ], where
     * h is in [0, 360]
     * s is in [0,   1]
     * v is in [0,   1]
     */
    RGBToHSV: function(rgb) {
        var min, max, delta, h, s, v, r = rgb[0], g = rgb[1], b = rgb[2];

        min = Math.min(r, Math.min(g, b));
        max = Math.max(r, Math.max(g, b));
        delta = max - min;

        h = 0;
        s = 0;
        v = max;

        if (delta > 0.00001) {
            s = delta / max;

            if (r === max)
                h = (g - b) / delta ;
            else
            if (g === max)
                h = 2 + (b - r) / delta ;
            else
                h = 4 + (r - g) / delta ;

            h *= 60 ;

            if (h < 0)
                h += 360 ;
        }

        return [h, s, v];
    },

    /*
     * Converts hsv to hsl.
     *
     * Input: [ h, s, v ], where
     * h is in [0, 360]
     * s is in [0,   1]
     * v is in [0,   1]
     *
     * Returns: [ h, s, l ], where
     * h is in [0, 360]
     * s is in [0,   1]
     * l is in [0,   1]
     */
    HSVToHSL: function(hsv) {
        var max = hsv[2],
            delta = hsv[1] * max,
            min = max - delta,
            sum = max + min,
            half_sum = sum / 2,
            s_divisor = ((half_sum < 0.5) ? sum : (2 - max - min));

        return [ hsv[0], ((0 == s_divisor) ? 0 : (delta / s_divisor)), half_sum ];
    },

    /*
     * Converts rgb to hsl
     *
     * Input: [ r, g, b ], where
     * r is in [0,   1]
     * g is in [0,   1]
     * b is in [0,   1]
     *
     * Returns: [ h, s, l ], where
     * h is in [0, 360]
     * s is in [0,   1]
     * l is in [0,   1]
     */
    RGBToHSL: function(rgb) {
        return $.mobile.tizen.clrlib.HSVToHSL($.mobile.tizen.clrlib.RGBToHSV(rgb));
    }
});


/*
* Module Name : jquery.mobile.tizen.configure
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/*
 * set TIZEN specific configures
 */

( function ( $, window, undefined ) {

	/* set default transition */
	$.mobile.defaultPageTransition = "none";

	/* depth transition */
	$.mobile.transitionHandlers.depth = $.mobile.transitionHandlers.simultaneous;
	$.mobile.transitionFallbacks.depth = "fade";

	/* Button data-corners default value */
	$.fn.buttonMarkup.defaults.corners = false;

	/* button hover delay */
	$.mobile.buttonMarkup.hoverDelay = 0;

}( jQuery, this ) );



/*
* Module Name : widgets/jquery.mobile.tizen.gallery3d
* Copyright (c) 2013 Samsung Electronics Co., Ltd.
* License : Flora License
*/

/**
 *	The gallery 3D widget enables 3-dimensional arranging and handling of images.
 *
 *	HTML Attributes:
 *
 *		data-thumbnail-cache : Determines whether to cache and resize images.
 *		To improve performance, the size of image(s) displayed on the screen should be a square (under 128X128 pixels).
 *		"data-thumbnail-cache" option resizes the gallery images under 128x128 pixels and stores the images on a local storage.
 *		So when a gallery3D widget is re-launched, the widget reuses the storage and the launching time can be improved.
 *		A browser or web runtime engine must support "Web Storage" feature to use this option.
 *
 *	APIs:
 *
 *		next ( void )
 *			: This method moves each image forward.
 *		prev ( void )
 *			: This method moves each image backward.
 *		select ( [number] )
 *			: When the select method is called with an argument, the method selects the image of a given index.
 *			If the method is called with no argument, it returns the selected image's object.
 *		add ( object or string [, number] )
 *			This method adds an image to the gallery 3D widget.
 *			If the second argument is not defined, the image is added at the 0 position.
 *		remove ( [number] )
 *			: This method deletes an image from the gallery 3D widget.
 *			The argument defines the index of the image to be deleted.
 *			If the argument is not defined, the current image is removed.
 *		clearThumbnailCache ( void )
 *			: This method clears the cache data of all images when the thumbnailCache option is set to true.
 *		refresh ( void )
 *			: This method updates and redraws current widget.
 *		empty ( void )
 *			: This method removes all of images from the gallery 3D widget.
 *		length ( void )
 *			: This method gets the number of images.
 *
 *	Events:
 *
 *		select : Triggered when an image is selected.
 *
 *	Examples:
 *
 *		<script>
 *			$( "#gallery3d" ).on( "gallery3dcreate", function () {
 *				$( "#gallery3d" ).gallery3d( "add", "01.jpg" );
 *			});
 *		</script>
 *		<div id="gallery3d" data-role="gallery3d"></div>
 */

/**
	@class Gallery3D
	The gallery3d widget displays images along a curved path on a 3-dimensional coordinate system.
	<br/><br/>To add an gallery3d widget to the application, use the following code:

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", "01.jpg" );
			});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/
/**
	@property {Boolean} data-thumbnail-cache
	Determines whether to cache and resize images.
	To improve performance, the size of image(s) displayed on the screen should be a square (under 128X128 pixels).
	"data-thumbnail-cache" option resizes the gallery images under 128x128 pixels and stores the images on a local storage.
	So when a gallery3D widget is re-launched, the widget reuses the storage and the launching time can be improved.
	A browser or web runtime engine must support "Web Storage" feature to use this option.
*/
/**
	@event select
	Triggered when an image is selected.

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", { src: "1.jpg" } )
					.gallery3d( "add", { src: "2.jpg" } )
					.gallery3d( "add", { src: "3.jpg" } );
			}).on( "select", function ( event, data, index ) {
				// Handle the select event
				var urlOfImage = data.src, indexOfImage = index;
			});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/
/**
	@method next
	This method moves each image forward.

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", { src: "1.jpg" } )
					.gallery3d( "add", { src: "2.jpg" } )
					.gallery3d( "add", { src: "3.jpg" } )
					.gallery3d( "next" );
			});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/
/**
	@method prev
	This method moves each image backward.

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", { src: "1.jpg" } )
					.gallery3d( "add", { src: "2.jpg" } )
					.gallery3d( "add", { src: "3.jpg" } )
					.gallery3d( "prev" );
			});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/
/**
	@method select
	When the select method is called with an argument, the method selects the image of a given index.
	If the method is called with no argument, it returns the selected image's object.

		<script>
			$("#gallery3d").on("gallery3dcreate", function () {
				$("#gallery3d").gallery3d("add", {src: "1.jpg"})
					.gallery3d("add", {src: "2.jpg"})
					.gallery3d("add", {src: "3.jpg"});
			}).on( "gallery3dinit", function () {
				$("#gallery3d").gallery3d("select");
			});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/
/**
	@method add
	This method adds an image to the gallery 3D widget.
	If the second argument is not defined, the image is added at the 0 position.

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", { src: "1.jpg" } );
				$( "#gallery3d" ).gallery3d( "add", "2.jpg", 1 );
			});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/
/**
	@method remove
	This method deletes an image from the gallery 3D widget.
	The argument defines the index of the image to be deleted.
	If an argument isn't inputted, it removes current image.

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", { src: "1.jpg" } )
					.gallery3d( "add", { src: "2.jpg" } )
					.gallery3d( "add", { src: "3.jpg" } );

				$( "#gallery3d" ).gallery3d( "remove" );
				$( "#gallery3d" ).gallery3d( "remove", 1 );
			});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/
/**
	@method clearThumbnailCache
	This method clears the cache data of all images when the thumbnailCache option is set to true.

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", { src: "1.jpg" } )
					.gallery3d( "add", { src: "2.jpg" } )
					.gallery3d( "add", { src: "3.jpg" } );

				$( "#gallery3d" ).gallery3d( "clearThumbnailCache" );
			});
		</script>
		<div id="gallery3d" data-role="gallery3d" data-thumbnail-cache="true"></div>
*/
/**
	@method refresh
	This method updates and redraws current widget.

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", { src: "1.jpg" } )
					.gallery3d( "add", { src: "2.jpg" } )
					.gallery3d( "add", { src: "3.jpg" } );
				}).on("gallery3dinit", function () {
					$("#gallery3d").gallery3d("refresh");
				});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/
/**
	@method empty
	This method removes all of images from the gallery 3D widget.

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", { src: "1.jpg" } )
					.gallery3d( "add", { src: "2.jpg" } )
					.gallery3d( "add", { src: "3.jpg" } );

				$( "#gallery3d" ).gallery3d( "empty" );
			});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/
/**
	@method length
	This method gets the number of images.

		<script>
			$( "#gallery3d" ).on( "gallery3dcreate", function () {
				$( "#gallery3d" ).gallery3d( "add", { src: "1.jpg" } )
					.gallery3d( "add", { src: "2.jpg" } )
					.gallery3d( "add", { src: "3.jpg" } );

				var imagesLength = $( "#gallery3d" ).gallery3d( "length" );
				// imagesLength = 3;
			});
		</script>
		<div id="gallery3d" data-role="gallery3d"></div>
*/

( function ( $, document, window, undefined ) {
	function Node() {
		this.vertices = [
			-1.0, -1.0, 0.0,
			1.0, -1.0, 0.0,
			1.0,  1.0, 0.0,
			-1.0,  1.0, 0.0
		];
		this.textureCoords = [
			1.0, 0.0,
			0.0, 0.0,
			0.0, 1.0,
			1.0, 1.0
		];
		this.normalVectors = [
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0
		];
		this.texture = null;
		this.textureBuffer = null;
		this.textureBufferItemSize = 0;
		this.mashOrder = [];
		this.mvMatrix = null;
		this.level = -1;
		this.targetLevel = 0;
		this.drawable = false;
		this.image = null;
		this.imageID = 0;
	}

	var isPreInitailization  = false,
		glMatrix = {},
		VERTEX_SHADER,
		FRAGMENT_SHADER,
		GlArray32,
		GlArray16,
		preInitialize = function () {
			if ( isPreInitailization ) {
				return;
			}

			window.initGlMatrix( glMatrix );

			VERTEX_SHADER = [
				"attribute vec3 aVertexPosition;",
				"attribute vec2 aTextureCoord;",
				"attribute vec3 aVertexNormal;",
				"uniform mat4 uMoveMatrix;",
				"uniform mat4 uPerspectiveMatrix;",
				"uniform mat3 nNormalMatrix;",
				"uniform vec3 uAmbientColor;",
				"uniform vec3 uLightDirection;",
				"uniform vec3 uDirectionColor;",
				"uniform vec3 uLightDirection_first;",
				"uniform vec3 uLightDirection_second;",
				"varying vec2 vTextureCoord;",
				"varying vec3 vLightWeight;",
				"varying vec4 vFogWeight;",

				"void main(void) {",
				"	vec4 v_Position = uMoveMatrix * vec4(aVertexPosition, 1.0);",
				"	gl_Position = uPerspectiveMatrix * v_Position;",
				"	vTextureCoord = aTextureCoord;",
				"	float fog = 1.0 - ((gl_Position.z + 1.5) / 60.0);",
				"	vFogWeight = clamp( vec4( fog, fog, fog, 1.0), 0.6, 1.0);",
				"	vec3 transNormalVector = nNormalMatrix * aVertexNormal;",

				"	float vLightWeightFirst = 0.0;",
				"	float vLightWeightSecond = max( dot(transNormalVector, uLightDirection_second), 0.0 );",

				"	vLightWeight = uAmbientColor + uDirectionColor * vLightWeightSecond;",
				"}"
			].join( "\n" );

			FRAGMENT_SHADER = [
				"precision mediump float;",
				"varying vec2 vTextureCoord;",
				"varying vec3 vLightWeight;",
				"uniform sampler2D uSampler;",
				"varying vec4 vFogWeight;",

				"void main(void) {",
				"	vec4 TextureColor;",
				"	if ( vTextureCoord.s <= 0.01 || vTextureCoord.s >= 0.99 || vTextureCoord.t <= 0.01 || vTextureCoord.t >= 0.99 ) {",
				"		TextureColor = vec4(1.0, 1.0, 1.0, 0.5);",
				"	} else {",
				"		TextureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));",
				"	}",
				"	TextureColor *= vFogWeight;",
				"	gl_FragColor = vec4(TextureColor.rgb * vLightWeight, TextureColor.a);",
				"}"
			].join( "\n" );

			GlArray32 = ( typeof window.Float32Array !== "undefined" ?
					window.Float32Array :
						( typeof window.WebGLFloatArray !== "undefined" ? window.WebGLFloatArray : Array ) );

			GlArray16 = ( typeof window.Uint16Array !== "undefined" ? window.Uint16Array : Array );

			isPreInitailization = true;
		},
		degreeToRadian = function ( degree ) {
			return degree * Math.PI / 180;
		},
		getContext3D = function ( canvas ) {
			var gl, i,
				contextNames = [ "experimental-webgl", "webkit-3d", "webgl", "moz-webgl" ],
				errorMessage = "Unfortunately, there's a WebGL compatibility problem.\nYou may want to check your system settings.";

			for ( i = 0; i < contextNames.length; i += 1 ) {
				try {
					gl = canvas.getContext( contextNames[i] );
					if ( gl ) {
						break;
					}
				} catch ( e ) {
					alert(  errorMessage );
					return;
				}
			}

			if ( !gl ) {
				alert(  errorMessage );
				return;
			}

			return gl;
		},
		requestAnimationFrame = function ( callback ) {
			var id = window.setTimeout( callback, 1000 / 60 );
			return id;
		},
		cancelAnimationFrame = function ( id ) {
			window.clearTimeout( id );
		};

	$.widget( "tizen.gallery3d", $.mobile.widget, {
		options: {
			thumbnailCache:	false
		},

		_MAX_ITEM_COUNT: 28,
		_ANIMATION_END: 999,
		_DURATION_DEFAULT: 300,
		_DURATION_FIRST: 1600,
		_VIEWPORT_WIDTH: 1024,
		_VIEWPORT_HEIGHT: 456,
		_DIRECTION_LEFT: -1,
		_DIRECTION_RIGHT: +1,

		_gl: null,
		_shaderProgram : null,
		_positionBuffer : null,
		_textureCoordBuffer : null,
		_normalVectorBuffer : null,
		_nodes: null,
		_pMatrix : null,
		_animationID: 0,
		_dragInterval : 0,
		_startTime : 0,
		_sumTime : 0,
		_lightsPositionStack : [
			[0.0, 0.0, -1.0],	// back
			[-0.2, 0.0, 0.7]	// front
		],
		_path: null,
		_swipeThresholdOfBasetimeGap: ( $.support.touch ? 30 : 70 ),
		_swipeThresholdOfSensitivity: ( $.support.touch ? 2.0 : 10.0 ),
		_canvas: null,
		_imageList: [],
		_maxDrawLength: 0,
		_firstImageNumber: 0,
		_lastImageNumber: 0,
		_operationQueue: [],

		_create: function () {
			var self = this,
				view = self.element,
				option = self.options;

			preInitialize();

			self._canvas = $( "<canvas class='ui-gallery3d-canvas'></canvas>" );

			view.addClass( "ui-gallery3d" ).append( self._canvas );
			self._addBehavier();

			self._dragInterval = 1000 / 30;	// 30fps

			$.each( self.options, function ( key, value ) {
				self.options[ key ] = undefined;
				self._setOption( key, value );
			});
		},

		destroy: function () {
			this._imageList.length = 0;
			this._path.length = 0;
			this._final();
			$.mobile.widget.prototype.destroy.call( this );
		},

		_setOption: function ( key, value ) {
			switch ( key ) {
			case "thumbnailCache" :
				if ( typeof value === "string" ) {
					value = ( value === "true" ) ? true : false;
				} else {
					value = !!value;
				}
				this._reset();
				break;
			}

			$.mobile.widget.prototype._setOption.call( this, key, value );
		},

		_init: function ( canvas ) {
			var self = this,
				pathPoints = [
					[40, 0, -48],
					[-12, 0, -40],	// contorl Point of Point1
					[24, 0, -9],		// contorl Point of Point2
					[-5, 0, -5]
				],
				i;

			canvas = canvas || self._canvas;
			if ( !canvas ) {
				return;
			}

			self._gl = self._gl || self._initGL( canvas[0] );
			if ( !self._gl ) {
				return;
			}

			if ( !self._imageList ) {
				return;
			}

			self._shaderProgram = self._shaderProgram || self._initShader( self._gl );
			if ( !self._shaderProgram ) {
				return;
			}

			if ( self._imageList.length > self._MAX_ITEM_COUNT ) {
				self._firstImageNumber = self._imageList.length - 1;
				self._lastImageNumber = self._MAX_ITEM_COUNT - 1;
			}

			self._nodes = self._initBuffers( self._gl, self._shaderProgram );

			self._initTextures( self._gl, self._nodes );

			self._path = $.motionpath( "bezier2d", {
				points: pathPoints,
				maxLevel: self._MAX_ITEM_COUNT
			} );

			for ( i = 0; i < self._nodes.length; i += 1 ) {
				self._path.levels[i] = self._path.levels[i + 1] || 0;
				self._nodes[i].level = i;
			}

			this._setPosition( self._ANIMATION_END, this._DIRECTION_RIGHT );

			while ( this._operationQueue.length ) {
				this._setPosition( self._ANIMATION_END, this._operationQueue.shift() );
			}
		},

		_final: function ( canvas ) {
			var self = this,
				gl = self._gl;

			if ( !gl ) {
				return;
			}

			clearTimeout( this._imageLoadTimer );
			this._imageLoadTimer = null;

			self._stop();

			canvas = canvas || self._canvas;

			$( self._nodes ).each( function ( i ) {
				var node = self._nodes[i];

				if ( node.texture ) {
					gl.deleteTexture( node.texture );
					node.texture = null;
					delete node.image;
					node.image = null;
				}
			});
			this._nodes.length = 0;

			gl.deleteBuffer( self._positionBuffer );
			self._positionBuffer = null;
			gl.deleteBuffer( self._textureCoordBuffer );
			self._textureCoordBuffer = null;
			gl.deleteBuffer( self._normalVectorBuffer );
			self._normalVectorBuffer = null;

			$.webgl.shader.deleteShaders( gl );
			gl.deleteProgram( self._shaderProgram );
			self._shaderProgram = null;

			self._gl = gl = null;
		},

		_addBehavier : function () {
			var self = this,
				view = self.element,
				canvas = self._canvas,
				touchStartEvt = ( $.support.touch ? "touchstart" : "mousedown" ),
				touchMoveEvt = ( $.support.touch ? "touchmove" : "mousemove" ) + ".gallery3d",
				touchEndEvt = ( $.support.touch ? "touchend" : "mouseup" ) + ".gallery3d",
				$document = $( document );

			canvas.on( "webglcontextlost", function ( e ) {
				e.preventDefault();
			}).on( "webglcontextrestored", function ( e ) {
				self._init();
			}).on( touchStartEvt, function ( e ) {
				var i = 0,
					startX = 0,
					deltaMaxSteps = 20,
					deltas = [ deltaMaxSteps ],
					deltaTimes = [ deltaMaxSteps ],
					deltaIndex = 0,
					dragValue = 0,
					dragDirection = false,
					prevTime = 0;

				e.preventDefault();
				e.stopPropagation();

				if ( self._imageList.length <= 1 ) {
					return;
				}

				self._stop();

				startX =  $.support.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX;
				prevTime = $.now();

				for ( i = 0; i < deltaMaxSteps; i += 1 ) {
					deltas[i] = startX;
					deltaTimes[i] = $.now();
				}

				deltaIndex += 1;

				view.on( touchMoveEvt, function ( e ) {
					var x, dx, interval;

					e.preventDefault();
					e.stopPropagation();

					x =  $.support.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX;
					dx = startX - x;

					deltas[deltaIndex] = x;
					deltaTimes[deltaIndex] = $.now();
					interval = deltaTimes[deltaIndex] - prevTime;

					deltaIndex = ( deltaIndex + 1 ) % deltaMaxSteps;

					// Validation of drag
					if ( Math.abs( dx ) >= 10 && interval >= self._dragInterval ) {
						if ( dragDirection !== ( ( dx < 0 ) ? self._DIRECTION_RIGHT : self._DIRECTION_LEFT ) ) {
							dragValue = 0;
							dragDirection = ( dx < 0 ) ? self._DIRECTION_RIGHT : self._DIRECTION_LEFT;
						}

						dragValue += Math.abs( dx ) / 100;
						if ( dragValue >= 1 ) {
							self._setPosition( self._ANIMATION_END, dragDirection );
							dragValue = 0;
						} else {
							self._setPosition( dragValue, dragDirection );
						}
						self._drawScene();
						startX = x;
						prevTime = $.now();
					}
				}).on( touchEndEvt, function ( e ) {
					var baseTime = 0,
						recent = -1,
						index = 0,
						previous = 0,
						baseTimeRatio = 0,
						fx = 0,
						lastX = 0,
						velocityX = 0,
						dx = 0,
						isSwipe = true,
						direction;

					e.preventDefault();
					e.stopPropagation();

					// Validation of swipe
					baseTime = $.now() - self._swipeThresholdOfBasetimeGap;
					lastX = $.support.touch ? e.originalEvent.changedTouches[0].pageX : e.pageX;
					dx = startX - lastX;
					startX = 0;
					for ( i = 0; i < deltaMaxSteps; i += 1 ) {
						index = ( deltaIndex + i ) % deltaMaxSteps;
						if ( deltaTimes[index] > baseTime ) {
							recent = index;
							break;
						}
					}
					if ( recent < 0 ) {
						isSwipe = false;
					}

					if ( isSwipe ) {
						previous = recent;
						for ( i = 0; i < deltaMaxSteps; i += 1 ) {
							previous = ( previous - 1 + deltaMaxSteps ) % deltaMaxSteps;
							if ( deltaTimes[previous] < deltaTimes[recent] ) {
								break;
							}
						}
						// too slow or too fast
						if ( i === deltaMaxSteps || baseTime < deltaTimes[previous] ) {
							isSwipe = false;
						}
					}

					if ( isSwipe ) {
						baseTimeRatio = ( baseTime - deltaTimes[previous] ) / ( deltaTimes[recent] - deltaTimes[previous] );
						fx = ( 1.0 - baseTimeRatio ) * deltas[previous] + baseTimeRatio * deltas[recent];
						if ( Math.abs( fx - lastX ) < self._swipeThresholdOfSensitivity ) {
							fx = lastX;
						}
						velocityX = parseInt( ( lastX - fx ) / ( $.now() - baseTime ), 10 );
					}

					if ( isSwipe && velocityX ) {
						direction = ( velocityX < 0 ) ? self._DIRECTION_LEFT : self._DIRECTION_RIGHT;
						self._run( direction, Math.abs( velocityX ), dragValue );
					} else if ( dragDirection !== 0 && dragValue ) {
						self._animate( null, self._DURATION_DEFAULT * ( 1 - dragValue ), dragDirection, 0, dragValue );
					}

					view.off( ".gallery3d" );
					$document.off( ".gallery3d" );
				});

				$document.on( touchMoveEvt + " " + touchEndEvt, function () {
					view.trigger( touchEndEvt );
				});
			});
		},

		// ----------------------------------------------------------
		// WebGL
		// ----------------------------------------------------------
		_initGL: function ( canvas ) {
			var self = this,
				mat4 = glMatrix.mat4,
				gl;

			gl = getContext3D( canvas );
			if ( !gl ) {
				return null;
			}

			gl.enable( gl.BLEND );
			gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

			gl.enable( gl.DEPTH_TEST );
			gl.depthFunc( gl.LEQUAL );

			// Fit the canvas size to Gallery3d widget
			canvas.style.width = "100%";

			// Set the drawing buffer size of the canvas
			canvas.width = self._VIEWPORT_WIDTH;
			canvas.height = self._VIEWPORT_HEIGHT;

			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
			gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );
			self._pMatrix = mat4.create();
			mat4.perspective( 40, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0, self._pMatrix );

			gl.clearColor( 0.15, 0.15, 0.15, 1.0 );
			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

			return gl;
		},

		_initShader : function ( gl ) {
			var self = this,
				shaderProgram;

			shaderProgram = $.webgl.shader.addShaderProgram( self._gl, VERTEX_SHADER, FRAGMENT_SHADER );
			gl.useProgram( shaderProgram );

			shaderProgram.vertexPositionAttr = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
			gl.enableVertexAttribArray( shaderProgram.vertexPositionAttr );

			shaderProgram.textureCoordAttr = gl.getAttribLocation( shaderProgram, "aTextureCoord" );
			gl.enableVertexAttribArray( shaderProgram.textureCoordAttr );

			// Set light normal vectors for lighting~
			shaderProgram.vertexNormalAttr = gl.getAttribLocation( shaderProgram, "aVertexNormal" );
			gl.enableVertexAttribArray( shaderProgram.vertexNormalAttr );

			shaderProgram.perspectiveMU = gl.getUniformLocation( shaderProgram, "uPerspectiveMatrix");
			shaderProgram.transformMU = gl.getUniformLocation( shaderProgram, "uMoveMatrix");
			shaderProgram.sampleUniform = gl.getUniformLocation( shaderProgram, "uSampler");

			// Set light variables~
			shaderProgram.normalMU = gl.getUniformLocation( shaderProgram, "nNormalMatrix");
			shaderProgram.ambientColorU = gl.getUniformLocation( shaderProgram, "uAmbientColor");
			shaderProgram.lightDirU_first = gl.getUniformLocation( shaderProgram, "uLightDirection_first");
			shaderProgram.lightDirU_second = gl.getUniformLocation( shaderProgram, "uLightDirection_second");
			shaderProgram.directionColorU = gl.getUniformLocation( shaderProgram, "uDirectionColor");

			return shaderProgram;
		},

		_initBuffers: function ( gl, shaderProgram ) {
			var self = this,
				i = 0,
				mashBase = 0,
				vertices = [],
				textureCoords = [],
				normalVectors = [],
				nodes = [],
				maxDrawLength = self._MAX_ITEM_COUNT;

			for ( i = 0; i < self._imageList.length + 1; i += 1 ) {
				nodes[i] = new Node();
				$.merge( vertices, nodes[i].vertices );
				$.merge( textureCoords, nodes[i].textureCoords );
				$.merge( normalVectors, nodes[i].normalVectors );

				nodes[i].textureBuffer = gl.createBuffer();
				gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, nodes[i].textureBuffer );
				mashBase = i * 4;
				nodes[i].meshOrder = [
					mashBase, mashBase + 1, mashBase + 2,
					mashBase + 2, mashBase + 3, mashBase
				];
				gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new GlArray16( nodes[i].meshOrder ), gl.STATIC_DRAW );
				gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null ); // release buffer memory
				nodes[i].textureBufferItemSize = 6;
			}

			self._positionBuffer = $.webgl.buffer.attribBufferData( gl, new GlArray32( vertices ) );
			self._positionBuffer.itemSize = 3;

			self._textureCoordBuffer = $.webgl.buffer.attribBufferData( gl, new GlArray32( textureCoords ) );
			self._textureCoordBuffer.itemSize = 2;

			self._normalVectorBuffer = $.webgl.buffer.attribBufferData( gl, new GlArray32( normalVectors ) ); // Vertex's normal vector for Direction light
			self._normalVectorBuffer.itemSize = 3;

			// Ambient light
			gl.uniform3f( shaderProgram.ambientColorU, 0.1, 0.1, 0.1 );
			// Direcntion light
			gl.uniform3f( shaderProgram.directionColorU, 1.0, 1.0, 1.0 );

			return nodes;
		},

		// ----------------------------------------------------------
		// Texture
		// ----------------------------------------------------------
		_initTextures: function ( gl, nodes ) {
			var self = this,
				count = 0;

			this._imageLoadTimer = setTimeout( function step() {
				var node = nodes[count], url;

				if ( self._imageList[count] ) {
					url = self._imageList[count].src;
					node.texture = gl.createTexture();
					self._loadImage( url, count, count, gl, nodes );
				}

				count++;
				if ( count < nodes.length ) {
					self._imageLoadTimer = setTimeout( step, 25 );
				}
			}, 25 );
		},

		_loadImage: function ( url, i, imageID, gl, nodes ) {
			var self = this,
				isMipmap = false,
				node;

			gl = gl || self._gl;
			nodes = nodes || self._nodes;
			isMipmap = isMipmap || false;
			node = nodes[i];
			node.image = node.image || new Image();
			node.imageID = imageID;

			$( node.image ).one( "load", function ( e ) {
				self._bindTexture( gl, node, this, isMipmap );

				if ( !self._animationID ) {
					self._setPosition( 0, 0 );
				}
			});

			if ( self.options.thumbnailCache ) {
				$.imageloader.getThumbnail( url, function ( result ) {
					if ( result === "NOT_FOUND_ERR" ) {
						$.imageloader.setThumbnail( url, function ( result ) {
							if ( result && result.length > 30 ) {
								node.image.src = result;
								isMipmap = true;
							} else {
								node.image.src = url;
							}
						});
					} else if ( result && result.length > 30 ) {
						node.image.src = result;
						isMipmap = true;
					} else {
						node.image.src = url;
					}
				});
			} else {
				node.image.src = url;
			}
		},

		_bindTexture: function ( gl, node, image, isMipmap ) {
			if ( !node || !node.texture ) {
				return;
			}

			gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );

			gl.bindTexture( gl.TEXTURE_2D, node.texture );
			gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );

			if ( isMipmap ) {
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
				gl.generateMipmap( gl.TEXTURE_2D );
			} else {
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
			}

			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

			node.texture.loaded = true;

			// release texture memory
			gl.bindTexture( gl.TEXTURE_2D, null );
		},

		// ----------------------------------------------------------
		// rendering
		// ----------------------------------------------------------
		_setPosition: function ( progress, direction ) {
			var self = this,
				mat4 = glMatrix.mat4,
				nodes = self._nodes,
				imageList = self._imageList,
				imageListLength = imageList.length,
				itemCount = self._MAX_ITEM_COUNT,
				displayLength = ( imageListLength > itemCount ) ? itemCount : imageListLength,
				nextLevelLenth = 0,
				i = 0,
				t = 0,
				position = 0,
				angle = 0,
				current = 0,
				next = 0,
				nextLevel = 0,
				path = self._path;

			nextLevelLenth = ( direction >= 0 ) ? displayLength + 1 : displayLength;

			for ( i = 0; i < displayLength; i += 1 ) {
				if ( !nodes[i].mvMatrix ) {
					nodes[i].mvMatrix = mat4.create();
				}

				if ( direction > 0 && nodes[i].level >= displayLength ) {
					nodes[i].level = 0;
				}

				current = path.levels[nodes[i].level];
				nextLevel = ( nodes[i].level + nextLevelLenth + direction ) % nextLevelLenth;
				next = path.levels[nextLevel];

				if ( imageListLength > itemCount ) {
					if ( direction > 0 && nextLevel === 1
							&& self._firstImageNumber !== nodes[i].imageID ) {
						self._loadImage( imageList[self._firstImageNumber].src, i, self._firstImageNumber );
					} else if ( direction < 0 && nextLevel === nextLevelLenth - 1
							&& self._lastImageNumber !== nodes[i].imageID ) {
						self._loadImage( imageList[self._lastImageNumber].src, i, self._lastImageNumber );
					}
				}

				mat4.identity( nodes[i].mvMatrix );
				mat4.translate( nodes[i].mvMatrix, [-2.0, -2.0, 1.0] );
				mat4.rotate( nodes[i].mvMatrix, degreeToRadian( 19 ), [1, 0, 0] );

				t = ( current + ( next - current ) * ( ( progress > 1 ) ? 1 : progress ) );

				if ( progress >= self._ANIMATION_END ) {
					nodes[i].level = nextLevel || displayLength;
					t = path.levels[nodes[i].level];
				}

				if ( ( progress < self._ANIMATION_END )
						&& ( direction <= 0 && nodes[i].level < 1 ) ) {
					nodes[i].drawable = false;
				} else {
					nodes[i].drawable = true;
				}

				if ( progress === self._ANIMATION_END && nodes[i].level === 1 ) {
					self.element.trigger( "select", [imageList[nodes[i].imageID], nodes[i].imageID] );
				}

				position = path.getPosition( t );
				angle = path.getAngle( t );

				mat4.translate( nodes[i].mvMatrix, position );
				mat4.rotate( nodes[i].mvMatrix, angle, [0, 1, 0] );
			}

			if ( imageListLength > itemCount && progress >= self._ANIMATION_END ) {
				self._firstImageNumber = ( self._firstImageNumber - direction ) % imageListLength;
				if ( self._firstImageNumber < 0 ) {
					self._firstImageNumber = imageListLength - 1;
				}

				self._lastImageNumber = ( self._lastImageNumber - direction ) % imageListLength;
				if ( self._lastImageNumber < 0 ) {
					self._lastImageNumber = imageListLength - 1;
				}
			}
			self._drawScene();
		},

		_drawScene: function () {
			if ( !this._gl || !this._shaderProgram ) {
				return;
			}

			var self = this,
				gl = self._gl,
				shaderProgram = self._shaderProgram,
				nodes = self._nodes,
				nodesLength = nodes.length,
				i;

			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

			gl.bindBuffer( gl.ARRAY_BUFFER, self._positionBuffer );
			gl.vertexAttribPointer( shaderProgram.vertexPositionAttr, self._positionBuffer.itemSize, gl.FLOAT, false, 0, 0 );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, self._textureCoordBuffer );
			gl.vertexAttribPointer( shaderProgram.textureCoordAttr, self._textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0 );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );

			gl.bindBuffer( gl.ARRAY_BUFFER, self._normalVectorBuffer );
			gl.vertexAttribPointer( shaderProgram.vertexNormalAttr, self._normalVectorBuffer.itemSize, gl.FLOAT, false, 0, 0 );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );

			for ( i = 0; i < nodesLength; i += 1 ) {
				if ( nodes[i].drawable ) {
					self._drawElement( self._pMatrix, nodes[i] );
				}
			}
		},

		_drawElement: function ( perspectiveMatrix, targetNode ) {
			var self = this,
				gl = self._gl,
				vec3 = glMatrix.vec3,
				mat3 = glMatrix.mat3,
				mat4 = glMatrix.mat4,
				shaderProgram = self._shaderProgram,
				moveMatrix = targetNode.mvMatrix,
				texture = targetNode.texture,
				meshIndexBuffer = targetNode.textureBuffer,
				meshIndexBufferItemSize = targetNode.textureBufferItemSize,
				lightPositions = self._lightsPositionStack,
				LightDir,
				normalMatrix;

			if ( !moveMatrix || !texture || !texture.loaded ) {
				return;
			}

			gl.activeTexture( gl.TEXTURE0 );
			gl.bindTexture( gl.TEXTURE_2D, texture );
			gl.uniform1i( shaderProgram.sampleUniform, 0 );

			LightDir = vec3.create();
			vec3.normalize( lightPositions[0], LightDir );
			vec3.scale( LightDir, -8 );
			gl.uniform3fv( shaderProgram.lightDirU_first, LightDir );

			vec3.normalize( lightPositions[1], LightDir );
			vec3.scale( LightDir, -1 );
			gl.uniform3fv( shaderProgram.lightDirU_second, LightDir );
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, meshIndexBuffer );

			gl.uniformMatrix4fv( shaderProgram.perspectiveMU, false, perspectiveMatrix );
			gl.uniformMatrix4fv( shaderProgram.transformMU, false, moveMatrix );

			normalMatrix = mat3.create();
			mat4.toInverseMat3( moveMatrix, normalMatrix );
			mat3.transpose( normalMatrix );
			gl.uniformMatrix3fv( shaderProgram.normalMU, false, normalMatrix );

			gl.drawElements( gl.TRIANGLES, meshIndexBufferItemSize, gl.UNSIGNED_SHORT, 0 );

			// release buffer memory
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );

			// release texture memory
			gl.bindTexture( gl.TEXTURE_2D, null );
		},

		// ----------------------------------------------------------
		// Animation
		// ----------------------------------------------------------
		_animate: function ( easingType, duration, direction, repeatCount, startValue, _removeCount ) {
			var self = this,
				timeNow = $.now(),
				progress,
				removeCount = 0;

			easingType = easingType || "linear";
			startValue = startValue || 0;
			_removeCount = _removeCount || 0;

			if ( self._sumTime >= duration ) {
				self._setPosition( self._ANIMATION_END, direction );
				self._stop();
				return;
			}

			if ( self._startTime === 0 ) {
				self._startTime = timeNow;
			} else {
				self._sumTime = timeNow - self._startTime;
				progress = $.easing[ easingType ]( self._sumTime / duration, self._sumTime, startValue, repeatCount + 1, duration );
				removeCount = parseInt( Math.abs( progress ), 10 );

				if ( _removeCount !== removeCount ) {
					self._setPosition( self._ANIMATION_END, direction );
					_removeCount = removeCount;

					if ( ( repeatCount - _removeCount ) >= 0 ) {
						self._animate( easingType, duration, direction, repeatCount, startValue, _removeCount );
					} else {
						self._stop();
					}
					return;
				}

				self._setPosition( progress - _removeCount, direction );
			}

			self._animationID = requestAnimationFrame( function () {
				self._animate( easingType, duration, direction, repeatCount, startValue, _removeCount );
			});
		},

		_run: function ( direction, repeatCount, startValue ) {
			var self = this,
				repeat = repeatCount || 0,
				duration = self._DURATION_DEFAULT * ( repeat + 1 );

			if ( !self._gl ) {
				self._operationQueue.push( direction );
				return;
			}

			if ( self._imageList.length <= 1 ) {
				return;
			}

			startValue = startValue || 0;
			duration = ( duration >= 0 ) ? duration : 0;

			if ( self._animationID ) {
				self._setPosition( self._ANIMATION_END, direction );
				self._stop();
			}

			self._animate( "easeOutExpo", duration, direction, repeat, startValue );
		},

		_reset: function () {
			if ( !this._canvas || !this._gl ) {
				return;
			}

			this._final();
			this._init();
			this.refresh();
		},

		_stop: function () {
			if ( this._animationID ) {
				cancelAnimationFrame( this._animationID );
			}
			this._animationID = 0;

			this._startTime = 0;
			this._sumTime = 0;
		},

		next: function () {
			this._run( this._DIRECTION_LEFT , 0 );
		},

		prev: function () {
			this._run( this._DIRECTION_RIGHT, 0 );
		},

		refresh: function () {
			var view = this.element,
				canvas = view.find( "canvas.ui-gallery3d-canvas" );

			if ( canvas.width() !== view.width() ) {
				canvas.width( view.width() );
			}

			if ( this._gl && !this._animationID ) {
				this._setPosition( 0, 0 );
			}
		},

		select: function ( index ) {
			var nodes = this._nodes,
				repeat,
				i,
				imageID,
				object = null,
				target = 0,
				direction = 0;

			if ( index && this._animationID ) {
				this._stop();
			}

			for ( i in nodes ) {
				if ( nodes[i].level === 1 ) {
					object = this._imageList[ nodes[i].imageID ];
					imageID = nodes[i].imageID;
					break;
				}
			}

			if ( !index ) {
				return object;
			}

			if ( index < 0 && index >= this._imageList.length ) {
				return;
			}

			target = index - imageID;
			direction = ( target > 0 ) ? this._DIRECTION_LEFT
				: ( ( target < 0 ) ? this._DIRECTION_RIGHT : 0 );
			if ( direction ) {
				this._run( direction, Math.abs( target ) - 1  );
			}
		},

		add: function ( item, index ) {
			if ( !item ) {
				return;
			}

			if ( typeof item === "string" ) {
				item = { "src" : item };
			}

			index = index || 0;
			if ( typeof index !== "number" && index < 0
					&& index >= this._imageList.length ) {
				return;
			}

			this._imageList.splice( index, 0, item );
			if ( this._gl ) {
				this._reset();
			}
		},

		remove: function ( index ) {
			index = index || 0;
			if ( typeof index !== "number" && index < 0
					&& index >= this._imageList.length ) {
				return;
			}

			this._imageList.splice( index, 1 );
			if ( this._gl ) {
				this._reset();
			}
		},

		clearThumbnailCache: function () {
			if ( !this._nodes || ( this._nodes.length <= 0 ) ) {
				return;
			}

			var i, url;
			for ( i = 0; i < this._imageList.length; i += 1 ) {
				url = this._imageList[i].src;
				$.imageloader.removeThumbnail( url );
			}
		},

		empty: function () {
			this._imageList = [];
			this._reset();
		},

		length: function () {
			return this._imageList.length;
		}
	});

	$( document ).on( "pagecreate create", function ( e ) {
		$( ":jqmData(role='gallery3d')" ).gallery3d();
	}).on( "pagechange", function ( e ) {
		$( e.target ).find( ".ui-gallery3d" ).gallery3d( "refresh" );
	});

	$( window ).on( "resize orientationchange", function ( e ) {
		$( ".ui-page-active" ).find( ".ui-gallery3d" ).gallery3d( "refresh" );
	});

} ( jQuery, document, window ) );


/*
* Module Name : widgets/jquery.mobile.tizen.button
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
	@class Button
	The button widget shows a control on the screen that you can use to generate an action event when it is pressed and released. This widget is coded with standard HTML anchor and input elements and then enhanced by jQueryMobile to make it more attractive and usable on a mobile device. Buttons can be used in Tizen as described in the jQueryMobile documentation for buttons.

	To add a button widget to the application, use the following code

		<div data-role="button" data-inline="true">Text Button Test</div>
		<div data-role="button" data-inline="true" data-icon="plus" data-style="circle"></div>
		<div data-role="button" data-inline="true" data-icon="plus" data-style="nobg"></div>

	The button can define callbacks for events as described in the jQueryMobile documentation for button events.<br/>
	You can use methods with the button as described in the jQueryMobile documentation for button methods.
*/

/**
	@property {String} data-style
	Defines the button style. <br/> The default value is box. If the value is set to circle, a circle-shaped button is created. If the value is set to nobg, a button is created without a background.

*/
/**
	@property {String} data-icon
	Defines an icon for a button. Tizen supports 12 icon styles: reveal, closed, opened, info, rename, call, warning, plus, minus, cancel, send, and favorite.

*/


/*
* Module Name : jquery.mobile.tizen.core
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

ensureNS("jQuery.mobile.tizen");

(function () {

/* Tizen enableHWKeyHandler property */
$.mobile.tizen.enableHWKeyHandler = true;

jQuery.extend(jQuery.mobile.tizen, {
	disableSelection: function (element) {
		this.enableSelection(
			$(element).find('*').not( 'input, [type="text"], textarea' ),
			'none'
		);
		return true;
	},

	enableSelection: function (element, value) {
		var val;
		switch ( value ) {
			case 'text' :
			case 'auto' :
			case 'none' :
				val = value;
			break;
			default :
				val = 'auto';
			break;
		}
		return $(element).css( {
			'user-select': val,
			'-moz-user-select': val,
			'-webkit-user-select': val,
			'-o-user-select': val,
			'-ms-transform': val
		} );
    },

    disableContextMenu: function(element) {
	var self = this;
	$(element).find('*').each( function() {
		if( ( $(this).get(0).tagName !== 'INPUT' &&
			$(this).attr("type") !== 'text' ) &&
			$(this).get(0).tagName !== 'TEXTAREA' ) {
			self._disableContextMenu( this );
		}
	} );
    },

    _disableContextMenu: function(element) {

	$(element).each( function() {
		$(this).bind("contextmenu", function( event ) {
			return false;
		} );
	} );
    },

    enableContextMenu: function(element) {
	$(element).each( function() {
		$(this).unbind( "contextmenu" );
	} );
    },

    // Get document-relative mouse coordinates from a given event
    // From: http://www.quirksmode.org/js/events_properties.html#position
    documentRelativeCoordsFromEvent: function(ev) {
        var e = ev ? ev : window.event,
            client = { x: e.clientX, y: e.clientY },
            page   = { x: e.pageX,   y: e.pageY   },
            posx = 0,
            posy = 0;

        // Grab useful coordinates from touch events
        if (e.type.match(/^touch/)) {
            page = {
                x: e.originalEvent.targetTouches[0].pageX,
                y: e.originalEvent.targetTouches[0].pageY
            };
            client = {
                x: e.originalEvent.targetTouches[0].clientX,
                y: e.originalEvent.targetTouches[0].clientY
            };
        }

        if (page.x || page.y) {
            posx = page.x;
            posy = page.y;
        }
        else
        if (client.x || client.y) {
            posx = client.x + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = client.y + document.body.scrollTop  + document.documentElement.scrollTop;
        }

        return { x: posx, y: posy };
    },

	// TODO : offsetX, offsetY. touch events don't have offsetX and offsetY. support for touch devices.
    // check algorithm...
    targetRelativeCoordsFromEvent: function(e) {
        var coords = { x: e.offsetX, y: e.offsetY };

        if (coords.x === undefined || isNaN(coords.x) ||
            coords.y === undefined || isNaN(coords.y)) {
            var offset = $(e.target).offset();
            //coords = documentRelativeCoordsFromEvent(e);	// Old code. Must be checked again.
            coords = $.mobile.tizen.documentRelativeCoordsFromEvent(e);
            coords.x -= offset.left;
            coords.y -= offset.top;
        }

        return coords;
    }
});

})();


/*
* Module Name : widgets/jquery.mobile.tizen.pagelayout
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

(function ( $, undefined ) {

	$.widget( "mobile.pagelayout", $.mobile.widget, {
		options: {
			visibleOnPageShow: true,
			disablePageZoom: true,
			transition: "slide", //can be none, fade, slide (slide maps to slideup or slidedown)
			fullscreen: false,
			tapToggle: true,
			tapToggleBlacklist: "a, input, select, textarea, .ui-header-fixed, .ui-footer-fixed",
			hideDuringFocus: "input, textarea, select",
			updatePagePadding: true,
			// Browser detection! Weeee, here we go...
			// Unfortunately, position:fixed is costly, not to mention probably impossible, to feature-detect accurately.
			// Some tests exist, but they currently return false results in critical devices and browsers, which could lead to a broken experience.
			// Testing fixed positioning is also pretty obtrusive to page load, requiring injected elements and scrolling the window
			// The following function serves to rule out some popular browsers with known fixed-positioning issues
			// This is a plugin option like any other, so feel free to improve or overwrite it
			supportBlacklist: function () {
				var w = window,
					ua = navigator.userAgent,
					platform = navigator.platform,
					// Rendering engine is Webkit, and capture major version
					wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ ),
					wkversion = !!wkmatch && wkmatch[ 1 ],
					ffmatch = ua.match( /Fennec\/([0-9]+)/ ),
					ffversion = !!ffmatch && ffmatch[ 1 ],
					operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ ),
					omversion = !!operammobilematch && operammobilematch[ 1 ];

				if (
					// iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
					( ( platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534 ) ||
						// Opera Mini
						( w.operamini && ({}).toString.call( w.operamini ) === "[object OperaMini]" ) ||
						( operammobilematch && omversion < 7458 ) ||
						//Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
						( ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533 ) ||
						// Firefox Mobile before 6.0 -
						( ffversion && ffversion < 6 ) ||
						// WebOS less than 3
						( window.palmGetResource !== undefined && wkversion && wkversion < 534 ) ||
						// MeeGo
						( ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1 )
				) {
					return true;
				}

				return false;
			},
			initSelector: ":jqmData(role='content')"
		},

		_create: function () {

			var self = this,
				o = self.options,
				$el = self.element;

			// Feature detecting support for
			if ( o.supportBlacklist() ) {
				self.destroy();
				return;
			}

			self._addFixedClass();
			self._addTransitionClass();
			self._bindPageEvents();

			// only content
			self._bindContentControlEvents();

			// Store back-button, to show again
			self._backBtnQueue = [];
		},

		/* add minimum fixed css style to bar(header/footer) and content
		*  it need to update when core source modified(jquery.mobile.page.section.js)
		*  modified from core source cuz initSelector different */
		_addFixedClass: function () {
			var self = this,
				o = self.options,
				$el = self.element,
				$elHeader = $el.siblings( ":jqmData(role='header')" ),
				$elFooter = $el.siblings( ":jqmData(role='footer')" ),
				$elPage = $el.closest(".ui-page");

			$elHeader.addClass( "ui-header-fixed" );
			$elFooter.addClass( "ui-footer-fixed" );

			// "fullscreen" overlay positioning
			if ( o.fullscreen ) {
				$elHeader.addClass( "ui-header-fullscreen" );
				$elFooter.addClass( "ui-footer-fullscreen" );
				$elPage
					.addClass( "ui-page-header-fullscreen" )
					.addClass( "ui-page-footer-fullscreen" );
			} else {
			// If not fullscreen, add class to page to set top or bottom padding
				$elPage.addClass( "ui-page-header-fixed" )
					.addClass( "ui-page-footer-fixed" );
			}
		},

		/* original core source(jquery.mobile.fixedToolbar.js)
		* never changed */
		_addTransitionClass: function () {
			var tclass = this.options.transition;

			if ( tclass && tclass !== "none" ) {
				// use appropriate slide for header or footer
				if ( tclass === "slide" ) {
					tclass = this.element.is( ".ui-header" ) ? "slidedown" : "slideup";
				}

				this.element.addClass( tclass );
			}
		},


		/* Set default page positon
		* 1. add title style to header
		* 2. Set default header/footer position */
		setHeaderFooter: function ( thisPage ) {
			var $elPage = $( thisPage ),
				$elHeader = $elPage.find( ":jqmData(role='header')" ).length ? $elPage.find( ":jqmData(role='header')") : $elPage.siblings( ":jqmData(role='header')"),
				$elContent = $elPage.find( ".ui-content" ),
				$elFooter = $elPage.find( ":jqmData(role='footer')" ),
				$elFooterGroup = $elFooter.find( ":jqmData(role='fieldcontain')" ),
				$elFooterControlGroup = $elFooter.find( ".ui-controlgroup" );

			// divide content mode scrollview and non-scrollview
			if ( !$elPage.is( ".ui-dialog" ) ) {
				if ( $elHeader.jqmData("position") == "fixed" || ( $.support.scrollview && $.tizen.frameworkData.theme.match(/tizen/) ) ) {
					$elHeader
						.css( "position", "fixed" )
						.css( "top", "0px" );
				} else if ( !$.support.scrollview && $elHeader.jqmData("position") != "fixed" ) {
					$elHeader.css( "position", "relative" );
				}
			}

			/* set Title style */
			if ( $elHeader.find("span.ui-title-text-sub").length ) {
				$elHeader.addClass( "ui-title-multiline");
			}

			if ( $elFooterGroup.find( "div" ).is( ".ui-controlgroup-label" ) ) {
				$elFooterGroup.find( "div.ui-controlgroup-label" ).remove();
			}

			if ( $elFooterControlGroup.length ) {
				var anchorPer = 100 / $elFooterControlGroup.find( "a" ).length;
				$elFooterControlGroup.find( "a" ).each( function ( i ) {
					$elFooterControlGroup.find( "a" ).eq( i ).width( anchorPer + "%" );
				});
			}
		},

		_bindPageEvents: function () {
			var self = this,
				o = self.options,
				$el = self.element,
				$elCurrentFooter;

			//page event bindings
			// Fixed toolbars require page zoom to be disabled, otherwise usability issues crop up
			// This method is meant to disable zoom while a fixed-positioned toolbar page is visible
			$el.closest( ".ui-page" )
				.bind( "pagebeforeshow", function ( event ) {
					var thisPage = this;
					if ( o.disablePageZoom ) {
						$.mobile.zoom.disable( true );
					}
					if ( !o.visibleOnPageShow ) {
						self.hide( true );
					}
					self.setHeaderFooter( thisPage );
					self._setContentMinHeight( thisPage );
					self._updateHeaderArea( thisPage );
					self._updateFooterArea( thisPage );
				} )
				.bind( "webkitAnimationStart animationstart updatelayout", function ( e, data ) {
					var thisPage = this;
					if ( o.updatePagePadding ) {
						self.updatePagePadding(thisPage);
						self.updatePageLayout( thisPage, data);
					}
				})

				.bind( "pageshow", function ( event ) {
					var thisPage = this;
					self._setContentMinHeight( thisPage );
					self.updatePagePadding( thisPage );
					self._updateHeaderArea( thisPage );
					self._updateFooterArea( thisPage );

					// check device api : HW key existance
					// TODO: remove these functions, because the HW key is mandatory.
					if ( false ) {
						self._bindHWkeyOnSWBtn();
						self._setHWKeyLayout( thisPage );
					}
					self._setHWKeySupport( thisPage );
					//self._setMenuPopupLayout( thisPage );

					if ( o.updatePagePadding ) {
						$( window ).bind( "throttledresize." + self.widgetName, function () {
							self.updatePagePadding(thisPage);
							self.updatePageLayout( thisPage, true);
							self._updateHeaderArea( thisPage );
							self._updateFooterArea( thisPage );
							self._setContentMinHeight( thisPage );
						});
					}
				})

				.bind( "pagebeforehide", function ( e, ui ) {
					var thisPage = this;
					self._unsetHWKeySupport( thisPage );
					if ( o.disablePageZoom ) {
						$.mobile.zoom.enable( true );
					}
					if ( o.updatePagePadding ) {
						$( window ).unbind( "throttledresize." + self.widgetName );
					}
				});

			window.addEventListener( "softkeyboardchange", function ( e ) {
				var $elDownBtn = $( "<div class='ui-btn-footer-down'></div>" ),
					$elPage = $( ".ui-page-active" ),
					backBtn,
					backBtnPosition = "footer";
				// N_SE-42987 : If self._backBtnQueue.length has value is not 0, this means .ui-btn-back button is still hidden.
				//		So, condition that check self._backBtnQueue value add.
				if ( $elPage.data( "addBackBtn" ) || self._backBtnQueue.length ) {
					$elPage.data( "addBackBtn" ) == "header" ? backBtnPosition = "header" : backBtnPosition = "footer";

					if ( e.state == "on" ) {
						if ( !$elPage.find( ".ui-" + backBtnPosition + " .ui-btn-footer-down" ).length ) {
							$elDownBtn.buttonMarkup( { icon: "down" } ).appendTo( $elPage.find( ".ui-" + backBtnPosition ) );
						}

						// N_SE-32900: If an app moves a page when the pop is shown, the .ui-page-active page
						//             is changed.
						//             In this case, the '.ui-page-active .ui-btn-back' selector indicates a
						//             new page's one, and the old page's .ui-btn-back button is still hidden.
						//             So, the current back button is remembered to be shown at the
						//             softkeyboardchange.off event.
						if ( true ) {
							backBtn = $( ".ui-page-active .ui-btn-back" );
							backBtn.hide();
							self._backBtnQueue.push( backBtn );	// Store hidden backBtn
						}
					} else if ( e.state == "off" ) {
						if ( true ) {
							self._backBtnQueue.forEach( function ( b ) {
								b.show();	// Show each backBtn,
							} );
							self._backBtnQueue.length = 0;	// and clear queue.
						}
						$( ".ui-btn-footer-down" ).remove();
					}
				}
			});
		},

		_bindContentControlEvents: function () {
			var self = this,
				o = self.options,
				$el = self.element;

			$el.closest( ".ui-page" )
				.bind( "pagebeforeshow", function ( event ) {

				});
		},

		_HWKeyHandler: function ( ev ) {
			var $openedpopup = $.mobile.popup.active,
				$openedpopupwindow = $.mobile.popupwindow.active,
				$currentPicker = $( ".ui-page-active .ui-popupwindow.ui-datetimepicker" ),
				$page,
				$focused;
			// NOTE: The 'tizenhwkey' event is passed only document -> window objects.
			//       Other DOM elements does not receive 'tizenhwkey' event.

			// Check enableHWKeyHandler property
			if( !$.mobile.tizen.enableHWKeyHandler ) {
				return true;
			}

			// menu key
			if( ev.originalEvent.keyName == "menu" ) {
				// Blur focused element to turn off SIP(IME)
				$page = $( ev.data ); 	// page object, passed by _setHWKeySupport()
				$focused = $page.find( ".ui-focus" );
				if ( $focused[0] ) {	// Focused element is found
					// NOTE: If a popup is opened and focused element exists in it,
					//       do not close that popup.
					//       'false' is returned here, hence popup close routine is not run.
					if ( $page.find( ".ui-popup-active" ).find( ".ui-focus" ).length ) {
						return false;
					}
					$focused.blur();
				}
				// Close opened popup
				if ( $openedpopup ) {
					$openedpopup.close();
					return false;
				}
				if ( $openedpopupwindow && $currentPicker.hasClass( "in" ) ) {
					$openedpopupwindow.close();
					return false;
				}
			}
			// back key
			else if( ev.originalEvent.keyName == "back" ) {
				// Close opened popup
				if( $openedpopup ) {
					$openedpopup.close();
					return false;
				}
				if ( $openedpopupwindow && $currentPicker.hasClass( "in" ) ) {
					$openedpopupwindow.close();
					return false;
				}
			}
			return true;	// Otherwise, propagate tizenhwkey event to window object
		},
		_disableHWKey: function() {
				return false;
		},
		_setHWKeySupport: function( thisPage ) {
			$( document ).off( "tizenhwkey", this._disableHWKey );
			$( document ).on( "tizenhwkey", thisPage, this._HWKeyHandler );
		},
		_unsetHWKeySupport: function ( thisPage ) {
			$( document ).off( "tizenhwkey", this._HWKeyHandler );
			$( document ).on( "tizenhwkey", thisPage, this._disableHWKey );
		},
		_bindHWkeyOnSWBtn: function () {
			// if HW key not exist
			// return true
			// else
			$( document ).on( "tizenhwkey", function( e ) {
				var openedpopup = $.mobile.popup.active,
					$elPage = $( ".ui-page-active" ),
					$elFooter = $elPage.find( ":jqmData(role='footer')" ),
					$elMoreKey = $elFooter.children(":jqmData(icon='naviframe-more')"),
					morePopup;

				if ( $( ".ui-page-active .ui-footer" ).hasClass( "ui-footer-force-btn-show" ) ) {
					return true;
				}

				if ( e.originalEvent.keyName === "back" ) {
					// need to change back button
					if( openedpopup ) {
						openedpopup.close();
						return false;
					}
					//Click trigger
					 $( ".ui-page-active .ui-footer .ui-btn-back" ).trigger( "click" );
					return false;
				} else if ( e.originalEvent.keyName === "menu" ) {
					// if more button was clicked, all kinds of popups will be closed
					if ( openedpopup ) {
						openedpopup.close();
						return false;
					}

					// need to change more key trigger
					if ( $elMoreKey.get(0) ) {
						$elMoreKey.trigger( "click" );
					}
					return false;
				}
			} );

		},

		_setContentMinHeight : function ( thisPage ) {
			var $elPage = $( thisPage ),
				$elHeader = $elPage.find( ":jqmData(role='header')" ),
				$elFooter = $elPage.find( ":jqmData(role='footer')" ),
				$elContent = $elPage.find( ":jqmData(role='content')" ),
				footerHeight,
				resultMinHeight,
				dpr = 1,
				layoutInnerHeight = $.mobile.$window.height();

			if ( !$.support.scrollview || ($.support.scrollview && $elContent.jqmData("scroll") === "none") ) {
					dpr = window.outerWidth / window.innerWidth;
					layoutInnerHeight = Math.floor( window.outerHeight / dpr );
			} else {
				layoutInnerHeight = $.mobile.$window.height();
			}

			if ( $elFooter.css( "display" ) === "none" ) {
				footerHeight = 0;
			} else {
				footerHeight = $elFooter.height();
			}
			resultMinHeight = layoutInnerHeight - $elHeader.height() - footerHeight;

			if ( $.support.scrollview && $elContent.jqmData("scroll") !== "none" ) {
				$elContent.css( "min-height", resultMinHeight - parseFloat( $elContent.css("padding-top") ) - parseFloat( $elContent.css("padding-bottom") ) + "px" );
				$elContent.children( ".ui-scrollview-view" ).css( "min-height", $elContent.css( "min-height" ) );
			}
		},

		_updateHeaderArea : function ( thisPage ) {
			var $elPage = $( thisPage ),
				$elHeader = $elPage.find( ":jqmData(role='header')" ).length ? $elPage.find( ":jqmData(role='header')") : $elPage.siblings( ":jqmData(role='header')"),
				$headerBtn = $elHeader.children("a,[data-"+$.mobile.ns+"role=button]"),
				headerBtnWidth = 0,
				headerBtnNum = $headerBtn.length,
				$headerSrc = $elHeader.children("img"),
				headerSrcNum = $headerSrc.length,
				headerSrcWidth = 0,
				h1width;


			if ( headerBtnNum ) {
				headerBtnWidth = $headerBtn.width() + parseInt( $headerBtn.css("padding-left") ) + parseInt( $headerBtn.css("padding-right") );
			}
			if( headerSrcNum ) {
				headerSrcWidth = $headerSrc.width() + parseInt( $headerSrc.css("margin-left") );
			}

			if ( !$elPage.is( ".ui-dialog" ) ) {
				h1width = window.innerWidth - parseInt( $elHeader.find( "h1" ).css( "margin-left" ), 10 ) * 2 - headerBtnWidth * headerBtnNum - headerSrcWidth * headerSrcNum;
				$elHeader.find( "h1" ).css( "width", h1width );
				$elHeader.find( '.ui-title-text-sub' ).css( "width", h1width );
			}
			/* add half width for default space between text and button, and img tag area is too narrow, so multiply three for img width*/
		},

		_updateFooterArea : function ( thisPage ) {
			var $elPage = $( thisPage ),
				$elFooter = $elPage.find( ".ui-footer" ),
				$elMoreKey = $elFooter.children( ":jqmData(icon='naviframe-more')" ),
				$elBackKey = $elFooter.children( ".ui-btn-back, .ui-btn-footer-down" ),
				footerBtn = $elFooter.children( "div.ui-btn, a.ui-btn" ),
				btnLength = footerBtn.length,
				btnWidth = window.innerWidth,
				realBtnIndex = 0,
				idx, moreWidth = 0;

			if ( !btnLength ) {
				return;
			}

			if ( $elMoreKey.length ) {
				moreWidth = $elMoreKey.width();
				btnWidth -= moreWidth;
			}

			if ( $elBackKey.length ) {
				btnWidth -= $elBackKey.width();
				$elBackKey.addClass( "ui-footer-btn-border" );
			}

			btnWidth /= btnLength - $elMoreKey.length - $elBackKey.length;

			for ( idx = 0; idx < btnLength; idx++ ) {
				if ( footerBtn.eq( idx ).hasClass( "ui-btn-back" ) ) {
					continue;
				}
				if ( footerBtn.eq( idx ).is( ":jqmData(icon='naviframe-more')" ) ){
					continue;
				}
				footerBtn.eq( idx )
					.addClass( "ui-footer-btn-border" )
					.width( btnWidth )
					.css( "position", "absolute" )
					.css( "left", realBtnIndex * btnWidth + moreWidth );
				realBtnIndex++;
			}
			$elFooter.find( ".ui-footer-btn-border" ).eq( 0 ).removeClass( "ui-footer-btn-border" );
		},

		_setHWKeyLayout : function ( thisPage ) {
			var $elPage = $( thisPage ),
				$elFooter = $elPage.find( ":jqmData(role='footer')" ),
				$elBackKey = $elFooter.children( ".ui-btn-back" ),
				$elMoreKey = $elFooter.children(":jqmData(icon='naviframe-more')"),
				$elTabBar = $elFooter.children( ".ui-tabbar" ),
				$elControlGroup = $elFooter.children( ".ui-controlgroup" );
				//cntMore = 0,
			
				// Check HW Key option
			if ( $elFooter.hasClass("ui-footer-force-btn-show") ) {
				return true;
			}

			/*
			if ( $elMoreKey.length ) {
				cntMore = $elMoreKey.length + 1;
			} else {
				cntMore = 0;
			}

			// need to add device api to check HW key exist
			// Case 1 : footer - BackKey/MoreKey/Button - hide BackKey/MoreKey
			if ( $elFooter.children().length - $elBackKey.length - cntMore > 0 ) {
				$elBackKey.hide();
				$elMoreKey.hide();
			// Case 2 : footer - BackKey/MoreKey - more, back hide depend on OSP
			} else {
				$elBackKey.hide();
				$elMoreKey.hide();
			}
			*/

			if( $elMoreKey ) {
				$elMoreKey.hide();
			}
			if( $elBackKey ) {
				$elBackKey.hide();
			}
			if( $elTabBar ) {
				$elTabBar.removeClass( "ui-tabbar-margin-more ui-tabbar-margin-back" );
			}
			if ( $elControlGroup ) {
				$elControlGroup.removeClass( "ui-controlgroup-padding-more ui-controlgroup-padding-back" );
			}
			// Case 3 : no footer - do nothing

			return true;
		},
		_setMenuPopupLayout: function ( thisPage ) {
			var $page = $( thisPage ),
				$footer = $page.find( ":jqmData(role='footer')" ),
				moreKey = $page.find( ":jqmData(icon='naviframe-more')" )[0],
				//cntMore = 0,
				$morePopup;

			if( moreKey && moreKey.hash ) {	// moreKey.hash = #morePopupID (from <a href="">)
				$morePopup =  $( moreKey.hash );
				$morePopup.addClass ( "ui-ctxpopup-optionmenu" );
			}
		 },

		_visible: true,

		// This will set the content element's top or bottom padding equal to the toolbar's height
		updatePagePadding: function ( tbPage ) {
			var $el = this.element,
				header = $el.siblings( ".ui-header" ).length,
				footer = $el.siblings( ".ui-footer" ).length;

			// This behavior only applies to "fixed", not "fullscreen"
			if ( this.options.fullscreen ) {
				return;
			}

			tbPage = tbPage || $el.closest( ".ui-page" );

			if ( $el.siblings( ".ui-header" ).jqmData("position") == "fixed" || ($.support.scrollview && $el.jqmData("scroll") !== "none" )) {
				$( tbPage ).css( "padding-top", ( header ? $el.siblings( ".ui-header" ).outerHeight() : 0 ) );
			}
			$( tbPage ).css( "padding-bottom", (( footer && $el.siblings( ".ui-footer" ).css( "display" ) !== "none" ) ? $el.siblings( ".ui-footer" ).outerHeight() : 0 ) );
		},

		/* 1. Calculate and update content height   */
		updatePageLayout: function ( thisPage, receiveType ) {
			var $elFooter,
				$elPage = $( thisPage ),
				$elHeader = $elPage.find( ":jqmData(role='header')" ),
				$elContent = $elPage.find( ":jqmData(role='content')" ),
				resultContentHeight = 0,
				resultFooterHeight = 0,
				resultHeaderHeight = 0,
				layoutInnerHeight = $.mobile.$window.height(),
				dpr = 1;

			if ( $elPage.length ) {
				$elFooter = $elPage.find( ":jqmData(role='footer')" );
			} else {
				$elFooter = $( document ).find( ":jqmData(role='footer')" ).eq( 0 );
			}

			// calculate footer height
			resultFooterHeight = ( $elFooter.css( "display" ) == "none" || $elFooter.length == 0 ) ? 0 : $elFooter.height();
			resultHeaderHeight = ( $elHeader.css( "display" ) == "none" || $elHeader.length == 0 ) ? 0 : $elHeader.height();

			if (resultFooterHeight != 0 ) {
				$elFooter.css( "bottom", 0 );
			}

			if ( !$.support.scrollview || ($.support.scrollview && $elContent.jqmData("scroll") === "none") ) {
				dpr = window.outerWidth / window.innerWidth;
				layoutInnerHeight = Math.floor( window.outerHeight / dpr );
			} else {
				//#N_SE-43092: window.innerHeight returns incorrect size
				layoutInnerHeight = $.mobile.$window.height();
			}

			resultContentHeight = layoutInnerHeight - resultFooterHeight - resultHeaderHeight;

			if ( $.support.scrollview && $elContent.jqmData("scroll") !== "none" ) {
				$elContent.height( resultContentHeight -
						parseFloat( $elContent.css("padding-top") ) -
						parseFloat( $elContent.css("padding-bottom") ) );
			}

			// External call page( "refresh") - in case title changed

			if ( receiveType ) {
				$elPage
					.css( "padding-top", resultHeaderHeight )
					.css( "padding-bottom", resultFooterHeight );
				$elContent.css( "min-height", resultContentHeight );
			}
		},

		show: function ( notransition ) {
			/* blank function: deprecated */
		},

		hide: function ( notransition ) {
			/* blank function: deprecated */
		},

		toggle: function () {
			this[ this._visible ? "hide" : "show" ]();
		},

		destroy: function () {
			this.element.removeClass( "ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden" );
			this.element.closest( ".ui-page" ).removeClass( "ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen" );
		},

		refresh: function () {
			var $elPage = $( ".ui-page-active" );
			this.setHeaderFooter( $elPage );
			this._updateHeaderArea( $elPage );
		}
	});

	//auto self-init widgets
	$( document )
		.bind( "pagecreate create", function ( e ) {
			// DEPRECATED in 1.1: support for data-fullscreen=true|false on the page element.
			// This line ensures it still works, but we recommend moving the attribute to the toolbars themselves.
			if ( $( e.target ).jqmData( "fullscreen" ) ) {
				$( $.mobile.pagelayout.prototype.options.initSelector, e.target ).not( ":jqmData(fullscreen)" ).jqmData( "fullscreen", true );
			}
			$.mobile.pagelayout.prototype.enhanceWithin( e.target );
		})
		.bind( "pagebeforeshow", function ( event, ui ) {
			var footer_filter = $( event.target ).find( ":jqmData(role='footer')" ),
				controlgroup_filter = footer_filter.find( ":jqmData(role='controlgroup')" ),
				$elFooterMore = controlgroup_filter.siblings( ":jqmData(icon='naviframe-more')" ),
				$elFooterBack = controlgroup_filter.siblings( ".ui-btn-back" );

			if ( $elFooterMore.length ) {
				controlgroup_filter.addClass( "ui-controlgroup-padding-more" );
			}
			if ( $elFooterBack.length ) {
				controlgroup_filter.addClass( "ui-controlgroup-padding-back" );
			}
		});

}( jQuery ));


/*
* Module Name : widgets/jquery.mobile.tizen.virtuallistview
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 * Virtual List Widget for unlimited data.
 * To support more then 1,000 items, special list widget developed. 
 * Fast initialize and light DOM tree.
 * DB connection and works like DB cursor.
 * 
 * HTML Attributes:
 *
 *		data-role:	virtuallistview
 *		data-template : jQuery.template ID that populate into virtual list 
 *		data-row : Optional. Set number of <li> elements that are used for data handling. 
 *		
 *		ID : <UL> element that has "data-role=virtuallist" must have ID attribute.
 *
 * * APIs:
 *
 *		create ( {
 *				itemData: function ( idx ) { return json_obj; },
 *				numItemData: number or function () { return number; },
 *				cacheItemData: function ( minIdx, maxIdx ) {}
 *				} )
 *			: Create a virtuallist widget. At this moment, _create method is called.
 *			args : A collection of options
 *				itemData: A function that returns JSON object for given index. Mandatory.
 *				numItemData: Total number of itemData. Mandatory.
 *				cacheItemData: Virtuallist will ask itemData between minIdx and maxIdx.
 *				               Developers can implement this function for preparing data.
 *				               Optional.
 *
 * Events:
 *
 *		touchstart : Temporary preventDefault applied on touchstart event to avoid broken screen.
 *
 * Examples:
 *
 *		<script id="tmp-3-2-7" type="text/x-jquery-tmpl">
 *			<li class="ui-li-3-2-7">
 *				<span class="ui-li-text-main">${NAME}</span>
 *				<img src="00_winset_icon_favorite_on.png" class="ui-li-icon-sub">
 *				<span class="ui-li-text-sub">${ACTIVE}</span>
 *				<span class="ui-li-text-sub2">${FROM}</span>
 *			</li>
 *		</script>
 *
 *		<ul id="virtuallist-normal_3_2_7_ul" data-role="virtuallistview" data-template="tmp-3-2-7" data-dbtable="JSON_DATA" data-row="100">
 *		</ul>
 *
 */

/**
	@class VirtualList
	In the Web environment, it is challenging to display a large amount of data in a list, such as displaying a contact list of over 1000 list items. It takes time to display the entire list in HTML and the DOM manipulation is complex.

	The virtual list widget is used to display a list of unlimited data elements on the screen for better performance. This widget provides easy access to databases to retrieve and display data. Virtual lists are based on the jQuery.template plugin as described in the jQuery documentation for jQuery.template plugin.

	To add a virtual list widget to the application, use the following code:

		<script id="tmp-3-2-7" type="text/x-jquery-tmpl">
			<li class="ui-li-3-2-7">
				<span class="ui-li-text-main">${NAME}</span>
				<img src="00_winset_icon_favorite_on.png" class="ui-li-icon-sub"/>
				<span class="ui-li-text-sub">${ACTIVE}</span>
				<span class="ui-li-text-sub2">${FROM}</span>
			</li>
		</script>
		<ul id="vlist" data-role="virtuallistview" data-template="tmp-3-2-7" data-dbtable="JSON_DATA" data-row="100"></ul>
*/
/**
	@property {String} data-role
	Creates the virtual list view. The value must be set to virtuallistview.
	Only the &gt;ul&lt; element, which a id attribute defined, supports this option. Also, the vlLoadSuccess class attribute must be defined in the &gt;ul&lt; element to ensure that loading data from the database is complete.
*/
/**
	@property {String} data-template
	Defines the jQuery.template element ID.
	The jQuery.template must be defined. The template style can use rem units to support scalability.
*/
/**
	@property {Number} data-row
	Defines the number of virtual list child elements.
	The minimum value is 20 and the default value is 100. As the value gets higher, the loading time increases while the system performance improves. So you need to pick a value that provides the best performance without excessive loading time.
*/
/**
	@method create
	@param {function} itemData(index)
	: function itemData(index) returns the JSON object matched with the given index. The index value is between 0 and numItemData-1.
	@param {Number} numItemData
	: number numItemData or function numItemData() defines or returns a static number of items.
	@param {function} cacheItemData(minIndex, maxIndex)
	: function cacheItemData(minIndex, maxIndex) prepares the JSON data. This method is called before calling the itemData() method with index values between minIndex and maxIndex.
*/

(function ( $, undefined ) {

	/* Code for Virtual List Demo */
	var listCountPerPage = {},	/* Keeps track of the number of lists per page UID. This allows support for multiple nested list in the same page. https://github.com/jquery/jquery-mobile/issues/1617 */
		_NO_SCROLL = 0,					/* ENUM */
		_SCROLL_DOWN = 1,				/* ENUM */
		_SCROLL_UP = -1;					/* ENUM */

	$.widget( "tizen.virtuallistview", $.mobile.widget, {
		options: {
			theme: "s",
			countTheme: "s",
			headerTheme: "s",
			dividerTheme: "s",
			splitIcon: "arrow-r",
			splitTheme: "s",
			inset: false,
			id:	"",					/* Virtual list UL elemet's ID */
			childSelector: " li",	/* To support swipe list */
			dbtable: "",
			template : "",
			dbkey: false,			/* Data's unique Key */
			scrollview: false,
			row: 100,
			page_buf: 30,
			initSelector: ":jqmData(role='virtuallistview')"
		},

		_stylerMouseUp: function () {
			$( this ).addClass( "ui-btn-up-s" );
			$( this ).removeClass( "ui-btn-down-s" );
		},

		_stylerMouseDown: function () {
			$( this ).addClass( "ui-btn-down-s" );
			$( this ).removeClass( "ui-btn-up-s" );
		},

		_stylerMouseOver: function () {
			$( this ).toggleClass( "ui-btn-hover-s" );
		},

		_stylerMouseOut: function () {
			$( this ).toggleClass( "ui-btn-hover-s" );
			$( this ).addClass( "ui-btn-up-s" );
			$( this ).removeClass( "ui-btn-down-s" );
		},

		// ?
		// this		virtuallistview object
		// @param[in]	template	template name(string)
		_pushData: function ( template ) {
			var o = this.options,
				i,
				myTemplate = $( "#" + template ),	// Get template object
				// NOTE: o.row = # of rows handled at once. Default value is 100.
				lastIndex = ( o.row > this._numItemData ? this._numItemData : o.row ),	// last index of handled data
				htmlData;

			for ( i = 0; i < lastIndex; i++ ) {
				htmlData = myTemplate.tmpl( this._itemData( i ) );	// Make rows with template,
				$( o.id ).append( $( htmlData ).attr( 'id', o.itemIDPrefix + i ) );	// and append it to the vlist object
			}

			// After pushing data re-style virtuallist widget
			$( o.id ).trigger( "create" );
		},

		// Set children <li> elements' position
		//
		// this: virtuallist element
		// event: virtuallistview.options
		//		TODO: Why this arg name is 'event'? Not resonable.
		//		(this function is not called with event element as args!)
		_reposition: function ( event ) {
			var o,
				t = this,
				padding,
				margin;

			if ( event.data ) {
				o = event.data;
			} else {
				o = event;
			}
			if ( $( o.id + o.childSelector ).size() > 0 ) { // $("#vlistid li")
				// first child's top position
				// NOTE: the first element may not be '0'!!!
				t._title_h = $( o.id + o.childSelector + ':first' ).position().top;
				// first child's outer height (TODO: reuse selected items)
				t._line_h = $( o.id + o.childSelector + ':first' ).outerHeight();

				// container(vlist element)'s innerwidth
				t._container_w = $( o.id ).innerWidth();

				// get sum of container's left/right padding
				padding = parseInt( $( o.id + o.childSelector ).css( "padding-left" ), 10 )
					+ parseInt( $( o.id + o.childSelector ).css( "padding-right" ), 10 );

				// Add CSS to all <li> elements
				//	* absolute position
				//	* btn-up
				//	* mouse up/down/over/out styles
				$( o.id + ">" + o.childSelector )
					.addClass( "position_absolute" )
					.addClass( "ui-btn-up-s" )
					.bind( "mouseup", t._stylerMouseUp )
					.bind( "mousedown", t._stylerMouseDown )
					.bind( "mouseover", t._stylerMouseOver )
					.bind( "mouseout", t._stylerMouseOut );
			}

			// Set absolute top/left position of each <li>
			$( o.id + ">" + o.childSelector ).each( function ( index ) {
				margin = parseInt( $( this ).css( "margin-left" ), 10 )
					+ parseInt( $( this ).css( "margin-right" ), 10 );

				$( this ).css( "top", t._title_h + t._line_h * index + 'px' )
					.css( "width", t._container_w - padding - margin );
			} );

			// Set Max Listview Height
			$( o.id ).height( t._numItemData * t._line_h );
		},

		// Resize each listitem's width
		_resize: function ( event ) {
			var o,	// 'ul'
				t = this,
				li,
				padding,
				margin;

			if ( event.data ) {
				o = event.data;
			} else {
				o = event;
			}
			li = $( o ).children( o.childSelector )

			t._container_w = $( o ).width();

			padding = parseInt( li.css( "padding-left" ), 10 )
				+ parseInt( li.css( "padding-right" ), 10 );

			li.each( function ( index, obj ) {
				margin = parseInt( $( this ).css( "margin-left" ), 10 )
					+ parseInt( $( this ).css( "margin-right" ), 10 );
				$( this ).css( "width", t._container_w - padding - margin );
			} );
		},

		// New scrollmove function supporting scrollTo
		_scrollmove: function ( ev ) {
			var t = ev.data,	// vlist (JQM object)
				o = t.options,	// options
				prevTopBufLen = t._num_top_items,	// Previous(remembered) top buf length
				timerInterval = 100,
				i,
				_scrollView,
				_normalScroll;

			_scrollView = {
				viewTop: function ( ) {
					var sv = $( o.id ).parentsUntil( ".ui-page" ).find( ".ui-scrollview-view" ),
						svTrans = sv.css( "-webkit-transform" ),
						svTransVal = "0,0,0,0,0,0";
					if ( svTrans ) {
						svTransVal = svTrans.replace( /matrix\s*\((.*)\)/, "$1" );	// matrix(a,c,b,d,tx,ty)
					}
					return - parseInt( svTransVal.split(',')[5], 10 );
				}
			};
			_normalScroll = {
				viewTop: function ( ) {
					return $( window ).scrollTop( );	// TODO: - _line_h?
				}
			};
			// Get current view top position
			function viewTop ( ) {
				return o.scrollview ? _scrollView.viewTop() : _normalScroll.viewTop();
			}
			// log function for debug
			function log ( msg ) {
				var debug = false;
				if ( debug ) {
					console.log( ">>virtualllist: " + msg );
				}
			}

			// Timer interval function
			// @param[in]	vl	virtuallist object (JQM object)
			function timerMove ( vl, undefined ) {
				var cy,				// current y position
					cti,		// current top idx
					cbi,		// current bottom idx
					oti = vl._first_index,	// old top idx
					obi = vl._last_index,	// old botton idx
					dti,			// delta of top idx
					fromIdx,
					toIdx,	// index range to be moved
					delta,			// moveItem delta
					rowLen = vl.options.row,	// max. # of items handled at once
					bufSize,		// top/bottom buffer size. unit: # of items
					i;

				// subroutine: Move itemContents in i2 into i1
				function moveItemContents( vl, i1, i2 ) {
					// TODO: Find a efficient way to replace data!
					// Assumption: i1 and i2 has same children.
					var NODETYPE = { ELEMENT_NODE: 1, TEXT_NODE: 3 },
						c1,	// child item 1 (old)
						c2,	// child item 2 (new)
						newText,
						newImg,
						i;

					$( i1 ).find( ".ui-li-text-main", ".ui-li-text-sub", ".ui-li-text-sub2", "ui-btn-text" ).each( function ( index ) {
						c1 = $( this );
						newText = $( i2 ).find( ".ui-li-text-main", ".ui-li-text-sub", "ui-btn-text" ).eq( index ).text();

						$( c1 ).contents().filter( function () {
							return ( this.nodeType == NODETYPE.TEXT_NODE );
						} ).get( 0 ).data = newText;
					} );

					$( i1 ).find( "img" ).each( function ( imgIdx ) {
						var c1 = $( this );
						newImg = $( i2 ).find( "img" ).eq( imgIdx ).attr( "src" );

						$( c1 ).attr( "src", newImg );
					} );

					$( i1 ).removeData( );	// Clear old data
				}

				// subroutine: Move item
				function moveItem( vl, fromIdx, toIdx ) {
					var itemData,	// data from itemData()
						item,		// item element
						newItem,	// new item element
						tmpl;		// template

					log( ">> move item: " + fromIdx + " --> " + toIdx );

					// Find current item
					item = $( '#' + vl.options.itemIDPrefix + fromIdx );	// TODO: refactor ID generation!
					if ( ! item || ! item.length ) {
						return false;
					}

					// Get new item
					tmpl = $( "#" + vl.options.template );
					if ( tmpl ) {
						newItem = tmpl.tmpl( vl._itemData( toIdx ) );

						// TODO: Consider touch block while moving?

						// Move item contents
						moveItemContents( vl, item, newItem );

						// clean up temporary item
						newItem.remove();
					}

					// Move position, and set id
					item.css( 'top', toIdx * vl._line_h )
						.attr( 'id' , vl.options.itemIDPrefix + toIdx );	// TODO: refactor ID generation!

					// TODO: Apply jqmdata? check following old code;
					// $( oldItem ).removeData( );	// Clear old data
					// if (key) { $( oldItem ).data( key, $( newItem ).data( key ) ); }

					return true;
				}


				// Get current view position
				cy = viewTop();

				// Calculate bufSize: rowLen / 3
				// NOTE: Assumption: total row length = visible items * 3 (upper+visible+lower)
				bufSize = Math.ceil( rowLen / 3 );

				// Calculate current top/bottom index (to be applied)
				// top index = current position / line height
				cti = Math.floor( cy / vl._line_h ) - bufSize;	// TODO: consider buffer!
				cbi = cti + rowLen - 1;

				if ( cti < 0 ) {		// Top boundary check
					cbi += ( - cti );
					cti = 0;
				} else if ( cbi > ( vl._numItemData - 1 ) ) {		// Bottom boundary check
					cti -= ( cbi - ( vl._numItemData - 1 ) );
					cbi = ( vl._numItemData - 1 );
				}

				// Calculate dti
				dti = cti - oti;
				log( "cy=" + cy + ", oti=" + oti + ", obi=" + obi + ", cti=" + cti + ", cbi=" + cbi + ", dti=" + dti );

				// switch: dti = 0 --> timer stop condition: delta=0 or scrollstop event comes. END.
				if ( 0 == dti ) {
					// Check timer runtime
					vl.timerStillCount += 1;
					if ( vl.timerStillCount < 12 ) {	// check count ( TODO: test and adjust )
						log("dti=0 " + vl.timerStillCount + " times");
						vl.timerMoveID = setTimeout( timerMove, timerInterval, vl );	// run once more
						return;
					}

					log("dti=0 " + vl.timerStillCount + " times. End timer.");
					vl.timerStillCount = 0;
					// Stop timer
					if ( vl.timerMoveID ) {
						clearTimeout( vl.timerMoveID );
						vl.timerMoveID = null;
					}
				} else {
					// switch: dti >= # of max elements --> total replace.
					vl.timerStillCount = 0;		// Reset still counter

					if ( Math.abs( dti ) >= rowLen ) {
						fromIdx = oti;
						toIdx = obi;
						delta = dti;
						log( ">>> WHOLE CHANGE! delta=" + delta );
					} else {
						// switch: dti < # of max elements --> move t2b or b2t until new top/bottom idx is covered
						if ( dti > 0 ) {
							fromIdx = oti;
							toIdx = oti + dti - 1;
							delta = rowLen;
						} else {
							fromIdx = obi + dti + 1;	// dti < 0
							toIdx = obi;
							delta = -rowLen;
						}
						log( ">>> partial change. delta=" + delta );
					}

					// Move items
					for ( i = fromIdx; i <= toIdx; i++ ) {
						moveItem( vl, i, i + delta );		// Change data and position
					}

					// Store current top/bottom idx into vl
					vl._first_index = cti;
					vl._last_index = cbi;

					// Register timer to check again
					vl.timerMoveID = setTimeout( timerMove, timerInterval, vl );
				}
				return;	// End of function
			}

			// ==== function start ====

			t.timerStillCount = 0;	// Count do-nothing time.	For behavior tuning.

			// If a timer function is alive, clear it
			if ( t.timerMoveID ) {
				clearTimeout( t.timerMoveID );
				t.timerMoveID = null;
			}
			// run TimerMove()
			timerMove( t );
		},

		_recreate: function ( newArray ) {
			var t = this,
				o = this.options;

			$( o.id ).empty();

			t._numItemData = newArray.length;
			t._direction = _NO_SCROLL;
			t._first_index = 0;
			t._last_index = o.row - 1;

			t._pushData( o.template );

			if (o.childSelector == " ul" ) {
				$( o.id + " ul" ).swipelist();
			}

			$( o.id ).virtuallistview();

			t.refresh( true );

			t._reposition( o );
		},

		// Init virtuallistview
		// this		virtuallistview object
		_initList: function () {
			var t = this,
				o = this.options;

			/* After AJAX loading success */

			// Put initial <li> elements
			t._pushData( o.template );

			// find a parent page, and run _reposition() at 'pageshow' event
			// TODO: Consider replace parentsUntil().parent() to parent('.ui-page') ???
			$( o.id ).parentsUntil( ".ui-page" ).parent().one( "pageshow", function () {
				setTimeout( function () {
					t._reposition( o );
				}, 0);
			});

			// Bind _scrollmove() at 'scrollstart.virtuallist' event
			$( document ).bind( "scrollstart.virtuallist scrollstop.vrituallist", t, t._scrollmove );

			// Bind _resize()
			$( window ).on( "throttledresize", $( o.id ), t._resize );

			// when ul is a childselector, assume that this is also a swipelist,
			// and run swipelist constructor
			if ( o.childSelector == " ul" ) {
				$( o.id + " ul" ).swipelist();
			}

			t.refresh( true );
		},

		create: function () {
			var o = this.options;

			/* external API for AJAX callback */
			this._create.apply( this, arguments );

			// TODO: remove this line? _initList() calls reposition...
			this._reposition( o );
		},

		_create: function ( args ) {
			// Extend instance variables
			$.extend( this, {
				_itemData : function ( idx ) { return null; },
				_numItemData : 0,
				_cacheItemData : function ( minIdx, maxIdx ) { },
				_title_h : 0,
				_container_w : 0,
				_minimum_row : 100,
				_direction : _NO_SCROLL,
				_first_index : 0,
				_last_index : 0,
				_num_top_items : 0	// By scroll move, number of hidden elements.
			} );

			// local variables
			var t = this,
				o = this.options,
				$el = this.element,
				shortcutsContainer = $('<div class="ui-virtuallist"/>'),
				shortcutsList = $('<ul></ul>'),
				dividers = $el.find(':jqmData(role="virtuallistview" )'),
				lastListItem = null,
				shortcutscroll = this,
				dbtable_name,
				dbtable;


			// Add CSS classes to $el (=virtuallistview)
			$el.addClass( function ( i, orig ) {
				return orig + " ui-listview ui-virtual-list-container" + ( t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "" );
			});

			// keep the vlist's ID
			o.itemIDPrefix = $el.attr( "id" ) + '_';
			o.id = "#" + $el.attr( "id" );

			// when page hides, empty all child elements
			$( o.id ).bind( "pagehide", function ( e ) {
				$( o.id ).empty();
			});

			// Find if scrollview is used
			if ( $( ".ui-scrollview-clip" ).size() > 0 ) {
				o.scrollview = true;
			} else {
				o.scrollview = false;
			}

			// Calculate page buffer size
			if ( $el.data( "row" ) ) {
				o.row = $el.data( "row" );

				if ( o.row < t._minimum_row ) {
					o.row = t._minimum_row;
				}

				o.page_buf = parseInt( ( o.row / 2 ), 10 );
			}

			// Get arguments
			if ( args ) {
				if ( args.itemData && typeof args.itemData == 'function'  ) {
					t._itemData = args.itemData;
				} else {
					return;
				}
				if ( args.numItemData ) {
					if ( typeof args.numItemData == 'function' ) {
						t._numItemData = args.numItemData( );
					} else if ( typeof args.numItemData == 'number' ) {
						t._numItemData = args.numItemData;
					} else {
						return;
					}
				} else {
					return;
				}
			} else {	// No option is given
				// Legacy support: dbtable
				console.warn( "WARNING: The data interface of virtuallist is changed. \nOld data interface(data-dbtable) is still supported, but will be removed in next version. \nPlease fix your code soon!" );

				/* After DB Load complete, Init Vritual list */
				if ( $( o.id ).hasClass( "vlLoadSuccess" ) ) {
					dbtable_name = $el.jqmData('dbtable');
					dbtable = window[ dbtable_name ];

					$( o.id ).empty();

					if ( !dbtable ) {
						dbtable = { };
					}

					t._itemData = function ( idx ) {
						return dbtable[ idx ];
					};
					t._numItemData = dbtable.length;
				} else {
					return;	// Do nothing
				}
			}

			// Get template data
			if ( $el.data( "template" ) ) {
				o.template = $el.data( "template" );

				/* to support swipe list, <li> or <ul> can be main node of virtual list. */
				if ( $el.data( "swipelist" ) == true ) {
					o.childSelector = " ul";
				} else {
					o.childSelector = " li";
				}
			}

			// Set data's unique key
			// NOTE: Unnecessary?
			if ( $el.data( "dbkey" ) ) {
				o.dbkey = $el.data( "dbkey" );
			}

			t._first_index = 0;			// initial top idx of <li> element.
			t._last_index = o.row - 1;		// initial bottom idx of <li> element.
			t._initList();	// NOTE: Called at here only!
		},

		destroy : function () {
			var o = this.options;

			$( document ).unbind( "scrollstop" );

			$( window ).off( "throttledresize", this._resize );

			$( o.id ).empty();

			if ( this.timerMoveID ) {
				clearTimeout( this.timerMoveID );
				this.timerMoveID = null;
			}
		},

		_itemApply: function ( $list, item ) {
			var $countli = item.find( ".ui-li-count" );

			if ( $countli.length ) {
				item.addClass( "ui-li-has-count" );
			}

			$countli.addClass( "ui-btn-up-" + ( $list.jqmData( "counttheme" ) || this.options.countTheme ) + " ui-btn-corner-all" );

			// TODO class has to be defined in markup
			item.find( "h1, h2, h3, h4, h5, h6" ).addClass( "ui-li-heading" ).end()
				.find( "p, dl" ).addClass( "ui-li-desc" ).end()
				.find( ">img:eq(0), .ui-link-inherit>img:eq(0)" ).addClass( "ui-li-thumb" ).each( function () {
					item.addClass( $( this ).is( ".ui-li-icon" ) ? "ui-li-has-icon" : "ui-li-has-thumb" );
				}).end()
				.find( ".ui-li-aside" ).each(function () {
					var $this = $( this );
					$this.prependTo( $this.parent() ); //shift aside to front for css float
				} );
		},

		_removeCorners: function ( li, which ) {
			var top = "ui-corner-top ui-corner-tr ui-corner-tl",
				bot = "ui-corner-bottom ui-corner-br ui-corner-bl";

			li = li.add( li.find( ".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb" ) );

			if ( which === "top" ) {
				li.removeClass( top );
			} else if ( which === "bottom" ) {
				li.removeClass( bot );
			} else {
				li.removeClass( top + " " + bot );
			}
		},

		_refreshCorners: function ( create ) {
			var $li,
				$visibleli,
				$topli,
				$bottomli;

			if ( this.options.inset ) {
				$li = this.element.children( "li" );
				// at create time the li are not visible yet so we need to rely on .ui-screen-hidden
				$visibleli = create ? $li.not( ".ui-screen-hidden" ) : $li.filter( ":visible" );

				this._removeCorners( $li );

				// Select the first visible li element
				$topli = $visibleli.first()
					.addClass( "ui-corner-top" );

				$topli.add( $topli.find( ".ui-btn-inner" ) )
					.find( ".ui-li-link-alt" )
						.addClass( "ui-corner-tr" )
					.end()
					.find( ".ui-li-thumb" )
						.not( ".ui-li-icon" )
						.addClass( "ui-corner-tl" );

				// Select the last visible li element
				$bottomli = $visibleli.last()
					.addClass( "ui-corner-bottom" );

				$bottomli.add( $bottomli.find( ".ui-btn-inner" ) )
					.find( ".ui-li-link-alt" )
						.addClass( "ui-corner-br" )
					.end()
					.find( ".ui-li-thumb" )
						.not( ".ui-li-icon" )
						.addClass( "ui-corner-bl" );
			}
			this.element.trigger( "updatelayout" );
		},

		// this		virtuallistview object
		refresh: function ( create ) {
			this.parentPage = this.element.closest( ".ui-page" );
			// Make sub page, and move the virtuallist into it...
			// NOTE: check this subroutine.
			this._createSubPages();

			var o = this.options,
				$list = this.element,
				self = this,
				dividertheme = $list.jqmData( "dividertheme" ) || o.dividerTheme,
				listsplittheme = $list.jqmData( "splittheme" ),
				listspliticon = $list.jqmData( "spliticon" ),
				li = $list.children( "li" ),
				counter = $.support.cssPseudoElement || !$.nodeName( $list[ 0 ], "ol" ) ? 0 : 1,
				item,
				itemClass,
				temTheme,
				a,
				last,
				splittheme,
				countParent,
				icon,
				pos,
				numli,
				itemTheme;

			// TODO: ?
			if ( counter ) {
				$list.find( ".ui-li-dec" ).remove();
			}

			for ( pos = 0, numli = li.length; pos < numli; pos++ ) {
				item = li.eq( pos );
				itemClass = "ui-li";

				// If we're creating the element, we update it regardless
				if ( create || !item.hasClass( "ui-li" ) ) {
					itemTheme = item.jqmData( "theme" ) || o.theme;
					a = item.children( "a" );

					if ( a.length ) {
						icon = item.jqmData( "icon" );

						item.buttonMarkup({
							wrapperEls: "div",
							shadow: false,
							corners: false,
							iconpos: "right",
							/* icon: a.length > 1 || icon === false ? false : icon || "arrow-r",*/
							icon: false,	/* Remove unnecessary arrow icon */
							theme: itemTheme
						});

						if ( ( icon != false ) && ( a.length == 1 ) ) {
							item.addClass( "ui-li-has-arrow" );
						}

						a.first().addClass( "ui-link-inherit" );

						if ( a.length > 1 ) {
							itemClass += " ui-li-has-alt";

							last = a.last();
							splittheme = listsplittheme || last.jqmData( "theme" ) || o.splitTheme;

							last.appendTo(item)
								.attr( "title", last.getEncodedText() )
								.addClass( "ui-li-link-alt" )
								.empty()
								.buttonMarkup({
									shadow: false,
									corners: false,
									theme: itemTheme,
									icon: false,
									iconpos: false
								})
								.find( ".ui-btn-inner" )
								.append(
									$( "<span />" ).buttonMarkup({
										shadow: true,
										corners: true,
										theme: splittheme,
										iconpos: "notext",
										icon: listspliticon || last.jqmData( "icon" ) || o.splitIcon
									})
								);
						}
					} else if ( item.jqmData( "role" ) === "list-divider" ) {

						itemClass += " ui-li-divider ui-btn ui-bar-" + dividertheme;
						item.attr( "role", "heading" );

						//reset counter when a divider heading is encountered
						if ( counter ) {
							counter = 1;
						}

					} else {
						itemClass += " ui-li-static ui-body-" + itemTheme;
					}
				}

				if ( counter && itemClass.indexOf( "ui-li-divider" ) < 0 ) {
					countParent = item.is( ".ui-li-static:first" ) ? item : item.find( ".ui-link-inherit" );

					countParent.addClass( "ui-li-jsnumbering" )
						.prepend( "<span class='ui-li-dec'>" + (counter++) + ". </span>" );
				}

				item.add( item.children( ".ui-btn-inner" ) ).addClass( itemClass );

				self._itemApply( $list, item );
			}

			this._refreshCorners( create );
		},

		//create a string for ID/subpage url creation
		_idStringEscape: function ( str ) {
			return str.replace(/\W/g , "-");
		},

		// ?
		// this		virtuallistview object
		_createSubPages: function () {
			var parentList = this.element,
				parentPage = parentList.closest( ".ui-page" ),
				parentUrl = parentPage.jqmData( "url" ),
				parentId = parentUrl || parentPage[ 0 ][ $.expando ],
				parentListId = parentList.attr( "id" ),
				o = this.options,
				dns = "data-" + $.mobile.ns,
				self = this,
				persistentFooterID = parentPage.find( ":jqmData(role='footer')" ).jqmData( "id" ),
				hasSubPages,
				newRemove;

			if ( typeof listCountPerPage[ parentId ] === "undefined" ) {
				listCountPerPage[ parentId ] = -1;
			}

			parentListId = parentListId || ++listCountPerPage[ parentId ];

			$( parentList.find( "li>ul, li>ol" ).toArray().reverse() ).each(function ( i ) {
				var self = this,
					list = $( this ),
					listId = list.attr( "id" ) || parentListId + "-" + i,
					parent = list.parent(),
					nodeEls,
					title = nodeEls.first().getEncodedText(),//url limits to first 30 chars of text
					id = ( parentUrl || "" ) + "&" + $.mobile.subPageUrlKey + "=" + listId,
					theme = list.jqmData( "theme" ) || o.theme,
					countTheme = list.jqmData( "counttheme" ) || parentList.jqmData( "counttheme" ) || o.countTheme,
					newPage,
					anchor;

				nodeEls = $( list.prevAll().toArray().reverse() );
				nodeEls = nodeEls.length ? nodeEls : $( "<span>" + $.trim( parent.contents()[ 0 ].nodeValue ) + "</span>" );

				//define hasSubPages for use in later removal
				hasSubPages = true;

				newPage = list.detach()
							.wrap( "<div " + dns + "role='page' " +	dns + "url='" + id + "' " + dns + "theme='" + theme + "' " + dns + "count-theme='" + countTheme + "'><div " + dns + "role='content'></div></div>" )
							.parent()
								.before( "<div " + dns + "role='header' " + dns + "theme='" + o.headerTheme + "'><div class='ui-title'>" + title + "</div></div>" )
								.after( persistentFooterID ? $( "<div " + dns + "role='footer' " + dns + "id='" + persistentFooterID + "'>" ) : "" )
								.parent()
								.appendTo( $.mobile.pageContainer );

				newPage.page();

				anchor = parent.find('a:first');

				if ( !anchor.length ) {
					anchor = $( "<a/>" ).html( nodeEls || title ).prependTo( parent.empty() );
				}

				anchor.attr( "href", "#" + id );

			}).virtuallistview();

			// on pagehide, remove any nested pages along with the parent page, as long as they aren't active
			// and aren't embedded
			if ( hasSubPages &&
						parentPage.is( ":jqmData(external-page='true')" ) &&
						parentPage.data( "page" ).options.domCache === false ) {

				newRemove = function ( e, ui ) {
					var nextPage = ui.nextPage, npURL;

					if ( ui.nextPage ) {
						npURL = nextPage.jqmData( "url" );
						if ( npURL.indexOf( parentUrl + "&" + $.mobile.subPageUrlKey ) !== 0 ) {
							self.childPages().remove();
							parentPage.remove();
						}
					}
				};

				// unbind the original page remove and replace with our specialized version
				parentPage
					.unbind( "pagehide.remove" )
					.bind( "pagehide.remove", newRemove );
			}
		},

		// TODO sort out a better way to track sub pages of the virtuallistview this is brittle
		childPages: function () {
			var parentUrl = this.parentPage.jqmData( "url" );

			return $( ":jqmData(url^='" +  parentUrl + "&" + $.mobile.subPageUrlKey + "')" );
		}
	});

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.virtuallistview.prototype.options.initSelector, e.target ).virtuallistview();
	});

} ( jQuery ) );


/*
* Module Name : jquery.mobile.tizen.loader
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 * @class core
 * loader.js
 *
 * Youmin Ha <youmin.ha@samsung.com>
 *
 *
 */
/*
	Web UI scaling concept in Tizen Web UI

Generally, web applications must be designed to be showed acceptable on various size and resolution of screens, and web winsets have to be scaled well.  Tizen Web UI Framework supports various viewport settings, and Tizen Web UI widgets are designed to be scalable on various screen sizes.  In order to make web applications scalable on many devices which have different screen size, it is necessary to understand how mobile web browsers deal with screen resolution, and how Tizen Web UI Framework supports scaling for web applications.


* Viewport on mobile web browser

Viewport is an area showing web content on the browser.  Unlike desktop browsers, mobile browsers support logical viewport seting, which means that application can set viewport width/height and zoom level by itself.
The very important thing that to be remembered is that the viewport resolution in pixel is 'Logical', not physical.  For example, if the viewport width is set to 480 on a mobile device having 720px screen width, the viewport width is considered to 480px logically. All elements put on right side from 480px horizontal position will not be shown on the viewport.
Most mobile browsers set viewport with given content attribute with <meta name="viewport" content="..."> tag in <head> section in the application source html, whereas desktop browsers ignore the tag.
Detailed usage of viewport meta tag is found in here: http://www.w3.org/TR/mwabp/#bp-viewport


* Viewport setting by application developers

When developers write <meta name="viewport" content="..."> in the <head> section of the web application HTML file, Tizen Web UI Framework does not add another viewport meta tag, nor modify developer-defined viewport.


* Automatic viewport setting by Tizen Web UI Framework

If developers do not give a viewport meta tag, Tizen Web UI Framework automatically add a viewport meta tag with default viewport setting.


* Portrait/landscape mode


* Tizen Web UI widgets scaling


 */
( function ($, Globalize, window, undefined) {

	var tizen = {
		libFileName : "tizen-web-ui-fw(.custom|.full)?(.min)?.js",

		frameworkData : {
			rootDir: '/usr/share/tizen-web-ui-fw',
			version: '0.2',
			theme: "tizen-black",
			viewportWidth: "device-width",
			viewportScale: false,

			defaultFontSize: 22,
			minified: false,
			deviceCapa: { inputKeyBack: true, inputKeyMenu: true },
			debug: false
		},

		log : {
			debug : function ( msg ) {
				if ( tizen.frameworkData.debug ) {
					console.log( msg );
				}
			},
			warn : function ( msg ) {
				console.warn( msg );
			},
			error : function ( msg ) {
				console.error( msg );
			},
			alert : function ( msg ) {
				window.alert( msg );
			}
		},

		util : {

			loadScriptSync : function ( scriptPath, successCB, errorCB ) {
				$.ajax( {
					url: scriptPath,
					dataType: 'script',
					async: false,
					crossDomain: false,
					success: successCB,
					error: function ( jqXHR, textStatus, errorThrown ) {
						if ( errorCB ) {
							errorCB( jqXHR, textStatus, errorThrown );
						} else {
							var ignoreStatusList = [ 404 ],  // 404: not found
								errmsg = ( 'Error while loading ' + scriptPath + '\n' + jqXHR.status + ':' + jqXHR.statusText );
							if ( -1 == $.inArray( jqXHR.status, ignoreStatusList ) ) {
								tizen.log.alert( errmsg );
							} else {
								tizen.log.warn( errmsg );
							}
						}
					}
				} );
			},
			isMobileBrowser: function ( ) {
				var mobileIdx = window.navigator.appVersion.indexOf("Mobile"),
					isMobile = -1 < mobileIdx;
				return isMobile;
			}
		},

		css : {
			cacheBust: ( document.location.href.match( /debug=true/ ) ) ?
					'?cacheBust=' + ( new Date( ) ).getTime( ) :
					'',
			addElementToHead : function ( elem ) {
				var head = document.getElementsByTagName( 'head' )[0];
				if ( head ) {
					$( head ).prepend( elem );
				}
			},
			makeLink : function ( href ) {
				var cssLink = document.createElement( 'link' );
				cssLink.setAttribute( 'rel', 'stylesheet' );
				cssLink.setAttribute( 'href', href );
				cssLink.setAttribute( 'name', 'tizen-theme' );
				return cssLink;
			},
			load: function ( path ) {
				var head = document.getElementsByTagName( 'head' )[0],
					cssLinks = head.getElementsByTagName( 'link' ),
					idx,
					l = null;
				// Find css link element
				for ( idx = 0; idx < cssLinks.length; idx++ ) {
					if ( cssLinks[idx].getAttribute( 'rel' ) != "stylesheet" ) {
						continue;
					}
					if ( cssLinks[idx].getAttribute( 'name' ) == "tizen-theme"
							|| cssLinks[idx].getAttribute( 'href' ) == path ) {
						l = cssLinks[idx];
						break;
					}
				}
				if ( l ) {	// Found the link element!
					if ( l.getAttribute( 'href' ) == path ) {
						tizen.log.debug( "Theme is already loaded. Skip theme loading in the framework." );
					} else {
						l.setAttribute( 'href', path );
					}
				} else {
					this.addElementToHead( this.makeLink( path ) );
				}
			}
		},

		getParams: function ( ) {
			/* Get data-* params from <script> tag, and set tizen.frameworkData.* values
			 * Returns true if proper <script> tag is found, or false if not.
			 */
			// Find current <script> tag element
			var scriptElems = document.getElementsByTagName( 'script' ),
				val = null,
				foundScriptTag = false,
				idx,
				elem,
				src,
				tokens,
				version_idx;
/*
			function getTizenTheme( ) {
				var t = navigator.theme ? navigator.theme.split( ':' )[0] : null;
				if ( t ) {
					t = t.replace('-hd', '');
					if ( ! t.match( /^tizen-/ ) ) {
						t = 'tizen-' + t;
					}
				}
				return t;
			}
*/
			for ( idx in scriptElems ) {
				elem = scriptElems[idx];
				src = elem.src ? elem.getAttribute( 'src' ) : undefined;
				if (src && src.match( this.libFileName )) {
					// Set framework data, only when they are given.
					tokens = src.split(/[\/\\]/);
					version_idx = -3;
					this.frameworkData.rootDir = ( elem.getAttribute( 'data-framework-root' )
						|| tokens.slice( 0, tokens.length + version_idx ).join( '/' )
						|| this.frameworkData.rootDir ).replace( /^file:(\/\/)?/, '' );
					this.frameworkData.version = elem.getAttribute( 'data-framework-version' )
						|| tokens[ tokens.length + version_idx ]
						|| this.frameworkData.version;
					this.frameworkData.theme = elem.getAttribute( 'data-framework-theme' )
						//|| getTizenTheme( )
						|| this.frameworkData.theme;
					this.frameworkData.viewportWidth = elem.getAttribute( 'data-framework-viewport-width' )
						|| this.frameworkData.viewportWidth;
					this.frameworkData.viewportScale =
						"true" === elem.getAttribute( 'data-framework-viewport-scale' ) ? true
						: this.frameworkData.viewportScale;
					this.frameworkData.minified = src.search(/\.min\.js$/) > -1 ? true : false;
					this.frameworkData.debug = "true" === elem.getAttribute( 'data-framework-debug' ) ? true
						: this.frameworkData.debug;
					foundScriptTag = true;
					break;
				}
			}
			return foundScriptTag;
		},

		loadTheme: function ( theme ) {
			var themePath,
			cssPath,
			jsPath;

			if ( ! theme ) {
				theme = tizen.frameworkData.theme;
			}
			
			themePath = tizen.frameworkData.rootDir + '/' + tizen.frameworkData.version + '/themes/' + theme;
			
			jsPath = themePath + '/theme.js';
	
			if ( tizen.frameworkData.minified ) {
				cssPath = themePath + '/tizen-web-ui-fw-theme.min.css';
			} else {
				cssPath = themePath + '/tizen-web-ui-fw-theme.css';
			}
			tizen.css.load( cssPath );
			tizen.util.loadScriptSync( jsPath );
		},

		/** Load Globalize culture file, and set default culture.
		 *  @param[in]  language  (optional) Language code. ex) en-US, en, ko-KR, ko
		 *                        If language is not given, read language from html 'lang' attribute, 
		 *                        or from system setting.
		 *  @param[in]  cultureDic (optional) Dictionary having language code->
		 */
		loadGlobalizeCulture: function ( language, cultureDic ) {
			var self = this,
				cFPath,
				lang,
				mockJSXHR;

			function getLang ( language ) {
				var lang = language
						|| $( 'html' ).attr( 'lang' )
						|| window.navigator.language.split( '.' )[0]	// Webkit, Safari + workaround for Tizen
						|| window.navigator.userLanguage	// IE
						|| 'en',
					countryCode = null,
					countryCodeIdx = lang.lastIndexOf('-'),
					ignoreCodes = ['Cyrl', 'Latn', 'Mong'];	// Not country code!
				if ( countryCodeIdx != -1 ) {	// Found country code!
					countryCode = lang.substr( countryCodeIdx + 1 );
					if ( ignoreCodes.join( '-' ).indexOf( countryCode ) < 0 ) {
						// countryCode is not found from ignoreCodes.
						// Make countryCode to uppercase.
						lang = [ lang.substr( 0, countryCodeIdx ), countryCode.toUpperCase( ) ].join( '-' );
					}
				}
				// NOTE: 'en' to 'en-US', because globalize has no 'en' culture file.
				lang = lang == 'en' ? 'en-US' : lang;
				return lang;
			}

			function getNeutralLang ( lang ) {
				var neutralLangIdx = lang.lastIndexOf( '-' ),
					neutralLang;
				if ( neutralLangIdx != -1 ) {
					neutralLang = lang.substr( 0, neutralLangIdx );
				}
				return neutralLang;
			}

			function getCultureFilePath ( lang, cFDic ) {
				var cFPath = null;	// error value

				if ( "string" != typeof lang ) {
					return null;
				}
				if ( cFDic && cFDic[lang] ) {
					cFPath = cFDic[lang];
				} else {
					// Default Globalize culture file path
					cFPath = [
						self.frameworkData.rootDir,
						self.frameworkData.version,
						'js',
						'cultures',
						['globalize.culture.', lang, '.js'].join( '' )
					].join( '/' );
				}
				return cFPath;
			}

			function printLoadError( cFPath, jqXHR ) {
				tizen.log.error( "Error " + jqXHR.status + ": " + jqXHR.statusText
						+ "::Culture file (" + cFPath + ") is failed to load.");
			}

			function loadCultureFile ( cFPath, errCB ) {
				function _successCB ( ) {
					tizen.log.debug( "Culture file (" + cFPath + ") is loaded successfully." );
				}
				function _errCB ( jqXHR, textStatus, err ) {
					if ( errCB ) {
						errCB( jqXHR, textStatus, err );
					} else {
						printLoadError( cFPath, jqXHR );
					}
				}

				if ( ! cFPath ) {	// Invalid cFPath -> Regard it as '404 Not Found' error.
					mockJSXHR = {
						status: 404,
						statusText: "Not Found"
					};
					_errCB( mockJSXHR, null, null );
				} else {
					$.ajax( {
						url: cFPath,
						dataType: 'script',
						cache: true,
						async: false,
						success: _successCB,
						error: _errCB
					} );
				}
			}

			lang = getLang( language );
			cFPath = getCultureFilePath( lang, cultureDic );
			loadCultureFile( cFPath,
				function ( jqXHR, textStatus, err ) {
					if ( jqXHR.status == 404 ) {
						// If culture file is not found, try once more with neutral lang.
						var nLang = getNeutralLang( lang ),
							ncFPath = getCultureFilePath( nLang, cultureDic );
						loadCultureFile( ncFPath, null );
					} else {
						printLoadError( cFPath, jqXHR );
					}
				} );

			return lang;
		},
		setGlobalize: function ( ) {
			var lang = this.loadGlobalizeCulture( );

			// Set culture
			// NOTE: It is not needed to set with neutral lang.
			//       Globalize automatically deals with it.
			Globalize.culture( lang );
		},
		/**
		 * Load custom globalize culture file
		 * Find current system language, and load appropriate culture file from given colture file list.
		 *
		 * @param[in]	cultureDic	collection of 'language':'culture file path' key-val pair.
		 * @example
		 * var myCultures = {
		 *	"en"    : "culture/en.js",
		 *	"fr"    : "culture/fr.js",
		 *	"ko-KR" : "culture/ko-KR.js"
		 * };
		 * loadCultomGlobalizeCulture( myCultures );
		 *
		 * ex) culture/fr.js
		 * -------------------------------
		 * Globalize.addCultureInfo( "fr", {
		 *   messages: {
		 *     "hello" : "bonjour",
		 *     "translate" : "traduire"
		 *   }
		 * } );
		 * -------------------------------
		 */
		loadCustomGlobalizeCulture: function ( cultureDic ) {
			tizen.loadGlobalizeCulture( null, cultureDic );
		},

		/** Set viewport meta tag for mobile devices.
		 *
		 * @param[in]	viewportWidth	viewport width. "device-width" is OK.
		 */
		setViewport: function ( viewportWidth ) {
			var meta = null,
				head,
				content;

			// Do nothing if viewport setting code is already in the code.
			$( "meta[name=viewport]" ).each( function ( ) {
				meta = this;
				return;
			});
			if ( meta ) {	// Found custom viewport!
				content = $( meta ).prop( "content" );
				viewportWidth = content.replace( /.*width=(device-width|\d+)\s*,?.*$/gi, "$1" );
				tizen.log.debug( "Viewport is set to '" + viewportWidth + "' in a meta tag. Framework skips viewport setting." );
			} else {
				// Create a meta tag
				meta = document.createElement( "meta" );
				if ( meta ) {
					meta.name = "viewport";
					content = "width=" + viewportWidth + ", user-scalable=no";
					if ( ! isNaN( viewportWidth ) ) {
						// Fix scale to 1.0, if viewport width is set to fixed value.
						// NOTE: Works wrong in Tizen browser!
						//content = [ content, ", initial-scale=1.0, maximum-scale=1.0" ].join( "" );
					}
					meta.content = content;
					tizen.log.debug( content );
					head = document.getElementsByTagName( 'head' ).item( 0 );
					head.insertBefore( meta, head.firstChild );
				}
			}
			return viewportWidth;
		},

		/**	Read body's font-size, scale it, and reset it.
		 *  param[in]	desired font-size / base font-size.
		 */
		scaleBaseFontSize: function ( themeDefaultFontSize, ratio ) {
			tizen.log.debug( "themedefaultfont size: " + themeDefaultFontSize + ", ratio: " + ratio );
			var scaledFontSize = Math.max( Math.floor( themeDefaultFontSize * ratio ), 4 );

			$( 'html' ).css( { 'font-size': scaledFontSize + "px" } );
			tizen.log.debug( 'html:font size is set to ' + scaledFontSize );
			$( document ).ready( function ( ) {
				$( '.ui-mobile' ).children( 'body' ).css( { 'font-size': scaledFontSize + "px" } );
			} );
		},

		setScaling: function ( ) {
			var viewportWidth = this.frameworkData.viewportWidth,
				themeDefaultFontSize = this.frameworkData.defaultFontSize, // comes from theme.js
				ratio = 1;

			// Keep original font size
			$( 'body' ).attr( 'data-tizen-theme-default-font-size', themeDefaultFontSize );

			if ( !tizen.util.isMobileBrowser() ) {
				return;
			}

			// Legacy support: tizen.frameworkData.viewportScale
			if ( this.frameworkData.viewportScale == true ) {
				viewportWidth = "screen-width";
			}

			// screen-width support
			if ( "screen-width" == viewportWidth ) {
				if ( window.self == window.top ) {
					// Top frame: for target. Use window.outerWidth.
					viewportWidth = window.outerWidth;
				} else {
					// iframe: for web simulator. Use clientWidth.
					viewportWidth = document.documentElement.clientWidth;
				}
			}

			// set viewport meta tag
			viewportWidth = this.setViewport( viewportWidth );	// If custom viewport setting exists, get viewport width

			if ( viewportWidth == "device-width" ) {
				// Do nothing!
			} else {	// fixed width!
				ratio = parseFloat( viewportWidth / this.frameworkData.defaultViewportWidth );
				this.scaleBaseFontSize( themeDefaultFontSize, ratio );
			}
		}
	};

	function export2TizenNS ( $, tizen ) {
		if ( !$.tizen ) {
			$.tizen = { };
		}

		$.tizen.frameworkData = tizen.frameworkData;
		$.tizen.loadCustomGlobalizeCulture = tizen.loadCustomGlobalizeCulture;
		$.tizen.loadTheme = tizen.loadTheme;

		$.tizen.__tizen__ = tizen;	// for unit-test
	}

	export2TizenNS( $, tizen );

	tizen.getParams( );
	tizen.loadTheme( );
	tizen.setScaling( );	// Run after loadTheme(), for the default font size.
	tizen.setGlobalize( );
	// Turn off JQM's auto initialization option.
	// NOTE: This job must be done before domready.
	$.mobile.autoInitializePage = false;

	$(document).ready( function ( ) {
		$.mobile.initializePage( );
	});

} ( jQuery, Globalize, window ) );


/*
* Module Name : widgets/jquery.mobile.tizen.notification
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/*
 * Notification widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'notification'.
 *  data-type: 'ticker' or 'popup'.
 *  data-interval: time to showing. If don't set, will show infinitely.
 *
 * APIs
 *
 *  open(): open the notification.
 *  close(): close the notification.
 *  text(text0, text1): set texts or get texts
 *  icon(src): set the icon (tickernoti only)
 *
 * Events
 *
 *  N/A
 *
 * Examples
 *
 * // tickernoti
 * <div data-role="notification" id="notification" data-type="ticker" data-interval="3000">
 *	<img src="icon01.png">
 *	<p>Hello World</p>
 *	<p>Denis</p>
 * </div>
 *
 * // smallpopup
 * <div data-role="notification" id="notification" data-type="popup" data-interval="3000">
 *	<p>Hello World</p>
 * </div>
 *
 */

/**
	@class Notification
	The notification widget shows a pop-up window on the screen to provide notifications.
	To add a notification widget to the application, use the following code:

		<div data-role="page">
			<div data-role="notification" data-type="smallpopup">
				<p>text1</p>
			</div>
			<div data-role="header"></div>
			<div data-role="content"></div>
			<div data-role="footer"></div>
		</div>
*/
/**
	@property {String} data-type
	Defines the notification type. The type options are tickernoti and smallpopup. <br/>The default value is smallpopup.

*/
/**
	@property {Integer} data-interval
	Defines the time to showing a notification widget. <br/>The default is infinitely.

*/
/**
	@method open
	The open method is used to open the notification widget:

		<div data-role="notification" data-type="smallpopup" data-interval="3000"></div>
		$('#notification').notification('open');
*/
/**
	@method close
	The close method is used to close the notification widget:

		<div data-role="notification" data-type="smallpopup" data-interval="3000"></div>
		$('#notification').notification('close');
*/
/**
	@method text
	The text method is used to set or get the notification text:

		<div data-role="notification" data-type="smallpopup" data-interval="3000"></div>
		// Set notification text
		$('#notification').notification('text', 'setThisText');
		// Get notification text
		texts = $('#notification').notification('text');
	@since Tizen2.0
*/
/**
	@method icon
	The setIcon method is used to set the ticker notification icon. The icon can be set only if the notification type is set to tickernoti.

		<div data-role="notification" data-type="ticker" data-interval="3000"></div>
		$('#notification').notification('icon', './test.png');
*/
(function ( $, window ) {
	$.widget( "tizen.notification", $.mobile.widget, {
		btn: null,
		text_bg: [],
		icon_img: [],
		interval: null,
		seconds: null,
		running: false,

		_get_text: function () {
			var text = new Array( 2 );

			if ( this.type === 'ticker' ) {
				text[0] = $( this.text_bg[0] ).text();
				text[1] = $( this.text_bg[1] ).text();
			} else {
				text[0] = $( this.text_bg[0] ).text();
			}

			return text;
		},

		_set_text: function ( text0, text1 ) {
			var _set = function ( elem, text ) {
				if ( !text ) {
					return;
				}
				elem.text( text );
			};

			if ( this.type === 'ticker' ) {
				_set( $( this.text_bg[0] ), text0 );
				_set( $( this.text_bg[1] ), text1 );
			} else {
				_set( $( this.text_bg[0] ), text0 );
			}
		},

		text: function ( text0, text1 ) {
			if ( text0 === undefined && text1 === undefined ) {
				return this._get_text();
			}

			this._set_text( text0, text1 );
		},

		icon: function ( src ) {
			if ( src === undefined ) {
				return;
			}

			this.icon_img.detach();
			this.icon_img = $( "<img src='" + src + "' class='ui-ticker-icon'>" );
			$( this.element ).find(".ui-ticker").append( this.icon_img );
		},

		_refresh: function () {
			var container = this._get_container();

			$( container ).addClass("fix")
					.removeClass("show")
					.removeClass("hide");

			this._set_interval();
		},

		open: function () {
			var container = this._get_container();

			if ( this.running ) {
				this._refresh();
				return;
			}

			$( container ).addClass("show")
					.removeClass("hide")
					.removeClass("fix");

			this.running = true;

			if ( this.type === 'popup' ) {
				this._set_position();
			}

			this._set_interval();
		},

		close: function () {
			var container = this._get_container();

			if ( !this.running ) {
				return;
			}

			$( container ).addClass("hide")
					.removeClass("show")
					.removeClass("fix");

			this.running = false;
			clearInterval( this.interval );
		},

		destroy: function () {
			var container = this._get_container();

			$( container ).removeClass("show")
					.removeClass("hide")
					.removeClass("fix");

			this._del_event();

			this.running = false;
		},

		_get_container: function () {
			if ( this.type === 'ticker' ) {
				return $( this.element ).find(".ui-ticker");
			}

			return $( this.element ).find(".ui-smallpopup");
		},

		_set_interval: function () {
			var self = this;

			clearInterval( this.interval );

			if ( this.seconds !== undefined && this.second !== 0 ) {
				this.interval = setInterval( function () {
					self.close();
				}, this.seconds );
			}
		},

		_add_event: function () {
			var self = this,
				container = this._get_container();

			if ( this.type === 'ticker' ) {
				container.find(".ui-ticker-btn").append( this.btn ).trigger("create");

				this.btn.bind( "vmouseup", function () {
					self.close();
				});
			}

			container.bind( 'vmouseup', function () {
				self.close();
			});
		},

		_del_event: function () {
			var container = this._get_container();

			if ( this.type === 'ticker' ) {
				this.btn.unbind("vmouseup");
			}
			container.unbind('vmouseup');
			clearInterval( this.interval );
		},

		_set_position: function () {
			var container = this._get_container(),
				$footer = $('.ui-page-active').children('.ui-footer'),
				footer_h = $footer.outerHeight() || 0;

			container.css( 'bottom', footer_h);
		},

		_create: function () {
			var self = this,
				elem = $( this.element ),
				i;

			this.btn = $('<div data-role="button" data-inline="true">Close</div>');

			this.seconds = elem.jqmData('interval');
			this.type = elem.jqmData('type') || 'popup';

			if ( this.type === 'ticker' ) {
				elem.wrapInner("<div class='ui-ticker'></div>");
				elem.find(".ui-ticker").append("<div class='ui-ticker-body'></div>" +
							"<div class='ui-ticker-btn'></div>");
				this.text_bg = elem.find("p");

				if ( this.text_bg.length < 2 ) {
					elem.find(".ui-ticker").append("<p></p><p></p>");
					this.text_bg = elem.find("p");
				} else if ( this.text_bg.length > 2 ) {
					for ( i = 2; i < this.text_bg.length; i++ ) {
						$( this.text_bg[i] ).css( "display", "none" );
					}
				}

				$( this.text_bg[0] ).addClass("ui-ticker-text1-bg");
				$( this.text_bg[1] ).addClass("ui-ticker-text2-bg");

				this.icon_img = elem.find("img");

				if ( this.icon_img.length ) {
					$( this.icon_img ).addClass("ui-ticker-icon");

					for ( i = 1; i < this.icon_img.length; i++ ) {
						$( this.icon_img[i] ).css( "display", "none" );
					}
				}
			} else {
				elem.wrapInner("<div class='ui-smallpopup'></div>");
				this.text_bg = elem.find("p").addClass("ui-smallpopup-text-bg");

				if ( this.text_bg.length < 1 ) {
					elem.find(".ui-smallpopup")
						.append("<p class='ui-smallpopup-text-bg'></p>");
					this.text_bg = elem.find("p");
				} else if ( this.text_bg.length > 1 ) {
					for ( i = 1; i < this.text_bg.length; i++ ) {
						$( this.text_bg[i] ).css( "display", "none" );
					}
				}

				this._set_position();
			}

			this._add_event();

			$( window ).bind( "resize", function () {
				if ( !self.running ) {
					return;
				}

				self._refresh();

				if ( self.type === 'popup' ) {
					self._set_position();
				}
			});
		}
	}); // End of widget

	// auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( e.target ).find(":jqmData(role='notification')").notification();
	});

	$( document ).bind( "pagebeforehide", function ( e ) {
		$( e.target ).find(":jqmData(role='notification')").notification('destroy');
	});
}( jQuery, this ));


/*
* Module Name : widgets/jquery.mobile.tizen.slider
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 * tizenslider modifies the JQuery Mobile slider and is created in the same way.
 *
 * See the JQuery Mobile slider widget for more information :
 *     http://jquerymobile.com/demos/1.0a4.1/docs/forms/forms-slider.html
 *
 * The JQuery Mobile slider option:
 *     theme: specify the theme using the 'data-theme' attribute
 *
 * Options:
 *     theme: string; the theme to use if none is specified using the 'data-theme' attribute
 *            default: 'c'
 *     popup: boolean; controls whether the popup is displayed or not
 *                   specify if the popup is enabled using the 'data-popup' attribute
 *                   set from javascript using .tizenslider('option','popup',newValue)
 *
 * Events:
 *     changed: triggers when the value is changed (rather than when the handle is moved)
 *
 * Examples:
 *
 *     <a href="#" id="popupEnabler" data-role="button" data-inline="true">Enable popup</a>
 *     <a href="#" id="popupDisabler" data-role="button" data-inline="true">Disable popup</a>
 *     <div data-role="fieldcontain">
 *         <input id="mySlider" data-theme='a' data-popup='false' type="range" name="slider" value="7" min="0" max="9" />
 *     </div>
 *     <div data-role="fieldcontain">
 *         <input id="mySlider2" type="range" name="slider" value="77" min="0" max="777" />
 *     </div>
 *
 *     // disable popup from javascript
 *     $('#mySlider').tizenslider('option','popup',false);
 *
 *     // from buttons
 *     $('#popupEnabler').bind('vclick', function() {
 *         $('#mySlider').tizenslider('option','popup',true);
 *     });
 *     $('#popupDisabler').bind('vclick', function() {
 *         $('#mySlider').tizenslider('option','popup',false);
 *     });
 */

/**
	@class Slider
	The slider widget shows a control on the screen that you can use to change values by dragging a handle on a horizontal scale. Sliders can be used in Tizen as described in the jQueryMobile documentation for sliders.

	To add a slider widget to the application, use the following code:

		<input data-popup='false' type="range" name="slider" value="5" min="0" max="10" data-icon="text" data-text-left="Min" data-text-right="Max" />

	The slider can define callbacks for events as described in the jQueryMobile documentation for slider events.
	You can use methods with the slider as described in the jQueryMobile documentation for slider methods.
*/
/**
	@property {String} data-icon
	Defines the icon style for the slider ends. The icon options are bright, volume, and text.
	The default value is text.
*/
/**
	@property {Boolean} data-popup
	Enables or disables a pop-up showing the current value while the handle is dragged.
	The default value is true.
*/
/**
	@property {String} data-text-left
	Defines the text displayed on the left side of the slider.
	The data-icon option must be set to text.
*/
/**
	@property {String} data-text-right
	Defines the text displayed on the right side of the slider.
	The data-icon option must be set to text.
*/

(function ($, window, undefined) {
	$.widget("tizen.tizenslider", $.mobile.widget, {
		options: {
			popup: true
		},

		popup: null,
		handle: null,
		handleText: null,

		_create: function () {
			this.currentValue = null;
			this.popupVisible = false;

			var self = this,
				inputElement = $( this.element ),
				slider,
				popupEnabledAttr,
				icon,
				text_right,
				text_left,
				text_length,
				elem_left,
				elem_right,
				margin_left,
				margin_right,
				_closePopup;

			// apply jqm slider
			inputElement.slider();

			// hide the slider input element proper
			inputElement.hide();

			self.popup = $('<div class="ui-slider-popup"></div>');

			// set the popup according to the html attribute
			popupEnabledAttr = inputElement.jqmData('popup');
			if ( popupEnabledAttr !== undefined ) {
				self.options.popup = ( popupEnabledAttr == true );
			}

			// get the actual slider added by jqm
			slider = inputElement.next('.ui-slider');

			icon = inputElement.attr('data-icon');

			// wrap the background
			slider.wrap('<div class="ui-slider-container"></div>');

			// get the handle
			self.handle = slider.find('.ui-slider-handle');

			// remove the rounded corners from the slider and its children
			slider.removeClass('ui-btn-corner-all');
			slider.find('*').removeClass('ui-btn-corner-all');

			// add icon
			switch ( icon ) {
			case 'bright':
			case 'volume':
				elem_left = $('<div class="ui-slider-left-' + icon + '"></div>');
				elem_right = $('<div class="ui-slider-right-' + icon + '"></div>');

				slider.before( elem_left );
				slider.after( elem_right );

				margin_left = elem_left.width() + 16;
				margin_right = elem_right.width() + 16;
				break;

			case 'text':
				text_left = ( inputElement.attr('data-text-left') === undefined ) ? '' :
						inputElement.attr('data-text-left').substring( 0, 3 );
				text_right = ( inputElement.attr('data-text-right') === undefined ) ? '' :
						inputElement.attr('data-text-right').substring( 0, 3 );

				text_length = Math.max( text_left.length, text_right.length ) + 1;

				margin_left = text_length + "rem";
				margin_right = text_length + "rem";

				elem_left = $('<div class="ui-slider-left-text" style="left:' +
					-( text_length ) + 'rem; width:' + text_length + 'rem;">' +
					'<span style="position:relative;top:0.4em;">' +
					text_left +
					'</span></div>');
				elem_right = $('<div class="ui-slider-right-text" style="right:' +
					-( text_length ) + 'rem; width:' + text_length + 'rem;">' +
					'<span style="position:relative;top:0.4em;">' +
					text_right +
					'</span></div>');

				slider.before( elem_left );
				slider.after( elem_right );
				break;
			}

			if ( icon ) {
				slider.parent('.ui-slider-container').css({
					"margin-left": margin_left,
					"margin-right": margin_right
				});
			}

			// add a popup element (hidden initially)
			slider.parents(".ui-page").append( self.popup );
			self.popup.hide();

			// get the element where value can be displayed
			self.handleText = slider.find('.ui-btn-text');

			// set initial value
			self.updateSlider();

			_closePopup = function () {
				slider.trigger( 'vmouseup' );
			};

			// bind to changes in the slider's value to update handle text
			this.element.on('change', function () {
				// 2013.05.31 heeju.joo
				// for "refresh" method, (ex. $("input").val(5).slider("refresh"))
				// conditional statement has been added ( DCM-1735 )
				// if this function just call two functions like else statement,
				// popup and handle displayed in the wrong position because when the variable popupVisible is false, updateSlider() does not call popupPosition().
				if ( !self.popupVisible ) {
					// it is trick to cheat self.updateSlider()
					self.popupVisible = true;
					// updateSlider make the position of handle right
					self.updateSlider();
					// for other method, popupVisible variable need to have original value.
					self.popupVisible = false;
				} else {
					self.updateSlider();
					self.showPopup();
					$.mobile.$document.on( 'vmouseup.slider', _closePopup );
				}
			});

			this.element.on( 'slidestart', function ( event ) {
				self.updateSlider();
				self.showPopup();
				$.mobile.$document.on( 'vmouseup.slider', _closePopup );
			});

			// bind clicks on the handle to show the popup
			self.handle.on('vmousedown', function () {
				self.handle.addClass( "ui-slider-handle-press" );
				self.showPopup();
				$.mobile.$document.on( 'vmouseup.slider', _closePopup );
			});

			slider.on( 'vmousedown', function () {
				self.updateSlider();
				self.handle.addClass( "ui-slider-handle-press" );
				self.showPopup();
				$.mobile.$document.on( 'vmouseup.slider', _closePopup );
			}).on( 'mouseup touchend vmouseup', function () {
				self.hidePopup();
				self.handle.removeClass( "ui-slider-handle-press" );
				$.mobile.$document.off('vmouseup.slider');
			});

			$.extend( this, {
				_globalHandler: [
					{
						src: $( window ),
						handler: {
							orientationchange: _closePopup,
						}
					}
				]
			});

			$.each( this._globalHandler, function ( idx, value ) {
				value.src.bind( value.handler );
			});

		},

		// position the popup
		positionPopup: function () {
			var dstOffset = this.handle.offset();

			this.popup.css({
				left: dstOffset.left + ( this.handle.width() - this.popup.width() ) / 2,
				top: dstOffset.top - this.popup.height()
			});
		},

		// show value on the handle and in popup
		updateSlider: function () {
			var font_size,
				font_length,
				font_top,
				padding_size,
				newValue,
				get_value_length = function ( v ) {
					var val = Math.abs( v ),
						len;

					if ( val > 999 ) {
						len = 4;
					} else if ( val > 99 ) {
						len = 3;
					} else if ( val > 9 ) {
						len = 2;
					} else {
						len = 1;
					}

					if ( v < 0 ) {
						len++;
					}

					return len;
				};

			// remove the title attribute from the handle (which is
			// responsible for the annoying tooltip); NB we have
			// to do it here as the jqm slider sets it every time
			// the slider's value changes :(
			this.handle.removeAttr('title');

			newValue = parseInt(this.element.val(), 10);

			font_length = get_value_length( newValue );

			if ( this.popupVisible ) {
				this.positionPopup();

				switch ( font_length ) {
				case 1:
				case 2:
					font_size = '1.5rem';
					padding_size = '0.15rem';
					break;
				case 3:
					font_size = '1rem';
					padding_size = '0.5rem';
					break;
				default:
					font_size = '0.8rem';
					padding_size = '0.5rem';
					break;
				}

				this.popup.css({
					"font-size": font_size,
					"padding-top": padding_size
				});
			}

			if ( newValue === this.currentValue ) {
				return;
			}

			switch ( font_length ) {
			case 1:
				font_size = '0.95rem';
				font_top = '0';
				break;
			case 2:
				font_size = '0.85rem';
				font_top = '-0.01rem';
				break;
			case 3:
				font_size = '0.65rem';
				font_top = '-0.1rem';
				break;
			default:
				font_size = '0.45rem';
				font_top = '-0.15rem';
				break;
			}

			if ( font_size != this.handleText.css('font-size') ) {
				this.handleText.css({
					'font-size': font_size,
					'top': font_top,
					'position': 'relative'
				});
			}

			this.currentValue = newValue;
			this.handleText.text( newValue );
			this.popup.html( newValue );

			this.element.trigger( 'update', newValue );
		},

		// show the popup
		showPopup: function () {
			if ( !this.options.popup || this.popupVisible ) {
				return;
			}

			this.popup.show();
			this.popupVisible = true;
		},

		// hide the popup
		hidePopup: function () {
			if ( !this.options.popup || !this.popupVisible ) {
				return;
			}

			this.popup.hide();
			this.popupVisible = false;
		},

		_setOption: function (key, value) {
			var needToChange = ( value !== this.options[key] );

			if ( !needToChange ) {
				return;
			}

			switch ( key ) {
			case 'popup':
				this.options.popup = value;

				if ( this.options.popup) {
					this.updateSlider();
				} else {
					this.hidePopup();
				}

				break;
			}
		}
	});

	// stop jqm from initialising sliders
	$( document ).on( "pagebeforecreate", function ( e ) {
		if ( $.data( window, "jqmSliderInitSelector" ) === undefined ) {
			$.data( window, "jqmSliderInitSelector",
				$.mobile.slider.prototype.options.initSelector );
			$.mobile.slider.prototype.options.initSelector = null;
		}
	});

	// initialise sliders with our own slider
	$( document ).on( "pagecreate create", function ( e ) {
		var jqmSliderInitSelector = $.data( window, "jqmSliderInitSelector" );
		$( e.target ).find(jqmSliderInitSelector).each(function () {
			var $this = $( this );
			if ( $this.is("select") ) {
				$this.slider();
			} else {
				$this.tizenslider();
			}
		});
	});

}( jQuery, this ));


/*
* Module Name : widgets/jquery.mobile.tizen.scrollview.handler
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 * "Handler" is a widget helping a user to scroll a window or panel.
 * It is different from the scrollview feature in that the handler has a fixed size
 * and disappears when a scroll size is smaller than a parent window's size.
 * If the handler widget is activated, a scroll bar on the screen will be deactivated.
 * The handler widget supports scrolling up and down and indicates the position of the scrolled window.
 *
 * HTML Attributes:
 *
 *		data-handler : This attribute is indicating that whether enable.
 *						If you want to use, you will set 'true'.
 *		data-handler-theme : Set the widget theme ( optional )
 *
 * APIs:
 *
 *		enableHandler ( boolean )
 *			: Get or set the use of handler widget.
 *			If the value is "true", it will be run handler widget.
 *			If the value is "false", it will be not run handler widget.
 *			If no value is specified, will act as a getter.
 *
 * Events:
 *
 * Examples:
 *
 *		<div data-role="content" data-scroll="y" data-handler="true">
 *			<ul data-role="listview">
 *				<li data-role="list-divider">A</li>
 *				<li><a href="#">Adam Kinkaid</a></li>
 *					...
 *			</ul>
 *		</div>
 */

/**
	@class handler
	The handler widget enables the user to vertically scroll through a page or panel using a fixed-size handle. The widget indicates the position of the scrolled window, and only appears on the screen if the parent page or panel's scroll size is larger than the screen size. <br/> To add a handler widget to the application, use the following code:

		<div data-role="content" data-scroll="y" data-handler="true">
			<ul data-role="listview">
				<li data-role="list-divider">A</li>
				<li><a href="#">Adam Kinkaid</a></li>
					...
			</ul>
		</div>
	
	You can use the enableHandler method with the handler widget to get (if no value is defined) or set the handler usage status. If the [enable] value is true, the handler is enabled; otherwise the handler is not used.

		$("#.selector").scrollview("enableHandler", [enable]);
*/
/**
	@property {Boolean} data-handler
	Enables the handler widget. The value must be set to true.
*/
/**
	@property {String} data-handler-theme
	Sets the handler widget theme.
*/
( function ( $, document, undefined ) {
	// The options of handler in scrollview
	$.tizen.scrollview.prototype.options.handler = false;
	$.tizen.scrollview.prototype.options.handlerTheme = "s";

	var originSetOption = $.tizen.scrollview.prototype._setOption,
		createHandler = function ( target ) {
			var $view = target,
				prefix = "<div class=\"ui-handler ui-handler-direction-",
				suffix = "\"><div class=\"ui-handler-track\"><div class=\"ui-handler-handle\"><div class=\"ui-handler-thumb\"></div></div></div></div>",
				scrollview = $view.data( "scrollview" ),
				options = scrollview.options,
				direction = options.direction,
				parentTheme = $.mobile.getInheritedTheme( scrollview, "s" ),
				theme = options.theme || parentTheme,
				isHorizontal = ( scrollview.options.direction === "x" ),
				_$view = scrollview._$view,
				_$clip = scrollview._$clip,
				scrollbar = $view.find( ".ui-scrollbar" ),
				handler = null,
				handlerHandle = null,
				viewLength = 0,
				clipLength = 0,
				handlerHeight = 0,
				handlerMargin = 0,
				trackLength = 0,
				moveTimer,
				isTouchable = $.support.touch,
				dragStartEvt = ( isTouchable ? "touchstart" : "mousedown" ) + ".handler",
				dragMoveEvt = ( isTouchable ? "touchmove" : "mousemove" ) + ".handler",
				dragStopEvt = ( isTouchable ? "touchend" : "mouseup" ) + ".handler",
				dragLeaveEvt = ( isTouchable ? " touchleave" : " mouseleave" ) + ".handler",
				calculateLength = function () {
					clipLength = ( isHorizontal ? _$clip.width() : _$clip.height() );
					viewLength = ( isHorizontal ? _$view.width() : _$view.height() ) - clipLength;
					trackLength = clipLength - handlerHeight - handlerMargin * 2;
				},
				setHanderPostion = function ( scrollPos ) {
					var handlerPos = Math.round( ( isHorizontal ? scrollPos.x : scrollPos.y ) / viewLength * trackLength );
					handlerHandle[0].style[ ( isHorizontal ? "left" : "top" ) ] = handlerPos + "px";
				},
				stopHandlerScroll = function () {
					$( document ).unbind( ".handler" );
					$view.moveData = null;
					_$view.trigger( "scrollstop" );
				};

			if ( $view.find( ".ui-handler-handle" ).length !== 0 || typeof direction !== "string" ) {
				return;
			}

			handler = $( [ prefix, direction, suffix ].join( "" ) ).appendTo( $view.addClass( " ui-handler-" + theme ) );
			handlerHandle = $view.find( ".ui-handler-handle" ).attr( {
				"tabindex" : "0",
				"aria-label" : ( isHorizontal ? "Horizontal handler, double tap and move to scroll" : "Verticalhandler, double tap and move to scroll" )
			}).hide();
			handlerHeight = ( isHorizontal ? handlerHandle.width() : handlerHandle.height() );
			handlerMargin = ( isHorizontal ? parseInt( handler.css( "right" ), 10 ) : parseInt( handler.css( "bottom" ), 10 ) );

			$.extend( $view, {
				moveData : null
			});

			// handler drag
			handlerHandle.bind( dragStartEvt, {
				e : handlerHandle[0]
			}, function ( event ) {
				scrollview._stopMScroll();

				var target = event.data.e,
					t = ( isTouchable ? event.originalEvent.targetTouches[0] : event );

				target.style.opacity = 1.0;

				$view.moveData = {
					target : target,
					X : parseInt( target.style.left, 10 ) || 0,
					Y : parseInt( target.style.top, 10 ) || 0,
					pX : t.pageX,
					pY : t.pageY
				};
				calculateLength();

				_$view.trigger( "scrollstart" );

				if ( !isTouchable ) {
					event.preventDefault();
				}

				$( document ).bind( dragMoveEvt, function ( event ) {
					var moveData = $view.moveData,
						target = moveData.target,
						handlePos = 0,
						scrollPos = 0,
						t = ( isTouchable ? event.originalEvent.targetTouches[0] : event );

					handlePos = ( isHorizontal ? moveData.X + t.pageX - moveData.pX : moveData.Y + t.pageY - moveData.pY );

					if ( handlePos < 0 ) {
						handlePos = 0;
					}

					if ( handlePos > trackLength ) {
						handlePos = trackLength;
					}
					scrollPos = - Math.round( handlePos / trackLength * viewLength );

					if ( isHorizontal ) {
						scrollview._setScrollPosition( scrollPos, 0 );
						target.style.left = handlePos + "px";
					} else {
						scrollview._setScrollPosition( 0, scrollPos );
						target.style.top = handlePos + "px";
					}

					event.preventDefault();
				}).bind( dragStopEvt + dragLeaveEvt, function ( event ) {
					stopHandlerScroll();
				});
			});

			_$view.bind( dragStopEvt, function ( event ) {
				stopHandlerScroll();
			});

			$view.bind( "scrollstart", function ( event ) {
				if ( !scrollview.enableHandler() ) {
					return;
				}

				calculateLength();

				if ( viewLength < 0 || clipLength < handlerHeight ) {
					if ( scrollbar.is( ":hidden" ) ) {
						scrollbar.show();
					}
					return;
				}

				if ( scrollbar.is( ":visible" ) ) {
					scrollbar.hide();
				}

				if ( moveTimer ) {
					clearInterval( moveTimer );
					moveTimer = undefined;
				}

				handler.addClass( "ui-handler-visible" );
				handlerHandle.stop( true, true )
							.fadeIn();
			}).bind( "scrollupdate", function ( event, data ) {
				if ( !scrollview.enableHandler() || viewLength < 0 || clipLength < handlerHeight ) {
					return;
				}

				setHanderPostion( scrollview.getScrollPosition() );
			}).bind( "scrollstop", function ( event ) {
				if ( !scrollview.enableHandler() || viewLength < 0 || clipLength < handlerHeight ) {
					return;
				}

				moveTimer = setInterval( function () {
					setHanderPostion( scrollview.getScrollPosition() );
					if ( !scrollview._gesture_timer ) {
						clearInterval( moveTimer );
						moveTimer = undefined;
					}
				}, 10 );

				if ( scrollview._handlerTimer ) {
					clearTimeout( scrollview._handlerTimer );
					scrollview._handlerTimer = 0;
				}
				scrollview._handlerTimer = setTimeout( function () {
					if ( scrollview._timerID === 0 && $view.moveData === null ) {
						handlerHandle.stop( true, true )
							.css( "opacity", 1.0 )
							.fadeOut( function () {
								handler.removeClass( "ui-handler-visible" );
							});
						scrollview._handlerTimer = 0;
					}
				}, 1000 );
			}).bind( "mousewheel", function ( event ) {
				handler.removeClass( "ui-handler-visible" );
				setHanderPostion( scrollview.getScrollPosition() );
			});
		};

	$.extend( $.tizen.scrollview.prototype, {
		enableHandler: function ( enabled ) {
			if ( typeof enabled === 'undefined' ) {
				return this.options.handler;
			}

			this.options.handler = !!enabled;

			var $view = this.element;
			if ( this.options.handler ) {
				if ( $view.find( ".ui-handler" ).length === 0 ) {
					createHandler( $view );
				}

				$view.find( ".ui-scrollbar" ).hide();
				$view.find( ".ui-handler" ).show();
			} else {
				$view.find( ".ui-handler" ).removeClass( "ui-handler-visible" ).hide();
				$view.find( ".ui-scrollbar" ).show();
			}
		},

		_setHandlerTheme: function ( handlerTheme ) {
			if ( !handlerTheme ) {
				return;
			}

			var oldClass = "ui-handler-" + this.options.handlerTheme,
				newClass = "ui-handler-" + handlerTheme;

			this.element.removeClass( oldClass ).addClass( newClass );
			this.options.handlerTheme = handlerTheme;
		},

		_setOption: function ( key, value ) {
			switch ( key ) {
			case "handler":
				this.enableHandler( value );
				break;
			case "handlerTheme":
				this._setHandlerTheme( value );
				break;
			default:
				originSetOption.call( this, key, value );
			}
		},

		_handlerTimer : 0
	});

	$( document ).delegate( ":jqmData(scroll)", "scrollviewcreate", function () {
		var widget = $( this );
		if ( widget.attr( "data-" + $.mobile.ns + "scroll" ) === "none"
				|| widget.attr( "data-" + $.mobile.ns + "handler" ) !== "true" ) {
			return;
		}
		widget.scrollview( "enableHandler", "true" );
	});
} ( jQuery, document ) );


/*
* Module Name : widgets/jquery.mobile.tizen.tokentextarea
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 *	The TokenTextArea widget changes a text item to a button. It can be comprised of a number of button widgets. 
 *	When a user types text and the text gets a specific event to change from a text to a button, 
 *	the input text is changed to a TokenTextArea widget.
 *	A user can add the TokenTextArea widget to a contact list, email list, or another list.
 *	The typical use of this widget is composing a number of contacts or phone numbers in a specific area of the screen.
 *
 *	HTML Attributes:
 *
 *		data-link : Represents the id of the page or the URL of other HTML file.
 *				The page contains data for the user, for example, an address book.
 *				If the value is null, anchor button doesn't work. (Default : null)
 *		data-label:	Provide a label for a user-guide. (Default : 'To : ')
 *		data-description : This attribute is managing message format.
 *				This message is displayed when widget status was changed to 'focusout'. (Default : '+ {0}')
 *
 *	APIs:
 *
 *		inputtext (  [string]  )
 *			: If argument is not exist, will get a string from inputbox.
 *			If argument is exist, will set a string to inputbox.
 *		select (  [number]  )
 *			: If no argument exists, gets a string of the selected block.
 *			If any button isn't selected on a token text area widget, this method returns "null" value.
 *			When a user call this method with an argument which is a number type,
 *			this method selects the button which is matched with the argument.
 *		add ( text, [number] )
 *			:  If second argument does not exist, will insert to a new button at last position.
 *			Insert a new button at indexed position. The position is decided by the second argument.
 *			"index of position" means that the position of inserting a new button is decided by the second argument on "add" method.
 *			For example, if a user call the method like this "add("Tizen", 2)",
 *			new button labed "Tizen" will be inserted on the third position.
 *		remove ( [number] )
 *			: If no argument exists, all buttons are removed.
 *			Remove a button at indexed position.
 *			The position is decided by the second argument. (index: index of button)
 *		length ( void )
 *			: Get a number of buttons.
 *		foucsIn ( void )
 *			: This method change a status to 'focusin'.
 *			This status is able to manage a widget.
 *		focusOut ( void )
 *			: Changes the focus status to 'focus out'.
 *			The status is not able to manage a widget.
 *			All buttons that contained in the widget are removed and
 *			summarized message is displayed.
 *		destroy ( void )
 *			: Remove all of the new DOM elements for the current widget that you created.
 *
 *	Events:
 *
 *		select : Occur when a button is selected.
 *		add : Occur when new button is inserted. (@since Tizen 2.1 deprecated, You can still use this event. But not recommended.)
 *		remove : Occur when a button is removed. (@since Tizen 2.1 deprecated, You can still use this event. But not recommended.)
 *
 *	Examples:
 *
 *		<div data-role="tokentextarea" data-label="To : " data-link="#pageId" data-description="+ {0}">
 *		</div>
 *
 */


/**
	@class TokenTextArea
	The TokenTextArea widget enables the user to enter text and convert it to a button. Each button that is created from entered text as a result of a change event forms a token text area widget. This widget is useful in composing an e-mail or SMS message to a group of addresses, each of which is a clickable item for more actions, such as copying, editing, or removing the address.

	To add a token text area widget to the application, use the following code:

		<div data-role="tokentextarea" data-label="To : " data-link="#pageId">
		</div>
*/

/**
	@property {String} data-label
	Sets a label as a guide for the user.
	For example, while composing an e-mail message, the 'To : ' label is a guide for the user to enter e-mail addresses.

		<div data-role="tokentextarea" data-label="To : ">
		</div>
*/

/**
	@property {String} data-decription
	Manages the message format.
	The message is displayed when the widget status changes to focus out

		<div data-role="tokentextarea" data-description=" + {0}">
		</div>
 */
/**
	@property {String} data-link
	Sets the ID of the page or the URL of other HTML file to which the button links.
	If the data-link is set with the URL of other HTML file, the 'dom-cache' option of both page - a page containing a Tokentextarea and a page in the target HTML file - must be set as 'true'.

		<div data-role="tokentextarea" data-link="#pageId">
		</div>

		<div data-role="tokentextarea" data-link="fileName.html" data-dom-cache="true">
		</div>
*/
/**
	@event select
	The select event is fired when a token text area widget button is selected:

		<div data-role="tokentextarea">
		</div>
		$(".selector").on("select", function(event, ui)
		{
			// Handle the select event
		});	
*/
/**
	@event add (@since Tizen 2.1 deprecated, You can still use this event. But not recommended.)
	The add event is fired when a token text area widget button is created:

		<div data-role="tokentextarea">
		</div>
		$(".selector").on("add", function(event, ui)
		{
			// Handle the add event
		});
*/
/**
	@event remove (@since Tizen 2.1 deprecated, You can still use this event. But not recommended.)
	The remove event is fired when a token text area widget button is removed:
	Restriction : "remove" event works under only "bind" event handling.

		<div data-role="tokentextarea">
		</div>
		$(".selector").bind("remove", function(event, ui)
		{
			// Handle the remove event
		});
*/
/**
	@method destroy
	The destroy method is used to remove in the current widget all the new DOM elements that you have created.

		<div data-role="tokentextarea">
		</div>
		$(".selector").tokentextarea("destroy");

	@since Tizen2.0
*/
/**
	@method inputText
	The inputText method is used to manage the widget input box text. If no parameter is set, the method gets the input box text. If a parameter is set, the parameter text is set in the input box.
	
		<div data-role="tokentextarea">
		</div>
		$(".selector").tokentextarea("inputText", [text]);
*/
/**
	@method select
	The select method is used to select a token text area widget button based on its index value. If no index value is defined, the method returns the string of the selected block. If there are no buttons present in the widget, the method returns null.

		<div data-role="tokentextarea">
		</div>
		$(".selector").tokentextarea("select", [index]);
*/
/**
	@method add
	The add method is used to add a new token text area widget button with the specified label text at the specified index position. If the index parameter is not defined, the widget button is added at the bottom of the list. For example, the $(".selector").tokentextarea("add", "Tizen", 2) method call creates a new widget button labeled 'Tizen' at the third position in the widget.

		<div data-role="tokentextarea">
		</div>
		$(".selector").tokentextarea("add", [text], [index]);
*/
/**
	@method remove
	The remove method is used to remove a token text area widget button at the specified index position. If the parameter is not defined, all the widget buttons are removed.

		<div data-role="tokentextarea">
		</div>
		$(".selector").tokentextarea("remove", [index]);
*/
/**
	@method length
	The length method is used to retrieve the number of buttons in the token text area widget:
		<div data-role="tokentextarea">
		</div>
		$(".selector").tokentextarea("length");
*/
/**
	@method focusIn
	The focusIn method is used to set the focus on input and set the focus status to "focus in". This focus state enables the user to add or remove buttons in the token text area widget.

		<div data-role="tokentextarea">
		</div>
		$(".selector").tokentextarea("focusIn");
*/
/**
	@method focusOut
	The focusOut method is used to set the focus status to "focus out". In this focus state, the user cannot manage the buttons in the widget, all the buttons are removed, and a message is displayed.

		<div data-role="tokentextarea">
		</div>
		$(".selector").tokentextarea("focusOut");
*/
( function ( $, window, document, undefined ) {
	$.widget( "tizen.tokentextarea", $.mobile.widget, {
		_focusStatus : null,
		_items : null,
		_viewWidth : 0,
		_reservedWidth : 0,
		_currentWidth : 0,
		_fontSize : 0,
		_anchorWidth : 0,
		_labelWidth : 0,
		_marginWidth : 0,
		options : {
			label : "To : ",
			link : null,
			description : "+ {0}"
		},

		_create : function () {
			var self = this,
				$view = this.element,
				role = $view.jqmData( "role" ),
				option = this.options,
				className = "ui-tokentextarea-link",
				inputbox = $( document.createElement( "input" ) ),
				labeltag = $( document.createElement( "span" ) ),
				moreBlock = $( document.createElement( "a" ) );

			$view.hide().empty().addClass( "ui-" + role );

			// create a label tag.
			$( labeltag ).text( option.label ).addClass( "ui-tokentextarea-label" ).attr( "tabindex", 0 );
			$view.append( labeltag );

			// create a input tag
			$( inputbox ).addClass( "ui-tokentextarea-input ui-tokentextarea-input-visible ui-input-text ui-body-s" ).attr( "role", "textbox" );
			$view.append( inputbox );

			// create a anchor tag.
			if ( option.link === null || $.trim( option.link ).length < 1 || $( option.link ).length === 0 ) {
				className += "-dim";
			}
			$( moreBlock ).attr( "data-role", "button" )
				.buttonMarkup( {
					inline: true,
					icon: "plus",
					style: "circle"
				})
				.attr( { "href" : $.trim( option.link ), "tabindex" : 0 } )
				.addClass( "ui-tokentextarea-link-base" )
				.addClass( className )
				.find( "span.ui-btn-text" )
				.text( "Add recipient" );

			// append default htmlelements to main widget.
			$view.append( moreBlock );

			// bind a event
			this._bindEvents();
			self._focusStatus = "init";
			// display widget
			$view.show();

			// assign global variables
			self._viewWidth = $view.innerWidth();
			self._reservedWidth += self._calcBlockWidth( moreBlock );
			self._reservedWidth += self._calcBlockWidth( labeltag );
			self._fontSize = parseInt( $( moreBlock ).css( "font-size" ), 10 );
			self._currentWidth = self._reservedWidth;
			self._modifyInputBoxWidth();
		},

		// bind events
		_bindEvents : function () {
			var self = this,
				$view = self.element,
				option = self.options,
				inputbox = $view.find( ".ui-tokentextarea-input" ),
				moreBlock = $view.find( ".ui-tokentextarea-link-base" );

			// delegate a event to HTMLDivElement(each block).
			$view.delegate( "div", "click", function ( event ) {
				if ( $( this ).hasClass( "ui-tokentextarea-sblock" ) ) {
					// If block is selected, it will be removed.
					self._removeTextBlock();
				}

				var lockBlock = $view.find( "div.ui-tokentextarea-sblock" );
				if ( typeof lockBlock !== "undefined" ) {
					lockBlock.removeClass( "ui-tokentextarea-sblock" ).addClass( "ui-tokentextarea-block" );
				}
				$( this ).removeClass( "ui-tokentextarea-block" ).addClass( "ui-tokentextarea-sblock" );
				$view.trigger( "select" );
			});

			inputbox.bind( "keyup", function ( event ) {
				// 8  : backspace
				// 13 : Enter
				// 186 : semi-colon
				// 188 : comma
				var keyValue = event.keyCode,
					valueString = $( inputbox ).val(),
					valueStrings = [],
					index,
					isSeparator = false;

				if ( keyValue === 8 ) {
					if ( valueString.length === 0 ) {
						self._validateTargetBlock();
					}
				} else if ( keyValue === 13 || keyValue === 186 || keyValue === 188 ) {
					if ( valueString.length !== 0 ) {
						// split content by separators(',', ';')
						valueStrings = valueString.split ( /[,;]/ );
						for ( index = 0; index < valueStrings.length; index++ ) {
							if ( valueStrings[index].length !== 0 && valueStrings[index].replace( /\s/g, "" ).length !== 0 ) {
								self._addTextBlock( valueStrings[index] );
							}
						}
					}
					inputbox.val( "" );
					isSeparator = true;
				} else {
					self._unlockTextBlock();
				}

				return !isSeparator;
			});

			inputbox.focus(function() {
				inputbox.addClass( $.mobile.focusClass );
			})
			.blur(function() {
				inputbox.removeClass( $.mobile.focusClass );
			});

			moreBlock.click( function () {
				if ( $( moreBlock ).hasClass( "ui-tokentextarea-link-dim" ) ) {
					return;
				}

				$( inputbox ).removeClass( "ui-tokentextarea-input-visible" ).addClass( "ui-tokentextarea-input-invisible" );

				$.mobile.changePage( option.link, {
					transition: "slide",
					reverse: false,
					changeHash: false
				});
			});

			$( document ).bind( "pagechange.mbe", function ( event ) {
				if ( $view.innerWidth() === 0 ) {
					return ;
				}
				self.refresh();
				$( inputbox ).removeClass( "ui-tokentextarea-input-invisible" ).addClass( "ui-tokentextarea-input-visible" );
			});

			$view.bind( "click", function ( event ) {
				if ( self._focusStatus === "focusOut" ) {
					self.focusIn();
				}
			});
		},

		// create a textbutton and append this button to parent layer.
		// @param arg1 : string
		// @param arg2 : index
		_addTextBlock : function ( messages, blockIndex ) {
			if ( arguments.length === 0 ) {
				return;
			}

			if ( !messages ) {
				return ;
			}

			var self = this,
				$view = self.element,
				content = messages,
				index = blockIndex,
				blocks = null,
				textBlock = null;

			if ( self._viewWidth === 0 ) {
				self._viewWidth = $view.innerWidth();
			}

			// Create a new text HTMLDivElement.
			textBlock = $( document.createElement( 'div' ) );

			textBlock.text( content ).addClass( "ui-tokentextarea-block" ).attr( { "aria-label" : "double tap to edit", "tabindex" : 0 } );
			textBlock.css( {'visibility': 'hidden'} );

			blocks = $view.find( "div" );
			if ( index !== null && index <= blocks.length ) {
				$( blocks[index] ).before( textBlock );
			} else {
				$view.find( ".ui-tokentextarea-input" ).before( textBlock );
			}

			textBlock = self._ellipsisTextBlock( textBlock );
			textBlock.css( {'visibility': 'visible'} );

			self._modifyInputBoxWidth();

			textBlock.hide();
			textBlock.fadeIn( "fast", function () {
				self._currentWidth += self._calcBlockWidth( textBlock );
				$view.trigger( "add" );
			});
		},

		_removeTextBlock : function () {
			var self = this,
				$view = this.element,
				lockBlock = $view.find( "div.ui-tokentextarea-sblock" ),
				_temp = null,
				_dummy = function () {};

			if ( lockBlock !== null && lockBlock.length > 0 ) {
				self._currentWidth -= self._calcBlockWidth( lockBlock );

				lockBlock.fadeOut( "fast", function () {
					lockBlock.remove();
					self._modifyInputBoxWidth();
				});

				this._eventRemoveCall = true;
				if ( $view[0].remove ) {
					_temp = $view[0].remove;
					$view[0].remove = _dummy;
				}
				$view.triggerHandler( "remove" );
				if ( _temp) {
					$view[0].remove = _temp;
				}
				this._eventRemoveCall = false;
			} else {
				$view.find( "div:last" ).removeClass( "ui-tokentextarea-block" ).addClass( "ui-tokentextarea-sblock" );
			}
		},

		_calcBlockWidth : function ( block ) {
			return $( block ).outerWidth( true );
		},

		_unlockTextBlock : function () {
			var $view = this.element,
				lockBlock = $view.find( "div.ui-tokentextarea-sblock" );
			if ( lockBlock ) {
				lockBlock.removeClass( "ui-tokentextarea-sblock" ).addClass( "ui-tokentextarea-block" );
			}
		},

		// call when remove text block by backspace key.
		_validateTargetBlock : function () {
			var self = this,
				$view = self.element,
				lastBlock = $view.find( "div:last" ),
				tmpBlock = null;

			if ( lastBlock.hasClass( "ui-tokentextarea-sblock" ) ) {
				self._removeTextBlock();
			} else {
				tmpBlock = $view.find( "div.ui-tokentextarea-sblock" );
				tmpBlock.removeClass( "ui-tokentextarea-sblock" ).addClass( "ui-tokentextarea-block" );
				lastBlock.removeClass( "ui-tokentextarea-block" ).addClass( "ui-tokentextarea-sblock" );
			}
		},

		_ellipsisTextBlock : function ( textBlock ) {
			var self = this,
				$view = self.element,
				maxWidth = self._viewWidth / 2;

			if ( self._calcBlockWidth( textBlock ) > maxWidth ) {
				$( textBlock ).width( maxWidth - self._marginWidth );
			}

			return textBlock;
		},

		_modifyInputBoxWidth : function () {
			var self = this,
				$view = self.element,
				margin = 0,
				labelWidth = 0,
				anchorWidth = 0,
				inputBoxWidth = 0,
				blocks = $view.find( "div" ),
				blockWidth = 0,
				index = 0,
				inputBoxMargin = 10,
				inputBox = $view.find( ".ui-tokentextarea-input" );

			if ( $view.width() === 0 ) {
				return;
			}

			if ( self._labelWidth === 0 ) {
				self._labelWidth = $view.find( ".ui-tokentextarea-label" ).outerWidth( true );
				self._anchorWidth = $view.find( ".ui-tokentextarea-link-base" ).outerWidth( true );
				self._marginWidth = parseInt( ( $( inputBox ).css( "margin-left" ) ), 10 );
				self._marginWidth += parseInt( ( $( inputBox ).css( "margin-right" ) ), 10 );
				self._viewWidth = $view.innerWidth();
			}

			margin = self._marginWidth;
			labelWidth = self._labelWidth;
			anchorWidth = self._anchorWidth;
			inputBoxWidth = self._viewWidth - labelWidth;

			for ( index = 0; index < blocks.length; index += 1 ) {
				blockWidth = self._calcBlockWidth( blocks[index] );

				if ( blockWidth >= inputBoxWidth + anchorWidth ) {
					if ( blockWidth >= inputBoxWidth ) {
						inputBoxWidth = self._viewWidth - blockWidth;
					} else {
						inputBoxWidth = self._viewWidth;
					}
				} else {
					if ( blockWidth > inputBoxWidth ) {
						inputBoxWidth = self._viewWidth - blockWidth;
					} else {
						inputBoxWidth -= blockWidth;
					}
				}
			}

			inputBoxWidth -= margin;
			if ( inputBoxWidth < anchorWidth * 2 ) {
				inputBoxWidth = self._viewWidth - margin;
			}
			$( inputBox ).width( inputBoxWidth - anchorWidth - inputBoxMargin );
		},

		_stringFormat : function ( expression ) {
			var pattern = null,
				message = expression,
				i = 0;
			for ( i = 1; i < arguments.length; i += 1 ) {
				pattern = "{" + ( i - 1 ) + "}";
				message = message.replace( pattern, arguments[i] );
			}
			return message;
		},

		_resizeBlocks : function () {
			var self = this,
				$view = self.element,
				blocks = $view.find( "div" ),
				index = 0;

			for ( index = 0 ; index < blocks.length ; index += 1 ) {
				$( blocks[index] ).css( "width", "auto" );
				blocks[index] = self._ellipsisTextBlock( blocks[index] );
			}
		},

		//---------------------------------------------------- //
		//					Public Method   //
		//----------------------------------------------------//
		//
		// Focus In Event
		//
		focusIn : function () {
			var $view = this.element;

			if ( this._focusStatus === "focusIn" ) {
				// N_SE-48198 this function should always set focus on input
				$view.find( ".ui-tokentextarea-input" ).focus();
				return;
			}

			$view.find( ".ui-tokentextarea-label" ).attr( "tabindex", 0 ).show();
			$view.find( ".ui-tokentextarea-desclabel" ).remove();
			$view.find( "div.ui-tokentextarea-sblock" ).removeClass( "ui-tokentextarea-sblock" ).addClass( "ui-tokentextarea-block" );
			$view.find( "div" ).attr( { "aria-label" : "double tap to edit", "tabindex" : 0 } ).show();
			$view.find( ".ui-tokentextarea-input" ).removeClass( "ui-tokentextarea-input-invisible" ).addClass( "ui-tokentextarea-input-visible" ).attr( "tabindex", 0 );
			$view.find( "a" ).attr( "tabindex", 0 ).show();

			// change focus state.
			this._modifyInputBoxWidth();
			this._focusStatus = "focusIn";
			$view.removeClass( "ui-tokentextarea-focusout" ).addClass( "ui-tokentextarea-focusin" ).removeAttr( "tabindex" );
			$view.find( ".ui-tokentextarea-input" ).focus();
		},

		focusOut : function () {
			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			var self = this,
				$view = self.element,
				tempBlock = null,
				stateBlock = null,
				numBlock = null,
				statement = "",
				index = 0,
				lastIndex = 10,
				label = $view.find( ".ui-tokentextarea-label" ),
				more = $view.find( "span" ),
				blocks = $view.find( "div" ),
				currentWidth = $view.outerWidth( true ) - more.outerWidth( true ) - label.outerWidth( true ),
				blockWidth = 0;

			label.removeAttr( "tabindex" );
			$view.find( ".ui-tokentextarea-input" ).removeClass( "ui-tokentextarea-input-visible" ).addClass( "ui-tokentextarea-input-invisible" ).removeAttr( "tabindex" );
			$view.find( "a" ).removeAttr( "tabindex" ).hide();
			blocks.removeAttr( "aria-label" ).removeAttr( "tabindex" ).hide();

			currentWidth = currentWidth - self._reservedWidth;

			for ( index = 0; index < blocks.length; index++ ) {
				blockWidth = $( blocks[index] ).outerWidth( true );
				if ( currentWidth - blockWidth <= 0 ) {
					lastIndex = index - 1;
					break;
				}

				$( blocks[index] ).show();
				currentWidth -= blockWidth;
			}

			if ( lastIndex !== blocks.length ) {
				statement = self._stringFormat( self.options.description, blocks.length - lastIndex - 1 );
				tempBlock = $( document.createElement( 'span' ) );
				tempBlock.addClass( "ui-tokentextarea-desclabel" ).attr( { "aria-label" : "more, double tap to edit", "tabindex" : "-1" } );
				stateBlock = $( document.createElement( 'span' ) ).text( statement ).attr( "aria-hidden", "true" );
				numBlock = $( document.createElement( 'span' ) ).text( blocks.length - lastIndex - 1 ).attr( "aria-label", "and" ).css( "visibility", "hidden" );
				tempBlock.append( stateBlock );
				tempBlock.append( numBlock );
				$( blocks[lastIndex] ).after( tempBlock );
			}

			// update focus state
			this._focusStatus = "focusOut";
			$view.removeClass( "ui-tokentextarea-focusin" ).addClass( "ui-tokentextarea-focusout" ).attr( "tabindex", 0 );
		},

		inputText : function ( message ) {
			var $view = this.element;

			if ( arguments.length === 0 ) {
				return $view.find( ".ui-tokentextarea-input" ).val();
			}
			$view.find( ".ui-tokentextarea-input" ).val( message );
			return message;
		},

		select : function ( index ) {
			var $view = this.element,
				lockBlock = null,
				blocks = null;

			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			if ( arguments.length === 0 ) {
				// return a selected block.
				lockBlock = $view.find( "div.ui-tokentextarea-sblock" );
				if ( lockBlock ) {
					return lockBlock.text();
				}
				return null;
			}
			// 1. unlock all blocks.
			this._unlockTextBlock();
			// 2. select pointed block.
			blocks = $view.find( "div" );
			if ( blocks.length > index ) {
				$( blocks[index] ).removeClass( "ui-tokentextarea-block" ).addClass( "ui-tokentextarea-sblock" );
				$view.trigger( "select" );
			}
			return null;
		},

		add : function ( message, position ) {
			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			this._addTextBlock( message, position );
		},

		remove : function ( position ) {
			var self = this,
				$view = this.element,
				blocks = $view.find( "div" ),
				index = 0,
				_temp = null,
				_dummy = function () {};

			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			if ( arguments.length === 0 ) {
				blocks.fadeOut( "fast", function () {
					blocks.remove();
					self._modifyInputBoxWidth();
					self._trigger( "clear" );
				});
			} else if ( !isNaN( position ) ) {
				// remove selected button
				index = ( ( position < blocks.length ) ? position : ( blocks.length - 1 ) );

				$( blocks[index] ).fadeOut( "fast", function () {
					$( blocks[index] ).remove();
					self._modifyInputBoxWidth();
				});

				this._eventRemoveCall = true;
				if ( $view[0].remove ) {
					_temp = $view[0].remove;
					$view[0].remove = _dummy;
				}
				$view.triggerHandler( "remove" );
				if ( _temp) {
					$view[0].remove = _temp;
				}
				this._eventRemoveCall = false;
			}
		},

		length : function () {
			return this.element.find( "div" ).length;
		},

		refresh : function () {
			var self = this,
				viewWidth = this.element.innerWidth();

			if ( viewWidth && self._viewWidth !== viewWidth ) {
				self._viewWidth = viewWidth;
			}
			self._resizeBlocks();
			self._modifyInputBoxWidth();
		},

		destroy : function () {
			var $view = this.element,
				_temp = null,
				_dummy = function () {};

			if ( this._eventRemoveCall ) {
				return;
			}

			$view.find( ".ui-tokentextarea-label" ).remove();
			$view.find( "div" ).undelegate( "click" ).remove();
			$view.find( "a" ).remove();
			$view.find( ".ui-tokentextarea-input" ).unbind( "keyup" ).remove();

			this._eventRemoveCall = true;
			if ( $view[0].remove ) {
				_temp = $view[0].remove;
				$view[0].remove = _dummy;
			}
			$view.remove();
			if ( _temp) {
				$view[0].remove = _temp;
			}
			this._eventRemoveCall = false;

			this._trigger( "destroy" );
		}
	});

	$( document ).bind( "pagecreate create", function () {
		$( ":jqmData(role='tokentextarea')" ).tokentextarea();
	});

	$( window ).bind( "resize", function () {
		$( ":jqmData(role='tokentextarea')" ).tokentextarea( "refresh" );
	});
} ( jQuery, window, document ) );


/*
* Module Name : widgets/jquery.mobile.tizen.searchbar
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 * Searchbar can be created using <input> element with type=search
 * <input type="search" name="search" id="search1" value=""  />
 *
 * Searchbar can be inserted 3 cases
 * content : seachbar behave same as content element
 * header : searchbar placed below title(header), It doesn't move when scrolling page
 * inside optionheader : Searchbar placed inside optionheader, searchbar can be seen only expand optionheader
 *
 * Examples:
 *
 *	HTML markup for creating Searchbar
 *		<input type="search"/>
 *
 *	How to make searchbar in content
 *		<input type="search" name="" id="" value=""  />
 *
 *	How to make cancel button in searchbar
 *		<div data-role="header" data-position ="fixed" >
 *			<h1>Searchbar</h1>
 *			<input type="search" data-cancel-btn=true name="" id="" value=""  />
 *		</div>
 *
 *	How to make icon in front of searchbar
 *		<div data-role="header" data-position ="fixed" >
 *			<h1>Searchbar</h1>
 *			<input type="search" data-icon="call" name="" id="" value=""  />
 *		</div>
*/

/**
	@class SearchBar
	The search bar widget is used to search for page content. This widget can be placed in the header, option header, or page content.

	To add a search bar widget to the application, use the following code:

		<label for="search-basic">Search Input:</label>
		<input type="search" name="search" id="searc-basic" value="" data-mini="true" />

	Tizen supports many search bar options as described in the jQueryMobile documentation for search bar options.
	The search bar can define callbacks for events as described in the jQueryMobile documentation for search bar events.
	You can use methods with the search bar as described in the jQueryMobile documentation for search bar methods.
*/

(function ( $, undefined ) {

	$.widget( "tizen.searchbar", $.mobile.widget, {
		options: {
			theme: null,
			initSelector: "input[type='search'],:jqmData(type='search'), input[type='tizen-search'],:jqmData(type='tizen-search')"
		},

		_create: function () {
			var input = this.element,
				o = this.options,
				theme = o.theme || $.mobile.getInheritedTheme( this.element, "c" ),
				themeclass  = " ui-body-" + theme,
				focusedEl,
				clearbtn,
				cancelbtn,
				defaultText,
				defaultTextClass,
				trimedText,
				newClassName,
				newStyle,
				newDiv,
				searchimage,
				inputedText,
				useCancelBtn = false,
				frontIcon = false;

			$( "label[for='" + input.attr( "id" ) + "']" ).addClass( "ui-input-text" );

			if ( typeof input[0].autocorrect !== "undefined" && !$.support.touchOverflow ) {
				// Set the attribute instead of the property just in case there
				// is code that attempts to make modifications via HTML.
				input[0].setAttribute( "autocorrect", "off" );
				input[0].setAttribute( "autocomplete", "off" );
			}

			focusedEl = input.wrap( "<div class='ui-input-search ui-shadow-inset ui-corner-all ui-btn-shadow" + themeclass + "'></div>" ).parent();

			if ( $( this.element ).data( "cancel-btn" ) === true ) {
				useCancelBtn = true;
				focusedEl.addClass( "ui-input-search-default" );
			}
			if ( $( this.element ).data( "icon" ) != undefined ) {
				frontIcon = true;
				focusedEl.addClass( "ui-search-bar-icon" );
			}

			clearbtn = $( "<a href='#' class='ui-input-clear' title='clear text'>clear text</a>" );

			clearbtn.on( "click", function (event) {
					if ( input.attr( "disabled" ) == "disabled" ) {
						return false;
					}
					input
						.val( "" )
						.trigger('change')
						.focus();
					event.preventDefault();
				})
				.appendTo( focusedEl )
				.buttonMarkup({
					icon: "deleteSearch",
					iconpos: "notext",
					corners: true,
					shadow: true
				});

			/* temporarily delete 06.28 Heeju Joo */
			/*function toggleClear() {
				setTimeout(function () {
					clearbtn.toggleClass( "ui-input-clear-hidden", !input.val()
				}, 0);
			}*/


			function showCancel() {
				focusedEl
					.addClass( "ui-input-search-default" )
					.removeClass( "ui-input-search-wide" );
				cancelbtn
					.addClass( "ui-btn-cancel-show" )
					.removeClass( "ui-btn-cancel-hide" );
			}

			function hideCancel() {
				focusedEl
					.addClass( "ui-input-search-wide" )
					.removeClass( "ui-input-search-default" );
				cancelbtn
					.addClass( "ui-btn-cancel-hide" )
					.removeClass( "ui-btn-cancel-show" );
			}

			function makeFrontIcon() {
				var IconStyle = $( input ).jqmData( "icon" ),
					frontIcon = $( "<div data-role='button' data-style='circle'></div>" );

				frontIcon
					.appendTo( focusedEl.parent() )
					.buttonMarkup( {
						icon: IconStyle,
						iconpos: "notext",
						corners: true,
						shadow: true
					} );
				frontIcon.addClass( "ui-btn-search-front-icon" );
			}
			/* temporarily delete - 06.28 Heeju Joo */
			/*toggleClear();

			input.bind( 'paste cut keyup focus change blur', toggleClear );
			*/

			/* N_SE-43150 when input get event "focus", it show clearbtn */
			input.bind( "focus", function() {
				clearbtn.css("display", "inline-block");
			});
			//SLP --start search bar with cancel button
			focusedEl.wrapAll( "<div class='input-search-bar'></div>" );
			searchimage = $("<div class='ui-image-search'></div>").appendTo( focusedEl );

			if ( frontIcon ) {
				makeFrontIcon();
			}

			if ( useCancelBtn ) {
				cancelbtn = $( "<div data-role='button' class='ui-input-cancel' title='clear text'>Cancel</div>" )
					.bind('click', function ( event ) {
						if ( input.attr( "disabled" ) == "disabled" ) {
							return false;
						}
						event.preventDefault();
						event.stopPropagation();

						input
							.val( "" )
							.trigger('change')
							.blur();

						if ( useCancelBtn ) {
							hideCancel();
						}
					} )
					.appendTo( focusedEl.parent() )
					.buttonMarkup( {
						iconpos: "cancel",
						corners: true,
						shadow: true
					} );
			}

			// Input Focused
			input
				.focus( function () {
					if ( input.attr( "disabled" ) == "disabled" ) {
						return false;
					}
					if ( useCancelBtn ) {
						showCancel();
					}
					focusedEl.addClass( $.mobile.focusClass );
				})
				.blur(function () {
					focusedEl.removeClass( $.mobile.focusClass );
				});

			// Default Text
			defaultText = input.jqmData( "default-text" );

			if ( ( defaultText != undefined ) && ( defaultText.length > 0 ) ) {
				defaultTextClass = "ui-input-default-text";
				trimedText = defaultText.replace(/\s/g, "");

				/* Make new class for default text string */
				newClassName = defaultTextClass + "-" + trimedText;
				newStyle = $( "<style>" + '.' + newClassName + ":after" + "{content:" + "'" + defaultText + "'" + "}" + "</style>" );
				$( 'html > head' ).append( newStyle );

				/* Make new empty <DIV> for default text */
				newDiv = $( "<div></div>" );

				/* Add class and append new div */
				newDiv.addClass( defaultTextClass );
				newDiv.addClass( newClassName );
				newDiv.tap( function ( event ) {
					input.blur();
					input.focus();
				} );

				input.parent().append( newDiv );

				/* When focus, default text will be hide. */
				input
					.focus( function () {
						input.parent().find( "div.ui-input-default-text" ).addClass( "ui-input-default-hidden" );
					} )
					.blur( function () {
						var inputedText = input.val();
						if ( inputedText.length > 0 ) {
							input.parent().find( "div.ui-input-default-text" ).addClass( "ui-input-default-hidden" );
						} else {
							input.parent().find( "div.ui-input-default-text" ).removeClass( "ui-input-default-hidden" );
						}
					} );
			}

			if ( !input.attr("placeholder") ) {
				input.attr( "placeholder", "Search" );
			}
		},

		disable: function () {
			this.element.attr( "disabled", true );
			this.element.parent().addClass( "ui-disabled" );
			$( this.element ).blur();
			this.element.parent().parent().find(".ui-input-cancel").addClass( "ui-disabled" );
		},

		enable: function () {
			this.element.attr( "disabled", false );
			this.element.parent().removeClass( "ui-disabled" );
			this.element.parent().parent().find(".ui-input-cancel").removeClass( "ui-disabled" );
			$( this.element ).focus();
		}
	} );

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$.tizen.searchbar.prototype.enhanceWithin( e.target );
	} );

}( jQuery ) );


/*
* Module Name : widgets/jquery.mobile.tizen.virtualgrid
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 * In the web environment, it is challenging to display a large amount of data in a grid.
 * When an application needs to show, for example, image gallery with over 1,000 images,
 * the same enormous data must be inserted into a HTML document.
 * It takes a long time to display the data and manipulating DOM is complex.
 * The virtual grid widget supports storing unlimited data without performance issues
 * by reusing a limited number of grid elements.
 * The virtual grid widget is based on the jQuery.template plug-in 
 * For more information, see jQuery.template.
 *
 * HTML Attributes:
 *
 *		data-role:  virtualgrid
 *		data-template :	Has the ID of the jQuery.template element.
 *						jQuery.template for a virtual grid must be defined.
 *						Style for template would use rem unit to support scalability.
 *		data-direction : This option define the direction of the scroll.
 *						You must choose one of the 'x' and 'y' (Default : y)
 *		data-rotation : This option defines whether or not the circulation of the data.
 *						If option is 'true' and scroll is reached the last data,
 *						Widget will present the first data on the screen.
 *						If option is ‘false’, Widget will operate like a scrollview.
 *
 *		ID : <DIV> element that has "data-role=virtualgrid" must have ID attribute.
 *
 * APIs:
 *
 *		create ( {
 *				itemData: function ( idx ) { return json_obj; },
 *				numItemData: number or function () { return number; },
 *				cacheItemData: function ( minIdx, maxIdx ) {}
 *				} )
 *			: Create VirtualGrid widget. At this moment, _create method is called.
 *			args : A collection of options
 *				itemData: A function that returns JSON object for given index. Mandatory.
 *				numItemData: Total number of itemData. Mandatory.
 *				cacheItemData: Virtuallist will ask itemData between minIdx and maxIdx.
 *				Developers can implement this function for preparing data.
 *				Optional.
 *
 *		centerTo ( selector )
 *			: Center the particular item with the class name on the VirtualGrid's display area.;
 *			i.e., this method selects an item in the data elements of grid using the class name and
 *			moves the data elements inside the widget to display the row containing the selected item
 *			in the middle of the screen.
 *			If multiple items are matched with the class name, the first matched item will be selected.
 *			This method is only available when "data-rotation" attribute is "true".
 *
 *		resize ()
 *			: Rearrange items to fit a new widget size.
 *
 * Events:
 *		scrollstart : : This event triggers when a user begin to move the scroll on VirtualGrid.
 *		scrollupdate : : This event triggers while a user moves the scroll on VirtualGrid.
 *		scrollstop : This event triggers when a user stop the scroll on VirtualGrid.
 *		select : This event triggers when a cell is selected.
 *
 * Examples:
 *
 *			<script id="tizen-demo-namecard" type="text/x-jquery-tmpl">
 *				<div class="ui-demo-namecard">
 *					<div class="ui-demo-namecard-pic">
 *						<img class="ui-demo-namecard-pic-img" src="${TEAM_LOGO}" />
 *					</div>
 *					<div class="ui-demo-namecard-contents">
 *						<span class="name ui-li-text-main">${NAME}</span>
 *						<span class="active ui-li-text-sub">${ACTIVE}</span>
 *						<span class="from ui-li-text-sub">${FROM}</span>
 *					</div>
 *				</div>
 *			</script>
 *			<div id="virtualgrid-demo" data-role="virtualgrid" data-template="tizen-demo-namecard" >
 *			</div>
 *
 */

// most of following codes are derived from jquery.mobile.scrollview.js

/**
	@class VirtualGrid
	In the Web environment, it is challenging to display large amount of data in a list, such as displaying a contact list of over 1000 list items. It takes time to display the entire list in HTML and the DOM manipulation is complex.

	The virtual grid widget is used to display a list of unlimited data elements on the screen for better performance. This widget displays the data in the grid format by reusing the existing grid control space. Virtual grids are based on the jQuery.template plugin as described in the jQuery documentation for jQuery.template plugin.

	To add a virtual grid widget to the application, use the following code:

		<script id="tizen-demo-namecard" type="text/x-jquery-tmpl">
			<div class="ui-demo-namecard">
				<div class="ui-demo-namecard-pic">
					<img class="ui-demo-namecard-pic-img" src="${TEAM_LOGO}" />
				</div>
				<div class="ui-demo-namecard-contents">
				<span class="name ui-li-text-main">${NAME}</span>
				</div>
			</div>
		</script>
		<div id="virtualgrid-demo" data-role="virtualgrid" data-template="tizen-demo-namecard">
		</div>
*/
/**
	@property {String} data-template
	Specifies the jQuery.template element ID.
	The jQuery.template must be defined. The template style can use rem units to support scalability.
*/
/**
	@property {String} data-direction
	Defines the scroll direction. The direction options are x (horizontal) and y (vertical).
	The default value is y.
*/
/**
	@property {Boolean} data-rotation
	Defines whether the data elements are displayed from the beginning of the list again once the end of file is reached.
	The default value is false.
*/
/**
	@event scrollstart
	The scrollstart event is fired when the user starts scrolling through the grid:

		<div data-role="virtualgrid" data-scroll="y" data-template="tizen-demo-namecard"></div>
		$(".selector").on("scrollstart", function(event, ui)
		{
		// Handle the scrollstart event
		});
*/
/**
	@event scrollupdate
	The scrollupdate event is fired when the user moves the scroll bar in the grid:

		<div data-role="virtualgrid" data-scroll="y" data-template="tizen-demo-namecard"></div>
		$(".selector").on("scrollupdate", function(event, ui)
		{
		// Handle the scrollupdate event
		});
*/
/**
	@event scrollstop
	The scrollstop event is fired when the user stops scrolling:

		<div data-role="virtualgrid" data-scroll="y" data-template="tizen-demo-namecard"></div>
		$(".selector").on("scrollstop", function(event, ui)
		{
		// Handle the scrollstop event
		});
*/
/**
	@event select
	The select event is fired when a virtual grid cell is selected:

		<div data-role="virtualgrid" data-scroll="y" data-template="tizen-demo-namecard"></div>
		$(".selector").on("select", function(event, ui)
		{
		// Handle the select event
		});
*/
/**
	@method create
	@param {function} itemData(index)
	@param {Number} numItemData
	@param {function} cacheItemData(minIndex, maxIndex)
	The create method is used to call the jQuery _create method. In the method parameters:

	function itemData(index) returns the JSON object matched with the given index. The index value is between 0 and numItemData-1.<br/>
	number numItemData or function numItemData() defines or returns a static number of items.<br/>
	function cacheItemData(minIndex, maxIndex) prepares the JSON data. This method is called before calling the itemData() method with index values between minIndex and maxIndex.<br/>

		<div data-role="virtualgrid" data-scroll="y" data-template="tizen-demo-namecard"></div>
			function itemData(idx)
			{
				return DATA[idx];
			}
			function cacheItemData(minIdx, maxIdx)
			{
			// Prepare JSON data between minIdx and maxIdx
			}
			var numItemData = DATA.length;
			$(".selector").virtualgrid("create",
			{
				itemData, numItemData, cacheItemData
			});
*/
/**
	@method centerTo
	The centerTo method is used to center the particular item with the class name on the VirtualGrid's display area. If multiple items are matched with the class name, the first matched item will be selected. This method is only available when "data-rotation" attribute is "true".

		<div data-role="virtualgrid" data-scroll="y" data-rotation="true" data-template="tizen-demo-namecard"></div>
		$(".selector").virtualgrid("centerTo", selector);
*/
/**
	@method resize
	The resize method is used to rearrange items to fit a new widget size. :

		<div data-role="virtualgrid" data-scroll="y" data-template="tizen-demo-namecard"></div>
		$(".selector").virtualgrid("resize");

	@since Tizen2.0
*/

( function ( $, window, document, undefined ) {

	function circularNum ( num, total ) {
		var n = num % total;
		if ( n < 0 ) {
			n = total + n;
		}
		return n;
	}

	function MomentumTracker ( options ) {
		this.options = $.extend( {}, options );
		this.easing = "easeOutQuad";
		this.reset();
	}

	var tstates = {
			scrolling : 0,
			done : 1
		},
		_OVERFLOW_DIR_NONE = 0,		/* ENUM */
		_OVERFLOW_DIR_UP = 1,		/* ENUM */
		_OVERFLOW_DIR_DOWN = -1,	/* ENUM */
		imgTagSrcAttrRE = /src\s*=\s*[\"\'][\w\/.]+.[A-z]+[\"\']/;

	function getCurrentTime () {
		return Date.now();
	}

	$.extend( MomentumTracker.prototype, {
		start : function ( pos, speed, duration ) {
			this.state = ( speed !== 0 ) ? tstates.scrolling : tstates.done;
			this.pos = pos;
			this.speed = speed;
			this.duration = duration;

			this.fromPos = 0;
			this.toPos = 0;

			this.startTime = getCurrentTime();
		},

		reset : function () {
			this.state = tstates.done;
			this.pos = 0;
			this.speed = 0;
			this.duration = 0;
		},

		update : function () {
			var state = this.state, duration, elapsed, dx, x;

			if ( state == tstates.done ) {
				return this.pos;
			}
			duration = this.duration;
			elapsed = getCurrentTime () - this.startTime;
			elapsed = elapsed > duration ? duration : elapsed;
			dx = this.speed * ( 1 - $.easing[this.easing]( elapsed / duration, elapsed, 0, 1, duration ) );
			x = this.pos + ( dx / 2 );
			this.pos = x;

			if ( elapsed >= duration ) {
				this.state = tstates.done;
			}
			return this.pos;
		},

		done : function () {
			return this.state == tstates.done;
		},

		getPosition : function () {
			return this.pos;
		}
	});

	jQuery.widget ( "mobile.virtualgrid", jQuery.mobile.widget, {
		options : {
			// virtualgrid option
			template : "",
			direction : "y",
			rotation : false
		},

		create : function () {
			this._create.apply( this, arguments );
		},

		_create : function ( args ) {
			$.extend( this, {
				// view
				_$view : null,
				_$clip : null,
				_$rows : null,
				_tracker : null,
				_viewSize : 0,
				_clipSize : 0,
				_cellSize : undefined,
				_currentItemCount : 0,
				_itemCount : 1,
				_inheritedSize : null,

				// timer
				_timerInterval : 0,
				_timerID : 0,
				_timerCB : null,
				_lastMove : null,

				// Data
				_itemData : function ( idx ) { return null; },
				_numItemData : 0,
				_cacheItemData : function ( minIdx, maxIdx ) { },
				_totalRowCnt : 0,
				_templateText : null,
				_maxViewSize : 0,
				_modifyViewPos : 0,
				_maxSizeExceptClip : 0,
				_maxSize : 0,

				// axis - ( true : x , false : y )
				_direction : false,
				_didDrag : true,
				_reservedPos : 0,
				_scalableSize : 0,
				_eventPos : 0,
				_nextPos : 0,
				_movePos : 0,
				_lastY : 0,
				_speedY : 0,
				_lastX : 0,
				_speedX : 0,
				_rowsPerView : 0,
				_fragment : null,

				_filterRatio : 0.9,

				_overflowStartPos : 0,
				_overflowDir : 0,
				_overflowMaxDragDist : 100
			});

			var self = this,
				$dom = $( self.element ),
				opts = self.options,
				$item = null;

			// itemData
			// If mandatory options are not given, Do nothing.
			if ( !args ) {
				return ;
			}

			if ( !self._loadData( args ) ) {
				return;
			}

			// make a fragment.
			self._fragment = document.createDocumentFragment();

			// read defined properties(width and height) from dom element.
			self._inheritedSize = self._getinheritedSize( self.element );

			// set a scroll direction.
			self._direction = opts.direction === 'x' ? true : false;

			// make view layer
			self._$clip = $dom.addClass( "ui-scrollview-clip" ).addClass( "ui-virtualgrid-view" );
			$item = $( document.createElement( "div" ) ).addClass( "ui-scrollview-view" );
			self._clipSize =  self._calculateClipSize();
			self._$clip.append( $item );
			self._$view = $item;
			self._$clip.css( "overflow", "hidden" );
			self._$view.css( "overflow", "hidden" );

			// inherit from scrollview widget.
			self._scrollView = $.tizen.scrollview.prototype;
			self._initScrollView();

			// create tracker.
			self._createTracker();
			self._makePositioned( self._$clip );
			self._timerInterval = 1000 / self.options.fps;

			self._timerID = 0;
			self._timerCB = function () {
				self._handleMomentumScroll();
			};
			$dom.closest( ".ui-content" ).addClass( "ui-virtualgrid-content" ).css( "overflow", "hidden" );

			// add event handler.
			self._addBehaviors();

			self._currentItemCount = 0;
			self._createOverflowArea();
			self._createScrollBar();
			self.refresh();
		},

		// The argument is checked for compliance with the specified format.
		// @param args   : Object
		// @return boolean
		_loadData : function ( args ) {
			var self = this;

			if ( args.itemData && typeof args.itemData == 'function'  ) {
				self._itemData = args.itemData;
			} else {
				return false;
			}
			if ( args.numItemData ) {
				if ( typeof args.numItemData == 'function' ) {
					self._numItemData = args.numItemData( );
				} else if ( typeof args.numItemData == 'number' ) {
					self._numItemData = args.numItemData;
				} else {
					return false;
				}
			} else {
				return false;
			}
			self._getObjectNames( self._itemData( 0 ) );
			return true;
		},

		// Make up the first screen.
		_initLayout: function () {
			var self = this,
				opts = self.options,
				i,
				$row;

			for ( i = -1; i < self._rowsPerView + 1; i += 1 ) {
				$row = self._$rows[ circularNum( i, self._$rows.length ) ];
				self._$view.append( $row );
			}
			self._setElementTransform( -self._cellSize );

			self._replaceRow( self._$view[0].firstChild, self._totalRowCnt - 1 );
			if ( opts.rotation && self._rowsPerView >= self._totalRowCnt ) {
				self._replaceRow( self._$view[0].lastChild, 0 );
			}
			self._setViewSize();
		},

		_setViewSize : function () {
			var self = this,
				height = 0,
				width = 0;

			if ( self._direction ) {
				width = self._cellSize * ( self._rowsPerView + 2 );
				width = parseInt( width, 10 ) + 1;
				self._$view.width( width );
				self._viewSize = self._$view.width();
			} else {
				self._$view.height( self._cellSize * ( self._rowsPerView + 2 ) );
				self._$clip.height( self._clipSize );
				self._viewSize = self._$view.height();
			}
		},

		_getViewWidth : function () {
			var self = this;
			return self._maxSize;
		},

		_getViewHeight : function () {
			var self = this;
			return self._maxSize;
		},

		refresh : function () {
			var self = this,
				opts = self.options,
				width = 0,
				height = 0,
				$template = null;

			$template = $( "#" + opts.template );
			if ( !$template ) {
				return ;
			}
			self._templateText = self._insertAriaAttrToTmpl( $template.text() );

			width = self._calculateClipWidth();
			height = self._calculateClipHeight();
			self._$view.width( width ).height( height );
			self._$clip.width( width ).height( height );

			self._clipSize = self._calculateClipSize();
			self._calculateColumnSize();
			self._initPageProperty();
			self._setScrollBarSize();
		},

		_initPageProperty : function () {
			var self = this,
				rowsPerView = 0,
				$child,
				columnCount = 0,
				totalRowCnt = 0,
				attributeName = self._direction ? "width" : "height";

			columnCount = self._calculateColumnCount();

			totalRowCnt = parseInt( self._numItemData / columnCount, 10 );
			self._totalRowCnt = self._numItemData % columnCount === 0 ? totalRowCnt : totalRowCnt + 1;
			self._itemCount = columnCount;

			if ( self._cellSize <= 0 ) {
				return ;
			}

			rowsPerView = self._clipSize / self._cellSize;
			rowsPerView = Math.ceil( rowsPerView );
			self._rowsPerView = parseInt( rowsPerView, 10 );

			$child = $( self._makeRows( rowsPerView + 2 ) );
			self._$view.append( $child.children() );
			self._$view.children().css( attributeName, self._cellSize + "px" );
			self._$rows = self._$view.children().detach();

			self._reservedPos = -self._cellSize;
			self._scalableSize = -self._cellSize;

			self._initLayout();

			self._blockScroll = self._rowsPerView > self._totalRowCnt;
			self._maxSizeExceptClip = ( self._totalRowCnt - self._rowsPerView ) * self._cellSize;
			self._maxSize = self._totalRowCnt * self._cellSize;
			self._maxViewSize = ( self._rowsPerView ) * self._cellSize;
			self._modifyViewPos = -self._cellSize;
			if ( self._clipSize < self._maxViewSize ) {
				self._modifyViewPos = ( -self._cellSize ) + ( self._clipSize - self._maxViewSize );
			}
		},

		_getinheritedSize : function ( elem ) {
			var $target = $( elem ),
				height,
				width,
				NODETYPE = { ELEMENT_NODE : 1, TEXT_NODE : 3 },
				ret = {
					isDefinedWidth : false,
					isDefinedHeight : false,
					width : 0,
					height : 0
				};

			while ( $target[0].nodeType === NODETYPE.ELEMENT_NODE && ( ret.isDefinedWidth === false || ret.isHeightDefined === false ) ) {
				height = $target[0].style.height;
				width = $target[0].style.width;

				if ( ret.isDefinedHeight === false && height !== "" ) {
					// Size was defined
					ret.isDefinedHeight = true;
					ret.height = parseInt( height, 10 );
				}

				if ( ret.isDefinedWidth === false && width !== "" ) {
					// Size was defined
					ret.isDefinedWidth = true;
					ret.width = parseInt( width, 10 );
				}
				$target = $target.parent();
				if ( $target.hasClass( "ui-content" ) ) {
					break;
				}
			}
			return ret;
		},

		_resize : function () {
			var self = this,
				ret = null,
				rowsPerView = 0,
				itemCount = 0,
				totalRowCnt = 0,
				diffRowCnt = 0,
				clipSize = 0,
				prevcnt = 0,
				clipPosition = 0,
				rowsLength = 0,
				row = null,
				size = 0;

			if ( self._direction ) {
				size = self._calculateClipHeight();
				self._$view.height( size );
				self._$clip.height( size );
			} else {
				size = self._calculateClipWidth();
				self._$view.width( size );
				self._$clip.width( size );
			}

			itemCount = self._calculateColumnCount();
			if ( itemCount != self._itemCount ) {
				totalRowCnt = parseInt( self._numItemData / itemCount, 10 );
				self._totalRowCnt = self._numItemData % itemCount === 0 ? totalRowCnt : totalRowCnt + 1;
				prevcnt = self._itemCount;
				self._itemCount = itemCount;
				clipPosition = self._getClipPosition();
				self._$view.hide();

				diffRowCnt = self._replaceRows( itemCount, prevcnt, self._totalRowCnt, clipPosition );
				self._maxSizeExceptClip = ( self._totalRowCnt - self._rowsPerView ) * self._cellSize;
				self._maxSize = self._totalRowCnt * self._cellSize;
				self._scalableSize += ( -diffRowCnt ) * self._cellSize;
				self._reservedPos  += ( -diffRowCnt ) * self._cellSize;
				self._setScrollBarSize();
				self._setScrollBarPosition( diffRowCnt );

				self._$view.show();
			}

			clipSize = self._calculateClipSize();
			if ( clipSize !== self._clipSize ) {
				rowsPerView = clipSize / self._cellSize;
				rowsPerView = parseInt( Math.ceil( rowsPerView ), 10 );

				if ( rowsPerView > self._rowsPerView ) {
					// increase row.
					self._increaseRow( rowsPerView - self._rowsPerView );
				} else if ( rowsPerView < self._rowsPerView ) {
					// decrease row.
					self._decreaseRow( self._rowsPerView - rowsPerView );
				}
				self._$rows = self._$view.children();
				self._$rows.sort( function ( a, b ) {
					return a.getAttribute( "row-index" ) - b.getAttribute( "row-index" );
				});

				self._rowsPerView = rowsPerView;
				self._clipSize = clipSize;
				self._blockScroll = self._rowsPerView > self._totalRowCnt;
				self._maxSizeExceptClip = ( self._totalRowCnt - self._rowsPerView ) * self._cellSize;
				self._maxSize = self._totalRowCnt * self._cellSize;
				self._maxViewSize = ( self._rowsPerView ) * self._cellSize;
				if ( self._clipSize < self._maxViewSize ) {
					self._modifyViewPos = ( -self._cellSize ) + ( self._clipSize - self._maxViewSize );
				}
				if ( self._direction ) {
					self._$clip.width( self._clipSize );
				} else {
					self._$clip.height( self._clipSize );
				}
				self._setScrollBarSize();
				self._setScrollBarPosition( 0 );
				self._setViewSize();
			}
		},

		resize : function () {
			var self = this,
				height = 0,
				$virtualgrid = $( ".ui-virtualgrid-view" );

			self._inheritedSize = self._getinheritedSize( self.element );

			if ( $virtualgrid.length !== 0 ) {
				self._resize();
			}
		},

		_initScrollView : function () {
			var self = this,
				oldDirection = self.options.direction;
			$.extend( self.options, self._scrollView.options );
			self.options.direction = oldDirection;
			self.options.moveThreshold = 10;
			self.options.showScrollBars = false;
			self._getScrollHierarchy = self._scrollView._getScrollHierarchy;
			self._makePositioned =  self._scrollView._makePositioned;
			self._set_scrollbar_size = self._scrollView._set_scrollbar_size;
			self._setStyleTransform = self._scrollView._setElementTransform;
			self._hideOverflowIndicator = self._scrollView._hideOverflowIndicator;
			self._showOverflowIndicator = self._scrollView._showOverflowIndicator;
			self._setGestureScroll = self._scrollView._setGestureScroll;
		},

		_createTracker : function () {
			var self = this;

			self._tracker = new MomentumTracker( self.options );
			if ( self._direction ) {
				self._hTracker = self._tracker;
				self._$clip.width( self._clipSize );
			} else {
				self._vTracker = self._tracker;
				self._$clip.height( self._clipSize );
			}
		},

		//----------------------------------------------------//
		//		Overflow effect
		//----------------------------------------------------//
		_createOverflowArea : function () {
			var self = this,
				prefix = "<div class=\"ui-virtualgrid-overflow-indicator-",
				suffixTop = "-top\"></div>",
				suffixBottom = "-bottom\"></div>";

			if ( self.options.rotation ) {
				return;
			}

			if ( self._direction ) {
				self._overflowTop = $( prefix + "x" + suffixTop );
				self._overflowBottom = $( prefix + "x" + suffixBottom );
			} else {
				self._overflowTop = $( prefix + "y" + suffixTop );
				self._overflowBottom = $( prefix + "y" + suffixBottom );
			}

			self._$clip.append( self._overflowTop );
			self._$clip.append( self._overflowBottom );
			self._overflowDisplayed = false;
		},

		_hideVGOverflowIndicator : function () {
			if ( this._overflowDisplayed === false ) {
				return;
			}

			this._overflowTop.animate( { opacity: 0 }, 300 );
			this._overflowBottom.animate( { opacity: 0 }, 300 );
			this._overflowDisplayed = false;
		},

		//----------------------------------------------------//
		//		Scrollbar		//
		//----------------------------------------------------//
		_createScrollBar : function () {
			var self = this,
				prefix = "<div class=\"ui-scrollbar ui-scrollbar-",
				suffix = "\"><div class=\"ui-scrollbar-track\"><div class=\"ui-scrollbar-thumb\"></div></div></div>";

			if ( self.options.rotation ) {
				return ;
			}

			if ( self._direction ) {
				self._$clip.append( prefix + "x" + suffix );
				self._hScrollBar = self._$clip.children( ".ui-scrollbar-x" );
				self._hScrollBar.find( ".ui-scrollbar-thumb" ).addClass( "ui-scrollbar-thumb-x" );
			} else {
				self._$clip.append( prefix + "y" + suffix );
				self._vScrollBar = self._$clip.children( ".ui-scrollbar-y" );
				self._vScrollBar.find( ".ui-scrollbar-thumb" ).addClass( "ui-scrollbar-thumb-y" );
			}
		},

		_setScrollBarSize: function () {
			var self = this,
				scrollBarSize = 0,
				currentSize = 0,
				$scrollBar,
				attrName,
				className;

			if ( self.options.rotation ) {
				return ;
			}

			scrollBarSize = parseInt( self._maxViewSize / self._clipSize, 10 );
			if ( self._direction ) {
				$scrollBar = self._hScrollBar.find( ".ui-scrollbar-thumb" );
				attrName = "width";
				currentSize = $scrollBar.width();
				className = "ui-scrollbar-thumb-x";
				self._hScrollBar.css( "width", self._clipSize );
			} else {
				$scrollBar = self._vScrollBar.find( ".ui-scrollbar-thumb" );
				attrName = "height";
				className = "ui-scrollbar-thumb-y";
				currentSize = $scrollBar.height();
				self._vScrollBar.css( "height", self._clipSize );
			}

			if ( scrollBarSize > currentSize ) {
				$scrollBar.removeClass( className );
				$scrollBar.css( attrName, scrollBarSize );
			} else {
				scrollBarSize = currentSize;
			}

			self._itemScrollSize = parseFloat( ( self._clipSize - scrollBarSize ) / ( self._totalRowCnt - self._rowsPerView ) );
			self._itemScrollSize = Math.round( self._itemScrollSize * 100 ) / 100;
		},

		_setScrollBarPosition : function ( di, duration ) {
			var self = this,
				$sbt = null,
				x = "0px",
				y = "0px",
				translate;

			if ( self.options.rotation ) {
				return ;
			}

			self._currentItemCount = self._currentItemCount + di;
			if ( self._vScrollBar ) {
				$sbt = self._vScrollBar.find( ".ui-scrollbar-thumb" );
				y = ( self._currentItemCount * self._itemScrollSize ) + "px";
			} else {
				$sbt = self._hScrollBar.find( ".ui-scrollbar-thumb" );
				x = ( self._currentItemCount * self._itemScrollSize ) + "px";
			}
			self._setStyleTransform( $sbt, x, y, duration );
		},

		_hideScrollBars : function () {
			var self = this,
				vclass = "ui-scrollbar-visible";

			if ( self.options.rotation ) {
				return ;
			}

			if ( self._vScrollBar ) {
				self._vScrollBar.removeClass( vclass );
			} else {
				self._hScrollBar.removeClass( vclass );
			}
		},

		_showScrollBars : function () {
			var self = this,
				vclass = "ui-scrollbar-visible";

			if ( self.options.rotation ) {
				return ;
			}

			if ( self._vScrollBar ) {
				self._vScrollBar.addClass( vclass );
			} else {
				self._hScrollBar.addClass( vclass );
			}
		},

		//----------------------------------------------------//
		//		scroll process		//
		//----------------------------------------------------//
		centerTo : function ( selector ) {
			var self = this,
				row = null,
				targetItem = null,
				targetRowIndex = -1,
				rowsLength = self._$rows.length,
				newPosition,
				i;

			if ( !self.options.rotation ) {
				return;
			}

			for ( i = 0; i < rowsLength; ++i ) {
				row = $( self._$rows[ i ] );
				targetItem = row.children( "." + selector );
				if ( targetItem.length ) {
					targetRowIndex = parseInt( row.attr( "row-index" ), 10 );
					break;
				}
			}

			if ( targetRowIndex === -1 ) {
				targetRowIndex = self._getTargetRowIndex( selector );
				if ( targetRowIndex === -1 ) {
					return;
				}
			}

			newPosition = -( targetRowIndex * self._cellSize - ( self._clipSize - self._cellSize ) / 2 );
			if ( self._direction ) {
				self.scrollTo( newPosition, 0 );
			} else {
				self.scrollTo( 0, newPosition );
			}
		},

		_getTargetRowIndex: function ( selector ) {
			var self = this,
				dataCount = self._numItemData,
				itemCount = self._itemCount,
				attrName = self._direction ? "top" : "left",
				html = "",
				targetRowIndex = self._totalRowCnt,
				i;

			for ( i = 0; i < dataCount; ++i ) {
				html = self._makeHtmlData( i, i % itemCount, attrName );
				if ( self._hasClassItem( html, selector ) ) {
					targetRowIndex = parseInt( i / itemCount, 10 );
					break;
				}
			}

			if ( targetRowIndex === self._totalRowCnt ) {
				return -1;
			}

			return targetRowIndex;
		},

		_hasClassItem: function ( html, selector ) {
			var self = this,
				classString = self._getItemClass( html );

			if ( classString.indexOf( selector ) === -1 ) {
				return false;
			}

			if ( classString.indexOf( "virtualgrid-item" ) === -1 ) {
				return false;
			}

			return true;
		},

		_getItemClass: function ( html ) {
			var classIndex = html.indexOf( "class" ),
				classBeginIndex = Math.min( html.indexOf( "\"", classIndex ), html.indexOf( "'", classIndex ) ),
				classEndIndex = Math.min( html.indexOf( "\"", classBeginIndex + 1 ), html.indexOf( "'", classBeginIndex + 1 ) );

			return html.slice( classBeginIndex + 1, classEndIndex );
		},

		scrollTo: function ( x, y, duration ) {
			var self = this;
			if ( self._direction ) {
				x -= self._cellSize;
				self._sx = self._reservedPos;
				self._reservedPos = x;
			} else {
				y -= self._cellSize;
				self._sy = self._reservedPos;
				self._reservedPos = y;
			}
			self._scrollView.scrollTo.apply( this, [ x, y, duration ] );
		},

		getScrollPosition: function () {
			if ( this.direction ) {
				return { x: -this._ry, y: 0 };
			}
			return { x: 0, y: -this._ry };
		},

		_setScrollPosition: function ( x, y ) {
			var self = this,
				sy = self._scalableSize,
				distance = self._direction ? x : y,
				dy = distance - sy,
				di = parseInt( dy / self._cellSize, 10 ),
				i = 0,
				idx = 0,
				replaceStartIdx = 0,
				realRowCount = self._rowsPerView + 2,
				rawView = self._$view[0];

			if ( self._blockScroll ) {
				if ( dy > 0 && distance >= -self._cellSize && self._scalableSize >= -self._cellSize ) {
					self._overflowDir = _OVERFLOW_DIR_UP;
				}
				if ( dy < 0 && self._scalableSize <= -( self._maxSizeExceptClip + self._cellSize ) ) {
					self._overflowDir = _OVERFLOW_DIR_DOWN;
				}
				return;
			}

			if ( ! self.options.rotation ) {
				if ( dy > 0 && distance >= -self._cellSize && self._scalableSize >= -self._cellSize ) {
					// top
					self._stopMScroll();
					self._scalableSize = -self._cellSize;
					self._setElementTransform( -self._cellSize );
					if ( self._overflowDir === _OVERFLOW_DIR_NONE ) {
						self._overflowDir = _OVERFLOW_DIR_UP;
					}
					return;
				}
				if ( dy < 0 && self._scalableSize <= -( self._maxSizeExceptClip + self._cellSize ) ) {
					// bottom
					self._stopMScroll();
					self._scalableSize = -( self._maxSizeExceptClip + self._cellSize );
					self._setElementTransform( self._modifyViewPos );
					if ( self._overflowDir === _OVERFLOW_DIR_NONE ) {
						self._overflowDir = _OVERFLOW_DIR_DOWN;
					}
					return;
				}
			}

			replaceStartIdx = ( Math.abs( di ) < realRowCount ) ? 0 : ( di > 0 ) ? di - realRowCount : di + realRowCount;
			if ( di > 0 ) { // scroll up
				for ( i = replaceStartIdx; i < di; ++i ) {
					idx = -parseInt( ( sy / self._cellSize ) + i + 3, 10 );
					self._replaceRow( rawView.lastChild, circularNum( idx, self._totalRowCnt ) );
					rawView.insertBefore( rawView.lastChild, rawView.firstChild );
				}
			} else if ( di < 0 ) { // scroll down
				for ( i = replaceStartIdx; i > di; --i ) {
					idx = self._rowsPerView - parseInt( ( sy / self._cellSize ) + i, 10 );
					self._replaceRow( rawView.firstChild, circularNum( idx, self._totalRowCnt ) );
					rawView.insertBefore( rawView.firstChild, rawView.lastChild.nextSibling );
				}
			}
			self._setScrollBarPosition( -di );
			self._scalableSize += di * self._cellSize;
			self._setElementTransform( distance - self._scalableSize - self._cellSize );
		},

		_setElementTransform : function ( value ) {
			var self = this,
				x = 0,
				y = 0;

			if ( self._direction ) {
				x = value + "px";
			} else {
				y = value + "px";
			}
			self._setStyleTransform( self._$view, x, y );
		},

		//----------------------------------------------------//
		//		Event handler		//
		//----------------------------------------------------//
		_handleMomentumScroll: function () {
			var self = this,
				opts = self.options,
				keepGoing = false,
				v = this._$view,
				x = 0,
				y = 0,
				t = self._tracker;

			if ( t ) {
				t.update();
				if ( self._direction ) {
					x = t.getPosition();
				} else {
					y = t.getPosition();
				}
				keepGoing = !t.done();
			}

			self._setScrollPosition( x, y );
			if ( !opts.rotation ) {
				keepGoing = !t.done();
				self._reservedPos = self._direction ? x : y;
				// bottom
				self._reservedPos = self._reservedPos <= (-(self._maxSizeExceptClip - self._modifyViewPos)) ? ( - ( self._maxSizeExceptClip + self._cellSize) ) : self._reservedPos;
				// top
				self._reservedPos = self._reservedPos > -self._cellSize ? -self._cellSize : self._reservedPos;
			} else {
				self._reservedPos = self._direction ? x : y;
			}
			self._$clip.trigger( self.options.updateEventName, [ { x: x, y: y } ] );

			if ( keepGoing ) {
				self._timerID = setTimeout( self._timerCB, self._timerInterval );
			} else {
				self._stopMScroll();
			}
		},

		_startMScroll: function ( speedX, speedY ) {
			var self = this;
			if ( self._direction ) {
				self._sx = self._reservedPos;
			} else {
				self._sy = self._reservedPos;
			}
			self._scrollView._startMScroll.apply( self, [ speedX, speedY ] );
		},

		_stopMScroll: function () {
			this._scrollView._stopMScroll.apply( this );
		},

		_enableTracking: function () {
			var self = this;
			self._$view.bind( self._dragMoveEvt, self._dragMoveCB );
			self._$view.bind( self._dragStopEvt, self._dragStopCB );
			self._scrollView._enableTracking.apply( self );
		},

		_disableTracking: function () {
			var self = this;
			self._$view.unbind( self._dragMoveEvt, self._dragMoveCB );
			self._$view.unbind( self._dragStopEvt, self._dragStopCB );
			self._scrollView._disableTracking.apply( self );
		},

		_handleDragStart: function ( e, ex, ey ) {
			var self = this;
			self._scrollView._handleDragStart.apply( this, [ e, ex, ey ] );
			self._eventPos = self._direction ? ex : ey;
			self._nextPos = self._reservedPos;
		},

		_handleDragMove: function ( e, ex, ey ) {
			var self = this,
				dx = ex - self._lastX,
				dy = ey - self._lastY,
				x = 0,
				y = 0,
				diffFromStartPos = 0,
				diffFromLastPos = 0,
				opacity = 0,
				overflowPos = 0,
				overFlowTarget = null;

			self._lastMove = getCurrentTime();
			self._speedX = dx;
			self._speedY = dy;

			self._didDrag = true;

			self._lastX = ex;
			self._lastY = ey;

			if ( self._direction ) {
				self._movePos = ex - self._eventPos;
				x = self._nextPos + self._movePos;
				overflowPos = ex;
			} else {
				self._movePos = ey - self._eventPos;
				y = self._nextPos + self._movePos;
				overflowPos = ey;
			}
			self._showScrollBars();
			self._setScrollPosition( x, y );
			if ( self._overflowDir !== _OVERFLOW_DIR_NONE ) {
				overFlowTarget = ( self._overflowDir === _OVERFLOW_DIR_UP ) ? self._overflowTop : self._overflowBottom;
				if ( !self._overflowDisplayed ) {
					self._overflowDisplayed = true;
					self._overflowStartPos = overflowPos;
				}
				diffFromStartPos = ( overflowPos - self._overflowStartPos ) * self._overflowDir;
				opacity = ( diffFromStartPos < 0 ) ?
							0 : ( diffFromStartPos > self._overflowMaxDragDist ) ?
								1 : ( diffFromStartPos / self._overflowMaxDragDist );
				overFlowTarget.css( "opacity", opacity );
			}

			return false;
		},

		_handleDragStop: function ( e ) {
			var self = this;

			self._reservedPos = self._movePos ? self._nextPos + self._movePos : self._reservedPos;
			self._scrollView._handleDragStop.apply( this, [ e ] );
			if ( self._overflowDir !== _OVERFLOW_DIR_NONE ) {
				self._overflowDir = _OVERFLOW_DIR_NONE;
				self._hideVGOverflowIndicator();
			}
			return self._didDrag ? false : undefined;
		},

		_addBehaviors: function () {
			var self = this;

			// scroll event handler.
			if ( self.options.eventType === "mouse" ) {
				self._dragStartEvt = "mousedown";
				self._dragStartCB = function ( e ) {
					return self._handleDragStart( e, e.clientX, e.clientY );
				};

				self._dragMoveEvt = "mousemove";
				self._dragMoveCB = function ( e ) {
					return self._handleDragMove( e, e.clientX, e.clientY );
				};

				self._dragStopEvt = "mouseup";
				self._dragStopCB = function ( e ) {
					return self._handleDragStop( e, e.clientX, e.clientY );
				};

				self._$view.bind( "vclick", function ( e ) {
					return !self._didDrag;
				} );
			} else { //touch
				self._dragStartEvt = "touchstart";
				self._dragStartCB = function ( e ) {
					var t = e.originalEvent.targetTouches[0];
					return self._handleDragStart( e, t.pageX, t.pageY );
				};

				self._dragMoveEvt = "touchmove";
				self._dragMoveCB = function ( e ) {
					var t = e.originalEvent.targetTouches[0];
					return self._handleDragMove( e, t.pageX, t.pageY );
				};

				self._dragStopEvt = "touchend";
				self._dragStopCB = function ( e ) {
					return self._handleDragStop( e );
				};
			}
			self._$view.bind( self._dragStartEvt, self._dragStartCB );

			// other events.
			self._$view.delegate( ".virtualgrid-item", "click", function ( event ) {
				var $selectedItem = $( this );
				$selectedItem.trigger( "select", this );
			} );

			$( window ).bind( "resize", function ( e ) {
				var height = 0,
					$virtualgrid = $( ".ui-virtualgrid-view" );
				if ( $virtualgrid.length !== 0 ) {
					self._resize();
				}
			} );

			$( document ).one( "pageshow", function ( event ) {
				var $page = $( self.element ).parents( ".ui-page" ),
					$header = $page.find( ":jqmData(role='header')" ),
					$footer = $page.find( ":jqmData(role='footer')" ),
					$content = $page.find( ":jqmData(role='content')" ),
					footerHeight = $footer ? $footer.height() : 0,
					headerHeight = $header ? $header.height() : 0;

				if ( $page && $content ) {
					$content.height( window.innerHeight - headerHeight - footerHeight ).css( "overflow", "hidden" );
					$content.addClass( "ui-virtualgrid-content" );
				}
			} );
		},

		//----------------------------------------------------//
		//		Calculate size about dom element.		//
		//----------------------------------------------------//
		_calculateClipSize : function () {
			var self = this,
				clipSize = 0;

			if ( self._direction ) {
				clipSize = self._calculateClipWidth();
			} else {
				clipSize = self._calculateClipHeight();
			}
			return clipSize;
		},

		_calculateClipWidth : function () {
			var self = this,
				$parent = self._$clip.parent(),
				paddingValue = 0,
				clipSize = $( window ).width();

			if ( self._inheritedSize.isDefinedWidth ) {
				return self._inheritedSize.width;
			}

			if ( $parent.hasClass( "ui-content" ) ) {
				paddingValue = parseInt( $parent.css( "padding-left" ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
				paddingValue = parseInt( $parent.css( "padding-right" ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
			} else {
				clipSize = self._$clip.width();
			}
			return clipSize;
		},

		_calculateClipHeight : function () {
			var self = this,
				$parent = self._$clip.parent(),
				header = null,
				footer = null,
				paddingValue = 0,
				clipSize = $( window ).height();

			if ( self._inheritedSize.isDefinedHeight ) {
				return self._inheritedSize.height;
			}

			if ( !$parent.hasClass( "ui-content" ) ) {
				$parent = $parent.hasClass( "ui-scrollview-view" ) ? $parent.parent() : null;
			}

			if ( $parent && $parent.length ) {
				paddingValue = parseInt( $parent.css( "padding-top" ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
				paddingValue = parseInt( $parent.css( "padding-bottom" ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
				header = $parent.siblings( ".ui-header" );
				footer = $parent.siblings( ".ui-footer" );

				if ( header ) {
					if ( header.outerHeight( true ) === null ) {
						clipSize = clipSize - ( $( ".ui-header" ).outerHeight() || 0 );
					} else {
						clipSize = clipSize - header.outerHeight( true );
					}
				}
				if ( footer ) {
					clipSize = clipSize - footer.outerHeight( true );
				}
			} else {
				clipSize = self._$clip.height();
			}
			return clipSize;
		},

		_calculateColumnSize : function () {
			var self = this,
				$tempBlock,
				$cell;

			$tempBlock = $( self._makeRows( 1 ) );
			self._$view.append( $tempBlock.children().first() );
			if ( self._direction ) {
				// x-axis
				self._viewSize = self._$view.width();
				$cell = self._$view.children().first().children().first();
				self._cellSize = $cell.outerWidth( true );
				self._cellOtherSize = $cell.outerHeight( true );
			} else {
				// y-axis
				self._viewSize = self._$view.height();
				$cell = self._$view.children().first().children().first();
				self._cellSize = $cell.outerHeight( true );
				self._cellOtherSize = $cell.outerWidth( true );
			}
			$tempBlock.remove();
			self._$view.children().remove();
		},

		_calculateColumnCount : function ( ) {
			var self = this,
				$view = self._$clip,
				viewSize = self._direction ? $view.innerHeight() : $view.innerWidth(),
				itemCount = 0 ;

			if ( self._direction ) {
				viewSize = viewSize - ( parseInt( $view.css( "padding-top" ), 10 ) + parseInt( $view.css( "padding-bottom" ), 10 ) );
			} else {
				viewSize = viewSize - ( parseInt( $view.css( "padding-left" ), 10 ) + parseInt( $view.css( "padding-right" ), 10 ) );
			}

			itemCount = parseInt( ( viewSize / self._cellOtherSize ), 10 );
			return itemCount > 0 ? itemCount : 1 ;
		},

		// Read the position of clip form property ('webkit-transform').
		// @return : number - position of clip.
		_getClipPosition : function () {
			var self = this,
				matrix = null,
				contents = null,
				result = -self._cellSize,
				$scrollview = self._$view.closest( ".ui-scrollview-view" );

			if ( $scrollview ) {
				matrix = $scrollview.css( "-webkit-transform" );
				contents = matrix.substr( 7 );
				contents = contents.substr( 0, contents.length - 1 );
				contents = contents.split( ', ' );
				result =  Math.abs( contents [5] );
			}
			return result;
		},

		//----------------------------------------------------//
		//		DOM Element handle		//
		//----------------------------------------------------//
		_makeRows : function ( count ) {
			var self = this,
				index = 0,
				row = null,
				wrapper = null;

			wrapper = self._createElement( "div" );
			wrapper.setAttribute( "class", "ui-scrollview-view" );
			for ( index = 0; index < count ; index += 1 ) {
				row = self._makeRow( index );
				if ( self._direction ) {
					row.style.top = 0;
					row.style.left = index * self._cellSize;
				}
				wrapper.appendChild( row );
			}
			return wrapper;
		},

		// make a single row block
		_makeRow : function ( rowIndex ) {
			var self = this,
				index = rowIndex * self._itemCount,
				colIndex = 0,
				blockClassName = self._direction ? "ui-virtualgrid-wrapblock-x" : "ui-virtualgrid-wrapblock-y",
				wrapBlock = self._createElement( "div" ),
				strWrapInner = "",
				attrName = self._direction ? "top" : "left";

			for ( colIndex = 0; colIndex < self._itemCount; colIndex++ ) {
				strWrapInner += self._makeHtmlData( index, colIndex, attrName );
				index += 1;
			}
			wrapBlock.innerHTML = strWrapInner;
			wrapBlock.setAttribute( "class", blockClassName );
			wrapBlock.setAttribute( "row-index", String( rowIndex ) );
			self._fragment.appendChild( wrapBlock );
			return wrapBlock;
		},

		_makeHtmlData : function ( dataIndex, colIndex, attrName ) {
			var self = this,
				htmlStr = "",
				itemData = null;

			itemData = self._itemData( dataIndex );
			if ( itemData ) {
				htmlStr = self._getConvertedTmplStr( itemData );
				htmlStr = self._insertPosToTmplStr( htmlStr, attrName, ( colIndex * self._cellOtherSize ) );
			}

			return htmlStr;
		},

		_insertPosToTmplStr : function ( tmplStr, attrName, posVal ) {
			var tagCloseIdx = tmplStr.indexOf( '>' ),
				classIdx = -1,
				firstPart,
				lastPart,
				result,
				found = false,
				targetIdx = 0,
				firstPartLen,
				i = 0;

			if ( tagCloseIdx === -1 ) {
				return;
			}

			firstPart = tmplStr.slice( 0, tagCloseIdx );
			lastPart = tmplStr.slice( tagCloseIdx, tmplStr.length );

			classIdx = firstPart.indexOf( 'class' );

			if ( classIdx !== -1 ) {
				firstPartLen = firstPart.length;
				for ( i = classIdx + 6; i < firstPartLen; i++ ) {
					if ( firstPart.charAt( i ) === "\"" || firstPart.charAt( i ) === "\'" ) {
						if ( found === false ) {
							found = true;
						} else {
							targetIdx = i;
							break;
						}
					}
				}
				result = firstPart.slice( 0, targetIdx ) + " virtualgrid-item" + firstPart.slice( targetIdx, firstPartLen ) + lastPart;
			} else {
				result = firstPart + " class=\"virtualgrid-item\"" + lastPart;
			}

			if ( !isNaN( posVal ) ) {
				result = result.replace( '>', " style=\"" + attrName + ": " + String( posVal ) + "px\">");
			}

			return result;
		},

		_increaseRow : function ( num ) {
			var self = this,
				rotation = self.options.rotation,
				totalRowCnt = self._totalRowCnt,
				rowView = self._$view[ 0 ],
				firstRow = null,
				lastRow = rowView.lastChild,
				row = null,
				headRowIndex = 0,
				tailRowIndex = 0,
				i;

			if ( !lastRow ) {
				return;
			}

			tailRowIndex = parseInt( lastRow.getAttribute( "row-index" ), 10 );
			if ( !rotation ) {
				firstRow = rowView.firstChild;
				headRowIndex = parseInt( firstRow.getAttribute( "row-index" ), 10 );
			}

			for ( i = 0 ; i < num ; ++i ) {
				if ( tailRowIndex >= totalRowCnt - 1 && !rotation ) {
					if ( headRowIndex == 0 ) {
						break;
					}

					row = self._makeRow( --headRowIndex );
					rowView.insertBefore( row, firstRow );
					firstRow = row;
				} else {
					row = self._makeRow( circularNum( ++tailRowIndex, totalRowCnt ) );
					rowView.appendChild( row );
				}

				if ( self._direction ) {
					$( row ).width( self._cellSize );
				} else {
					$( row ).height( self._cellSize );
				}
			}
		},

		_decreaseRow : function ( num ) {
			var self = this,
				rowView = self._$view[ 0 ],
				i;

			for ( i = 0 ; i < num ; ++i ) {
				rowView.removeChild( rowView.lastChild );
			}
		},

		_replaceRows : function ( curCnt, prevCnt, maxCnt, clipPosition ) {
			var self = this,
				$rows = self._$view.children(),
				prevRowIndex = 0,
				rowIndex = 0,
				diffRowCnt = 0,
				targetCnt = 1,
				filterCondition = ( self._filterRatio * self._cellSize ) + self._cellSize,
				idx = 0;

			if ( filterCondition < clipPosition ) {
				targetCnt += 1;
			}

			prevRowIndex = parseInt( $( $rows[targetCnt] ).attr( "row-index" ), 10 );
			if ( prevRowIndex === 0 ) {
				// only top.
				rowIndex = maxCnt - targetCnt;
			} else {
				rowIndex = Math.round( ( prevRowIndex * prevCnt ) / curCnt );
				if ( rowIndex + self._rowsPerView >= maxCnt ) {
					// only bottom.
					rowIndex = maxCnt - self._rowsPerView;
				}
				diffRowCnt = prevRowIndex - rowIndex;
				rowIndex -= targetCnt;
			}

			for ( idx = 0 ; idx < $rows.length ; idx += 1 ) {
				self._replaceRow( $rows[idx], circularNum( rowIndex, self._totalRowCnt ) );
				rowIndex++;
			}
			return -diffRowCnt;
		},

		_replaceRow : function ( block, index ) {
			var self = this,
				tempBlocks = null;

			while ( block.hasChildNodes() ) {
				block.removeChild( block.lastChild );
			}

			tempBlocks = self._makeRow( index );
			while ( tempBlocks.children.length ) {
				block.appendChild( tempBlocks.children[0] );
			}
			block.setAttribute( "row-index", tempBlocks.getAttribute( "row-index" ) );
			tempBlocks.parentNode.removeChild( tempBlocks );
		},

		_createElement : function ( tag ) {
			var element = document.createElement( tag );

			this._fragment.appendChild( element );
			return element;
		},

		_getObjectNames : function ( obj ) {
			var properties = [],
				name = "";

			for ( name in obj ) {
				properties.push( name );
			}
			this._properties = properties;
		},

		_getConvertedTmplStr : function ( data ) {
			var self = this,
				dataProperties = self._properties,
				i = 0,
				plainMsg,
				ret = "";

			if ( !data ) {
				return ;
			}

			plainMsg = self._templateText;
			for ( i = 0; i < dataProperties.length; i++ ) {
				plainMsg = self._strReplace( plainMsg, "${" + dataProperties[ i ] + "}" , data[ dataProperties[ i ] ] );
			}
			plainMsg = self._changeImgSrcAriaAttrFromTmpl( plainMsg );

			return plainMsg;
		},

		_changeImgSrcAriaAttrFromTmpl : function ( plainMsg ) {
			var self = this,
				ret = "",
				targetTagIdx,
				beforeTargetTag = "",
				afterTargetTag = "",
				imgFileName,
				imgSrcSlashIdx,
				temp,
				srcRegExpResult;

			temp = plainMsg;
			targetTagIdx = temp.indexOf( "$ARIA-IMG-SRC-ALT$" );
			while ( targetTagIdx !== -1 ) {
				imgFileName = "";
				beforeTargetTag = beforeTargetTag + temp.slice( 0, targetTagIdx + 19 );
				afterTargetTag = temp.slice( targetTagIdx + 19, temp.length );
				srcRegExpResult = afterTargetTag.match( imgTagSrcAttrRE );
				if ( srcRegExpResult ) {
					imgSrcSlashIdx = srcRegExpResult[0].lastIndexOf( "/" );
					if ( imgSrcSlashIdx !== -1 ) {
						imgFileName = srcRegExpResult[0].slice( imgSrcSlashIdx + 1, -1 );
					}
				}
				beforeTargetTag = beforeTargetTag.replace( "$ARIA-IMG-SRC-ALT$", imgFileName );
				temp = afterTargetTag;
				targetTagIdx = temp.indexOf( "$ARIA-IMG-SRC-ALT$" );
				ret = beforeTargetTag + afterTargetTag;
			}

			if ( ret === "" ) {
				ret = plainMsg;
			}

			return ret;
		},

		_insertAriaAttrToTmpl : function ( plainMsg ) {
			var ret = "",
				targetTagIdx,
				beforeTargetTag = "",
				afterTargetTag = "",
				temp;

			temp = plainMsg.replace( "<div", "<div tabindex=\"0\" aria-selected=\"true\"" );
			targetTagIdx = temp.indexOf( "<img" );
			if ( targetTagIdx !== -1 ) {
				while ( targetTagIdx !== -1 ) {
					beforeTargetTag = beforeTargetTag + temp.slice( 0, targetTagIdx + 4 );
					afterTargetTag = temp.slice( targetTagIdx + 4, temp.length );
					beforeTargetTag = beforeTargetTag + " role=\"img\" alt=\"$ARIA-IMG-SRC-ALT$\"";
					temp = afterTargetTag;
					targetTagIdx = temp.indexOf( "<img" );
					ret = beforeTargetTag + afterTargetTag;
				}
				temp = ret;
				targetTagIdx = temp.indexOf( "<span" );
				beforeTargetTag = "";
				while ( targetTagIdx !== -1 ) {
					beforeTargetTag = beforeTargetTag + temp.slice( 0, targetTagIdx + 5 );
					afterTargetTag = temp.slice( targetTagIdx + 5, temp.length );
					beforeTargetTag = beforeTargetTag + " aria-hidden=\"true\" tabindex=\"-1\"";
					temp = afterTargetTag;
					targetTagIdx = temp.indexOf( "<span" );
					ret = beforeTargetTag + afterTargetTag;
				}
			}

			if ( ret === "" ) {
				ret = plainMsg;
			}

			return ret;
		},

		_strReplace : function ( plainMsg, stringToFind, stringToReplace ) {
			var temp = plainMsg,
				index = plainMsg.indexOf( stringToFind );
			while ( index !== -1 ) {
				temp = temp.replace( stringToFind, stringToReplace );
				index = temp.indexOf( stringToFind );
			}
			return temp;
		}

	} );

	$( document ).bind( "pagecreate create", function ( e ) {
		$( ":jqmData(role='virtualgrid')" ).virtualgrid();
	} );
} ( jQuery, window, document ) );


/*
* Module Name : jquery.mobile.tizen.loadprototype
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

( function ( $, undefined ) {

	ensureNS( "jQuery.mobile.tizen" );

	jQuery.extend( jQuery.mobile.tizen, {
		_widgetPrototypes: {},

		/*
		 * load the prototype for a widget.
		 *
		 * If @widget is a string, the function looks for @widget.prototype.html in the proto-html/ subdirectory of the
		 * framework's current theme and loads the file via AJAX into a string. Note that the file will only be loaded via
		 * AJAX once. If two widget instances based on the same @widget value are to be constructed, the second will be
		 * constructed from the cached copy of the prototype of the first instance.
		 *
		 * If @widget is not a string, it is assumed to be a hash containing at least one key, "proto", the value of which is
		 * the string to be used for the widget prototype. if another key named "key" is also provided, it will serve as the
		 * key under which to cache the prototype, so it need not be rendered again in the future.
		 *
		 * Given the string for the widget prototype, the following patterns occurring in the string are replaced:
		 *
		 *   "${FRAMEWORK_ROOT}" - replaced with the path to the root of the framework
		 *
		 * The function then creates a jQuery $("<div>") object containing the prototype from the string.
		 *
		 * If @ui is not provided, the jQuery object containing the prototype is returned.
		 *
		 * If @ui is provided, it is assumed to be a (possibly multi-level) hash containing CSS selectors. For every level of
		 * the hash and for each string-valued key at that level, the CSS selector specified as the value is sought in the
		 * prototype jQuery object and, if found, the value of the key is replaced with the jQuery object resulting from the
		 * search. Additionally, if the CSS selector is of the form "#widgetid", the "id" attribute will be removed from the
		 * elements contained within the resulting jQuery object. The resulting hash is returned.
		 *
		 * Examples:
		 *
		 * 1.
		 * $.mobile.tizen.loadPrototype("mywidget") => Returns a <div> containing the structure from the file
		 * mywidget.prototype.html located in the current theme folder of the current framework.
		 *
		 * 2. $.mobile.tizen.loadPrototype("mywidget", ui):
		 * where ui is a hash that looks like this:
		 * ui = {
		 *   element1: "<css selector 1>",
		 *   element2: "<css selector 2>",
		 *   group1: {
		 *     group1element1: "<css selector 3>",
		 *     group1element1: "<css selector 4>"
		 *   }
		 *  ...
		 * }
		 *
		 * In this case, after loading the prototype as in Example 1, loadPrototype will traverse @ui and replace the CSS
		 * selector strings with the result of the search for the selector string upon the prototype. If any of the CSS
		 * selectors are of the form "#elementid" then the "id" attribute will be stripped from the elements selected. This
		 * means that they will no longer be accessible via the selector used initially. @ui is then returned thus modified.
		 */

		loadPrototype: function ( widget, ui ) {
			var ret,
				theScriptTag = $( "script[data-framework-version][data-framework-root][data-framework-theme]" ),
				frameworkRootPath = theScriptTag.attr( "data-framework-root" ) + "/" +
									theScriptTag.attr( "data-framework-version" ) + "/",
				protoPath;

			function replaceVariables( s ) {
				return s.replace( /\$\{FRAMEWORK_ROOT\}/g, frameworkRootPath );
			}

			function fillObj( obj, uiProto ) {
				var selector, key;

				for ( key in obj ) {
					if ( typeof obj[ key ] === "string" ) {
						selector = obj[ key ];
						obj[ key ] = uiProto.find( obj[ key ] );
						if ( selector.substring( 0, 1 ) === "#" ) {
							obj[ key ].removeAttr( "id" );
						}
					} else if (typeof obj[ key ] === "object") {
						obj[ key ] = fillObj( obj[ key ], uiProto );
					}
				}
				return obj;
			}

			/* If @widget is a string ... */
			if ( typeof widget === "string" ) {
				/* ... try to use it as a key into the cached prototype hash ... */
				ret = $.mobile.tizen._widgetPrototypes[widget];
				if ( ret === undefined ) {
					/* ... and if the proto was not found, try to load its definition ... */
					protoPath = frameworkRootPath + "proto-html" + "/" +
								theScriptTag.attr( "data-framework-theme" );
					$.ajax( {
						url: protoPath + "/" + widget + ".prototype.html",
						async: false,
						dataType: "html"
					} )
						.success( function ( data, textStatus, jqXHR ) {
							/* ... and if loading succeeds, cache it and use a copy of it ... */
							$.mobile.tizen._widgetPrototypes[ widget ] = $( "<div>" ).html( replaceVariables( data ) );
							ret = $.mobile.tizen._widgetPrototypes[ widget ].clone();
						} );
				}
			} else {
				/* Otherwise ... */
				/* ... if a key was provided ... */
				if ( widget.key !== undefined ) {
					/* ... try to use it as a key into the cached prototype hash ... */
					ret = $.mobile.tizen._widgetPrototypes[ widget.key ];
				}

				/* ... and if the proto was not found in the cache ... */
				if ( ret === undefined ) {
					/* ... and a proto definition string was provided ... */
					if ( widget.proto !== undefined ) {
						/* ... create a new proto from the definition ... */
						ret = $( "<div>" ).html(replaceVariables( widget.proto ) );
						/* ... and if a key was provided ... */
						if ( widget.key !== undefined ) {
							/* ... cache a copy of the proto under that key */
							$.mobile.tizen._widgetPrototypes[ widget.key ] = ret.clone();
						}
					}
				} else {
					/* otherwise, if the proto /was/ found in the cache, return a copy of it */
					ret = ret.clone();
				}
			}

			/* If the prototype was found/created successfully ... */
			if ( ret != undefined ) {
				/* ... and @ui was provided */
				if ( ui != undefined ) {
					/* ... return @ui, but replace the CSS selectors it contains with the elements they select */
					ret = fillObj( ui, ret );
				}
			}

			return ret;
		}
	});
}( jQuery ) );


/*
* Module Name : widgets/jquery.mobile.tizen.progress
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/*
 * Progress widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'progress'.
 *  data-style: 'circle' or 'pending'.
 *
 * APIs
 *
 *  show(): show the progress.
 *  hide(): hide the progress.
 *  running(boolean): start or stop the running.
 *
 * Events
 *
 *  N/A
 *
 * Examples
 *
 * <li data-role="list-divider">Progress Pending</li>
 * <li>
 *	<div data-role="progress" data-style="pending" id="pending"></div>
 * </li>
 * <li data-role="list-divider">Progress ~ing</li>
 * <li>
 *	<div data-role="progress" data-style="circle" id="progress"></div>Loading..
 * </li>
 *
 * $("#pending").progress( "running", true );
 * $("#progress").progress( "running", true );
 *
 */

/**
	@class Progress
	The progress widget shows that an operation is in progress. <br/>To add a progress widget to the application, use the following code:

		<div data-role="progress" data-style="circle"></div>
*/
/**
	@property {String} data-style
	Sets the style of the progress widget. The style options are pending (pending progress style) and circle (circular progress status style).
*/
/**
	@method running
	The running method is used to set the current running state of the pending or circular progress widget:

		<div id="foo" data-role="progress" data-style="pending"></div>
		$("#foo").progress("running", true);
*/
/**
	@method show
	The show method is used to show the pending or circular progress widget:

		<div id="foo" data-role="progress" data-style="pending"></div>
		$("#foo").progress("show");
*/
/**
	@method hide
	The show method is used to hide the pending or circular progress widget:

		<div id="foo" data-role="progress" data-style="pending"></div>
		$("#foo").progress("hide");
*/

(function ( $, window, undefined ) {
	$.widget( "tizen.progress", $.mobile.widget, {
		options: {
			style: "circle",
			running: false
		},

		show: function () {
			$( this.element ).show();
		},

		hide: function () {
			$( this.element ).hide();
		},

		_start: function () {
			if ( !this.init ) {
				$( this.element ).append( this.html );
				this.init = true;
			}

			this.show();

			$( this.element )
				.find( ".ui-progress-" + this.options.style )
				.addClass( this.runningClass );
		},

		_stop: function () {
			$( this.element )
				.find( ".ui-progress-" + this.options.style )
				.removeClass( this.runningClass );
		},

		running: function ( running ) {
			if ( running === undefined ) {
				return this.options.running;
			}

			this._setOption( "running", running );
		},

		_setOption: function ( key, value ) {
			if ( key === "running" ) {
				if ( typeof value !== "boolean" ) {
					window.alert( "running value MUST be boolean type!" );
					return;
				}

				this.options.running = value;
				this._refresh();
			}
		},

		_refresh: function () {
			if ( this.options.running ) {
				this._start();
			} else {
				this._stop();
			}
		},

		_create: function () {
			var self = this,
				element = this.element,
				style = element.jqmData( "style" ),
				_html,
				runningClass;

			if ( style ) {
				this.options.style = style;
			} else {
				style = this.options.style;
			}

			if ( style == "circle" ) {
				$( this.element ).addClass("ui-progress-container-circle");

				_html =	'<div class="ui-progress-circle"></div>';
			} else if ( style === "pending" ) {
				$( this.element ).addClass("ui-progressbar");

				_html = '<div class="ui-progressbar-bg">' +
						'<div class="ui-progress-pending"></div>' +
					'</div>';
			}

			this.html = $( _html );

			runningClass = "ui-progress-" + style + "-running";

			$.extend( this, {
				init: false,
				runningClass: runningClass
			} );

			if ( style === "pending" ) {
				$( this.element ).append( this.html );
				this.init = true;
			}

			this._refresh();
		}
	} ); /* End of widget */

	$( document ).bind( "pagecreate create", function ( e ) {
		$( e.target ).find( ":jqmData(role='progress')" ).progress();
	} );
}( jQuery, this ));


/*
* Module Name : widgets/jquery.mobile.tizen.widgetex
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

// Base class for widgets that need the following features:
//
// I. HTML prototype loading
//
// This class provides HTML prototype loading for widgets. That is, the widget implementation specifies its HTML portions
// in one continuous HTML snippet, and it optionally provides an object containing selectors into the various parts of the
// HTML snippet. This widget loads the HTML snippet into a jQuery object, and optionally assigns jQuery objects to each of
// the selectors in the optionally provided object.
//
// To use this functionality you can either derive from this class, or you can call its prototype's gtype method.
//
// 1. Widgets deriving from this class should define _htmlProto as part of their prototype declaration. _htmlProto looks like
// this:
//
// _htmlProto: {
//     source: string|jQuery object (optional) default: string - The name of the widget
//     ui: {
//         uiElement1: "#ui-element-1-selector",
//         uiElement2: "#ui-element-2-selector",
//         ...
//         subElement: {
//             subElement1: "#sub-element-1-selector",
//             subElement2: "#sub-element-2-selector",
//             ...
//         }
//         ...
//     }
// }
//
// If neither 'source' nor 'ui' are defined, you must still include an empty _htmlProto key (_htmlProto: {}) to indicate
// that you wish to make use of this feature. This will cause a prototype HTML file named after your widget to be loaded.
// The loaded prototype will be placed into your widget's prototype's _protoHtml.source key.
//
// If 'source' is defined as a string, it is the name of the widget (including namespace). This is the default. If your
// widget's HTML prototype is loaded via AJAX and the name of the AJAX file is different from the name of your widget
// (that is, it is not "<widgetName>.prototype.html", then you should explicitly define 'source' as:
//
// If you wish to load HTML prototypes via AJAX, modify the getProtoPath() function defined below to reflect the directory
// structure holding your widget HTML prototypes.
//
// source: "alternateWidgetName"
//
// If AJAX loading fails, source is set to a jQuery object containing a div with an error message. You can check whether
// loading failed via the jQuery object's jqmData( "tizen.widgetex.ajax.fail" ) data item. If false, then the jQuery object
// is the actual prototype loaded via AJAX or present inline. Otherwise, the jQuery object is the error message div.
//
// If 'source' is defined as a jQuery object, it is considered already loaded.
//
// if 'ui' is defined inside _htmlProto, It is assumed to be an object such that every one of its keys is either a string,
// or another object with the same properties as itself.
//
// When a widget is instantiated, the HTML prototype is loaded if not already present in the prototype. If 'ui' is present
// inside _htmlProto, the prototype is cloned. Then, a new structure is created based on 'ui' with each selector replaced
// by a jQuery object containing the results of performing .find() on the prototype's clone with the filter set to the
// value of the string. In the special case where the selector starts with a '#', the ID is removed from the element after
// it is assigned into the structure being created. This structure is then made accessible from the widget instance via
// the '_ui' key (i.e., this._ui).
//
// 2. Use the loadPrototype method when your widget does not derive from $.tizen.widgetex:
// Add _htmlProto to your widget's prototype as described above. Then, in your widget's _create() method, call
// loadPrototype in the following manner:
//
// $.tizen.widgetex.loadPrototype.call(this, "namespace.widgetName" );
//
// Thereafter, you may use the HTML prototype from your widget's prototype or, if you have specified a 'ui' key in your
// _htmlProto key, you may use this._ui from your widget instance.
//
// II. realize method
//
// When a widget is created, some of its properties cannot be set immediately, because they depend on the widths/heights
// of its constituent elements. They can only be calculated when the page containing the widget is made visible via the
// "pageshow" event, because widths/heights always evaluate to 0 when retrieved from a widget that is not visible. When
// you inherit from widgetex, you can add a "_realize" function to your prototype. This function will be called once right
// after _create() if the element that anchors your widget is on a visible page. Otherwise, it will be called when the
// page to which the widget belongs emits the "pageshow" event.
//
// NB: If your widget is inside a container which is itself not visible, such as an expandable or a collapsible, your
// widget will remain hidden even though "pageshow" is fired and therefore _realize is called. In this case, widths and
// heights will be unreliable even during _realize.
//
// III. systematic option handling
//
// If a widget has lots of options, the _setOption function can become a long switch for setting each recognized option.
// It is also tempting to allow options to determine the way a widget is created, by basing decisions on various options
// during _create(). Often, the actions based on option values in _create() are the same as those in _setOption. To avoid
// such code duplication, this class calls _setOption once for each option after _create() has completed.
//
// Furthermore, to avoid writing long switches in a widget's _setOption method, this class implements _setOption in such
// a way that, for any given option (e.g. "myOption" ), _setOption looks for a method _setMyOption in the widget's
// implementation, and if found, calls the method with the value of the option.
//
// If your widget does not inherit from widgetex, you can still use widgetex' systematic option handling:
// 1. define the _setOption method for your widget as follows:
//      _setOption: $.tizen.widgetex.prototype._setOption
// 2. Call this._setOptions(this.options) from your widget's _create() function.
// 3. As with widgetex-derived widgets, implement a corresponding _setMyOptionName function for each option myOptionName
// you wish to handle.
//
// IV. systematic value handling for input elements
//
// If your widget happens to be constructed from an <input> element, you have to handle the "value" attribute specially,
// and you have to emit the "change" signal whenever it changes, in addition to your widget's normal signals and option
// changes. With widgetex, you can assign one of your widget's "data-*" properties to be synchronized to the "value"
// property whenever your widget is constructed onto an <input> element. To do this, define, in your prototype:
//
// _value: {
//      attr: "data-my-attribute",
//      signal: "signal-to-emit"
// }
//
// Then, call this._setValue(newValue) whenever you wish to set the value for your widget. This will set the data-*
// attribute, emit the custom signal (if set) with the new value as its parameter, and, if the widget is based on an
// <input> element, it will also set the "value" attribute and emit the "change" signal.
//
// "attr" is required if you choose to define "_value", and identifies the data-attribute to set in addition to "value",
// if your widget's element is an input.
// "signal" is optional, and will be emitted when setting the data-attribute via this._setValue(newValue).
//
// If your widget does not derive from widgetex, you can still define "_value" as described above and call
// $.tizen.widgetex.setValue(widget, newValue).
//
// V. Systematic enabled/disabled handling for input elements
//
// widgetex implements _setDisabled which will disable the input associated with this widget, if any. Thus, if you derive
// from widgetex and you plan on implementing the disabled state, you should chain up to
// $.tizen.widgetex.prototype._setDisabled(value), rather than $.Widget.prototype._setOption( "disabled", value).

(function ($, undefined) {

// Framework-specific HTML prototype path for AJAX loads
	function getProtoPath() {
		var theScriptTag = $( "script[data-framework-version][data-framework-root][data-framework-theme]" );

		return (theScriptTag.attr( "data-framework-root" ) + "/" +
				theScriptTag.attr( "data-framework-version" ) + "/themes/" +
				theScriptTag.attr( "data-framework-theme" ) + "/proto-html" );
	}

	$.widget( "tizen.widgetex", $.mobile.widget, {
		_createWidget: function () {
			$.tizen.widgetex.loadPrototype.call( this, this.namespace + "." + this.widgetName );
			$.mobile.widget.prototype._createWidget.apply( this, arguments );
		},

		_init: function () {
			// TODO THIS IS TEMPORARY PATCH TO AVOID CTXPOPUP PAGE CRASH
			if ( this.element === undefined ) {
				return;
			}

			var page = this.element.closest( ".ui-page" ),
				self = this,
				myOptions = {};

			if ( page.is( ":visible" ) ) {
				this._realize();
			} else {
				page.bind( "pageshow", function () { self._realize(); } );
			}

			$.extend( myOptions, this.options );

			this.options = {};

			this._setOptions( myOptions );
		},

		_getCreateOptions: function () {
			// if we're dealing with an <input> element, value takes precedence over corresponding data-* attribute, if a
			// mapping has been established via this._value. So, assign the value to the data-* attribute, so that it may
			// then be assigned to this.options in the superclass' _getCreateOptions

			if (this.element.is( "input" ) && this._value !== undefined) {
				var theValue =
					( ( this.element.attr( "type" ) === "checkbox" || this.element.attr( "type" ) === "radio" )
							? this.element.is( ":checked" )
									: this.element.is( "[value]" )
									? this.element.attr( "value" )
											: undefined);

				if ( theValue != undefined ) {
					this.element.attr( this._value.attr, theValue );
				}
			}

			return $.mobile.widget.prototype._getCreateOptions.apply( this, arguments );
		},

		_setOption: function ( key, value ) {
			var setter = "_set" + key.replace(/^[a-z]/, function (c) { return c.toUpperCase(); } );

			if ( this[setter] !== undefined ) {
				this[setter]( value );
			} else {
				$.mobile.widget.prototype._setOption.apply( this, arguments );
			}
		},

		_setDisabled: function ( value ) {
			$.Widget.prototype._setOption.call( this, "disabled", value );
			if ( this.element.is( "input" ) ) {
				this.element.attr( "disabled", value );
			}
		},

		_setValue: function ( newValue ) {
			$.tizen.widgetex.setValue( this, newValue );
		},

		_realize: function () {}
	} );

	$.tizen.widgetex.setValue = function ( widget, newValue ) {
		if ( widget._value !== undefined ) {
			var valueString = ( widget._value.makeString ? widget._value.makeString(newValue) : newValue ),
				inputType;

			widget.element.attr( widget._value.attr, valueString );
			if ( widget._value.signal !== undefined ) {
				widget.element.triggerHandler( widget._value.signal, newValue );
			}

			if ( widget.element.is( "input" ) ) {
				inputType = widget.element.attr( "type" );

				// Special handling for checkboxes and radio buttons, where the presence of the "checked" attribute is really
				// the value
				if ( inputType === "checkbox" || inputType === "radio" ) {
					if ( newValue ) {
						widget.element.attr( "checked", true );
					} else {
						widget.element.removeAttr( "checked" );
					}
				} else {
					widget.element.attr( "value", valueString );
				}

				widget.element.trigger( "change" );
			}
		}
	};

	$.tizen.widgetex.assignElements = function (proto, obj) {
		var ret = {},
			key;

		for ( key in obj ) {
			if ( ( typeof obj[key] ) === "string" ) {
				ret[key] = proto.find( obj[key] );
				if ( obj[key].match(/^#/) ) {
					ret[key].removeAttr( "id" );
				}
			} else {
				if ( (typeof obj[key]) === "object" ) {
					ret[key] = $.tizen.widgetex.assignElements( proto, obj[key] );
				}
			}
		}

		return ret;
	};

	$.tizen.widgetex.loadPrototype = function ( widget, ui ) {
		var ar = widget.split( "." ),
			namespace,
			widgetName,
			source,
			noSource = false,
			htmlProto,
			protoPath;

		if ( ar.length == 2 ) {
			namespace = ar[0];
			widgetName = ar[1];

			// If htmlProto is defined
			if ( $[namespace][widgetName].prototype._htmlProto !== undefined ) {
				// If no source is defined, use the widget name
				source = $[namespace][widgetName].prototype._htmlProto.source;
				if ( source === undefined ) {
					source = widgetName;
					noSource = true;
				}

				// Load the HTML prototype via AJAX if not defined inline
				if ( typeof source === "string" ) {
					if ( noSource ) {	// use external htmlproto file
						// Establish the path for the proto file
						widget = source;
						protoPath = getProtoPath();

						// Make the AJAX call
						$.ajax( {
							url: protoPath + "/" + widget + ".prototype.html",
							async: false,
							dataType: "html"
						}).success( function (data, textStatus, jqXHR ) {
							source = $( "<div></div>" ).html(data).jqmData( "tizen.widgetex.ajax.fail", false );
						} );

						// Assign the HTML proto to the widget prototype
						source  = $( "<div></div>" )
							.text( "Failed to load proto for widget " + namespace + "." + widgetName + "!" )
							.css( {background: "red", color: "blue", border: "1px solid black"} )
							.jqmData( "tizen.widgetex.ajax.fail", true );

					} else {
						// inline definition (string)
						source = $( source ).jqmData( "tizen.widgetex.ajax.fail", false );
					}

				} else {
					// inline definition (object)
					// AJAX loading has trivially succeeded, since there was no AJAX loading at all
					source.jqmData( "tizen.widgetex.ajax.fail", false );
				}
				htmlProto = source;
				$[namespace][widgetName].prototype._htmlProto.source = source;

				// If there's a "ui" portion in the HTML proto, copy it over to this instance, and
				// replace the selectors with the selected elements from a copy of the HTML prototype
				if ( $[namespace][widgetName].prototype._htmlProto.ui !== undefined ) {
					// Assign the relevant parts of the proto
					$.extend( this, {
						_ui: $.tizen.widgetex.assignElements( htmlProto.clone(), $[namespace][widgetName].prototype._htmlProto.ui )
					});
				}
			}
		}
	};

}( jQuery ) );


/*
* Module Name : widgets/jquery.mobile.tizen.progressbar
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/* This is from jquery ui plugin - progressbar 11/16/2011 */


/**
	@class ProgressBar
	The progress bar widget shows a control that indicates the progress percentage of an on-going operation. This widget can be scaled to fit inside a parent container.

	To add a progress bar widget to the application, use the following code:

		<div id="foo" data-role="progressbar"</div>
*/
/**
	@event change
	The progress bar can define a callback for the change event, which is fired when the progress value is changed:
		<div id="foo" data-role="progressbar"></div>
		$("#foo").bind("change", function (ev, val) {
			Console.log("Value is changed to " + val);
		});
*/
/**
	@method value
	You can use the value method with the pickers to set or get the current default progress bar value:

		<div id="foo" data-role="progressbar"></div>
		var oldVal = $("#foo").progressbar("value");
		$("#foo").progressbar("value", 50);
*/

(function ( $, window, undefined ) {

	$.widget( "tizen.progressbar", $.mobile.widget, {
		options: {
			value: 0,
			max: 100
		},

		min: 0,

		_create: function () {
			this.element
				.addClass( "ui-progressbar" )
				.attr( {
					role: "progressbar",
					"aria-valuemin": this.min,
					"aria-valuemax": this.options.max,
					"aria-valuenow": this._value()
				} );

			this.valueDiv = $( "<div class='ui-progressbar-value'></div>" )
				.appendTo( this.element );

			this.valueDiv.wrap("<div class='ui-progressbar-bg'></div>");

			this.oldValue = this._value();
			this._refreshValue();
		},

		_destroy: function () {
			this.element
				.removeClass( "ui-progressbar" )
				.removeAttr( "role" )
				.removeAttr( "aria-valuemin" )
				.removeAttr( "aria-valuemax" )
				.removeAttr( "aria-valuenow" );

			this.valueDiv.remove();
		},

		value: function ( newValue ) {
			if ( newValue === undefined ) {
				return this._value();
			}

			this._setOption( "value", newValue );
			return this;
		},

		_setOption: function ( key, value ) {
			if ( key === "value" ) {
				this.options.value = value;
				this._refreshValue();
				if ( this._value() === this.options.max ) {
					this.element.trigger( "complete" );
				}
			}
			// jquery.ui.widget.js MUST be updated to new version!
			//this._super( "_setOption", key, value );
		},

		_value: function () {
			var val = this.options.value;
			// normalize invalid value
			if ( typeof val !== "number" ) {
				val = 0;
			}
			return Math.min( this.options.max, Math.max( this.min, val ) );
		},

		_percentage: function () {
			return 100 * this._value() / this.options.max;
		},

		_refreshValue: function () {
			var value = this.value(),
				percentage = this._percentage();

			if ( this.oldValue !== value ) {
				this.oldValue = value;
				this.element.trigger( "change" );
			}

			this.valueDiv
				.toggle( value > this.min )
				.width( percentage.toFixed(0) + "%" );
			this.element.attr( "aria-valuenow", value );
		}
	} );

	// auto self-init widgets
	$( document ).bind( "pagecreate", function ( e ) {
		$( e.target ).find( ":jqmData(role='progressbar')" ).progressbar();
	} );

}( jQuery, this ) );


/*
* Module Name : widgets/jquery.mobile.tizen.swipe
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

// Widget which turns a html element into a "swipe":
// i.e. each list item has a sliding "cover" which can be swiped
// to the right (to reveal buttons underneath) or left (to
// cover the buttons again). Clicking on a button under a swipe
// also moves the cover back to the left.
//
// In this case, the cover is over a grid of buttons;
// but it is should also be possible to use other types of markup under the
// list items.
//
// WARNING: This doesn't work well inside a scrollview widget, as
// the touch events currently interfere with each other badly (e.g.
// a swipe will work but cause a scroll as well).
//
// Theme: default is to use the theme on the target element,
// theme passed in options, parent theme, or 'c' if none of the above.
// If list items are themed individually, the cover will pick up the
// theme of the list item which is its parent.
//

/**
	@class Swipe
	The swipe widget shows a view on the screen where the items can be swiped vertically to show a menu.
	To add a swipe widget to the application, use the following code:

		<ul data-role="listview">
			<li data-role="swipe">
				<div data-role="swipe-cover">
					<div data-role="button" data-inline="true">OK</div>
					<div data-role="button" data-inline="true">Cancel</div>
				</div>
				<div data-role="swipe-item-cover">
					<p>This is a swipe item cover.<br>
						This will be swiped out when swipe event comes.</p>
				</div>
			</li>
		</ul>

	You can use methods with the swipe as described in the jQueryMobile documentation for view methods.
*/
/**
	@property {String} data-role
	Creates a swipe using the HTML unordered view (&gt;ul&lt;) element.
	The default value is swipe.

	Creates a swipe item cover using an HTML $gt;div$lt; element. This cover can be swiped to show the content beneath it.
	The default value is swipe-item-cover.
*/
/**
	@method open
	uncover swipe item
*/
/**
	@method close
	cover swipe item
*/
/**
	@method opened
	return coveritem status( coverd or uncovred )
*/
/**
	@event animationstart
	The swipe can define a callback for the animationstart event, which is fired after a item is swipe and the swipe animation is start:
*/
/**
	@event animationend
	The swipe can define a callback for the animationend event, which is fired after a item is swiped and the swipe animation is complete:

		<ul data-role="listview">
		<li data-role="swipe">
				<div data-role="swipe-cover">
					<div data-role="button" data-inline="true">OK</div>
					<div data-role="button" data-inline="true">Cancel</div>
				</div>
				<div data-role="swipe-item-cover" id="foo">
				<p>This is a swipe item cover.<br>
						This will be swiped out when swipe event comes.</p>
				</div>
			</li>
		</ul>
		$("#foo").bind("animationend", function (ev)
		{
			Console.log("Swipe cover's animation is complete.");
		});
*/
(function ($) {

	$.widget("tizen.swipe", $.mobile.widget, {
		options: {
			theme: null
		},

		_create: function () {
			// use the theme set on the element, set in options,
			// the parent theme, or 'c' (in that order of preference)
			var theme = this.element.jqmData('theme') ||
				this.options.theme ||
				this.element.parent().jqmData('theme') ||
				's';

			this.options.theme = theme;
			this._isopen = false;
			this.refresh();
		},

		refresh: function () {
			this._cleanupDom();

			var self = this,
				defaultCoverTheme,
				covers,
				coverTheme,
				item,
				itemHasThemeClass;

			defaultCoverTheme = 'ui-body-' + this.options.theme;

			if ( !this.element.parent().hasClass('ui-listview') ) {
				this.element.parent().listview();
			}
			this.element.addClass('ui-swipe');

			// get the item covers
			covers = this.element.find(':jqmData(role="swipe-item-cover")');
			item = this.element.find(':jqmData(role="swipe-item")');

			this._covers = covers;
			this._item = item;
			item.addClass('ui-swipe-item');
			coverTheme = defaultCoverTheme;
			itemHasThemeClass = item.parent().attr('class')
					.match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);

			covers.each( function () {
				var cover = $( this );

				if ( itemHasThemeClass ) {
					coverTheme = itemHasThemeClass[0];
				}

				cover.addClass('ui-swipe-item-cover');
				cover.addClass( coverTheme );

				if ( cover.has('.ui-swipe-item-cover-inner').length === 0 ) {
					cover.wrapInner( $('<span/>').addClass('ui-swipe-item-cover-inner') );
				}

				if ( !( cover.data('animateRight') && cover.data('animateLeft') ) ) {
					cover.data('animateRight', function () {
						self._animateCover( cover, 110, item );
					});

					cover.data('animateLeft', function () {
						self._animateCover( cover, 0, item );
					});
				}

				// bind to synthetic events
				item.bind( 'swipeleft', cover.data('animateLeft') );
				cover.bind( 'swiperight', cover.data('animateRight') );
				item.find( '.ui-btn' ).bind( 'vclick', cover.data('animateLeft') );
			} );

		},

		_cleanupDom: function () {
			var self = this,
				defaultCoverTheme,
				cover,
				coverTheme = defaultCoverTheme,
				item,
				itemClass,
				itemHasThemeClass,
				text,
				wrapper;

			defaultCoverTheme = 'ui-body-' + this.options.theme;

			this.element.removeClass('ui-swipe');

			// get the item covers
			cover = this.element.find(':jqmData(role="swipe-item-cover")');
			item = this.element.find(':jqmData(role="swipe-item")');

			item.removeClass('ui-swipe-item');
			cover.removeClass('ui-swipe-item-cover');

			itemClass = item.attr('class');
			itemHasThemeClass = itemClass &&
				itemClass.match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);

			if ( itemHasThemeClass ) {
				coverTheme = itemHasThemeClass[0];
			}

			cover.removeClass(coverTheme);

			// remove wrapper HTML
			wrapper = cover.find('.ui-swipe-item-cover-inner');
			wrapper.children().unwrap();
			text = wrapper.text();

			if ( text ) {
				cover.append( text );
				wrapper.remove();
			}

			// unbind swipe events
			if ( cover.data('animateRight') && cover.data('animateLeft') ) {
				cover.unbind( 'swiperight', cover.data('animateRight') );
				item.unbind( 'swipeleft', cover.data('animateLeft') );

				// unbind clicks on buttons inside the item
				item.find('.ui-btn').unbind( 'vclick', cover.data('animateLeft') );

				cover.data( 'animateRight', null );
				cover.data( 'animateLeft', null );
			}
		},

		// NB I tried to use CSS animations for this, but the performance
		// and appearance was terrible on Android 2.2 browser;
		// so I reverted to jQuery animations
		//
		// once the cover animation is done, the cover emits an
		// animationComplete event
		_animateCover: function ( cover, leftPercentage, item ) {
			var self = this,
				animationOptions = {
					easing: 'linear',
					duration: 'normal',
					queue: true,
					complete: function () {
						cover.trigger('animationend');
					}
				};

			$( this.element.parent() )
				.find(":jqmData(role='swipe')")
				.each(
					function () {
						if ( this !== self.element.get(0) &&
								$( this ).swipe("opened") ) {
							$( this ).swipe("close");
						}
					}
				);

			if ( leftPercentage == 110 ) {
				this._isopen = true;
			} else {
				this._isopen = false;
			}

			cover.stop();
			cover.clearQueue();
			cover.trigger('animationstart');
			cover.clearQueue().animate( { left: leftPercentage + '%' }, animationOptions );
			if ( leftPercentage == 0 ) {
				item.clearQueue().animate({ opacity: 0 }, "slow");
			} else {
				item.clearQueue().animate({ opacity: 1 }, "slow");
			}

		},

		destroy: function () {
			this._cleanupDom();
		},

		open: function () {
			var self = this;

			$( self._covers ).each( function () {
				var cover = $( this );
				self._animateCover( cover, 110, self._item);
			} );
		},

		opened: function () {
			return this._isopen;
		},

		close: function () {
			var self = this;

			$( self._covers ).each( function () {
				var cover = $( this );
				self._animateCover( cover, 0, self._item);
			} );
		}

	});

	$( document ).bind("pagecreate", function ( e ) {
		$( e.target ).find(":jqmData(role='swipe')").swipe();
	});

}( jQuery ));


/*
* Module Name : widgets/jquery.mobile.tizen.tabbar
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/**
 *  Tabbar can be created using data-role = "tabbar" inside footer
 *  Framework determine which tabbar will display with tabbar attribute
 *
 * Examples:
 *
 *     HTML markup for creating tabbar: ( 2 ~ 5 li item available )
 *     icon can be changed data-icon attribute (customized icon need)
 *         <div data-role="footer" data-position ="fixed">
 *              <div data-role="tabbar">
 *                     <ul>
 *                            <li><a href="#" class="ui-btn-active">Menu</a></li>
 *                            <li><a href="#">Save</a></li>
 *                            <li><a href="#">Share</a></li>
 *                     </ul>
 *             </div>
 *      </div>
*/

(function ( $, undefined ) {

	$.widget( "tizen.tabbar", $.mobile.widget, {
		options: {
			/**
			 * Icons position
			 * @type {string}
			 */
			iconpos: "top",

			/**
			 * Gridd type
			 * @type {string|null}
			 */
			grid: null,

			/**
			 * Default visible elements in tabbar
			 * @type {number}
			 */
			defaultList : 4,

			/**
			 * The selector which indicates Tabbar class in DOM
			 * @type {string}
			 */
			initSelector: ":jqmData(role='tabbar')"
		},

		/**
		 * Creates the whole widget, addes dom and binds event
		 * @private
		 */
		_create: function () {

			var $tabbar = this.element,
				$tabbtns,
				textpos,
				iconpos,
				theme = $.mobile.listview.prototype.options.theme,	/* Get current theme */
				ww = window.innerWidth || $( window ).width(),
				wh = window.innerHeight || $( window ).height(),
				tabbarDividerLeft = "<div class='ui-tabbar-divider ui-tabbar-divider-left'></div>",
				tabbarDividerRight = "<div class='ui-tabbar-divider ui-tabbar-divider-right'></div>",
				isLandscape;

			isLandscape = ww > wh && ( ww - wh );

			if ( isLandscape ) {
				$tabbar.removeClass( "ui-portrait-tabbar" ).addClass( "ui-landscape-tabbar" );
			} else {
				$tabbar.removeClass( "ui-landscape-tabbar" ).addClass( "ui-portrait-tabbar" );
			}

			if ( $tabbar.find( "a" ).length ) {
				$tabbtns = $tabbar.find( "a" );
				iconpos = $tabbtns.filter( ":jqmData(icon)" ).length ? this.options.iconpos : undefined;
				textpos = $tabbtns.html().length ? true : false;
			}

			if ( $tabbar.parents( ".ui-header" ).length && $tabbar.parents( ".ui-scrollview-view" ).length ) {
				$tabbar.find( "li" ).addClass( "tabbar-scroll-li" );
				$tabbar.find( "ul" ).addClass( "tabbar-scroll-ul" );

				/* add shadow divider */
				$( tabbarDividerLeft ).appendTo( $tabbar.parents( ".ui-scrollview-clip" ) );
				$( tabbarDividerRight ).appendTo( $tabbar.parents( ".ui-scrollview-clip" ) );

				$( ".ui-tabbar-divider-left" ).hide();
				$( ".ui-tabbar-divider-right" ).hide();

				/* add width calculation*/
				if ( $tabbar.parents( ".ui-scrollview-view" ).data("default-list") ) {
					this.options.defaultList = $tabbar.parents( ".ui-scrollview-view" ).data( "default-list" );
				}
				$tabbar.find( "li" ).css( "width", window.innerWidth / this.options.defaultList + "px" );
			} else {
				if ( $tabbar.find( "ul" ).children().length ) {
					$tabbar.addClass( "ui-navbar" )
						.find( "ul" )
						.grid( { grid: this.options.grid } );
				}
			}

			if ( $tabbar.parents( ".ui-footer" ).length  ) {
				$tabbar.find( "li" ).addClass( "ui-tab-btn-style" );
			}

			/* title tabbar */
			if ( $tabbar.siblings( ".ui-title" ).length ) {
				$tabbar.parents( ".ui-header" ).addClass( "ui-title-tabbar" );
			}

			if ( !iconpos ) {
				$tabbar.addClass( "ui-tabbar-noicons" );
			}
			if ( !textpos ) {
				$tabbar.addClass( "ui-tabbar-notext" );
			}
			if ( textpos && iconpos ) {
				$tabbar.parents( ".ui-header" ).addClass( "ui-title-tabbar-multiline" );
			}

			if ( $tabbar.find( "a" ).length ) {
				$tabbtns.buttonMarkup({
					corners:	false,
					shadow:		false,
					iconpos:	iconpos
				});
			}

			if ( $tabbar.find( ".ui-state-persist" ).length ) {
				$tabbar.addClass( "ui-tabbar-persist" );
			}

			$tabbar.delegate( "a", "vclick", function ( event ) {
                                if ( $tabbtns.parents( "ul" ).is( ".tabbar-scroll-ul" ) ) {
                                        $tabbtns.removeClass( "ui-tabbar-active" );
                                        $( event.target ).parents( "a" ).addClass( "ui-tabbar-active" );

                                } else {
					$tabbtns.not( ".ui-state-persist" ).removeClass( $.mobile.activeBtnClass );
					$( this ).addClass( $.mobile.activeBtnClass );
				}
			});

			$tabbar.addClass( "ui-tabbar");

			$( document ).bind( "pagebeforeshow", function ( event, ui ) {
				var footer_filter = $( event.target ).find( ":jqmData(role='footer')" ),
					tabbar_filter = footer_filter.find( ":jqmData(role='tabbar')" ),
					$elFooterMore = tabbar_filter.siblings( ":jqmData(icon='naviframe-more')" ),
					$elFooterBack = tabbar_filter.siblings( ".ui-btn-back" );

				footer_filter
					.css( "position", "fixed" )
					.css( "bottom", 0 )
					.css( "height", tabbar_filter.height() );
				if ( $elFooterMore.length ) {
					tabbar_filter.addClass( "ui-tabbar-margin-more" );
				}
				if ( $elFooterBack.length ) {
					tabbar_filter.addClass( "ui-tabbar-margin-back" );
				}
			});

			$tabbar.bind( "touchstart vmousedown", function ( e ) {
				var $tabbarScroll = $( e.target ).parents( ".ui-scrollview-view" );
				if ( $tabbarScroll.offset() ) {
					if ( $tabbarScroll.offset().left < 0 ) {
						$( ".ui-tabbar-divider-left" ).show();
					} else {
						$( ".ui-tabbar-divider-left" ).hide();
					}
					if ( ( $tabbarScroll.width() - $tabbarScroll.parents( ".ui-scrollview-clip" ).width() ) ==  Math.abs( $tabbarScroll.offset().left ) ) {
						$( ".ui-tabbar-divider-right" ).hide();
					} else {
						$( ".ui-tabbar-divider-right" ).show();
					}
				}
			});

			$tabbar.bind( "touchend vmouseup", function ( e ) {
				$( ".ui-tabbar-divider" ).hide();
			});

			this._bindTabbarEvents();
			this._initTabbarAnimation();
		},

		_initTabbarAnimation: function () {
			var isScrollingStart = false,
				isScrollingEnd = false;
			$( document ).bind( "scrollstart.tabbar", function ( e ) {
				if ( $( e.target ).find( ".ui-tabbar" ).length ) {
					isScrollingStart = true;
					isScrollingEnd = false;
				}
			});

			$( document ).bind( "scrollstop.tabbar", function ( e ) {
				var $tabbarScrollview = $( e.target ),
					$elTabbar = $( e.target ).find( ".ui-tabbar" ),
					$elTabbarLI = $( e.target ).find( ".ui-tabbar li" ),
					$minElement = $elTabbarLI.eq( 0 ),
					minElementIndexVal,
					minElementIndex = -1;

				isScrollingEnd = true;
				if ( $elTabbar.length && isScrollingStart == true ) {
					minElementIndexVal = Math.abs( $elTabbarLI.eq( 0 ).offset().left );
					$elTabbarLI.each( function ( i ) {
						var offset	= $elTabbarLI.eq( i ).offset();

						if ( Math.abs( offset.left ) < minElementIndexVal ) {
							minElementIndexVal = Math.abs( offset.left );
							minElementIndex = i;
							$minElement = $elTabbarLI.eq( i );
						}
					});

					if ( $tabbarScrollview.length && isScrollingStart == isScrollingEnd && minElementIndex != -1) {
						isScrollingStart = false;
						$tabbarScrollview.scrollview( "scrollTo", -( window.innerWidth / $elTabbar.data( "defaultList" ) * minElementIndex ) , 0, 357);
					}
				}

				$( ".ui-tabbar-divider-left" ).hide();
				$( ".ui-tabbar-divider-right" ).hide();
			});
		},

		/**
		 * Binds tabbar to events (like orientation changes)
		 * @private
		 */
		_bindTabbarEvents: function () {
			var $tabbar = this.element;

			$( window ).bind( "orientationchange", function ( e, ui ) {
				var ww = window.innerWidth || $( window ).width(),
					wh = window.innerHeight || $( window ).height(),
					isLandscape = ww > wh && ( ww - wh );

				if ( isLandscape ) {
					$tabbar.removeClass( "ui-portrait-tabbar" ).addClass( "ui-landscape-tabbar" );
				} else {
					$tabbar.removeClass( "ui-landscape-tabbar" ).addClass( "ui-portrait-tabbar" );
				}
			});
		},

		/**
		 * Sets tabbar elements disabled and aria-disabled attributes according
		 * to specified value
		 * @private
		 * @param {string} value
		 * @param {number} cnt the element index
		 */
		_setDisabled: function ( value, cnt ) {
			this.element.find( "li" ).eq( cnt ).attr( "disabled", value );
			this.element.find( "li" ).eq( cnt ).attr( "aria-disabled", value );
		},

		/**
		 * Disables specified element in tabbar
		 * @param {number} cnt the element index
		 */
		disable: function ( cnt ) {
			this._setDisabled( true, cnt );
			this.element.find( "li" ).eq( cnt ).addClass( "ui-disabled" );
		},

		/**
		 * Enables specified element in tabbar
		 * @param {number} cnt the element index
		 */
		enable: function ( cnt ) {
			this._setDisabled( false, cnt );
			this.element.find( "li" ).eq( cnt ).removeClass( "ui-disabled" );
		}
	});

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.tabbar.prototype.options.initSelector, e.target ).tabbar();
	});
}( jQuery ) );


/*
* Module Name : widgets/jquery.mobile.tizen.triangle
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

( function ($, undefined) {

	$.widget( "tizen.triangle", $.tizen.widgetex, {
		options: {
			extraClass: "",
			offset: null,
			color: null,
			location: "top",
			initSelector: ":jqmData(role='triangle')"
		},

		_create: function () {
			var triangle = $( "<div></div>", {"class" : "ui-triangle"} );

			$.extend(this, {
				_triangle: triangle
			});

			this.element.addClass( "ui-triangle-container" ).append( triangle );
		},

		_doCSS: function () {
			var location = ( this.options.location || "top" ),
				offsetCoord = ( ($.inArray(location, ["top", "bottom"]) === -1) ? "top" : "left"),
				cssArg = {
					"border-bottom-color" : "top"    === location ? this.options.color : "transparent",
					"border-top-color"    : "bottom" === location ? this.options.color : "transparent",
					"border-left-color"   : "right"  === location ? this.options.color : "transparent",
					"border-right-color"  : "left"   === location ? this.options.color : "transparent"
				};

			cssArg[offsetCoord] = this.options.offset;

			this._triangle.removeAttr( "style" ).css( cssArg );
		},

		_setOffset: function ( value ) {
			this.options.offset = value;
			this.element.attr( "data-" + ($.mobile.ns || "") + "offset", value );
			this._doCSS();
		},

		_setExtraClass: function ( value ) {
			this._triangle.addClass( value );
			this.options.extraClass = value;
			this.element.attr( "data-" + ($.mobile.ns || "") + "extra-class", value );
		},

		_setColor: function ( value ) {
			this.options.color = value;
			this.element.attr( "data-" + ($.mobile.ns || "") + "color", value );
			this._doCSS();
		},

		_setLocation: function ( value ) {
			this.element
				.removeClass( "ui-triangle-container-" + this.options.location )
				.addClass( "ui-triangle-container-" + value );
			this._triangle
				.removeClass( "ui-triangle-" + this.options.location )
				.addClass( "ui-triangle-" + value );

			this.options.location = value;
			this.element.attr( "data-" + ($.mobile.ns || "") + "location", value );

			this._doCSS();
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
	    $($.tizen.triangle.prototype.options.initSelector, e.target)
	        .not(":jqmData(role='none'), :jqmData(role='nojs')")
	        .triangle();
	});

}(jQuery) );


/*
* Module Name : widgets/jquery.mobile.tizen.popupwindow
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/*
 * % Popupwindow widget do not use anymore(will be deprecated, internal use only)
 *
 *
 * Shows other elements inside a popup window.
 *
 * To apply, add the attribute data-role="popupwindow" to a <div> element inside
 * a page. Alternatively, call popupwindow()
 * on an element, eg :
 *
 *     $("#mypopupwindowContent").popupwindow();
 * where the html might be :
 *     <div id="mypopupwindowContent"></div>
 *
 * To trigger the popupwindow to appear, it is necessary to make a call to its
 * 'open()' method. This is typically done by binding a function to an event
 * emitted by an input element, such as a the clicked event emitted by a button
 * element. The open() method takes two arguments, specifying the x and y
 * screen coordinates of the center of the popup window.

 * You can associate a button with a popup window like this:
 *      <div id="mypopupContent" style="display: table;" data-role="popupwindow">
 *          <table>
 *              <tr> <td>Eenie</td>   <td>Meenie</td>  <td>Mynie</td>   <td>Mo</td>  </tr>
 *              <tr> <td>Catch-a</td> <td>Tiger</td>   <td>By-the</td>  <td>Toe</td> </tr>
 *              <tr> <td>If-he</td>   <td>Hollers</td> <td>Let-him</td> <td>Go</td>  </tr>
 *              <tr> <td>Eenie</td>   <td>Meenie</td>  <td>Mynie</td>   <td>Mo</td>  </tr>
 *          </table>
 *      </div>
 * <a href="#myPopupContent" data-rel="popupwindow" data-role="button">Show popup</a>
 *
 * Options:
 *
 *     theme: String; the theme for the popupwindow contents
 *                   Default: null
 *
 *     overlayTheme: String; the theme for the popupwindow
 *                   Default: null
 *
 *     shadow: Boolean; display a shadow around the popupwindow
 *             Default: true
 *
 *     corners: Boolean; display a shadow around the popupwindow
 *             Default: true
 *
 *     fade: Boolean; fades the opening and closing of the popupwindow
 *
 *     transition: String; the transition to use when opening or closing
 *                 a popupwindow
 *                 Default: $.mobile.defaultDialogTransition
 *
 * Events:
 *	popupbeforeposition: triggered after a popup has completed preparations for opening, but has not yet opened
 *	popupafteropen: triggered after a popup has completely opened
 *	popupafterclose triggered when a popup has completely closed
*/

/**
	class Popupwindow
	The pop-up widget shows a list of items in a pop-up window in the middle of the screen. It automatically optimizes the pop-up window size within the screen.
	To add a pop-up widget to the application, use the following code:

		// Basic pop-up
		<div id="center_info" data-role="popup" data-style="center_info">
			<div data-role="text">
				<p>
				Pop-up dialog box, a child window that blocks user interaction in the parent window
				</p>
			</div>
		</div>
		// Pop-up with a title and button
		<div id="center_title_1btn" data-role="popup" data-style="center_title_1btn">
			<p data-role="title">
				Pop-up title
			</p>
			<p data-role="text">
				Pop-up dialog box
			</p>
		<div data-role="button-bg">
			<input type="button" value="Text Button" />
		</div>
		</div>

	The pop-up can define callbacks for events as described in the jQueryMobile documentation for pop-up events. <br/>You can use methods with the pop-up as described in the jQueryMobile documentation for pop-up methods.

	@deprecated 2.0 verisons
*/

/**
	@property {String} data-style
	Defines the pop-up window style.
	The following styles are available:

	center_info: basic pop-up message
	center_title: pop-up message with a title
	center_basic_1btn: pop-up message with 1 button
	center_basic_2btn: pop-up message with 2 horizontal buttons
	center_title_1btn: pop-up message with a title and 1 button
	center_title_2btn: pop-up message with a title and 2 horizontal buttons
	center_title_3btn: pop-up message with a title and 3 horizontal buttons
	center_button_vertical: pop-up message with vertical buttons
	center_checkbox: pop-up message with a check box
	center_liststyle_1btn>: pop-up message with a list and 1 button
	center_liststyle_2btn: pop-up message with a list and 2 horizontal buttons
	center_liststyle_3btn: pop-up message with a list and 3 horizontal buttons
*/

(function ( $, undefined ) {
	if ( !$.mobile.popupwindow ) {
		$.mobile.popupwindow = {};
	}
	$.widget( "tizen.popupwindow", $.tizen.widgetex, {
		options: {
			theme: null,
			overlayTheme: "s",
			style: "custom",
			disabled: false,
			shadow: true,
			corners: true,
			fade: false,
			opacity: 0.7,
			widthRatio: 0.8612,
			transition: $.mobile.defaultDialogTransition,
			initSelector: ":jqmData(role='popupwindow')"
		},

		_htmlProto: {
source:

 [ "<div><div>" ,
  "    <div id='popupwindow-screen' class='ui-selectmenu-screen ui-screen-hidden ui-popupwindow-screen'></div>" ,
  "    <div id='popupwindow-container' class='ui-popupwindow ui-popupwindow-padding ui-selectmenu-hidden ui-overlay-shadow ui-corner-all'></div>" ,
  "</div>" ,
  "</div>" ].join("")
,			ui: {
				screen: "#popupwindow-screen",
				container: "#popupwindow-container"
			}
		},

		_setStyle: function () {
			var popup = this.element,
				style = popup.attr( 'data-style' );

			if ( style ) {
				this.options.style = style;
			}

			popup.addClass( this.options.style );
			popup.find( ":jqmData(role='title')" )
					.wrapAll( "<div class='popup-title'></div>" );
			popup.find( ":jqmData(role='text')" )
					.wrapAll( "<div class='popup-text'></div>" );
			popup.find( ":jqmData(role='button-bg')" )
					.wrapAll( "<div class='popup-button-bg'></div>" );
			popup.find( ":jqmData(role='check-bg')" )
					.wrapAll( "<div class='popup-check-bg'></div>" );
			popup.find( ":jqmData(role='scroller-bg')" )
					.addClass( "popup-scroller-bg" );
			popup.find( ":jqmData(role='text-bottom-bg')" )
					.wrapAll( "<div class='popup-text-bottom-bg'></div>" );
			popup.find( ":jqmData(role='text-left')" )
					.wrapAll( "<div class='popup-text-left'></div>" );
			popup.find( ":jqmData(role='text-right')" )
					.wrapAll( "<div class='popup-text-right'></div>" );
			popup.find( ":jqmData(role='progress-bg')" )
					.wrapAll( "<div class='popup-progress-bg'></div>" );
		},

		_create: function () {
			console.warn("popupwindow() was deprecated. use popup() instead.");
			var thisPage = this.element.closest(":jqmData(role='page')"),
				self = this;

			if ( thisPage.length === 0 ) {
				thisPage = $("body");
			}

			this._ui.placeholder =
					$( "<div><!-- placeholder for " + this.element.attr("id") + " --></div>" )
					.css("display", "none")
					.insertBefore( this.element );

			thisPage.append( this._ui.screen );
			this._ui.container.insertAfter( this._ui.screen );
			this._ui.container.append( this.element );

			this._setStyle();

			this._isOpen = false;

			this._ui.screen.bind( "vclick", function ( e ) {
				self.close();
				return false;
			} );
		},

		destroy: function () {
			if(this._ui.placeholder.parent().get(0)) {
				this.element.insertBefore( this._ui.placeholder );
			} else {
				// if removed placeholder tag when popupwindow opened,
				// then popupwindow element append to body.
				this.element.appendTo(document.body);
			}

			this._ui.placeholder.remove();
			this._ui.container.remove();
			this._ui.screen.remove();
			this.element.triggerHandler("destroyed");
			delete this._callback;
			$.Widget.prototype.destroy.call( this );
		},

		_placementCoords: function ( x, y, cw, ch ) {
			var screenHeight = $( window ).height(),
				screenWidth = $( window ).width(),
				halfheight = ch / 2,
				maxwidth = parseFloat( this._ui.container.css( "max-width" ) ),
				roomtop = y,
				roombot = screenHeight - y,
				newtop,
				newleft;

			if ( roomtop > ch / 2 && roombot > ch / 2 ) {
				newtop = y - halfheight;
			} else {
				newtop = roomtop > roombot ? screenHeight - ch - 30 : 30;
			}

			if ( cw < maxwidth ) {
				newleft = ( screenWidth - cw ) / 2;
			} else {
				newleft = x - cw / 2;

				if ( newleft < 10 ) {
					newleft = 10;
				} else if ( ( newleft + cw ) > screenWidth ) {
					newleft = screenWidth - cw - 10;
				}
			}

			return { x : newleft, y : newtop };
		},

		_setPosition: function ( x_where, y_where ) {
			var x = ( undefined === x_where ? $( window ).width()  / 2 : x_where ),
				y = ( undefined === y_where ? $( window ).height() / 2 : y_where ),
				coords,
				ctxpopup = this.element.data("ctxpopup"),
				popupWidth,
				menuHeight,
				menuWidth,
				screenHeight,
				screenWidth,
				roomtop,
				roombot,
				halfheight,
				maxwidth,
				newtop,
				newleft;

			if ( !ctxpopup ) {
				popupWidth = $( window ).width() * this.options.widthRatio;
				this._ui.container.css( "width", popupWidth );

				if ( this._ui.container.outerWidth() > $( window ).width() ) {
					this._ui.container.css( {"max-width" : $( window ).width() - 30} );
				}
			}

			coords = this._placementCoords( x, y,
					this._ui.container.outerWidth(),
					this._ui.container.outerHeight() );

			menuHeight = this._ui.container.innerHeight();
			menuWidth = this._ui.container.innerWidth();
			screenHeight = $( window ).height();
			screenWidth = $( window ).width();
			roomtop = y;
			roombot = screenHeight - y;
			halfheight = menuHeight / 2;
			maxwidth = parseFloat( this._ui.container.css( "max-width" ) );
			newtop = ( screenHeight - menuHeight ) / 2;

			if ( !maxwidth || menuWidth < maxwidth ) {
				newleft = ( screenWidth - menuWidth ) / 2;
			} else {
				newleft = x - menuWidth / 2;

				if ( newleft < 30 ) {
					newleft = 30;
				} else if ( ( newleft + menuWidth ) > screenWidth ) {
					newleft = screenWidth - menuWidth - 30;
				}
			}

			if ( ctxpopup ) {
				newtop = coords.y;
				newleft = coords.x;
			}

			this._ui.container.css({
				top: newtop,
				left: newleft
			});

			this._ui.screen.css( "height", screenHeight );
		},
		setPositionCB: function( callback ) {
			// This function is callback function regist
			this._callback = callback;
		},

		open: function ( x_where, y_where, backgroundclose ) {
			var self = this,
				zIndexMax = 0;

			if ( this._isOpen || this.options.disabled ) {
				return;
			}

			$( document ).find("*").each( function () {
				var el = $( this ),
					zIndex = parseInt( el.css("z-index"), 10 );

				if ( !( el.is( self._ui.container ) ||
						el.is( self._ui.screen ) ||
						isNaN( zIndex ))) {
					zIndexMax = Math.max( zIndexMax, zIndex );
				}
			} );

			this._ui.screen.css( "height", $( window ).height() );

			if ( backgroundclose ) {
				this._ui.screen.css( "opacity", 0 )
						.removeClass("ui-screen-hidden");
			} else {
				this._ui.removeClass("ui-screen-hidden");

				if ( this.options.fade ) {
					this._ui.screen.animate( {opacity: this.options.opacity}, "fast" );
				} else {
					this._ui.screen.css( {opacity: this.options.opacity} );
				}
			}

			this._setPosition( x_where, y_where );

			this.element.trigger("popupbeforeposition");

			this._ui.container
				.removeClass("ui-selectmenu-hidden")
				.addClass("in")
				.animationComplete( function () {
					self.element.trigger("popupafteropen");
				} );

			this._isOpen = true;
			// Keep the popupwindow object for hardwarekey support
			$.mobile.popupwindow.active = this;

			if ( !this._reflow ) {
				this._reflow = function () {
					if ( !self._isOpen ) {
						return;
					}
					if ( !self._callback ) {
						self._setPosition( x_where, y_where );
					} else {
						var _callback = self._callback();
						self._setPosition( _callback.x, _callback.y );
					}
				};

				$( window ).bind( "resize", this._reflow );
			}
		},

		close: function () {
			if ( !this._isOpen ) {
				return;
			}

			if ( this._reflow ) {
				$( window ).unbind( "resize", this._reflow );
				this._reflow = null;
			}

			var self = this,
				hideScreen = function () {
					self._ui.screen.addClass("ui-screen-hidden");
					self._isOpen = false;
					$.mobile.popupwindow.active = undefined;
				};

			this._ui.container.removeClass("in").addClass("reverse out");

			if ( this.options.transition === "none" ) {
				this._ui.container
					.addClass("ui-selectmenu-hidden")
					.removeAttr("style");
				this.element.trigger("popupafterclose");
			} else {
				this._ui.container.animationComplete( function () {
					self._ui.container
						.removeClass("reverse out")
						.addClass("ui-selectmenu-hidden")
						.removeAttr("style");
					self.element.trigger("popupafterclose");
				} );
			}

			if ( this.options.fade ) {
				this._ui.screen.animate( {opacity: 0}, "fast", hideScreen );
			} else {
				hideScreen();
			}
		},

		_realSetTheme: function ( dst, theme ) {
			var classes = ( dst.attr("class") || "" ).split(" "),
				alreadyAdded = true,
				currentTheme = null,
				matches;

			while ( classes.length > 0 ) {
				currentTheme = classes.pop();
				matches = currentTheme.match(/^ui-body-([a-z])$/);

				if ( matches && matches.length > 1 ) {
					currentTheme = matches[1];
					break;
				} else {
					currentTheme = null;
				}
			}

			dst.removeClass( "ui-body-" + currentTheme );
			if ( ( theme || "" ).match(/[a-z]/) ) {
				dst.addClass( "ui-body-" + theme );
			}
		},

		_setTheme: function ( value ) {
			this._realSetTheme( this.element, value );
			this.options.theme = value;
			this.element.attr( "data-" + ( $.mobile.ns || "" ) + "theme", value );
		},

		_setOverlayTheme: function ( value ) {
			this._realSetTheme( this._ui.container, value );
			this.options.overlayTheme = value;
			this.element.attr( "data-" + ( $.mobile.ns || "" ) + "overlay-theme", value );
		},

		_setShadow: function ( value ) {
			this.options.shadow = value;
			this.element.attr( "data-" + ( $.mobile.ns || "" ) + "shadow", value );
			this._ui.container[value ? "addClass" : "removeClass"]("ui-overlay-shadow");
		},

		_setCorners: function ( value ) {
			this.options.corners = value;
			this.element.attr( "data-" + ( $.mobile.ns || "" ) + "corners", value );
			this._ui.container[value ? "addClass" : "removeClass"]("ui-corner-all");
		},

		_setFade: function ( value ) {
			this.options.fade = value;
			this.element.attr( "data-" + ( $.mobile.ns || "" ) + "fade", value );
		},

		_setTransition: function ( value ) {
			this._ui.container
				.removeClass( this.options.transition || "" )
				.addClass( value );
			this.options.transition = value;
			this.element.attr( "data-" + ( $.mobile.ns || "" ) + "transition", value );
		},

		_setDisabled: function ( value ) {
			$.Widget.prototype._setOption.call( this, "disabled", value );
			if ( value ) {
				this.close();
			}
		}
	});

	$.tizen.popupwindow.bindPopupToButton = function ( btn, popup ) {
		if ( btn.length === 0 || popup.length === 0 ) {
			return;
		}

		var btnVClickHandler = function ( e ) {
			if ( !popup.jqmData("overlay-theme-set") ) {
				popup.popupwindow( "option", "overlayTheme", btn.jqmData("theme") );
			}

			popup.popupwindow( "open",
				btn.offset().left + btn.outerWidth()  / 2,
				btn.offset().top  + btn.outerHeight() / 2 );

			return false;
		};

		if ( ( popup.popupwindow("option", "overlayTheme") || "" ).match(/[a-z]/) ) {
			popup.jqmData( "overlay-theme-set", true );
		}

		btn
			.attr({
				"aria-haspopup": true,
				"aria-owns": btn.attr("href")
			})
			.removeAttr("href")
			.bind( "vclick", btnVClickHandler );

		popup.bind( "destroyed", function () {
			btn.unbind( "vclick", btnVClickHandler );
		} );
	};

	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.popupwindow.prototype.options.initSelector, e.target )
			.not(":jqmData(role='none'), :jqmData(role='nojs')")
			.popupwindow();

		$( "a[href^='#']:jqmData(rel='popupwindow')", e.target ).each( function () {
			$.tizen.popupwindow.bindPopupToButton( $( this ), $( $( this ).attr("href") ) );
		});
	});
}( jQuery ));


/*
* Module Name : widgets/jquery.mobile.tizen.popupwindow.ctxpopup
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/*
 * % ContextPopup widget do not use anymore(will be deprecated, internal use only)
 */
// This widget is implemented in an extremely ugly way. It should derive from $.tizen.popupwindow, but it doesn't
// because there's a bug in jquery.ui.widget.js which was fixed in jquery-ui commit
// b9153258b0f0edbff49496ed16d2aa93bec07d95. Once a version of jquery-ui containing that commit is released
// (probably >= 1.9m5), and jQuery Mobile picks up the widget from there, this widget needs to be rewritten properly.
// The problem is that, when a widget inherits from a superclass and declares an object in its prototype identical in key
// to one in the superclass, upon calling $.widget the object is overwritten in both the prototype of the superclass and
// the prototype of the subclass. The prototype of the superclass should remain unchanged.

/**
	class ContextPopup
		The context pop-up widget shows a list of options and automatically optimizes its size within the screen. This widget is intended for a small list of options for a larger list, use the List widget. <br/>The context pop-up widget requires a target button, which must be clicked to open the context pop-up. In the default application theme, an arrow pointer is displayed at the top-left corner of the context pop-up widget when it is opened.<br/><br/> To add a context pop-up widget to the application, use the following code:

			// Target button
			<a href="#pop_3_icons" id="btn_3_icons" data-role="button" data-inline="true" data-rel="popupwindow">3 Icons</a>
			// Context pop-up
				<div class="horizontal" id="pop_3_icons" data-role="popupwindow" data-show-arrow="true">
				<ul>
					<li class="icon">
						<a href="#" data-role="button" data-icon="call"></a>
					</li>
					<li class="icon">
						<a href="#" data-role="button" data-icon="favorite"></a>
					</li>
					<li class="text">
						<a href="#">Function</a>
					</li>
				</ul>
			</div>
	The context pop-up can define callbacks for events as described in the [jQueryMobile documentation for pop-up events.][1]
	You can use methods with the context pop-up as described in the [jQueryMobile documentation for pop-up methods.][2]
	[1]: http://jquerymobile.com/demos/1.2.0-alpha.1/docs/pages/popup/events.html
	[2]: http://jquerymobile.com/demos/1.2.0-alpha.1/docs/pages/popup/methods.html

	@deprecated 2.0 verisons
*/

(function ( $, undefined ) {
	$.widget( "tizen.ctxpopup", $.tizen.widgetex, {
		options: $.extend( {}, $.tizen.popupwindow.prototype.options, {
			initSelector: ":jqmData(show-arrow)"
		} ),

		_htmlProto: {
source:

 [ "<div><div id='outer' class='ui-ctxpopup'>" ,
  "    <div id='top' class='ui-ctxpopup-row' data-role='triangle' data-location='top'></div>" ,
  "    <div class='ui-ctxpopup-row'>" ,
  "        <div id='left' class='ui-ctxpopup-cell' data-role='triangle' data-location='left'></div>" ,
  "        <div id='container' class='ui-ctxpopup-cell'></div>" ,
  "        <div id='right' class='ui-ctxpopup-cell' data-role='triangle' data-location='right'></div>" ,
  "    </div>" ,
  "    <div id='bottom' class='ui-ctxpopup-row' data-role='triangle' data-location='bottom'></div>" ,
  "</div>" ,
  "</div>" ].join("")
,			ui: {
				outer		: "#outer",
				container	: "#container", // the key has to have the name "container"
				arrow		: {
					all		: ":jqmData(role='triangle')",
					l		: "#left",
					t		: "#top",
					r		: "#right",
					b		: "#bottom"
				}
			}
		},

		_create: function () {
			console.warn("ctxpopup() was deprecated. use popup() instead.");
			if ( !this.element.data( "popupwindow" ) ) {
				this.element.popupwindow();
			}

			this.element.data( "popupwindow" )
				._ui.container
				.removeClass( "ui-popupwindow-padding" )
				.append( this._ui.outer );
			this._ui.outer.trigger( "create" ); // Creates the triangle widgets
			this._ui.container
				.addClass( "ui-popupwindow-padding" )
				.append( this.element );
		},

		_setOption: function ( key, value ) {
			$.tizen.popupwindow.prototype._setOption.apply( this.element.data( "popupwindow" ), arguments );
			this.options[key] = value;
		}
	} );

	var origOpen = $.tizen.popupwindow.prototype.open,
		orig_setOption = $.tizen.popupwindow.prototype._setOption,
		orig_placementCoords = $.tizen.popupwindow.prototype._placementCoords;

	$.tizen.popupwindow.prototype._setOption = function ( key, value ) {
		var ctxpopup = this.element.data( "ctxpopup" ),
			needsApplying = true,
			origContainer;
		if ( ctxpopup ) {
			if ( "shadow" === key || "overlayTheme" === key || "corners" === key ) {
				origContainer = this._ui.container;

				this._ui.container = ctxpopup._ui.container;
				orig_setOption.apply( this, arguments );
				this._ui.container = origContainer;
				needsApplying = false;
			}
			ctxpopup.options[key] = value;
		}

		if ( needsApplying ) {
			orig_setOption.apply(this, arguments);
		}
	};

	$.tizen.popupwindow.prototype._placementCoords = function ( x, y, cx, cy ) {
		var ctxpopup = this.element.data( "ctxpopup" ),
			self = this,
			coords = {},
			minDiff,
			minDiffIdx;

		function getCoords( arrow, x_factor, y_factor ) {
			// Unhide the arrow we want to test to take it into account
			ctxpopup._ui.arrow.all.hide();
			ctxpopup._ui.arrow[arrow].show();

			var isHorizontal = ( "b" === arrow || "t" === arrow ),
			// Names of keys used in calculations depend on whether things are horizontal or not
				coord = ( isHorizontal
						? { point: "x", size: "cx", beg: "left", outerSize: "outerWidth",  niceSize: "width", triangleSize : "height" }
						: { point: "y", size: "cy", beg: "top",  outerSize: "outerHeight", niceSize: "height", triangleSize : "width" } ),
				size = {
					cx : self._ui.container.width(),
					cy : self._ui.container.height()
				},
				halfSize = {
					cx : size.cx / 2,
					cy : size.cy / 2
				},
				desired = {
					"x" : x + halfSize.cx * x_factor,
					"y" : y + halfSize.cy * y_factor
				},
				orig = orig_placementCoords.call( self, desired.x, desired.y, size.cx, size.cy ),

			// The triangleOffset must be clamped to the range described below:
			//
			//                          +-------...
			//                          |   /\
			//                          |  /  \
			//                   ----+--+-,-----...
			//lowerDiff       -->____|  |/ <-- possible rounded corner
			//triangle size   -->    | /|
			//                   ____|/ |
			//                    ^  |\ | <-- lowest possible offset for triangle
			// actual range of    |  | \| 
			// arrow offset       |  |  | 
			// values due to      |  .  . Payload table cell looks like
			// possible rounded   |  .  . a popup window, and it may have
			// corners and arrow  |  .  . arbitrary things like borders,
			// triangle size -    |  |  | shadows, and rounded corners.
			// our clamp range    |  | /|
			//                   _v__|/ |
			//triangle size   -->    |\ | <-- highest possible offset for triangle
			//                   ____| \|
			//upperDiff       -->    |  |\ <-- possible rounded corner
			//                   ----+--+-'-----...
			//                          |  \  /
			//                          |   \/
			//                          +-------...
			//
			// We calculate lowerDiff and upperDiff by considering the offset and width of the payload (this.element)
			// versus the offset and width of the element enclosing the triangle, because the payload is inside
			// whatever decorations (such as borders, shadow, rounded corners) and thus can give a reliable indication
			// of the thickness of the combined decorations

				arrowBeg = ctxpopup._ui.arrow[arrow].offset()[coord.beg],
				arrowSize = ctxpopup._ui.arrow[arrow][coord.outerSize]( true ),
				payloadBeg = self.element.offset()[coord.beg],
				payloadSize = self.element[coord.outerSize]( true ),
				triangleSize = ctxpopup._ui.arrow[arrow][coord.triangleSize](),
				triangleOffset,
				finalposition,
				ret;
			if (isHorizontal) {
				orig.x = 0;
			} else {
				orig.y = 0;
			}
			if (arrow == 'b' && self._target_height) {
				orig.y -= self._target_height;
			}
			if (arrow == 'r' && self._target_width) {
				orig.x -= self._target_width;
			}
			triangleOffset =
				Math.max(
					triangleSize // triangle size
						+ Math.max( 0, payloadBeg - arrowBeg ), // lowerDiff
					Math.min(
							arrowSize // bottom
								- triangleSize // triangle size
								- Math.max( 0, arrowBeg + arrowSize - ( payloadBeg + payloadSize ) ), // upperDiff
							arrowSize / 2 // arrow unrestricted offset
								+ desired[coord.point]
								- orig[coord.point]
								- halfSize[coord.size]
						)
				);
					// Triangle points here
			finalposition = {
				"x": orig.x + ( isHorizontal ? triangleOffset : 0) + ("r" === arrow ? size.cx : 0),
				"y": orig.y + (!isHorizontal ? triangleOffset : 0) + ("b" === arrow ? size.cy : 0)
			};
			ret = {
				actual			: orig,
				triangleOffset	: triangleOffset,
				absDiff			: Math.abs( x - finalposition.x ) + Math.abs( y - finalposition.y )
			};

			// Hide it back
			ctxpopup._ui.arrow[arrow].hide();

			return ret;
		}

		if ( ctxpopup ) {
			// Returns:
			// {
			//    absDiff: int
			//    triangleOffset: int
			//    actual: { x: int, y: int }
			// }

			coords = {
				l : getCoords( "l", 1, 0 ),
				r : getCoords( "r", -1, 0 ),
				t : getCoords( "t", 0, 1 ),
				b : getCoords( "b", 0, -1 )
			};

			$.each( coords, function ( key, value ) {
				if ( minDiff === undefined || value.absDiff < minDiff ) {
					minDiff = value.absDiff;
					minDiffIdx = key;
				}
			} );

			// Side-effect: show the appropriate arrow and move it to the right offset
			ctxpopup._ui.arrow[minDiffIdx]
				.show()
				.triangle( "option", "offset", coords[minDiffIdx].triangleOffset );
			this.element.parents( ".ui-popupwindow" ).addClass( "ui-arrow-" + minDiffIdx );
			return coords[minDiffIdx].actual;
		}

		return orig_placementCoords.call( this, x, y, cx, cy );
	};

	$.tizen.popupwindow.prototype.open = function ( x, y, target_width, target_height ) {
		var ctxpopup = this.element.data( "ctxpopup" );

		this._target_width = target_width;
		this._target_height = target_height;

		if ( ctxpopup ) {
			this._setFade( false );
			this._setShadow( false );
			this._setCorners( false );
			this._setOverlayTheme( null );
			this._setOption( "overlayTheme", ctxpopup.options.overlayTheme );
			ctxpopup._ui.arrow.all.triangle( "option", "color", ctxpopup._ui.container.css( "background-color" ) );

			// temporary
			$( '.ui-popupwindow' ).css( 'background', 'none' );
		}

		origOpen.call( this, x, y, true );
	};

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		var ctxpopups = $( $.tizen.ctxpopup.prototype.options.initSelector, e.target );
		$.tizen.ctxpopup.prototype.enhanceWithin( e.target );
	} );
}( jQuery ) );


/*
* Module Name : widgets/jquery.mobile.tizen.datetimepicker
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

/*global Globalize:false, range:false, regexp:false*/
/**
 * datetimepicker is a widget that lets the user select a date and/or a 
 * time. If you'd prefer use as auto-initialization of form elements, 
 * use input elements with type=date/time/datetime within form tag
 * as same as other form elements.
 * 
 * HTML Attributes:
 * 
 *	data-role: 'datetimepicker'
 *	data-format: date format string. e.g) "MMM dd yyyy, HH:mm"
 *	type: 'date', 'datetime', 'time'
 *	value: pre-set value. only accepts ISO date string. e.g) "2012-05-04", "2012-05-04T01:02:03+09:00" 
 *	data-date: any date/time string "new Date()" accepts.
 *
 * Options:
 *	type: 'date', 'datetime', 'time'
 *	format: see data-format in HTML Attributes.
 *	value: see value in HTML Attributes.
 *	date: preset value as JavaScript Date Object representation.
 *
 * APIs:
 *	value( datestring )
 *		: Set date/time to 'datestring'.
 *	value()
 *		: Get current selected date/time as W3C DTF style string.
 *	getValue() - replaced with 'value()'
 *		: same as value()
 *	setValue( datestring ) - replaced with 'value(datestring)'
 *		: same as value( datestring )
 *	changeTypeFormat( type, format ) - deprecated
 *		: Change Type and Format options. use datetimepicker( "option", "format" ) instead
 *
 * Events:
 *	date-changed: Raised when date/time was changed. Date-changed event will be deprecated
 *
 * Examples:
 *	<ul data-role="listview">
 *		<li class="ui-li-3-2-2">
 *			<span class="ui-li-text-main">
 *				<input type="datetime" name="demo-date" id="demo-date" 
 *					data-format="MMM dd yyyy hh:mm tt"/>
 *			</span>
 *			<span class="ui-li-text-sub">
 *				Date/Time Picker - <span id="selected-date1"><em>(select a date first)</em></span>
 *			</span>
 *		</li>
 *		<li class="ui-li-3-2-2">
 *			<span class="ui-li-text-main">
 *				<input type="date" name="demo-date2" id="demo-date2"/>
 *			</span>
 *			<span class="ui-li-text-sub">
 *				Date Picker  - <span id="selected-date2"><em>(select a date first)</em></span>
 *			</span>
 *		</li>
 *		<li class="ui-li-3-2-2">
 *			<span class="ui-li-text-main">
 *				<input type="time" name="demo-date3" id="demo-date3"/>
 *			</span>
 *			<span class="ui-li-text-sub">
 *				Time Picker - <span id="selected-date3"><em>(select a date first)</em></span>
 *			</span>
 *		</li>
 *	</ul>
 * How to get a return value:
 * ==========================
 * Bind to the 'date-changed' event, e.g.:
 *    $("#myDatetimepicker").bind("change", function() {
 *			// your code
 *    });
 */

/**
	@class DateTimePicker
	The picker widgets show a control that you can use to enter date and time values. <br/> To add a date time picker widget to the application, use the following code:

			<li class="ui-li-dialogue ui-datetime">
				<div class="ui-datetime-text-main">
					<input type="datetime" data-format="MMM dd yyyy hh:mm:ss" name="demo-date" id="demo-date" />
				</div>
				<div class="ui-li-text-sub">Date/Time Picker
					<span id="selected-date1"><em>(select a date first)</em></span>
				</div>
			</li>
*/


( function ( $, window, undefined ) {
	$.widget( "tizen.datetimepicker", $.tizen.widgetex, {

		options: {
			type: null, // date, time, datetime applicable
			format: null,
			date: null,
			initSelector: "input[type='date'], input[type='datetime'], input[type='time'], :jqmData(role='datetimepicker')"
		},

		container : null,

		_calendar: function () {
			return Globalize.culture().calendars.standard;
		},

		_value: {
			attr: "data-" + ( $.mobile.ns || "" ) + "date",
			signal: "date-changed"
		},

		_daysInMonth: [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],

		_isLeapYear: function ( year ) {
			return year % 4 ? 0 : ( year % 100 ? 1 : ( year % 400 ? 0 : 1 ) );
		},

		_makeTwoDigits: function ( val ) {
			var ret = val.toString(10);
			if ( val < 10 ) {
				ret = "0" + ret;
			}
			return ret;
		},

		_setType: function ( type ) {
			//datetime, date, time
			switch (type) {
			case 'datetime':
			case 'date':
			case 'time':
				this.options.type = type;
				break;
			default:
				this.options.type = 'datetime';
				break;
			}

			this.element.attr( "data-" + ( $.mobile.ns ? $.mobile.ns + "-" : "" ) + "type", this.options.type );
			return this.options.type;
		},

		_setFormat: function ( format ) {
			if ( this.options.format != format ) {
				this.options.format = format;
			} else {
				return;
			}

			this.ui.children().remove();

			var token = this._parsePattern( format ),
				div = document.createElement('div'),
				pat,
				tpl,
				tpl2,
				period,
				btn,
				obj = this;

			while ( token.length > 0 ) {
				pat = token.shift();
				tpl = '<span class="ui-btn-picker ui-datefield-%1"' +
					'data-role="button" data-inline="true" data-pat="' + pat + '">%2</span>';
				tpl2= '<span class="ui-datefield-%1" data-pat="' + pat + '">%2</span>';
				switch ( pat ) {
				case 'H': //0 1 2 3 ... 21 22 23
				case 'HH': //00 01 02 ... 21 22 23
				case 'h': //0 1 2 3 ... 11 12
				case 'hh': //00 01 02 ... 11 12
					$(div).append( tpl.replace('%1', 'hour') );
					break;
				case 'mm': //00 01 ... 59
				case 'm': //0 1 2 ... 59
					if ( this.options.type == 'date' ) {
						$(div).append( tpl.replace('%1', 'month') );
					} else {
						$(div).append( tpl.replace('%1', 'min') );
					}
					break;
				case 'ss':
				case 's':
					$(div).append( tpl.replace('%1', 'sec') );
					break;
				case 'd': // day of month 5
				case 'dd': // day of month(leading zero) 05
					$(div).append( tpl.replace('%1', 'day') );
					break;
				case 'M': // Month of year 9
				case 'MM': // Month of year(leading zero) 09
				case 'MMM':
				case 'MMMM':
					$(div).append( tpl.replace('%1', 'month') );
					break;
				case 'yy':	// year two digit
				case 'yyyy': // year four digit
					$(div).append( tpl.replace('%1', 'year') );
					break;
				case 't': //AM / PM indicator(first letter) A, P
					// add button
				case 'tt': //AM / PM indicator AM/PM
					// add button
					btn = '<a href="#" class="ui-datefield-period"' +
						' data-role="button" data-inline="true">period</a>';
					$(div).append( btn );
					break;
				case 'g':
				case 'gg':
					$(div).append( tpl.replace('%1', 'era').replace('%2', this._calendar().eras.name) );
					break;
				case '\t':
					$(div).append( tpl2.replace('%1', 'tab')
							.replace('%2', "<div class='ui-divider-1st'>&nbsp;</div>" +
								"<div class='ui-divider-2nd'>&nbsp;</div>") );
					break;
				default : // string or any non-clickable object
					$(div).append( tpl2.replace('%1', 'seperator').replace('%2', pat.split(/[\-\/]/).join("") ) );
					break;
				}
			}

			this.ui.append( div );
			if ( this.options.date ) {
				this._setDate( this.options.date );
			}

			this.ui.find('.ui-btn-picker').buttonMarkup();
			this.ui.find('.ui-datefield-period').buttonMarkup().bind( 'vclick', function ( e ) {
				obj._switchAmPm( obj );
				return false;
			});

			this.element.attr( "data-" + ( $.mobile.ns ? $.mobile.ns + "-" : "" ) + "format", this.options.format );
			return this.options.format;
		},

		_setDate: function ( newdate ) {
			if ( typeof ( newdate ) == "string" ) {
				newdate = new Date( newdate );
			}

			var fields = $('span,a', this.ui),
				type,
				fn,
				$field,
				btn,
				i;

			function getMonth() {
				return newdate.getMonth() + 1;
			}

			for ( i = 0; i < fields.length; i++ ) {
				$field = $(fields[i]);
				type = $field.attr("class").match(/ui-datefield-([\w]*)/);
				if ( !type ) {
					type = "";
				}
				switch ( type[1] ) {
				case 'hour':
					fn = newdate.getHours;
					break;
				case 'min':
					fn = newdate.getMinutes;
					break;
				case 'sec':
					fn = newdate.getSeconds;
					break;
				case 'year':
					fn = newdate.getFullYear;
					break;
				case 'month':
					fn = getMonth;
					break;
				case 'day':
					fn = newdate.getDate;
					break;
				case 'period':
					fn = newdate.getHours() < 12 ? this._calendar().AM[0] : this._calendar().PM[0];
					btn = $field.find( '.ui-btn-text' );
					if ( btn.length == 0 ) {
						$field.text(fn);
					} else if ( btn.text() != fn ) {
						btn.text( fn );
					}
					fn = null;
					break;
				default:
					fn = null;
					break;
				}
				if ( fn ) {
					this._updateField( $field, fn.call( newdate ) );
				}
			}

			this.options.date = newdate;

			this._setValue( newdate );

			this.element.attr( "data-" + ( $.mobile.ns ? $.mobile.ns + "-" : "" ) + "date", this.options.date );
			return this.options.date;
		},

		destroy: function () {
			if ( this.ui ) {
				this.ui.remove();
			}

			if ( this.element ) {
				this.element.show();
			}
		},

		value: function ( val ) {
			function timeStr( t, obj ) {
				return obj._makeTwoDigits( t.getHours() ) + ':' +
					obj._makeTwoDigits( t.getMinutes() ) + ':' +
					obj._makeTwoDigits( t.getSeconds() );
			}

			function dateStr( d, obj ) {
				return ( ( d.getFullYear() % 10000 ) + 10000 ).toString().substr(1) + '-' +
					obj._makeTwoDigits( d.getMonth() + 1 ) + '-' +
					obj._makeTwoDigits( d.getDate() );
			}

			var rvalue = null;
			if ( val ) {
				rvalue = this._setDate( val );
			} else {
				switch ( this.options.type ) {
				case 'time':
					rvalue = timeStr( this.options.date, this );
					break;
				case 'date':
					rvalue = dateStr( this.options.date, this );
					break;
				default:
					rvalue = dateStr( this.options.date, this ) + 'T' + timeStr( this.options.date, this );
					break;
				}
			}
			return rvalue;
		},

		setValue: function ( newdate ) {
			console.warn( "setValue was deprecated. use datetimepicker('option', 'date', value) instead." );
			return this.value( newdate );
		},

		/**
		 * return W3C DTF string
		 */
		getValue: function () {
			console.warn("getValue() was deprecated. use datetimepicker('value') instead.");
			return this.value();
		},

		_updateField: function ( target, value ) {
			if ( !target || target.length == 0 ) {
				return;
			}

			if ( value == 0 ) {
				value = "0";
			}

			var pat = target.jqmData( 'pat' ),
				hour,
				text,
				self = this;

			switch ( pat ) {
			case 'H':
			case 'HH':
			case 'h':
			case 'hh':
				hour = value;
				if ( pat.charAt(0) == 'h' ) {
					if ( hour > 12 ) {
						hour -= 12;
					} else if ( hour == 0 ) {
						hour = 12;
					}
				}
				hour = this._makeTwoDigits( hour );
				text = hour;
				break;
			case 'm':
			case 'M':
			case 'd':
			case 's':
				text = value;
				break;
			case 'mm':
			case 'dd':
			case 'MM':
			case 'ss':
				text = this._makeTwoDigits( value );
				break;
			case 'MMM':
				text = this._calendar().months.namesAbbr[ value - 1];
				break;
			case 'MMMM':
				text = this._calendar().months.names[ value - 1 ];
				break;
			case 'yy':
				text = this._makeTwoDigits( value % 100 );
				break;
			case 'yyyy':
				if ( value < 10 ) {
					value = '000' + value;
				} else if ( value < 100 ) {
					value = '00' + value;
				} else if ( value < 1000 ) {
					value = '0' + value;
				}
				text = value;
				break;
			}

			// to avoid reflow where its value isn't out-dated
			if ( target.text() != text ) {
				if ( target.hasClass("ui-datefield-selected") ) {
					target.addClass("out");
					this._new_value = text;

					target.animationComplete( function () {
						target.text( self._new_value);
						target.addClass("in")
							.removeClass("out");

						target.animationComplete( function () {
							target.removeClass("in").
								removeClass("ui-datefield-selected");
						});
					});
				} else {
					target.text( text );
				}
			}
		},

		_switchAmPm: function ( obj ) {
			if ( this._calendar().AM != null ) {
				var date = new Date( this.options.date ),
					text,
					change = 1000 * 60 * 60 * 12;
				if ( date.getHours() > 11 ) {
					change = -change;
				}
				date.setTime( date.getTime() + change );
				this._setDate( date );
			}
		},

		_parsePattern: function ( pattern ) {
			var regex = /\/|\s|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|f|gg|g|\'[\w\W]*\'$|[\w\W]/g,
				matches,
				i;

			matches = pattern.match( regex );

			for ( i = 0; i < matches.length; i++ ) {
				if ( matches[i].charAt(0) == "'" ) {
					matches[i] = matches[i].substr( 1, matches[i].length - 2 );
				}
			}

			return matches;
		},

		changeTypeFormat: function ( type, format ) {
			console.warn('changeTypeFormat() was deprecated. use datetimepicker("option", "type"|"format", value) instead');
			if ( type ) {
				this._setType( type );
			}

			if ( format ) {
				this._setFormat( format );
			}
		},

		_create: function () {
			var obj = this;

			if ( this.element.is( "input" ) ) {
				( function ( obj ) {
					var type, value, format;

					type = obj.element.get(0).getAttribute( "type" );
					obj.options.type = type;

					value = obj.element.get(0).getAttribute( "value" );
					if ( value ) {
						obj.options.date = new Date( value );
					}
				}( this ) );
			}

			if ( !this.options.format ) {
				switch ( this.options.type ) {
				case 'datetime':
					this.options.format = this._calendar().patterns.d + "\t" + this._calendar().patterns.t;
					break;
				case 'date':
					this.options.format = this._calendar().patterns.d;
					break;
				case 'time':
					this.options.format = this._calendar().patterns.t;
					break;
				}
			}

			if ( !this.options.date ) {
				this.options.date = new Date();
			}

			this.element.hide();
			this.ui = $('<div class="ui-datefield"></div>');
			$(this.element).after( this.ui );

			this._popup_open = false;
			this.ui.bind('vclick', function ( e ) {
				obj._showDataSelector( obj, this, e.target );
			});

			$.extend( this, {
				_globalHandlers: [
					{
						src: $( window ),
						handler: {
							orientationchange: $.proxy( this, "_orientationHandler" )
						}
					}
				]
			});

			$.each( this._globalHandlers, function( idx, value ) {
				value.src.bind( value.handler );
			});
		},
		_orientationHandler: function() {
			var self = this;
			if( self._popup_open ) {
				self._popup_open = false;
				self.container.popupwindow( 'close' );
			}
			return false;
		},
		_populateDataSelector: function ( field, pat ) {
			var values,
				numItems,
				current,
				data,
				range = window.range,
				local,
				yearlb,
				yearhb,
				day;

			switch ( field ) {
			case 'hour':
				if ( pat == 'H' || pat == 'HH' ) {
					// twentyfour
					values = range( 0, 23 );
					data = range( 0, 23 );
					current = this.options.date.getHours();
				} else {
					values = range( 1, 12 );
					current = this.options.date.getHours() - 1;//11
					if ( current >= 11 ) {
						current = current - 12;
						data = range( 13, 23 );
						data.push( 12 ); // consider 12:00 am as 00:00
					} else {
						data = range( 1, 11 );
						data.push( 0 );
					}
					if ( current < 0 ) {
						current = 11; // 12:00 or 00:00
					}
				}
				if ( pat.length == 2 ) {
					// two digit
					values = values.map( this._makeTwoDigits );
				}
				numItems = values.length;
				break;
			case 'min':
			case 'sec':
				values = range( 0, 59 );
				if ( pat.length == 2 ) {
					values = values.map( this._makeTwoDigits );
				}
				data = range( 0, 59 );
				current = ( field == 'min' ? this.options.date.getMinutes() : this.options.date.getSeconds() );
				numItems = values.length;
				break;
			case 'year':
				yearlb = 1900;
				yearhb = 2100;
				data = range( yearlb, yearhb );
				current = this.options.date.getFullYear() - yearlb;
				values = range( yearlb, yearhb );
				numItems = values.length;
				break;
			case 'month':
				switch ( pat.length ) {
				case 1:
					values = range( 1, 12 );
					break;
				case 2:
					values = range( 1, 12 ).map( this._makeTwoDigits );
					break;
				case 3:
					values = this._calendar().months.namesAbbr.slice();
					break;
				case 4:
					values = this._calendar().months.names.slice();
					break;
				}
				if ( values.length == 13 ) { // @TODO Lunar calendar support
					if ( values[12] == "" ) { // to remove lunar calendar reserved space
						values.pop();
					}
				}
				data = range( 1, values.length );
				current = this.options.date.getMonth();
				numItems = values.length;
				break;
			case 'day':
				day = this._daysInMonth[ this.options.date.getMonth() ];
				if ( day == 28 ) {
					day += this._isLeapYear( this.options.date.getFullYear() );
				}
				values = range( 1, day );
				if ( pat.length == 2 ) {
					values = values.map( this._makeTwoDigits );
				}
				data = range( 1, day );
				current = this.options.date.getDate() - 1;
				numItems = day;
				break;
			}

			return {
				values: values,
				data: data,
				numItems: numItems,
				current: current
			};

		},

		_showDataSelector: function ( obj, ui, target ) {
			target = $(target);

			var attr = target.attr("class"),
				field = attr ? attr.match(/ui-datefield-([\w]*)/) : undefined,
				pat,
				data,
				values,
				numItems,
				current,
				valuesData,
				html,
				datans,
				$ul,
				$div,
				$ctx,
				$li,
				i,
				newLeft = 10,
				self = this;

			if ( !attr ) {
				return;
			}
			if ( !field ) {
				return;
			}
			if ( this._popup_open ) {
				return;
			}

			target.not('.ui-datefield-seperator').addClass('ui-datefield-selected');

			pat = target.jqmData('pat');
			data = obj._populateDataSelector.call( obj, field[1], pat );

			values = data.values;
			numItems = data.numItems;
			current = data.current;
			valuesData = data.data;

			obj.getElementPosition = function() {
				var offset = target.offset();
				return {
					x: offset.left + ( target.width() / 2 ) - window.pageXOffset,
					y: offset.top + target.height() - window.pageYOffset
				}
			}
			if ( values ) {
				datans = "data-" + ($.mobile.ns ? ($.mobile.ns + '-') : "") + 'val="';
				for ( i = 0; i < values.length; i++ ) {
					html += '<li><a class="ui-link" ' + datans + valuesData[i] + '">' + values[i] + '</a></li>';
				}

				$ul = $("<ul></ul>");
				$div = $('<div class="ui-datetimepicker-selector" data-transition="fade" data-fade="false"></div>');
				$div.append( $ul ).appendTo( ui );
				$ctx = $div.ctxpopup();
				$ctx.parents('.ui-popupwindow').addClass('ui-datetimepicker');
				$li = $(html);
				$( $li[current] ).addClass("current");
				$div.jqmData( "list", $li );
				$div.circularview();

				if( !obj._reflow ) {
					obj._reflow = function() {
						$div.circularview( "reflow" );
						$div.circularview( 'centerTo', '.current', 0 );
						$ctx.popupwindow( "setPositionCB", obj.getElementPosition);
					}
					$(window).bind( "resize" , obj._reflow );
				}
				if( !obj._close ) {
					obj._close = function() {
						$div.trigger( "popupafterclose" );
					}
					$(window).bind( "navigate", obj._close );
				}
				$ctx.popupwindow( 'open',
						target.offset().left + ( target.width() / 2 ) - window.pageXOffset ,
						target.offset().top + target.height() - window.pageYOffset, target.width(), target.height() );

				this.container = $ctx;
				this._popup_open = true;

				$div.bind('popupafterclose', function ( e ) {
					if ( obj._reflow ) {
						$(window).unbind( "resize", obj._reflow );
						obj._reflow = null;
					}

					if ( obj._close ) {
						$(window).unbind( "navigate", obj._close );
						obj._close = null;
					}

					if ( !( target.hasClass("in") || target.hasClass("out") ) ) {
						target.removeClass("ui-datefield-selected");
					}

					$div.unbind( 'popupafterclose' );
					$ul.unbind( 'vclick' );
					$(obj).unbind( 'update' );
					$ctx.popupwindow( 'destroy' );
					$div.remove();

					self._popup_open = false;
				});

				$(obj).bind( 'update', function ( e, val ) {
					var date = new Date( this.options.date ),
						month,
						date_calibration = function () {
							date.setDate( 1 );
							date.setDate( date.getDate() - 1 );
						};

					switch ( field[1] ) {
					case 'min':
						date.setMinutes( val );
						break;
					case 'hour':
						date.setHours( val );
						break;
					case 'sec':
						date.setSeconds( val );
						break;
					case 'year':
						month = date.getMonth();
						date.setFullYear( val );

						if ( date.getMonth() != month ) {
							date_calibration();
						}
						break;
					case 'month':
						date.setMonth( val - 1 );

						if ( date.getMonth() == val ) {
							date_calibration();
						}
						break;
					case 'day':
						date.setDate( val );
						break;
					}

					obj._setDate( date );

					$ctx.popupwindow( 'close' );
				});

				$ul.bind( 'click', function ( e ) {
					if ( $(e.target).is('a') ) {
						$ul.find(".current").removeClass("current");
						$(e.target).parent().addClass('current');
						var val = $(e.target).jqmData("val");
						$(obj).trigger( 'update', val ); // close popup, unselect field
					}
				});

				$div.circularview( 'centerTo', '.current', 500 );
				$div.bind( 'scrollend' , function ( e ) {
					if ( !obj._reflow ) {
						obj._reflow = function () {
							$div.circularview("reflow");
						};
						$(window).bind("resize", obj._reflow);
					}
				});
			}
			return ui;
		}

	});

	$(document).bind("pagecreate create", function ( e ) {
		$($.tizen.datetimepicker.prototype.options.initSelector, e.target)
			.not(":jqmData(role='none'), :jqmData(role='nojs')")
			.datetimepicker();
	});

} ( jQuery, this ) );


(function($){$.tizen.frameworkData.pkgVersion="0.2.83";}(jQuery));
