import React, { useState, useEffect } from 'react';
import { Menu } from "antd";
import Home from './pages/home';
import List from './pages/list';
import Communication from './pages/communication';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

const menus = [
  {
    key: "react",
    route: "/",
    title: "主页"
  },
  {
    key: "react-list",
    route: "/list",
    title: "列表页"
  },
  {
    key: "react-communication",
    route: "/communication",
    title: "通讯页"
  },
  {
    key: "vue",
    route: "/vue",
    title: "Vue 子应用"
  }
]

const BASE_NAME = window.__POWERED_BY_QIANKUN__ ? '/react' : '/';
const App = () => {
  const [refresh, setRefresh] = useState(0);
  const [selectedKeys, setSelectKeys] = useState(['react']);
  useEffect(() => {
    const { pathname } = window.location;
    const menu = menus.find(item => item.route === `${BASE_NAME.slice(1)}${pathname}`);
    setSelectKeys(() => ([menu ? menu.key : 'react']));
  }, [refresh]);

  return (
    <Router basename={BASE_NAME}>
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
          <Route path='/list' component={List} />
          <Route path='/communication' component={Communication} />
        </Switch>
      </section>
    </Router>
  )
}

export default App;