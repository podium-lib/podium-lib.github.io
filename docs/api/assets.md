---
id: assets
title: Assets
---

When an asset is registered through the `.css()` or `.js()` methods in a podlet
or layout an appropiate `AssetCSS` or `AssetJS` object is created.

The `AssetCSS` or `AssetJS` objects are then available on the `.css` or `.js`
properties of the [`HttpIncoming`](incoming.md) object on a request.

Example of printing the assets set in a podlet:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const podlet = new Podlet([ ... ]);

podlet.css({ value: '/assets/styles.css' });
podlet.js({ value: '/assets/scripts.js', type: 'esm' });

app.get(podlet.content(), (req, res) => {
    const incoming = res.locals.podium;

    console.log(incoming.css)  // array of AssetCSS objects
    console.log(incoming.js)   // array of AssetJS objects

    [ ... ]
});
```

<!--Hapi-->

```js
const podlet = new Podlet([ ... ]);

podlet.css({ value: '/assets/styles.css' });
podlet.js({ value: '/assets/scripts.js', type: 'esm' });

app.route({
    method: 'GET',
    path: podlet.content(),
    handler: (request, h) => {
        const incoming = request.app.podium;

        console.log(incoming.css)  // array of AssetCSS objects
        console.log(incoming.js)   // array of AssetJS objects

        [ ... ]
    },
});
```

<!--Fastify-->

```js
const podlet = new Podlet([ ... ]);

podlet.css({ value: '/assets/styles.css' });
podlet.js({ value: '/assets/scripts.js', type: 'esm' });

app.get(podlet.content(), async (request, reply) => {
    const incoming = reply.app.podium;

    console.log(incoming.css)  // array of AssetCSS objects
    console.log(incoming.js)   // array of AssetJS objects

    [ ... ]
});
```

<!--HTTP-->

```js
const podlet = new Podlet([ ... ]);

podlet.css({ value: '/assets/styles.css' });
podlet.js({ value: '/assets/scripts.js', type: 'esm' });

const server = http.createServer(async (req, res) => {
    let incoming = new HttpIncoming(req, res);
    incoming = await podlet.process(incoming);

    console.log(incoming.css)  // array of AssetCSS objects
    console.log(incoming.js)   // array of AssetJS objects

    [ ... ]
});

server.listen(7100);
```

<!--END_DOCUSAURUS_CODE_TABS-->

When a layout fetches a podlet and parses the podlets manifest, any assets on
the `.css` and `.js` properties in the manifest is also parsed into appropiate
`AssetCSS` or `AssetJS` object.

These `AssetCSS` or `AssetJS` objects are then available on the `.css` or `.js`
properties of the [`Podlet Response`](layout.md#podlet-response) object returned
by the `.client.fetch()` method or emitted by the `beforeStream` event when the
`.client.stream()` method is used.

Example of a layout fetching a podlet and printing the assets of the podlet:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const podlet = layout.client.register({
    name: 'myPodlet',
    uri: 'http://localhost:7100/manifest.json',
});

app.get(layout.pathname(), async (req, res, next) => {
    const incoming = res.locals.podium;

    const response = await podlet.fetch(incoming);

    console.log(response.css)  // array with the podlets AssetCSS objects
    console.log(response.js)   // array with the podlets AssetJS objects

    [ ... ]
});
```

<!--Hapi-->

```js
const podlet = layout.client.register({
    name: 'myPodlet',
    uri: 'http://localhost:7100/manifest.json',
});

app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        const incoming = request.app.podium;

        const response = await podlet.fetch(incoming);

        console.log(response.css)  // array with the podlets AssetCSS objects
        console.log(response.js)   // array with the podlets AssetJS objects

        [ ... ]
    },
});

app.start();
```

<!--Fastify-->

```js
const podlet = layout.client.register({
    name: 'myPodlet',
    uri: 'http://localhost:7100/manifest.json',
});

app.get(layout.pathname(), async (request, reply) => {
    const incoming = reply.app.podium;

    const response = await podlet.fetch(incoming);

    console.log(response.css)  // array with the podlets AssetCSS objects
    console.log(response.js)   // array with the podlets AssetJS objects

    [ ... ]
});
```

<!--HTTP-->

```js
const podlet = layout.client.register({
    name: 'myPodlet',
    uri: 'http://localhost:7100/manifest.json',
});

const server = http.createServer(async (req, res) => {
    let incoming = new HttpIncoming(req, res);
    incoming = await layout.process(incoming);

    const response = await podlet.fetch(incoming);

    console.log(response.css)  // array with the podlets AssetCSS objects
    console.log(response.js)   // array with the podlets AssetJS objects

    [ ... ]
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

## AssetCSS

An `AssetCSS` instance holds information about a Cascading Style Sheet related
to a podlet or layout.

## Properties

An `AssetCSS` instance has the following properties:

| property    | type      | getter  | setter  | default      | details                                                     |
| ----------- | --------- | ------- | ------- | ------------ | ----------------------------------------------------------- |
| value       | `string`  | &check; |         | `''`         | Relative or absolute URL to the CSS asset                   |
| href        | `string`  | &check; |         | `''`         | Alias for the `value` property                              |
| crossorigin | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |
| disabled    | `boolean` | &check; | &check; | `false`      | Correlates to the same attribute on a HTML `<link>` element |
| hreflang    | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |
| title       | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |
| media       | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |
| type        | `string`  | &check; | &check; | `text/css`   | Correlates to the same attribute on a HTML `<link>` element |
| rel         | `string`  | &check; | &check; | `stylesheet` | Correlates to the same attribute on a HTML `<link>` element |
| as          | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |

## Methods

An `AssetCSS` instance has the following methods:

### .toJSON()

Returns JSON representation of the `AssetCSS` instance.

### .toHTML() {

Returns a HTML `link` element as a string of the `AssetCSS` instance.

## AssetJS

An `AssetJS` instance holds information about a Javascript related to a podlet
or layout.

## Properties

An `AssetJS` instance has the following properties:

| property    | type      | getter  | setter  | default      | details                                                     |
| ----------- | --------- | ------- | ------- | ------------ | ----------------------------------------------------------- |
| value       | `string`  | &check; |         | `''`         | Relative or absolute URL to the CSS asset                   |
| href        | `string`  | &check; |         | `''`         | Alias for the `value` property                              |
| crossorigin | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |
| disabled    | `boolean` | &check; | &check; | `false`      | Correlates to the same attribute on a HTML `<link>` element |
| hreflang    | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |
| title       | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |
| media       | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |
| type        | `string`  | &check; | &check; | `text/css`   | Correlates to the same attribute on a HTML `<link>` element |
| rel         | `string`  | &check; | &check; | `stylesheet` | Correlates to the same attribute on a HTML `<link>` element |
| as          | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on a HTML `<link>` element |

## Methods

An `AssetJS` instance has the following methods:

### .toJSON()

Returns JSON representation of the `AssetJS` instance.

### .toHTML() {

Returns a HTML `script` element as a string of the `AssetJS` instance.
