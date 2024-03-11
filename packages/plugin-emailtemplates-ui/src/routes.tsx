import { Route, Routes, useLocation } from "react-router-dom";

import React from "react";
import asyncComponent from "@erxes/ui/src/components/AsyncComponent";
import queryString from "query-string";

const List = asyncComponent(
  () =>
    import(
      /* webpackChunkName: "Settings - List EmailTemplate" */ "./containers/List"
    )
);

const EmailTemplates = () => {
  const location = useLocation();

  return <List queryParams={queryString.parse(location.search)} />;
};

const routes = () => (
  <Routes>
    <Route path="/settings/email-templates/" element={<EmailTemplates />} />
  </Routes>
);

export default routes;
