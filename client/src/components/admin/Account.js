import React from 'react';
import { useSelector } from "react-redux";
import { Descriptions, PageHeader, Layout, Card } from 'antd';
import Admin from "../admin/Admin"
const { Content } = Layout;

function Account(props) {
  const name = useSelector(state => state.auth.user.name);
  const email = useSelector(state => state.auth.user.email);
  // const [state, setState] = useState({
  //   maraphonName: "",
  //   maraphonDescription: "",
  //   maraphonDuration: "",
  //   maraphonProgramm: "",
  //   maraphonCategory: "",
  //   maraphonTarget: "",
  //   maraphonStartDate: "",
  //   maraphonPrice: ""
  // });

  const routes = [
    {
      path: 'index',
      breadcrumbName: 'Главная',
    },
    // {
    //   path: 'first',
    //   breadcrumbName: 'Список марафонов',
    // },
    // {
    //   path: 'second',
    //   breadcrumbName: 'Марафон 1',
    // },
  ];


  return (
    <Admin history={props.history}>
      <PageHeader
        // style={{
        //   border: '1px solid rgb(235, 237, 240)',
        // }}
        // onBack={() => null}
        breadcrumb={{ routes }}
        title="Ваш профиль"
      // subTitle="Не забудьте сохранить тренировку"
      />
      <Content
        style={{
          background: '#fff',
          // padding: 24
        }}
      >
        <Card
          title="Общая информация"
        // headStyle={{
        //   backgroundColor: "#039be5",
        //   color: "#ffffff"
        // }}
        >
          <Descriptions>
            <Descriptions.Item label="Имя">{name}</Descriptions.Item>
            <Descriptions.Item label="Email">{email}</Descriptions.Item>
            {/* <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
            <Descriptions.Item label="Remark">empty</Descriptions.Item>
            <Descriptions.Item label="Address">
              No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
          </Descriptions.Item> */}
          </Descriptions>
        </Card>
      </Content>
    </Admin>
  );
}

export default Account;