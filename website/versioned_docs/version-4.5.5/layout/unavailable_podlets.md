---
id: version-4.5.5-unavailable_podlets
title: Handling podlet unavailability
original_id: unavailable_podlets
---

Podium is designed to anticipate and handle the possibility that 1 or more of your podlets may respond slowly or become unavailable from time to time. It does so via the concept of fallbacks.
When a podlet is first fetched, the layout client will cache a copy of the podlet's fallback content (if defined). If, at a later stage, the layout client cannot fetch the podlet's content, it will instead use the podlet's cached fallback content or just an empty string if no fallback content is available. This means that a layout can go on serving requests with the content it can fetch rather than itself become unavailable.

By default, a layout will substitute a fallback (or empty string) for a podlet's content whenever either the podlet fails to respond with a 2xx status code or the podlet fails to respond within 1000 ms. This default timeout value can be configured by passing options to the layout constructor.

```js
const layout = new Layout({
    ...
    client: {
        timeout: 2000,
    }
});
```

## Defining a podlet as throwable

In some cases it may make no sense to show a page if some of its content is not available. In such cases, you may prefer for the layout to show an error page rather than fallback content or an empty string. This is especially true for dynamic content that is the main focus of a page. If all you can show is a header and footer, it might be better to show an error page explaining the situation to the user.

In order to facilitate this, it is possible to set a podlet as `throwable` when it is registered.

_Example_

```js
const gettingStarted = layout.client.register({
    ...
    throwable: true,
})
```

When the Podium client makes a fetch to the podlet, if that podlet is not available, then the fetch call will reject with an error that you can then handle as you see fit. 

Error objects are instances of [Boom](https://www.npmjs.com/package/@hapi/boom) errors and are decorated with the HTTP status code from the podlet response.

_Example_

```js
app.get('/', (req, res, next) => {
    try {
        const content = await gettingStarted.fetch(res.locals.podium);
        ...
    } catch(err) {
        // you might handle this directly...
        // res.status(err.statusCode).end();

        // or perhaps just pass the error on to be handled in error handling middleware
        // next(err);
    }
});
```

## Defining a podlet as redirectable

In the case that a podlet responds with a `3xx` redirect status code, by default, the Podium client will simply follow the redirect and return the content from the redirect. In some cases, you may wish to handle this redirect manually in your layout app. 

To do so, set `redirectable` to `true` when registering the podlet and then check the response of calls to `fetch` for the `redirect` property. If `redirect` is truthy then the podlet responded with a redirect. The `redirect` property then will contain an object with keys `statusCode` and `location` which you can use to perform your own redirects.

_Example_

```js
const gettingStarted = layout.client.register({
    ...
    redirectable: true,
});

app.get('/', async (req, res, next) => {
    const response = await gettingStarted.fetch(res.locals.podium);
    if (response.redirect) {
        res.redirect(response.redirect.statusCode, response.redirect.location);
    } else {
        res.podiumSend(response.content);
    }
});
```