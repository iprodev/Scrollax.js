/**
 *  _______ _______  ______  _____                _______ _     _
 *  |______ |       |_____/ |     | |      |      |_____|  \___/ 
 *  ______| |_____  |    \_ |_____| |_____ |_____ |     | _/   \_
 *
 *  Parallax Scrolling Library
 *  http://iprodev.github.io/Scrollax.js
 *
 *  @version:  1.0.0
 *  @released: July 21, 2015
 *
 *  @author:   iProDev (Hemn Chawroka)
 *             http://iprodev.com/
 *
 *  Licensed under the MIT license.
 *  http://opensource.org/licenses/MIT
 * 
 */
(function(factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports !== 'undefined') {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Global
		factory(jQuery);
	}
}(function($) {
	'use strict';

	/**
	 * References.
	 */
	var ArrayProto = Array.prototype, ObjProto = Object.prototype,

	// Create quick reference variables for speed access to core prototypes.
	push = ArrayProto.push,
	splice = ArrayProto.splice,
	hasOwnProperty = ObjProto.hasOwnProperty,

	// Global variables
	namespace = 'Scrollax',
	lownamespace = namespace.toLowerCase(),
	numberRegExp = /[-+]?\d+(\.\d+)?/g,
	transforms = ['translateX', 'translateY', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'scaleX', 'scaleY'],

	// Global DOM References
	$win = $(window),
	$doc = $(document.body),

	// Support indicators
	transform, gpuAcceleration,

	// Speed access to frequently called functions
	position, bind, unbind;

	/**
	 * Scrollax
	 *
	 * @class
	 *
	 * @param {Element}  frame  Scrolling frame.
	 */
	var Scrollax = function(frame, options, callbackMap) {
		// Private variables
		var self      = this;
		var $frame  = frame && $(frame).eq(0) || $win;
		var instances = Scrollax.instances;
		var prevent   = null;

		frame = $frame[0];

		// Check the contest existance
		$.each(instances, function(instance, i) {
			if (instance && instance.frame === frame) {
				prevent = true;
			}
		});

		// Send warn message to browser when the Frame is not available or initialized before
		if (!frame || prevent) {
			if (prevent) {
				warn(namespace + ': Scrollax has been initialized for this frame!');
			}
			else {
				warn(namespace + ': Frame is not available!');
			}
			return;
		}

		// Merge options
		var o = $.extend({}, Scrollax.defaults, options);

		var parents          = [],
			$parents         = null,
			parentSelector   = o.parentSelector || '[data-' + lownamespace + '-parent]',
			elementsSelector = o.elementsSelector || '[data-' + lownamespace + ']',
			callbacks        = {},
			tmpArray         = [],
			resizeID,
			frameIsWindow = isWindow(frame),

			// Garbage collecting purposes
			i, l, pi, pl, $freezer, timer, containsPerformanceClass, offset, isHorizontal, parentOffset, pos, parent, parentOptions, ratio, start, end, parallaxElements, parallaxable, el, properties, property, value, transformStyle, numbers;

		// Expose variables
		self.frame       = frame;
		self.options     = o;
		self.parents     = parents;
		self.initialized = false;

		/**
		 * (Re)Loading function.
		 *
		 * Populate arrays, set sizes, add spies, ...
		 *
		 * @return {Object}
		 */
		function load() {
			$parents = frameIsWindow ? $doc.find(parentSelector) : $frame.find(parentSelector);
			// Reset parents
			parents.length = 0;

			isHorizontal = !!o.horizontal;

			// Iterate through parents
			$parents.each(parentEachHandler);

			// Update scroll
			scrollHandler();

			if (o.performanceTrick) {
				$freezer = frameIsWindow ? $doc : $frame;
			}

			// Trigger :load event
			trigger('load');

			return self;
		}
		self.reload = load;

		/**
		 * Each parent handler
		 *
		 * @param {Int}   i         Parent index.
		 * @param {Node}  element   Parent DOM element.
		 *
		 * @return {Void}
		 */
		var parentEachHandler = function (i, element) {
			var $parent       = $(element),
				parentOptions = getInlineOptions($(element)),
				parent = {};

			parent.element          = element,
			parent.options          = parentOptions,
			parent.parallaxElements = [];

			$parent.find(elementsSelector).each(function(pI, pElement) {
				var parallaxElement = getInlineOptions($(pElement));
				parallaxElement.element = pElement;

				push.call(parent.parallaxElements, parallaxElement);
			});

			push.call(parents, parent);
		}

		/**
		 * Window resize handler.
		 *
		 * @return {Void}
		 */
		function resizeHandler() {
			if (resizeID) {
				resizeID = clearTimeout(resizeID);
			}

			resizeID = setTimeout(function () {
				self.reload();
			});
		};

		/**
		 * Frame scrolling handler.
		 *
		 * @return {Void}
		 */
		function scrollHandler() {
			var l = parents.length;
			if (o.performanceTrick && $freezer) {
				clearTimeout(timer);

				if(!containsPerformanceClass) {
					$freezer.addClass('scrollax-performance');
					containsPerformanceClass = true;
				}

				timer = setTimeout(function(){
					$freezer.removeClass('scrollax-performance');
					containsPerformanceClass = false;
				}, 100);
			}

			if (!l) {
				return;
			}

			// Get frame offset
			offset = getOffset(frame);

			for (var i = 0; i < l; i++) {
				parent        = parents[i];
				pos           = position(parent.element, frame);

				if (pos[isHorizontal ? 'right' : 'bottom'] < 0 || pos[isHorizontal ? 'left' : 'top'] > offset[isHorizontal ? 'width' : 'height']) {
					continue;
				}

				parentOptions = parent.options;
				parentOffset  = parentOptions.offset || o.offset || 0;
				start         = pos[isHorizontal ? 'right' : 'bottom'];
				end           = pos[isHorizontal ? 'width' : 'height'];

				// Calculate parent parallax ratio
				ratio = (end - start + parentOffset) / end;

				if (ratio < 0) {
					start = pos[isHorizontal ? 'left' : 'top'];
					end   = offset[isHorizontal ? 'width' : 'height'];

					// Calculate negative parent parallax ratio
					ratio = -1 + (end - start + parentOffset) / end;
				}

				if (ratio > 1 || ratio < -1) {
					continue;
				}

				parallax(parent, ratio, isHorizontal);
			}

			// Trigger :scroll event
			trigger('scroll', offset);
		}
		self.scroll = scrollHandler;

		/**
		 * Parallax handler.
		 *
		 * @param {Int}    index    Parent object.
		 * @param {Object} offset   Scroll offset.
		 *
		 * @return {Void}
		 */
		function parallax(parent, ratio) {
			parallaxElements = parent.parallaxElements;
			var l = parallaxElements.length;

			if(!l) {
				return;
			}

			for (var i = 0; i < l; i++) {
				parallaxable = parallaxElements[i];
				el           = parallaxable.element;

				// Set needed styles to parallaxable element
				styleHandler(el, parallaxable, ratio);
			}
		}

		/**
		 * Style handler for parallaxable element.
		 *
		 * @param {Node}   element        Parallaxable DOM element.
		 * @param {Object} parallaxable   Parallaxable options.
		 * @param {int}    ratio          Parallax ratio.
		 *
		 * @return {Int}  Parent     index, or -1 if not found.
		 */
		function styleHandler(element, parallaxable, ratio) {
			properties     = parallaxable.properties || (isHorizontal ? { 'translateX': '100%' } : { 'translateY': '100%' });
			transformStyle = "";

			for(property in properties) {
				value = properties[property];

				if (typeof value === 'number') {
					value = value * ratio;
				}
				else if (typeof value === 'string') {
					numbers = value.match(numberRegExp);
					value   = value;

					for (i = 0, l = numbers.length; i < l; i++) {
						value = value.replace(numbers[i], parseFloat(numbers[i] * ratio));
					};
				}

				if ($.inArray(property, transforms) !== -1) {
					transformStyle += property + '(' + value + ')';
				}
				else {
					element.style[property] = property === 'opacity' ? within(ratio < 0 ? 1 + value : 1 - value, 0, 1) : value;
				}
			}

			if (transformStyle) {
				element.style[transform] = gpuAcceleration + transformStyle;
			}
		}

		/**
		 * Get the index of an parent in parents.
		 *
		 * @param {Mixed} parent     Parent DOM element.
		 *
		 * @return {Int}             index, or -1 if not found.
		 */
		function getIndex(parent) {
			return typeof parent !== 'undefined' ?
					is_numeric(parent) ?
						parent >= 0 && parent < parents.length ? parent : -1 :
						$parents.index(parent) :
					-1;
		}
		// Expose getIndex without lowering the compressibility of it,
		// as it is used quite often throughout Scrollax.
		self.getIndex = getIndex;

		/**
		 * Trigger callbacks for event.
		 *
		 * @param  {String} name Event name.
		 * @param  {Mixed}  argX Arguments passed to callbacks.
		 *
		 * @return {Void}
		 */
		function trigger(name, arg1) {
			if (callbacks[name]) {
				l = callbacks[name].length;
				// Callbacks will be stored and executed from a temporary array to not
				// break the execution queue when one of the callbacks unbinds itself.
				tmpArray.length = 0;
				for (i = 0; i < l; i++) {
					push.call(tmpArray, callbacks[name][i]);
				}
				// Execute the callbacks
				for (i = 0; i < l; i++) {
					tmpArray[i].call(self, name, arg1);
				}
			}
		}

		/**
		 * Registers callbacks to be executed only once.
		 *
		 * @param  {Mixed} name  Event name, or callbacks map.
		 * @param  {Mixed} fn    Callback, or an array of callback functions.
		 *
		 * @return {Object}
		 */
		self.one = function (name, fn) {
			function proxy() {
				fn.apply(self, arguments);
				self.off(name, proxy);
			}
			self.on(name, proxy);

			return self;
		};

		/**
		 * Registers callbacks.
		 *
		 * @param  {Mixed} name  Event name, or callbacks map.
		 * @param  {Mixed} fn    Callback, or an array of callback functions.
		 *
		 * @return {Object}
		 */
		self.on = function (name, fn) {
			// Callbacks map
			if (typeof(name) === 'object') {
				for (var key in name) {
					if (hasOwnProperty.call(name, key)) {
						self.on(key, name[key]);
					}
				}
			// Callback
			}
			else if (typeof(fn) === 'function') {
				var names = name.split(' ');
				for (var n = 0, nl = names.length; n < nl; n++) {
					callbacks[names[n]] = callbacks[names[n]] || [];
					if (callbackIndex(names[n], fn) === -1) {
						push.call(callbacks[names[n]], fn);
					}
				}
			// Callbacks array
			}
			else if (typeof(fn) === 'array') {
				for (var f = 0, fl = fn.length; f < fl; f++) {
					self.on(name, fn[f]);
				}
			}

			return self;
		};

		/**
		 * Remove one or all callbacks.
		 *
		 * @param  {String} name Event name.
		 * @param  {Mixed}  fn   Callback, or an array of callback functions. Omit to remove all callbacks.
		 *
		 * @return {Object}
		 */
		self.off = function (name, fn) {
			if (fn instanceof Array) {
				for (var f = 0, fl = fn.length; f < fl; f++) {
					self.off(name, fn[f]);
				}
			}
			else {
				var names = name.split(' ');
				for (var n = 0, nl = names.length; n < nl; n++) {
					callbacks[names[n]] = callbacks[names[n]] || [];
					if (typeof(fn) === 'undefined') {
						callbacks[names[n]].length = 0;
					}
					else {
						var index = callbackIndex(names[n], fn);
						if (index !== -1) {
							splice.call(callbacks[names[n]], index, 1);
						}
					}
				}
			}

			return self;
		};

		/**
		 * Returns callback array index.
		 *
		 * @param  {String}   name Event name.
		 * @param  {Function} fn   Function
		 *
		 * @return {Int} Callback array index, or -1 if isn't registered.
		 */
		function callbackIndex(name, fn) {
			for (var i = 0, l = callbacks[name].length; i < l; i++) {
				if (callbacks[name][i] === fn) {
					return i;
				}
			}
			return -1;
		}

		/**
		 * Updates a signle or multiple option values.
		 *
		 * @param {Mixed} name  Name of the option that should be updated, or object that will extend the options.
		 * @param {Mixed} value New option value.
		 *
		 * @return {Object}
		 */
		self.set = function (name, value) {
			if ($.isPlainObject(name)) {
				$.extend(o, name);
			}
			else if (hasOwnProperty.call(o, name)) {
				o[name] = value;
			}

			// Reload
			load();

			return self;
		};

		/**
		 * Destroys instance and everything it created.
		 *
		 * @return {Object}
		 */
		self.destroy = function() {
			// Unbind all events
			unbind(window, 'resize', resizeHandler);
			unbind(frame, 'scroll', scrollHandler);

			// Remove this instance from instances
			$.each(instances, function(instance, i) {
				if (instance && instance.frame === frame) {
					splice.call(Scrollax.instances, i, 1);
				}
			});

			parents.length = 0;
			self.initialized = false;

			// Trigger :destroy event
			trigger('destroy');

			return self;
		};

		/**
		 * Initialize.
		 *
		 * @return {Object}
		 */
		self.init = function() {
			if (self.initialized) {
				return;
			}

			// Register callbacks map
			self.on(callbackMap);

			load();

			// Bind all events
			bind(window, 'resize', resizeHandler);
			bind(frame, 'scroll', scrollHandler);

			// Add this instance to all instances
			push.call(Scrollax.instances, self);

			self.initialized = true;

			// Trigger :initialized event
			trigger('initialized');

			return self;
		};
	};

	Scrollax.instances = [];

	/**
	 * Send warning message to the browser.
	 *
	 * @param {String} message
	 *
	 * @return {Void}
	 */
	function warn(message) {
		if (console && console.warn) {
			console.warn(namespace + ': ' + message);
		}
		else {
			throw (namespace + ': ' + message);
		}
	}

	/**
	 * Get Offset.
	 *
	 * @param {String} message
	 *
	 * @return {Void}
	 */
	function getOffset(element) {
		var isWin = !!('pageYOffset' in element);

		return {
			width: isWin ? (window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth) : element.offsetWidth,
			height: isWin ? (window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight) : element.offsetHeight,
			left: element[isWin ? 'pageXOffset' : 'scrollLeft'],
			top: element[isWin ? 'pageYOffset' : 'scrollTop']
		};
	}

	/**
	 * A JavaScript equivalent of PHP’s is_numeric.
	 *
	 * @param {Mixed} value
	 *
	 * @return {Boolean}
	 */
	function is_numeric(value) {
		return (typeof(value) === 'number' || typeof(value) === 'string') && value !== '' && !isNaN(value);
	}

	/**
	 * Make sure that number is within the limits.
	 *
	 * @param {Number} number
	 * @param {Number} min
	 * @param {Number} max
	 *
	 * @return {Number}
	 */
	function within(number, min, max) {
		return number < min ? min : number > max ? max : number;
	}

	/**
	 * Get element inline options.
	 *
	 * @param {Object}   $element    jQuery object with element.
	 *
	 * @return {Object}
	 */
	function getInlineOptions($element) {
		var data = $element.data(lownamespace.toLowerCase());
		return data && eval("({" + data + "})") || {};
	}

	/**
	 * Check whether value is a window object.
	 *
	 * Uses duck typing to determine window. Without IE8 all we need is:
	 *
	 *   var type = Object.prototype.toString.call(val);
	 *   return type === '[object global]' || type === '[object Window]' || type === '[object DOMWindow]';
	 *
	 * @param  {Mixed} val
	 * @return {Boolean}
	 */
	function isWindow(val) {
		/* jshint eqeqeq:false */
		var doc, docWin;
		return !!(
			val
			&& typeof val === 'object'
			&& typeof val.window === 'object'
			&& val.window == val
			&& val.setTimeout
			&& val.alert
			&& (doc = val.document)
			&& typeof doc === 'object'
			&& (docWin = doc.defaultView || doc.parentWindow)
			&& typeof docWin === 'object'
			&& docWin == val
		);
	};

	// Returns element's position object relative to document, window, or other elements.
	(function () {
		var k, doc, docEl, win, winTop, winLeft, box, relBox;
		/**
		 * Poor man's shallow object extend;
		 *
		 * @param  {Object} a
		 * @param  {Object} b
		 * @return {Object}
		 */
		function extend(a, b) {
			for (k in b) a[k] = b[k];
			return a;
		}

		/**
		 * Returns element's position object with `left`, `top`, `bottom`, `right`,
		 * `width`, and `height` properties indicating the position and dimensions
		 * of element on a page, or relative to other element.
		 *
		 * @param {Element} element
		 * @param {Element} [relativeTo] Defaults to `document.documentElement`.
		 *
		 * @return {Object|null}
		 */
		position = function(element, relativeTo) {
			doc = element.ownerDocument || element;
			docEl = doc.documentElement;
			win = isWindow(relativeTo) ? relativeTo : doc.defaultView || window;

			// normalize arguments
			relativeTo = !relativeTo || relativeTo === doc ? docEl : relativeTo;

			winTop = (win.pageYOffset || docEl.scrollTop) - docEl.clientTop;
			winLeft = (win.pageXOffset || docEl.scrollLeft) - docEl.clientLeft;
			box = { top: 0, left: 0 };

			if (element && element.getBoundingClientRect) {
				// new object needed because DOMRect properties are read-only
				box = extend({}, element.getBoundingClientRect());
				// width & height don't exist in <IE9
				box.width = box.right - box.left;
				box.height = box.bottom - box.top;
			} else {
				return null;
			}

			// current box is already relative to window
			if (relativeTo === win) return box;

			// add window offsets, making the box relative to documentElement
			box.top += winTop;
			box.left += winLeft;
			box.right += winLeft;
			box.bottom += winTop;

			// current box is already relative to documentElement
			if (relativeTo === docEl) return box;

			// subtract position of other element
			relBox = position(relativeTo);
			box.left -= relBox.left;
			box.right -= relBox.left;
			box.top -= relBox.top;
			box.bottom -= relBox.top;

			return box;
		}
	}());

	// Event binding component with support for legacy browsers.
	(function () {
		/**
		 * Prevets default event action in IE8-.
		 */
		function preventDefault() {
			this.returnValue = false;
		}

		/**
		 * Stops event propagation in IE8-.
		 */
		function stopPropagation() {
			this.cancelBubble = true;
		}

		/**
		 * Bind `el` event `type` to `fn`.
		 *
		 * @param {Element}  el
		 * @param {String}   type
		 * @param {Function} fn
		 * @param {Boolean}  [capture]
		 *
		 * @return {Function} `fn`
		 */
		bind = window.addEventListener ? function (el, type, fn, capture) {
			el.addEventListener(type, fn, capture || false);
			return fn;
		} : function (el, type, fn) {
			var fnid = type + fn;

			el[fnid] = el[fnid] || function () {
				var event = window.event;
				event.target = event.srcElement;
				event.preventDefault = preventDefault;
				event.stopPropagation = stopPropagation;
				fn.call(el, event);
			};

			el.attachEvent('on' + type, el[fnid]);
			return fn;
		};

		/**
		 * Unbind `el` event `type`'s callback `fn`.
		 *
		 * @param {Element}  el
		 * @param {String}   type
		 * @param {Function} fn
		 * @param {Boolean}  [capture]
		 *
		 * @return {Function} `fn`
		 */
		unbind = window.removeEventListener ? function (el, type, fn, capture) {
			el.removeEventListener(type, fn, capture || false);
			return fn;
		} : function (el, type, fn) {
			var fnid = type + fn;
			el.detachEvent('on' + type, el[fnid]);

			// clean up reference to handler function, but with a fallback
			// because we can't delete window object properties
			try {
				delete el[fnid];
			} catch (err) {
				el[fnid] = undefined;
			}

			return fn;
		};
	}());

	// Feature detects
	(function () {
		var prefixes = ['', 'webkit', 'moz', 'ms', 'o'];
		var el = document.createElement('div');

		function testProp(prop) {
			for (var p = 0, pl = prefixes.length; p < pl; p++) {
				var prefixedProp = prefixes[p] ? prefixes[p] + prop.charAt(0).toUpperCase() + prop.slice(1) : prop;
				if (el.style[prefixedProp] != null) {
					return prefixedProp;
				}
			}
		}

		// Global support indicators
		transform = testProp('transform');
		gpuAcceleration = testProp('perspective') ? 'translateZ(0) ' : '';
	}());

	// Default options
	Scrollax.defaults = {
		horizontal:       false, // Enable for horizontal scrolling.
		offset:           0,     // Target area offset from start (top in vert., left in hor.).
		parentSelector:   null,  // Select only PARENTs that match this selector.
		elementsSelector: null,  // Select only PARALLAX_ELEMENTS that match this selector.
		performanceTrick: false  // Use this option to optimize your scroll performance. This option will freeze CSS Animations and pointer events during scrolling
	};

	// Expose the Scrollax
	window.Scrollax = Scrollax;

	// Extend jQuery
	$.fn.Scrollax = function (options, callbackMap) {
		var method, methodArgs;

		// Attributes logic
		if (!$.isPlainObject(options)) {
			if (typeof options === 'string' || options === false) {
				method = options === false ? 'destroy' : options;
				methodArgs = slice.call(arguments, 1);
			}
			options = {};
		}

		// Apply to all elements
		return this.each(function (i, element) {
			// Call with prevention against multiple instantiations
			var plugin = $.data(element, lownamespace);

			if (!plugin && !method) {
				// Create a new object if it doesn't exist yet
				plugin = $.data(element, lownamespace, new Scrollax(element, options, callbackMap).init());
			}
			else if (plugin && method) {
				// Call method
				if (plugin[method]) {
					plugin[method].apply(plugin, methodArgs);
				}
			}
		});
	};

	$.Scrollax = function(options, callbackMap) {
		$win.Scrollax(options, callbackMap);
	};

	var css = '.scrollax-performance, .scrollax-performance *, .scrollax-performance *:before, .scrollax-performance *:after { pointer-events: none !important; -webkit-animation-play-state: paused !important; animation-play-state: paused !important; };',
		head = document.head || document.getElementsByTagName('head')[0],
		style = document.createElement('style');

	style.type = 'text/css';
	if (style.styleSheet){
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}

	head.appendChild(style);

	// AMD requirement
	return Scrollax;
}));