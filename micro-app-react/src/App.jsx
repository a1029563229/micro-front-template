import React, { useState, useEffect } from 'react';
import { Menu } from "antd";
import Home from './pages/home';
import List from './pages/list';
import Status from './pages/status';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

const menus = [
  {
    key: "react",
    route: "/react",
    title: "主页"
  },
  {
    key: "react-list",
    route: "/react/list",
    title: "列表页"
  },
  {
    key: "react-status",
    route: "/react/status",
    title: "状态页"
  },
  {
    key: "vue",
    route: "/vue",
    title: "Vue 子应用"
  }
]

const App = () => {
  const [refresh, setRefresh] = useState(0);
  const [selectedKeys, setSelectKeys] = useState(['react']);
  useEffect(() => {
    const { pathname } = window.location;
    const menu = menus.find(item => item.route === pathname);
    setSelectKeys(() => ([menu ? menu.key : 'react']));
  }, [refresh]);

  return (
    <Router>
      <section>
        <Menu
          onClick={() => setRefresh(refresh => ++refresh)}
          selectedKeys={selectedKeys}
          mode="horizontal">
          {
            menus.map(item => (
              <Menu.Item key={item.key}>
                <Link to={item.route}>{item.title}</Link>
              </Menu.Item>
            ))
          }
        </Menu>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/react' component={Home} />
          <Route path='/react/list' component={List} />
          <Route path='/react/status' component={Status} />
        </Switch>
      </section>
    </Router>
  )
}

export default App;