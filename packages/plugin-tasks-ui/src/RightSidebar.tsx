import { IUser } from '@erxes/ui/src/auth/types';
import React from 'react';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';

type Props = {
  user: IUser;
};

const PortableDeals = asyncComponent(
  () =>
    import(
      /* webpackChunkName: "PortableDeals" */ '@erxes/ui-deals/src/deals/components/PortableDeals'
    )
);

const PortableTasks = asyncComponent(
  () =>
    import(
      /* webpackChunkName: "PortableTasks" */ '@erxes/ui-tasks/src/tasks/components/PortableTasks'
    )
);

const PortableTickets = asyncComponent(
  () =>
    import(
      /* webpackChunkName: "PortableTickets" */ '@erxes/ui-tickets/src/tickets/components/PortableTickets'
    )
);

export default class RightSidebar extends React.Component<Props> {
  render() {
    const { user } = this.props;

    return (
      <Sidebar>
        <PortableDeals mainType="user" mainTypeId={user._id} />
        <PortableTasks mainType="user" mainTypeId={user._id} />
        <PortableTickets mainType="user" mainTypeId={user._id} />
      </Sidebar>
    );
  }
}
