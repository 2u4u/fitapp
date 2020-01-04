import React from 'react';
import { Link } from "react-router-dom";
import { Result, Button } from 'antd';

function Page404(props) {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Упс, кажется такой страницы не существует"
      extra={<Link to="/"><Button type="primary">Вернуться на главную</Button></Link>}
    />
  )
}

export default Page404;