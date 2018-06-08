# 📚 Podlet API Docs

## Constructor

```js
const podlet = new Podlet(options);
```

### options

| option  | default   | type     | required |
| ------- | --------- | -------- | -------- |
| name    | `null`    | `string` | `true`   |
| version | `null`    | `string` | `true`   |
| logger  | `console` | `string` | `false`  |

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
