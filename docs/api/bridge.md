---
title: "@podium/bridge"
---

This package is a bridge designed to pass [JSON-RPC 2.0](https://www.jsonrpc.org/specification) messages between a web application and a native web view.

## Usage

To install:

```sh
npm install @podium/bridge
```

Import the bridge in your client-side bundle:

```js
import "@podium/bridge";
```

You should probably send messages via [@podium/browser]. That said, the bridge is available on `window['@podium'].bridge`.

```js
/** @type {import("@podium/bridge").PodiumBridge} */
const bridge = window["@podium"].bridge;

// You can listen for incoming messages, which can either be RpcRequest or RpcResponse
bridge.on("global/authentication", (message) => {
  const request =
    /** @type {import("@podium/bridge").RpcRequest<{ token?: string }>} */ (
      message
    );

  if (typeof request.token === "string") {
    // logged in
  } else {
    // logged out
  }
});

// You can trigger notifications (one-way messages)
bridge.notification({
  method: "global/authentication",
  params: { token: null },
});

// And you can call methods and await the response
/** @type {import("@podium/bridge").RpcResponse<{ c: string }>} */
const response = await bridge.call({
  method: "document/native-feature",
  params: { a: "foo", b: "bar" },
});
```

## API

### `bridge.on`

Add a listener for incoming messages for a given method name.

```js
import "@podium/bridge";

/** @type {import("@podium/bridge").PodiumBridge} */
const bridge = window["@podium"].bridge;

bridge.on("global/authentication", (message) => {
  const request =
    /** @type {import("@podium/bridge").RpcRequest<{ token?: string }>} */ (
      message
    );

  if (typeof request.token === "string") {
    // logged in
  } else {
    // logged out
  }
});
```

### `bridge.notification`

Send a [notification](https://www.jsonrpc.org/specification#notification) (one-way message).

```js
import "@podium/bridge";

/** @type {import("@podium/bridge").PodiumBridge} */
const bridge = window["@podium"].bridge;

bridge.notification({
  method: "global/authentication",
  params: { token: null },
});
```

### `bridge.call`

Send a [request](https://www.jsonrpc.org/specification#request_object) and await a [response](https://www.jsonrpc.org/specification#response_object).

```js
import "@podium/bridge";

/** @type {import("@podium/bridge").PodiumBridge} */
const bridge = window["@podium"].bridge;

/** @type {import("@podium/bridge").RpcResponse<{ c: string }>} */
const response = await bridge.call({
  method: "document/native-feature",
  params: { a: "foo", b: "bar" },
});
```

[@podium/browser]: /docs/api/browser
[@podium/store]: /docs/api/store
