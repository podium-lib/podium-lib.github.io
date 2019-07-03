---
id: version-4.1.0-layout
title: @podium/layout
original_id: layout
---

Module used for composing HTML pages (layouts) out of page fragments (podlets)
in Podium.

A layout server is mainly responsible for fetching HTML fragments and stitching
these fragments together into an HTML page.

To do this, a layout instance provides three core features:

-   A client used to fetch content from podlets
-   A context used to set request bound information on requests from a layout to its podlets when fetching content from them
-   A proxy that makes it possible to publicly expose podlet data endpoints (or any backend services) via the layout

This module is to be used in conjunction with a Node.js HTTP server. For this,
Express js, Hapi and Fastify are all supported. It's also possible to write your
server using other HTTP frameworks or even just using the core Node.js HTTP
libraries.

Connect compatible middleware based frameworks (such as [Express]) are
considered first class in Podium and as such the layout module provides a
`.middleware()` method for convenience.

For writing layout servers with other HTTP frameworks, please see the
[HTTP Framework Compabillity](api/getting_started.md#http-framework-compabillity)
section.

## Installation

<!--DOCUSAURUS_CODE_TABS-->
<!--HTTP / Express-->

```bash
$ npm install @podium/layout
```

<!--Hapi-->

```bash
$ npm install @podium/layout
$ npm install @podium/hapi-layout
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Getting started

Building a simple layout server including two podlets:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const express = require('express');
const Layout = require('@podium/layout');

const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

const podletA = layout.client.register({
    name: 'myPodletA',
    uri: 'http://localhost:7100/manifest.json',
});

const podletB = layout.client.register({
    name: 'myPodletB',
    uri: 'http://localhost:7200/manifest.json',
});

const app = express();
app.use(layout.middleware());

app.get(layout.pathname(), async (req, res, next) => {
    const incoming = res.locals.podium;

    const [a, b] = await Promise.all([
        podletA.fetch(incoming),
        podletB.fetch(incoming),
    ]);

    res.podiumSend(`
        <section>${a.content}</section>
        <section>${b.content}</section>
    `);
});

app.listen(7000);
```

<!--Hapi-->

```js
const HapiLayout = require('@podium/hapi-layout');
const Layout = require('@podium/layout');
const Hapi = require('hapi');

const app = Hapi.Server({
    host: 'localhost',
    port: 7000,
});

const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

const podletA = layout.client.register({
    name: 'myPodletA',
    uri: 'http://localhost:7100/manifest.json',
});

const podletB = layout.client.register({
    name: 'myPodletB',
    uri: 'http://localhost:7200/manifest.json',
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        const incoming = request.app.podium;

        const [a, b] = await Promise.all([
            podletA.fetch(incoming),
            podletB.fetch(incoming),
        ]);

        h.podiumSend(`
            <section>${a.content}</section>
            <section>${b.content}</section>
        `);

    },
});

app.start();
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Constructor

Create a new layout instance.

```js
const layout = new Layout(options);
```

#### options

| option   | type     | default | required | details                                                             |
| -------- | -------- | ------- | -------- | ------------------------------------------------------------------- |
| name     | `string` | `null`  | &check;  | Name that the layout identifies itself by                           |
| pathname | `string` | `null`  | &check;  | Pathname of where a layout is mounted in an HTTP server             |
| logger   | `object` | `null`  |          | A logger which conforms to the log4j interface                      |
| context  | `object` | `null`  |          | Options to be passed on to the internal @podium/context constructor |
| client   | `object` | `null`  |          | Options to be passed on to the internal @podium/client constructor  |
| proxy    | `object` | `null`  |          | Options to be passed on to the internal @podium/proxy constructor   |

##### name

The name that the layout identifies itself by. This value must be in camelCase.

Example:

```js
const layout = new Layout({
    name: 'myLayoutName',
    pathname: '/foo',
});
```

##### pathname

The Pathname to where the layout is mounted in an HTTP server. It is important
that this value matches the entry point of the route where content is served in
the HTTP server since this value is used to mount the proxy and inform podlets
(through the Podium context) where they are mounted and where the proxy is
mounted.

If the layout is mounted at the server "root", set the `pathname` to `/`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.use(layout.middleware());

app.get('/', (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->

```js
const app = Hapi.Server({
    host: 'localhost',
    port: 7000,
});

const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

If the layout is mounted at `/foo`, set the `pathname` to `/foo`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
});

