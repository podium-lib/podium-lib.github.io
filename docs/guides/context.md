---
title: Podium context
---

The purpose of the Podium Context is to give a podlet access to information about each incoming HTTP request so that it can tailor its response accordingly.

More specifically, a podlet can use the context to:

- Construct URLs specific to the layout where the request came from.
- Respond differently depending on locale eg. `en-US` or `no-NO`.
- Respond differently depending on what type of device environment was used to make the request eg. `mobile` or `desktop`.
- Respond differently depending on whether the layout is in debug mode or not.

## The role of the layout

The context is created in the layout for each request. The [@podium/layout](/docs/api/layout) module includes a set of default context parsers, which are functions that read the incoming request and return some kind of value that is placed on the context.

You must manually pass the context object on to podlets in the call to `.fetch(ctx)`. The context object is serialized as HTTP headers which are then deserialized to a context object in the podlet.

```js
app.get(layout.pathname(), (req, res) => {
  const incoming = res.locals.podium;
  const content = await myPodlet.fetch(incoming);
});
```

### Change the default context parsers

The included context parsers have a default configuration which should cover most use cases. It is possible to overwrite default configuration when constructing a layout.

```js
const layout = new Layout({
  context: {
    debug: {
      enabled: true,
    },
  },
});
```

See the [@podium/layout reference](api/layout.md) for more detailed documentation regarding configuring the default context parsers.

### Add custom context parsers

You can extend the Podium context by registering additional parsers.

```js
import CustomContext from "my-custom-context-parser";

layout.context.register("my-custom-context", new CustomContext());
```

In the example above a new camelCased value `myCustomContext` will be available on the Podium context to podlets you fetch.

## Default context variables

All requests made by [@podium/layout](api/layout.md) include these variables on the context:

| Name            | Header Name              | Context Name     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Debug           | `podium-debug`           | `debug`          | A boolean value informing the podlet whether the layout is in debug mode or not. Defaults to `false`                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Locale          | `podium-locale`          | `locale`         | A [bcp47] compliant locale string with locale information from the layout. Defaults to `en-US`                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Device Type     | `podium-device-type`     | `deviceType`     | A guess (based on user-agent) as to the device type of the browser requesting the page from a layout server. Possible values are `desktop`, `tablet` and `mobile`. Defaults to `desktop`                                                                                                                                                                                                                                                                                                                                                           |
| Mount Origin    | `podium-mount-origin`    | `mountOrigin`    | URL origin of the inbound request to the layout server. For example, if the layout server is serving requests on the domain http://www.foo.com this value will be `http://www.foo.com`                                                                                                                                                                                                                                                                                                                                                             |
| Mount Pathname  | `podium-mount-pathname`  | `mountPathname`  | URL path to where a layout is mounted in an HTTP server. This value is the same as the layout's `pathname` option. For example, if the layout server has mounted a layout on the pathname `/bar` (http://www.foo.com/bar) this value will be `/bar`.                                                                                                                                                                                                                                                                                               |
| Public Pathname | `podium-public-pathname` | `publicPathname` | URL path to where a layout server has mounted a proxy in order to proxy public traffic to a podlet. The full public pathname is built up by joining together the value of Mount Pathname with a prefix value. The prefix value is there to define a namespace to isolate the proxy from other HTTP routes defined under the same mount pathname. The default prefix value is `podium-resource`. For example, if the layout server has mounted a layout on the pathname `/bar` (http://www.foo.com/bar) this value will be `/bar/podium-resource/`. |

## Read context values in a podlet

The [@podium/podlet] module converts context HTTP headers into keys and values and places them on the HTTP response object at `res.locals.podium.context`.

As shown in [the table above](#default-context-variables), context names are converted from [kebab case] to [camel case] and the Podium prefix is removed. The `podium-mount-origin` header is named `mountOrigin` on `res.locals.podium.context`.

```js
app.get(podlet.content(), (req, res) => {
  // res.locals.podium.context.mountOrigin
});
```

### Construct public URLs

One thing the context is often used for is to construct URLs that need to include the public URL of the layout.

In a podlet, the origin of a layout server can be found at `res.locals.podium.context.mountOrigin`
and the pathname to the layout server can be found at `res.locals.podium.context.mountPathname`.

These adher to the [WHATWG URL] spec so you can easily compose full URLs by using the [URL] module in Node.js.

_Example: using the URL module to construct urls from context values_

```js
import { URL } from "url";
const { mountOrigin, mountPathname } = res.locals.podium.context;
const url = new URL(mountPathname, mountOrigin);
// url.href => <mountOrigin>/<mountPathname>
// eg. http://localhost:3040/cats
```

_Example: using the URL module to construct proxy urls from context values_

```js
import { URL } from "url";
const { mountOrigin, publicPathname } = res.locals.podium.context;
const url = new URL(publicPathname, mountOrigin);
// url.href => <mountOrigin>/<publicPathname>
// eg. http://localhost:3040/cats/podium-resource
```

### Developing a podlet without a layout

In a production environment [the layout is responsible](#the-role-of-the-layout) for providing the context. To simplify development of podlets there's a development mode which includes some sensible default values.

```js
const podlet = new Podlet({
  /* ... */
  development: true, // This should be turned off in production
});
```

You can change the default context values if you'd like by calling `podlet.defaults()`.

```js
podlet.defaults({
  locale: "nb-NO",
});
```

:::tip

Get the [browser extension](/docs/guides/browser-extension) and the accompanying [dev-tool middleware](https://github.com/podium-lib/dev-tool/tree/main/packages/server) to make it possible to change these defaults without changing code and restarting your server.

:::

[bcp47]: https://tools.ietf.org/html/bcp47
[kebab case]: https://en.wikipedia.org/wiki/Kebab_case
[camel case]: https://en.wikipedia.org/wiki/Camel_case
[@podium/layout]: https://github.com/podium-lib/layout
[@podium/podlet]: https://github.com/podium-lib/podlet
[@podium/context]: https://github.com/podium-lib/context
[whatwg url]: https://url.spec.whatwg.org/
[url]: https://nodejs.org/api/url.html#url_class_url
