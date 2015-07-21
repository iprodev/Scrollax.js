# Events

You can register callbacks to Scrollax events in multiple ways.

Passing in a callbackMap on Scrollax object creation:

```js
var frame = new Scrollax('#frame', options, {
	load: fn,
	scroll: [fn1, fn2] // Multiple callbacks
}).init();
```

With `.on()`, `.one()` and `.off()` methods:

```js
var frame = new Scrollax('#frame', options);

// Register a callback to multiple events
frame.on('load scroll', fn);

// Register a callback that will be executed only once
frame.one('load', fn);

// Initiate Scrollax instance
frame.init();
```

Events via `jQuery.fn.scrollax`:

```js
$('#frame').scrollax('on', 'load scroll', fn);
```

More usage examples can be found in the [on, one, and off methods documentation](Methods.md).

## Common arguments

#### this

The `this` value in all callbacks is the scrollax object triggering the event. With it you have access to all [Scrollax object properties](Properties.md).

#### 1st argument

All callbacks receive the event name as the first argument.

---

Example:

```js
scrollax.on('load', function (eventName) {
	console.log(eventName);    // 'load'
	console.log(this.parents); // Scrollax parents list
});
```

## Events

### initialize

Event triggered when Scrollax has been initiated.

Callback arguments:

1. **eventName** `String` Event name.

---

### load

Event triggered on first scrollax load, and on each `.reload()` method call.

Callback arguments:

1. **eventName** `String` Event name.

**NOTE**: The  `scrollax.pos` or `this.parents` array in this event containing the parents list as it is after the reload. The parents list than looks like this:

```js
[{
	element: Node,
	options: {},
	parallaxElements: []
}]
```

---

### scroll

Event triggered when frame has been scrolled.

Callback arguments:

1. **eventName** `String` Event name.

---

### destroy

Event triggered when Scrollax has been destroyed.

Callback arguments:

1. **eventName** `String` Event name.