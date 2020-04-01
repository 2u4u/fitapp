import React, {
  useRef,
  // useEffect 
} from 'react';
import moment from 'moment';
import 'moment/locale/ru';
import styles from "./styles.module.scss";
moment.locale('ru');

function Messages(props) {
  const messagesBox = useRef(null);
  const { userName, chatMate, messages, inputValue, chatHandle, onUpdateReadMessages, onSubmitMessage, onTypeMessage } = props;

  // useEffect(() => {
  // if (messages) {
  //   messagesBox.current.scrollIntoView({ behavior: "smooth" });
  // }
  // }, [messages]);

  const checkDate = (date) => {
    if (moment(date).isSame(moment(), 'day')) {
      return moment(date).format('hh:mm');
    } else if (moment(date).isSame(moment(), 'week')) {
      return moment(date).format('dddd, hh:mm');
    } else if (moment(date).isSame(moment(), 'year')) {
      return moment(date).format('D MMM, hh:mm');
    } else {
      return moment(date).format('D MMM YYYY, hh:mm');
    }
  }

  return (
    <div className={styles.messages}>
      <div className={styles.messages_header}>
        <div className={styles.messages_header_user}>
          <div className={styles.messages_header_avatar}>
            <img alt="avatar" src="http://angular-material.fusetheme.com/assets/images/avatars/profile.jpg" />
          </div>
          <div>
            <p className={styles.messages_header_username}>{chatMate}</p>
          </div>
        </div>
      </div>
      <div className={styles.messages_box} style={{ overflow: "scroll", height: "100%" }}>
        {messages.length > 0 ?
          <div className={styles.messages_box}>
            {messages.map((message, index) => {
              let itemClass, itemClassReply;
              if (message.prev === "same" && message.next === "same") {
                itemClass = styles.messages_item_middle;
                itemClassReply = styles.messages_item__reply_middle;
              } else if (message.prev === "same" && message.next !== "same") {
                itemClass = styles.messages_item_prev;
                itemClassReply = styles.messages_item__reply_prev;
              } else if (message.prev !== "same" && message.next === "same") {
                itemClass = styles.messages_item_next;
                itemClassReply = styles.messages_item__reply_next;
              } else {
                itemClass = styles.messages_item;
                itemClassReply = styles.messages_item__reply;
              }
              return (
                <div className={message.user.name !== userName ? itemClass : itemClassReply} key={index}>
                  {message.prev === "same" ? "" :
                    <div className={styles.messages_item_avatar}>
                      <img alt="avatar" src="http://angular-material.fusetheme.com/assets/images/avatars/profile.jpg" />
                    </div>
                  }
                  <div className={styles.messages_content}>
                    <p className={styles.messages_item_text}>{message.text}</p>
                    {message.next === "same" ? "" : <p className={styles.messages_item_time}>
                      {checkDate(message.date)}
                    </p>}

                  </div>
                </div>
              )
            })}
          </div> : <div className={styles.messages_no_content}>Пока нет сообщений</div>
        }
        <span ref={messagesBox}></span>
      </div>
      <div className={styles.messages_footer}>
        <textarea
          placeholder="Введите сообщение"
          className={styles.message_input}
          onChange={text => onTypeMessage(text)}
          onKeyUp={text => onSubmitMessage(text)}
          value={inputValue}
          onClick={() => onUpdateReadMessages(chatHandle)}
          onBlur={() => onUpdateReadMessages(chatHandle)}
        />
      </div>
    </div>
  )
}
export default Messages;