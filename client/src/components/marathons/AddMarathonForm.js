import React, { useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { useDispatch, useSelector } from "react-redux";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { addMarathon } from "../../actions/marathonAction";
import { Button, Form, Alert, Input, Select } from 'antd';
const { Option } = Select;

function AddMarathonForm(props) {
  const dispatch = useDispatch();
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
    marathonDescription: marathon ? marathon.description : "",
    marathonGoals: marathon ? marathon.goals : ['a10', 'c12'],
    marathonCategory: marathon ? marathon.category : ""
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

  const onSubmit = (e) => {
    e.preventDefault();
    const newMarathon = {
      id: state.marathonId, //when edit
      user: userId,
      name: state.marathonName,
      description: JSON.stringify(convertToRaw(editorState.editorState.getCurrentContent())),
      category: state.marathonCategory,
      goals: state.marathonGoals,
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
          placeholder="Выберите цель марафона"
          value={state.marathonGoals}
          onChange={handleSelectChange}
        >
          {children}
        </Select>
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