import React from 'react';
import { PageHeader } from 'antd';
import { Table, Layout } from 'antd';
import Admin from '../admin/Admin';
const { Content } = Layout;

const routes = [
  // {
  //   path: 'index',
  //   breadcrumbName: 'First-level Menu',
  // },
  {
    path: 'first',
    breadcrumbName: 'Список марафонов',
  },
  {
    path: 'second',
    breadcrumbName: 'Марафон 1',
  },
];

function News(props) {
  const columns = [
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Задание', dataIndex: 'age', key: 'age' },
    { title: 'Дополнительная информация', dataIndex: 'address', key: 'address' },
    // {
    //   title: 'Действия',
    //   dataIndex: '',
    //   key: 'x',
    //   render: () => <a>Ответить</a>,
    // },
  ];

  const data = [
    {
      key: 1,
      name: 'Марта Желтова',
      age: 32,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    },
    {
      key: 2,
      name: 'Марта Усманова',
      age: 42,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    },
    {
      key: 3,
      name: 'Марта Обезянковна',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
    },
  ];

  return (
    <Admin history={props.history}>
      <PageHeader
        breadcrumb={{ routes }}
        title="Новости марафона"
      />
      <Content
        style={{
          background: '#fff',
          padding: 24
        }}
      >
        <Table
          columns={columns}
          expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
          dataSource={data}
        />
      </Content>
    </Admin>
  );
}

export default News;