# Options

All default options are stored in the `Scrollax.defaults` object. You can modify them simply by:

```js
Scrollax.defaults.offset = 50;
Scrollax.defaults.horizontal = true;
```

Or you can make it easier with jQuery.extend:

```js
jQuery.extend(Scrollax.defaults, {
	offset: 50,
	horizontal: true
});
```

## Quick reference

Scrollax call with all default options as defined in the source.

```js
var frame = new Scrollax('#frame', {
	horizontal:       false, // Enable for horizontal scrolling.
	offset:           0,     // Target area offset from start (top in vert., left in hor.).
	parentSelector:   null,  // Select only PARENTs that match this selector.
	elementsSelector: null,  // Select only PARALLAX_ELEMENTS that match this selector.
	performanceTrick: false  // Use this option to optimize your scroll performance. This option will freeze CSS Animations and pointer events during scrolling
});
```

# Options

### horizontal

Type: `Boolean`
Default: `false`

Switches to horizontal mode.

---

### offset

Type: `Number`
Default: `0`

Target area offset from start (top in vert., left in hor.).

---

### parentSelector

Type: `String`
Default: `null`

Selector to be used for parents.

---

### elementsSelector

Type: `String`
Default: `null`

Selector to be used for parallax elements.

### performanceTrick

Type: `Boolean`
Default: `false`

Use this option to optimize your scroll performance. This option will freeze CSS Animations and pointer events during scrolling