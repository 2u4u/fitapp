import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from 'draftjs-to-html';
import { showUserMarathons } from "../../actions/marathonAction";

import Admin from "../admin/Admin"
import AddMarathonForm from "./AddMarathonForm"
import { Drawer, Row, Col, Icon, Breadcrumb, Card } from 'antd';

function List(props) {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);
  const marathons = useSelector(state => state.marathon.marathons);

  const [state, setState] = useState({
    visible: false,
  });

  useEffect(() => {
    dispatch(showUserMarathons(userId));
  }, [userId, dispatch]);

  const showAddMarathon = () => {
    setState({ visible: true })
  }

  const onCloseAddMarathon = () => {
    setState({ visible: false })
  }

  return (
    <Admin history={props.history} page="list">
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>Главная</Breadcrumb.Item>
        <Breadcrumb.Item>Мои марафоны</Breadcrumb.Item>
      </Breadcrumb>
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
            onClick={showAddMarathon}
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
        {marathons ?
          marathons.map(marathon => (
            <Col span={6} key={marathon._id}>
              <Card
                title={marathon.name}
                style={{ height: "260px" }}
                hoverable={false}
                actions={[
                  // <Link to="/admin/marathon/news"><Icon type="warning" theme="twoTone" twoToneColor="#eb2f96" key="users" /></Link>,
                  <Link to={`/admin/marathon/${marathon.handle}`}><Icon type="eye" key="view" /></Link>,
                  // <Link to="/admin/trainings/add"><Icon type="edit" key="edit" /></Link>,
                ]}
              >
                <div style={{ height: "105px", overflow: "hidden" }}
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(marathon.description)) }} >
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
        onClose={onCloseAddMarathon}
        visible={state.visible}
      >
        <AddMarathonForm />
      </Drawer>
    </Admin>
  );
}

export default List;