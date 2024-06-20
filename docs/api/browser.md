---
id: browser
title: "@podium/browser"
---

The `@podium/browser` module is a client-side library designed to simplify communication between a podlet and the layout, and between podlets.
The module also supports applications running in a [hybrid application](/docs/guides/hybrid#client-side-communcication) when used with [@podium/bridge](/docs/api/bridge).

For an API designed as reactive state, see [@podium/store](/docs/api/store).

## Installation

```bash
npm install @podium/browser
```

## Usage

In your podlet's client side JavaScript code, import the `MessageBus` class from the browser package and create a new instance of the class.

```js
import { MessageBus } from "@podium/browser";

const messageBus = new MessageBus();
```

### Publishing messages

To publish a message, call the `publish` method and pass a `channel`, a `topic` and any data you want subscribers to receive.

```js
messageBus.publish("reminders", "newReminder", reminder);
```

### Subscribing to messages

To subscribe to messages on a particular channel and topic, call the `subscribe` method passing it the `channel`, `topic` and a callback function to be executed whenever an event occurs. Whenever the callback is executed it gets passed an `Event` object which has the properties `channel`, `topic` and `payload`.

```js
messageBus.subscribe("reminders", "newReminder", (event) => {
  const reminder = event.payload;
});
```

## API

### MessageBus

Cross podlet communication and message passing.

```javascript
const messageBus = new MessageBus();
```

#### .publish(channel, topic, payload)

Publish an event for a channel and topic combination. Returns the event object passed to subscribers.

This method takes the following arguments:

| option  | default | type     | required | details                                                                         |
| ------- | ------- | -------- | -------- | ------------------------------------------------------------------------------- |
| channel | `null`  | `string` | `true`   | Name of the channel. Podium reserves `system` and `view` for built-in features. |
| topic   | `null`  | `string` | `true`   | Name of the topic.                                                              |
| payload | `null`  | any      | `false`  | The payload for the event.                                                      |

Examples:

```javascript
messageBus.publish("search", "query", "laptop");

messageBus.publish("auth", "logout");
```

#### .subscribe(channel, topic, callback)

Subscribe to events for a channel and topic combination.

This method takes the following arguments:

| option   | default | type       | required | details                                                   |
| -------- | ------- | ---------- | -------- | --------------------------------------------------------- |
| channel  | `null`  | `string`   | `true`   | Name of the channel.                                      |
| topic    | `null`  | `string`   | `true`   | Name of the topic                                         |
| callback | `null`  | `Function` | `true`   | Callback function to be invoked. Receives an event object |

Example:

```javascript
messageBus.subscribe("channel", "topic", (event) => {
  console.log(event.payload);
});
```

#### .unsubscribe(channel, topic, callback)

Unsubscribe to events for a channel and topic combination.

This method takes the following arguments:

| option   | default | type       | required | details                      |
| -------- | ------- | ---------- | -------- | ---------------------------- |
| channel  | `null`  | `string`   | `true`   | Name of the channel          |
| topic    | `null`  | `string`   | `true`   | Name of the topic            |
| callback | `null`  | `Function` | `true`   | Callback function to remove. |

Example:

```javascript
function cb(event) {
  console.log(event.payload);
}

messageBus.subscribe("channel", "topic", cb);

messageBus.unsubscribe("channel", "topic", cb);
```

#### .peek(channel, topic)

Get the latest event for a channel and topic combination.

This method takes the following arguments:

| option  | default | type     | required | details             |
| ------- | ------- | -------- | -------- | ------------------- |
| channel | `null`  | `string` | `true`   | Name of the channel |
| topic   | `null`  | `string` | `true`   | Name of the topic   |

#### .log(channel, topic)

Returns an array of the 10 latest events for a channel and topic combination.
The array is ordered such that the the latest/newest events is at the front of the array.

This method takes the following arguments:

| option  | default | type     | required | details             |
| ------- | ------- | -------- | -------- | ------------------- |
| channel | `null`  | `string` | `true`   | Name of the channel |
| topic   | `null`  | `string` | `true`   | Name of the topic   |

Example:

```javascript
const events = messageBus.log("channel", "topic");

events.forEach((event) => {
  console.log(event.payload);
});
```
