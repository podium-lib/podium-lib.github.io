// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Podium.io",
  tagline: "Easy server side composition of microfrontends",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://podium-lib.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "podium-lib", // Usually your GitHub org/user name.
  projectName: "podium-lib.github.io", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  plugins: [
    require.resolve("docusaurus-lunr-search"),
    [
      // Add redirects when moving pages around
      // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-client-redirects#configuration
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/docs/podium/conceptual_overview",
            to: "/docs/",
          },
          {
            from: "/docs/api/getting_started",
            to: "/docs/introduction/hello-podium",
          },
          {
            from: "/docs/podlet/getting_started",
            to: "/docs/introduction/hello-podium",
          },
          {
            from: "/docs/layout/getting_started",
            to: "/docs/introduction/hello-podium",
          },
          {
            from: "/docs/layout/assets",
            to: "/docs/guides/assets",
          },
          {
            from: "/docs/introduction/assets",
            to: "/docs/guides/assets",
          },
          {
            from: "/docs/layout/context",
            to: "/docs/guides/context",
          },
          {
            from: "/docs/introduction/context",
            to: "/docs/guides/context",
          },
          {
            from: "/docs/podlet/context",
            to: "/docs/guides/context",
          },
          {
            from: "/docs/podlet/fallbacks",
            to: "/docs/guides/fallbacks",
          },
          {
            from: "/docs/podlet/proxying",
            to: "/docs/guides/proxying",
          },
          {
            from: "/docs/layout/handling_redirects",
            to: "/docs/guides/redirects",
          },
          {
            from: "/docs/layout/unavailable_podlets",
            to: "/docs/guides/fallbacks#throwable-podlets",
          },
          {
            from: "/docs/layout/dynamic_routes",
            to: "/docs/guides/passing-values-to-podlets",
          },
          {
            from: "/docs/layout/local_development",
            to: "/docs/guides/layout-development",
          },
          {
            from: "/docs/podlet/local_development",
            to: "/docs/guides/podlet-development",
          },
        ],
      },
    ],
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          sidebarPath: "./sidebars.js",
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/podium-lib/podium-lib.github.io/tree/main/website/docs",
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: "Podium",
        logo: {
          alt: "Podium.io Logo",
          src: "img/podium.png",
        },
        items: [
          {
            to: "/docs/",
            label: "Docs",
            position: "left",
          },
          { to: "/blog", label: "Blog", position: "left" },
        ],
      },
      footer: {
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Introduction",
                to: "/docs/",
              },
              {
                label: "Hello, Podium",
                to: "/docs/introduction/hello-podium",
              },
              {
                label: "API Reference",
                to: "/docs/api/layout",
              },
            ],
          },
          {
            title: "Links",
            items: [
              {
                label: "Report an issue",
                href: "https://github.com/podium-lib/issues",
              },
              {
                label: "Podium on GitHub",
                href: "https://github.com/podium-lib",
              },
              {
                label: "Podium on npm",
                href: "https://www.npmjs.com/org/podium",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} FINN.no`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  customFields: {
    users: [
      {
        caption: "FINN.no",
        // You will need to prepend the image path with your baseUrl
        // if it is not '/', like: '/test-site/img/image.jpg'.
        image: "/img/finn_no_logo.png",
        infoLink: "https://www.finn.no/",
        pinned: true,
      },
      {
        caption: "Descomplica",
        // You will need to prepend the image path with your baseUrl
        // if it is not '/', like: '/test-site/img/image.jpg'.
        image: "/img/descomplica_logo.svg",
        infoLink: "https://descomplica.com.br/",
        pinned: true,
      },
      {
        caption: "Madgex",
        image: "/img/madgex_logo.png",
        infoLink: "https://madgex.com/",
        pinned: true,
      },
    ],
  },
};

export default config;
