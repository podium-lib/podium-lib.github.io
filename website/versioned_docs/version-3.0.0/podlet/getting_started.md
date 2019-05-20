---
id: version-3.0.0-getting_started
title: Getting Started
original_id: getting_started
---

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

Next, we need to install and import dependencies. Express js and @podium/podlet.
To do so, run:

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
  pathname: '/', // required
  manifest: '/manifest.json', // optional, defaults to '/manifest.json'
  content: '/', // optional, defaults to '/'
  development: true // optional, defaults to false
});
```

It's not necessary to set `content` or `manifest` as we have done above. These values default to appropriate values that you will use most of the time.

While we have set `development` to `true`, it's important to remember to set this to `false` when working with layouts. Development mode is only useful when working on a podlet in isolation.

## Step 5: Mount middleware

Mount the podlet instances [middleware](https://medium.com/@agoiabeladeyemi/a-simple-explanation-of-express-middleware-c68ea839f498) into the express app

```js
app.use(podlet.middleware());
```

## Step 6: Create a content route

This is the route that the podlet server will use to return its HTML content.

```js
app.get(podlet.content(), (req, res) => {
  res.status(200).podiumSend(`
        <div>
            This is the podlet's HTML content
        </div>
    `);
});
```

Here we use the podlets helper method `podlet.content()` which returns the content path we set in step 4.

## Step 7: Create a manifest route

In Podium, each podlet must return meta data about itself in the form of a JSON document. By returning the podlet object, it will be serialized with `JSON.stringify(podlet)` and
returned to the router.

```js
app.get(podlet.manifest(), (req, res) => {
  res.status(200).send(podlet);
});
```

Same as with the content route, we can use the podlet's helper method `podlet.manifest()` to return the default manifest route, which is `'/manifest.json'`

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

And we can then CURL the server to get back it's manifest content:

```bash
curl http://localhost:7100/manifest.json
# {"name":"myPodlet","version":"1.0.0","content":"/","fallback":"/fallback","assets":{"js":"","css":""},"proxy":{}}
```

And CURL the server to get back it's HTML content:

```bash
curl http://localhost:7100
# <div>This is the podlet's HTML content</div>
```

## The complete code

```js
const express = require('express');
const Podlet = require('@podium/podlet');

const app = express();

const podlet = new Podlet({
  name: 'myPodlet',
  version: '1.0.0',
  pathname: '/',
  content: '/',
  fallback: '/fallback',
  development: true
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
  res.status(200).podiumSend(`
        <div>
            This is the podlet's HTML content
        </div>
    `);
});

app.get(podlet.manifest(), (req, res) => {
  res.status(200).send(podlet);
});

app.listen(7100);
```
