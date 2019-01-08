# 🚀 Getting Started

👉 This documentation is for Podium podlets version 2.0. [Version 3.0 documentation](/docs/podlets/getting_started.html) is also available.

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

Create an express app instance and instantiate the podlet

```js
const app = express();

const podlet = new Podlet({
    name: 'myPodlet', // required
    version: '1.0.0', // required
});
```

The two first keys are required and the rest is optional, the values used in this example for the optional fields is the default values.

## Step 5: Mount middleware

Mount the podlet instances [middleware](https://medium.com/@agoiabeladeyemi/a-simple-explanation-of-express-middleware-c68ea839f498) into the express app

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

Here we use the podlets helper method `podlet.content()` which returns the content path we set in step 4.

One final thing to note is that you can also pass a path to podlet.content(path) in order to customise where the content route will be mounted. Eg. podlet.content('/content') to mount the content route at '/content'

## Step 7: Create a manifest route

In Podium, each podlet must return meta data about itself in the form of a json document. By returning the podlet object, it will be serialized with `JSON.stringify(podlet)` and
returned to the router.

```js
app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});
```

Same as with the content route, we can use the podlets helper method `podlet.manifest()` to return the default manifest route, which is `'/manifest.json'`

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
    name: 'myPodlet', // required
    version: '1.0.0', // required
    content: '/', // optional
    fallback: '/fallback', // optional
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    res.status(200).send(`<div>This is the podlet's HTML content</div>`);
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.listen(7100);
```

## Next steps

-   [add a fallback route to your podlet](/docs/podlets/v2/fallbacks.html)
-   [learn about working with the context](/docs/podlets/v2/context.html)
-   [learn about adding additional routes using the proxy](/docs/podlets/v2/proxying.html)
-   [read about improving your podlet development workflow](/docs/podlets/v2/local_development.html)
