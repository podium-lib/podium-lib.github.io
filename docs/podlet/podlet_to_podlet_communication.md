---
id: podlet_to_podlet_communication
title: Podlet To Podlet Communication In The Browser
---

For situations where 2 or more podlets need to communicate with each other without a page refresh, Podium provides a client side library called `@podium/browser` which provides a pubsub class called `MessageBus`.

To illustrate by way of an example, if podlet A. contains an input field wherein a user can input a new reminder and podlet B. contains a list of all reminders, when a user inputs a new reminder into the area of the page that is rendered by podlet A. he or she would expect that the reminders list controlled by podlet B. would immediately be updated with the newly input reminder.

`MessageBus` provides a simple mechanism for a podlet to publish events or to subscribe to receive events, in the browser, whenever they occur. To continue with our example above, podlet B. would subscribe to receive new reminder events so that when a user inputs a new reminder, Podlet A. would publish a new reminder event. Podlet B. would then immediately receive that event and be able to react by updating the reminder list with a new reminder.

## Getting Started

### Installation

To get started, install the Podium browser package

```sh
npm install @podium/browser
```

### Import and Initialize

Then in your podlet's client side JavaScript code, import the `MessageBus` class from the browser package and then create a new instance of the class.

```js
import { MessageBus } from '@podium/browser';

const messageBus = new MessageBus();
```

### Publishing Events

To publish an event, call the `publish` method and pass a `channel`, a `topic` and any data you want subscribers to receive.

```js
messageBus.publish(channel, topic, payload);
```

In our example reminder app, podlet A. might listen for the user to click an `add` button on the page, read the reminder text from an input field, and then publish an event like so:

```js
document.getElementById('add-btn').on('click', () => {
    const reminder = document.getElementById('new-reminder-field').value;
    messageBus.publish('reminders', 'newReminder', reminder);
});
```

### Subscribing to Events

To subscribe to events for a particular channel and topic, call the `subscribe` method passing it the `channel`, `topic` and a callback function to be executed whenever an event occurs. Whenever the callback is executed, it gets passed an `event` object which has the properties `channel`, `topic` and `payload`.

```js
messageBus.subscribe(channel, topic, event => {});
```

In our example reminder app, podlet B. might listen for new reminder events and then update the list of reminders on the page like so:

```js
messageBus.subscribe('reminders', 'newReminder', event => {
    const li = document.createElement('li').innerHTML = event.payload;
    document.getElementById('reminders-list').append(li);
});
```