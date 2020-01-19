import React, { useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { useDispatch, useSelector } from "react-redux";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import moment from 'moment';

// import { stateToHTML } from 'draft-js-export-html';

import { addMarathon } from "../../actions/marathonAction";
import { Button, Row, Col, Form, Alert, TimePicker, Input, Select, Checkbox, DatePicker } from 'antd';

const { Option } = Select;

function AddMarathonForm(props) {
  const dispatch = useDispatch();
  // const name = useSelector(state => state.auth.user.name);
  const userId = useSelector(state => state.auth.user.id);
  let error = {};
  error = useSelector(state => state.error);
  const loading = useSelector(state => state.marathon.loading);
  const notification = useSelector(state => state.marathon.notification);

  let { marathon } = props;
  let handle = marathon ? marathon.handle : undefined;
  let buttonText = handle ? "Изменить марафона" : "Добавить марафона"
  let buttonLoading = handle ? "Изменение марафона" : "Добавление марафона"

  const [state, setState] = useState({
    marathonId: marathon ? marathon._id : "",
    marathonName: marathon ? marathon.name : "",
    marathonNameCheckbox: marathon ? marathon.free : false,
    marathonDescription: marathon ? marathon.description : "",
    marathonDuration: marathon ? marathon.duration : "",
    marathonGoals: marathon ? marathon.goals : ['a10', 'c12'],
    marathonCategory: marathon ? marathon.category : "",
    marathonStartDate: marathon ? moment(marathon.start_date, 'YYYY/MM/DD') : undefined,
    marathonStartTime: marathon ? moment(marathon.start_time, 'HH:mm:ss') : undefined,// moment('09:00:00', 'HH:mm:ss'),
    marathonPrice: marathon ? marathon.price : "",
  });

  const editorContent = marathon ? EditorState.createWithContent(convertFromRaw(JSON.parse(marathon.description))) : EditorState.createEmpty();

  const [editorState, setEditorState] = useState(
    { editorState: editorContent }
  );

  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  }

  const handleEditorChange = (editorState) => {
    setEditorState({ editorState });
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    delete error[name];
    setState(state => ({ ...state, [name]: value }));
  }

  const handleSelectChange = (value) => {
    delete error["marathonGoals"];
    setState(state => ({ ...state, "marathonGoals": value }));
  }

  const handleDateChange = (date, dateString) => {
    delete error["marathonStartDate"];
    setState(state => ({ ...state, "marathonStartDate": date }));
  }

  const handleTimeChange = (time, timeString) => {
    delete error["marathonStartTime"];
    setState(state => ({ ...state, "marathonStartTime": time }));
  }

  const handleCheckboxChange = (e) => {
    setState(state => ({ ...state, "marathonPrice": "" }))
    setState(state => ({ ...state, "marathonNameCheckbox": e.target.checked }))
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current.valueOf() < Date.now();
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const newMarathon = {
      id: state.marathonId, //when edit
      user: userId,
      name: state.marathonName,
      description: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      duration: state.marathonDuration,
      category: state.marathonCategory,
      goals: state.marathonGoals,
      start_date: state.marathonStartDate,
      price: state.marathonPrice,
      start_time: state.marathonStartTime,
      free: state.marathonNameCheckbox
    };
    dispatch(addMarathon(newMarathon, handle));
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Item
        label="Название марафона"
        validateStatus={error.marathonName ? "error" : ""}
        help={error.marathonName ? error.marathonName : ""}
        required={true}
      >
        <Input
          type="text"
          placeholder="Введите название марафона"
          name="marathonName"
          value={state.marathonName}
          onChange={(e) => handleInputChange(e)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        label="Описание марафона"
        validateStatus={error.marathonDescription ? "error" : ""}
        help={error.marathonDescription ? error.marathonDescription : ""}
        required={true}
      >
        <Editor
          editorState={editorState.editorState}
          onEditorStateChange={handleEditorChange}
        />
      </Form.Item>
      <Form.Item
        label="Длительность марафона"
        validateStatus={error.marathonDuration ? "error" : ""}
        help={error.marathonDuration ? error.marathonDuration : ""}
        required={true}
      >
        <Input
          type="text"
          placeholder="Введите количество дней"
          name="marathonDuration"
          value={state.marathonDuration}
          onChange={(e) => handleInputChange(e)}
          style={{ width: '200px' }}
          addonAfter="дней"
        />
      </Form.Item>
      <Form.Item
        label="Категория марафона"
        validateStatus={error.marathonCategory ? "error" : ""}
        help={error.marathonCategory ? error.marathonCategory : ""}
        required={true}
      >
        <Input
          type="text"
          placeholder="Введите цель"
          name="marathonCategory"
          value={state.marathonCategory}
          onChange={(e) => handleInputChange(e)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        label="Цель марафона"
        validateStatus={error.marathonGoals ? "error" : ""}
        help={error.marathonGoals ? error.marathonGoals : ""}
        required={true}
      >
        <Select
          mode="multiple"
          name="marathonGoals"
          style={{ width: '100%' }}
          placeholder="Please select"
          // defaultValue={['a10', 'c12']}
          value={state.marathonGoals}
          onChange={handleSelectChange}
        >
          {children}
        </Select>
      </Form.Item>
      <Form.Item
        label="Дата старта марафона"
        validateStatus={error.marathonStartDate ? "error" : ""}
        help={error.marathonStartDate ? error.marathonStartDate : ""}
        required={true}
      >
        <DatePicker
          name="marathonStartDate"
          defaultValue={state.marathonStartDate}
          defaultPickerValue={state.marathonStartDate}
          onChange={handleDateChange}
          placeholder="Дата старта"
          disabledDate={disabledDate}
        // showTime
        // placeholder="Выбрать время старта"
        // onOk={onOk}
        />
      </Form.Item>
      <Form.Item
        label="Время старта марафона (МСК)"
        validateStatus={error.marathonStartTime ? "error" : ""}
        help={error.marathonStartTime ? error.marathonStartTime : ""}
      >
        <TimePicker
          name="marathonStartTime"
          onChange={handleTimeChange}
          allowClear={false}
          defaultOpenValue={state.marathonStartTime}
          defaultValue={state.marathonStartTime}
          placeholder="Время старта"
          style={{ width: "171px" }}
        />
      </Form.Item>
      <Form.Item
        label="Стоимость марафона"
        validateStatus={error.marathonPrice ? "error" : ""}
        help={error.marathonPrice ? error.marathonPrice : ""}
        required={true}
      >
        <Row>
          <Col span={12}>
            <Input
              type="text"
              placeholder="Введите цену"
              name="marathonPrice"
              value={state.marathonPrice}
              onChange={(e) => handleInputChange(e)}
              style={{ width: '200px' }}
              addonAfter="рублей"
              disabled={state.marathonNameCheckbox}
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
        {loading ? buttonLoading : buttonText}
      </Button>
    </Form>
  );
}

export default AddMarathonForm;