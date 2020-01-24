import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showDetailedFlow, activateFlow, fillDetailedFlow } from "../../actions/flowAction";
import { showDetailedMarathon, fillDetailedMarathon } from "../../actions/marathonAction";

import moment from 'moment';

import { Breadcrumb, Drawer, Badge, Typography, Tabs, Alert, Layout, Descriptions, Col, Row, Button } from 'antd';
import Admin from '../admin/Admin';
import AddFlowForm from "./AddFlowForm";
import List from '../trainings/List';
const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

function View(props) {
  const dispatch = useDispatch();
  const { handle, marathon_handle } = props.match.params;
  const flow = useSelector(state => state.flow.detailed_flow);
  // const marathon = useSelector(state => state.marathon.detailed_marathon);
  const { name: marathonName, handle: marathonHandle } = useSelector(state => state.marathon.detailed_marathon);

  const [state, setState] = useState({
    visible: false,
  });

  useEffect(() => {
    dispatch(showDetailedFlow(handle));
    dispatch(showDetailedMarathon(marathon_handle));
    return () => {
      dispatch(fillDetailedFlow({}));
      dispatch(fillDetailedMarathon({}));
    };
  }, [handle, dispatch, marathon_handle]);

  const showEditFlow = () => {
    setState({ visible: true })
  }

  const onCloseEditFlow = () => {
    setState({ visible: false })
  }

  const onActivateFlow = () => {
    const data = {};
    data.handle = handle;
    data.status = (flow.status === "default") ? "success" : "default"
    dispatch(activateFlow(data));
  }

  let badgeStatus = "default";
  let badgeText = "Черновик";
  let alertMessage = <Alert message='Поток еще не добавлена в марафон. Для добавление потока в марафон нажмите кнопку "Добавить в марафон". Поток запустится в Дату старта' type="warning" />

  if (flow) {
    switch (flow.status) {
      case 'success':
        badgeText = "Активный"
        alertMessage = <Alert message='Поток активирован. Поток начнется в Дату старта' type="success" />
        break
      case 'processing':
        badgeText = "Идет"
        alertMessage = ""
        break
      default:
        badgeText = "Черновик"
        alertMessage = <Alert message='Поток еще не добавлен в марафон. Для добавление потока в марафон нажмите кнопку "Добавить в марафон". Поток запустится в Дату старта' type="warning" />
    }
    badgeStatus = flow.status;
  }

  let content =
    <Admin history={props.history} page="list">
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>Главная</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/admin/marathons/list">Мои марафоны</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/admin/marathon/${marathonHandle}`}>{marathonName}</Link></Breadcrumb.Item>
        {flow.name ? <Breadcrumb.Item>{flow.name}</Breadcrumb.Item> : ""}
      </Breadcrumb>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Описание потока" key="1">
          <Content style={{ background: '#fff', padding: 24 }}>
            <Content style={{ background: '#fff', padding: 24 }}>
              {flow.name ?
                <React.Fragment>
                  <Title level={2}>{flow ? flow.name : ""}</Title>
                  <Descriptions layout="vertical" bordered>
                    <Descriptions.Item label="Длительность" >{flow.duration}</Descriptions.Item>
                    <Descriptions.Item label="Дата старта">{moment(flow.start_date).format('DD.MM.YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Время старта">{moment(flow.start_time).format('HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label="Цена">{flow.price} руб.</Descriptions.Item>
                    <Descriptions.Item label="Статус">
                      <Badge status={badgeStatus} text={badgeText} />
                    </Descriptions.Item>
                  </Descriptions>
                </React.Fragment>
                : <span>Информация еще не заполнена</span>
              }
              <div style={{ marginTop: "20px" }}>
                {alertMessage}
              </div>
              <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                <Col span={12}><Button style={{ width: "100%" }} onClick={() => showEditFlow()} >Редактировать поток</Button></Col>
                <Col span={12}><Button style={{ width: "100%" }} onClick={() => onActivateFlow(flow.status)} type="primary">{flow.status === "default" ? "Добавить в марафон" : "Перевести в черновики"}</Button></Col>
              </Row>
            </Content>
          </Content>
        </TabPane>
        <TabPane tab="Анкета потока" key="3">
          <Content style={{ background: '#fff', padding: 24 }}>
            <div style={{ marginBottom: "20px" }}>Анкета еще не добавлена</div>
            <Button type="primary">Добавить анкету</Button>
          </Content>
        </TabPane>
        <TabPane tab="Тренировки потока" key="4">
          <Content style={{ background: '#fff', padding: 24 }}>
            <List />
          </Content>
        </TabPane>
      </Tabs>
      <Drawer
        title="Редактирование потока"
        placement="right"
        closable={true}
        width={520}
        onClose={onCloseEditFlow}
        visible={state.visible}
      >
        <AddFlowForm flow={flow} />
      </Drawer>
    </Admin>

  return (content);
}

export default View;