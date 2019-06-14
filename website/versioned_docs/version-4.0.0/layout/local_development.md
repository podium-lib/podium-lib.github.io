---
id: version-4.0.0-local_development
title: Local Development
original_id: local_development
---

Once you have built one or more podlets, you will want to be able to test them in the more realistic context of a layout server, thereby allowing you to see the complete page and make sure all the pieces work together correctly.

The following examples show a somewhat contrived multi-podlet and layout setup in which our layout composes together a header, a navigation area, some content and a footer.

## Sample podlets

_Example: header_

Create a folder `/podlets/header` with a file `index.js` inside to hold the following podlet code.

```js
const Podlet = require('@podium/podlet');
const app = require('express')();

const podlet = new Podlet({
    name: 'header',
    version: '1.0.0',
    development: false,
});

app.use(podlet.middleware());

app.get('/manifest.json', (req, res) => {
    res.json(podlet);
});

app.get('/', (req, res) => {
    res.podiumSend(`<header>The Best Podium page ever</header>`);
});

app.listen(7001);
```

_Example: navigation bar_

Create a folder `/podlets/navigation` with a file `index.js` inside to hold the following podlet code.

```js
const Podlet = require('@podium/podlet');
const app = require('express')();

const podlet = new Podlet({
    name: 'navigation',
    version: '1.0.0',
    development: false,
});

app.use(podlet.middleware());

app.get('/manifest.json', (req, res) => {
    res.json(podlet);
});

app.get('/', (req, res) => {
    res.podiumSend(`<nav>
        <ul>
            <li><a href="/home">home</a></li>
            <li><a href="/blog">blog</a></li>
            <li><a href="/about">about</a></li>
            <li><a href="/contact">contact</a></li>
        </ul>
    </nav>`);
});

app.listen(7002);
```

_Example: main home page content_

Create a folder `/podlets/home` with a file `index.js` inside to hold the following podlet code.

```js
const Podlet = require('@podium/podlet');
const app = require('express')();

const podlet = new Podlet({
    name: 'homeContent',
    version: '1.0.0',
    development: false,
});

app.use(podlet.middleware());

app.get('/manifest.json', (req, res) => {
    res.json(podlet);
});

app.get('/', (req, res) => {
    res.podiumSend(`<section>Welcome to my Podium home page</section>`);
});

app.listen(7003);
```

_Example: page footer_

Create a folder `/podlets/footer` with a file `index.js` inside to hold the following podlet code.

```js
const Podlet = require('@podium/podlet');
const app = require('express')();

const podlet = new Podlet({
    name: 'footer',
    version: '1.0.0',
    development: false,
});

app.use(podlet.middleware());

app.get('/manifest.json', (req, res) => {
    res.json(podlet);
});

app.get('/', (req, res) => {
    res.podiumSend(`<footer>&copy; 2018 - the Podium team</footer>`);
});

app.listen(7004);
```

## Sample layout

_Example: the /home layout_

Create a folder `/layouts/home`. Create a file `index.js` inside this folder to hold the following layout code.

```js
const Layout = require('@podium/layout');
const app = require('express')();

const layout = new Layout({
    name: 'homePage',
    pathname: '/home',
});

const headerClient = layout.client.register({
    name: 'header',
    uri: 'http://localhost:7001/manifest.json',
});
const navigationClient = layout.client.register({
    name: 'navigation',
    uri: 'http://localhost:7002/manifest.json',
});
const contentClient = layout.client.register({
    name: 'content',
    uri: 'http://localhost:7003/manifest.json',
});
const footerClient = layout.client.register({
    name: 'footer',
    uri: 'http://localhost:7004/manifest.json',
});

app.use(layout.pathname(), layout.middleware());

app.get(layout.pathname(), async (req, res) => {
    const incoming = res.locals.podium;

    const [header, navigation, content, footer] = await Promise.all([
        headerClient.fetch(incoming),
        navigationClient.fetch(incoming),
        contentClient.fetch(incoming),
        footerClient.fetch(incoming),
    ]);

    incoming.view.title = 'Podium example - home';

    res.podiumSend(`
      <section>${header}</section>
      <section>${navigation}</section>
      <section>${content}</section>
      <section>${footer}</section>
    `);
});

app.listen(7000);
```

## Running podlets and layout together

Because each podlet and the layout have been configured to run on different ports you can safely start them all up together.

```bash
node podlets/header
node podlets/navigation
node podlets/home
node podlets/footer
```

We can now start up our `/home` layout to consume and display our podlet content.

```bash
node layouts/home
```

Our layout has been configured to run on port `7000` so we should now be able to visit the url `http://localhost:7000/home` in a browser and see `header`, `navigation`, `home page` and `footer` content composed together.

## Improving the development experience

The setup described above is a manual process requiring a number of repetitive operations by the developer to start up, restart or shut down processes. What follows are several suggestions for improving on this.

### using forever

One fairly simple way to manage all your podlets and layouts at once is to use a tool called [forever](https://github.com/foreverjs/forever) which is available on `npm`.

_Example: install forever_

```bash
npm i -g forever
```

`Forever` allows you to pass it some `json` configuration describing your setup and have it manage the processes

_Example: forever json configuration file_

```json
[
    {
        "uid": "header",
        "append": true,
        "watch": true,
        "script": "index.js",
        "sourceDir": "/path/to/podlets/header"
    },
    {
        "uid": "navigation",
        "append": true,
        "watch": true,
        "script": "index.js",
        "sourceDir": "/path/to/podlets/navigation"
    },
    {
        "uid": "home",
        "append": true,
        "watch": true,
        "script": "index.js",
        "sourceDir": "/path/to/podlets/home"
    },
    {
        "uid": "footer",
        "append": true,
        "watch": true,
        "script": "index.js",
        "sourceDir": "/path/to/podlets/footer"
    },
    {
        "uid": "homePage",
        "append": true,
        "watch": true,
        "script": "index.js",
        "sourceDir": "/path/to/layouts/home"
    }
]
```

You can then pass the configuration file to `forever` to start everything up at once.

_Example: running forever_

```bash
forever start /path/to/development.json
```

Notice that every service has been configured to run in watch mode meaning that they will be automatically restarted any time a file change is detected.

You can [read more about forever here](https://github.com/foreverjs/forever).

### using pm2

A great alternative to forever is [pm2](https://pm2.io/). Pm2 can also take a configuration file in `json` format, can aggregate logs, run services in watch mode, has great docs and more.
