import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { sendMessage, getChatMessages } from "../../actions/chatAction";
import { getAllUsers } from "../../actions/userAction"
import { useHistory } from "react-router-dom";
import { startChat } from "../../actions/chatAction"
import socketIOClient from "socket.io-client";
import { Col, Row, Card, Input, Avatar } from 'antd';
const { Meta } = Card;
const { Search } = Input;

let socket = (process.env.NODE_ENV === "production") ?
  socketIOClient.connect(`https://sooluk.herokuapp.com/`) :
  socketIOClient.connect(`https://localhost:5000`);

function Chat() {
  const param = useParams();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);
  const userName = useSelector(state => state.auth.user.name);
  const usersList = useSelector(state => state.user.users);
  const messages = useSelector(state => state.chats.messages);
  const history = useHistory();
  const chatHandle = param.chatId;

  const [state, setState] = useState({
    messages: [],
    value: ""
  })

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];


  const typeMessage = (e) => {
    const { value } = e.target;
    setState(state => ({ ...state, value }));
  }

  const submitMessage = (message) => {
    state.messages.push(message);
    socket.emit("send message", { message, userId, chat: chatHandle });
    setState(state => ({ ...state, messages: state.messages, value: "" }));
    // console.log("chat, text, sender",chatHandle, message, sender )
    dispatch(sendMessage({ text: message, sender: userId, chat: chatHandle }, chatHandle));
  }

  const initChat = (name) => {
    dispatch(startChat([name, userName], history));
  }

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getChatMessages(chatHandle));

  }, [state.messages, data.msg, dispatch, chatHandle]);

  return (
    <div>
      <Row type="flex" >
        <Col span={8} >
          <div>
            <div>
              <Search
                style={{ width: "100%" }}
                placeholder="input search text"
                onChange={(text) => console.log(text)}
                onSearch={text => console.log(text)}
              />
            </div>
            <div>
              {usersList.filter(user => user.name !== userName).map(user => {
                return (
                  <Card
                    onClick={() => initChat(user.name)}
                    key={user._id}
                  >
                    <Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                      title={user.name}
                      description="Last message will be here"
                    />
                  </Card>
                )
              })}
            </div>
          </div>
        </Col>
        <Col span={16}>
          <div >
            {messages.map((message, index) => {
              return (<p key={index}><b>{message.user}: </b>{message.text}</p>)
            })}
          </div>
          <Search
            placeholder="Message"
            value={state.value}
            onChange={text => typeMessage(text)}
            onSearch={text => submitMessage(text)}
          />
        </Col>
      </Row>
    </div>
  )
}
export default Chat;