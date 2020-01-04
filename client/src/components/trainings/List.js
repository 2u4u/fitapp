import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Row, Col, Icon, Card } from 'antd';
import draftToHtml from 'draftjs-to-html';
import AddTrainingForm from "./AddTrainingForm"
import { showMaraphonTrainings } from "../../actions/trainingAction";

function List(props) {
  const dispatch = useDispatch();
  const maraphonId = useSelector(state => state.maraphon.detailed_maraphon._id);
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

  useEffect(() => {
    if (maraphonId) dispatch(showMaraphonTrainings(maraphonId));
  }, [maraphonId, dispatch]);

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
                  <Link to={`/admin/training/${training.handle}`}><Icon type="eye" key="view" /></Link>,
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