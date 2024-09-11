---
title: Browser extension
---

Developing layouts and podlets mostly works the same way as other web servers. Still, there are a couple of scenarios where the built-in developer tools in your browser can fall a bit short. The Podium Developer Tools browser extension can help.

## Download the browser extension

The Podium browser extension is available for Firefox and Chromium-based browsers.

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/podium-developer-tools/)
- [Chromium](https://chromewebstore.google.com/detail/podium-development-extens/jdlcejoeifgnnnckhnhapbmgieajaipl) based browsers

## Using the browser extension

First, you may have to allow the extension to run on the page you're debugging. In Firefox this is shown with a mark by the extensions drawer, and on the extension itself.

![](/img/browser-extension-permissions.png)

The extension adds two new panes to your browser's developer tools that cover two main use-cases. You may have to open an overflow menu to see them.

![](/img/browser-extension-devtools-panes.png)

### The Podium Context pane

This pane is used when developing podlets to change the default values set on the [Podium context](/docs/guides/context). Say you want to test how your podlet behaves when given a different `deviceType` value. You could make changes in code, restart the server and then do your test, or you can use the extension and it's [partner middleware](https://github.com/podium-lib/dev-tool/tree/main/packages/server) to quickly swap values at runtime.

### The Podium Headers pane

This pane helps you set HTTP headers on requests to the server. It's mainly designed for use with Podium layouts, but can be used to set any header for any server. It comes with presets for [hybrid HTTP headers](/docs/guides/hybrid#hybrid-http-headers), but you can add and remove any headers you might need.

## Missing a feature?

If you have ideas for additional features that would help you develop and debug Podium applications, please [open an issue in the dev-tool repo](https://github.com/podium-lib/dev-tool/issues). If an issue allready exists, give it a thumbs-up.
