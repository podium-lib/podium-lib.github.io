---
id: podlet_to_podlet_communication
title: Podlet to podlet communication in the browser
---

Podium provides a client side library called [@podium/browser] that includes a [MessageBus](/docs/api/browser#messagebus). The message bus simplifies passing data between different podlets' client-side JavaScript.

## The use case

If podlet A contains an input field where a user can input a new reminder and podlet B contains a list of all reminders.

When a user inputs a new reminder in podlet A they would expect that the reminders list in podlet B is updated immediately with the new reminder.

`MessageBus` provides a simple mechanism for a podlet to publish events or to subscribe to receive events, in the browser.

In the example above:

- Podlet B would subscribe to receive new reminder events.
- Podlet A would publish a new reminder event.
- Podlet B would update on receiving the new reminder event.

## Getting Started

See the documentation for [@podium/browser] to get started.

[@podium/browser]: /docs/api/browser
