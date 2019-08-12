---
id: document
title: Document Template
---

When developing podlets which are to be composed together with other podlets into
a full HTML page by a layout it is important that the development of the podlet
happens under the same constraints when developing in isolation as when running inside a full layout.

One example of such a constraint might be when a given CSS class is set on the `<body>` tag and used
to set certain CSS restrictions on the whole document. If this class is then not present
when developing a podlet, that podlet might end up looking different in isolation from when
its included in a layout.

To cater for this, Podium has a concept of a document template that is intended
to be used in both layout servers when serving a full pages and in podlets when
in development.

A document template is typically an HTML wireframe where layout and
podlet content is placed into the `<body>` section of the document:

```html
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    </head>
    <body>
        <!-- layout / podlet content goes here -->
    </body>
</html>
```

## Rendering

A document template is used by calling the `.render()` methods in the [podlet](api/podlet.md)
and [layout](api/podlet.md) modules or the `res.podiumSend()` provided by
whichever HTTP framework is being used.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
app.get(layout.pathname(), (req, res) => {
    const incoming = res.locals.podium;
    const document = podlet.render(incoming, '<div>content to render</div>');
    res.send(document);
});
```

<!--Hapi-->

```js
app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        const incoming = request.app.podium;
        return podlet.render(incoming, '<div>content to render</div>');
    },
});
```

<!--Fastify-->

```js
app.get(layout.pathname(), (req, res) => {
    const incoming = reply.app.podium;
    const document = podlet.render(incoming, '<div>content to render</div>');
    reply.send(document);
});
```

<!--HTTP-->

```js
const server = http.createServer(async (req, res) => {
    const incoming = new HttpIncoming(req, res);

    const document = layout.render(incoming, '<div>content to render</div>');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(document);
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

## Customizing

Podium ships with a [default document template](api/document.md)
which should cover most uses. It is possible, however, to set a custom document template which can then be plugged into
both layout and podlet servers.

A custom document template is set by using the `.view()` method in the
[podlet](api/podlet.md) and [layout](api/podlet.md) modules.

```js
layout.view((incoming, body, head) => `<!doctype html>
<html lang="${incoming.context.locale}">
    <head>
        <meta charset="${incoming.view.encoding}">
        <title>${incoming.view.title}</title>
        ${head}
    </head>
    <body>
        ${body}
    </body>
</html>`;
);
```

## Request Properties

A document template will need properties which are request bound. This can be
any type of property, but the value of the `<title>` element is one such example.

It is possible to pass on properties to the document template by using the
`.view` property on [`HttpIncoming`](incoming.md).

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
app.get(layout.pathname(), (req, res) => {
    const incoming = res.locals.podium;

    incoming.view = {
        title: `My Site / ${someRequestValue}`,
    };

    const document = layout.render(incoming, '<div>content to render</div>');
    res.send(document);
});
```

<!--Hapi-->

```js
app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        const incoming = request.app.podium;

        incoming.view = {
            title: `My Site / ${someRequestValue}`,
        };

        return layout.render(incoming, '<div>content to render</div>');
    },
});
```

<!--Fastify-->

```js
app.get(layout.pathname(), (req, res) => {
    const incoming = reply.app.podium;

    incoming.view = {
        title: `My Site / ${someRequestValue}`,
    };

    const document = layout.render(incoming, '<div>content to render</div>');
    reply.send(document);
});
```

<!--HTTP-->

```js
const server = http.createServer(async (req, res) => {
    const incoming = new HttpIncoming(req, res);

    incoming.view = {
        title: `My Site / ${someRequestValue}`,
    };

    const document = layout.render(incoming, '<div>content to render</div>');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(document);
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

## template(HttpIncoming, fragment, [args])

A document template is implemented using a plain JavaScript function that returns a `String`.

The document template accepts, and will be called with, the
following arguments:

#### HttpIncoming (required)

An instance of the [`HttpIncoming`](incoming.md) class.

#### fragment

A `String` that is intended to be a used as a fragment in the final HTML document.

#### [args]

All following arguments given to the `.render()` or `res.podiumSend()` methods
in the [podlet](api/podlet.md) and [layout](api/podlet.md) modules will be
passed on to the document template.

The following is an example of how such additional arguments might be used to pass on parts of a page to the document
template.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
layout.view = (incoming, body, head) => {
    return `
        <html>
            <head>${head}</head>
            <body>${body}</body>
        </html>
    `;
};

app.get(layout.pathname(), (req, res) => {
    const incoming = res.locals.podium;

    const head = `<meta ..... />`;
    const body = `<section>my content</section>`;

    const document = layout.render(incoming, body, head);

    res.send(document);
});
```

<!--Hapi-->

```js
layout.view = (incoming, body, head) => {
    return `
        <html>
            <head>${head}</head>
            <body>${body}</body>
        </html>
    `;
};

app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        const incoming = request.app.podium;

        const head = `<meta ..... />`;
        const body = `<section>my content</section>`;

        return layout.render(incoming, body, head);
    },
});
```

<!--Fastify-->

```js
layout.view = (incoming, body, head) => {
    return `
        <html>
            <head>${head}</head>
            <body>${body}</body>
        </html>
    `;
};

app.get(layout.pathname(), (req, res) => {
    const incoming = reply.app.podium;

    const head = `<meta ..... />`;
    const body = `<section>my content</section>`;

    const document = layout.render(incoming, body, head);

    reply.send(document);
});
```

<!--HTTP-->

```js
layout.view = (incoming, body, head) => {
    return `
        <html>
            <head>${head}</head>
            <body>${body}</body>
        </html>
    `;
};

const server = http.createServer(async (req, res) => {
    const incoming = new HttpIncoming(req, res);

    const head = `<meta ..... />`;
    const body = `<section>my content</section>`;

    const document = layout.render(incoming, body, head);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(document);
});
```

<!--END_DOCUSAURUS_CODE_TABS-->
