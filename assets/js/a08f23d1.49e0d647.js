"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2472],{7579:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>i,contentTitle:()=>a,default:()=>p,frontMatter:()=>r,metadata:()=>l,toc:()=>d});var t=o(5893),s=o(1151);const r={id:"local_development",title:"Local Development"},a=void 0,l={id:"layout/local_development",title:"Local Development",description:"Once you have built one or more podlets, you will want to be able to test them in the more realistic context of a layout server, thereby allowing you to see the complete page and make sure all the pieces work together correctly.",source:"@site/docs/layout/local_development.md",sourceDirName:"layout",slug:"/layout/local_development",permalink:"/docs/layout/local_development",draft:!1,unlisted:!1,editUrl:"https://github.com/podium-lib/podium-lib.github.io/tree/main/website/docs/docs/layout/local_development.md",tags:[],version:"current",frontMatter:{id:"local_development",title:"Local Development"},sidebar:"sidebar",previous:{title:"Assets",permalink:"/docs/layout/assets"},next:{title:"Handling redirects from podlets",permalink:"/docs/layout/handling_redirects"}},i={},d=[{value:"Sample podlets",id:"sample-podlets",level:2},{value:"Sample layout",id:"sample-layout",level:2},{value:"Running podlets and layout together",id:"running-podlets-and-layout-together",level:2},{value:"Improving the development experience",id:"improving-the-development-experience",level:2},{value:"using forever",id:"using-forever",level:3},{value:"using pm2",id:"using-pm2",level:3}];function c(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"Once you have built one or more podlets, you will want to be able to test them in the more realistic context of a layout server, thereby allowing you to see the complete page and make sure all the pieces work together correctly."}),"\n",(0,t.jsx)(n.p,{children:"The following examples show a somewhat contrived multi-podlet and layout setup in which our layout composes together a header, a navigation area, some content and a footer."}),"\n",(0,t.jsx)(n.h2,{id:"sample-podlets",children:"Sample podlets"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example: header"})}),"\n",(0,t.jsxs)(n.p,{children:["Create a folder ",(0,t.jsx)(n.code,{children:"/podlets/header"})," with a file ",(0,t.jsx)(n.code,{children:"index.js"})," inside to hold the following podlet code."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:"const Podlet = require('@podium/podlet');\nconst app = require('express')();\n\nconst podlet = new Podlet({\n    name: 'header',\n    version: '1.0.0',\n    development: false,\n});\n\napp.use(podlet.middleware());\n\napp.get('/manifest.json', (req, res) => {\n    res.json(podlet);\n});\n\napp.get('/', (req, res) => {\n    res.podiumSend(`<header>The Best Podium page ever</header>`);\n});\n\napp.listen(7001);\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example: navigation bar"})}),"\n",(0,t.jsxs)(n.p,{children:["Create a folder ",(0,t.jsx)(n.code,{children:"/podlets/navigation"})," with a file ",(0,t.jsx)(n.code,{children:"index.js"})," inside to hold the following podlet code."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:"const Podlet = require('@podium/podlet');\nconst app = require('express')();\n\nconst podlet = new Podlet({\n    name: 'navigation',\n    version: '1.0.0',\n    development: false,\n});\n\napp.use(podlet.middleware());\n\napp.get('/manifest.json', (req, res) => {\n    res.json(podlet);\n});\n\napp.get('/', (req, res) => {\n    res.podiumSend(`<nav>\n        <ul>\n            <li><a href=\"/home\">home</a></li>\n            <li><a href=\"/blog\">blog</a></li>\n            <li><a href=\"/about\">about</a></li>\n            <li><a href=\"/contact\">contact</a></li>\n        </ul>\n    </nav>`);\n});\n\napp.listen(7002);\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example: main home page content"})}),"\n",(0,t.jsxs)(n.p,{children:["Create a folder ",(0,t.jsx)(n.code,{children:"/podlets/home"})," with a file ",(0,t.jsx)(n.code,{children:"index.js"})," inside to hold the following podlet code."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:"const Podlet = require('@podium/podlet');\nconst app = require('express')();\n\nconst podlet = new Podlet({\n    name: 'homeContent',\n    version: '1.0.0',\n    development: false,\n});\n\napp.use(podlet.middleware());\n\napp.get('/manifest.json', (req, res) => {\n    res.json(podlet);\n});\n\napp.get('/', (req, res) => {\n    res.podiumSend(`<section>Welcome to my Podium home page</section>`);\n});\n\napp.listen(7003);\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example: page footer"})}),"\n",(0,t.jsxs)(n.p,{children:["Create a folder ",(0,t.jsx)(n.code,{children:"/podlets/footer"})," with a file ",(0,t.jsx)(n.code,{children:"index.js"})," inside to hold the following podlet code."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:"const Podlet = require('@podium/podlet');\nconst app = require('express')();\n\nconst podlet = new Podlet({\n    name: 'footer',\n    version: '1.0.0',\n    development: false,\n});\n\napp.use(podlet.middleware());\n\napp.get('/manifest.json', (req, res) => {\n    res.json(podlet);\n});\n\napp.get('/', (req, res) => {\n    res.podiumSend(`<footer>&copy; 2018 - the Podium team</footer>`);\n});\n\napp.listen(7004);\n"})}),"\n",(0,t.jsx)(n.h2,{id:"sample-layout",children:"Sample layout"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example: the /home layout"})}),"\n",(0,t.jsxs)(n.p,{children:["Create a folder ",(0,t.jsx)(n.code,{children:"/layouts/home"}),". Create a file ",(0,t.jsx)(n.code,{children:"index.js"})," inside this folder to hold the following layout code."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:"const Layout = require('@podium/layout');\nconst app = require('express')();\n\nconst layout = new Layout({\n    name: 'homePage',\n    pathname: '/home',\n});\n\nconst headerClient = layout.client.register({\n    name: 'header',\n    uri: 'http://localhost:7001/manifest.json',\n});\nconst navigationClient = layout.client.register({\n    name: 'navigation',\n    uri: 'http://localhost:7002/manifest.json',\n});\nconst contentClient = layout.client.register({\n    name: 'content',\n    uri: 'http://localhost:7003/manifest.json',\n});\nconst footerClient = layout.client.register({\n    name: 'footer',\n    uri: 'http://localhost:7004/manifest.json',\n});\n\napp.use(layout.pathname(), layout.middleware());\n\napp.get(layout.pathname(), async (req, res) => {\n    const incoming = res.locals.podium;\n\n    const [header, navigation, content, footer] = await Promise.all([\n        headerClient.fetch(incoming),\n        navigationClient.fetch(incoming),\n        contentClient.fetch(incoming),\n        footerClient.fetch(incoming),\n    ]);\n\n    incoming.view.title = 'Podium example - home';\n\n    res.podiumSend(`\n      <section>${header}</section>\n      <section>${navigation}</section>\n      <section>${content}</section>\n      <section>${footer}</section>\n    `);\n});\n\napp.listen(7000);\n"})}),"\n",(0,t.jsx)(n.h2,{id:"running-podlets-and-layout-together",children:"Running podlets and layout together"}),"\n",(0,t.jsx)(n.p,{children:"Because each podlet and the layout have been configured to run on different ports you can safely start them all up together."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"node podlets/header\nnode podlets/navigation\nnode podlets/home\nnode podlets/footer\n"})}),"\n",(0,t.jsxs)(n.p,{children:["We can now start up our ",(0,t.jsx)(n.code,{children:"/home"})," layout to consume and display our podlet content."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"node layouts/home\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Our layout has been configured to run on port ",(0,t.jsx)(n.code,{children:"7000"})," so we should now be able to visit the url ",(0,t.jsx)(n.code,{children:"http://localhost:7000/home"})," in a browser and see ",(0,t.jsx)(n.code,{children:"header"}),", ",(0,t.jsx)(n.code,{children:"navigation"}),", ",(0,t.jsx)(n.code,{children:"home page"})," and ",(0,t.jsx)(n.code,{children:"footer"})," content composed together."]}),"\n",(0,t.jsx)(n.h2,{id:"improving-the-development-experience",children:"Improving the development experience"}),"\n",(0,t.jsx)(n.p,{children:"The setup described above is a manual process requiring a number of repetitive operations by the developer to start up, restart or shut down processes. What follows are several suggestions for improving on this."}),"\n",(0,t.jsx)(n.h3,{id:"using-forever",children:"using forever"}),"\n",(0,t.jsxs)(n.p,{children:["One fairly simple way to manage all your podlets and layouts at once is to use a tool called ",(0,t.jsx)(n.a,{href:"https://github.com/foreverjs/forever",children:"forever"})," which is available on ",(0,t.jsx)(n.code,{children:"npm"}),"."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example: install forever"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm i -g forever\n"})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"Forever"})," allows you to pass it some ",(0,t.jsx)(n.code,{children:"json"})," configuration describing your setup and have it manage the processes"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example: forever json configuration file"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'[\n    {\n        "uid": "header",\n        "append": true,\n        "watch": true,\n        "script": "index.js",\n        "sourceDir": "/path/to/podlets/header"\n    },\n    {\n        "uid": "navigation",\n        "append": true,\n        "watch": true,\n        "script": "index.js",\n        "sourceDir": "/path/to/podlets/navigation"\n    },\n    {\n        "uid": "home",\n        "append": true,\n        "watch": true,\n        "script": "index.js",\n        "sourceDir": "/path/to/podlets/home"\n    },\n    {\n        "uid": "footer",\n        "append": true,\n        "watch": true,\n        "script": "index.js",\n        "sourceDir": "/path/to/podlets/footer"\n    },\n    {\n        "uid": "homePage",\n        "append": true,\n        "watch": true,\n        "script": "index.js",\n        "sourceDir": "/path/to/layouts/home"\n    }\n]\n'})}),"\n",(0,t.jsxs)(n.p,{children:["You can then pass the configuration file to ",(0,t.jsx)(n.code,{children:"forever"})," to start everything up at once."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example: running forever"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"forever start /path/to/development.json\n"})}),"\n",(0,t.jsx)(n.p,{children:"Notice that every service has been configured to run in watch mode meaning that they will be automatically restarted any time a file change is detected."}),"\n",(0,t.jsxs)(n.p,{children:["You can ",(0,t.jsx)(n.a,{href:"https://github.com/foreverjs/forever",children:"read more about forever here"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"using-pm2",children:"using pm2"}),"\n",(0,t.jsxs)(n.p,{children:["A great alternative to forever is ",(0,t.jsx)(n.a,{href:"https://pm2.io/",children:"pm2"}),". Pm2 can also take a configuration file in ",(0,t.jsx)(n.code,{children:"json"})," format, can aggregate logs, run services in watch mode, has great docs and more."]})]})}function p(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},1151:(e,n,o)=>{o.d(n,{Z:()=>l,a:()=>a});var t=o(7294);const s={},r=t.createContext(s);function a(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);