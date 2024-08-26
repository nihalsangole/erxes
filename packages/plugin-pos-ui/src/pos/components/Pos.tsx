import {
  Alert,
  Button,
  ButtonMutate,
  Step,
  Steps,
  Wrapper,
<<<<<<< HEAD
  __
=======
  __,
>>>>>>> 5500bd0b1cb5a46cda93260747f51eb270c15636
} from "@erxes/ui/src";
import Appearance from "./step/Appearance";
import { Content, LeftContent } from "../../styles";
import {
  ControlWrapper,
  Indicator,
<<<<<<< HEAD
  StepWrapper
=======
  StepWrapper,
>>>>>>> 5500bd0b1cb5a46cda93260747f51eb270c15636
} from "@erxes/ui/src/components/step/styles";
import { IPos, IProductGroup, ISlot } from "../../types";

import CardsConfig from "./step/CardsConfig";
import ConfigStep from "./step/ConfigStep";
import DeliveryConfig from "./step/DeliveryConfig";
import EbarimtConfig from "./step/EbarimtConfig";
import ErkhetConfig from "./step/ErkhetConfig";
import GeneralStep from "./step/GeneralStep";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import PermissionStep from "./step/Permission";
import PaymentsStep from "./step/PaymentsStep";
import { ALLOW_TYPES } from "../../constants";
import ScreensConfig from "./step/Screens";

type Props = {
  pos?: IPos;
  loading?: boolean;
  isActionLoading: boolean;
  groups: IProductGroup[];
  save: (params: any) => void;
  slots: ISlot[];
  envs: any;
};

