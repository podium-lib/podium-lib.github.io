---
id: context
title: The Podium Context
---

The purpose of the Podium Context is to give a podlet access to background contextual information about each incoming HTTP request so that it can tailor its response accordingly. You can read more regarding the Podium context and how it applies to podlets in the [podlet context guide](/docs/podlet/context.html).

The context, as it applies to Podium layouts, is always created in the layout server for each request to it. The `@podium/layout` module defines a set of context parsers which are run in parallel by Podium layout middleware during each request. The results of these parsers are combined to form a context object which we then pass on to podlets when fetching their content.

As we have seen, you must manually pass the context object on to podlets via a call to `.fetch(ctx)`. This call will convert the context object into Podium context HTTP headers which will in turn be converted back to a context object once received by a podlet.

_Example_

```js
app.get('/', (req, res) => {
    const content = await gettingStarted.fetch(res.locals.podium);
    ...
});
```

### Configuring context parsers

Each of the default context parsers has a default configuration which should cover most use cases. It is, however, possible to overwrite default configuration when constructing a layout.

_Example_

```js
const layout = new Layout({
    ...
    context: {
        debug: {
            enabled: true,
        },
    },
});
```

In this example, we configure the default for the `debug` context parser to be enabled.

See the [@podium/layout](api/layout.md) api docs for more detailed documentation regarding configuring the default context parsers.

### Custom context parsers

It is possible to extend the Podium context by registering any number of additional parsers.

_Example_

```js
const CustomContext = require('my-custom-context-parser');

...

// Register custom context with layout
layout.context.register('my-custom-context', new CustomContext());
```

In the example above, once run via layout middleware, a new camelCased value `myCustomContext` will be available on the Podium context. This will then be sent over HTTP as a header with the name `podium-my-custom-context` when fetching podlet content.
