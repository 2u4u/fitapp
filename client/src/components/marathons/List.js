import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from 'draftjs-to-html';
import { showUserMarathons, deleteMarathon } from "../../actions/marathonAction";

import AddMarathonForm from "./AddMarathonForm"
import { Drawer, Row, Col, Icon, Breadcrumb, Card, Tooltip, Popconfirm } from 'antd';

function List() {
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

  const onDeleteMarathon = (marathonId, userId) => {
    dispatch(deleteMarathon(marathonId, userId));
  }

  return (
    <React.Fragment>
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
                title={
                  <React.Fragment>
                    {marathon.status === "default" ?
                      <Icon type="exclamation-circle" style={{ marginRight: "10px" }} />
                      : <Icon type="check-circle" style={{ marginRight: "10px" }} />
                    }
                    <Tooltip title={marathon.name}>
                      {marathon.name}
                    </Tooltip>
                  </React.Fragment>
                }
                style={{ height: "260px" }}
                hoverable={false}
                className={marathon.status === "default" ? "ant-card--draft" : "ant-card--active"}
                actions={[
                  <Tooltip title="Посмотреть подробную информацию о марафоне">
                    <Link to={`/admin/marathon/${marathon.handle}`}><Icon type="eye" key="view" /></Link>
                  </Tooltip>,
                  <Popconfirm
                    title="Вы уверены, что хотите удалить марафон?"
                    onConfirm={() => onDeleteMarathon(marathon._id, userId)}
                    okText="Уверен, удаляем"
                    cancelText="Нет, не удалять"
                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  >
                    <Tooltip title="Удалить поток">
                      <span><Icon type="delete" key="delete" /></span>
                    </Tooltip>
                  </Popconfirm>,
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
    </React.Fragment>
  );
}

export default List;