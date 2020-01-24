import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from 'draftjs-to-html';
import { Link } from "react-router-dom";

import { showDetailedMarathon, activateMarathon, fillDetailedMarathon } from "../../actions/marathonAction";

import { Tag, Drawer, Alert, Layout, Typography, Breadcrumb, Row, Col, Button, Tabs, Descriptions, Badge } from 'antd';
import AddMarathonForm from "./AddMarathonForm"
import Admin from '../admin/Admin';
import FlowList from "../flows/FlowList"
// import Page404 from '../page/Page404';
const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;

function View(props) {
  const dispatch = useDispatch();
  const { handle } = props.match.params;
  const marathon = useSelector(state => state.marathon.detailed_marathon);
  // const loading = useSelector(state => state.marathon.loading);

  const [state, setState] = useState({
    visible: false,
  });

  useEffect(() => {
    dispatch(showDetailedMarathon(handle));
    return () => {
      dispatch(fillDetailedMarathon({}))
    };
  }, [handle, dispatch]);

  const showEditMarathon = () => {
    setState({ visible: true })
  }

  const onCloseEditMarathon = () => {
    setState({ visible: false })
  }

  const onActivateMarathon = () => {
    const data = {};
    data.handle = handle;
    data.status = (marathon.status === "default") ? "success" : "default"
    dispatch(activateMarathon(data));
  }

  let badgeStatus = "default";
  let badgeText = "Черновик";
  let alertMessage = <Alert message='Марафон еще не активен. Для активации марафона нажмите кнопку "Активировать марафон". Марафон запустится в Дату старта' type="warning" />

  switch (marathon.status) {
    case 'success':
      badgeText = "Активный"
      alertMessage = <Alert message='Марафон активен. Марафон запустится в Дату старта' type="success" />
      break
    case 'processing':
      badgeText = "Идет"
      alertMessage = ""
      break
    default:
      badgeText = "Черновик"
      alertMessage = <Alert message='Марафон еще не активен. Для активации марафона нажмите кнопку "Активировать марафон". Марафон запустится в Дату старта' type="warning" />
  }
  badgeStatus = marathon.status;

  let content =
    <Admin history={props.history} page="list">
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>Главная</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/admin/marathons/list">Мои марафоны</Link></Breadcrumb.Item>
        {marathon.name ? <Breadcrumb.Item>{marathon.name}</Breadcrumb.Item> : ""}
      </Breadcrumb>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Описание марафона" key="1">
          <Content style={{ background: '#fff', padding: 24 }}>
            {marathon.description ?
              <React.Fragment>
                <Title level={2}>{marathon ? marathon.name : ""}</Title>
                <Descriptions layout="vertical" bordered>
                  {marathon.description ?
                    (<Descriptions.Item label="Описание марафона" span={3}>
                      <div
                        dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(marathon.description)) }} >
                      </div>
                    </Descriptions.Item>)
                    : "Информация еще не заполнена"
                  }
                  <Descriptions.Item label="Категория">{marathon.category}</Descriptions.Item>
                  <Descriptions.Item label="Цели">
                    {marathon.goals ? marathon.goals.map((goal, index) => {
                      return (<Tag color="geekblue" key={index}>{goal}</Tag>)
                    }) : ""}
                  </Descriptions.Item>
                  <Descriptions.Item label="Статус">
                    <Badge status={badgeStatus} text={badgeText} />
                  </Descriptions.Item>
                </Descriptions>
              </React.Fragment>
              : <span>Информация еще не заполнена</span>}
            <div style={{ marginTop: "20px" }}>
              {alertMessage}
            </div>
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col span={12}><Button style={{ width: "100%" }} onClick={() => showEditMarathon()} >Редактировать описание марафона</Button></Col>
              <Col span={12}><Button style={{ width: "100%" }} onClick={() => onActivateMarathon(marathon.status)} type="primary">{marathon.status === "default" ? "Активировать марафон" : "Перевести в черновики"}</Button></Col>
            </Row>
          </Content>
        </TabPane>
        <TabPane tab="Потоки" key="2">
          <Content style={{ background: '#fff', padding: 24 }}>
            <FlowList />
          </Content>
        </TabPane>
      </Tabs>
      <Drawer
        title="Редактирование марафона"
        placement="right"
        closable={true}
        width={520}
        onClose={onCloseEditMarathon}
        visible={state.visible}
      >
        <AddMarathonForm marathon={marathon} />
      </Drawer>
    </Admin >

  return (content);
}

export default View;