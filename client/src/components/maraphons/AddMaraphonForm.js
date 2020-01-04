import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { useDispatch, useSelector } from "react-redux";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import moment from 'moment';

// import { stateToHTML } from 'draft-js-export-html';

import { addMaraphon } from "../../actions/maraphonAction";
import { Button, Row, Col, Form, Alert, TimePicker, Input, Select, Checkbox, DatePicker } from 'antd';

const { Option } = Select;

function AddMaraphonForm(props) {
  const dispatch = useDispatch();
  // const name = useSelector(state => state.auth.user.name);
  const userId = useSelector(state => state.auth.user.id);
  let error = {};
  error = useSelector(state => state.error);
  const loading = useSelector(state => state.maraphon.loading);
  const notification = useSelector(state => state.maraphon.notification);

  const [state, setState] = useState({
    maraphonId: "",
    maraphonName: "",
    maraphonNameCheckbox: false,
    maraphonDescription: "",
    maraphonDuration: "",
    maraphonGoal: ['a10', 'c12'],
    maraphonProgramm: "",
    maraphonCategory: "",
    maraphonStartDate: "",
    maraphonStartTime: "",
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
    setEditorState(editorState);
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    delete error[name];
    setState(state => ({ ...state, [name]: value }));
  }

  const handleSelectChange = (value) => {
    delete error["maraphonGoal"];
    setState(state => ({ ...state, "maraphonGoal": value }));
  }

  const handleDateChange = (date, dateString) => {
    delete error["maraphonStartDate"];
    setState(state => ({ ...state, "maraphonStartDate": date }));
  }

  const handleCheckboxChange = (e) => {
    setState(state => ({ ...state, "maraphonPrice": "" }))
    setState(state => ({ ...state, "maraphonNameCheckbox": e.target.checked }))
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current.valueOf() < Date.now();
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
      start_time: state.maraphonStartTime,
      free: state.maraphonNameCheckbox
    };
    dispatch(addMaraphon(newMaraphon));
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Item
        label="Название марафона"
        validateStatus={error.maraphonName ? "error" : ""}
        help={error.maraphonName ? error.maraphonName : ""}
        required={true}
      >
        <Input
          type="text"
          placeholder="Введите название марафона"
          name="maraphonName"
          value={state.maraphonName}
          onChange={(e) => handleInputChange(e)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        label="Описание марафона"
        validateStatus={error.maraphonDescription ? "error" : ""}
        help={error.maraphonDescription ? error.maraphonDescription : ""}
        required={true}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
        />
      </Form.Item>
      <Form.Item
        label="Длительность марафона"
        validateStatus={error.maraphonDuration ? "error" : ""}
        help={error.maraphonDuration ? error.maraphonDuration : ""}
        required={true}
      >
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
      <Form.Item
        label="Категория марафона"
        validateStatus={error.maraphonCategory ? "error" : ""}
        help={error.maraphonCategory ? error.maraphonCategory : ""}
        required={true}
      >
        <Input
          type="text"
          placeholder="Введите цель"
          name="maraphonCategory"
          value={state.maraphonCategory}
          onChange={(e) => handleInputChange(e)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        label="Цель марафона"
        validateStatus={error.maraphonGoal ? "error" : ""}
        help={error.maraphonGoal ? error.maraphonGoal : ""}
        required={true}
      >
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
      <Form.Item
        label="Дата старта марафона"
        validateStatus={error.maraphonStartDate ? "error" : ""}
        help={error.maraphonStartDate ? error.maraphonStartDate : ""}
        required={true}
      >
        <DatePicker
          name="maraphonStartDate"
          defaultPickerValue={state.maraphonStartDate}
          onChange={handleDateChange}
          placeholder="Дата старта"
          disabledDate={disabledDate}
        />
      </Form.Item>
      <Form.Item
        label="Время старта марафона (МСК)"
        validateStatus={error.maraphonStartTime ? "error" : ""}
        help={error.maraphonStartTime ? error.maraphonStartTime : ""}
      >
        <TimePicker
          name="maraphonStartTime"
          onChange={handleDateChange}
          defaultOpenValue={moment('09:00:00', 'HH:mm:ss')}
          defaultValue={moment('09:00:00', 'HH:mm:ss')}
          placeholder="Время старта"
          style={{ width: "171px" }}
        />
      </Form.Item>
      <Form.Item
        label="Стоимость марафона"
        validateStatus={error.maraphonPrice ? "error" : ""}
        help={error.maraphonPrice ? error.maraphonPrice : ""}
        required={true}
      >
        <Row>
          <Col span={12}>
            <Input
              type="text"
              placeholder="Введите цену"
              name="maraphonPrice"
              value={state.maraphonPrice}
              onChange={(e) => handleInputChange(e)}
              style={{ width: '200px' }}
              addonAfter="рублей"
              disabled={state.maraphonNameCheckbox}
            />
          </Col>
          <Col span={12}>
            <Checkbox onChange={(e) => handleCheckboxChange(e)}>
              Бесплатный
              </Checkbox>
          </Col>
        </Row>
      </Form.Item>
      {Object.entries(error).length === 0 && error.constructor === Object ?
        "" : <div style={{ margin: "20px 0" }}><Alert message="Проверьте форму на ошибки" type="error" /></div>
      }
      {notification.active ?
        <div style={{ margin: "20px 0" }}><Alert message={notification.text} type="success" /></div> : ""
      }
      <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
        {loading ? "Добавление марафона" : "Добавить марафон"}
      </Button>
    </Form>
  );
}

export default AddMaraphonForm;