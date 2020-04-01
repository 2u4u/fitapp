import React, { useState } from 'react';
import {
  // useDispatch, 
  useSelector
} from "react-redux";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import moment from 'moment';

// import { addFlow } from "../../actions/flowAction";
import { Button, List, Icon, Form, Alert, Radio, Input } from 'antd';
const { Search } = Input;

function AddQuestionForm(props) {
  // const dispatch = useDispatch();
  // const userId = useSelector(state => state.auth.user.id);
  // const marathonId = useSelector(state => state.marathon.detailed_marathon._id);
  let error = {};
  error = useSelector(state => state.error);
  const loading = useSelector(state => state.flow.loading);
  const notification = useSelector(state => state.flow.notification);

  let { flow } = props;
  let handle = flow ? flow.handle : undefined;
  let buttonText = handle ? "Изменить вопрос" : "Добавить вопрос"
  let buttonLoading = handle ? "Изменение вопроса" : "Добавление вопроса"

  const [state, setState] = useState({
    question: "",
    type: "text",
    options: [],
    search: "",
    optionError: ""
    // flowId: flow ? flow._id : "",
    // flowName: flow ? flow.name : "",
    // flowDuration: flow ? flow.duration : "",
    // flowStartDate: flow ? moment(flow.start_date, 'YYYY/MM/DD') : undefined,
    // flowStartTime: flow ? moment(flow.start_time, 'HH:mm:ss') : undefined,// moment('09:00:00', 'HH:mm:ss'),
    // flowPrice: flow ? flow.price : "",
    // flowFreeCheckbox: flow ? flow.free : false,
  });

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    delete error[name];
    setState(state => ({ ...state, [name]: value }));
  }

  const handleOptionAdd = (value) => {
    setState(state => ({ ...state, search: "" }));
    if (!value.length) {
      setState(state => ({ ...state, optionError: "Введено пустое значение" }));
      setTimeout(() =>
        setState(state => ({ ...state, optionError: "" }))
        , 1000);
      return
    }
    if (state.options.indexOf(value) < 0) {
      setState(state => ({ ...state, options: [...state.options, value] }));
    } else {
      setState(state => ({ ...state, optionError: "Такой вариант уже есть в списке" }));
      setTimeout(() =>
        setState(state => ({ ...state, optionError: "" }))
        , 1000);
    }
  }

  const onDeleteOption = (value) => {
    setState(state => ({
      ...state, options: state.options.filter(item => item !== value)
    }));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    // const newFlow = {
    //   id: state.flowId, //when edit
    //   user: userId,
    //   marathon: marathonId,
    //   name: state.flowName,
    //   duration: state.flowDuration,
    //   start_date: state.flowStartDate,
    //   start_time: state.flowStartTime,
    //   price: state.flowPrice,
    //   free: state.flowFreeCheckbox
    // };
    // dispatch(addFlow(newFlow, handle));
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Item
        label="Текст вопроса"
        validateStatus={error.question ? "error" : ""}
        help={error.question ? error.question : ""}
        required={true}
      >
        <Input
          type="text"
          placeholder="Введите текст вопроса"
          name="question"
          value={state.question}
          onChange={(e) => handleInputChange(e)}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item label="Варианты ответа">
        <Radio.Group name="type" value={state.type} onChange={(e) => handleInputChange(e)} defaultValue="text">
          <Radio.Button value="text">Любой текст</Radio.Button>
          <Radio.Button value="select">Выбор из списка</Radio.Button>
        </Radio.Group>
      </Form.Item>
      {state.type === "text" ?
        "" :
        (<React.Fragment>
          {state.options.length > 0 ?
            (<React.Fragment>
              <List
                size="small"
                dataSource={state.options}
                header={<div>Ваш список вариантов</div>}
                bordered
                style={{ marginBottom: "20px" }}
                renderItem={item =>
                  <List.Item style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {item}
                    <Icon type="delete" onClick={() => onDeleteOption(item)} />
                  </List.Item>}
              />
              {state.optionError ?
                <Alert style={{ margin: "20px 0" }} message={state.optionError} type="error" /> : ""
              }
            </React.Fragment>) :
            <List
              size="small"
              dataSource={[]}
              header={<div>Ваш список пока пуст</div>}
              bordered
              style={{ marginBottom: "20px" }}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          }
          <Form.Item
            label="Добавить вариант в список"
            validateStatus={error.options ? "error" : ""}
            help={error.options ? error.options : ""}
            required={true}
          >
            <Search
              type="text"
              name="search"
              placeholder="Введите текст варианта"
              enterButton="+"
              value={state.search}
              onChange={(e) => handleInputChange(e)}
              onSearch={(value) => handleOptionAdd(value)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </React.Fragment>)

      }
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

export default AddQuestionForm;