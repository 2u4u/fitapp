import React, { useState } from 'react';
import uniqueId from '../../utils/uniqueId';
import { Form, Input, Icon, Checkbox, Button, Radio, Card, Layout, Row, Col } from 'antd';
const { Content } = Layout;
const { TextArea, } = Input;

function AddTrainingForm(props) {
  const [state, setState] = useState({
    type: "text",
    trainings: [{
      id: uniqueId("training"),
      trainingName: "",
      trainingNameShow: true,
      trainingOverview: "",
      tasks: [{
        id: uniqueId("task"),
        type: "",
        text: "",
        img: "",
        video: ""
      }],
    }],
  });

  const handleTrainingChange = (e, trainingIndex) => {
    let { name, value } = e.target;
    setState(state => ({
      ...state, trainings: state.trainings.map((training) => {
        if (trainingIndex === training.id) {
          training[name] = value
        }
        return training
      })
    }));
  }

  const handleTrainingToggle = (e, trainingIndex) => {
    setState(state => ({
      ...state, trainings: state.trainings.map((training) => {
        if (trainingIndex === training.id) {
          training.trainingNameShow = !training.trainingNameShow
        }
        return training
      })
    }));
  }

  // const handleAddTraining = (e) => {
  //   setState(state => ({
  //     ...state, trainings: [...state.trainings, {
  //       id: uniqueId("training"),
  //       trainingName: "",
  //       trainingNameShow: true,
  //       trainingOverview: "",
  //       tasks: [{
  //         id: uniqueId("task"),
  //         type: "",
  //         text: "",
  //         img: "",
  //         video: ""
  //       }],
  //     }]
  //   }));
  // }

  const handleAddTask = (e, trainingIndex) => {
    setState(state => ({
      ...state,
      trainings: [...state.trainings.map((training) => {
        if (trainingIndex === training.id) {
          training.tasks = [
            ...training.tasks,
            {
              id: uniqueId("task"),
              type: "",
              text: "",
              img: "",
              video: ""
            }
          ]
        }
        return training
      })]
    }));
  }

  // const handleTaskChange = (e, trainingIndex, taskIndex) => {
  //   let { name, value } = e.target;
  //   setState(state => ({
  //     ...state, trainings: state.trainings.map((training, trainingId) => {
  //       if (trainingIndex === training.id) {
  //         training.trainingNameShow = !training.trainingNameShow
  //       }
  //       return training
  //     })
  //   }));
  // }

  // const textAnswer = (
  //   <Form.Item label="Ваш текстовый ответ">
  //     <Input placeholder="Введите ответ" />
  //   </Form.Item>
  // )

  // const photoAnswer = (
  //   <Upload>
  //     <Button>
  //       <Icon type="upload" /> Загрузить фотографию
  //     </Button>
  //   </Upload>
  // )

  // const videoAnswer = (
  //   <Upload>
  //     <Button>
  //       <Icon type="upload" /> Загрузить видео
  //     </Button>
  //   </Upload>
  // )

  // const type = (state.type === "text") ? { textAnswer } : (state.type === "photo") ? { photoAnswer } : { videoAnswer }

  // let id = 0;

  // function callback(key) {
  //   console.log(key);
  // }

  return (
    <Form>
      {state.trainings.map((training, trainingIndex) => {
        return (
          <React.Fragment>
            <Form.Item label="Введите название тренировки">
              <Input
                type="text"
                placeholder="Введите название тренировки"
                name="trainingName"
                value={training.trainingName}
                onChange={(e) => handleTrainingChange(e, training.id)}
                style={{ width: '100%' }}
                disabled={!training.trainingNameShow}
              />
            </Form.Item>
            <Form.Item style={{ marginTop: "-2em" }}>
              <Checkbox
                checked={!training.trainingNameShow}
                onChange={(e) => handleTrainingToggle(e, training.id)}
              >Не показывать название тренировки</Checkbox>
            </Form.Item>
            <Form.Item label="Введите общее описание тренировки">
              <TextArea
                rows={6}
                name="trainingOverview"
                value={training.trainingOverview}
                onChange={(e) => handleTrainingChange(e, training.id)}
              />
            </Form.Item>
            {training.tasks.map((task, taskId) => {
              return (<Card style={{ width: "100%" }} key={taskId}>
                <Form.Item label={"Введите описание задания №" + (taskId + 1)}>
                  <TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Выберите тип задания. Ученик должен">
                  <Radio.Group defaultValue="text" buttonStyle="solid">
                    <Radio.Button value="text">Ввести текстовый ответ</Radio.Button>
                    <Radio.Button value="photo">Загрузить фото ответ</Radio.Button>
                    <Radio.Button value="video">Загрузить видео ответ</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Подтверждение ответа">
                  <Radio.Group defaultValue="manualaccept" buttonStyle="solid">
                    <Radio.Button value="autoaccept">Автоматически принимать ответ</Radio.Button>
                    <Radio.Button value="manualaccept">Необходима проверка тренером</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Card>)
            })}
            <Form.Item>
              <Button type="dashed" onClick={e => handleAddTask(e, training.id)} style={{ width: '100%' }}>
                <Icon type="plus" /> Добавить еще ответ к заданию
                </Button>
            </Form.Item>
          </React.Fragment>
        )
      })}
    </Form>
  );
}

export default AddTrainingForm;