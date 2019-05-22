---
id: getting_started
title: Getting Started
---

## Modules

Podium consist of two parts; Podlets and Layouts. Each part has a module for
developing each of these.

### Podlets

If one are to write a server for serving page fragments, or Podlets in Podium
speak, one should be using the [@podium/podlet module](api/podlet.md).

### Layouts

If one are to write a layout server to compose page fragments together, one
should be using the [@podium/layout module](api/layout.md).

## HTTP Framework Compabillity

Podium is HTTP framework agnostic with first class support for [Express]. In
practise this means that core Podium works with the standard [http.Server]
module in node.js but the core modules also comes with [Express] compatible
middleware methods for easy usage.

Due to the fact that Podium is built for usage with [http.Server] module in
node.js, its easy to make Podium work with multiple HTTP frameworks. The most
common way to support different HTTP framework is through plugins.

[Hapi] and [Fastify] is endorsed HTTP frameworks by the Podium team which
maintain plugins for these HTTP frameworks. There are also user land plugins
for other HTTP frameworks.

Using Podium together with [Hapi] or [Fastify] does normally require that the
plugin is handed an instance of one of the Podium modules.

 * To write a Podlet server with Hapi; please see [@podium/hapi-podlet]
 * To write a Layout server with Hapi; please see [@podium/hapi-layout]
 * To write a Podlet server with Fastify; please see [@podium/fastify-podlet]

Example of setting up a Podlet server in all HTTP framworks supported and
endorsed by the Podium team:

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
    res.status(200).json(podlet);
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


[@podium/fastify-podlet]: https://github.com/podium-lib/fastify-podlet
[@podium/hapi-podlet]: https://github.com/podium-lib/hapi-podlet
[@podium/hapi-layout]: https://github.com/podium-lib/hapi-layout
[http.Server]: https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_class_http_server
[Express]: https://expressjs.com/
[Fastify]: https://www.fastify.io/
[Hapi]: https://hapijs.com/
