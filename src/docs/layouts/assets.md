# 📦 Assets

PODLET

```js
const app = express();
const podlet = new Podlet({ ... });
const assets = new Assets({ server: 'http://localhost:3031' });

const ready = Promise.all([,
    assets.publish('unique-id', '/path/to/script.js'),
    assets.publish('unique-id', '/path/to/style.css'),
]);

app.use(async (req, res, next) => {
    await ready();
    next();
})

app.use(podlet.middleware());

app.get('/manifest.json', (req, res) => {
    res.send(podlet);
});

app.get('/', (req, res) => {
    res.send(`<div>Some podlet content</div>`);
});

app.listen(7100);
```

LAYOUT

```js
const app = express();
const layout = new Layout({ ... });

layout.client.register({ ... });
layout.client.register({ ... });
layout.client.register({ ... });

const assets = new Assets({ server: 'http://localhost:3031' });

const ready = Promise.all([
    assets.publish('another-unique-id', '/path/to/client.js'),
    assets.publish('another-unique-id', '/path/to/style.css'),
]).then(() => Promise.all([
    assets.bundle.js('another-unique-id', 'unique-id'),
    assets.bundle.css('another-unique-id', 'unique-id'),
]));

app.use(async (req, res, next) => {
    await ready();
    next();
})

app.use(layout.middleware());

app.get('/', async (req, res) => {
    const [js, css] = Promise.all([
        assets.js(),
        assets.css(),
    ]);
    res.send(`
        <html>
            <head>
                ${css.map(href => `<link rel="stylesheet" href="${href}" />`).join('\n')}
            </head>
            <body>
                ...
                ${js.map(src => `<script src="${src}"></script>`).join('\n')}
            </body>
        </html>
    `);
});

...
```

Use cases

-   Request to layout comes in and everything waits until assets are resolved. (published, bundled and url computed).
-   Ready checks do the waiting for assets to be resolved.
-   Get a calculated URL to a bundle

LAYOUT

<!-- publish js and css assets -->

assets.publish(tag, path.js)
assets.publish(tag, path.css)

<!-- bundle a set of publishing tags -->

assets.bundle.js(tag, tag, tag, ...)
assets.bundle.css(tag, tag, tag, ...)

<!-- wait for publishing and bundling to be complete -->

assets.ready()
assets.middleware()

<!-- synchronously get bundle url arrays for js and css -->

assets.script() => [ url ]
assets.style() => [ url ]

PODLET

<!-- publish js and css assets -->

assets.publish(tag, path.js)
assets.publish(tag, path.css)

<!-- wait for publishing to be complete -->

assets.middleware()
assets.ready()

<!-- synchronously get asset hashes for js and css -->

Given tags, make me a bundle:

=> tag1,tag2,tag3
=> as45d3asd453as.json, da54s3d54as3d5.json, sa76d5a67sd5a76sd5.json

Given tags, give me a url:

=> tag1,tag2,tag3
=> as45d3asd453as.json, da54s3d54as3d5.json, sa76d5a67sd5a76sd5.json
=> 5as43d45sa3d4asd45.js

Given a tag and and asset feed, give me a url:

=> tag + [feed]
=> perform bundle
=> build url

bundle made up of feeds with these hashes:
as45d3asd453as, da54s3d54as3d5, sa76d5a67sd5a76sd5

publish
=> tag, [feed]
=> hash feed to get name -> fds12dfs12d3s1df23.json
=> set tag file to point to fds12dfs12d3s1df23.json
=> hunt for tag in tags when found. eg. tag in [tag, tag2, tag3]
=> lookup all hashes for all tags. eg. [tag, tag2, tag3] => [as45d3asd453as.json, da54s3d54as3d5.json, sa76d5a67sd5a76sd5.json]
=> hash together hashes to produce 1 hash and check if file exists: eg. [as45d3asd453as.json, da54s3d54as3d5.json, sa76d5a67sd5a76sd5.json] -> asdas65456sd4.js
=> produce new bundle if not

bundle
=> [tag, tag2, tag3], 'js'
=> lookup all hashes for all tags. eg. [tag, tag2, tag3] => [as45d3asd453as.json, da54s3d54as3d5.json, sa76d5a67sd5a76sd5.json]
=> hash together hashes to produce 1 hash and check if file exists: eg. [as45d3asd453as.json, da54s3d54as3d5.json, sa76d5a67sd5a76sd5.json] -> asdas65456sd4.js
=> produce new bundle if not

url
=> [tag, tag2, tag3], 'js'
=> lookup all hashes for all tags. eg. [tag, tag2, tag3] => [as45d3asd453as.json, da54s3d54as3d5.json, sa76d5a67sd5a76sd5.json]
=> hash together hashes to produce 1 hash and check if file exists: eg. [as45d3asd453as.json, da54s3d54as3d5.json, sa76d5a67sd5a76sd5.json] -> asdas65456sd4.js

assets.publish('unique-id', '/path/to/script.js');
podlet.js('unique-id');
