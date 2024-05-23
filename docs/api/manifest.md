---
id: manifest
title: manifest.json
---

This page documents the JSON schema for a [podlet](/docs/api/podlet) `/manifest.json` route.

A manifest can include references to:

- An HTTP endpoint to the podlet's main content.
- An HTTP endpoint to a possible fallback for use in scenarios where the main content cannot be read.
- An set of HTTP endpoints to client side JavaScript files.
- An set of HTTP endpoints to client side CSS files.
- HTTP endpoints which should be made public.

## Schema

The schema for `manifest.json` is defined in [@podium/schemas](https://github.com/podium-lib/schemas/blob/master/schema/manifest.schema.json).

## Example

```json
{
  "name": "my-podlet",
  "version": "1.0.0",
  "content": "/",
  "fallback": "/fallback",
  "css": [
    {
      "value": "https://my.asset.server/my-podlet/styles.css",
      "type": "text/css",
      "rel": "stylesheet"
    }
  ],
  "js": [
    { "value": "https://my.asset.server/my-podlet/client.js", "type": "module" }
  ],
  "proxy": { "api": "/api" }
}
```
