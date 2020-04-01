import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  showMarathonFlows
  // , deleteFlow 
} from "../../actions/flowAction";

import { Drawer, Layout, Button } from 'antd';
import AddQuestionForm from "./AddQuestionForm";
const { Content } = Layout;

function Questions(props) {
  const dispatch = useDispatch();
  const marathonId = useSelector(state => state.marathon.detailed_marathon._id);
  // const marathonHandle = useSelector(state => state.marathon.detailed_marathon.handle);
  // const flows = useSelector(state => state.flow.flows);

  const [state, setState] = useState({
    visible: false,
  });

  const showAddQuestion = () => {
    setState({ visible: true })
  }

  const onCloseAddQuestion = () => {
    setState({ visible: false })
  }

  // const onDeleteFlow = (flowId, marathonId) => {
  //   dispatch(deleteFlow(flowId, marathonId));
  // }

  useEffect(() => {
    if (marathonId) dispatch(showMarathonFlows(marathonId));
  }, [marathonId, dispatch]);

  return (
    <React.Fragment>
      <Content style={{ background: '#fff', padding: 24 }}>
        <div style={{ marginBottom: "20px" }}>Анкета еще не добавлена</div>
        <Button type="primary" onClick={showAddQuestion}>Добавить анкету</Button>
      </Content>
      <Drawer
        title="Добавление вопроса для анкеты потока"
        placement="right"
        closable={true}
        width={520}
        onClose={onCloseAddQuestion}
        visible={state.visible}
      >
        <AddQuestionForm />
      </Drawer>
    </React.Fragment>
  );
}

export default Questions;