---
title: Redirects
---

Redirects in HTTP work by setting a [status code and Location HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections) on the response sent by the server to the browser. What happens if a podlet (which is not the one sending the HTTP response to the browser) wants to trigger a redirect?

The layout is the server sending the HTTP response to the browser. Only the layout can do the actual redirect, but a podlet can ask the layout to do a redirect on its behalf. Here is how it works.

## Define a podlet as redirectable

If a podlet should trigger a redirect for the end user, or you want to handle redirects in a different way, you have to configure the client as `redirectable`:

```js
const gettingStarted = layout.client.register({
  redirectable: true,
});
```

This configuration is required, otherwise the layout will follow the redirect and use the HTML response as if it came from the podlet directly.

With the podlet configured as `redirectable`, check the response in the request handler for the layout and forward the status code and `Location`:

```js
app.get(layout.pathname(), async (req, res) => {
  const incoming = res.locals.podium;
  const response = await gettingStarted.fetch(incoming);

  if (response.redirect) {
    return res
      .status(response.redirect.statusCode)
      .setHeader("Location", response.redirect.location)
      .send();
  }

  incoming.view.title = "Hello, Layout!";
  res.podiumSend(`<div>${response}</div>`);
});
```

## Trigger the redirect from a podlet

Once you have configured the layout to handle a redirectable podlet, the podlet can send a `Location` header and the correct HTTP status code.

```js
app.get(podlet.content(), (req, res) => {

  const shouldRedirect = /* Determine whether a redirect should happen */;
  if (shouldRedirect) {
    return res
      .status(307)
      .setHeader("Location", "https://podium-lib.io")
      .send();
  }

  res.status(200).podiumSend(`
    <div id="app">Hello, Podlet!</div>
  `);
});
```
