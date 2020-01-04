import React from 'react';
// import { Link } from "react-router-dom";
import { Result } from 'antd';

function Training404(props) {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Упс, кажется такой тренировки не существует"
    // extra={<Link to="/"><Button type="primary">Вернуться к списку тренировок</Button></Link>}
    />
  )
}

export default Training404;