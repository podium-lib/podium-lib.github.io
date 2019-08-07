/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const path = require('path');
const fs = require('fs');

const podletFile = path.resolve(
  __dirname,
  '../../../../../pages/en/front.podlet.html'
);
const podletExample = fs.readFileSync(podletFile, 'utf8');

const layoutFile = path.resolve(
  __dirname,
  '../../../../../pages/en/front.layout.html'
);
const layoutExample = fs.readFileSync(layoutFile, 'utf8');

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer podium-front-head">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="podium-front-head-logo">
        <img src={props.img_src} alt="Podium" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle podium-front-head-text">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper podium-front-button-wrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/podium.png`} />
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('podium/conceptual_overview')}>
              Get Started
            </Button>
            <Button href="https://github.com/podium-lib/">GitHub</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const CodeBlock = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        className={props.className}
        background={props.background}
      >
        <GridBlock
          align="left"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            title: 'Autonomous development',
            content:
              'By implementing simple HTTP based conventions, teams can develop and serve parts of a web page in isolation as if they were developing and hosting full sites. As such, these isolated parts (called podlets) can be developed in any technology stack. Our team maintains a set of Podium libaries writen in Node.js which you can combine with which ever Node.js HTTP framework you prefer.',
            image: `${baseUrl}img/isolation_min.svg`,
            imageAlign: 'top',
          },
          {
            title: 'Powerful composition',
            content:
              'Podium makes it easy, yet flexible, to compose isolated page fragments into complete web pages (called layouts). This page compostion is done programmatically (rather than through config or markup) which provides for more power and freedom for the developer.',
            image: `${baseUrl}img/composed_min.svg`,
            imageAlign: 'top',
          },
          {
            title: 'Contract based',
            content:
              'Page composition between isolated page fragments (podlets) and the composition layer (layout) is done over HTTP. A contract between components ensures that fragments get contextual information passed down from the composition layer and the composition layer gets meta information passed up from the fragments it composes together.',
            image: `${baseUrl}img/contract_min.svg`,
            imageAlign: 'top',
          },
        ]}
      </Block>
    );

    const Example = () => (
      <CodeBlock className="podium-front-examples">
        {[
          {
            title: 'Podlets',
            content: podletExample,
          },
          {
            title: 'Layouts',
            content: layoutExample,
          },
        ]}
      </CodeBlock>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <Example />
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;