app.use('/foo', layout.middleware());

app.get('/foo', (req, res, next) => {
    [ ... ]
});

app.get('/foo/:id', (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->

```js
const app = Hapi.Server({
    host: 'localhost',
    port: 7000,
});

const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.route({
    method: 'GET',
    path: '/foo',
    handler: (request, h) => {
        [ ... ]
    },
});

app.route({
    method: 'GET',
    path: '/foo/{id}',
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

There is also a helper method for retrieving the set `pathname` which can be
used to get the pathname from the layout object when defining routes.
See [`.pathname()`](#pathname-1) for further details.

##### logger

Any log4j compatible logger can be passed in and will be used for logging.
Console is also supported for easy test / development.

Example:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
    logger: console,
});
```

Under the hood [abslog] is used to abstract out logging. Please see [abslog] for
further details.

##### context

Options to be passed on to the context parsers.

| option         | type     | default | required | details                                               |
| -------------- | -------- | ------- | -------- | ----------------------------------------------------- |
| debug          | `object` | `null`  |          | Config object passed on to the debug parser           |
| locale         | `object` | `null`  |          | Config object passed on to the locale parser          |
| deviceType     | `object` | `null`  |          | Config object passed on to the device type parser     |
| mountOrigin    | `object` | `null`  |          | Config object passed on to the mount origin parser    |
| mountPathname  | `object` | `null`  |          | Config object passed on to the mount pathname parser  |
| publicPathname | `object` | `null`  |          | Config object passed on to the public pathname parser |

Example of setting the `debug` context to default `true`:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
    context: {
        debug: {
            enabled: true,
        },
    },
});
```

##### client

Options to be passed on to the client.

| option  | type     | default    | required | details                                                                                                |
| ------- | -------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------ |
| retries | `number` | `4`        |          | Number of times the client should retry settling a version number conflict before terminating          |
| timeout | `number` | `1000`     |          | Default value, in milliseconds, for how long a request should wait before the connection is terminated |
| maxAge  | `number` | `Infinity` |          | Default value, in milliseconds, for how long manifests should be cached                                |

Example of setting `retries` on the client to `6`:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
    client: {
        retries: 6,
    },
});
```

##### proxy

Options to be passed on to the proxy.

| option  | type     | default           | required | details                                                                                                |
| ------- | -------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| prefix  | `string` | `podium-resource` |          | Prefix used to namespace the proxy so that it's isolated from other routes in the HTTP server          |
| timeout | `number` | `6000`            |          | Default value, in milliseconds, for how long a request should wait before the connection is terminated |

Example of setting the `timeout` on the proxy to 30 seconds:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
    proxy: {
        timeout: 30000,
    },
});
```

## Layout Instance

The layout instance has the following API:

### .middleware()

A Connect/Express compatible middleware function which takes care of the
various operations needed for a layout to operate correctly. This function is
more or less just a wrapper for the `.process()` method.

**Important:** This middleware must be mounted before defining any routes.

Example

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();
app.use(layout.middleware());
```

<!--END_DOCUSAURUS_CODE_TABS-->

The middleware will create an [`HttpIncoming`](incoming.md) object for each
request and place it on the response at `res.locals.podium`.

Returns an Array of middleware functions which perform the tasks described
above.

### .js(options|[options])

Set relative or absolute URLs to JavaScript assets for the layout.

When set the values will be internally kept and made available for the document
template to include.

