import * as React from "react";
import Callout from "../components/Callout";
import { AppConsumer } from "./AppContext";

const container = () => (
  <AppConsumer>
    {({ showForm, setHeight, getFormConfigs }) => {
      const leadData = getFormConfigs();
      console.log(leadData);
      const { callout, themeColor } = leadData;

      console.log(themeColor)
      return (
        <Callout
          onSubmit={showForm}
          setHeight={setHeight}
          configs={callout || {}}
          color={themeColor || ""}
          hasTopBar={true}
        />
      );
    }}
  </AppConsumer>
);

export default container;
