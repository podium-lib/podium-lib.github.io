---
id: getting_started
title: Getting Started
---

This guide will walk you through how to get started building layouts for Podium in Node
js using the Express js HTTP framework. At the end you will have created a fairly bare bones page displaying content from a single podlet server.

## Before you begin

Ideally, you should have some familiarity with building apps with JavaScript and
Node.js. You will also need to have Node.js installed at version 8 or higher.
The npm cli will be installed automatically when you install Node.js. Additionally, you should familiarize yourself with the Podium's [high level concepts](/docs/podium/conceptual_overview.html) and understand [how to build a podlet](/docs/podlets/getting_started.html) with Podium.

## Step 1: Project setup

First, we need to initialize a new node project in an empty directory.

_Example_

```bash
mkdir basic-layout
cd basic-layout
npm init
```

Follow the prompts (mostly accepting defaults) to complete project
initialization.

## Step 2: Install dependencies

Next, we need to install and import our dependencies, `express` and
`@podium/layout`. To do so, run:

_Example_

```bash
npm install express @podium/layout
```

## Step 3: Import dependencies

Create a file `index.js`, open it in your favorite text editor and import our 2 dependencies at the top of the file.

_Example_

```js
const express = require('express');
const Layout = require('@podium/layout');
```

## Step 4: Instantiate instances

Create an express app instance and instantiate the layout. `name` and `pathname` are required parameters. `name` must be a unique identifier in camel casing. `pathname` is a prefix path to where your layout will appear online. For our example here we can say that our page will be served at `/demo` so `pathname` should be set to `/demo`. If our page were being served at the root of the server, `pathname` would need to be `/`.

_Example_

```js
const app = express();

const layout = new Layout({
    name: 'myLayout', // required
    pathname: '/demo', // required
});
```

## Step 5: Register a basic podlet for use in the page

For this step, we can use the podlet we created in the [podlets - getting started](/docs/podlets/getting_started.html) guide. It's set up to run on port `7100` so after we start it up, we can register our podlet's manifest file in our layout like so:

_Example_

```js
const podlet = layout.client.register({
    name: 'myPodlet', // required
    uri: 'http://localhost:7100/manifest.json', // required
});
```

The `uri` here should point to the podlet's manifest file, not to its server root.

## Step 6: Mount middleware

Mount the layout instance's middleware into the express app. This important step adds layout specific middleware to the app to take care of such tasks as context parsing and proxying.

_Example_

```js
app.use(layout.middleware());
```

## Step 7: Create a route to fetch and display a podlet's content

This is the route that the layout server will use to return its html page. We create our route using the same `pathname` value we gave the layout constructor.

In our route handler, we grab a request bound instance of HttpIncoming from the response object and hand it to the fetch method of our podlet client. This method returns a promise which resolves to be an object with the podlet's content and additional metadata which we can then insert into our page as shown below:

_Example_

```js
app.get('/demo', async (req, res) => {
    const incoming = res.locals.podium;
    const response = await podlet.fetch(incoming);

    incoming.view.title = 'My Super Page';

    res.podiumSend(`<div>${response}</div>`);
});
```

Take note of the use of the `incoming` object to set the page `title`. You can read more about this in the [`HttpIncoming` docs](api/incoming.md)

In a more realistic example, you might fetch content from any number of podlets. Your page might be broken up into podlets representing the page header, footer, sidebar and so on. Since podlets are isolated and independent of each other, we can safely fetch content in parallel.

_Example_

```js
app.get('/', (req, res) => {
    const incoming = res.locals.podium;
    const content = await Promise.all([
        header.fetch(incoming),
        sidebar.fetch(incoming),
        podlet.fetch(incoming),
        footer.fetch(incoming),
    ]);
    ...
});
```

## Step 8: Start the server

Now, all thats left is to start the server and test it out

_Example_

```js
app.listen(7000);
```

We call `.listen(port)` on the express app instance and pass it a port

We can run the app with:

_Example_

```bash
node index.js
```

And we can then visit our page in a browser at:

_Example_

```bash
http://localhost:7000/demo
```

If you see the text "This is the podlets html content" then you've successfully created your first layout.

## The complete code

_Example_

```js
const express = require('express');
const Layout = require('@podium/layout');

const app = express();

const layout = new Layout({
    name: 'myLayout',
    pathname: '/demo',
});

const podlet = layout.client.register({
    name: 'myPodlet',
    uri: 'http://localhost:7100/manifest.json',
});

app.use(layout.middleware());

app.get('/demo', async (req, res) => {
    const incoming = res.locals.podium;
    const response = await podlet.fetch(incoming);

    incoming.view.title = 'My Super Page';

    res.podiumSend(`<div>${response}</div>`);
});

app.listen(7000);
```
