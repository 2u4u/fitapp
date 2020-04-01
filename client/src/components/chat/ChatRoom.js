import React from 'react';
import { Breadcrumb, Layout } from 'antd';
import Chat from './Chat';

const { Content } = Layout;

function ChatRoom() {
  return (
    <React.Fragment>
      <Breadcrumb style={{ padding: "20px 0" }}>
        <Breadcrumb.Item>Главная</Breadcrumb.Item>
        <Breadcrumb.Item>Мои сообщения</Breadcrumb.Item>
      </Breadcrumb>
      <Content style={{ background: '#fff', padding: 24 }} >
        <Chat />
      </Content>
    </React.Fragment>
  )
}
export default ChatRoom;