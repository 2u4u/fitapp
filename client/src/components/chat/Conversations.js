import React from "react";
import moment from 'moment';
import 'moment/locale/ru';
import styles from "./styles.module.scss";
moment.locale('ru');

function Conversations(props) {
  const { chats, usersList, userId, userName, onOpenConversation, onStartConversation } = props;

  return (
    <div className={styles.conversations}>
      <div className={styles.search_header}>
        <div className={styles.search_avatar}>
          <img alt="avatar" src="http://angular-material.fusetheme.com/assets/images/avatars/profile.jpg" />
        </div>
        <div className={styles.search}>
          <input type="text" placeholder="Начать новый чат" className={styles.search_input} />
        </div>
      </div>
      <div className={styles.chats_list}>
        <div>
          <span className={styles.chats_header}>Чаты</span>
          {chats.map((chat) => {
            return (
              <div
                className={styles.chats_item}
                onClick={() => onOpenConversation(chat.handle)}
                key={chat._id}
              >
                <div className={styles.chats_avatar}>
                  <img alt="avatar" src="http://angular-material.fusetheme.com/assets/images/avatars/profile.jpg" />
                </div>
                <div>
                  <p className={styles.chats_username}>{chat.members.filter((user) => user !== userName)}</p>
                  <p className={styles.chats_last_message}>{chat.message.text}</p>
                </div>
                <div className={styles.chats_info}>
                  <span className={styles.chats_time}>{moment(chat.message.date).format('D MMM YYYY, hh:mm')}</span>
                  {(!chat.message.read && chat.message.user !== userId) ? <span className={styles.chats_unread}>1</span> : ""}
                </div>
              </div>
            )
          })}
        </div>
        <div>
          <span className={styles.chats_header}>Люди</span>
          {usersList.length > 0 ?
            usersList.filter(user => user.name !== userName).map((user, index) => {
              return (
                <div
                  className={styles.chats_item}
                  onClick={() => onStartConversation(user.name)}
                  key={user._id}>
                  <div className={styles.chats_avatar}>
                    <img alt="avatar" src="http://angular-material.fusetheme.com/assets/images/avatars/profile.jpg" />
                  </div>
                  <div>
                    <p className={styles.chats_username}>{user.name}</p>
                  </div>
                </div>
              )
            }) : <div>Пользователи не найдены</div>
          }
        </div>
      </div>
    </div>
  )
}
export default Conversations;