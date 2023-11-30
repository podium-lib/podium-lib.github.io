import React from "react";
import Link from "@docusaurus/Link";
import Layout from '@theme/Layout';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Users() {
  const { siteConfig } = useDocusaurusContext();
  if ((siteConfig.customFields.users || []).length === 0) {
    return null;
  }

  const editUrl = `https://github.com/${siteConfig.organizationName}/${siteConfig.projectName}/edit/source/website/siteConfig.js`;
  const showcase = siteConfig.customFields.users.map((user) => (
    <Link to={user.infoLink} key={user.infoLink}>
      <img src={user.image} alt={user.caption} title={user.caption} />
    </Link>
  ));

  return (
		<Layout title="Users" description="Podium Users">
      <div className="container margin-top--lg">
        <div className="showcaseSection">
          <div className="prose">
            <h1>Podium is in use at:</h1>
          </div>
          <div className="logos">{showcase}</div>
          <h3 className="margin-top--lg">Are you using this project?</h3>
          <Link to={editUrl} className="button button--secondary button--lg">
            Add your company
          </Link>
        </div>
      </div>
		</Layout>
  );
}
