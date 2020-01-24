import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from 'draftjs-to-html';
import { Link } from "react-router-dom";
import { showDetailedTraining, activateTraining, fillDetailedTraining } from "../../actions/trainingAction";
import { showDetailedFlow, fillDetailedFlow } from "../../actions/flowAction";
import { showDetailedMarathon, fillDetailedMarathon } from "../../actions/marathonAction";

import { Breadcrumb, Drawer, Tag, Card, Alert, Layout, Descriptions, Badge, Col, Row, Button } from 'antd';
import Admin from '../admin/Admin';
import AddTrainingForm from "./AddTrainingForm";
const { Content } = Layout;

function View(props) {
  const dispatch = useDispatch();
  const { handle, marathon_handle, flow_handle } = props.match.params;
  const training = useSelector(state => state.training.detailed_training);
  const { name: marathonName, handle: marathonHandle } = useSelector(state => state.marathon.detailed_marathon);
  const { name: flowName, handle: flowHandle } = useSelector(state => state.flow.detailed_flow);

  const [state, setState] = useState({
    visible: false,
  });

  useEffect(() => {
    // if (handle) dispatch(showDetailedTraining(handle));
    dispatch(showDetailedTraining(handle));
    dispatch(showDetailedFlow(flow_handle));
    dispatch(showDetailedMarathon(marathon_handle));
    return () => {
      dispatch(fillDetailedTraining({}));
      dispatch(fillDetailedFlow({}));
      dispatch(fillDetailedMarathon({}));
    };
  }, [handle, flow_handle, marathon_handle, dispatch]);


  const showEditTraining = () => {
    setState({ visible: true })
  }

  const onCloseEditTraining = () => {
    setState({ visible: false })
  }

  const onActivateTraining = () => {
    const data = {};
    data.handle = handle;
    data.status = (training.status === "default") ? "success" : "default"
    dispatch(activateTraining(data));
  }

  let badgeStatus = "default";
  let badgeText = "Черновик";
  let alertMessage = <Alert message='Тренировка еще не добавлена в марафон. Для добавление тренировки в марафон нажмите кнопку "Добавить в поток". Тренировка запустится в Дату старта' type="warning" />

  switch (training.status) {
    case 'success':
      badgeText = "Активный"
      alertMessage = <Alert message='Тренировка активирована. Тренировка запустится в Дату старта' type="success" />
      break
    case 'processing':
      badgeText = "Идет"
      alertMessage = ""
      break
    default:
      badgeText = "Черновик"
      alertMessage = <Alert message='Тренировка еще не добавлена в марафон. Для добавление тренировки в марафон нажмите кнопку "Добавить в поток". Тренировка запустится в Дату старта". Марафон запустится в Дату старта' type="warning" />
  }
  badgeStatus = training.status;

  let content =
    <Admin history={props.history} page="list">
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>Главная</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/admin/marathons/list">Мои марафоны</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/admin/marathon/${marathonHandle}`}>{marathonName}</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/admin/${marathonHandle}/${flowHandle}`}>{flowName}</Link></Breadcrumb.Item>
        {training.name ? <Breadcrumb.Item>{training.name}</Breadcrumb.Item> : ""}
      </Breadcrumb>
      <Content style={{ background: '#fff', padding: 24 }}>
        {training.description ?
          (<Descriptions title={training.name} layout="vertical" bordered>
            <Descriptions.Item label="Описание тренировки" span={3}>
              <div
                dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(training.description)) }} >
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Задания тренировки" span={3}>
              {training.tasks.map((task, taskId) => {
                return (
                  <Card
                    key={taskId}
                    size="small"
                    title={"Задание " + (taskId + 1)}
                    style={{ width: "100%", marginBottom: "20px" }}
                    extra={
                      <div>
                        <Tag color={(task.type === "text") ? "green" : ((task.text === "video") ? "blue" : "purple")}>
                          {(task.type === "text") ? "Текст" : ((task.text === "video") ? "Видео" : "Фото")}
                        </Tag>
                        <Tag color={(task.approval === "manualaccept") ? "#108ee9" : "#87d068"}>
                          {(task.approval === "manualaccept") ? "Ручная проверка" : "Автоматическая проверка"}
                        </Tag>
                      </div>
                    }
                  >
                    <p>{task.text}</p>
                  </Card>
                )
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Статус" span={3}>
              <Badge status={badgeStatus} text={badgeText} />
            </Descriptions.Item>
          </Descriptions>)
          : <span>Информация еще не заполнена</span>}
        <div style={{ marginTop: "20px" }}>
          {alertMessage}
        </div>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}><Button style={{ width: "100%" }} onClick={() => showEditTraining(training.status)}>Редактировать тренировку</Button></Col>
          <Col span={12}><Button style={{ width: "100%" }} onClick={() => onActivateTraining(training.status)} type="primary">{training.status === "default" ? "Добавить в поток" : "Перевести в черновики"}</Button></Col>
        </Row>
      </Content>
      <Drawer
        title="Редактирование тренировки"
        placement="right"
        closable={true}
        width={520}
        onClose={onCloseEditTraining}
        visible={state.visible}
      >
        <AddTrainingForm training={training} />
      </Drawer>
    </Admin>
  // ) : <Page404 />)

  return (content);
}

export default View;