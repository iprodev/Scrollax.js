# Properties

Scrollax instance exposes some useful properties. These properties are read only, and shouldn't be modified.

Assuming:

```js
var scrollax = new Scrollax(frame, options).init();
```

---

### scrollax.initialized

Type: `Boolean`

Flag of Scrollax initialized state. `true` when `.init()` has been called, `false` otherwise.

---

### scrollax.options

Type: `Object`

Object with all options used by the current Scrollax object. This is essentially a `Scrollax.defaults` object extended by options passed to `new Scrollax()`.

---

### scrollax.frame

Type: `Node`

FRAME element DOM node.

---

### scrollax.parents

Type: `Array`

Array of parent objects. Structure:

```js
[
	{
		element: DOMNode,    // Parent element DOM node.
		options: {},         // Parent inline options.
		parallaxElements: [] // Parallax elements exists in parent.
	},
	...
]
```