This method can be called multiple times with a single options object to set
multiple assets or one can provide an array of options objects to set multiple
assets.

#### options

| option | type      | default   | required | details                                                                                     |
| ------ | --------- | --------- | -------- | ------------------------------------------------------------------------------------------- |
| value  | `string`  |           | &check;  | Relative or absolute URL to the JavaScript asset                                            |
| prefix | `boolean` | `false`   |          | If the `pathname` defined on the constructor should be applied, if relative, to the `value` |
| type   | `string`  | `default` |          | What type of JavaScript (eg. esm, default, cjs)                                             |

##### value

Sets the `pathname` for the layout's JavaScript assets. This value is usually
the [URL] at which the layouts's user facing JavaScript is served and can be
either a URL [pathname] or an absolute URL.

Serve a javascript file at `/assets/main.js`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.get('/assets.js', (req, res) => {
    res.status(200).sendFile('./src/js/main.js', err => {});
});

layout.js({ value: '/assets.js' });
```

<!--Hapi-->

```js
const app = Hapi.Server([ ... ]);
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.register(require('@hapi/inert'));

app.route({
    method: 'GET',
    path: '/assets.js',
    handler: (request, h) => {
        return h.file('./src/js/main.js');
    },
});

layout.js({ value: '/assets.js' });
```

<!--END_DOCUSAURUS_CODE_TABS-->

Serve assets from a static file server and set a relative URI to the JS files:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.use('/assets', express.static('./src/js'));

layout.js([
    { value: '/assets/main.js' },
    { value: '/assets/extra.js' },
]);
```

<!--Hapi-->

```js
const app = Hapi.Server({
    port: 7000,
    routes: {
        files: {
            relativeTo: './src/js/',
        },
    },
});

const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.register(require('@hapi/inert'));

app.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
        },
    },
});

layout.js([
    { value: '/assets/main.js' },
    { value: '/assets/extra.js' },
]);
```

<!--END_DOCUSAURUS_CODE_TABS-->

Set an absolute URL to where the JavaScript file is located:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

layout.js({ value: 'http://cdn.mysite.com/assets/js/e7rfg76.js' });
```

##### prefix

Specify whether the method should prefix the return value with the value for
`pathname` set in the constructor.

Return the full pathname, `/foo/assets/main.js`, to the JavaScript assets:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
});

layout.js({ value: '/assets/main.js', prefix: true });
```

Prefix will be ignored if the returned value is an absolute URL.

##### type

Sets the type for the script which is set. If not set, `default` will be used.

The following are valid values:

-   `esm` for ECMAScript modules
-   `cjs` for CommonJS modules
-   `amd` for AMD modules
-   `umd` for Universal Module Definition
-   `default` if the type is unknown.

The type field provides a hint for further use of the script in the layout.
Typically this is used in the document template when including the `<script>`
tags or when optimizing JavaScript assets with a bundler.

### .css(options|[options])


Set relative or absolute URLs to Cascading Style Sheets (CSS) assets for the
layout.

When set the values will be internally kept and made available for the document
template to include.

This method can be called multiple times with a single options object to set
multiple assets or one can provide an array of options objects to set multiple
assets.

#### options

| option | type      | default | required | details                                                                                          |
| ------ | --------- | ------- | -------- | ------------------------------------------------------------------------------------------------ |
| value  | `string`  |         | &check;  | Relative or absolute URL to the CSS asset                                                        |
| prefix | `boolean` | `false` |          | Whether the `pathname` defined on the constructor should be applied, if relative, to the `value` |

##### value

Sets the `pathname` to the layout's CSS assets. This value can be a [URL] at
which the podlet's user facing CSS is served. It can be a URL [pathname]
or an absolute URL.

Serve a CSS file at `/assets/main.css`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.get('/assets.css', (req, res) => {
    res.status(200).sendFile('./src/js/main.css', err => {});
});

layout.css({ value: '/assets.css' });
```

<!--Hapi-->

```js
const app = Hapi.Server([ ... ]);
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.register(require('@hapi/inert'));

