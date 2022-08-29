import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  // {
  //   title: 'Easy to Use',
  //   Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
  //   description: (
  //     <>
  //       Docusaurus was designed from the ground up to be easily installed and
  //       used to get your website up and running quickly.
  //     </>
  //   ),
  // },
  // {
  //   title: 'Focus on What Matters',
  //   Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
  //   description: (
  //     <>
  //       Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
  //       ahead and move your docs into the <code>docs</code> directory.
  //     </>
  //   ),
  // },
  // {
  //   title: 'Powered by React',
  //   Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
  //   description: (
  //     <>
  //       Extend or customize your website layout by reusing React. Docusaurus can
  //       be extended while reusing the same header and footer.
  //     </>
  //   ),
  // },

  {
    title: 'Autonomous development',
    description: (
      <>
        By adopting a simple manifest, teams can develop and serve parts of a web page in isolation as if one where developing and hosting a full site. These isolated parts, aka Podlets, can easily be developed in any technology stack or one can opt in to using the node.js Podium library with your favorite HTTP framework of choice.
      </>
    ),
    // image: `${baseUrl}img/isolation_min.svg`,
    Svg: require('@site/static/img/isolation_min.svg').default,
    // imageAlign: 'top',
  },
  {
    title: 'Powerful composition',
    description: (
      <>
        Podium makes it easy, yet flexible, to compose parts developed in isolation into full complex pages, aka Layouts. Page compostion is done programmatically instead of through config or markup providing much more power and freedom to make compostion suit every need one might have.
      </>
    ),
    // image: `${baseUrl}img/composed_min.svg`,
    Svg: require('@site/static/img/composed_min.svg').default,
    // imageAlign: 'top',
  },
  {
    title: 'Contract based',
    description: (
      <>
        Composition with Podium is done over HTTP but between the isolated parts and the composition layer there is a strong contract. This ensures that the isolated parts always has a set of key, request bound, properties which can be of value to them to operate while the composition layer has usefull info about each isolated part it can use when composing.
      </>
    ),
    // image: `${baseUrl}img/contract_min.svg`,
    Svg: require('@site/static/img/contract_min.svg').default,
    // imageAlign: 'top',
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
