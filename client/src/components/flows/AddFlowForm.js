import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import moment from 'moment';

import { addFlow } from "../../actions/flowAction";
import { Button, Row, Col, Form, Alert, TimePicker, Input, Checkbox, DatePicker } from 'antd';

function AddFlowForm(props) {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);
  const marathonId = useSelector(state => state.marathon.detailed_marathon._id);
  let error = {};
  error = useSelector(state => state.error);
  const loading = useSelector(state => state.flow.loading);
  const notification = useSelector(state => state.flow.notification);

  let { flow } = props;
  let handle = flow ? flow.handle : undefined;
  let buttonText = handle ? "Изменить поток" : "Добавить поток"
  let buttonLoading = handle ? "Изменение потока" : "Добавление потока"

  const [state, setState] = useState({
    flowId: flow ? flow._id : "",
    flowName: flow ? flow.name : "",
    flowDuration: flow ? flow.duration : "",
    flowStartDate: flow ? moment(flow.start_date, 'YYYY/MM/DD') : undefined,
    flowStartTime: flow ? moment(flow.start_time, 'HH:mm:ss') : undefined,// moment('09:00:00', 'HH:mm:ss'),
    flowPrice: flow ? flow.price : "",
    flowFreeCheckbox: flow ? flow.free : false,
  });


  const handleInputChange = (e) => {
    let { name, value } = e.target;
    delete error[name];
    setState(state => ({ ...state, [name]: value }));
  }

  const handleDateChange = (date) => {
    delete error["flowStartDate"];
    setState(state => ({ ...state, "flowStartDate": date }));
  }

  const handleTimeChange = (time) => {
    delete error["flowStartTime"];
    setState(state => ({ ...state, "flowStartTime": time }));
  }

  const handleCheckboxChange = (e) => {
    setState(state => ({ ...state, "flowPrice": "" }))
    setState(state => ({ ...state, "flowFreeCheckbox": e.target.checked }))
  }

  const disabledDate = (current) => {
    return current.valueOf() < Date.now();
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const newFlow = {
      id: state.flowId, //when edit
      user: userId,
      marathon: marathonId,
      name: state.flowName,
      duration: state.flowDuration,
      start_date: state.flowStartDate,
      start_time: state.flowStartTime,
      price: state.flowPrice,
      free: state.flowFreeCheckbox
    };
    dispatch(addFlow(newFlow, handle));
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Item
        label="Название потока"
        validateStatus={error.flowName ? "error" : ""}
        help={error.flowName ? error.flowName : ""}
        required={true}
      >
        <Input
          type="text"
          placeholder="Введите название потока"
          name="flowName"
          value={state.flowName}
          onChange={(e) => handleInputChange(e)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        label="Длительность потока"
        validateStatus={error.flowDuration ? "error" : ""}
        help={error.flowDuration ? error.flowDuration : ""}
        required={true}
      >
        <Input
          type="text"
          placeholder="Введите количество дней"
          name="flowDuration"
          value={state.flowDuration}
          onChange={(e) => handleInputChange(e)}
          style={{ width: '200px' }}
          addonAfter="дней"
        />
      </Form.Item>
      <Form.Item
        label="Дата старта потока"
        validateStatus={error.flowStartDate ? "error" : ""}
        help={error.flowStartDate ? error.flowStartDate : ""}
        required={true}
      >
        <DatePicker
          name="flowStartDate"
          defaultValue={state.flowStartDate}
          defaultPickerValue={state.flowStartDate}
          onChange={handleDateChange}
          placeholder="Дата старта"
          disabledDate={disabledDate}
        />
      </Form.Item>
      <Form.Item
        label="Время старта потока (МСК)"
        validateStatus={error.flowStartTime ? "error" : ""}
        help={error.flowStartTime ? error.flowStartTime : ""}
      >
        <TimePicker
          name="flowStartTime"
          onChange={handleTimeChange}
          allowClear={false}
          defaultOpenValue={state.flowStartTime}
          defaultValue={state.flowStartTime}
          placeholder="Время старта"
          style={{ width: "171px" }}
        />
      </Form.Item>
      <Form.Item
        label="Стоимость потока"
        validateStatus={error.flowPrice ? "error" : ""}
        help={error.flowPrice ? error.flowPrice : ""}
        required={true}
      >
        <Row>
          <Col span={12}>
            <Input
              type="text"
              placeholder="Введите цену"
              name="flowPrice"
              value={state.flowPrice}
              onChange={(e) => handleInputChange(e)}
              style={{ width: '200px' }}
              addonAfter="рублей"
              disabled={state.flowFreeCheckbox}
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

export default AddFlowForm;