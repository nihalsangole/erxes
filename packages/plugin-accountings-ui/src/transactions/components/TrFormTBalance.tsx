import { Table, __ } from '@erxes/ui/src';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IQueryParams } from '@erxes/ui/src/types';
import React from 'react';
import { ITransaction } from '../types';
import { TR_SIDES } from '../../constants';
import { IAccount } from '../../settings/accounts/types';

type Props = {
  balance: { dt: number, ct: number }
  transactions: ITransaction[];
  queryParams: IQueryParams;
};

const TrFormTBalance = (props: Props) => {
  const { transactions, balance } = props;

  const ptrIdByTr: { [ptrId: string]: ITransaction[] } = {}
  for (const tr of transactions) {
    if (!Object.keys(ptrIdByTr).includes(tr.ptrId || '')) {
      ptrIdByTr[tr.ptrId || ''] = [];
    }

    ptrIdByTr[tr.ptrId || ''].push(tr)
  }

  const renderTrRow = (tr) => {
    const account = tr.details[0].account;
    return (
      <tr>
        <td>
          {account?.code} - {account?.name}
        </td>
        <td>
          {tr.number}
        </td>
        <td>
          {tr.description}
        </td>
        <td>
          {(tr.details[0].side === TR_SIDES.DEBIT && tr.details[0].amount || 0).toLocaleString()}
        </td>
        <td>
          {(tr.details[0].side === TR_SIDES.CREDIT && tr.details[0].amount || 0).toLocaleString()}
        </td>
        <td>

        </td>
      </tr>
    )
  }

  return (
    <Table>
      <thead>
        <tr>
          <td>Данс</td>
          <td>Баримт №</td>
          <td>Утга</td>
          <td>Дебет</td>
          <td>Кредит</td>
          <td>Actions</td>
        </tr>
      </thead>
      {Object.keys(ptrIdByTr).map((ptrId) => {
        const perTrs = ptrIdByTr[ptrId];

        return (perTrs.map(tr => renderTrRow(tr)));
      })}
      <tr>
        <td>Нийт</td>
        <td></td>
        <td></td>
        <td>{balance.dt.toLocaleString()}</td>
        <td>{balance.ct.toLocaleString()}</td>
        <td></td>
      </tr>
    </Table>
  );
};

export default TrFormTBalance;
