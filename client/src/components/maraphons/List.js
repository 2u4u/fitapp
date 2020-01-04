import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from 'draftjs-to-html';
import { showUserMaraphons } from "../../actions/maraphonAction";

import Admin from "../admin/Admin"
import AddMaraphonForm from "./AddMaraphonForm"
import { Drawer, Row, Col, Icon, PageHeader, Card } from 'antd';

const routes = [
  {
    path: 'first',
    breadcrumbName: 'Список марафонов',
  },
];

function List(props) {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);
  const maraphons = useSelector(state => state.maraphon.maraphons);

  const [state, setState] = useState({
    visible: false,
  });

  useEffect(() => {
    dispatch(showUserMaraphons(userId));
  }, [userId, dispatch]);

  const showAddMaraphon = () => {
    setState({ visible: true })
  }

  const onCloseAddMaraphon = () => {
    setState({ visible: false })
  }

  return (
    <Admin history={props.history}>
      <PageHeader
        breadcrumb={{ routes }}
        title="Список ваших марафонов"
      />
      <Row gutter={[16, 16]} type="flex">
        <Col span={6}>
          <Card
            style={{
              height: "260px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
            hoverable={true}
            onClick={showAddMaraphon}
          >
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}>
              <Icon type="plus-circle" style={{ fontSize: '50px', marginBottom: "20px" }} />
              <span>Добавить марафон</span>
            </div>
          </Card>
        </Col>
        {maraphons ?
          maraphons.map(maraphon => (
            <Col span={6} key={maraphon._id}>
              <Card
                title={maraphon.name}
                style={{ height: "260px" }}
                hoverable={false}
                actions={[
                  // <Link to="/admin/maraphon/news"><Icon type="warning" theme="twoTone" twoToneColor="#eb2f96" key="users" /></Link>,
                  <Link to={`/admin/maraphon/${maraphon.handle}`}><Icon type="eye" key="view" /></Link>,
                  // <Link to="/admin/trainings/add"><Icon type="edit" key="edit" /></Link>,
                ]}
              >
                <div style={{ height: "105px", overflow: "hidden" }}
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(maraphon.description)) }} >
                </div>
              </Card>
            </Col>
          )) : ""
        }
      </Row>
      <Drawer
        title="Добавление марафона"
        placement="right"
        closable={true}
        width={520}
        onClose={onCloseAddMaraphon}
        visible={state.visible}
      >
        <AddMaraphonForm />
      </Drawer>
    </Admin>
  );
}

export default List;