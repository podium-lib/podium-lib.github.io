# 🚀 Getting Started

This guide will show you how to get started building podlets for Podium in Node
js using the express js http framework. It will walk you through the creation of
a very simple bare bones podlet.

## Before you begin

Ideally, you should have some familiarity with building apps with javascript and
node.js. You will also need to have node.js installed at version 8 or higher.
The npm cli will be installed automatically when you install
node.js

## Step 1: Project setup

First, we need to initialize a new node project in an empty directory.

```bash
mkdir basic-podlet
cd basic-podlet
npm init
```

Follow the prompts (mostly accepting defaults) to complete project
initialization.

## Step 2: Install dependencies

Next, we need to install and import dependencies. Express js and
@podium/podlet. To do so, run:

```bash
npm install express @podium/podlet
```

## Step 3: Import dependencies

Create a file `index.js` and import the 2 dependencies at the top

```js
const express = require('express');
const Podlet = require('@podium/podlet');
```

## Step 4: Instantiate instances

Instantiate the podlet and create an express app instance

```js
const app = express();

const podlet = new Podlet({
    name: 'myPodlet', // required
    version: '1.0.0', // required
});
```

## Step 5: Mount middleware

Mount the podlet instances middleware into the express app

```js
app.use(podlet.middleware());
```

## Step 6: Create a content route

This is the route that the podlet server will use to return its html content.

```js
app.get(podlet.content(), (req, res) => {
    res.status(200).send('<div>This is the podlets html content</div>');
});
```

Here we use the podlets helper method `podlet.content()` which by default
returns the string `'/'`. We could just have easily have simply hard coded `'/'`
as our route but by using `podlet.content()`, we are telling the podlet where
the content route is which means that the podlet can automatically generate
manifest content (see the next step below).

One final thing to note is that you can also pass a `path` to
`podlet.content(path)` in order to customise where the content route will be
mounted. Eg. `podlet.content('/content')` to mount the content route at
`'/content'`

## Step 7: Create a manifest route

We mentioned the podlet manifest earlier. In Podium, each podlet must return
meta data about itself in the form of a json document. We can get this pretty
much for free by just serializing the podlet with `JSON.stringify(podlet)` and
returning it from a route.

```js
app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});
```

Same as with the content route, we can change the route path for the manifest by
passing a path to `podlet.manifest(path)` though theres usually no need to do
so. Eg. `podlet.manifest('/manifest')`

## Step 8: Start the server

Now, all thats left is to start the server and test it out

```js
app.listen(7100);
```

We call `.listen(port)` on the express app instance and pass it a port

We can run the app with:

```bash
node index.js
```

And we can then curl the server to get back it's manifest content:

```bash
curl http://localhost:7100/manifest.json
# {"name":"myPodlet","version":"1.0.0","content":"/","fallback":"/fallback","assets":{"js":"","css":""},"proxy":{}}
```

And curl the server to get back it's html content:

```bash
curl http://localhost:7100
# <div>This is the podlets html content</div>
```

## The complete code

```js
const express = require('express');
const Podlet = require('@podium/podlet');

const app = express();

const podlet = new Podlet({
    name: 'myPodlet',
    version: '1.0.0',
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    res.status(200).send('<div>This is the podlets html content</div>');
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.listen(7100);
```

## Next steps

-   [add a fallback route to your podlet](/Podium/docs/podlets/fallbacks.html)
-   [learn about working with the context](/Podium/docs/podlets/context.html)
-   [add client side assets (JavaScript and CSS)](/Podium/docs/podlets/assets.html)
-   [learn about adding additional routes using the proxy](/Podium/docs/podlets/proxying.html)
-   [read about improving your podlet development workflow](/Podium/docs/podlets/local_development.html)
