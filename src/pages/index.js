import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Heading from "@theme/Heading";
import styles from "./index.module.css";
import CodeBlock from "@theme/CodeBlock";
import PodletExample from "../../docs/partials/_layout_example.mdx";
import LayoutExample from "../../docs/partials/_layout_example.mdx";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <img src="/img/podium.png" alt="Podium logo" />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
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
            to="https://github.com/podium-lib"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function PodiumExamples() {
  return (
    <section className="container">
      <div className="row">
        <div className="col col--6">
          <PodletExample />
        </div>
        <div className="col col--6">
          <LayoutExample />
        </div>
      </div>
    </section>
  );
}

const Showcase = () => {
  const { siteConfig } = useDocusaurusContext();

  if ((siteConfig.customFields.users || []).length === 0) {
    return null;
  }

  const showcase = siteConfig.customFields.users
    .filter((user) => user.pinned)
    .map((user) => (
      <Link to={user.infoLink} key={user.infoLink} className="margin--md">
        <img src={user.image} alt={user.caption} title={user.caption} />
      </Link>
    ));

  const pageUrl = (page) => baseUrl + (language ? `${language}/` : "") + page;

  return (
    <section className="container margin-top--xl margin-bottom--xl">
      <div className={styles.whoDis}>
        <h2>Who is Using This?</h2>
        <p>This project is used by all these people</p>
        <div className="logos">{showcase}</div>
        <div className="more-users">
          <Link className="button button--secondary button--lg" to="/users">
            More {siteConfig.title} Users
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="Podium.io documentation home page"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <PodiumExamples />
        <Showcase />
      </main>
    </Layout>
  );
}
