---
id: browser
title: @podium/browser
---

The `@podium/browser` package contains classes to provide browser based functionality when building Podium micro-frontends.

For now, this module only includes [MessageBus](#messagebus), but it is possible that it will include more features in the future.

## Installation

```bash
$ npm install @podium/browser
```

## MessageBus

Cross podlet communication and message passing. For a information and examples on how and when to use this module, see [the guide](../podlet/podlet_to_podlet_communication)

### Constructor

Create a new MessageBus instance.

```javascript
const messageBus = new MessageBus();
```

### API

#### .publish(channel, topic, payload)

Publish an event for a channel and topic combination. Returns the event object passed to subscribers.

This method takes the following arguments:

| option  | default | type     | required | details                   |
| ------- | ------- | -------- | -------- | ------------------------- |
| channel | `null`  | `string` | `true`   | Name of the channel       |
| topic   | `null`  | `string` | `true`   | Name of the topic         |
| payload | `null`  | any      | `false`  | The payload for the event |

Examples:

```javascript
messageBus.publish('search', 'query', 'laptop');

messageBus.publish('auth', 'logout');
```

#### .subscribe(channel, topic, callback)

Subscribe to events for a channel and topic combination.

This method takes the following arguments:

| option   | default | type       | required | details                                                   |
| -------- | ------- | ---------- | -------- | --------------------------------------------------------- |
| channel  | `null`  | `string`   | `true`   | Name of the channel                                       |
| topic    | `null`  | `string`   | `true`   | Name of the topic                                         |
| callback | `null`  | `Function` | `true`   | Callback function to be invoked. Receives an event object |

Example:

```javascript
messageBus.subscribe('channel', 'topic', event => {
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

messageBus.subscribe('channel', 'topic', cb);

messageBus.unsubscribe('channel', 'topic', cb);
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
const events = messageBus.log('channel', 'topic');

events.forEach(event => {
    console.log(event.payload);
});
```