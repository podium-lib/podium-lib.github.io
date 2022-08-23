// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const baseUrl = "/";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Podium",
  tagline: "Easy server side composition of microfrontends",
  url: "https://podium-lib.io",
  baseUrl,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "podium-lib", // Usually your GitHub org/user name.
  projectName: "podium-lib", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
          'https://github.com/podium-lib/podium-lib.github.io/blob/source',
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          // 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Podium.io",
        logo: {
          alt: "Podium Logo",
          src: "img/podium.png",
        },
        items: [
          {
            type: "doc",
            to: "podium/conceptual_overview",
            docId: "podium/conceptual_overview",
            label: "Overview",
          },
          {
            type: "doc",
            to: "podlet/getting_started",
            docId: "podlet/getting_started",
            label: "Podlets",
          },
          {
            type: "doc",
            to: "layout/getting_started",
            docId: "layout/getting_started",
            label: "Layouts",
          },
          {
            type: "doc",
            to: "api/getting_started",
            docId: "api/getting_started",
            label: "API",
          },
          {
            href: "/help",
            label: "Help",
          },
          { 
            to: "/blog",
            label: "Blog",
            position: "left"
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Conceptual overview",
                to: "/docs/podium/conceptual_overview",
              },
              {
                label: "Podlets",
                to: "/docs/podlet/getting_started",
              },
              {
                label: "Layouts",
                to: "/docs/layout/getting_started",
              },
            ],
          },
          {
            title: "API",
            items: [
              {
                label: "Getting started",
                to: "/docs/api/getting_started",
              },
              {
                label: "Podlets",
                to: "/docs/api/podlet",
              },
              {
                label: "Layouts",
                to: "/docs/api/layout",
              },
            ],
          },
          {
            title: "Links",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "Issues",
                href: "https://github.com/podium-lib/issues",
              },
              {
                label: "GitHub",
                href: "https://github.com/podium-lib",
              },
              {
                label: "npm",
                href: "https://www.npmjs.com/org/podium",
              },
              {
                label: "Micro Frontends",
                href: "https://micro-frontends.org/",
              },
            ],
          },
        ],
        copyright: `<img src="${baseUrl}img/finn_no_logo.png" alt="FINN.no" width="129" height="45" /><br /> Copyright © ${new Date().getFullYear()} Finn.no`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
