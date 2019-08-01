---
id: podlet
title: @podium/podlet
---

Module for building page fragment servers for micro frontend architectures.

A podlet server is responsible for generating HTML fragments which can then be
used in a [@podium/layout] server to compose a full HTML page.

This module can be used together with a plain Node.js HTTP server or any HTTP
framework and any templating language of your choosing (or none if you prefer).

Connect compatible middleware based frameworks (such as [Express]) are
considered first class in Podium and so this module provides a `.middleware()`
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
    development: true,
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
    development: true,
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
    development: true,
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
        await app.listen(7100);
        app.log.info(`server listening on ${app.server.address().port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Constructor

Create a new Podlet instance.

```js
const podlet = new Podlet(options);
```

#### options

| option      | type      | default          | required | details                                                 |
| ----------- | --------- | ---------------- | -------- | ------------------------------------------------------- |
| name        | `string`  | `null`           | &check;  | Name that the Podlet identifies itself by               |
| pathname    | `string`  | `null`           | &check;  | Pathname of where a Podlet is mounted in an HTTP server |
| version     | `string`  | `null`           | &check;  | The current version of the podlet                       |
| manifest    | `string`  | `/manifest.json` |          | Defines the pathname for the manifest of the podlet     |
| content     | `string`  | `/`              |          | Defines the pathname for the content of the podlet      |
| fallback    | `string`  | `null`           |          | Defines the pathname for the fallback of the podlet     |
| logger      | `object`  | `null`           |          | A logger which conforms to a log4j interface            |
| development | `boolean` | `false`          |          | Turns development mode on or off                        |

##### name

The name that the podlet identifies itself by. This is used internally for things
like metrics but can also be used by a layout server.

This value must be in camelCase.

_Example:_

```js
const podlet = new Podlet({
    name: 'myPodlet';
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

If the podlet is to be mounted at `/foo`, set the pathname to `/foo` and mount
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

##### manifest

Defines the pathname for the manifest of the podlet. Defaults to
`/manifest.json`.

The value should be relative to the value set on the `pathname` argument. In
other words if a podlet is mounted into an HTTP server at `/foo` and the
manifest is at `/foo/component.json`, set the pathname and manifest as follows:

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

If the value is relative, the value should be relative to the value set using the
`pathname` argument. For example, if a podlet is mounted into an HTTP server
at `/foo` and the content is served at `/foo/index.html`, set pathname and content as
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
`pathname` argument. If a podlet is mounted into an HTTP server
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

The middleware will create an [`HttpIncoming`](incoming.md) object and store it
at `res.locals.podium`.

Returns an Array of internal middleware that performs the tasks described above.

### .manifest(options)

This method returns the value of the `manifest` argument that has been set in
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

| option | type      | default | required |
| ------ | --------- | ------- | -------- |
| prefix | `boolean` | `false` |          |

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

### .js(options|[options])

Set relative or absolute URLs to JavaScript assets for the podlet.

When set the values will be internally kept and made available for the document
template to include. The assets set are also made available in the manifest for
the layout to consume.

This method can be called multiple times with a single options object to set
multiple assets or one can provide an array of options objects to set multiple
assets.

#### options

| option | type      | default   | required | details                                          |
| ------ | --------- | --------- | -------- | ------------------------------------------------ |
| value  | `string`  |           | &check;  | Relative or absolute URL to the JavaScript asset |
| type   | `string`  | `default` |          | What type of JavaScript (eg. esm, default, cjs)  |

##### value

Sets the `pathname` for the podlet's JavaScript assets. This value can be a URL
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

app.get('/assets.js', (req, res) => {
    res.status(200).sendFile('./src/js/main.js', err => {});
});

podlet.js({ value: '/assets.js' });
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
    path: '/assets.js',
    handler: (request, h) => {
        return h.file('./src/js/main.js');
    },
});

podlet.js({ value: '/assets.js' });
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

app.get('/assets.js', (request, reply) => {
    reply.sendFile('main.js');
});

podlet.js({ value: '/assets.js' });
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

podlet.js([
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
            redirectToSlash: true,
        },
    },
});

podlet.js([
    { value: '/assets/main.js' },
    { value: '/assets/extra.js' },
]);
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

podlet.js([
    { value: '/assets/main.js' },
    { value: '/assets/extra.js' },
]);
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

##### type

Set the type of script which is set. If not set, `default` will be used.

Use one of the following values:

-   `esm` for ECMAScript modules
-   `cjs` for CommonJS modules
-   `amd` for AMD modules
-   `umd` for Universal Module Definition
-   `default` if the type is unknown.

The type is a hint for further use of the script. This is normally used by the
document template to print correct `<script>` tag or to give a hint to a
bundler when optimizing JavaScript assets.

### .css(options|[options])

Set relative or absolute URLs to Cascading Style Sheets (CSS) assets for the
podlet.

When set the values will be internally kept and made available for the document
template to include. The assets set are also made available in the manifest for
the layout to consume.

The method can be called multiple times with a single options object to set
multiple assets or one can provide an array of options objects to set multiple
assets.

#### options

| option | type      | default | required | details                                   |
| ------ | --------- | ------- | -------- | ----------------------------------------- |
| value  | `string`  |         | &check;  | Relative or absolute URL to the CSS asset |

##### value

Sets the `pathname` for the CSS assets for the Podlet. The value can be a URL at
which the podlet's user facing CSS is served. The value can be the [pathname] of
a [URL] or an absolute URL.

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

app.get('/assets.css', (req, res) => {
    res.status(200).sendFile('./src/css/main.css', err => {});
});

