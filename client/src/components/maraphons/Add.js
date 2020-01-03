import React from 'react';
import { Layout, PageHeader } from 'antd';

import Admin from '../admin/Admin';
import AddMaraphonForm from './AddMaraphonForm';

const { Content } = Layout;

function Add(props) {
  const routes = [{
    path: 'first',
    breadcrumbName: 'Список марафонов',
  },];
  return (
    <Admin history={props.history}>
      <PageHeader
        breadcrumb={{ routes }}
        title="Добавление нового марафона"
      />
      <Content style={{ background: '#fff', padding: 24 }}>
        <AddMaraphonForm />
      </Content>
    </Admin>
  );
}

export default Add;