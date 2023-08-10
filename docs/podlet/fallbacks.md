---
id: fallbacks
title: Fallbacks
---

What happens if a podlet server is down? Unresponsive? Responding too slowly? By default Podium will simply render an empty string in its place. You might, however, want to have some measure of control over what gets shown. Enter fallbacks.

## How do fallbacks work?

On the first request to a podlet, Podium will request the podlet’s manifest file inside of which it will discover the location of the podlets fallback route if one has been defined. It will then make a request to the fallback route and cache the response. Later, if the podlet server cannot be reached for any reason, or the request returns a non 200 response, Podium will simply display the podlet’s cached fallback content instead.

Note that the podlet’s assets will still be served, so the fallback can depend on both JS and CSS being present once it’s rendered.

## Defining a fallback route

With a podlet instance you call the `fallback` function, which will return the route configured in the manifest. You then attach your handler which receives a simplified version of the context and returns the fallback you want.

```js
const podlet = new Podlet({
  /* ... */
  fallback: '/fallback',
});

const app = express();

app.get(podlet.fallback(), (req, res) => {
    res.status(200).podiumSend("<div>It didn't work :(</div>");
});
```

With a custom URL, which will be reflected in the manifest.

```js
app.get(podlet.fallback('/my-custom-fallback-route'), (req, res) => {
    res.status(200).podiumSend("<div>It didn't work :(</div>");
});
```

You can also use some of the Podium context that's not request bound. This is useful if you need to serve a different fallback depending on where the podlet is mounted.

```js
app.get(podlet.fallback(), (req, res) => {
    const { publicPathname } = res.locals.podium.context;
    res.status(200).podiumSend(
        `<div data-public-path-name=${publicPathname}>It didn't work :(</div>`
    );
});
```

The fallback can also point to an external service.

```js
const podlet = new Podlet(/*...*/);

podlet.fallback('https://www.example.com/my-fallback');
```
