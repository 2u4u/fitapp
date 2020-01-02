import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { useDispatch, useSelector } from "react-redux";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// import { stateToHTML } from 'draft-js-export-html';

import { addMaraphon } from "../../actions/maraphonAction";
import { Button, Form, Input, Select, Layout, PageHeader, DatePicker } from 'antd';

import Admin from '../admin/Admin';

const { Content } = Layout;
const { Option } = Select;

function Add(props) {
  const dispatch = useDispatch();
  // const name = useSelector(state => state.auth.user.name);
  const userId = useSelector(state => state.auth.user.id);

  const [state, setState] = useState({
    maraphonId: "",
    maraphonName: "",
    maraphonDescription: "",
    maraphonDuration: "",
    maraphonGoal: ['a10', 'c12'],
    maraphonProgramm: "",
    maraphonCategory: "",
    maraphonStartDate: "",
    maraphonPrice: ""
  });

  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(),
  );

  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  }

  const handleEditorChange = (editorState) => {
    setEditorState(
      editorState,
    );
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setState(state => ({ ...state, [name]: value }));
  }

  function handleSelectChange(value) {
    setState(state => ({ ...state, "maraphonGoal": value }));
  }

  const handleDateChange = (date, dateString) => {
    setState(state => ({ ...state, "maraphonStartDate": date }));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const newMaraphon = {
      id: state.maraphonId, //when edit
      user: userId,
      name: state.maraphonName,
      description: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      duration: state.maraphonDuration,
      category: state.maraphonCategory,
      goal: state.maraphonGoal,
      start_date: state.maraphonStartDate,
      price: state.maraphonPrice,
    };
    dispatch(addMaraphon(newMaraphon));
  }

  const routes = [{
    path: 'first',
    breadcrumbName: 'Список марафонов',
  },];


  return (
    <Admin history={props.history}>
      <PageHeader
        // onBack={() => null}
        breadcrumb={{ routes }}
        title="Добавление нового марафона"
      />
      <Content style={{ background: '#fff', padding: 24 }}>
        <Form onSubmit={onSubmit}>
          <Form.Item label="Название марафона">
            <Input
              type="text"
              placeholder="Введите название марафона"
              name="maraphonName"
              value={state.maraphonName}
              onChange={(e) => handleInputChange(e)}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="Описание марафона">
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
            />
          </Form.Item>
          <Form.Item label="Длительность марафона">
            <Input
              type="text"
              placeholder="Введите количество дней"
              name="maraphonDuration"
              value={state.maraphonDuration}
              onChange={(e) => handleInputChange(e)}
              style={{ width: '200px' }}
              addonAfter="дней"
            />
          </Form.Item>
          <Form.Item label="Программа марафона">
            <Input
              type="text"
              placeholder="Введите программу"
              name="maraphonProgramm"
              value={state.maraphonProgramm}
              onChange={(e) => handleInputChange(e)}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="Категория марафона">
            <Input
              type="text"
              placeholder="Введите цель"
              name="maraphonCategory"
              value={state.maraphonCategory}
              onChange={(e) => handleInputChange(e)}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="Цель марафона">
            <Select
              mode="multiple"
              name="maraphonGoal"
              style={{ width: '100%' }}
              placeholder="Please select"
              // defaultValue={['a10', 'c12']}
              value={state.maraphonGoal}
              onChange={handleSelectChange}
            >
              {children}
            </Select>
          </Form.Item>
          <Form.Item label="Дата старта марафона">
            <DatePicker
              name="maraphonStartDate"
              defaultPickerValue={state.maraphonStartDate}
              onChange={handleDateChange}
              placeholder="Дата старта"
            />
          </Form.Item>
          <Form.Item label="Стоимость марафона">
            <Input
              type="text"
              placeholder="Введите цену"
              name="maraphonPrice"
              value={state.maraphonPrice}
              onChange={(e) => handleInputChange(e)}
              style={{ width: '200px' }}
              addonAfter="рублей"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Добавить марафон
              </Button>
        </Form>
      </Content>
    </Admin>
  );
}

export default Add;