/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('podium/conceptual_overview', this.props.language)}>
              Conceptual overview
            </a>
            <a href={this.docUrl('podlet/getting_started', this.props.language)}>
              Podlets
            </a>
            <a href={this.docUrl('layout/getting_started', this.props.language)}>
              Layouts
            </a>
          </div>
          <div>
            <h5>API</h5>
            <a href={this.pageUrl('api/podlet', this.props.language)}>
              Podlets
            </a>
            <a href={this.pageUrl('api/layout', this.props.language)}>
              Layouts
            </a>
          </div>
          <div>
            <h5>Links</h5>
            <a href={`${this.props.config.baseUrl}blog`}>Blog</a>
            <a href="https://github.com/podium-lib/issues">Issues</a>
            <a href="https://github.com/podium-lib">GitHub</a>
            <a href="https://www.npmjs.com/org/podium">npm</a>
            <a href="https://micro-frontends.org/">Micro Frontends</a>
          </div>
        </section>

        <a
          href="https://finn.no/"
          target="_blank"
          rel="noreferrer noopener"
          className="copyrightLogo">
          <img
            src={`${this.props.config.baseUrl}img/finn_no_logo.png`}
            alt="FINN.no"
            width="129"
            height="45"
          />
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
