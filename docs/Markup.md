# Markup

![Terminology](http://iprodev.github.io/Scrollax.js/images/terminology.png)

**Terminology:** Scrollax is being applied to a **FRAME**. **PARENT** is parent edge for parallax elements. The parallax elements are then inside of a **PARENT**.

## PARENT

To active a PARENT you just need to add `data-scrollax-parent="true"` attribute to the element you want.

```html
<div data-scrollax-parent="true">
```

The PARENT can also have its own options:

```html
<div data-scrollax-parent="offset: 50">
```

## PARALLAX ELEMENTS

If you want elements to scroll at a different speed & styles, add the following attribute to any element:

```html
<div data-scrollax="properties: { 'translateY': '200%', 'opacity': 1.5 }">
```

You can use most of CSS properties & transform functions for PARALLAX ELEMENTS

```html
<div data-scrollax-parent="properties: { 'rotateX': '90deg', 'marginTop': '100px' }">
```