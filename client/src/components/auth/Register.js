import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../../actions/authAction";
import { Layout, Form, Icon, Input, Button, Checkbox, Typography } from 'antd';
const { Title } = Typography;
const { Content, Sider } = Layout;

const Register = (props) => {
  // const errors = useSelector(state => state.error);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [state, setState] = useState({
    email: "",
    name: "",
    password: "",
    password2: ""
  });

  const onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      email: state.email,
      name: state.name,
      password: state.password,
      password2: state.password2
    };

    dispatch(registerUser(newUser, props.history));
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
      <Content>Content</Content>
      <Sider
        theme="light"
        width="400"
        style={{ padding: 24 }}
      >
        <Title level={3}>Регистрация</Title>
        <Form noValidate onSubmit={onSubmit} className="login-form">
          <Form.Item>
            <Input
              size="large"
              onChange={e => handleOnChange(e)}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Имя"
              type="text"
              name="name"
              value={state.name}
            />
          </Form.Item>
          <Form.Item>
            <Input
              size="large"
              onChange={e => handleOnChange(e)}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Ваш email"
              type="email"
              name="email"
              value={state.email}
              autoComplete="email"
            />
          </Form.Item>
          <Form.Item>
            <Input
              size="large"
              onChange={e => handleOnChange(e)}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Пароль"
              name="password"
              value={state.password}
              autoComplete="password"
            />
          </Form.Item>
          <Form.Item>
            <Input
              size="large"
              onChange={e => handleOnChange(e)}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Пароль"
              name="password2"
              value={state.password2}
              autoComplete="password"
            />
          </Form.Item>
          <Form.Item>
            <Checkbox>Принять <Link to="/login">условия обслуживания</Link></Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="submit" style={{ width: "100%" }} htmlType="submit" className="login-form-button">
              Зарегистрироваться
            </Button>
          </Form.Item>
          <Form.Item>
            или <Link to="/login">войдите!</Link>
          </Form.Item>
        </Form>
      </Sider>
    </Layout>
  )
}

export default Register;