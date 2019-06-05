---
id: layout
title: @podium/layout
---

Module for composing full page layouts out of page fragments (Podlets in Podium
speak) in a micro frontend architecture.

A layout server is mainly responsible for fetching HTML fragments and stitching
these fragments into an full HTML page.

To do this, a layout instance provides three core features:

-   A client used to fetch content from podlets
-   A context used to set request bound information on the requests from the layout to podlets when fetching their content
-   A proxy making it possible to publicly expose data endpoints in a podlet or in any backend service

This module can be used together with a plain node.js HTTP server or any HTTP
framework and any templating language of your choosing (or none if you prefer).

Connect compatible middleware based frameworks (such as [Express]) are
considered first class in Podium so this module provides a `.middleware()`
method for convenience.

For writing layout servers with other HTTP frameworks, please see the
[HTTP Framework Compabillity](api/getting_started.md#http-framework-compabillity)
section.

## Installation


<!--DOCUSAURUS_CODE_TABS-->
<!--Default / Express-->
```bash
$ npm install @podium/layout
```

<!--Hapi-->
```bash
$ npm install @podium/layout
$ npm install @podium/hapi-layout
```

<!--Fastify-->
```bash
$ npm install @podium/layout
$ npm install @podium/fastify-layout
```
<!--END_DOCUSAURUS_CODE_TABS-->

## Getting started

Build a simple layout server including two podlets:

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

app.get('/', async (req, res, next) => {
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

## Constructor

Create a new Layout instance.

```js
const layout = new Layout(options);
```

#### options

| option   | type     | default  | required | details                                                             |
| -------- | -------- | -------- | -------- | ------------------------------------------------------------------- |
| name     | `string` | `null`   | &check;  | Name that the Layout identifies itself by                           |
| pathname | `string` | `null`   | &check;  | Pathname of where a Layout is mounted in a HTTP server              |
| logger   | `object` | `null`   |          | A logger which conform to a log4j interface                         |
| context  | `object` | `null`   |          | Options to be passed on to the internal @podium/context constructor |
| client   | `object` | `null`   |          | Options to be passed on to the internal @podium/client constructor  |
| proxy    | `object` | `null`   |          | Options to be passed on to the internal @podium/proxy constructor   |

##### name

Name that the layout identifies itself by. The name value must be in camelCase.

Example:

```js
const layout = new Layout({
    name: 'myLayoutName',
    pathname: '/foo',
});
```

##### pathname

The Pathname of where the Layout is mounted into the HTTP server. It is
important that this value matches where the entry point of a route is in the
HTTP server since this value is used to mount the proxy and tell podlets
(through the context) where they are mounted and where the proxy is mounted.

If the layout is mounted at the server "root", set `pathname` to `/`:

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

If the layout is mounted at `/foo`, set pathname to `/foo`:

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

There is also a helper method for retrieving the set `pathname` which can be
used to get the pathname from the Layout object when defining routes.
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
| --------| -------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------ |
| retries | `number` | `4`        |          | Number of times the client should retry to settle a version number conflict before terminating         |
| timeout | `number` | `1000`     |          | Default value, in milliseconds, for how long a request should wait before the connection is terminated |
| maxAge  | `number` | `Infinity` |          | Default value, in milliseconds, for how long the manifests should be cached                            |

Example of setting the `retries` on the client to `6`:

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
| --------| -------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| prefix  | `string` | `podium-resource` |          | Prefix used to namespace the proxy so its isolated from other routes in a HTTP server                  |
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

## Layout Instanse

The Layout instance has the following API:

### .middleware()

A Connect/Express compatible middleware function which takes care of the
multiple operations needed for a Layout to operate correctly. This function is
more or less a wrapper for the `.process()` method.

**Important:** This middleware must be mounted before defining any routes.

Example

```js
const app = express();
app.use(layout.middleware());
```

The middleware will create a [`HttpIncoming`](incoming.md) object and store it
at `res.locals.podium`.

Returns an Array of internal middleware performing the tasks described above.

### .js(options)

Sets a relative or absolute URL to a JavaScript asset for the Layout.

The value will be available for the document template to include. The method can
be called multiple times to set multiple values.

#### options

| option | type      | default   | required | details                                                                                     |
| ------ | --------- | --------- | -------- | ------------------------------------------------------------------------------------------- |
| value  | `string`  |           | &check;  | Relative or absolute URL to the JavaScript asset                                            |
| prefix | `boolean` | `false`   |          | If the `pathname` defined on the constructor should be applied, if relative, to the `value` |
| type   | `string`  | `default` |          | What type of JavaScript                                                                     |

##### value

Sets the `pathname` for the Layout's JavaScript assets. This value can be a URL
at which the Layouts's user facing JavaScript is served. The value can be either
the [pathname] of a [URL] or an absolute URL.

_Examples:_

Serve a javascript file at `/assets/main.js`:

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.get(layout.js({ value: '/assets/main.js' }), (req, res) => {
    res.status(200).sendFile('./app/assets/main.js', err => {});
});
```

Serve assets statically along side the app and set a relative URI to the
JavaScript file:

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.use('/assets', express.static('./app/files/assets'));
layout.js({ value: '/assets/main.js' });
```

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

_Examples:_

Return the full pathname, `/foo/assets/main.js`, to the JavaScript assets:

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
});

layout.js({ value: '/assets/main.js', prefix: true });
```

Prefix will be ignored if the returned value is an absolute URL.

##### type

Set the type of script which is set. If not set, `default` will be used.

Use one of the following values:

 - `esm` for ECMAScript modules
 - `cjs` for CommonJS modules
 - `amd` for AMD modules
 - `umd` for Universal Module Definition
 - `default` if the type is unknown.

The type is a hint for further use of the script. This is normally used by the
document template to print correct `<script>` tag or to give a hint to a
bundler when optimizing JavaScript assets.

### .css(options)

Sets a relative or absolute URL to a Cascading Style Sheets (CSS) asset.

The value will be available for the document template to include. The method can
be called multiple times to set multiple values.

#### options

| option | type      | default   | required | details                                                                                     |
| ------ | --------- | --------- | -------- | ------------------------------------------------------------------------------------------- |
| value  | `string`  |           | &check;  | Relative or absolute URL to the CSS asset                                            |
| prefix | `boolean` | `false`   |          | If the `pathname` defined on the constructor should be applied, if relative, to the `value` |

##### value

Sets the `pathname` for the CSS assets for the Layout. The value can be a URL at
which the podlet's user facing CSS is served. The value can be the [pathname] of
a [URL] or an absolute URL.

_Examples:_

Serve a CSS file at `/assets/main.css`:

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.get(layout.css({ value: '/assets/main.css' }), (req, res) => {
    res.status(200).sendFile('./app/assets/main.css', err => {});
});
```

Serve assets from a static file server and set a relative URI to the CSS file:

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.use('/assets', express.static('./app/files/assets'));
layout.css({ value: '/assets/main.css' });
```

Set an absolute URL to where the CSS file is located:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

layout.css({ value: 'http://cdn.mysite.com/assets/css/3ru39ur.css' });
```

##### prefix

Sets whether the method should prefix the return value with the value for
`pathname` set in the constructor.

_Examples:_

Return the full pathname (`/foo/assets/main.css`) to the CSS assets:

```js
const app = express();
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo',
});

layout.css({ value: '/assets/main.css', prefix: true });
```

Prefix will be ignored if the returned value is an absolute URL

### .pathname()

A helper method to retrieve the `pathname` set on the constructor. This can be
handy to use in defining routes since the `pathname` set in the constructor
must match whatever is defined as root in each route in a HTTP router.

Example:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/foo'
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

### .view(template)

Set the default encapsulating HTML document template.

Takes a function with the following shape:

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

Method to render the document template. Will by default render the docment
template provided by Podium unless a custom document template is set on the
`.view` method.

In most http frameworks this method can be ignored in favour of
`res.podiumSend()`. If pressent, `res.podiumSend()` has the advantage that one
do not need to pass in [`HttpIncoming`](incoming.md) as the first argument.

Returns a `String`.

The method takes the following arguments:

#### HttpIncoming (required)

An instance of the [`HttpIncoming`](incoming.md) class.

```js
app.get('/', (req, res) => {
    const incoming = res.locals.podium;
    const document = layout.render(incoming, '<div>content to render</div>');
    res.send(document);
});
```

#### fragment

An String that is intended to be a fragment of the final HTML document.

```js
layout.render(incoming, '<div>content to render</div>');
```

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

### .process(HttpIncoming)

Method for processing an incoming HTTP request. This method is intended to be
used to implement support for multiple HTTP frameworks and it should not normally be
necessary to use this method directly when creating a layout server.

What it does:

-   Runs context parsers on the incoming request and sets an object with the context at `HttpIncoming.context` which can be passed on to the client when requesting content from podlets.
-   Mounts the proxy so each podlet can do transparent proxy requests if needed.

Returns a Promise. If the inbound request matches a proxy endpoint the returned
Promise will resolve with `undefined`. If the inbound request does not match a
proxy endpoint the returned Promise will resolve with the passed in
[`HttpIncoming`](incoming.md) object.

The method takes the following arguments:

#### HttpIncoming (required)

An instance of an [`HttpIncoming`](incoming.md) class.

```js
const { HttpIncoming } = require('@podium/utils');
const Layout = require('@podium/layout');

const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

app.use(async (req, res, next) => {
    const incoming = new HttpIncoming(req, res, res.locals);
    try {
        const result = await layout.process(incoming);
        if (result) {
            res.locals.podium = result;
            next();
        }
    } catch (error) {
        next(error);
    }
});
```

### .client

A property that exposes an instance of the client for fetching content from
podlets.

Example of registering a podlet and fetching it:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

const podlet = layout.client.register({
    name: 'myPodlet',
    uri: 'http://localhost:7100/manifest.json',
});

podlet.fetch({}).then(result => {
    console.log(result);
});
```

### .client.register(options)

Registers a Podlet for later retriaval.

Example:

```js
const podlet = layout.client.register({
    name: 'myPodlet',
    uri: 'http://localhost:7100/manifest.json',
});
```

Returns a Podlet Resource Object instace.

The created Podlet Resource Object instance is also stored on the Layout
instance. It is stored with the `name` as its property name.

Example:

```js
const layout = new Layout({
    name: 'myLayout',
    pathname: '/',
});

layout.client.register({ uri: 'http://foo.site.com/manifest.json', name: 'fooBar' });
layout.client.fooBar.fetch();
```

#### options (required)

| option     | type       | default   | required | details                                                                                                                                               |
| ---------- | ---------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| uri        | `string`   |           | &check;  | Uri to the manifest of a podium component                                                                                                             |
| name       | `string`   |           | &check;  | Name of the component. This is used to reference the component in your application, and does not have to match the name of the component itself       |
| retries    | `number`   | `4`       |          | The number of times the client should retry to settle a version number conflict before terminating. Overrides the `retries` on the Layout constructor |
| timeout    | `number`   | `1000`    |          | Defines how long, in milliseconds, a request should wait before the connection is terminated. Overrides the `timeout` on the Layout constructor       |
| throwable  | `boolean`  | `false`   |          | Defines whether an error should be thrown if a failure occurs during the process of fetching a podium component                                       |
| resolveJs  | `boolean`  | `false`   |          | Defines whether to resolve relative URIs to absolute URIs for JavaScript assets                                                                       |
| resolveCss | `boolean`  | `false`   |          | Defines whether to resolve relative URIs to absolute URIs for CSS assets                                                                              |

### .client.refresh()

This method will refresh a resource by reading its manifest and fallback
if defined in the manifest. The method will not call the URI to the content
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
    name: 'foo'
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
    name: 'foo'
});

layout.client.register({
    uri: 'http://bar.site.com/manifest.json',
    name: 'bar'
});

await layout.client.refreshManifests();
```

### .client.state

What state the client is in. See the section
"[Podlet update life cycle](#podlet-update-life-cycle)" for more information.

The event will fire with the following value:

-   `instantiated` - When a `Client` has been instantiated but no requests to any podlets has been made.
-   `initializing` - When one or multiple podlets are requested for the very first time.
-   `unstable` - When an update of a podlet is detected and is in the process of refetching the manifest.
-   `stable` - When all registered podlets are using cached manifests and only fetching content.
-   `unhealthy` - When an update of a podlet never settled.

### .context

A property that exposes an instance of the Context object used to create a
context.

### .context.register(name, parser)

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

A unique name of the parser. Used as the key for the parser's value in the
context.

#### parser (required)

The parser object to be registered.

### .metrics

Property that exposes a metric stream. This stream joins all internal metrics
streams into one stream resulting in all metrics from all sub modules being
exposed here.

Please see [@metrics/metric] for full documentation.

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

The event will fire with the following value:

-   `initializing` - When one or multiple podlets are requested for the very first time.
-   `unstable` - When an update of a podlet is detected and is in the process of refetching the manifest.
-   `stable` - When all registered podlets are using cached manifests and only fetching content.
-   `unhealthy` - When an update of a podlet never settled.

## Podlet Resource Instanse

A registered Podium component is stored in a Podium Resource Object.

The Podium Resource Object contains methods for retrieving the content of a
Podium component. The URI to the content of a component is defined in the
component's manifest. This is the content root of the component.

A Podium Resource Object has the following API:

### .fetch(HttpIncoming, options)

Fetches the content of the Podlet. Returns a `Promise` which resolves with a
Response object containing the keys `content`, `headers`, `css` and `js`.

#### HttpIncoming (required)

A [`HttpIncoming`](incoming.md) object. This is normally provided by the
"middleware" which run on the incoming request to the Layout previous to the
process of fetching Podlets.

The [`HttpIncoming`](incoming.md) object is normally to be found on a request
bound property of the request or response object.

```js
const app = express();
app.use(layout.middleware());

app.get('/', async (req, res, next) => {

    // get HttpIncoming
    const incoming = res.locals.podium;

    const pod = await podlet.fetch(incoming);
    res.podiumSend(`
        <section>${pod.content}</section>
    `);
});
```

#### options (optional)

| option   | type      | default   | required | details                                                                                            |
| -------- | --------- | --------- | -------- | -------------------------------------------------------------------------------------------------- |
| pathname | `string`  |           |          | A path which will be appended to the content root of the Podlet when requested                     |
| headers  | `object`  |           |          | An Object which will be appended as http headers to the request to fetch the Podlets's content     |
| query    | `object`  |           |          | An Object which will be appended as query parameters to the request to fetch the Podlets's content |

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
with a Response object, containing `headers`, `css` and `js` references is
emitted.

#### HttpIncoming (required)

A [`HttpIncoming`](incoming.md) object. This is normally provided by the
"middleware" which run on the incoming request to the Layout previous to the
process of fetching Podlets.

The [`HttpIncoming`](incoming.md) object is normally to be found on a request
bound property of the request or response object.

```js
const app = express();
app.use(layout.middleware());

app.get('/', async (req, res, next) => {

    // get HttpIncoming
    const incoming = res.locals.podium;

    const stream = component.stream(incoming);
    stream.pipe(res);
});
```

#### options (optional)

| option   | type      | default   | required | details                                                                                            |
| -------- | --------- | --------- | -------- | -------------------------------------------------------------------------------------------------- |
| pathname | `string`  |           |          | A path which will be appended to the content root of the Podlet when requested                     |
| headers  | `object`  |           |          | An Object which will be appended as http headers to the request to fetch the Podlets's content     |
| query    | `object`  |           |          | An Object which will be appended as query parameters to the request to fetch the Podlets's content |

#### Event: beforeStream

A `beforeStream` event is emitted before the stream starts flowing. An response
object with keys `headers`, `js` and `css` is emitted with the event.

`headers` will always contain the response headers from the podlet. If the
resource manifest defines JavaScript assets, `js` will contain the value from
the manifest file otherwise `js` will be an empty string. If the resource
manifest defines CSS assets, `css` will contain the value from the manifest file
otherwise `css` will be an empty string.

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





### .name

A property returning the name of the podium resource. This is the name provided
during the call to `register`.

### .uri

A property returning the location of the podium resource.





## res.podiumSend(fragment)

Method on the `http.ServerResponse` object for sending an HTML fragment. Calls
the send / write method on the `http.ServerResponse` object.

This method will wrap the provided fragment in a default HTML document before dispatching.
You can use the `.view()` method to disable using a template or to set a custom template.

_Example of sending an HTML fragment:_

```js
app.get(layout.pathname(), (req, res) => {
    res.podiumSend('<h1>Hello World</h1>');
});
```

_Example of sending additional content with an HTML fragment:_

```js
app.get(layout.pathname(), (req, res) => {
    res.podiumSend({
        title: 'Document title',
        head: '<script src="additional-script.js" defer></script>',
        body: '<h1>Hello World</h1>',
    });
});
```


[express]: https://expressjs.com/ 'Express'
[hapi layout plugin]: https://github.com/podium-lib/hapi-layout 'Hapi Layout Plugin'
[@podium/client constructor]: https://github.com/podium-lib/client#constructor '@podium/client constructor'
[@podium/proxy constructor]: https://github.com/podium-lib/proxy#constructor '@podium/proxy constructor'
[@podium/context]: https://github.com/podium-lib/context '@podium/context'
[@podium/client]: https://github.com/podium-lib/client '@podium/client'
[@podium/proxy]: https://github.com/podium-lib/proxy '@podium/proxy'
[@metrics/metric]: https://github.com/metrics-js/metric '@metrics/metric'
[abslog]: https://github.com/trygve-lie/abslog 'abslog'
