import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Row, Col, Icon, Card, Tooltip, Popconfirm } from 'antd';
import draftToHtml from 'draftjs-to-html';
import AddTrainingForm from "./AddTrainingForm"
import { showMarathonTrainings, deleteTraining } from "../../actions/trainingAction";

function List(props) {
  const dispatch = useDispatch();
  const marathonId = useSelector(state => state.marathon.detailed_marathon._id);
  const marathonHandle = useSelector(state => state.marathon.detailed_marathon.handle);
  const flowId = useSelector(state => state.flow.detailed_flow._id);
  const flowHandle = useSelector(state => state.flow.detailed_flow.handle);
  const trainings = useSelector(state => state.training.trainings);

  const [state, setState] = useState({
    visible: false,
  });

  const showAddTraining = () => {
    setState({ visible: true })
  }

  const onCloseAddTraining = () => {
    setState({ visible: false })
  }

  const onDeleteTraining = (trainingId, flowId, marathonId) => {
    dispatch(deleteTraining(trainingId, flowId, marathonId));
  }

  useEffect(() => {
    if (marathonId) dispatch(showMarathonTrainings(marathonId, flowId));
  }, [marathonId, flowId, dispatch]);

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
            onClick={showAddTraining}

          >
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}>
              <Icon type="plus-circle" style={{ fontSize: '50px', marginBottom: "20px" }} />
              <span style={{ textAlign: "center" }}>Добавить тренировку</span>
            </div>
          </Card>
        </Col>
        {trainings ?
          trainings.map(training => (
            <Col span={6} key={training._id}>
              <Card
                title={training.name}
                style={{ height: "260px" }}
                hoverable={false}
                actions={[
                  <Tooltip title="Посмотреть подробную информацию по тренировке">
                    <Link to={`/admin/marathon/${marathonHandle}/${flowHandle}/${training.handle}`}><Icon type="eye" key="view" /></Link>
                  </Tooltip>,
                  <Popconfirm
                    title="Вы уверены, что хотите удалить поток?"
                    onConfirm={() => onDeleteTraining(training._id, flowId, marathonId)}
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
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(training.description)) }} >
                </div>
              </Card>
            </Col>
          )) : ""
        }
      </Row>
      <Drawer
        title="Добавление тренировки"
        placement="right"
        closable={true}
        width={520}
        onClose={onCloseAddTraining}
        visible={state.visible}
      >
        <AddTrainingForm />
      </Drawer>
    </React.Fragment>
  );
}

export default List;