---
title: Hybrid apps
---

Podium includes features for developers of hybrid applications, where parts of a (typically mobile) application are built using web technologies.

- Specification of HTTP headers that are passed to podlets on [the context](/docs/guides/context).
- Client-side library for sending [messages between web and native](#client-side-communcication).
- Developer tools extension for browsers to simulate HTTP headers set by a native webview.

## Initial request

Layouts and podlets need to be able to adapt to requests from a hybrid web view. To support this, Podium specifies a set of HTTP headers that the web view includes in requests:

### Hybrid HTTP headers

| Header                    | Example                        | Description                                                                               |
| ------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| `x-podium-app-id`         | `com.yourcompany.app@1.2.3`    | To identify clients in logs                                                               |
| `x-podium-base-font-size` | `1rem`                         | To set base font size variable in CSS based on accessibility settings in the native host. |
| `x-podium-device-type`    | `hybrid-ios`, `hybrid-android` | To give hints to the server what should be included in the response.                      |
| `Authorization`           | `Bearer eyJhbGciOiJIU...`      | Optional. Signifies a logged-in user.                                                     |

#### Podium developer tools extension

Get the extension to make it easier to set these HTTP headers when developing locally:

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/podium-developer-tools/)
- [Chromium](https://chromewebstore.google.com/detail/podium-development-extens/jdlcejoeifgnnnckhnhapbmgieajaipl) based browsers

## Client-side communcication

[@podium/bridge] is a module that sets up a JSON RPC bridge for communication between a native application and a web application running in a webview.
[@podium/browser](/docs/guides/client-side-communication#podiumbrowser)'s message bus taps into this bridge to publish and subscribe to messages.

You use the API from `@podium/browser` or [@podium/store](/docs/guides/client-side-communication#podiumstore),
and messages seamlessly get sent across the bridge for you.

```js
// Include this once, preferably in your layout before loading applications,
// and before importing `@podium/browser` and `@podium/store`.
import "@podium/bridge";
```

See [@podium/bridge] for API documentation.

### Message format

When you use the bridge with `@podium/browser` and `@podium/store`, behind the scenes, `channel`, `topic` and `payload` are combined to form a valid [JSON RPC 2.0](https://www.jsonrpc.org/specification) message.
Here's an example:

```js
import "@podium/bridge";
import { MessageBus } from "@podium/browser";

const messageBus = new MessageBus();

messageBus.publish("system", "authentication", { token: null });
```

`"system"` and `"authentication"` are combined to `"system/authentication"`, and the `payload` argument is used as `params` in JSON RPC terms.

```json
{
  "jsonrpc": "2.0",
  "method": "system/authentication",
  "params": { "token": null }
}
```

The same goes for `@podium/store`:

```js
import "@podium/bridge";
import { map } from "@podium/store";

const $auth = map("system", "authentication", { token: null });
```

### Reserved message names

Podium reserves these topics for built-in features:

- `system`
- `view`

### Message contracts

#### `system/authentication`

Logged out:

```json
{
  "jsonrpc": "2.0",
  "method": "system/authentication",
  "params": { "token": null }
}
```

Logged in:

```json
{
  "jsonrpc": "2.0",
  "method": "system/authentication",
  "params": { "token": "eyJhbGciOiJIU..." }
}
```

[@podium/bridge]: /docs/api/bridge
