import React, { useState } from 'react';
import { Drawer, Row, Col, Icon, Card } from 'antd';
import AddTrainingForm from "./AddTrainingForm"

function List(props) {
  const [state, setState] = useState({
    visible: false,
  });

  const showAddTraining = () => {
    setState({ visible: true })
  }

  const onCloseAddTraining = () => {
    setState({ visible: false })
  }

  return (
    <React.Fragment>
      <Row gutter={[16, 16]} type="flex">
        <Col span={6}>
          <Card
            title="Тренировка 3"
            style={{ height: "260px" }}
            hoverable={true}
            actions={[
              <Icon type="setting" key="setting" />,
              // <Icon type="edit" key="edit" />,
              <Icon type="ellipsis" key="ellipsis" />,
            ]}
          >
            <div style={{ height: "105px", overflow: "hidden" }}>Ea ex elit amet eiusmod ullamco. Dolor officia nisi fugiat labore commodo enim qui aliquip do. Minim qui dolore nulla esse voluptate veniam mollit ea culpa id et. Irure occaecat do elit ut culpa labore esse deserunt non Lorem Lorem. Tempor excepteur dolore ipsum nisi magna non laborum laborum.</div>
          </Card>
        </Col>
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
              <span>Добавить тренировку</span>
            </div>
          </Card>
        </Col>
      </Row>
      <Drawer
        title="Добавление тренировки"
        placement="right"
        closable={false}
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