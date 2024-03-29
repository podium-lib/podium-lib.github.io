/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  sidebar: [
    {
      type: "category",
      label: "Overview",
      items: [{ type: "doc", id: "podium/conceptual_overview" }],
    },
    {
      type: "category",
      label: "Podlet Guides",
      items: [
        { type: "doc", id: "podlet/getting_started" },
        { type: "doc", id: "podlet/fallbacks" },
        { type: "doc", id: "podlet/context" },
        { type: "doc", id: "podlet/proxying" },
        { type: "doc", id: "podlet/local_development" },
        { type: "doc", id: "podlet/podlet_to_podlet_communication" },
      ],
    },
    {
      type: "category",
      label: "Layout Guides",
      items: [
        { type: "doc", id: "layout/getting_started" },
        { type: "doc", id: "layout/context" },
        { type: "doc", id: "layout/unavailable_podlets" },
        { type: "doc", id: "layout/dynamic_routes" },
        { type: "doc", id: "layout/assets" },
        { type: "doc", id: "layout/local_development" },
        { type: "doc", id: "layout/handling_redirects" },
      ],
    },
    {
      type: "category",
      label: "API Docs",
      items: [
        { type: "doc", id: "api/getting_started" },
        { type: "doc", id: "api/incoming" },
        { type: "doc", id: "api/assets" },
        { type: "doc", id: "api/document" },
        { type: "doc", id: "api/podlet" },
        { type: "doc", id: "api/layout" },
        { type: "doc", id: "api/browser" },
      ],
    },
  ],
};

module.exports = sidebars;
