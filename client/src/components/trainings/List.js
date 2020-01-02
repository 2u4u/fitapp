import React from 'react';
import { Row, Col } from 'antd';
import { Icon } from 'antd';
import { Link } from "react-router-dom";
import { PageHeader } from 'antd';
import {
  Card,
} from 'antd';
import Admin from '../admin/Admin';

// const { Meta } = Card;

function List(props) {
  // const [state, setState] = useState({
  //   trainings: [],
  // })
  const routes = [
    // {
    //   path: 'index',
    //   breadcrumbName: 'First-level Menu',
    // },
    {
      path: 'first',
      breadcrumbName: 'Список марафонов',
    },
    {
      path: 'second',
      breadcrumbName: 'Марафон 1',
    },
  ];

  return (
    <Admin history={props.history}>
      <PageHeader
        // style={{
        //   border: '1px solid rgb(235, 237, 240)',
        // }}
        onBack={() => null}
        breadcrumb={{ routes }}
        title="Список тренировок марафона"
      // subTitle="Не забудьте сохранить тренировку"
      />
      <Row gutter={[16, 16]} type="flex">
        <Col span={6}>
          <Card
            title="Тренировка 1"
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
            title="Тренировка 2"
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
          <Link to="/admin/trainings/add">
            <Card
              style={{
                height: "260px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
              }}
              hoverable={true}

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
          </Link>
        </Col>
      </Row>
    </Admin>
  );
}

export default List;