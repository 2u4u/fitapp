import React from 'react';
import { useSelector } from "react-redux";
import { Breadcrumb, Descriptions, Layout, Card } from 'antd';
const { Content } = Layout;

function Account(props) {
  const name = useSelector(state => state.auth.user.name);
  const email = useSelector(state => state.auth.user.email);

  return (
    <React.Fragment>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>Главная</Breadcrumb.Item>
        <Breadcrumb.Item>Мой профиль</Breadcrumb.Item>
      </Breadcrumb>
      <Content style={{ background: '#fff' }}>
        <Card title="Общая информация">
          <Descriptions>
            <Descriptions.Item label="Имя">{name}</Descriptions.Item>
            <Descriptions.Item label="Email">{email}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Content>
    </React.Fragment>
  );
}

export default Account;