---
id: podlet
title: @podium/podlet
---

Module for building page fragment servers in a micro frontend architecture.

A podlet server is responsible for generating HTML fragments which can then be
used in a [@podium/layout] server to compose a full HTML page.

This module can be used together with a plain node.js HTTP server or any HTTP
framework and any templating language of your choosing (or none if you prefer).

Connect compatible middleware based frameworks (such as [Express]) are
considered first class in Podium so this module provides a `.middleware()`
method for convenience.

For writing podlet servers with other HTTP frameworks, please see the
[HTTP Framework Compabillity](api/getting_started.md#http-framework-compabillity)
section.

## Installation

<!--DOCUSAURUS_CODE_TABS-->
<!--Default / Express-->
```bash
$ npm install @podium/podlet
```

<!--Hapi-->
```bash
$ npm install @podium/podlet
$ npm install @podium/hapi-podlet
```

<!--Fastify-->
```bash
$ npm install @podium/podlet
$ npm install @podium/fastify-podlet
```
<!--END_DOCUSAURUS_CODE_TABS-->

## Getting started

Building a simple podlet server.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const express = require('express');
const Podlet = require('@podium/podlet');

const app = express();

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    development: true
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    if (res.locals.podium.context.locale === 'nb-NO') {
        return res.status(200).podiumSend('<h2>Hei verden</h2>');
    }
    res.status(200).podiumSend(`<h2>Hello world</h2>`);
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.listen(7100);
```

<!--Hapi-->
```js
const HapiPodlet = require('@podium/hapi-podlet');
const Podlet = require('@podium/podlet');
const Hapi = require('hapi');

const app = Hapi.Server({
    host: 'localhost',
    port: 7100,
});

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    development: true
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: podlet.content(),
    handler: (request, h) => {
        if (request.app.podium.context.locale === 'nb-NO') {
            return h.podiumSend('<h2>Hei verden</h2>');
        }
        return h.podiumSend('<h2>Hello world</h2>');
    },
});

app.route({
    method: 'GET',
    path: podlet.manifest(),
    handler: (request, h) => JSON.stringify(podlet),
});

app.start();
```

<!--Fastify-->
```js
const fastifyPodlet = require('@podium/fastify-podlet');
const fastify = require('fastify');
const Podlet = require('@podium/podlet');

const app = fastify();

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    development: true
});

app.register(fastifyPodlet, podlet);

app.get(podlet.content(), async (request, reply) => {
    if (reply.app.podium.context.locale === 'nb-NO') {
        reply.podiumSend('<h2>Hei verden</h2>');
        return;
    }
    reply.podiumSend('<h2>Hello world</h2>');
});

app.get(podlet.manifest(), async (request, reply) => {
    reply.send(podlet);
});

