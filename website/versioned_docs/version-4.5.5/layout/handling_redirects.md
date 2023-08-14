---
id: version-4.5.5-handling_redirects
title: Handling redirects from podlets
original_id: handling_redirects
---

By default, the client registered in a layout will _follow_ a redirect, and use the HTML response as if it came from the podlet directly.

## Define a podlet as redirectable

If a podlet should trigger a redirect for the end user, or you want to handle redirects in a different way, you have to configure the client as `redirectable`:

```js
const gettingStarted = layout.client.register({
  /* ... */
  redirectable: true,
});
```

Then, in the request handler for the _layout_:

```js
app.get("/", async (req, res) => {
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
      .status(302)
      .setHeader("Location", "https://podium-lib.io")
      .send();
  }

  res.status(200).podiumSend(`
    <div id="app">Hello, Podlet!</div>
  `);
});
```
