import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from 'draftjs-to-html';

import { showDetailedTraining } from "../../actions/trainingAction";

import { PageHeader, Alert, Layout, Descriptions, Badge, Col, Row, Button } from 'antd';

import Admin from '../admin/Admin';
// import Page404 from '../page/Page404';

const { Content } = Layout;

function View(props) {
  const dispatch = useDispatch();
  const { handle } = props.match.params;
  const training = useSelector(state => state.training.detailed_training);

  const routes = [{
    path: 'first',
    breadcrumbName: 'Список марафонов',
  },];

  useEffect(() => {
    if (handle) dispatch(showDetailedTraining(handle));
  }, [handle, dispatch]);

  let badgeStatus = "default";
  let badgeText = "Черновик";
  let alertMessage = <Alert message='Тренировка еще не добавлена в марафон. Для добавление тренировки в марафон нажмите кнопку "Активировать тренировку". Тренировка запустится в Дату старта' type="warning" />

  if (training) {
    console.log("maraphon.status", training.status)
    switch (training.status) {
      case 'Success':
        badgeText = "Активный"
        alertMessage = <Alert message='Тренировка активированна. Тренировка запустится в Дату старта' type="success" />
        break
      case 'Processing':
        badgeText = "Идет"
        alertMessage = ""
        break
      default:
        badgeText = "Черновик"
        alertMessage = <Alert message='Тренировка еще не добавлена в марафон. Для добавление тренировки в марафон нажмите кнопку "Активировать тренировку". Тренировка запустится в Дату старта". Марафон запустится в Дату старта' type="warning" />
    }
  }

  let content =
    <Admin history={props.history}>
      <PageHeader
        breadcrumb={{ routes }}
        title="Информация по тренировке"
      />
      <Content style={{ background: '#fff', padding: 24 }}>
        {training.description ?
          (<Descriptions title={training.name} layout="vertical" bordered>
            <Descriptions.Item label="Описание тренировки" span={3}>
              <div
                dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(training.description)) }} >
              </div>
            </Descriptions.Item>
            {/* <Descriptions.Item label="Длительность" >{maraphon.duration}</Descriptions.Item>
            <Descriptions.Item label="Дата старта">{maraphon.start_date}</Descriptions.Item>
            <Descriptions.Item label="Категория">{maraphon.category}</Descriptions.Item>
            <Descriptions.Item label="Цели">{maraphon.goals}</Descriptions.Item>
            <Descriptions.Item label="Цена">{maraphon.price} руб.</Descriptions.Item> */}
            <Descriptions.Item label="Статус">
              <Badge status={badgeStatus} text={badgeText} />
            </Descriptions.Item>
          </Descriptions>)
          : <span>Информация еще не заполнена</span>}
        <div style={{ marginTop: "20px" }}>
          {alertMessage}
        </div>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col span={12}><Button style={{ width: "100%" }}>Редактировать тренировку</Button></Col>
          {/* <Col span={12}><Button style={{ width: "100%" }} type="dashed">Перевести марафон в черновики</Button></Col> */}
          <Col span={12}><Button style={{ width: "100%" }} type="primary">Активировать тренировку</Button></Col>
          {/* <Col span={12}><Button style={{ width: "100%" }} type="danger">Деактивировать марафон</Button></Col> */}
        </Row>
      </Content>
    </Admin>
  // ) : <Page404 />)

  return (content);
}

export default View;