import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../actions/authAction";
import { Layout, Form, Icon, Input, Button, Checkbox, Typography, Row, Col } from 'antd';

const { Title } = Typography;
const { Content, Sider } = Layout;

function Login(props) {
  const errors = useSelector(state => state.error);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [state, setState] = useState({
    email: "",
    password: "",
    errors: errors
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const user = {
      email: state.email,
      password: state.password
    };

    dispatch(loginUser(user));
  }

  const handleOnChange = (e) => {
    let { name, value } = e.target;
    setState(state => ({ ...state, [name]: value }))
  }

  useEffect(() => {
    if (isAuthenticated) props.history.push("/admin")
  }, [props.history, isAuthenticated]);

  return (
    <Layout style={{ height: '100%' }}>
      <Content><Row><Col>Добро пожаловать</Col></Row></Content>
      <Sider
        theme="light"
        width="400"
        style={{ padding: 24 }}
      >
        <Title level={3}>Вход</Title>
        <Form className="login-form" noValidate onSubmit={onSubmit} >
          <Form.Item>
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Ваш email"
              onChange={e => handleOnChange(e)}
              type="text"
              name="email"
              value={state.email}
              autoComplete="email"
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Пароль"
              onChange={e => handleOnChange(e)}
              name="password"
              value={state.password}
              autoComplete="password"
            />
          </Form.Item>
          <Form.Item>
            <Checkbox>Запомнить меня</Checkbox>
            {/* <a className="login-form-forgot" href="">
              Забыли пароль?
              </a> */}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Войти
            </Button>
          </Form.Item>
          <Form.Item>
            или <Link to="/register">зарегистрируйтесь!</Link>
          </Form.Item>
        </Form>
      </Sider>
    </Layout>
  )
}

export default Login;