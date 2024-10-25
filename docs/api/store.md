---
title: "@podium/store"
---

This is a client-side library that provides a reactive data store using [nanostores](https://github.com/stores/stores) on top of [@podium/browser](https://github.com/podium-lib/browser)'s `MessageBus`. It includes some ready-made stores and helpers for you to make reactive stores for your own events.

By using reactive state backed by `MessageBus` you can seamlessly share state between different parts of a Podium application. If a podlet changes the value of shared state, all other podlets using that value can update.

<!-- TODO: look into an existing nanostores plugin so we make something that fits the ecosystem -->

## Usage

To install:

```sh
npm install @podium/store
```

Use the reactive store to do minimal updates of your UI when state changes. Nanostores supports multiple view frameworks:

- [React and Preact](https://github.com/stores/stores?tab=readme-ov-file#react--preact)
- [Lit](https://github.com/stores/stores?tab=readme-ov-file#lit)
- [Vue](https://github.com/stores/stores?tab=readme-ov-file#vue)
- [Vanilla JS](https://github.com/stores/stores?tab=readme-ov-file#vanilla-js)

This example shows a React component:

```js
// components/user.jsx
import { useStore } from "@nanostores/react";
import { $loggedIn } from "../stores/user.js";

export const User = () => {
  const loggedIn = useStore($loggedIn);
  return <p>{loggedIn ? "Welcome!" : "Please log in"}</p>;
};
```

This is the same component in Lit:

```js
// components/user.js
import { StoreController } from "@nanostores/lit";
import { $loggedIn } from "../stores/user.js";

class User extends LitElement {
  loggedInController = new StoreController(this, $loggedIn);

  render() {
    return html`<p>
      ${this.loggedInController.value ? "Welcome!" : "Please log in"}
    </p>`;
  }
}

customElements.define("a-user", User);
```

### Create your own reactive state

By using the [included helper](#mapchannel-topic-initialvalue) you can make your reactive state sync between the different parts of a Podium application.

## API

### `atom(channel, topic, initialValue)`

Create your own [`atom`](https://github.com/nanostores/nanostores?tab=readme-ov-file#atoms) that syncs between parts of a Podium application using the [MessageBus](https://github.com/podium-lib/browser).

This method requires the following arguments:

| option  | type     | details                                                                                                                                              |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| channel | `string` | Name of the channel                                                                                                                                  |
| topic   | `string` | Name of the topic                                                                                                                                    |
| payload | `object` | The initial value. Replaced if [`peek(channel, topic)`](https://github.com/podium-lib/browser?tab=readme-ov-file#peekchannel-topic) returns a value. |

```js
import { atom } from "@podium/store";

const $reminders = atom("reminders", "list", []);
```

### `map(channel, topic, initialValue)`

Create your own [`map`](https://github.com/nanostores/nanostores?tab=readme-ov-file#maps) that syncs between parts of a Podium application using the [MessageBus](https://github.com/podium-lib/browser).

This method requires the following arguments:

| option  | type     | details                                                                                                                                              |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| channel | `string` | Name of the channel                                                                                                                                  |
| topic   | `string` | Name of the topic                                                                                                                                    |
| payload | `object` | The initial value. Replaced if [`peek(channel, topic)`](https://github.com/podium-lib/browser?tab=readme-ov-file#peekchannel-topic) returns a value. |

```js
import { map } from "@podium/store";

const $user = map("user", "profile", { displayName: "foobar" });
```

### `deepMap(channel, topic, initialValue)`

Create your own [`deepMap`](https://github.com/nanostores/nanostores?tab=readme-ov-file#deep-maps) that syncs between parts of a Podium application using the [MessageBus](https://github.com/podium-lib/browser).

This method requires the following arguments:

| option  | type     | details                                                                                                                                              |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| channel | `string` | Name of the channel                                                                                                                                  |
| topic   | `string` | Name of the topic                                                                                                                                    |
| payload | `object` | The initial value. Replaced if [`peek(channel, topic)`](https://github.com/podium-lib/browser?tab=readme-ov-file#peekchannel-topic) returns a value. |

```js
import { deepMap, listenKeys } from "@podium/store";

export const $profile = deepMap({
  hobbies: [
    {
      name: "woodworking",
      friends: [{ id: 123, name: "Ron Swanson" }],
    },
  ],
  skills: [["Carpentry", "Sanding"], ["Varnishing"]],
});

listenKeys($profile, ["hobbies[0].friends[0].name", "skills[0][0]"]);
```
