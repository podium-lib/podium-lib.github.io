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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/podium-lib/podium-lib.github.io/tree/main/website/docs",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/podium-lib/podium-lib.github.io/tree/main/website/blog",
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
            to: "/docs/podium/conceptual_overview",
            label: "Docs",
            position: "left",
          },
          { to: "/blog", label: "Blog", position: "left" },
					{ to: "/help", label: "Help", position: "left" },
          {
            href: "https://github.com/podium-lib",
            label: "GitHub",
            position: "right",
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
                label: "Getting Started",
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
        copyright: `Copyright © ${new Date().getFullYear()} Finn.no. Built with Docusaurus.`,
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
    ],
  },
};

export default config;
