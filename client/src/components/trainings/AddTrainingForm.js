import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import uniqueId from '../../utils/uniqueId';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { addTraining } from "../../actions/trainingAction";
import { Form, Input, Alert, Icon, Checkbox, Button, Radio, Card } from 'antd';
const { TextArea } = Input;

function AddTrainingForm(props) {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);
  const marathonId = useSelector(state => state.marathon.detailed_marathon._id);
  const flowId = useSelector(state => state.flow.detailed_flow._id);
  let error = {};
  error = useSelector(state => state.error);
  const loading = useSelector(state => state.training.loading);
  const notification = useSelector(state => state.training.notification);

  let { training } = props;

  const [state, setState] = useState({
    trainingId: training ? training._id : "",
    trainingName: training ? training.name : "",
    trainingNameShow: training ? training.show_name : true,
    tasks: training ? training.tasks : [],
  });

  const editorContent = training ? EditorState.createWithContent(convertFromRaw(JSON.parse(training.description))) : EditorState.createEmpty();

  const [editorState, setEditorState] = useState(
    { editorState: editorContent }
  );

  const handleEditorChange = (editorState) => {
    delete error["trainingDescription"];
    setEditorState({ editorState });
  }

  const handleTrainingInput = (e) => {
    let { name, value } = e.target;
    delete error[name];
    setState(state => ({ ...state, [name]: value }));
  }

  const handleTrainingChecked = (e) => {
    setState(state => ({ ...state, "trainingNameShow": !e.target.checked }))
  }

  const handleTaskChange = (e, taskIndex) => {
    let { name, value } = e.target;
    setState(state => ({
      ...state, tasks: state.tasks.map((task) => {
        if (taskIndex === task.id) {
          task[name] = value
        }
        return task
      })
    }));
  }

  const handleAddTask = (e) => {
    setState(state => ({
      ...state, tasks: [...state.tasks, {
        id: uniqueId("task"),
        text: "",
        type: "text",
        approval: "manualaccept"
      }]
    }));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const newTraining = {
      marathon: marathonId,
      flow: flowId,
      user: userId,
      name: state.trainingName,
      show_name: state.trainingNameShow,
      description: JSON.stringify(convertToRaw(editorState.editorState.getCurrentContent())),
      description_has_text: editorState.editorState.getCurrentContent().hasText(),
      tasks: state.tasks
    };
    dispatch(addTraining(newTraining));
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Item
        label="Введите название тренировки"
        validateStatus={error.trainingName ? "error" : ""}
        help={error.trainingName ? error.trainingName : ""}
        required={true}
      >
        <Input
          type="text"
          placeholder="Введите название тренировки"
          name="trainingName"
          value={state.trainingName}
          onChange={(e) => handleTrainingInput(e)}
          style={{ width: '100%' }}
          disabled={!state.trainingNameShow}
        />
      </Form.Item>
      <Form.Item style={{ marginTop: "-1em" }}>
        <Checkbox
          onChange={(e) => handleTrainingChecked(e)}
        >Не показывать название тренировки</Checkbox>
      </Form.Item>
      <Form.Item
        label="Введите общее описание тренировки"
        validateStatus={error.trainingDescription ? "error" : ""}
        help={error.trainingDescription ? error.trainingDescription : ""}
        required={true}
      >
        <Editor
          editorState={editorState.editorState}
          onEditorStateChange={handleEditorChange}
        />
      </Form.Item>
      {state.tasks.map((task, taskId) => {
        // console.log("task", task)
        return (<Card style={{ width: "100%", marginBottom: "20px" }} key={taskId}>
          <Form.Item label={"Введите описание задания №" + (taskId + 1)}>
            <TextArea rows={3} name="text" value={task.text} onChange={(e) => handleTaskChange(e, task.id)} />
          </Form.Item>
          <Form.Item label="Выберите тип задания. Ученик должен ответ содержащий">
            <Radio.Group name="type" value={task.type} onChange={(e) => handleTaskChange(e, task.id)} defaultValue="text" buttonStyle="solid">
              <Radio.Button value="text">Текст</Radio.Button>
              <Radio.Button value="photo">Фото</Radio.Button>
              <Radio.Button value="video">Видео</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Подтверждение ответа">
            <Radio.Group name="approval" value={task.approval} onChange={(e) => handleTaskChange(e, task.id)} defaultValue="manualaccept" buttonStyle="solid">
              <Radio.Button value="autoaccept">Автоматически принимать ответ</Radio.Button>
              <Radio.Button value="manualaccept">Необходима проверка тренером</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Card>)
      })}
      {
        Object.entries(error).length === 0 && error.constructor === Object ?
          "" : <div style={{ margin: "20px 0" }}><Alert message="Проверьте форму на ошибки" type="error" /></div>
      }
      {
        notification.active ?
          <div style={{ margin: "20px 0" }}><Alert message={notification.text} type="success" /></div> : ""
      }
      <Button type="dashed" onClick={e => handleAddTask(e)} style={{ width: '100%', marginBottom: "20px" }}>
        <Icon type="plus" /> Добавить ответ к заданию
      </Button>
      <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
        {loading ? "Добавление тренировки" : "Добавить тренировку"}
      </Button>
    </Form >
  );
}

export default AddTrainingForm;