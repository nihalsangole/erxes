import { MainStyleTitle as Title } from '@erxes/ui/src/styles/eindex';
import { __ } from '@erxes/ui/src/utils';
import { Button } from '@erxes/ui/src/components';
import { Wrapper } from '@erxes/ui/src/layout';
import React, { useState } from 'react';

import { ContentBox } from '../styles';
import { IConfigsMap } from '../types';
import Header from './Header';
import PerRemSettings from './RemPerSettings';
import Sidebar from './Sidebar';

type Props = {
  save: (configsMap: IConfigsMap) => void;
  configsMap: IConfigsMap;
};

const GeneralSettings = (props: Props) => {
  const [configsMap, setConfigsMap] = useState<IConfigsMap>(props.configsMap);

  const add = (e) => {
    e.preventDefault();

    if (!configsMap.remainderConfig) {
      configsMap.remainderConfig = {};
    }

    // must save prev item saved then new item
    const newPipelineConfig = {
      title: 'New Pipeline Remainder Config',
      boardId: '',
      pipelineId: '',
      account: '',
      location: '',
    };

    setConfigsMap((prevConfigsMap) => ({
      ...prevConfigsMap,
      remainderConfig: {
        ...prevConfigsMap.remainderConfig,
        newPipelineConfig,
      },
    }));
  };

  const deleteHandler = (currentConfigKey: string) => {
    delete configsMap.remainderConfig[currentConfigKey];
    delete configsMap.remainderConfig['newPipelineConfig'];

    setConfigsMap(configsMap);

    props.save(configsMap);
  };

  const renderConfigs = (configs) => {
    return Object.keys(configs).map((key) => {
      return (
        <PerRemSettings
          configsMap={configsMap}
          config={configs[key]}
          currentConfigKey={key}
          save={props.save}
          delete={deleteHandler}
        />
      );
    });
  };

  const renderContent = () => {
    const configs = configsMap.remainderConfig || {};

    return (
      <ContentBox id={'GeneralSettingsMenu'}>
        {renderConfigs(configs)}
      </ContentBox>
    );
  };

  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Remainder config') },
  ];

  const actionButtons = (
    <Button btnStyle="primary" onClick={add} icon="plus" uppercase={false}>
      New config
    </Button>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Remainder config')}
          breadcrumb={breadcrumb}
        />
      }
      mainHead={<Header />}
      actionBar={
        <Wrapper.ActionBar
          left={<Title>{__('Remainder configs')}</Title>}
          right={actionButtons}
        />
      }
      leftSidebar={<Sidebar />}
      content={renderContent()}
      hasBorder={true}
      transparent={true}
    />
  );
};

export default GeneralSettings;
