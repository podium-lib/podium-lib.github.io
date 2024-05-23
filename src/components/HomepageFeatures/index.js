import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Autonomous development',
    Svg: require('@site/static/img/isolation_min.svg').default,
    description: (
      <>
        By adopting a simple manifest, teams can develop and serve parts of a web page in isolation as if one where developing and hosting a full site. These isolated parts, aka Podlets, can easily be developed in any technology stack or one can opt in to using the node.js Podium library with your favorite HTTP framework of choice.
      </>
    ),
  },
  {
    title: 'Powerful composition',
    Svg: require('@site/static/img/composed_min.svg').default,
    description: (
      <>
        Podium makes it easy, yet flexible, to compose parts developed in isolation into full complex pages, aka Layouts. Page compostion is done programmatically instead of through config or markup providing much more power and freedom to make compostion suit every need one might have.
      </>
    ),
  },
  {
    title: 'Contract based',
    Svg: require('@site/static/img/contract_min.svg').default,
    description: (
      <>
        Composition with Podium is done over HTTP but between the isolated parts and the composition layer there is a strong contract. This ensures that the isolated parts always has a set of key, request bound, properties which can be of value to them to operate while the composition layer has usefull info about each isolated part it can use when composing.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
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
