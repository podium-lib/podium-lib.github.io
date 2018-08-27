# 🐠 Sharing state between podlets

There are occasions where you will want user interaction in a podlet to inform the behaviour of other podlets. A great example of this is search. You might have one podlet that handles user search input and another podlet that displays search results.

_Example_

```js
const searchField = layout.client.register({
    name: 'searchField',
    uri: 'http://localhost:7200',
});

const searchResults = layout.client.register({
    name: 'searchResults',
    uri: 'http://localhost:7201',
});
```

The recommended way for the `searchResults` podlet to react to user changes in the `searchField` is to put shared state into URL query parameters.

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
    searchResults.fetch(ctx, { query: { search: req.query.search } }),
]);
```

Our podlets will then have access to the value of `search` and be able to render content accordingly. Likewise, in order to set this state, all a podlet will need to do is navigate the page to `http://localhost:7101?search=houses`.
The `searchField` podlet could do this by creating a form.

_Example_

```html
<form action="http://localhost:7101" method="GET">
  <input type="text" name="search" />
  <input type="submit" />
</form>
```
