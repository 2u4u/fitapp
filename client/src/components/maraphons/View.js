import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from 'draftjs-to-html';

// import { stateToHTML } from 'draft-js-export-html';

import { showDetailedMaraphon } from "../../actions/maraphonAction";
import { Layout, PageHeader, Descriptions, Badge } from 'antd';

import Admin from '../admin/Admin';
const { Content } = Layout;

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
      {maraphon.description ?
        (<Content style={{ background: '#fff', padding: 24 }}>
          <Descriptions title={maraphon.name} layout="vertical" bordered>
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
          </Descriptions>
        </Content>)
        : ""}
    </Admin>
  );
}

export default View;