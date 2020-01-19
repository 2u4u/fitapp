import React from 'react';
import { Layout, PageHeader } from 'antd';

import Admin from '../admin/Admin';
import AddMarathonForm from './AddMarathonForm';

const { Content } = Layout;

function Add(props) {
  const routes = [{
    path: 'first',
    breadcrumbName: 'Список марафонов',
  },];
  return (
    <Admin history={props.history} page="add">
      <PageHeader
        breadcrumb={{ routes }}
        title="Добавление нового марафона"
      />
      <Content style={{ background: '#fff', padding: 24 }}>
        <AddMarathonForm />
      </Content>
    </Admin>
  );
}

export default Add;