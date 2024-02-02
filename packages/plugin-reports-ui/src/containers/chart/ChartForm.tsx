import React from 'react';
import { gql } from '@apollo/client';

import ChartForm from '../../components/chart/ChartForm';
import { mutations, queries } from '../../graphql';
import {
  IChart,
  ReportChartFormMutationResponse,
  ReportChartTemplatesListQueryResponse,
  reportServicesListQueryResponse,
} from '../../types';
import { Alert, router } from '@erxes/ui/src/utils';
import { Spinner } from '@erxes/ui/src/components';
import { useQuery, useMutation } from '@apollo/client';

type Props = {
  history: any;
  queryParams: any;
  toggleForm: () => void;
  showChartForm: boolean;
  reportId: string;

  chart?: IChart;
};

const ChartFormList = (props: Props) => {
  const { toggleForm, queryParams, history, reportId } = props;

  const reportServicesListQuery = useQuery<reportServicesListQueryResponse>(
    gql(queries.reportServicesList),
    {
      fetchPolicy: 'network-only',
    },
  );

  const reportChartTemplatesListQuery =
    useQuery<ReportChartTemplatesListQueryResponse>(
      gql(queries.reportChartTemplatesList),
      {
        variables: { serviceName: queryParams.serviceName },
        fetchPolicy: 'network-only',
        skip: !queryParams.serviceName,
      },
    );

  const [reportChartsAddMutation] =
    useMutation<ReportChartFormMutationResponse>(
      gql(mutations.reportChartsAdd),
      {
        fetchPolicy: 'network-only',
        refetchQueries: [
          {
            query: gql(queries.reportDetail),
            variables: {
              reportId,
            },
          },
        ],
      },
    );
  const [reportChartsEditMutation] =
    useMutation<ReportChartFormMutationResponse>(
      gql(mutations.reportChartsEdit),
      {
        fetchPolicy: 'network-only',
        refetchQueries: [
          {
            query: gql(queries.reportDetail),
            variables: {
              reportId,
            },
          },
        ],
      },
    );
  const [reportChartsRemoveMutation] =
    useMutation<ReportChartFormMutationResponse>(
      gql(mutations.reportChartsRemove),
    );

  if (reportServicesListQuery.loading) {
    return <Spinner />;
  }

  const removeReportChartParams = () => {
    router.removeParams(history, 'serviceName', 'chartTemplateType');
  };

  const chartsEdit = (values, callback) => {
    console.log(values);

    reportChartsEditMutation({ variables: values });
    if (callback) {
      callback();
      removeReportChartParams();
    }
  };

  const chartsAdd = (values) => {
    reportChartsAddMutation({ variables: values })
      .then(() => {
        Alert.success('Successfully added chart');
        removeReportChartParams();
        toggleForm();
      })
      .catch((err) => Alert.error(err.message));
  };

  const chartsRemove = (_id: string) => {
    reportChartsRemoveMutation({ variables: { _id } })
      .then(() => {
        Alert.success('Successfully removed chart');
      })
      .catch((err) => Alert.error(err.message));
  };

  const finalProps = {
    ...props,
    chartsAdd,
    chartsEdit,
    chartsRemove,
    serviceNames:
      (reportServicesListQuery.data &&
        reportServicesListQuery.data.reportServicesList) ||
      [],
    chartTemplates:
      reportChartTemplatesListQuery?.data?.reportChartTemplatesList || [],
  };

  return <ChartForm {...finalProps} />;
};

export default ChartFormList;
