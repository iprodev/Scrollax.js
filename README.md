# [Scrollax.js](https://iprodev.github.io/Scrollax.js)

Smart, Super smooth, cross-browser, and easy-to-use parallax scrolling effect plugin you have ever seen!

Scrollax.js features:

- Highly optimized scrolling rendering
- GPU accelerated
- Set custom ratio for any CSS property
- Don't parallax elments that are not in the viewport
- Horizontal & Vertical scrolling supports
- Lots of super useful methods

... and has a powerful & developer friendly API!

That's all build around a custom highly optimized scrolling rendering, and GPU accelerated.

#### Dependencies

- jQuery 1.7+

#### Compatibility

Works everywhere, even in IE6+ abominations, but that is a complete accident :) IE 6-7 are not officially supported.

## Usage

Constructor:

```js
var frame = new Scrollax(window).init();
```

jQuery proxy:

```js
$(window).Scrollax();
```
or
```js
$.Scrollax();
```

jQuery proxy is good when you want to create an instance and forget about it. For anything more complex, like using methods, events, accessing instance properties, ... use the constructor and work with the instance directly.

## Download

Latest stable release:

- [Production `scrollax.min.js`](https://raw.github.com/iprodev/Scrollax.js/master/scrollax.min.js) - 7KB, 3KB gzipped
- [Development `scrollax.js`](https://raw.github.com/iprodev/Scrollax.js/master/scrollax.js) - 22KB

When isolating issues on jsfiddle, you can use this URL:

- [http://iprodev.github.io/Scrollax.js/lib/scrollax.min.js](http://iprodev.github.io/Scrollax.js/lib/scrollax.min.js)

## Documentation

Can be found in the [docs](https://github.com/iprodev/Scrollax.js/tree/master/docs) directory.

## Contributing

Please, read the [Contributing Guidelines](CONTRIBUTING.md) for this project.

## License

MIT