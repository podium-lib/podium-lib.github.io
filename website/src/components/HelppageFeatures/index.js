import React from 'react';
import clsx from 'clsx';
import Link from "@docusaurus/Link";
import styles from './styles.module.css';

const featureList = [
    {
      description: <>Learn more using the <Link to="docs/podium/conceptual_overview">documentation on this site</Link>.</>,
      title: 'Documentation',
    },
    {
      description: <>For the latest news, tips and tricks, <Link to="blog">read our blog</Link>.</>,
      title: 'Blog',
    },
    {
      description:
      <>Podium is made up of multiple modules. For easy bug tracking we maintain a single issue tracker. <Link href="https://github.com/podium-lib/issues">File an issue</Link>.</>,
      title: 'Issues',
    },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HelppageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {featureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