app.route({
    method: 'GET',
    path: '/assets.css',
    handler: (request, h) => {
        return h.file('./src/js/main.css');
    },
});

layout.css({ value: '/assets.css' });
```

<!--END_DOCUSAURUS_CODE_TABS-->

Serve assets from a static file server and set a relative URI to the CSS files:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.use('/assets', express.static('./src/css'));

layout.css([
    { value: '/assets/main.css' },
    { value: '/assets/extra.css' },
]);
```

<!--Hapi-->

```js
const app = Hapi.Server({
    port: 7000,
    routes: {
        files: {
            relativeTo: './src/css/',
        },
    },
});

const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.register(require('@hapi/inert'));

app.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
        },
    },
});

layout.css([
    { value: '/assets/main.css' },
    { value: '/assets/extra.css' },
]);
```

<!--END_DOCUSAURUS_CODE_TABS-->

Set an absolute URL to where the CSS file is located:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

layout.css({ value: 'http://cdn.mysite.com/assets/css/3ru39ur.css' });
```

##### prefix

Sets whether the method should prefix the return value with the `pathname` value
that was set in the constructor.

Returns the full pathname (`/foo/assets/main.css`) to the CSS asset being added:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
});

layout.css({ value: '/assets/main.css', prefix: true });
```

Prefix will be ignored if the returned value is an absolute URL

### .pathname()

A helper method used to retrieve the `pathname` value that was set in the
constructor. This can be handy when defining routes since the `pathname`
set in the constructor must also be the base path for the layout's main content
route

Example:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
});

app.get(layout.pathname(), (req, res, next) => {
    [ ... ]
});

app.get(`${layout.pathname()}/bar`, (req, res, next) => {
    [ ... ]
});

app.get(`${layout.pathname()}/bar/:id`, (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
});

app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        [ ... ]
    },
});

app.route({
    method: 'GET',
    path: `${layout.pathname()}/bar`,
    handler: (request, h) => {
        [ ... ]
    },
});

