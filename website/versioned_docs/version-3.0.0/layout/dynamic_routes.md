---
id: version-3.0.0-dynamic_routes
title: Passing URL params and query string values to podlets
original_id: dynamic_routes
---

There are occasions where you will want user interaction in a podlet to inform the behavior of other podlets. A great example of this is search. You might have one podlet that handles user search input and another podlet that displays search results.

_Example_

```js
const searchField = layout.client.register({
  name: 'searchField',
  uri: 'http://localhost:7200'
});

const searchResults = layout.client.register({
  name: 'searchResults',
  uri: 'http://localhost:7201'
});
```

The recommended way for the `searchResults` podlet to react to user changes in the `searchField` is to manipulate the pages URL query string parameters or pathname param.

## Sending query params

The Podium context is not the only way for a layout to communicate with its podlets. Query params can be forwarded to podlets via `.fetch()` calls.

_Example_

```js
const content = podlet.fetch(context, { query: { search: req.query.search } });
```

Continuing with our search example, when a request comes in to the layout at `http://localhost:7101?search=houses`, we forward the query parameter `search` on to both podlets.

_Example_

```js
const content = await Promise.all([
  searchField.fetch(ctx, { query: { search: req.query.search } }),
  searchResults.fetch(ctx, { query: { search: req.query.search } })
]);
```

Our podlets will then have access to the value of `search` and be able to render content accordingly. Likewise, in order to trigger changes, all a podlet will need to do is navigate the page to `http://localhost:7101?search=houses`.
The `searchField` podlet could do this by creating a form.

_Example_

```html
<form action="http://localhost:7101" method="GET"><input type="text" name="search" /> <input type="submit" /></form>
```

## Sending a pathname

Another way to send dynamic queries to podlets is by sending along a `pathname` option. This can be used, for example, to build podlet URLs that are defined using named route parameters.

_Example: sending podlet content route with named parameter_

In the layout.

```js
const content = podlet.fetch(context, { pathname: '/andrew' });
```

In the podlet.

```js
app.get('/:name', (req, res) => {
  // req.params.name => andrew
});
```

It is important to note here that the `pathname` value is appended to the content route so if you were to serve your content route at `/content` instead of at `/` the final URL sent to the podlet would include this.

```js
const podlet = new Podlet({
  content: '/content'
});
app.get('/content/:name', (req, res) => {
  // req.params.name => andrew
});
```

You are, in fact, free to handle any routes you like under `content` namespace. The following is also valid.

```js
// include `/name` when defining `pathname`
const content = podlet.fetch(context, { pathname: '/name/andrew' });

const podlet = new Podlet({
  content: '/content'
});
app.get('/content/name/:name', (req, res) => {
  // req.params.name => andrew
});
```
