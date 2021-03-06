---
id: version-4.2.0-assets
title: Assets
original_id: assets
---

When an asset is registered through the `.css()` or `.js()` methods in a podlet
or layout an appropriate `AssetCSS` or `AssetJS` object is created.

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

When a layout fetches a podlet and parses the podlet's manifest, any assets on
the `.css` and `.js` properties of the manifest are also parsed into the
appropriate `AssetCSS` or `AssetJS` objects.

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

When fetching one or more podlets from a layout, it's common to then include the
assets from these podlets in the full HTML document being composed in this
layout.

By setting an array of [`Podlet Response`](layout.md#podlet-response) objects
(returned when podlets are requested) on the `HttpIncoming.podlets` property in
a layout, podlet `AssetCSS` and `AssetJS` objects will be set on the properties
`HttpIncoming.css` and `HttpIncoming.js` respectively.

In this way the layout's registered assets, together with assets for all
requested podlets, will be available for the [`document template`](document.md)
in two arrays, one for CSS and another array for JS.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
layout.css({ value: '/assets/styles.css' });
layout.js({ value: '/assets/scripts.js', type: 'esm' });

const podletA = layout.client.register({
    name: 'myPodletA',
    uri: 'http://localhost:7100/manifest.json',
});

const podletB = layout.client.register({
    name: 'myPodletB',
    uri: 'http://localhost:7200/manifest.json',
});

app.get(layout.pathname(), async (req, res, next) => {
    const incoming = res.locals.podium;

    const response = await Promise.all(
        podletA.fetch(incoming),
        podletB.fetch(incoming),
    );

    // This appends the assets from the podlets onto incoming.css and incoming.js
    incoming.podlets = response;

    console.log(incoming.css)  // array with the layouts and podlets AssetCSS objects
    console.log(incoming.js)   // array with the layouts and podlets AssetJS objects

    [ ... ]
});
```

<!--Hapi-->

```js
layout.css({ value: '/assets/styles.css' });
layout.js({ value: '/assets/scripts.js', type: 'esm' });

const podletA = layout.client.register({
    name: 'myPodletA',
    uri: 'http://localhost:7100/manifest.json',
});

const podletB = layout.client.register({
    name: 'myPodletB',
    uri: 'http://localhost:7200/manifest.json',
});

app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        const incoming = request.app.podium;

        const response = await Promise.all(
            podletA.fetch(incoming),
            podletB.fetch(incoming),
        );

        // This appends the assets from the podlets onto incoming.css and incoming.js
        incoming.podlets = response;

        console.log(incoming.css)  // array with the layouts and podlets AssetCSS objects
        console.log(incoming.js)   // array with the layouts and podlets AssetJS objects

        [ ... ]
    },
});

app.start();
```

<!--Fastify-->

```js
layout.css({ value: '/assets/styles.css' });
layout.js({ value: '/assets/scripts.js', type: 'esm' });

const podletA = layout.client.register({
    name: 'myPodletA',
    uri: 'http://localhost:7100/manifest.json',
});

const podletB = layout.client.register({
    name: 'myPodletB',
    uri: 'http://localhost:7200/manifest.json',
});

app.get(layout.pathname(), async (request, reply) => {
    const incoming = reply.app.podium;

    const response = await Promise.all(
        podletA.fetch(incoming),
        podletB.fetch(incoming),
    );

    // This appends the assets from the podlets onto incoming.css and incoming.js
    incoming.podlets = response;

    console.log(incoming.css)  // array with the layouts and podlets AssetCSS objects
    console.log(incoming.js)   // array with the layouts and podlets AssetJS objects

    [ ... ]
});
```

<!--HTTP-->

```js
layout.css({ value: '/assets/styles.css' });
layout.js({ value: '/assets/scripts.js', type: 'esm' });

const podletA = layout.client.register({
    name: 'myPodletA',
    uri: 'http://localhost:7100/manifest.json',
});

const podletB = layout.client.register({
    name: 'myPodletB',
    uri: 'http://localhost:7200/manifest.json',
});

const server = http.createServer(async (req, res) => {
    let incoming = new HttpIncoming(req, res);
    incoming = await layout.process(incoming);

    const response = await Promise.all(
        podletA.fetch(incoming),
        podletB.fetch(incoming),
    );

    // This appends the assets from the podlets onto incoming.css and incoming.js
    incoming.podlets = response;

    console.log(incoming.css)  // array with the layouts and podlets AssetCSS objects
    console.log(incoming.js)   // array with the layouts and podlets AssetJS objects

    [ ... ]
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

## AssetCSS

An `AssetCSS` instance holds information about a Cascading Style Sheet related
to a podlet or layout.

## Properties

An `AssetCSS` instance has the following properties:

| property    | type      | getter  | setter  | default      | details                                                      |
| ----------- | --------- | ------- | ------- | ------------ | ------------------------------------------------------------ |
| value       | `string`  | &check; |         | `''`         | Relative or absolute URL to the CSS asset                    |
| href        | `string`  | &check; |         | `''`         | Alias for the `value` property                               |
| crossorigin | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element |
| disabled    | `boolean` | &check; | &check; | `false`      | Correlates to the same attribute on an HTML `<link>` element |
| hreflang    | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element |
| title       | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element |
| media       | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element |
| type        | `string`  | &check; | &check; | `text/css`   | Correlates to the same attribute on an HTML `<link>` element |
| rel         | `string`  | &check; | &check; | `stylesheet` | Correlates to the same attribute on an HTML `<link>` element |
| as          | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element |

## Methods

An `AssetCSS` instance has the following methods:

### .toJSON()

Returns a JSON representation of the `AssetCSS` instance.

### .toHTML() {

Returns an HTML `<link>` element as a string representation of the `AssetCSS`
instance.

## AssetJS

An `AssetJS` instance holds information about a podlet or layout's Javascript
client side assets.

## Properties

An `AssetJS` instance has the following properties:

| property       | type      | getter  | setter  | default      | details                                                        |
| -------------- | --------- | ------- | ------- | ------------ | -------------------------------------------------------------- |
| value          | `string`  | &check; |         | `''`         | Relative or absolute URL to the CSS asset                      |
| src            | `string`  | &check; |         | `''`         | Alias for the `value` property                                 |
| referrerpolicy | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<script>` element |
| crossorigin    | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<script>` element |
| integrity      | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<script>` element |
| nomodule       | `boolean` | &check; | &check; | `false`      | Correlates to the same attribute on an HTML `<script>` element |
| async          | `boolean` | &check; | &check; | `false`      | Correlates to the same attribute on an HTML `<script>` element |
| defer          | `boolean` | &check; | &check; | `false`      | Correlates to the same attribute on an HTML `<script>` element |
| type           | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<script>` element |

## Methods

An `AssetJS` instance has the following methods:

### .toJSON()

Returns a JSON representation of the `AssetJS` instance.

### .toHTML() {

Returns an HTML `<script>` element as a string representation of the `AssetJS`
instance.
