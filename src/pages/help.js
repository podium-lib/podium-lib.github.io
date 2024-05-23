import React from 'react';
import Link from "@docusaurus/Link";
import Layout from '@theme/Layout';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Help(props) {
	const { siteConfig } = useDocusaurusContext();
  const { baseUrl, docsUrl } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${doc}`;

  return (
    <Layout title={`Help`} description="Help page">
      <div className="container">
        <div>
          <h1 className="margin-top--lg">Need help?</h1>
          <p>
            Please first seek guidance by visiting our docs or blog. If you
            encounter bugs or find that something is unclear please file an
            issue in our issue tracker.
          </p>

					<div className='row'>
						<div className='col col--4'>
							<h2>Documentation</h2>
							<p>Learn more using the <Link to='/docs/podium/conceptual_overview'>documentation on this site</Link>
							</p>
						</div>
						<div className='col col--4'>
						<h2>Blog</h2>
							<p>For the latest news, tips and tricks, <Link to={siteConfig.baseUrl + siteConfig.baseUrl.endsWith('/') ? 'blog' : '/blog'}>read our blog</Link>
							</p>
						</div>
						<div className='col col--4'>
						<h2>Issues</h2>
							<p>Podium is made up of multiple modules. For easy bug tracking we maintain a single issue tracker. <Link to='https://github.com/podium-lib/issues'>File an issue</Link>
							</p>
						</div>

					</div>

          <h2>License</h2>
          <p>Podium is licensed under the following MIT license:</p>
          <p>Copyright (c) 2019 FINN.no</p>
          <p>
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the "Software"), to deal in the Software without restriction,
            including without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the Software,
            and to permit persons to whom the Software is furnished to do so,
            subject to the following conditions:
          </p>
          <p>
            The above copyright notice and this permission notice shall be
            included in all copies or substantial portions of the Software.
          </p>
          <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
        </div>
      </div>
    </Layout>
  );
}