podlet.css({ value: '/assets.css' });
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
    path: '/assets.css',
    handler: (request, h) => {
        return h.file('./src/css/main.css');
    },
});

podlet.css({ value: '/assets.css' });
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

app.get('/assets.css', (request, reply) => {
    reply.sendFile('main.css');
});

podlet.css({ value: '/assets.css' });
```

<!--END_DOCUSAURUS_CODE_TABS-->

Serve assets statically alongside the app and set a relative URI to the css
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

podlet.css([
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
            redirectToSlash: true,
        },
    },
});

podlet.css([
    { value: '/assets/main.css' },
    { value: '/assets/extra.css' },
]);
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

podlet.css([
    { value: '/assets/main.css' },
    { value: '/assets/extra.css' },
]);
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

### .proxy({ target, name })

Method for defining proxy targets to be mounted in a layout server. For a
detailed overview of how proxying works, please see the
[proxying guide](podlet/proxying.md) for further details.

When a podlet is put in development mode (`development` is set to `true` in the constructor) these proxy endpoints will also be mounted in the podlet for ease of development and you will then have the same proxy endpoints available in development as you do when working with a layout.

Proxying is intended to be used as a way to make podlet endpoints publicly available. A
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

Sets the default encapsulating HTML document template.

Its worth noting that this document template is only applied to Podlets when in
development mode. When a Layout requests a Podlet this document template will
not be applied.

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

Method to render the document template. Will, by default, render the document
template provided by Podium unless a custom document template is set using the
`.view` method.

In most HTTP frameworks this method can be ignored in favour of
`res.podiumSend()`. If present, `res.podiumSend()` has the advantage that it's not necessary to pass in an [`HttpIncoming`](incoming.md) object as the first argument.

Returns a `String`.

This method takes the following arguments:

#### HttpIncoming (required)

An instance of the [`HttpIncoming`](incoming.md) class.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
app.get(podlet.content(), (req, res) => {
    const incoming = res.locals.podium;
    const document = layout.render(incoming, '<div>content to render</div>');
    res.send(document);
});
```

<!--Hapi-->

```js
app.route({
    method: 'GET',
    path: podlet.content(),
    handler: (request, h) => {
        const incoming = request.app.podium;
        return layout.render(incoming, '<div>content to render</div>');
    },
});
```

<!--Fastify-->

```js
app.get(podlet.content(), (req, res) => {
    const incoming = reply.app.podium;
    const document = layout.render(incoming, '<div>content to render</div>');
    reply.send(document);
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

#### fragment

An String that is intended to be a fragment of the final HTML document.

```js
layout.render(incoming, '<div>content to render</div>');
```

#### [args]

All following arguments given to the method will be passed on to the document
template. For example, this could be used to pass on parts of a page to the
document template.

<!--DOCUSAURUS_CODE_TABS-->
<!--Express-->

```js
podlet.view = (incoming, body, head) => {
    return `
        <html>
            <head>${head}</head>
            <body>${body}</body>
        </html>
    `;
};

app.get(podlet.content(), async (req, res, next) => {
    const incoming = res.locals.podium;

    const head = `<meta ..... />`;
    const body = `<section>my content</section>`;

    const document = layout.render(incoming, body, head);
    res.send(document);
});
```

<!--Hapi-->

```js
podlet.view = (incoming, body, head) => {
    return `
        <html>
            <head>${head}</head>
            <body>${body}</body>
        </html>
    `;
};

app.route({
    method: 'GET',
    path: podlet.content(),
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
podlet.view = (incoming, body, head) => {
    return `
        <html>
            <head>${head}</head>
            <body>${body}</body>
        </html>
    `;
};

app.get(podlet.content(), (req, res) => {
    const incoming = reply.app.podium;

    const head = `<meta ..... />`;
    const body = `<section>my content</section>`;

    const document = layout.render(incoming, body, head);
    reply.send(document);
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

### .process(HttpIncoming)

Method for processing an incoming HTTP request. This method is intended to be
used to implement support for multiple HTTP frameworks and in most cases will
not need to be used directly by podlet developers when creating podlet servers.

What it does:

-   Handles detection of development mode and sets the appropriate defaults
-   Runs context deserializing on the incoming request and sets a context object at `HttpIncoming.context`.

Returns an [`HttpIncoming`](incoming.md) object.

This method takes the following arguments:

#### HttpIncoming (required)

An instance of the [`HttpIncoming`](incoming.md) class.

```js
const { HttpIncoming } = require('@podium/utils');
const Podlet = require('@podium/podlet');

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: podlet.content(),
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

Method for dispatching an HTML fragment. Calls the `.send()` / `.write()` methods
in the framework that's being used and serves the HTML fragment.

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
app.get(podlet.content(), (request, reply) => {
    reply.podiumSend('<h2>Hello world</h2>');
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

## Development mode

In most cases podlets are fragments of a whole HTML document. When a layout
server is requesting a podlet's content or fallback, the podlet should serve
just that fragment and not a whole HTML document with its `<html>`, `<head>`
and `<body>`. Additionally, when a layout server requests a podlet it provides a Podium context to the podlet.

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
[publicpathname]: https://github.com/podium-lib/context#public-pathname '`publicPathname`'
[mountorigin]: https://github.com/podium-lib/context#mount-origin '`mountOrigin`'
[abslog]: https://github.com/trygve-lie/abslog 'abslog'
[pathname]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname 'pathname'
[url]: https://developer.mozilla.org/en-US/docs/Web/API/URL 'URL'
