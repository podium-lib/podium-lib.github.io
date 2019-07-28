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

const path =  require('path');
const fs = require('fs');

const podletFile = path.resolve(__dirname, '../../../../../pages/en/front.podlet.html');
const podletExample = fs.readFileSync(podletFile, 'utf8');

const layoutFile = path.resolve(__dirname, '../../../../../pages/en/front.layout.html');
const layoutExample = fs.readFileSync(layoutFile, 'utf8');


class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
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
            <Button href={docUrl('podium/conceptual_overview')}>Get Started</Button>
            <Button href="https://github.com/podium-lib/">GitHub</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
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
        background={props.background}>
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
            content: 'By adopting a simple manifest, teams can develop and serve parts of a web page in isolation as if one where developing and hosting a full site. These isolated parts, aka Podlets, can easily be developed in any technology stack or one can opt in to using the node.js Podium library with your favorite http framework of choice.',
            // image: `${baseUrl}img/undraw_operating_system.svg`,
            // imageAlign: 'top',
          },
          {
            title: 'Powerful composition',
            content: 'Podium makes it easy, yet flexible, to compose parts developed in isolation into full complex pages, aka Layouts. Page compostion is done programmatically instead of through config or markup providing much more power and freedom to make compostion suit every need one might have.',
            // image: `${baseUrl}img/undraw_operating_system.svg`,
            // imageAlign: 'top',
          },
          {
            title: 'Contract based',
            content: 'Composition with Podium is done over HTTP but between the isolated parts and the composition layer there is a strong contract. This ensures that the isolated parts always has a set of key, request bound, properties which can be of value to them to operate while the composition layer has usefull info about each isolated part it can use when composing.',
            // image: `${baseUrl}img/undraw_operating_system.svg`,
            // imageAlign: 'top',
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
