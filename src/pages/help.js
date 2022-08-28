/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HelppageFeatures from "../components/HelppageFeatures";

import styles from "./index.module.css";

function Help() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Help - ${siteConfig.title}`}
      description="Help page for the Podium.io docs"
    >
      <main className="container">
        <div className={styles.mt20}>
          <h1>Need help?</h1>
          <p>
            Please first seek guidance by visiting our docs or blog. If you
            encounter bugs or find that something is unclear please file an
            issue in our issue tracker.
          </p>
          <HelppageFeatures />
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
      </main>
    </Layout>
  );
}

export default Help;
