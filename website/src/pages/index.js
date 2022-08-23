import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import PodletExample from "@site/src/components/PodletExample";
import LayoutExample from "@site/src/components/LayoutExample";

import styles from "./index.module.css";

const Logo = ({ src }) => (
  <div className="podium-front-head-logo">
    <img src={src} alt="Podium Logo" />
  </div>
);

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={clsx(
        "podium-front-head",
        "hero hero--primary",
        styles.heroBanner
      )}
    >
      <div className="container">
        <Logo src={`${siteConfig.baseUrl}img/podium.png`} />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/podium/conceptual_overview"
          >
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/podium-lib/"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Home - ${siteConfig.title}`}
      description="Landing page for the Podium.io docs"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.examples}>
          <div>
            <PodletExample />
          </div>
          <div>
            <LayoutExample />
          </div>
        </section>
      </main>
    </Layout>
  );
}
