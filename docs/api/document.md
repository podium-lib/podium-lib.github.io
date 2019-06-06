---
id: document
title: Document Template
---

When developing Podlets which is to be composed together with other Podlets into
a full HTML page by a Layout it is important that the development of the Podlet
happens with the same constrains when developed on in isolation as it will have
when included in a full Layout.

A constrains can as an example be a given css class set on the `<body>` tag used
to set certain CSS restrictions on the whole document. If this is not present
when developing a Podlet, the Podlet might end up looking different when
included in a Layout.

To cater for this, Podium has a concept of a document template that is intended
to be used in both Layout servers when serving a full page and in Podlets when
being developed.

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

Podium is shipped with a [default document template](https://github.com/podium-lib/utils/blob/next/lib/html-document.js)
but its possible to set a custom document template which can be plugged into
both Layout and Podlet servers.

## template(HttpIncoming, fragment, [args])

A document template is implemented by a plain function which returns a `String`.

The document template must take, and will be call by Podium with the
following arguments:

#### HttpIncoming (required)

An instance of the [`HttpIncoming`](incoming.md) class.

#### fragment

An String that is intended to be a fragment of the final HTML document.

#### [args]

All following arguments given to the method will be passed on to the document
template. This can as an example be used to pass on parts of a page to the
document template.

```js
layout.view = (incoming, body, head) => {
    return `
        <html>
            <head>${head}</head>
            <body>${body}</body>
        </html>
    `;
};

app.get('/', async (req, res, next) => {
    const incoming = res.locals.podium;

    const head = `<meta ..... />`;
    const body = `<section>my content</section>`;

    const document = layout.render(incoming, body, head);
    res.send(document);
});
```