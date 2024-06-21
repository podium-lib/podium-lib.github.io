---
title: Client-side communication
---

Podium's micro frontend architecture extends all the way to the browser. Each podlet can bring [client-side JavaScript applications](/docs/guides/assets) to add interactivity to the HTML, essentially an [islands architecture](https://jasonformat.com/islands-architecture/).

Say `InputPodlet` contains an input field where a user can input a new reminder and `ListPodlet` contains a list of all reminders.

![Two boxes stacked vertically where the first represents an input field, and the second a list of reminders](/img/client-side-messaging.png)

When a user inputs a new reminder in `InputPodlet` they would expect that the reminders list in `ListPodlet` is updated immediately with the new reminder. However, since they are two separate applications `InputPodlet` can't directly add entries to `ListPodlet`'s state.

## Podium client-side libraries

Podium offers client side libraries to help communication between different applications running in the browser:

- [@podium/browser](#podiumbrowser) includes a message bus and methods to publish and subscribe to messages.
- [@podium/store](#podiumstore) offers a reactive state API backed by the message bus, letting you sync state with ease.

The libraries are designed to make communication between podlets loosely coupled and resilient.

### `@podium/browser`

This library contains the message bus that is the backbone of client-side communication in Podium. Podlets (or the layout) publish and subscribe to messages on the bus for loosely coupled synchronization of state.

:::tip

[@podium/store](#podiumstore) offers an alternative API that uses this message bus under the hood. You can use whichever you prefer.

:::

In the example above, when `InputPodlet` accepts a new item it also publishes a message on the bus.

```js
// input-podlet.js
import { MessageBus } from "@podium/browser";

const messageBus = new MessageBus();

messageBus.publish("reminders", "newReminder", {
  title: "Buy milk",
});
```

`ListPodlet` subscribes to the same `reminders` channel and `newReminder` topic that `InputPodlet` publishes to. When nes messages arrive, `ListPodlet` updates its internal state.

```js
// list-podlet.js
import { MessageBus } from "@podium/browser";

const messageBus = new MessageBus();

// Check to see if an initial value exists on the messageBus
// and fall back to a default value.
const reminders = messageBus.peek("reminders", "newReminder") || [];

// ListPodlet listens for new reminders published on the message bus and updates its state
messageBus.subscribe("reminders", "newReminder", (event) => {
  const reminder = event.payload;
  reminders.push(reminder);
});
```

See [@podium/browser] for API documentation.

:::warning[Possible race condition]

Your `subscribe` function might register after someone has already published an event.
To make sure your application state is in sync, always do a `peek` first.

:::

### `@podium/store`

This library adds a reactive state API on top of the MessageBus using [nanostores]. It sets up publishing and subscribing (including the peek for the initial value) for you behind the scenes, leaving you with a reactive variable you read from and write to that will stay in sync between applications.

:::tip

Using `@podium/store` you can trigger minimal UI updates using a [nanostores integration] for a given UI library.

:::

Keeping with our example, when `InputPodlet` accepts a new item updates a reactive `atom` holding the list of reminders.

```js
// input-podlet.js
import { atom } from "@podium/store";

/** @type {import("@podium/store").WritableAtom<string[]>} */
const $reminders = atom("reminders", "list", []);

// Replace the existing value with a new list to trigger reactive updates
$reminders.set([...$reminders.value, "Buy milk"]);
```

`ListPodlet` would set up the same `atom` and use either a [nanostores integration] with an existing UI library, or subscribe and handle changes manually.

```js
// list-podlet.js
import { atom } from "@podium/store";

/** @type {import("@podium/store").WritableAtom<string[]>} */
const $reminders = atom("reminders", "list", []);

// Perhaps fetch stored reminders from an API,
// or populate the state with data included in a server-side render
$reminders.set(storedReminders);

// Update the UI when the reminders list changes
$reminders.subscribe((value) => {
  console.log(value);
});
```

See [@podium/store] and [nanostores] for API documentation.

[@podium/browser]: /docs/api/browser
[@podium/store]: /docs/api/store
[nanostores]: https://github.com/nanostores/nanostores
[nanostores integration]: https://github.com/nanostores/nanostores?tab=readme-ov-file#integration
