

Podium consists of two parts; podlets and layouts, each with its own matching module to be used for development.

### Podlets

When writing a server for serving page fragments (podlets), the [@podium/podlet module](api/podlet.md) should be used.

### Layouts

When writing a layout server in order to compose page fragments together, the [@podium/layout module](api/layout.md) should be used.

## HTTP Framework Compabillity

Podium is HTTP framework agnostic with first class support for [Express]. In
practise this means that core Podium works with the standard [http.Server]
module in Node.js but the core modules also come with [Express] compatible
middleware methods for ease of use.

Due to the fact that Podium is built for usage with the [http.Server] module in
Node.js, it's pretty straight forward to get Podium to work with most HTTP frameworks. The most
common way to support different HTTP framework is through plugins.

[Hapi] and [Fastify] are both HTTP frameworks that the Podium team support by
maintaining plugins for each. There are also user land plugins
for other HTTP frameworks.

Using Podium together with [Hapi] or [Fastify] requires that the
plugin is handed an instance of the appropriate Podium module.

-   To write a podlet server with Hapi; please see [@podium/hapi-podlet]
-   To write a layout server with Hapi; please see [@podium/hapi-layout]
-   To write a podlet server with Fastify; please see [@podium/fastify-podlet]
-   To write a layout server with Fastify; please see [@podium/fastify-layout]

Example of setting up a podlet server in all HTTP frameworks supported by the Podium team:

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

<!--HTTP-->

```js
const { HttpIncoming } = require('@podium/utils');
const Podlet = require('@podium/podlet');
const http = require('http');

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
    pathname: '/',
    development: true,
});

const server = http.createServer(async (req, res) => {
    let incoming = new HttpIncoming(req, res);
    incoming = await podlet.process(incoming);

    if (incoming.url.pathname === podlet.manifest()) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('podlet-version', podlet.version);
        res.end(JSON.stringify(podlet));
        return;
    }

    if (incoming.url.pathname === podlet.content()) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('podlet-version', podlet.version);

        if (incoming.context.locale === 'nb-NO') {
            res.end(podlet.render(incoming, '<h2>Hei verden</h2>'));
            return;
        }
        res.end(podlet.render(incoming, '<h2>Hello world</h2>'));
        return;
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
});

server.listen(7100);
```

<!--END_DOCUSAURUS_CODE_TABS-->

[@podium/fastify-podlet]: https://github.com/podium-lib/fastify-podlet
[@podium/fastify-layout]: https://github.com/podium-lib/fastify-layout
[@podium/hapi-podlet]: https://github.com/podium-lib/hapi-podlet
[@podium/hapi-layout]: https://github.com/podium-lib/hapi-layout
[http.server]: https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_class_http_server
[express]: https://expressjs.com/
[fastify]: https://www.fastify.io/
[hapi]: https://hapijs.com/
