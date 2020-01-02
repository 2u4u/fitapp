import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from 'antd';
import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;

function SideBlock() {
  // handleClick = e => {
  //   console.log('click ', e);
  // };

  return (
    <Sider
      width={400}
    >
      <Menu
        // onClick={this.handleClick}
        style={{ width: 200 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="mail" />
              <span>Navigation One</span>
            </span>
          }
        >
          <Menu.ItemGroup key="g1" title="Item 1">
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup key="g2" title="Item 2">
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
      </Menu>
    </Sider>
  )
}

export default SideBlock;