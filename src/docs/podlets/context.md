# Context

A Podlet is intended to be used in multiple Layouts. To support this, a Podlet
needs access to certain pieces of information from the Layout server so it can
determine how to respond in context of the Layout requesting it.

An example of the kind of information a Podlet might need from the Layout server
is the domain the Layout server is serving pages on. In order for a Podlet to be
able to build absolute links to the domain the Layout is serving the podlet on,
the Podlet will somehow need to be given this information from the Layout.

In Podium, this set of information is always provided on the requests from the
Layout server to the Podlets. This is called the context and is sent to the Podlet
as a group of HTTP headers.

The Context is appended to all requests, including proxy requests, from a Layout
server to a Podlet.

## Default Context variables

Podium has a default set of Context variables which is always appended. They are
as follow:

### Debug

A boolean value giving a hint about whether the Layout is in debug mode or not.
Defaults to `false`.

### Locale

A [bcp47] compliant locale string with locale information from the Layout.
Defaults to `en-EN`.

### Device Type

A guess at the device type of the browser requesting a page from a Layout server
hinting at whether the browser is running on a desktop, tablet or mobile.
Defaults to `desktop`.

### Mount Origin

URL origin of the inbound request to the Layout server. This value is retrieved
from the inbound request to the Layout server.
For example,  if the Layout server is serving a request to the domain
http://www.foo.com this value will be `http://www.foo.com`.

### Mount Pathname

