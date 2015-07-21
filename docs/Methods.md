# Methods

Scrollax has some useful methods that provide almost any functionality required. You can call them directly on a [scrollax object](Calling.md), or (if you are lame) via a `jQuery.fn.Scrollax` proxy, like so:

```js
$('#frame').Scrollax('method' [, arguments... ] );
```

The docs & examples below assume that:

```js
var scrollax = new Scrollax(frame, options).init();
```

## Methods

### #init()

Initiates Scrollax instance, i.e. sets the required binds event handlers,...

This method returns the very same object it was called on, so you can chain it right after the instance creation:

```js
var scrollax = new Scrollax(frame, options, callbackMap).init();
```

The purpose of this is to give you time to register callbacks with `.on()` and `.off()` methods without using `callbackMap` argument before anything happens.

---

### #destroy()

Resets positions, and unbinds all event listeners. When called via `.Scrollax()` proxy, you can also use an alias:

```js
$('#frame').Scrollax(false); // does the same thing
```

Returns the Scrollax object, so you can do shenanigans like `new Scrollax().init().destroy().init()`.

---

### #reload()

Recalculates sizes and positions of elements. Call it if any change has happened to FRAME or its content, like things have been appended, removed, or resized.

---

### #set(name, [value])

Updates one, or multiple values in an options object.

```js
scrollax.set('offset', 50); // Updates one property in options object
scrollax.set({ offset: 50, horizontal: true }); // Extends current options object
```

Not all options can be updated. This is the list of those that can:

- horizontal
- parentSelector
- elementsSelector
- performanceTrick

You can however update any option, and than do `scrollax.destroy().init()` to re-initiate Scrollax object, thus rebinding all event listeners, rebuilding pages, ...

---

### #on(eventName, callback)

Registers a callback to one or more of the Scrollax events. All available events and arguments they receive can be found in the [Events documentation](Events.md).

- **eventName** `Mixed` Name of the event, or callback map object.
- **callback** `Mixed` Callback function, or an array with callback functions.

Examples:

```js
// Basic usage
scrollax.on('load', function () {});

// Multiple events, one callback
scrollax.on('load scroll', function () {});

// Multiple callbacks for multiple events
scrollax.on('load scroll', [
	function () {},
	function () {}
]);

// Callback map object
scrollax.on({
	load: function () {},
	scroll: [
		function () {},
		function () {}
	]
});
```

---

### #one(eventName, callback)

Same as `.on()` method, but registered callbacks will be executed only once, and will be unbind afterwards.

- **eventName** `Mixed` Name of the event, or callback map object.
- **callback** `Mixed` Callback function, or an array with callback functions.

---

### #off(eventName, [callback])

Removes one, multiple, or all callbacks from one of the Scrollax events.

- **eventName** `String` Name of the event.
- **[callback]** `Mixed` Callback function, or an array with callback functions to be removed. Omit to remove all callbacks.

Examples:

```js
// Removes one callback from load event
scrollax.off('load', fn1);

// Removes one callback from multiple events
scrollax.off('load scroll', fn1);

// Removes multiple callbacks from multiple event
scrollax.off('load scroll', [ fn1, fn2 ]);

// Removes all callbacks from load event
scrollax.off('load');
```

---

### #scroll()

Reset the FRAME scrolling position.

---

### #getIndex(parent)

Returns an index of a parent in parents list, or -1 when not found.

- **parent** Can be DOM node of a parent element, or index in case of checks.

When you pass an integer to the **parent** argument, the function will just check whether it is a valid index (fits between 0 and scrollax.parents.length - 1), and return the very same number, or -1 when invalid.
