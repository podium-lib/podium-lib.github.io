---
id: assets
title: Assets
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

By setting a [`Podlet Response`](layout.md#podlet-response) or an array of [`Podlet Response`](layout.md#podlet-response) objects
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

const podletC = layout.client.register({
    name: 'myPodletC',
    uri: 'http://localhost:7300/manifest.json',
});

app.get(layout.pathname(), async (req, res, next) => {
    const incoming = res.locals.podium;

    const response = await Promise.all(
        podletA.fetch(incoming),
        podletB.fetch(incoming),
    );

    const singleResponse = await podletC.fetch(incoming);

    // This appends the assets from the podlets onto incoming.css and incoming.js
    incoming.podlets = response;

    // A single response is also supported
    incoming.podlets = singleResponse;

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

const podletC = layout.client.register({
    name: 'myPodletC',
    uri: 'http://localhost:7300/manifest.json',
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

        const singleResponse = await podletC.fetch(incoming);

        // This appends the assets from the podlets onto incoming.css and incoming.js
        incoming.podlets = response;

        // A single response is also supported
        incoming.podlets = singleResponse;

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

const podletC = layout.client.register({
    name: 'myPodletC',
    uri: 'http://localhost:7300/manifest.json',
});

app.get(layout.pathname(), async (request, reply) => {
    const incoming = reply.app.podium;

    const response = await Promise.all(
        podletA.fetch(incoming),
        podletB.fetch(incoming),
    );

    const singleResponse = await podletC.fetch(incoming);

    // This appends the assets from the podlets onto incoming.css and incoming.js
    incoming.podlets = response;

    // A single response is also supported
    incoming.podlets = singleResponse;

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

const podletC = layout.client.register({
    name: 'myPodletC',
    uri: 'http://localhost:7300/manifest.json',
});

const server = http.createServer(async (req, res) => {
    let incoming = new HttpIncoming(req, res);
    incoming = await layout.process(incoming);

    const response = await Promise.all(
        podletA.fetch(incoming),
        podletB.fetch(incoming),
    );

    const singleResponse = await podletC.fetch(incoming);

    // This appends the assets from the podlets onto incoming.css and incoming.js
    incoming.podlets = response;

    // A single response is also supported
    incoming.podlets = singleResponse;

    console.log(incoming.css)  // array with the layouts and podlets AssetCSS objects
    console.log(incoming.js)   // array with the layouts and podlets AssetJS objects

    [ ... ]
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

### Asset scope

An optional `scope` property can be used to tell the layout client when to include certain assets and when to exclude them.
In the podlet you can add this property to your assets and the layout client will automatically filter the assets according to response type.

Possible `scope` values are:

- `content` - only include an asset with this scope when the podlet's content route response is successful and the podium client does not fallback.
- `fallback` - only include an asset with this scope when the podlet's content route response is unsuccessful and the podium client does fallback.
- `all` - always include an asset with this scope
- no scope provided - always include an asset with no scope

You can provide scopes for your assets using the `podlet.js` and `podlet.css` methods in your podlets.

```js
podlet.js([
  { value: "https://assets.com/foo/bar/baz.js", scope: "content" },
  { value: "https://assets.com/foo/bar/baz.js", scope: "fallback" },
]);
```

### Asset strategy

An optional `strategy` property can be used to tell the document template about how to load your assets and in which order. In the podlet, you can add this property to your assets and then make use of it inside your document template (this is taken care of for you if you use the default document template).

Possible `strategy` values are:

- `beforeInteractive` - load this asset early. This asset should be loaded as part of the critical render path (CRP) or could be used to perform hydration type tasks.
- `afterInteractive` - load this asset as soon as the page becomes interactive. Most scripts fall into this category. 
- `lazy` - lazy load the asset after everything else on the page is ready. Good for tracking scripts that are non essential for the user experience of the page.

A [document template](document.md) can then make use of these values. See [Customising a document template](document.md#asset-loading-strategy) for more information.

## AssetCSS

An `AssetCSS` instance holds information about a Cascading Style Sheet related
to a podlet or layout.

## Properties

An `AssetCSS` instance has the following properties:

| property    | type      | getter  | setter  | default      | details                                                                                                                                                                             |
| ----------- | --------- | ------- | ------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value       | `string`  | &check; |         | `''`         | Relative or absolute URL to the CSS asset                                                                                                                                           |
| href        | `string`  | &check; |         | `''`         | Alias for the `value` property                                                                                                                                                      |
| crossorigin | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element                                                                                                                        |
| disabled    | `boolean` | &check; | &check; | `false`      | Correlates to the same attribute on an HTML `<link>` element                                                                                                                        |
| hreflang    | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element                                                                                                                        |
| title       | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element                                                                                                                        |
| media       | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element                                                                                                                        |
| type        | `string`  | &check; | &check; | `text/css`   | Correlates to the same attribute on an HTML `<link>` element                                                                                                                        |
| rel         | `string`  | &check; | &check; | `stylesheet` | Correlates to the same attribute on an HTML `<link>` element                                                                                                                        |
| as          | `string`  | &check; | &check; | `undefined`  | Correlates to the same attribute on an HTML `<link>` element                                                                                                                        |
| strategy    | `string`  | &check; | &check; | `undefined`  | Strategy hint for document templates. Possible values are `lazy`, `beforeInteractive` and `afterInteractive`                                                                        |
| scope       | `string`  | &check; | &check; | `undefined`  | Asset scope used by the Podium client to filter assets depending on podlet response type (`content` or `fallback`). Possible values are `content`, `fallback`, `all` or `undefined` |

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

| property       | type      | getter  | setter  | default     | details                                                                                                                                                                             |
| -------------- | --------- | ------- | ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value          | `string`  | &check; |         | `''`        | Relative or absolute URL to the CSS asset                                                                                                                                           |
| src            | `string`  | &check; |         | `''`        | Alias for the `value` property                                                                                                                                                      |
| referrerpolicy | `string`  | &check; | &check; | `undefined` | Correlates to the same attribute on an HTML `<script>` element                                                                                                                      |
| crossorigin    | `string`  | &check; | &check; | `undefined` | Correlates to the same attribute on an HTML `<script>` element                                                                                                                      |
| integrity      | `string`  | &check; | &check; | `undefined` | Correlates to the same attribute on an HTML `<script>` element                                                                                                                      |
| nomodule       | `boolean` | &check; | &check; | `false`     | Correlates to the same attribute on an HTML `<script>` element                                                                                                                      |
| async          | `boolean` | &check; | &check; | `false`     | Correlates to the same attribute on an HTML `<script>` element                                                                                                                      |
| defer          | `boolean` | &check; | &check; | `false`     | Correlates to the same attribute on an HTML `<script>` element                                                                                                                      |
| type           | `string`  | &check; | &check; | `undefined` | Correlates to the same attribute on an HTML `<script>` element                                                                                                                      |
| strategy       | `string`  | &check; | &check; | `undefined` | Strategy hint for document templates. Possible values are `lazy`, `beforeInteractive` and `afterInteractive`                                                                        |
| scope          | `string`  | &check; | &check; | `undefined` | Asset scope used by the Podium client to filter assets depending on podlet response type (`content` or `fallback`). Possible values are `content`, `fallback`, `all` or `undefined` |

## Methods

An `AssetJS` instance has the following methods:

### .toJSON()

Returns a JSON representation of the `AssetJS` instance.

### .toHTML() {

Returns an HTML `<script>` element as a string representation of the `AssetJS`
instance.