app.route({
    method: 'GET',
    path: `${layout.pathname()}/bar/{id}`,
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

### .view(template)

Sets the default encapsulating HTML document template.

Takes a template function that accepts an instance of HttpIncoming, a content
string as well as any additional markup for the document's head section:

```js
(incoming, body, head) => `Return an HTML string here`;
```

In practice this might look something like:

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

### .render(HttpIncoming, fragment, [args])

Method to render the document template. By default this will render the docment
template provided by Podium unless a custom document template is set by using
the `.view` method.

In most HTTP frameworks this method can be ignored in favour of
`res.podiumSend()`. If present, `res.podiumSend()` has the advantage that it's
not necessary to pass in [`HttpIncoming`](incoming.md) as the first argument.

Returns a `String`.

This method takes the following arguments:

#### HttpIncoming (required)

An instance of the [`HttpIncoming`](incoming.md) class.

#### fragment

A `String` that is intended to be a fragment of the final HTML document
(Everything to be displayed in the HTML body).

#### [args]

All following arguments given to the method will be passed on to the document
template.

Additional arguments could be used to pass on parts of a page to the document
template as shown:

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

<!--END_DOCUSAURUS_CODE_TABS-->

### .process(HttpIncoming)

Method for processing an incoming HTTP request. This method is intended to be
used to implement support for multiple HTTP frameworks and in most cases it
won't be necessary for layout developers to use this method directly when
creating a layout server.

What it does:

-   Runs context parsers on the incoming request and sets an object with the context at `HttpIncoming.context` which can be passed on to the client when requesting content from podlets.
-   Mounts a proxy so that each podlet can do transparent proxy requests as needed.

Returns a Promise which will resolve with the [`HttpIncoming`](incoming.md)
object that was passed in.

If the inbound request matches a proxy endpoint the returned Promise will
resolve with a [`HttpIncoming`](incoming.md) object where the `.proxy` property
is set to `true`.

This method takes the following arguments:

#### HttpIncoming (required)

An instance of the [`HttpIncoming`](incoming.md) class.

<!--DOCUSAURUS_CODE_TABS-->
<!--HTTP-->

```js
const { HttpIncoming } = require('@podium/utils');
const Layout = require('@podium/layout');

const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

const server = http.createServer(async (req, res) => {
    const incoming = new HttpIncoming(req, res);

    try {
        const result = await layout.process(incoming);
        if (result.proxy) return;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal server error');
    }
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

### .client

A property that exposes an instance of the client for retrieving content from
podlets.

Example of registering two podlets and retrieving their content:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

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

    const [a, b] = await Promise.all([
        podletA.fetch(incoming),
        podletB.fetch(incoming),
    ]);

    [ ... ]
});

app.listen(7000);
```

<!--Hapi-->

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

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

        const [a, b] = await Promise.all([
            podletA.fetch(incoming),
            podletB.fetch(incoming),
        ]);

        [ ... ]
    },
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

### .client.register(options)

Registers a podlet such that the podlet's content can later be fetched.

Example:

```js
const podlet = layout.client.register({
    name: 'myPodlet',
    uri: 'http://localhost:7100/manifest.json',
});
```

Returns a podlet resource `Object` instance which is also stored on the layout
client instance using the registered `name` value as its property name.

Example:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

layout.client.register({
    uri: 'http://foo.site.com/manifest.json',
    name: 'fooBar',
});
layout.client.fooBar.fetch();
```

#### options (required)

| option     | type      | default | required | details                                                                                                                                                      |
| ---------- | --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| uri        | `string`  |         | &check;  | Uri to the manifest of a podlet                                                                                                                              |
| name       | `string`  |         | &check;  | Name of the component. This is used to reference the component in your application, and does not have to match the name of the component itself              |
| retries    | `number`  | `4`     |          | The number of times the client should retry to settle a version number conflict before terminating. Overrides the `retries` option in the layout constructor |
| timeout    | `number`  | `1000`  |          | Defines how long, in milliseconds, a request should wait before the connection is terminated. Overrides the `timeout` option in the layout constructor       |
| throwable  | `boolean` | `false` |          | Defines whether an error should be thrown if a failure occurs during the process of fetching a podlet                                                        |
| resolveJs  | `boolean` | `false` |          | Defines whether to resolve relative URIs to absolute URIs for JavaScript assets                                                                              |
| resolveCss | `boolean` | `false` |          | Defines whether to resolve relative URIs to absolute URIs for CSS assets                                                                                     |

### .client.refresh()

This method will refresh a resource by reading its manifest and fallback
if defined in the manifest. The method will not call the content URI
of a component.

If the internal cache in the client already has a manifest cached, this will
be thrown away and replaced when the new manifest is successfully fetched. If a
new manifest cannot be successfully fetched, the old manifest will be kept in
cache.

If a manifest is successfully fetched, this method will resolve with a `true`
value. If a manifest is not successfully fetched, it will resolve with `false`.

```js
const podlet = layout.client.register({
    uri: 'http://foo.site.com/manifest.json',
    name: 'foo',
});

const status = await podlet.refresh();

console.log(status); // true
```

### .client.refreshManifests()

Refreshes the manifests of all registered resources. Does so by calling the
`.refresh()` method on all resources under the hood.

```js
layout.client.register({
    uri: 'http://foo.site.com/manifest.json',
    name: 'foo',
});

layout.client.register({
    uri: 'http://bar.site.com/manifest.json',
    name: 'bar',
});

await layout.client.refreshManifests();
```

### .client.state

What state the client is in. See the section
"[Podlet update life cycle](#podlet-update-life-cycle)" for more information.

The value will be one of the following values:

-   `instantiated` - When a `Client` has been instantiated but no requests to any podlets have been made.
-   `initializing` - When one or more podlets are requested for the first time.
-   `unstable` - When an update of a podlet is detected and the layout is in the process of re-fetching the manifest.
-   `stable` - When all registered podlets are using cached manifests and only fetching content.
-   `unhealthy` - When an podlet update never settled.

### .context

A property that exposes the instance of the @podium/context used to create the
context.

Example of registering a custom third party context parser with the context
instance:

Register a custom parser for a value that should be appended to the Context.

Example of registering a custom third party context parser to the context:

```js
const Parser = require('my-custom-parser');

const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

layout.context.register('customParser', new Parser('someConfig'));
```

#### name (required)

A unique name for the parser. Used as the key for the parser's value in the
context.

#### parser (required)

The parser object to be registered.

### .metrics

Property that exposes a metric stream. This stream joins all internal metrics
streams into one stream resulting in all metrics from all sub modules being
exposed here.

See [@metrics/metric] for full documentation.

### Events

The Client instance emits the following events:

#### state

When there is a change in state. See the section
"[Podlet update life cycle](#podlet-update-life-cycle)" for more information.

```js
layout.client.on('state', state => {
    console.log(state);
});

const podlet = layout.client.register({
    uri: 'http://foo.site.com/manifest.json',
    name: 'foo',
});

podlet.fetch();
```

The event will fire with one the following values:

-   `instantiated` - When a `Client` has been instantiated but no requests to any podlets have been made.
-   `initializing` - When one or multiple podlets are requested for the very first time.
-   `unstable` - When an update of a podlet is detected and is in the process of refetching the manifest.
-   `stable` - When all registered podlets are using cached manifests and only fetching content.
-   `unhealthy` - When an update of a podlet never settled.

## Podlet Resource Instance

A registered podlet is stored in a Podium resource object.

The Podium resource object contains methods for retrieving the content of a
podlet. The URI of the content of a component is defined in the
component's manifest. This is the content root of the component.

A Podium resource object has the following API:

### .fetch(HttpIncoming, options)

Fetches the content of the podlet. Returns a `Promise` which resolves with a
response object containing the keys `content`, `headers`, `css` and `js`.

#### HttpIncoming (required)

An [`HttpIncoming`](incoming.md) object. This is normally provided by the
"middleware" which runs on the incoming request to the layout prior to the
process of fetching podlets.

The [`HttpIncoming`](incoming.md) object is normally found on a request bound
property of the request or response object.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();

// Creates HttpIncoming and stores it on res.locals.podium
app.use(layout.middleware());

app.get('/', async (req, res, next) => {
    // Get HttpIncoming
    const incoming = res.locals.podium;

    const pod = await podlet.fetch(incoming);
    res.podiumSend(`
        <section>${pod.content}</section>
    `);
});
```

<!--Hapi-->

```js
const app = Hapi.Server({
    host: 'localhost',
    port: 7000,
});

// Creates HttpIncoming and stores it on request.app.podium
app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: await (request, h) => {

        // Get HttpIncoming
        const incoming = request.app.podium;

        const pod = await podlet.fetch(incoming);

        h.podiumSend(`
            <section>${pod.content}</section>
        `);
    },
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

#### options (optional)

| option   | type     | default | required | details                                                                                            |
| -------- | -------- | ------- | -------- | -------------------------------------------------------------------------------------------------- |
| pathname | `string` |         |          | A path which will be appended to the content root of the podlet when requested                     |
| headers  | `object` |         |          | An Object which will be appended as HTTP headers to the request to fetch the podlets's content     |
| query    | `object` |         |          | An Object which will be appended as query parameters to the request to fetch the podlets's content |

#### return value

```js
const result = await component.fetch();
console.log(result.content);
console.log(result.headers);
console.log(result.js);
console.log(result.css);
```

### .stream(HttpIncoming, options)

Streams the content of the component. Returns a `ReadableStream` which streams
the content of the component. Before the stream starts flowing a `beforeStream`
event with a response object, containing `headers`, `css` and `js` references is
emitted.

#### HttpIncoming (required)

An [`HttpIncoming`](incoming.md) object. This is normally provided by the
middleware which runs on the incoming request to the layout prior to the
process of fetching podlets.

The [`HttpIncoming`](incoming.md) object is normally found on a request
bound property of the request or response object.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();
app.use(layout.middleware());

app.get('/', async (req, res, next) => {
    const incoming = res.locals.podium;

    const stream = component.stream(incoming);
    stream.pipe(res);
});
```

<!--Hapi-->

```js
const app = Hapi.Server({
    host: 'localhost',
    port: 7000,
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        const incoming = request.app.podium;

        const stream = component.stream(incoming);
        return h.response(stream);
    },
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

#### options (optional)

| option   | type     | default | required | details                                                                                            |
| -------- | -------- | ------- | -------- | -------------------------------------------------------------------------------------------------- |
| pathname | `string` |         |          | A path which will be appended to the content root of the podlet when requested                     |
| headers  | `object` |         |          | An object which will be appended as HTTP headers to the request to fetch the podlets's content     |
| query    | `object` |         |          | An object which will be appended as query parameters to the request to fetch the podlets's content |

#### Event: beforeStream

A `beforeStream` event is emitted before the stream starts flowing. A response
object with keys `headers`, `js` and `css` is emitted with the event.

`headers` will always contain the response headers from the podlet. If the
resource manifest defines JavaScript assets, `js` will contain the value from
the manifest file otherwise `js` will be an empty string. If the resource
manifest defines CSS assets, `css` will contain the value from the manifest file
otherwise `css` will be an empty string.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
const app = express();
app.use(layout.middleware());

app.get('/', async (req, res, next) => {
    const incoming = res.locals.podium;

    const stream = component.stream(incoming);
    stream.once('beforeStream', data => {
        console.log(data.headers);
        console.log(data.css);
        console.log(data.js);
    });

    stream.pipe(res);
});
```

<!--Hapi-->

```js
const app = Hapi.Server({
    host: 'localhost',
    port: 7000,
});

app.register({
    plugin: new HapiLayout(),
    options: layout,
});

app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        const incoming = request.app.podium;

        const stream = component.stream(incoming);
        stream.once('beforeStream', data => {
            console.log(data.headers);
            console.log(data.css);
            console.log(data.js);
        });

        return h.response(stream);
    },
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

### .name

A property returning the name of the Podium resource. This is the name provided
during the call to `register`.

### .uri

A property returning the location of the Podium resource.

## res.podiumSend(fragment)

Method on the `http.ServerResponse` object for sending HTML fragments. Calls
the send / write method on the `http.ServerResponse` object.

This method wraps the provided fragment in a default HTML document before
dispatching. You can use the `.view()` method to disable using a template or to
set a custom template.

_Example of sending an HTML fragment:_

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
app.get(layout.pathname(), (req, res) => {
    res.podiumSend('<h1>Hello World</h1>');
});
```

<!--Hapi-->

```js
app.route({
    method: 'GET',
    path: layout.pathname(),
    handler: (request, h) => {
        return h.podiumSend('<h2>Hello world</h2>');
    },
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

[express]: https://expressjs.com/ 'Express'
[hapi layout plugin]: https://github.com/podium-lib/hapi-layout 'Hapi Layout Plugin'
[@podium/client constructor]: https://github.com/podium-lib/client#constructor '@podium/client constructor'
[@podium/proxy constructor]: https://github.com/podium-lib/proxy#constructor '@podium/proxy constructor'
[@podium/context]: https://github.com/podium-lib/context '@podium/context'
[@podium/client]: https://github.com/podium-lib/client '@podium/client'
[@podium/proxy]: https://github.com/podium-lib/proxy '@podium/proxy'
[@metrics/metric]: https://github.com/metrics-js/metric '@metrics/metric'
[abslog]: https://github.com/trygve-lie/abslog 'abslog'