const Pos = (props: Props) => {
  const {
    pos = {} as IPos,
    loading,
    isActionLoading,
    groups,
    save,
    slots,
    envs
  } = props;

  const [state, setState] = useState({
    pos,
    carousel: "pos",
    groups: groups || [],
    uiOptions: pos.uiOptions || {
      colors: {
        bodyColor: "#FFFFFF",
        headerColor: "#6569DF",
<<<<<<< HEAD
        footerColor: "#3CCC38"
=======
        footerColor: "#3CCC38",
>>>>>>> 5500bd0b1cb5a46cda93260747f51eb270c15636
      },
      logo: "",
      bgImage: "",
      favIcon: "",
      receiptIcon: "",
      kioskHeaderImage: "",
      mobileAppImage: "",
<<<<<<< HEAD
      qrCodeImage: ""
=======
      qrCodeImage: "",
>>>>>>> 5500bd0b1cb5a46cda93260747f51eb270c15636
    },
    isSkip: false,
    ebarimtConfig: pos.ebarimtConfig,
    erkhetConfig: pos.erkhetConfig,
    deliveryConfig: pos.deliveryConfig,
    cardsConfig: pos.cardsConfig,
    slots:
      slots.map((slot) => ({
        ...slot,
        option: JSON.parse(slot.option as any),
      })) || [],
    checkRemainder: pos.checkRemainder || false,
    allowTypes:
      pos.allowTypes ||
<<<<<<< HEAD
      ALLOW_TYPES.filter(at => at.kind === "sale").map(at => at.value)
=======
      ALLOW_TYPES.filter((at) => at.kind === "sale").map((at) => at.value),
>>>>>>> 5500bd0b1cb5a46cda93260747f51eb270c15636
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.pos.name) {
      return Alert.error("Enter POS name");
    }

    if (!state.pos.adminIds || !state.pos.adminIds.length) {
      return Alert.error("Choose admin users");
    }

    if (!state.pos.cashierIds || !state.pos.cashierIds.length) {
      return Alert.error("Choose cashier users");
    }

    const saveTypes = state.allowTypes.filter(at => at);
    if (!saveTypes.length) {
      return Alert.error("Toggle at least one type");
    }

    const cleanMappings = (state.pos.catProdMappings || []).map(m => ({
      _id: m._id,
      categoryId: m.categoryId,
      productId: m.productId,
      code: m.code || "",
<<<<<<< HEAD
      name: m.name || ""
=======
      name: m.name || "",
>>>>>>> 5500bd0b1cb5a46cda93260747f51eb270c15636
    }));

    const cleanSlot = (state.slots || []).map(m => ({
      _id: m._id,
      code: m.code,
      name: m.name,
      posId: m.posId,
<<<<<<< HEAD
      option: m.option
=======
      option: JSON.stringify(m.option),
>>>>>>> 5500bd0b1cb5a46cda93260747f51eb270c15636
    }));

    let doc: any = {
      name: state.pos.name,
      description: state.pos.description,
      pdomain: state.pos.pdomain,
      erxesAppToken: state.pos.erxesAppToken,
      productDetails: state.pos.productDetails || [],
      groups: state.groups,
      adminIds: state.pos.adminIds,
      cashierIds: state.pos.cashierIds,
      paymentIds: state.pos.paymentIds || [],
      paymentTypes: state.pos.paymentTypes || [],
      kioskMachine: state.pos.kioskMachine,
      uiOptions: state.uiOptions,
      ebarimtConfig: state.ebarimtConfig,
      erkhetConfig: state.erkhetConfig,
      catProdMappings: cleanMappings,
      posSlots: cleanSlot,
      isOnline: state.pos.isOnline,
      onServer: state.pos.onServer,
      waitingScreen: state.pos.waitingScreen,
      kitchenScreen: state.pos.kitchenScreen,
      branchId: state.pos.branchId,
      departmentId: state.pos.departmentId,
      allowBranchIds: state.pos.allowBranchIds,
      beginNumber: state.pos.beginNumber,
      maxSkipNumber: Number(state.pos.maxSkipNumber) || 0,
      orderPassword: state.pos.orderPassword,
      scopeBrandIds: state.pos.scopeBrandIds || [],
      initialCategoryIds: state.pos.initialCategoryIds || [],
      kioskExcludeCategoryIds: state.pos.kioskExcludeCategoryIds || [],
      kioskExcludeProductIds: state.pos.kioskExcludeProductIds || [],
      deliveryConfig: state.deliveryConfig,
      cardsConfig: state.cardsConfig,
      checkRemainder: state.checkRemainder,
      permissionConfig: state.pos.permissionConfig || {},
      allowTypes: saveTypes,
      isCheckRemainder: state.pos.isCheckRemainder,
      checkExcludeCategoryIds: state.pos.checkExcludeCategoryIds || [],
      banFractions: state.pos.banFractions
    };

    if (!pos.isOnline) {
      doc = {
        ...doc,
        beginNumber: "",
<<<<<<< HEAD
        allowBranchIds: []
=======
        allowBranchIds: [],
>>>>>>> 5500bd0b1cb5a46cda93260747f51eb270c15636
      };
    }

    save(doc);
  };

  const onChange = (key: string, value: any) => {
    setState(prevState => ({ ...prevState, [key]: value }));
  };

<<<<<<< HEAD
  const onStepClick = currentStepNumber => {
=======
  const onStepClick = (currentStepNumber) => {
>>>>>>> 5500bd0b1cb5a46cda93260747f51eb270c15636
    let carousel = "form";
    switch (currentStepNumber) {
      case 1:
        carousel = state.isSkip ? "form" : "callout";
        break;
      case 2:
        carousel = state.isSkip ? "form" : "callout";
        break;
      case 7:
        carousel = "success";
        break;
      default:
        break;
    }

    return setState(prevState => ({ ...prevState, carousel }));
  };

  const renderButtons = () => {
    const SmallLoader = ButtonMutate.SmallLoader;

    const cancelButton = (
      <Link to={`/pos`}>
        <Button btnStyle="simple" icon="times-circle">
          Cancel
        </Button>
      </Link>
    );

    return (
      <Button.Group>
        {cancelButton}

        <Button
          disabled={isActionLoading}
          btnStyle="success"
          icon={isActionLoading ? undefined : "check-circle"}
          onClick={handleSubmit}
        >
          {isActionLoading && <SmallLoader />}
          Save
        </Button>
      </Button.Group>
    );
  };

  const breadcrumb = [{ title: "POS List", link: `/pos` }, { title: "POS" }];

  return (
    <StepWrapper>
      <Wrapper.Header title={__("Pos")} breadcrumb={breadcrumb} />
      <Content>
        <LeftContent>
          <Steps maxStep={9}>
            <Step
              img="/images/icons/erxes-12.svg"
              title={`General`}
              onClick={onStepClick}
            >
              <GeneralStep
                onChange={onChange}
                pos={state.pos}
                posSlots={state.slots}
                allowTypes={state.allowTypes}
                envs={envs}
              />
            </Step>
            <Step
              img="/images/icons/erxes-12.svg"
              title={`Payments`}
              onClick={onStepClick}
            >
              <PaymentsStep
                onChange={onChange}
                pos={state.pos}
                posSlots={state.slots}
                envs={envs}
              />
            </Step>
            <Step
              img="/images/icons/erxes-02.svg"
              title={`Permission`}
              onClick={onStepClick}
            >
              <PermissionStep onChange={onChange} pos={state.pos} envs={envs} />
            </Step>
            <Step
              img="/images/icons/erxes-10.svg"
              title={`Product & Service`}
              onClick={onStepClick}
            >
              <ConfigStep
                onChange={onChange}
                pos={state.pos}
                groups={state.groups}
                catProdMappings={state.pos.catProdMappings || []}
              />
            </Step>
            <Step
              img="/images/icons/erxes-04.svg"
              title={"Appearance"}
              onClick={onStepClick}
            >
              <Appearance
                onChange={onChange}
                uiOptions={state.uiOptions}
                logoPreviewUrl={state.uiOptions.logo}
              />
            </Step>
            <Step
              img="/images/icons/erxes-14.svg"
              title={"Screens Config"}
              onClick={onStepClick}
            >
              <ScreensConfig
                onChange={onChange}
                pos={state.pos}
                checkRemainder={state.checkRemainder}
              />
            </Step>
            <Step
              img="/images/icons/erxes-05.svg"
              title={"ebarimt Config"}
              onClick={onStepClick}
            >
              <EbarimtConfig onChange={onChange} pos={pos} />
            </Step>
            <Step
              img="/images/icons/erxes-07.svg"
              title={"finance Config"}
              onClick={onStepClick}
            >
              <ErkhetConfig
                onChange={onChange}
                pos={state.pos}
                checkRemainder={state.checkRemainder}
              />
            </Step>
            <Step
              img="/images/icons/erxes-09.svg"
              title={"Delivery Config"}
              onClick={onStepClick}
            >
              <DeliveryConfig onChange={onChange} pos={state.pos} />
            </Step>
            <Step
              img="/images/icons/erxes-07.svg"
              title={"Sync Cards"}
              onClick={onStepClick}
              noButton={true}
            >
              <CardsConfig onChange={onChange} pos={state.pos} />
            </Step>
          </Steps>
          <ControlWrapper>
            <Indicator>
              {__("You are")} {state.pos ? "editing" : "creating"}{" "}
              <strong>{state.pos.name || ""}</strong> {__("pos")}
            </Indicator>
            {renderButtons()}
          </ControlWrapper>
        </LeftContent>
      </Content>
    </StepWrapper>
  );
};

export default Pos;
