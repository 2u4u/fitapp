import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from 'draftjs-to-html';

// import { stateToHTML } from 'draft-js-export-html';

import { showDetailedMaraphon } from "../../actions/maraphonAction";
import { Layout, PageHeader, Row, Col, Button, Tabs, Descriptions, Badge } from 'antd';

import Admin from '../admin/Admin';
import List from '../trainings/List';
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

  return (
    <Admin history={props.history}>
      <PageHeader
        breadcrumb={{ routes }}
        title="Информация по марафону"
      />
      <Tabs defaultActiveKey="3">
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
                  <Badge status="processing" text="Запущен" />
                </Descriptions.Item>
              </Descriptions>)
              : <span>Информация еще не заполнена</span>}
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col span={12}><Button style={{ width: "100%" }}>Редактировать описание марафона</Button></Col>
              <Col span={12}><Button style={{ width: "100%" }} type="dashed">Перевести марафон в черновики</Button></Col>
              <Col span={12}><Button style={{ width: "100%" }} type="primary">Активировать марафон</Button></Col>
              <Col span={12}><Button style={{ width: "100%" }} type="danger">Деактивировать марафон</Button></Col>
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
  );
}

export default View;