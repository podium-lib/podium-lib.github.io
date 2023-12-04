"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2614],{6104:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>h,frontMatter:()=>i,metadata:()=>d,toc:()=>u});var r=n(5893),o=n(1151),s=n(4866),a=n(5162);const i={id:"getting_started",title:"Getting Started"},l=void 0,d={id:"api/getting_started",title:"Getting Started",description:"Podium consists of two parts; podlets and layouts, each with its own matching module to be used for development.",source:"@site/docs/api/getting_started.md",sourceDirName:"api",slug:"/api/getting_started",permalink:"/docs/api/getting_started",draft:!1,unlisted:!1,editUrl:"https://github.com/podium-lib/podium-lib.github.io/tree/main/website/docs/docs/api/getting_started.md",tags:[],version:"current",frontMatter:{id:"getting_started",title:"Getting Started"},sidebar:"sidebar",previous:{title:"Handling redirects from podlets",permalink:"/docs/layout/handling_redirects"},next:{title:"HttpIncoming",permalink:"/docs/api/incoming"}},p={},u=[{value:"Podlets",id:"podlets",level:3},{value:"Layouts",id:"layouts",level:3},{value:"HTTP Framework Compabillity",id:"http-framework-compabillity",level:2}];function c(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:"Podium consists of two parts; podlets and layouts, each with its own matching module to be used for development."}),"\n",(0,r.jsx)(t.h3,{id:"podlets",children:"Podlets"}),"\n",(0,r.jsxs)(t.p,{children:["When writing a server for serving page fragments (podlets), the ",(0,r.jsx)(t.a,{href:"/docs/api/podlet",children:"@podium/podlet module"})," should be used."]}),"\n",(0,r.jsx)(t.h3,{id:"layouts",children:"Layouts"}),"\n",(0,r.jsxs)(t.p,{children:["When writing a layout server in order to compose page fragments together, the ",(0,r.jsx)(t.a,{href:"/docs/api/layout",children:"@podium/layout module"})," should be used."]}),"\n",(0,r.jsx)(t.h2,{id:"http-framework-compabillity",children:"HTTP Framework Compabillity"}),"\n",(0,r.jsxs)(t.p,{children:["Podium is HTTP framework agnostic with first class support for ",(0,r.jsx)(t.a,{href:"https://expressjs.com/",children:"Express"}),". In\npractise this means that core Podium works with the standard ",(0,r.jsx)(t.a,{href:"https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_class_http_server",children:"http.Server"}),"\nmodule in Node.js but the core modules also come with ",(0,r.jsx)(t.a,{href:"https://expressjs.com/",children:"Express"})," compatible\nmiddleware methods for ease of use."]}),"\n",(0,r.jsxs)(t.p,{children:["Due to the fact that Podium is built for usage with the ",(0,r.jsx)(t.a,{href:"https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_class_http_server",children:"http.Server"})," module in\nNode.js, it's pretty straight forward to get Podium to work with most HTTP frameworks. The most\ncommon way to support different HTTP framework is through plugins."]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.a,{href:"https://hapijs.com/",children:"Hapi"})," and ",(0,r.jsx)(t.a,{href:"https://www.fastify.io/",children:"Fastify"})," are both HTTP frameworks that the Podium team support by\nmaintaining plugins for each. There are also user land plugins\nfor other HTTP frameworks."]}),"\n",(0,r.jsxs)(t.p,{children:["Using Podium together with ",(0,r.jsx)(t.a,{href:"https://hapijs.com/",children:"Hapi"})," or ",(0,r.jsx)(t.a,{href:"https://www.fastify.io/",children:"Fastify"})," requires that the\nplugin is handed an instance of the appropriate Podium module."]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["To write a podlet server with Hapi; please see ",(0,r.jsx)(t.a,{href:"https://github.com/podium-lib/hapi-podlet",children:"@podium/hapi-podlet"})]}),"\n",(0,r.jsxs)(t.li,{children:["To write a layout server with Hapi; please see ",(0,r.jsx)(t.a,{href:"https://github.com/podium-lib/hapi-layout",children:"@podium/hapi-layout"})]}),"\n",(0,r.jsxs)(t.li,{children:["To write a podlet server with Fastify; please see ",(0,r.jsx)(t.a,{href:"https://github.com/podium-lib/fastify-podlet",children:"@podium/fastify-podlet"})]}),"\n",(0,r.jsxs)(t.li,{children:["To write a layout server with Fastify; please see ",(0,r.jsx)(t.a,{href:"https://github.com/podium-lib/fastify-layout",children:"@podium/fastify-layout"})]}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"Example of setting up a podlet server in all HTTP frameworks supported by the Podium team:"}),"\n",(0,r.jsxs)(s.Z,{groupId:"server-frameworks",children:[(0,r.jsx)(a.Z,{value:"express",label:"Express",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-js",children:"import express from 'express';\nimport Podlet from '@podium/podlet';\n\nconst app = express();\n\nconst podlet = new Podlet({\n    name: 'myPodlet',\n    version: '1.0.0',\n    pathname: '/',\n    development: true,\n});\n\napp.use(podlet.middleware());\n\napp.get(podlet.content(), (req, res) => {\n    if (res.locals.podium.context.locale === 'nb-NO') {\n        return res.status(200).podiumSend('<h2>Hei verden</h2>');\n    }\n    res.status(200).podiumSend(`<h2>Hello world</h2>`);\n});\n\napp.get(podlet.manifest(), (req, res) => {\n    res.status(200).json(podlet);\n});\n\napp.listen(7100);\n"})})}),(0,r.jsx)(a.Z,{value:"hapi",label:"Hapi",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-js",children:"import HapiPodlet from '@podium/hapi-podlet';\nimport Podlet from '@podium/podlet';\nimport Hapi from 'hapi';\n\nconst app = Hapi.Server({\n    host: 'localhost',\n    port: 7100,\n});\n\nconst podlet = new Podlet({\n    name: 'myPodlet',\n    version: '1.0.0',\n    pathname: '/',\n    development: true,\n});\n\napp.register({\n    plugin: new HapiPodlet(),\n    options: podlet,\n});\n\napp.route({\n    method: 'GET',\n    path: podlet.content(),\n    handler: (request, h) => {\n        if (request.app.podium.context.locale === 'nb-NO') {\n            return h.podiumSend('<h2>Hei verden</h2>');\n        }\n        return h.podiumSend('<h2>Hello world</h2>');\n    },\n});\n\napp.route({\n    method: 'GET',\n    path: podlet.manifest(),\n    handler: (request, h) => JSON.stringify(podlet),\n});\n\napp.start();\n"})})}),(0,r.jsx)(a.Z,{value:"fastify",label:"Fastify",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-js",children:"import fastifyPodlet from '@podium/fastify-podlet';\nimport fastify from 'fastify';\nimport Podlet from '@podium/podlet';\n\nconst app = fastify();\n\nconst podlet = new Podlet({\n    name: 'myPodlet',\n    version: '1.0.0',\n    pathname: '/',\n    development: true,\n});\n\napp.register(fastifyPodlet, podlet);\n\napp.get(podlet.content(), async (request, reply) => {\n    if (reply.app.podium.context.locale === 'nb-NO') {\n        reply.podiumSend('<h2>Hei verden</h2>');\n        return;\n    }\n    reply.podiumSend('<h2>Hello world</h2>');\n});\n\napp.get(podlet.manifest(), async (request, reply) => {\n    reply.send(podlet);\n});\n\nconst start = async () => {\n    try {\n        await app.listen(7100);\n        app.log.info(`server listening on ${app.server.address().port}`);\n    } catch (err) {\n        app.log.error(err);\n        process.exit(1);\n    }\n};\nstart();\n"})})}),(0,r.jsx)(a.Z,{value:"http",label:"HTTP",children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-js",children:"import { HttpIncoming } from '@podium/utils';\nimport Podlet from '@podium/podlet';\nimport http from 'http';\n\nconst podlet = new Podlet({\n    name: 'myPodlet',\n    version: '1.0.0',\n    pathname: '/',\n    development: true,\n});\n\nconst server = http.createServer(async (req, res) => {\n    let incoming = new HttpIncoming(req, res);\n    incoming = await podlet.process(incoming);\n\n    if (incoming.url.pathname === podlet.manifest()) {\n        res.statusCode = 200;\n        res.setHeader('Content-Type', 'application/json');\n        res.setHeader('podlet-version', podlet.version);\n        res.end(JSON.stringify(podlet));\n        return;\n    }\n\n    if (incoming.url.pathname === podlet.content()) {\n        res.statusCode = 200;\n        res.setHeader('Content-Type', 'text/html');\n        res.setHeader('podlet-version', podlet.version);\n\n        if (incoming.context.locale === 'nb-NO') {\n            res.end(podlet.render(incoming, '<h2>Hei verden</h2>'));\n            return;\n        }\n        res.end(podlet.render(incoming, '<h2>Hello world</h2>'));\n        return;\n    }\n\n    res.statusCode = 404;\n    res.setHeader('Content-Type', 'text/plain');\n    res.end('Not found');\n});\n\nserver.listen(7100);\n"})})})]})]})}function h(e={}){const{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},5162:(e,t,n)=>{n.d(t,{Z:()=>a});n(7294);var r=n(6010);const o={tabItem:"tabItem_Ymn6"};var s=n(5893);function a(e){let{children:t,hidden:n,className:a}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,r.Z)(o.tabItem,a),hidden:n,children:t})}},4866:(e,t,n)=>{n.d(t,{Z:()=>j});var r=n(7294),o=n(6010),s=n(2466),a=n(6550),i=n(469),l=n(1980),d=n(7392),p=n(12);function u(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function c(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:o}}=e;return{value:t,label:n,attributes:r,default:o}}))}(n);return function(e){const t=(0,d.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function h(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:n}=e;const o=(0,a.k6)(),s=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,l._X)(s),(0,r.useCallback)((e=>{if(!s)return;const t=new URLSearchParams(o.location.search);t.set(s,e),o.replace({...o.location,search:t.toString()})}),[s,o])]}function f(e){const{defaultValue:t,queryString:n=!1,groupId:o}=e,s=c(e),[a,l]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:s}))),[d,u]=m({queryString:n,groupId:o}),[f,g]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[o,s]=(0,p.Nk)(n);return[o,(0,r.useCallback)((e=>{n&&s.set(e)}),[n,s])]}({groupId:o}),b=(()=>{const e=d??f;return h({value:e,tabValues:s})?e:null})();(0,i.Z)((()=>{b&&l(b)}),[b]);return{selectedValue:a,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),g(e)}),[u,g,s]),tabValues:s}}var g=n(2389);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=n(5893);function y(e){let{className:t,block:n,selectedValue:r,selectValue:a,tabValues:i}=e;const l=[],{blockElementScrollPositionUntilNextRender:d}=(0,s.o5)(),p=e=>{const t=e.currentTarget,n=l.indexOf(t),o=i[n].value;o!==r&&(d(t),a(o))},u=e=>{let t=null;switch(e.key){case"Enter":p(e);break;case"ArrowRight":{const n=l.indexOf(e.currentTarget)+1;t=l[n]??l[0];break}case"ArrowLeft":{const n=l.indexOf(e.currentTarget)-1;t=l[n]??l[l.length-1];break}}t?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":n},t),children:i.map((e=>{let{value:t,label:n,attributes:s}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>l.push(e),onKeyDown:u,onClick:p,...s,className:(0,o.Z)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":r===t}),children:n??t},t)}))})}function x(e){let{lazy:t,children:n,selectedValue:o}=e;const s=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=s.find((e=>e.props.value===o));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:s.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==o})))})}function w(e){const t=f(e);return(0,v.jsxs)("div",{className:(0,o.Z)("tabs-container",b.tabList),children:[(0,v.jsx)(y,{...e,...t}),(0,v.jsx)(x,{...e,...t})]})}function j(e){const t=(0,g.Z)();return(0,v.jsx)(w,{...e,children:u(e.children)},String(t))}},1151:(e,t,n)=>{n.d(t,{Z:()=>i,a:()=>a});var r=n(7294);const o={},s=r.createContext(o);function a(e){const t=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),r.createElement(s.Provider,{value:t},e.children)}}}]);