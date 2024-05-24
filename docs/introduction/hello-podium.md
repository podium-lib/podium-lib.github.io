---
title: Hello, Podium
---

In Podium there are two types of servers:

- Podlets that serve page fragments
- Layouts that compose podlets and serve the finished page

Podium servers supports multiple [HTTP frameworks](/docs/api/http-framework-compatibility). We'll be using [Express](https://expressjs.com/) in the examples on this page.

## Prerequisites

You should have some familiarity with building apps with JavaScript and Node.

You will need to have [Node](https://nodejs.org/en) installed in a current Long Term Support release or higher. [npm](https://docs.npmjs.com/cli/v10/commands/npm) will be installed automatically when you install Node.js.

## Your first podlet

A podlet serves a fragment of a whole page. You might think of this as a component running as a service.

The contract between a podlet and a layout is defined in a [JSON manifest](/docs/api/manifest). In its simplest form a podlet can be a static file server with two files:

- the JSON manifest
- a static HTML file

In most cases you will want something a bit more dynamic. The [@podium/podlet](/docs/api/podlet) provides helpers to build the JSON manifest and request handlers for a web server.

### Install `@podium/podlet`

Make an empty directory to hold your podlet and create a default `package.json` so you can install dependencies:

```sh
mkdir my-podlet
cd my-podlet
npm init -y
```

Then run this command to install dependencies:

```sh
npm install express @podium/podlet
```

### The podlet server

Make an `index.mjs` file and set up the podlet using Express:

```js
// index.mjs
import express from "express";
import Podlet from "@podium/podlet";

const app = express();

const podlet = new Podlet({
  name: "my-podlet",
  version: "1.0.0",
  pathname: "/",
  development: true, // this should be false in production
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

console.log("Server running at http://localhost:7100/");
app.listen(7100);
```

### Start your podlet server

Now you can run the server with Node:

```sh
node index.mjs
```

Open a browser and go to [http://localhost:7100](http://localhost:7100) to see the HTML content.

You can see the JSON manifest that makes up the contract between your podlet and a layout on [http://localhost:7100/manifest.json](http://localhost:7100/manifest.json).

## Your first layout

A layout is responsible for supplying the structure of an HTML page, inserting each podlet into the appropriate location in the page's markup, and then serving the resulting page.

The layout is also responsible for providing a [Podium context](/docs/guides/context) on requests made to each podlet. This context is a set of HTTP headers with information the podlet can use to generate dynamic content.

Like for podlets there is a [@podium/layout](/docs/api/layout) module which helps you build layouts.

### Install `@podium/layout`

Make a new empty directory to hold your layout and create a default `package.json` so you can install dependencies:

```sh
mkdir my-layout
cd my-layout
npm init -y
```

Then run this command to install dependencies:

```sh
npm install express @podium/layout
```

### The layout server

Make an `index.mjs` file and set up the layout using Express:

```js
// index.mjs
import express from "express";
import Layout from "@podium/layout";

const app = express();

const layout = new Layout({
  name: "my-layout",
  pathname: "/",
});

// Podlets have to be registered with the layout before they can be fetched
const myPodlet = layout.client.register({
  name: "my-podlet",
  uri: "http://localhost:7100/manifest.json",
});

app.use(layout.middleware());

app.get(layout.pathname(), async (req, res) => {
  const incoming = res.locals.podium;
  incoming.view.title = "My Super Page";

  // Pass the Podium context to the podlet
  const response = await myPodlet.fetch(incoming);

  // Register the podlet's JS and CSS assets with the layout's HTML template
  incoming.podlets = [response];

  res.podiumSend(`
    <div>This is the layout's HTML content</div>
    ${response}
  `);
});

console.log("Server running at http://localhost:7000/");
app.listen(7000);
```

### Start your layout server

Now you can run the server with Node:

```sh
node index.mjs
```

Open a browser and go to [http://localhost:7000](http://localhost:7000) to see the HTML content.

If you kept your podlet server running you should see its HTML content as well. Try closing the podlet server and refresh the page. What happens to your layout?

## Next steps

Now that you've made both a layout and a podlet you have what it takes to build a micro frontend architecture with runtime composition.

Next you may want to include some CSS, and perhaps client-side JavaScript. Let's have a look at how you can do performant loading of assets in a micro frontend architecture.
