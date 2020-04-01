import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Row, Col, Icon, Card, Tooltip, Popconfirm } from 'antd';
import AddFlowForm from "./AddFlowForm"
import { showMarathonFlows, deleteFlow } from "../../actions/flowAction";
// import moment from 'moment';

function List(props) {
  const dispatch = useDispatch();
  const marathonId = useSelector(state => state.marathon.detailed_marathon._id);
  const marathonHandle = useSelector(state => state.marathon.detailed_marathon.handle);
  const flows = useSelector(state => state.flow.flows);

  const [state, setState] = useState({
    visible: false,
  });

  const showAddFlow = () => {
    setState({ visible: true })
  }

  const onCloseAddFlow = () => {
    setState({ visible: false })
  }

  const onDeleteFlow = (flowId, marathonId) => {
    dispatch(deleteFlow(flowId, marathonId));
  }

  useEffect(() => {
    if (marathonId) dispatch(showMarathonFlows(marathonId));
  }, [marathonId, dispatch]);

  return (
    <React.Fragment>
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
            onClick={showAddFlow}

          >
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}>
              <Icon type="plus-circle" style={{ fontSize: '50px', marginBottom: "20px" }} />
              <span style={{ textAlign: "center" }}>Добавить новый поток</span>
            </div>
          </Card>
        </Col>
        {flows ?
          flows.map(flow => (
            <Col span={6} key={flow._id}>
              <Card
                title={
                  <React.Fragment>
                    {flow.status === "default" ?
                      <Icon type="exclamation-circle" style={{ marginRight: "10px" }} />
                      : <Icon type="check-circle" style={{ marginRight: "10px" }} />
                    }
                    <Tooltip title={flow.name}>
                      {flow.name}
                    </Tooltip>
                  </React.Fragment>
                }
                style={{ height: "260px" }}
                hoverable={false}
                className={flow.status === "default" ? "ant-card--draft" : "ant-card--active"}
                actions={[
                  <Tooltip title="Посмотреть подробную информацию о потоке">
                    <Link to={`/admin/marathon/${marathonHandle}/${flow.handle}`}><Icon type="eye" key="view" /></Link>
                  </Tooltip>,
                  <Popconfirm
                    title="Вы уверены, что хотите удалить поток?"
                    onConfirm={() => onDeleteFlow(flow._id, marathonId)}
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
                <div style={{ height: "105px", overflow: "hidden" }}>
                  <p><span style={{ fontWeight: "bold" }}>Дата старта: </span>{flow.start_date}</p>
                  <p><span style={{ fontWeight: "bold" }}>Длительность: </span>{flow.durationo}</p>
                </div>
              </Card>
            </Col>
          )) : ""
        }
      </Row>
      <Drawer
        title="Добавление нового потока"
        placement="right"
        closable={true}
        width={520}
        onClose={onCloseAddFlow}
        visible={state.visible}
      >
        <AddFlowForm />
      </Drawer>
    </React.Fragment>
  );
}

export default List;