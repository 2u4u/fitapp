import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from 'draftjs-to-html';

// import { stateToHTML } from 'draft-js-export-html';

import { showDetailedMaraphon } from "../../actions/maraphonAction";
import { Alert, Layout, PageHeader, Row, Col, Button, Tabs, Descriptions, Badge } from 'antd';

import Admin from '../admin/Admin';
import List from '../trainings/List';
// import Page404 from '../page/Page404';
const { Content } = Layout;
const { TabPane } = Tabs;

function View(props) {
  const dispatch = useDispatch();
  const { handle } = props.match.params;
  const maraphon = useSelector(state => state.maraphon.detailed_maraphon);

  const routes = [{
    path: 'first',
    breadcrumbName: 'Список марафонов',
  },];

  useEffect(() => {
    dispatch(showDetailedMaraphon(handle));
  }, [handle, dispatch]);

  let badgeStatus = "default";
  let badgeText = "Черновик";
  let alertMessage = <Alert message='Марафон еще не активен. Для активации марафона нажмите кнопку "Активировать марафон". Марафон запустится в Дату старта' type="warning" />

  console.log("maraphon.status", maraphon.status)
  switch (maraphon.status) {
    case 'Success':
      badgeText = "Активный"
      alertMessage = <Alert message='Марафон активирован. Марафон запустится в Дату старта' type="success" />
      break
    case 'Processing':
      badgeText = "Идет"
      alertMessage = ""
      break
    default:
      badgeText = "Черновик"
      alertMessage = <Alert message='Марафон еще не активен. Для активации марафона нажмите кнопку "Активировать марафон". Марафон запустится в Дату старта' type="warning" />
  }


  let content =
    // maraphon ?
    <Admin history={props.history}>
      <PageHeader
        breadcrumb={{ routes }}
        title="Информация по марафону"
      />
      <Tabs defaultActiveKey="1">
        <TabPane tab="Описание марафона" key="1">
          <Content style={{ background: '#fff', padding: 24 }}>
            {maraphon.description ?
              (<Descriptions title={maraphon.name} layout="vertical" bordered>
                <Descriptions.Item label="Описание марафона" span={3}>
                  <div
                    dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(maraphon.description)) }} >
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Длительность" >{maraphon.duration}</Descriptions.Item>
                <Descriptions.Item label="Дата старта">{maraphon.start_date}</Descriptions.Item>
                <Descriptions.Item label="Категория">{maraphon.category}</Descriptions.Item>
                <Descriptions.Item label="Цели">{maraphon.goals}</Descriptions.Item>
                <Descriptions.Item label="Цена">{maraphon.price} руб.</Descriptions.Item>
                <Descriptions.Item label="Статус">
                  <Badge status={badgeStatus} text={badgeText} />
                </Descriptions.Item>
              </Descriptions>)
              : <span>Информация еще не заполнена</span>}
            <div style={{ marginTop: "20px" }}>
              {alertMessage}
            </div>
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col span={12}><Button style={{ width: "100%" }}>Редактировать описание марафона</Button></Col>
              {/* <Col span={12}><Button style={{ width: "100%" }} type="dashed">Перевести марафон в черновики</Button></Col> */}
              <Col span={12}><Button style={{ width: "100%" }} type="primary">Активировать марафон</Button></Col>
              {/* <Col span={12}><Button style={{ width: "100%" }} type="danger">Деактивировать марафон</Button></Col> */}
            </Row>
          </Content>
        </TabPane>
        <TabPane tab="Анкета марафона" key="2">
          <Content style={{ background: '#fff', padding: 24 }}>
            <div style={{ marginBottom: "20px" }}>Анкета еще не добавлена</div>
            <Button type="primary">Добавить анкету</Button>
          </Content>
        </TabPane>
        <TabPane tab="Тренировки марафона" key="3">
          <Content style={{ background: '#fff', padding: 24 }}>
            {/* <div style={{ marginBottom: "20px" }}>Тренировки еще не добавлены</div> */}
            <List />
          </Content>
        </TabPane>
      </Tabs>
    </Admin>
  // : <Page404 />

  return (content);
}

export default View;