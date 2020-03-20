import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import { dispatch, subscribe, getState } from '../../utils/plugin';

const Status = () => {
  const [count, setCount] = useState(getState().count);
  useEffect(() => {
    const unSubscribe = subscribe(() => setCount(getState().count));
    return unSubscribe;
  }, []);
  
  return (
    <Card title="React 子应用公共状态页">
      <Button type="primary" onClick={() => dispatch({ type: "DECREMENT" })}> - </Button>
      <span style={{ margin: 20, color: "blue", fontSize: 24 }}>count: {count}</span>
      <Button type="primary" onClick={() => dispatch({ type: "INCREMENT" })}> + </Button>
    </Card>
  )
}

export default Status;