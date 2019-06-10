---
id: document
title: Document Template
---

When developing Podlets which is to be composed together with other Podlets into
a full HTML page by a Layout it is important that the development of the Podlet
happens with the same constrains when developed on in isolation as it will have
when included in a full Layout.

A constrain can as an example be a given CSS class set on the `<body>` tag used
to set certain CSS restrictions on the whole document. If this is not present
when developing a Podlet, the Podlet might end up looking different when
included in a Layout.

To cater for this, Podium has a concept of a document template that is intended
to be used in the Layout servers when serving a full page and in Podlets when
developing Podlets.

A document template is typically a HTML wireframe like this where Layout and
Podlet content goes into the `<body>`:

```html
<!doctype html>
<html lang="en-US">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    </head>
    <body>
        <!-- Layout / Podlet content goes here -->
    </body>
</html>
```

## Rendering

A document template is used by calling the `.render()` or `res.podiumSend()`
methods in the [podlet](api/podlet.md) and [layout](api/podlet.md) modules.

<!--DOCUSAURUS_CODE_TABS-->
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
<!--END_DOCUSAURUS_CODE_TABS-->

## Customizing

Podium is shipped with a [default document template](https://github.com/podium-lib/utils/blob/next/lib/html-document.js)
but it is possible to set a custom document template which can be plugged into
both Layout and Podlet servers.

A custom document template is set by the  `.view()` method in the
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
any type of property, but the value of the `<title>` element is one example.

It is possible to pass on properties to the document template by using the
`.view` property on [`HttpIncoming`](incoming.md).

<!--DOCUSAURUS_CODE_TABS-->
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
<!--END_DOCUSAURUS_CODE_TABS-->

## template(HttpIncoming, fragment, [args])

A document template is implemented by a plain function which returns a `String`.

The document template must take, and will be called by Podium with, the
following arguments:

#### HttpIncoming (required)

An instance of the [`HttpIncoming`](incoming.md) class.

#### fragment

An String that is intended to be a fragment of the final HTML document.

#### [args]

All following arguments given to the `.render()` or `res.podiumSend()` methods
in the [podlet](api/podlet.md) and [layout](api/podlet.md) modules will be
passed on to the document template.

This can as an example be used to pass on parts of a page to the document
template.

<!--DOCUSAURUS_CODE_TABS-->
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

        return podlet.render(incoming, body, head);
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

    const document = podlet.render(incoming, body, head);

    reply.send(document);
});
```
<!--END_DOCUSAURUS_CODE_TABS-->