const start = async () => {
  try {
    await app.listen(7100)
    app.log.info(`server listening on ${app.server.address().port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
};
start();
```
<!--END_DOCUSAURUS_CODE_TABS-->

## Constructor

Create a new podlet instance.

```js
const podlet = new Podlet(options);
```

#### options

| option      | type      | default          | required |
| ----------- | --------- | ---------------- | -------- |
| name        | `string`  |                  | &check;  |
| version     | `string`  |                  | &check;  |
| pathname    | `string`  |                  | &check;  |
| manifest    | `string`  | `/manifest.json` |          |
| content     | `string`  | `/`              |          |
| fallback    | `string`  |                  |          |
| logger      | `object`  |                  |          |
| development | `boolean` | `false`          |          |

##### name

The name the podlet identifies itself by. This is used internally for things
like metrics but can also be used internally in a Layout server.

This value must be in camelCase.

_Example:_

```js
const podlet = new Podlet({
    name: 'myPodlet';
});
```

##### version

The current version of the podlet. It is important that this value be updated
when a new version of the podlet is deployed since the page (layout) that the
podlet is displayed in uses this value to know whether to refresh the podlet's
manifest and fallback content or not.

_Example:_

```js
const podlet = new Podlet({
    version: '1.1.0';
});
```

##### pathname

Pathname for where a podlet is mounted in an HTTP server. It is important that
this value matches where the entry point of a route is in an HTTP server since
this value is used to define where the manifest is for the podlet.

If the podlet is mounted at the "root", set `pathname` to `/`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.use(podlet.middleware());

app.get('/', (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register(fastifyPodlet, podlet);

app.get('/', async (request, reply) => {
    [ ... ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

If the podlet is to be mounted at `/foo`, set pathname to `/foo` and mount
middleware and routes at or under `/foo`

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
});

app.use('/foo', podlet.middleware());

app.get('/foo', (req, res, next) => {
    [ ... ]
});

app.get('/foo/:id', (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
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

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
});

app.register(fastifyPodlet, podlet);

app.get('/foo', async (request, reply) => {
    [ ... ]
});

app.get('/foo/:id', async (request, reply) => {
    [ ... ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

##### manifest

Defines the pathname for the manifest of the podlet. Defaults to
`/manifest.json`.

The value should be relative to the value set on the `pathname` argument. In
other words if a podlet is mounted into an HTTP server at `/foo` and the
manifest is at `/foo/component.json`, set pathname and manifest as follows:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    manifest: '/component.json',
});

app.get('/foo/component.json', (req, res, next) => {
    res.status(200).json(podlet);
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    manifest: '/component.json',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: '/foo/component.json',
    handler: (request, h) => JSON.stringify(podlet),
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    manifest: '/component.json',
});

app.register(fastifyPodlet, podlet);

app.get('/foo/component.json', async (request, reply) => {
    reply.send(podlet);
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

The `.manifest()` method can be used to retrieve the value after it has been
set.

##### content

Defines the pathname for the content of the Podlet. The value can be a relative
or absolute URL. Defaults to `/`.

If the value is relative, the value should be relative to the value set on the
`pathname` argument. In other words if a podlet is mounted into an HTTP server
at `/foo` and the content is at `/foo/index.html`, set pathname and content as
follows:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    content: '/index.html',
});

app.get('/foo/index.html', (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    content: '/index.html',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: '/foo/index.html',
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    content: '/index.html',
});

app.register(fastifyPodlet, podlet);

app.get('/foo/index.html', async (request, reply) => {
    [ ... ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

The `.content()` method can be used to retrieve the value after it has been set.

##### fallback

Defines the pathname for the fallback of the Podlet. The value can be a relative
or absolute URL. Defaults to an empty string.

If the value is relative, the value should be relative to the value set with the
`pathname` argument. In other words if a Podlet is mounted into an HTTP server
at `/foo` and the fallback is at `/foo/fallback.html`, set pathname and fallback
as follows:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    fallback: '/fallback.html',
});

app.get('/foo/fallback.html', (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    fallback: '/fallback.html',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: '/foo/fallback.html',
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    fallback: '/fallback.html',
});

app.register(fastifyPodlet, podlet);

app.get('/foo/fallback.html', async (request, reply) => {
    [ ... ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

The `.fallback()` method can be used to retrieve the value after it has been
set.

##### logger

Any log4j compatible logger can be passed in and will be used for logging.
Console is also supported for easy test / development.

```js
const podlet = new Podlet({
    logger: console;
});
```

Under the hood [abslog] is used to abstract out logging. Please see [abslog] for
further details.

##### development

Turns development mode on or off. See the section about development mode.

## Podlet Instance

The podlet instance has the following API:

### .middleware()

A Connect/Express compatible middleware function which takes care of the
multiple operations needed for a podlet to operate correctly. This function is
more or less a wrapper for the `.process()` method.

**Important:** This middleware must be mounted before defining any routes.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
app.use(podlet.middleware());
```
<!--END_DOCUSAURUS_CODE_TABS-->

Returns an Array of internal middleware that performs the tasks described above.

### .manifest(options)

This method returns the value of the `manifest` argument that has been set on
the constructor.

Set the manifest using the default pathname which is `/manifest.json`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.get(podlet.manifest(), (req, res, next) => {
    res.status(200).json(podlet);
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: podlet.manifest(),
    handler: (request, h) => JSON.stringify(podlet),
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register(fastifyPodlet, podlet);

app.get(podlet.manifest(), async (request, reply) => {
    reply.send(podlet);
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Set the manifest to `/component.json` using the `manifest` argument on the
constructor:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    manifest: '/component.json',
});

app.get(podlet.manifest(), (req, res, next) => {
    res.status(200).json(podlet);
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    manifest: '/component.json',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: podlet.manifest(),
    handler: (request, h) => JSON.stringify(podlet),
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    manifest: '/component.json',
});

app.register(fastifyPodlet, podlet);

app.get(podlet.manifest(), async (request, reply) => {
    reply.send(podlet);
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Podium expects the podlet's manifest route to return a JSON document describing
the podlet. This can be achieved by simply serializing the podlet instance.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet([ ... ]);

app.get(podlet.manifest(), (req, res, next) => {
    res.status(200).json(podlet);
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet([ ... ]);

app.route({
    method: 'GET',
    path: podlet.manifest(),
    handler: (request, h) => JSON.stringify(podlet),
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet([ ... ]);

app.get(podlet.manifest(), async (request, reply) => {
    reply.send(podlet);
});
```
<!--END_DOCUSAURUS_CODE_TABS-->


The route will then respond with something like:

```json
{
    "name": "myPodlet",
    "version": "1.0.0",
    "content": "/",
    "fallback": "/fallback",
    "css": [],
    "js": [],
    "proxy": {}
}
```

#### options

| option | type      | default   | required |
| ------ | --------- | --------- | -------- |
| prefix | `boolean` | `false`   |          |

##### prefix

Sets whether the method should prefix the return value with the value for
`pathname` that was set in the constructor.

Return the full pathname to the manifest (`/foo/component.json`):

```js
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    manifest: '/component.json',
});

podlet.manifest({ prefix: true });
```

### .content(options)

This method returns the value of the `content` argument set in the constructor.

Set the content using the default pathname (`/`):

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.get(podlet.content(), (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: podlet.content(),
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register(fastifyPodlet, podlet);

app.get(podlet.content(), async (request, reply) => {
    [ ... ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Set the content path to `/index.html`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    content: '/index.html',
});

app.get(podlet.content(), (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    content: '/index.html',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: podlet.content(),
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    content: '/index.html',
});

app.register(fastifyPodlet, podlet);

app.get(podlet.content(), async (request, reply) => {
    [ ... ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Set the content path to `/content` and define multiple sub-routes each taking different
URI parameters:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    content: '/content',
});

app.get('/content', (req, res) => { ... });
app.get('/content/info', (req, res) => { ... });
app.get('/content/info/:id', (req, res) => { ... });
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    content: '/content',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: '/content',
    handler: (request, h) => {
        [ ... ]
    },
});

app.route({
    method: 'GET',
    path: '/content/info',
    handler: (request, h) => {
        [ ... ]
    },
});

app.route({
    method: 'GET',
    path: '/content/info/{id}',
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    content: '/content',
});

app.register(fastifyPodlet, podlet);

app.get('/content', async (request, reply) => { ... });
app.get('/content/info', async (request, reply) => { ... });
app.get('/content/info/:id', async (request, reply) => { ... });
```
<!--END_DOCUSAURUS_CODE_TABS-->

#### options

| option | type      | default | required |
| ------ | --------- | ------- | -------- |
| prefix | `boolean` | `false` |          |

##### prefix

Specifies whether the method should prefix the return value with the `pathname` value
that was set in the constructor.

Return the full pathname to the content (`/foo/index.html`):

```js
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    content: '/index.html',
});

podlet.content({ prefix: true });
```

The prefix will be ignored if the returned value is an absolute URL.

### .fallback(options)

This method returns the value of the `fallback` argument set in the constructor.

Set the fallback to `/fallback.html`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    fallback: '/fallback.html',
});

app.get(podlet.fallback(), (req, res, next) => {
    [ ... ]
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    fallback: '/fallback.html',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.route({
    method: 'GET',
    path: podlet.fallback(),
    handler: (request, h) => {
        [ ... ]
    },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    fallback: '/fallback.html',
});

app.register(fastifyPodlet, podlet);

app.get(podlet.fallback(), async (request, reply) => {
    [ ... ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

#### options

| option | type      | default | required |
| ------ | --------- | ------- | -------- |
| prefix | `boolean` | `false` |          |

##### prefix

Specifies whether the fallback method should prefix the return value with the
value for `pathname` set in the constructor.

Return the full pathname to the fallback (`/foo/fallback.html`):

```js
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
    fallback: '/fallback.html',
});

podlet.fallback({ prefix: true });
```

The prefix will be ignored if the returned value is an absolute URL.

### .js(options)

Sets a relative or absolute URL to a javascript asset.

When a value is set it will be internally kept and used when the podlet
instance is serialized into a manifest JSON string. The value will also be
available for the document template to include. The method can be called
multiple times to set multiple values.

Returns the value of the `value` options property.

#### options

| option | type      | default   | required |
| ------ | --------- | --------- | -------- |
| value  | `string`  |           |          |
| prefix | `boolean` | `false`   |          |
| type   | `string`  | `default` |          |


##### value

Sets the `pathname` for the podlets JavaScript assets. This value can be a URL
at which the podlet's user facing JavaScript is served. The value can be either
the [pathname] of a [URL] or an absolute URL.

Serve a javascript file at `/assets/main.js`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.get(podlet.js({ value: '/assets/main.js' }), (req, res) => {
    res.status(200).sendFile('./src/js/main.js', err => {});
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.register(require('@hapi/inert'));

app.route({
    method: 'GET',
    path: podlet.js({ value: '/assets/main.js' }),
    handler: (request, h) => {
        return h.file('./src/js/main.js');
    },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register(fastifyPodlet, podlet);

app.register(require('fastify-static'), {
    root: './src/js/',
});

app.get(podlet.js({ value: '/public/js/main.js' }), (request, reply) => {
    reply.sendFile('main.js');
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Serve assets statically along side the app and set a relative URI to the
JavaScript file:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.use('/assets', express.static('./src/js'));

podlet.js({ value: '/assets/main.js' });
podlet.js({ value: '/assets/extra.js' });
```

<!--Hapi-->
```js
const app = Hapi.Server({
    port: 7000,
    routes: {
        files: {
            relativeTo: './src/js/',
        }
    }
});

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.register(require('@hapi/inert'));

app.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true
        }
    }
});

podlet.js({ value: '/assets/main.js' });
podlet.js({ value: '/assets/extra.js' });
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register(fastifyPodlet, podlet);

app.register(require('fastify-static'), {
    root: './src/js/',
});

app.get('/assets/:file', (request, reply) => {
    reply.sendFile(request.params.file);
});

podlet.js({ value: '/assets/main.js' });
podlet.js({ value: '/assets/extra.js' });
```
<!--END_DOCUSAURUS_CODE_TABS-->

Set an absolute URL to where the javascript file is located:

```js
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

podlet.js({ value: 'http://cdn.mysite.com/assets/js/e7rfg76.js' });
```

##### prefix

Specify whether the method should prefix the return value with the value for
`pathname` that was set in the constructor.

Return the full pathname, `/foo/assets/main.js`, to the JavaScript assets:

```js
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
});

podlet.js({ value: '/assets/main.js', prefix: true });
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
bundler when optimizing javascript assets.

### .css(options)

Sets a relative or absolute URL to a Cascading Style Sheets (CSS) asset.

When a value is set it will be internally kept and used when the podlet
instance is serialized into a manifest JSON string. The value will also be
available for the document template to include. The method can be called
multiple times to set multiple values.

Returns the value of the `value` options property.

#### options

| option | type      | default | required |
| ------ | --------- | ------- | -------- |
| value  | `string`  |         |          |
| prefix | `boolean` | `false` |          |

##### value

Used to set the pathname for the CSS assets for the Podlet. The value can be a
URL at which the podlet's user facing CSS is served. The value can be the
[pathname] of a [URL] or an absolute URL.

The value can be set only once. If called multiple times with a value, the
method will throw. The method can be called multiple times to retrieve the
value however.

Serve a CSS file at `/assets/main.css`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.get(podlet.css({ value: '/assets/main.css' }), (req, res) => {
    res.status(200).sendFile('./src/css/main.css', err => {});
});
```

<!--Hapi-->
```js
const app = Hapi.Server([ ... ]);
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.register(require('@hapi/inert'));

app.route({
    method: 'GET',
    path: podlet.css({ value: '/assets/main.css' }),
    handler: (request, h) => {
        return h.file('./src/css/main.css');
    },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register(fastifyPodlet, podlet);

app.register(require('fastify-static'), {
    root: './src/css/',
});

app.get(podlet.css({ value: '/public/css/main.css' }), (request, reply) => {
    reply.sendFile('main.css');
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Serve assets statically along side the app and set a relative URI to the css
file:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.use('/assets', express.static('./src/css'));

podlet.css({ value: '/assets/main.css' });
podlet.css({ value: '/assets/extra.css' });
```

<!--Hapi-->
```js
const app = Hapi.Server({
    port: 7000,
    routes: {
        files: {
            relativeTo: './src/css/',
        }
    }
});

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.register(require('@hapi/inert'));

app.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true
        }
    }
});

podlet.css({ value: '/assets/main.css' });
podlet.css({ value: '/assets/extra.css' });
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.register(fastifyPodlet, podlet);

app.register(require('fastify-static'), {
    root: './src/css/',
});

app.get('/assets/:file', (request, reply) => {
    reply.sendFile(request.params.file);
});

podlet.css({ value: '/assets/main.css' });
podlet.css({ value: '/assets/extra.css' });
```
<!--END_DOCUSAURUS_CODE_TABS-->

Set an absolute URL to where the CSS file is located:

```js
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

podlet.css({ value: 'http://cdn.mysite.com/assets/css/3ru39ur.css' });
```

##### prefix

Sets whether the method should prefix the return value with the value for
`pathname` set in the constructor.

Return the full pathname (`/foo/assets/main.css`) to the CSS assets:

```js
const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/foo',
});

podlet.css({ value: '/assets/main.css', prefix: true });
```

Prefix will be ignored if the returned value is an absolute URL.

### .proxy({ target, name })

Method for defining proxy targets to be mounted in a layout server. For a
detailed overview of how proxying works, please see the
[proxying guide](podlet/proxying.md) for further details.

When in development mode (`development` is set to `true` on the constructor) the
same proxy endpoints will also be mounted in the Podlet to ease development. By
this, one have the same proxy endpoints to work against in development as one
will have when the Podlet is used in a layout.

Proxying is intended to be used as a way to make podlet endpoints public. A
common use case for this is creating endpoints for client side code to interact
with (ajax requests from the browser). One might also make use of proxying to
pass form submissions from the browser back to the podlet.

This method returns the value of the `target` argument and internally keeps
track of the value of `target` for use when the podlet instance is serialized
into a manifest JSON string.

In a podlet it is possible to define up to 4 proxy targets and each target can
be the [pathname] part of a [URL] or an absolute URL.

For each podlet, each proxy target must have a unique name.

Mounts one proxy target `/api` with the name `api`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet( ... );
app.get(podlet.proxy({ target: '/api', name: 'api' }), (req, res) => { ... });
```

<!--Hapi-->
```js
const app = Hapi.Server( ... );
const podlet = new Podlet( ... );
app.route({
    method: 'GET',
    path: podlet.proxy({ target: '/api', name: 'api' }),
    handler: (request, h) => { ... },
});
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet( ... );
app.get(podlet.proxy({ target: '/api', name: 'api' }), async (request, reply) => {
    ...
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Defines multiple endpoints on one proxy target `/api` with the name `api`:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
const app = express();
const podlet = new Podlet( ... );

app.get('/api', (req, res) => { ... });
app.get('/api/foo', (req, res) => { ... });
app.post('/api/foo', (req, res) => { ... });
app.get('/api/bar/:id', (req, res) => { ... });

podlet.proxy({ target: '/api', name: 'api' });
```

<!--Hapi-->
```js
const app = Hapi.Server( ... );
const podlet = new Podlet( ... );

app.route({
    method: 'GET',
    path: '/api',
    handler: (request, h) => { ... },
});

app.route({
    method: 'GET',
    path: '/api/foo',
    handler: (request, h) => { ... },
});

app.route({
    method: 'POST',
    path: '/api/foo',
    handler: (request, h) => { ... },
});

app.route({
    method: 'GET',
    path: '/api/bar/{id}',
    handler: (request, h) => { ... },
});

podlet.proxy({ target: '/api', name: 'api' });
```

<!--Fastify-->
```js
const app = fastify();
const podlet = new Podlet( ... );

app.get('/api', async (request, reply) => { ... });
app.get('/api/foo', async (request, reply) => { ... });
app.post('/api/foo', async (request, reply) => { ... });
app.get('/api/foo/:id', async (request, reply) => { ... });

podlet.proxy({ target: '/api', name: 'api' });
```
<!--END_DOCUSAURUS_CODE_TABS-->

Sets a remote target by defining an absolute URL:

```js
podlet.proxy({ target: 'http://remote.site.com/api/', name: 'remoteApi' });
```

### .defaults(context)

Alters the default context set when in development mode.

By default this context has the following shape:

```js
{
    debug: 'false',
    locale: 'en-EN',
    deviceType: 'desktop',
    requestedBy: 'the_name_of_the_podlet',
    mountOrigin: 'http://localhost:port',
    mountPathname: '/same/as/manifest/method',
    publicPathname: '/same/as/manifest/method',
}
```

The default development mode context can be overridden by passing an object with
the desired key / values to override.

Example of overriding `deviceType`:

```js
const podlet = new Podlet({
    name: 'foo',
    version: '1.0.0',
});

podlet.defaults({
    deviceType: 'mobile',
});
```

Additional values not defined by Podium can also be appended to the default
development mode context in the same way.

Example of adding a context value:

```js
const podlet = new Podlet({
    name: 'foo',
    version: '1.0.0',
});

podlet.defaults({
    token: '9fc498984f3ewi',
});
```

N.B. The default development mode context will only be appended to the response
when the constructor option `development` is set to `true`.

### .view(template)

Override the default encapsulating HTML document when in development mode.

Takes a function in the following shape:

```js
podlet.view(data => `<!doctype html>
<html lang="${data.locale}">
    <head>
        <meta charset="${data.encoding}">
        <title>${data.title}</title>
        <link href="${data.css}" rel="stylesheet">
        <script src="${title.js}" defer></script>
        ${title.head}
    </head>
    <body>
        ${title.body}
    </body>
</html>`;
);
```

### .process(HttpIncoming)

Method for processing a incoming HTTP request. This method is intended to be
used to implement support for multiple HTTP frameworks and in most cases will
not need to be used directly by library users to create podlet servers.

What it does:

-   Handles detection of development mode and sets appropriate defaults
-   Runs context deserializing on the incoming request and sets a context object at `HttpIncoming.context`.

Returns an [HttpIncoming] object.

The method takes the following arguments:

#### HttpIncoming (required)

An instance of the [HttpIncoming] class.

```js
const { HttpIncoming } = require('@podium/utils');
const Podlet = require('@podium/podlet');

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
});

app.use(async (req, res, next) => {
    const incoming = new HttpIncoming(req, res, res.locals);
    try {
        await podlet.process(incoming);
        if (!incoming.proxy) {
            res.locals.podium = result;
            next();
        }
    } catch (error) {
        next(error);
    }
});
```

## res.podiumSend(fragment)

Method for dispatching an HTML fragment. Calls the `.send()` / `.write()` method
in the framework in use and serves the HTML fragment..

When in development mode, when the constructor option `development` is set to
`true`, this method will wrap the provided fragment in the given document
template before dispatching. When not in development mode, this method will just
dispatch the fragment.

Example of sending an HTML fragment:

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->
```js
app.get(podlet.content(), (req, res) => {
    res.podiumSend('<h1>Hello World</h1>');
});
```

<!--Hapi-->
```js
app.route({
    method: 'GET',
    path: podlet.content(),
    handler: (request, h) => {
        return h.podiumSend('<h2>Hello world</h2>');
    },
});
```

<!--Fastify-->
```js
app.get(podlet.content(), async (request, reply) => {
    reply.podiumSend('<h2>Hello world</h2>');
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

## Development mode

In most cases podlets are fragments of a whole HTML document. When a layout
server is requesting a podlet's content or fallback, the podlet should serve
just that fragment and not a whole HTML document with its `<html>`, `<head>`
and `<body>`. It is also the case that when a layout server is requesting a
podlet it provides a context.

These things can prove challenging for local development since accessing a
podlet directly, from a web browser, in local development will render the
podlet without either an encapsulating HTML document or a Podium context that
the podlet might need to function properly.

To solve this it is possible to switch a podlet to development mode by setting
the `development` argument in the constructor to `true`.

When in development mode a default context on the HTTP response will be set and
an encapsulating HTML document will be provided (so long as `res.podiumSend()`
is used) when dispatching the content or fallback.

The default HTML document for encapsulating a fragment will reference the
values set on `.css()` and `.js()` and use `locale` from the default context to
set language on the document.

The default context in development mode can be altered by the `.defaults()`
method of the podlet instance.

The default encapsulating HTML document used in development mode can be replaced
by the `.view()` method of the podlet instance.

_Note:_ Only turn on development mode during local development, ensure it is
turned off when in production.

Example of turning on development mode only in local development:

```js
const podlet = new Podlet({
    development: process.env.NODE_ENV !== 'production';
});
```

When a layout server sends a request to a podlet in development mode, the
default context will be overridden by the context from the layout server and
the encapsulating HTML document will not be applied.


[@podium/context]: https://github.com/podium-lib/context '@podium/context'
[@podium/layout]: https://github.com/podium-lib/layout '@podium/layout'
[@podium/proxy]: https://github.com/podium-lib/proxy '@podium/proxy'
[express]: https://expressjs.com/ 'Express'
[hapi podlet plugin]: https://github.com/podium-lib/hapi-podlet 'Hapi Podlet Plugin'
[httpincoming]: https://github.com/podium-lib/utils/blob/master/lib/http-incoming.js 'HttpIncoming'
[publicpathname]: https://github.com/podium-lib/context#public-pathname '`publicPathname`'
[mountorigin]: https://github.com/podium-lib/context#mount-origin '`mountOrigin`'
[abslog]: https://github.com/trygve-lie/abslog 'abslog'
[pathname]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname 'pathname'
[url]: https://developer.mozilla.org/en-US/docs/Web/API/URL 'URL'
