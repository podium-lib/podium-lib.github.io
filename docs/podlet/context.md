---
id: context
title: Context
---

A podlet is intended to be used within multiple layouts but for this to be possible a podlet
needs to be able to access certain pieces of data from each layout server so that it can
determine how to respond.

The purpose of the Podium context then is to give a podlet access to background contextual information about each incoming HTTP request so that the podlet can taylor its response accordingly.

More specifically, a podlet can make use of the context to:

-   construct URLs back to the layout where the request originated
-   respond differently depending on locale eg. `en-US` or `no-NO`
-   respond differently depending on what type of device environment was used to make the request eg. `mobile` or `desktop`
-   respond differently depending on whether the layout is in debug mode or not

In Podium, this context information is sent as a set of HTTP headers with every request (including proxy requests) from a
layout server to a podlet.

## Default Context Variables

Podium has a default set of context variables which are always present. These are:

| Name            | Header Name              | Context Name     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Debug           | `podium-debug`           | `debug`          | A boolean value informing the podlet whether the layout is in debug mode or not. Defaults to `false`                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Locale          | `podium-locale`          | `locale`         | A [bcp47] compliant locale string with locale information from the layout. Defaults to `en-US`                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Device Type     | `podium-device-type`     | `deviceType`     | A guess (based on user-agent) as to the device type of the browser requesting the page from a layout server. Possible values are `desktop`, `tablet` and `mobile`. Defaults to `desktop`                                                                                                                                                                                                                                                                                                                                                           |
| Mount Origin    | `podium-mount-origin`    | `mountOrigin`    | URL origin of the inbound request to the layout server. For example, if the layout server is serving requests on the domain http://www.foo.com this value will be `http://www.foo.com`                                                                                                                                                                                                                                                                                                                                                             |
| Mount Pathname  | `podium-mount-pathname`  | `mountPathname`  | URL path to where a layout is mounted in an HTTP server. This value is the same as the layout's `pathname` option. For example, if the layout server has mounted a layout on the pathname `/bar` (http://www.foo.com/bar) this value will be `/bar`.                                                                                                                                                                                                                                                                                               |
| Public Pathname | `podium-public-pathname` | `publicPathname` | URL path to where a layout server has mounted a proxy in order to proxy public traffic to a podlet. The full public pathname is built up by joining together the value of Mount Pathname with a prefix value. The prefix value is there to define a namespace to isolate the proxy from other HTTP routes defined under the same mount pathname. The default prefix value is `podium-resource`. For example, if the layout server has mounted a layout on the pathname `/bar` (http://www.foo.com/bar) this value will be `/bar/podium-resource/`. |

## Consuming Context Values In A Podlet

(For information on working with the Podium Context within layouts including setting defaults and adding values, please see the [@podium/layout] module documentation.)

Since Context values are sent to podlets from layouts as headers, to make them easier to work with, the [@podium/podlet] module contains a `de-serializer` which converts context headers into object keys and values and places them on the HTTP response object at `res.locals.podium.context` for use in later middleware and/or routes.

When you mount the podlet's middleware into an app this de-serialization process will occur automatically on each request.

_Example: adding podlet middleware_

```js
app.use(podlet.middleware());
```

Note: As shown in the table above, context names are converted from [kebab case] to [camel case] and the Podium prefix is removed so that the `podium-mount-origin` header will be set as `mountOrigin` on `res.locals.podium.context`.

_Example: accessing de-serialized context values in later middleware_

```js
app.use((req, res, next) => {
    // res.locals.podium.context.locale
    next();
});
```

_Example: accessing de-serialized context values in an express route_

```js
app.get('/', (req, res, next) => {
    // res.locals.podium.context.deviceType
});
```

### URL construction

Perhaps the most important thing the Context is typically used for is to construct URLs linking back to the layout that a podlet is being sent a request from.

In a podlet, the origin of a layout server can be found at `res.locals.podium.context.mountOrigin`
and the pathname to the layout server can be found at `res.locals.podium.context.mountPathname`.

These adher to the [WHATWG URL] spec so you can easily compose full URLs by using the [URL] module in node.js.

_Example: using the URL module to construct urls from context values_

```js
import { URL } from 'url';
const { mountOrigin, mountPathname } = res.locals.podium.context;
const url = new URL(mountPathname, mountOrigin);
// url.href => <mountOrigin>/<mountPathname>
// eg. http://localhost:3040/cats
```

_Example: using the URL module to construct proxy urls from context values_

```js
import { URL } from 'url';
const { mountOrigin, publicPathname } = res.locals.podium.context;
const url = new URL(publicPathname, mountOrigin);
// url.href => <mountOrigin>/<publicPathname>
// eg. http://localhost:3040/cats/podium-resource
```

### Requests from non layout servers

The context is appended to requests from layout servers to podlet servers, but when testing the podlet in isolation you will want to be able to send requests to podlets directly, bypassing Layouts entirely. Such requests will not
have the appropriate context headers set and will therefore not be able to populate the `res.locals.podium.context` object.

To support this use case, a `.defaults()` method is provided on the [@podium/podlet] instance. In order to use this, you must set the [@podium/podlet] constructor argument `development` to `true`.

_Example: enabling default context support in a Podlet_

```js
// Enable defaults which will set a default Context
const podlet = new Podlet({
    ...
    development: true,
});
```

_Example: setting default context values_

```js
// Set default locale to Norwegian
podlet.defaults({
    locale: 'nb-NO',
});
```

This is very handy during development, but it is advisable that these defaults
be turned off when running in production. Consider using `NODE_ENV` to enable/disable defaults based on the environment.

_Example: disabling defaults in production_

```js
const podlet = new Podlet({
    ...
    development: process.env.NODE_ENV !== 'production',
});
```

### Client side JavaScript and the context

There are many occasions when you will want access to context values client side. Making AJAX requests to proxy endpoints and client side page navigation are two such common cases.

We recommend the following 2 step approach to sharing context values between backend Node.js code and client side code.

1.  write required context values to the dom in your content route
2.  read from the dom in your client side code

_Example: writing context values to the dom in an express route_

```js
app.get('/', (req, res) => {
    const {
        mountOrigin,
        mountPathname,
        publicPathname,
    } = res.locals.podium.context;

    res.send(`
        <div
            id="app"
            data-mount-origin="${mountOrigin}"
            data-mount-pathname="${mountPathname}"
            data-public-pathname="${publicPathname}"
        ></div>
    `);
});
```

_Example: reading context values from the dom in client side JavaScript_

```js
const app = document.getElementById('app');
const { mountOrigin, mountPathname, publicPathname } = app.dataset;
```

_Example: constructing a URL in client side JavaScript_

```js
const url = new URL(mountPathname, mountOrigin).href;
```

## Putting it all together

_Example: building a Podlet with a default context that passes values to the client_

```js
import Podlet from '@podium/podlet';
import express from 'express';

const app = express();

// Enable defaults which will set a default Context
const podlet = new Podlet({
    version: '2.0.0',
    name: 'demo',
    pathname: '/',

    // turn on for development only
    development: process.env.NODE_ENV !== 'production',
});

// Set default locale to Norwegian
podlet.defaults({
    locale: 'nb-NO',
});

// mount middleware to ensure context headers are parsed
app.use(podlet.middleware());

app.get('/', (req, res, next) => {
    const {
        mountOrigin,
        mountPathname,
        publicPathname,
        locale,
    } = res.locals.podium.context;

    // offer one response to Norwegian speakers...
    if (locale === 'en-NO') {
        res.status(200).podiumSend(`
        <div
            id="app"
            data-mount-origin="${mountOrigin}"
            data-mount-pathname="${mountPathname}"
            data-public-pathname="${publicPathname}"
        >
        Hei!
        </div>
    `);
    } else {
        // ...and another to English speakers
        res.status(200).podiumSend('English is not supported at this time.');
    }
});
```

Please see the [@podium/podlet] module for more detailed documentation.

[bcp47]: https://tools.ietf.org/html/bcp47
[kebab case]: https://en.wikipedia.org/wiki/Kebab_case
[camel case]: https://en.wikipedia.org/wiki/Camel_case
[@podium/layout]: https://github.com/podium-lib/layout
[@podium/podlet]: https://github.com/podium-lib/podlet
[@podium/context]: https://github.com/podium-lib/context
[whatwg url]: https://url.spec.whatwg.org/
[url]: https://nodejs.org/api/url.html#url_class_url
