# Calling

When you want to have a direct access to all methods and complete control over Scrollax:

```js
var scrollax = new Scrollax( frame, options [, callbackMap ] );
```

New instance has to be than initiated. That is to give you time to bind callbacks before anything happens. For example, if you want to register callbacks, but don't want to use `callbackMap`.

```js
scrollax.init();
```

The `.init()` method returns the very same instance it is called on, so if you are binding callbacks via a `callbackMap` argument, or not binding callbacks at all, you can initiate the instance right after the `new Scrollax` call. The `scrollax` variable will be the same.

```js
var scrollax = new Scrollax(frame, options, callbackMap).init();
```

Now you can use all methods directly on this instance.

```js
scrollax.reload();   // Reload Scrollax
```
A common usecase is wanting scrollax to be reloaded when the user resizes the browser. The following accomplishes that
```
  $(window).resize(function(e) {
        $frame.Scrollax('reload');
  });
```

---

### frame

Type: `Mixed`

Argument can be a selector, DOM element, or jQuery object containing an element. Examples:

```js
var scrollax = new Scrollax('#frame');                         // selector
var scrollax = new Scrollax(document.getElementById('frame')); // DOM element
var scrollax = new Scrollax(jQuery('#frame'));                 // jQuery object
```

---

### options

Type: `Object`

Object with Scrollax options. All options are documented in the [Options Wiki page](Options.md).

---

### [ callbackMap ]

Type: `Object`

Map with callbacks that should be registered to Scrollax events before Scrollax gets initiated. Example:

```js
var scrollax = new Scrollax(frame, options, {
	load: function () {},
	scroll: [
		function () {},
		function () {}
	]
});
```

If you want to calling Scrollax via jQuery proxy for window just use this:

```js
$.Scrollax( [ options [, callbackMap ] ] );
```

This will bind one function to `load` event, and two functions to `scroll` event.

To see all available Scrollax events, head over to [Events documentation](Events.md).

## Calling via jQuery proxy

```js
$('#frame').Scrollax( [ options [, callbackMap ] ] );
```

---

### [ options ]

Type: `Object`

Object with scrollax options. All options are documented in the [Options Wiki page](Options.md).

---

### [ callbackMap ]

Type: `Object`

Map with callbacks that should be registered to Scrollax events before Scrollax gets initiated. Example:

```js
$('#frame').Scrollax(options, {
	load: function () {},
	scroll: [
		function () {},
		function () {}
	]
});
```

This will bind one function to `load` event, and two functions to `scroll` event.

To see all available Scrollax events, head over to [Events documentation](Events.md).