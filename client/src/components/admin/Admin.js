import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authAction";

import { Menu, Layout, Icon, Row } from 'antd';
const { Content, Sider, Header } = Layout;

function Admin(props) {
  const name = useSelector(state => state.auth.user.name);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { page } = props;

  const onLogOut = () => {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (!isAuthenticated) props.history.push("/login")
  }, [props.history, isAuthenticated]);

  return (
    <Layout style={{ height: '100%' }}>
      <Layout>
        <Sider>
          <div style={{ height: "32px", background: "rgba(255, 255, 255, 0.2)", margin: "16px" }}></div>
          <Menu
            mode="vertical"
            theme="dark"
            selectedKeys={page}
          >
            <Menu.Item key="account"><Link to="/admin/account">Мой профиль</Link></Menu.Item>
            <Menu.Item key="list"><Link to="/admin/marathons/list">Мои марафоны</Link></Menu.Item>
            <Menu.Item key="add"><Link to="/admin/marathons/add">Добавить марафон</Link></Menu.Item>
          </Menu>
        </Sider>
        <Content>

          <Header style={{ background: '#fff', padding: 0 }}>
            <Row type="flex" justify="end" align="middle" style={{ height: "100%" }}>
              {isAuthenticated ?
                <React.Fragment>
                  <span>Вы вошли как {name}</span>
                  <Icon type="logout" style={{ padding: "20px", cursor: "pointer" }} onClick={onLogOut} />
                </React.Fragment> :
                <Icon type="login" style={{ padding: "20px" }} />
              }
            </Row>
          </Header>
          <div style={{ padding: '0 50px' }}>
            {props.children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;