URL pathname of where a Layout is mounted in the HTTP server. This value is the
same as that defined as `pathname` in the Layout module’s constructor.
For example, if the Layout server has mounted a Layout on the pathname `/bar`
(http://www.foo.com/bar) this value will be `/bar`.

### Public Pathname

URL pathname to where a Layout server has mounted a Proxy to proxy public traffic
to a Podlet. The full public pathname is built up by the value of Mount Pathname
and a prefix value. The prefix value is there to define a namespace to isolate
the proxy from other HTTP routes defined under the same mount pathname. The
default prefix value is `podium-resource`.
For example, if the Layout server has mounted a Layout on the pathname `/bar`
(http://www.foo.com/bar) this value will be `/bar/podium-resource/`.

## Reading and appending Context

Under the hood, the Context is appended to the requests from the Layout to the
Podlets as prefixed HTTP headers. Each Context header is prefixed with `podium`
followed by the name of the Context property in [kebab case]. For example, the
Mount Origin context value will be sent with the header name
`podium-mount-origin` at the HTTP level.

Though; unless one are doing a low level implementation of a Podium library one
should not necessarily need to deal with the http headers. When using the
[@podium/layout] and [@podium/podlet] modules to build Layout and Podlet servers,
appending and reading the Context is a bit easier.

### Appending Context

The Context is always created in the Layout server for each request to it. The
[@podium/layout] module contain a set of Context parsers which run in parallel
on each request and builds the Context so it can be passed on to the Podlets when
requesting them for content.

The Context parsers is run by the Connect compatible middleware method,
`.middleware()`, on the @podium/layout object. When run, the Context are then
stored on `.locals.podium.context` on the http response object for use in a later
middleware / route.

On `.locals.podium.context` the Context property names are to be found in
[camel case] and without the prefix. Iow: the Context property name for ex
Mount Origin is `mountOrigin`.

In a Layout server the Context must be manually passed on to the `.client.fetch()`
or `.client.stream()` method on the @podium/layout object when requesting content
from Podlets. This step is crucial and should be done when requesting content
from Podlets unless one do not want to send a Context to a Podlet for some reason.

```js
const Layout = require('@podium/layout');
const app = require('express')();

// Set up a Layout
const layout = new Layout({
    pathname: '/',
    name: 'demo',
});

// Register a Podlet
const podlet = layout.client.register({
    name: 'my_podlet',
    uri: 'http://localhost:7100/manifest.json',
});

// Mount Layout middleware on app
app.use(layout.pathname(), layout.middleware());

// Fetch content from Podlet on request to app
app.get(layout.pathname(),
    (req, res) => {
        const ctx = res.locals.podium.context;
        Promise.all([
            podlet.fetch(ctx),  // Pass Context to request
        ])
        .then(result => {
            res.status(200).send(result[0]);
        });
    }
);
```

The `.client.fetch()` or `.client.stream()` methods will serialize the Context
object on `.locals.podium.context` into http headers on the request to the Podlets
as previously described.

Each of the default Context parser has a default configuration which should cover
most use cases. Though; one can override these defaults through the @podium/layout
constructor.

Example of setting the Debug Context to default `true`:

```js
const layout = new Layout({
    pathname: '/',
    name: 'demo',
    context: {
        debug: {
            enabled: true
        }
    }
});
```

Please see the [@podium/layout] module documentation for more detailed documentation.

One is not limited to just the default Context values in Podium. One can easily
write a custom parser and plug it in the chain of parsers which are run by the
`.middleware()` on each request.

```js
const CustomContext = require('custom-context');
const Layout = require('@podium/layout');
const app = require('express')();

// Set up a Layout
const layout = new Layout({
    pathname: '/',
    name: 'demo',
});

// Attach custom context to Layout
layout.context.register('my-custom-context', new CustomContext());

// Mount Layout middleware on app
app.use(layout.pathname(), layout.middleware());
```

Please see the [@podium/context] module documentation for more detailed
documentation on how to write and append a custom Context parser.

### Reading Context

The [@podium/podlet] module contains a de-serializer which will help with picking up
the Context from the http headers on a inbound request.

The de-serializer is run by the Connect compatible middleware method,
`.middleware()`, on the @podium/podlet Object. When run, the Context are then stored
on `.locals.podium.context` on the http response object for use in a later middleware
/ route .

On `.locals.podium.context` the Context property names are to be found in [camel case].
Iow: the Context property name for ex Mount Origin is `mountOrigin`.

```js
const Podlet = require('@podium/podlet');
const app = require('express')();

const podlet = new Podlet({
    version: '2.0.0',
    name: 'demo',
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res, next) => {
    if (res.locals.podium.context.locale === 'nb-NO') {
        res.status(200).send('Hei verden');
        return;
    }
    res.status(200).send('Hello world');
});
```

### Requests from non Layout servers

The Context is appended to the requests from Layout servers to Podlet servers, but
there are cases where one would like to request a Podlet from a non Layout server.
In such a case where the request is not comming from a Layout server one will not
have the Context.

Local development of a Podlet and running different types of tests on a Podlet
are examples of cases where one would like to request a Podlet directly.

To cater for this, it is possible to turn on and adjust a default Context in the
[@podium/podlet] module.

```js
const Podlet = require('@podium/podlet');
const app = require('express')();

// Enable defaults which will set a default Context
const podlet = new Podlet({
    version: '2.0.0',
    name: 'demo',
    defaults: true,
});

// Set default locale to Norwegian
podlet.defaults({
    locale: 'nb-NO',
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res, next) => {
    if (res.locals.podium.context.locale === 'nb-NO') {
        res.status(200).send('Hei verden');
        return;
    }
    res.status(200).send('Hello world');
});
```

This is very handy during development, but it is adviced to have these defaults
turned off when running in production. To control such one can use `NODE_ENV`
to turn default on / off depending on environment.

```js
const podlet = new Podlet({
    version: '2.0.0',
    name: 'demo',
    defaults: process.env.NODE_ENV !== 'production',
});
```

Please see the [@podium/podlet] module documentation for more detailed documentation.

## Using the Context

The whole purpose of the Context is to give a Podlet info about the context it is
running in in a Layout. A Podlet should be written genericly so it can be included
in different Layouts without any custom altering for each Layout.

Example: A Podlet should be able to handle that it is used in a Layout which is
serving things on http://mysite.com/foo/ and a second Layout serving things on
http://mysite.com/bar/xyz/. The Podlet should, with the help of the Context,
be able to build absolute URLs to both these etc.

### A word on URL construction

Maybe the most important thing to use the Context for is constructing URLs so
ex HTML links which reflects the Layout a Podlet is included in can be built.

In a Podlet, the origin of a layout server will be found on `.locals.podium.context.mountOrigin`
and the pathname to the layout will be found on `.locals.podium.context.mountPathname`.

These adher to the [WHATWG URL] spec so we can easely compose full URLs by using,
ex the [URL] module in node.js.

```js
const { URL } = require('url');
const origin = res.locals.podium.context.mountOrigin;
const pathname = res.locals.podium.context.mountPathname;
const url = new URL(pathname, origin);

console.log(url.href)  // prints full URL
```

The same can be done to construct public URL to the proxy URL:

```js
const { URL } = require('url');
const origin = res.locals.podium.context.mountOrigin;
const pathname = res.locals.podium.context.publicPathname;
const url = new URL(pathname, origin);

console.log(url.href)  // prints full to proxy endpoint
```



[bcp47]: https://tools.ietf.org/html/bcp47
[kebab case]: https://en.wikipedia.org/wiki/Kebab_case
[camel case]: https://en.wikipedia.org/wiki/Camel_case
[@podium/layout]: https://github.schibsted.io/Podium/layout
[@podium/podlet]: https://github.schibsted.io/Podium/podlet
[@podium/context]: https://github.schibsted.io/Podium/context
[WHATWG URL]: https://url.spec.whatwg.org/
[URL]: https://nodejs.org/api/url.html#url_class_url
