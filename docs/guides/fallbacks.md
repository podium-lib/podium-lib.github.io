---
id: fallbacks
title: Fallbacks
---

What happens to a layout if a podlet is down, unresponsive, or slow? By default the layout will render an empty string in its place. However, you might want to have control what gets shown, such as a simplified static version of a complex dynamic podlet. Fallbacks let you do this.

## How do fallbacks work?

On the first request to a podlet a layout will read the podlet’s [manifest](/docs/api/manifest). The manifest includes the location of the fallback. The layout then makes a request to the fallback route and caches the response.

Later, if the podlet server cannot be reached for any reason, or the request returns a non 200 response, the layout will use the podlet’s cached fallback content instead.

Note that the podlet’s assets will still be served, so the fallback can depend on both JS and CSS being present once it’s rendered. This assumes the assets are hosted on a server [separate from the podlet](/docs/guides/assets#use-a-cdn).

## Defining a fallback route

With a podlet instance you call the `fallback` function which will return the route from the manifest. By default this is at `/fallback`. You then attach your handler which receives a simplified version of the context and returns the fallback you want.

```js
const podlet = new Podlet(/*...*/);

const app = express();

app.get(podlet.fallback(), (req, res) => {
  res.status(200).podiumSend("<div>It didn't work :(</div>");
});
```

With a custom URL, which will be reflected in the manifest.

```js
app.get(podlet.fallback("/my-custom-fallback-route"), (req, res) => {
  res.status(200).podiumSend("<div>It didn't work :(</div>");
});
```

You can also use some of the Podium context that's not request bound. This is useful if you need to serve a different fallback depending on where the podlet is mounted.

```js
app.get(podlet.fallback(), (req, res) => {
  const { publicPathname } = res.locals.podium.context;
  res
    .status(200)
    .podiumSend(
      `<div data-public-path-name=${publicPathname}>It didn't work :(</div>`
    );
});
```

The fallback can also point to an external service.

```js
const podlet = new Podlet(/*...*/);

podlet.fallback("https://www.example.com/my-fallback");
```

## Throwable podlets

By default a layout will substitute a fallback (or empty string) for a podlet's content whenever the podlet either fails to respond with a 2xx status code or the podlet fails to respond within 1000 milliseconds.

In some cases it may make no sense to show a page at all if some of its content is not available. You may prefer to show an error page rather than fallback content or an empty string. This is especially true for dynamic content that is the main focus of a page. If all you can show is a header and footer, it might be better to show an error page explaining the situation to the user.

In order to facilitate this, it is possible to set a podlet as `throwable` when it is registered.

```js
const gettingStarted = layout.client.register({
  throwable: true,
});
```

When the layout fetch the podlet, if that podlet is not available, then the fetch will reject with an error that you can then handle as you see fit.

Error objects are instances of [Boom](https://www.npmjs.com/package/@hapi/boom) errors and are decorated with the HTTP status code from the podlet response.

```js
app.get(layout.pathname(), (req, res, next) => {
    try {
        const content = await gettingStarted.fetch(res.locals.podium);
    } catch(err) {
        // you might respond to the error here
        // res.status(err.statusCode).end();

        // or pass the error on to be handled in error handling middleware
        next(err);
    }
});
```
