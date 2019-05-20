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

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: `Learn more using the [documentation on this site](${docUrl(
        'podium/conceptual_overview',
      )}).`,
      title: 'Documentation',
    },
    {
      content: `For the latest news and tips and tricks, [read our blog](${props.config.baseUrl}blog).`,
      title: 'Blog',
    },
    {
      content: 'Podium is built up of multiple modules. For easy bug trackin we maintain one issue tracker. [File an issue](https://github.com/podium-lib/issues).',
      title: 'Issues',
    },
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <h1>Need help?</h1>
          <p>Please seek guidence in our documentation or blog. If you encunter any bugs or something is unclear please file an issue in our issue tracker.</p>

          <GridBlock contents={supportLinks} layout="threeColumn" />

          <h2>License</h2>
          <p>Podium is licensed under the following MIT license:</p>
          <p>
            Copyright (c) 2019 FINN.no
          </p>
          <p>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>
          <p>
            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.
          </p>
          <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
