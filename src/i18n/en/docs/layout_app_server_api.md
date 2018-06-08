# 📚 API

## Constructor

```js
const podlet = new Podlet(options);
```

### options

| option         | default   | type     | required |
| -------------- | --------- | -------- | -------- |
| name           | `null`    | `string` | `true`   |
| version        | `null`    | `string` | `true`   |
| logger         | `console` | `string` | `false`  |
| assetServerUrl | `null`    | `string` | `false`  |
| assets         | `null`    | `object` | `false`  |

#### name

Name that the podlet identifies itself by. When assets are published, this name
value will be used to identify published assets on the asset server. The name
value must be in camelCase

Example

```js
{
  name: "myPodletName";
}
```

#### version

Current version of the podlet, it is important that this value be updated when a
new version of the podlet is deployed as the page (layout) that the podlet is
displayed in uses this value to know whether to refresh the podlet or not. It is
currently safest to include a timestamp in the version value to ensure that it
updates.

Example

```js
{
  version: "1.0.0-" + Date.now().toString();
}
```

#### logger

Any log4j compatible logger can be passed in and will be used logging. By
default logs go to console which is shimmed out to be log4j compatible.

Example

```js
{
  logger: console;
}
```

#### assetServerUrl

If asset bundling is required, the url to the asset server must be provided.
This is the full url to the base of the asset server. Eg. http://localhost:3001

Example

```js
{
  assetServerUrl: "http://localhost:3001";
}
```

#### assets

This object is used to configure client side javascript and css asset file
locations. It must be defined as an object with keys `js` and `css`. If not
provided, calling `.publish()` will be a noop. Eg.

Example

```js
{
    js: '/full/path/to/scripts.js',
    css: '/full/path/to/styles.css',
}
```

Usually, you will want to specify the location of assets relative to the current
file which you can do like so:

Example

```js
const path = require("path");
```

```js
{
    js: path.resolve(__dirname, '../assets/scripts.js'),
    css: path.resolve(__dirname, '../assets/styles.css'),
}
```

## Connect middleware

When creating a podlet, podium needs access to each request/response which it
does using middleware. Any framework that supports the connect middleware
pattern should work though only express is currently supported. Mount the
middleware before defining any routes.

Example

```js
podlet.middleware();
```

## Podlet manifest

This method returns the value of path and internally keeps track of the value of
path for use when the podlet instance is serialized into manifest content.

Examples

```js
podlet.manifest();
// path = /manifest.json

podlet.manifest("/");
// path = /

podlet.manifest("/manifest");
// path = /manifest
```

After calling `podlet.content(path)` and `podlet.fallback(path)`, when you
serialize the podlet instance you will see the value of `path` set to the value
for the keys `content` and `fallback`.

Example

```js
JSON.stringify(podlet);

// {"name":"myPodlet","version":"1.0.0","content":"/","fallback":"/fallback","assets":{"js":"","css":""},"proxy":{}}
```

## Content route

This method returns the value of path and internally keeps track of the value of
path for use when the podlet instance is serialized into manifest content.

Example

```js
podlet.content();
// path = /

podlet.content("/");
// path = /

podlet.content("/content");
// path = /content
```

## Fallback route

This method returns the value of path and internally keeps track of the value of
path for use when the podlet instance is serialized into manifest content.

Example

```js
podlet.fallback();
// path = /fallback

podlet.fallback("/");
// path = /

podlet.fallback("/fallback");
// path = /fallback
```

## Publishing assets

This method publishes podlet client side assets to an asset server. If either or
both of the `assets` or `assetServerUrl` options are not defined then
`.publish()` will be a noop. If `.publish()` has already been called it will
also be a noop unless the boolean option `force` is passed. Returns a promise.

Example

Publish the podlets assets

```js
await podlet.publish();
```

Example

Force the podlet to republish

```js
await podlet.publish(true);
```
