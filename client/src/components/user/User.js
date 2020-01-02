import React from 'react';
import { Menu, Layout } from 'antd';
// import { Link, Route } from "react-router-dom";
import { Link } from "react-router-dom";

// import Add from "../trainings/Add";
// import Account from "../trainer/Account"

const { Content, Header, Footer } = Layout;

function handleClick(e) {
  console.log('click', e);
}

function User() {
  return (
    <Layout style={{ height: '100%' }}>
      <Header>
        <Menu
          onClick={handleClick}
          mode="horizontal"
          theme="dark"
        >
          <Menu.Item key="1"><Link to="/admin/account">Мой профиль</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/admin/trainings/list">Мои тренировки</Link></Menu.Item>
          <Menu.Item key="3"><Link to="/admin/trainings/add">Добавить тренировку</Link></Menu.Item>
        </Menu>
      </Header>
      <Content />
      <Footer />
    </Layout>
  );
}

export default User;