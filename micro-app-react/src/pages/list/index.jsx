import React, { useState, useEffect } from "react";
import { Card, Table, Avatar } from "antd";
import fetch from "isomorphic-fetch";

const fetchVegetable = (page, pageSize) => {
  return fetch("http://dev-api.jt-gmall.com/mall", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // graphql 的查询风格
    body: JSON.stringify({
      query: `{ vegetableList (page: ${page}, pageSize: ${pageSize}) { page, pageSize, total, items { _id, name, poster, price } } }`,
    }),
  }).then((res) => res.json());
};

const { Column } = Table;
const List = () => {
  // 设置列表信息
  const [data, setData] = useState([]);
  // 设置页码信息
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState();

  useEffect(() => {
    console.log({ page });
    // (async () => {
    //   const result = await fetchVegetable(page, 10);
    //   const { vegetableList } = result.data;
    //   setData(() => vegetableList.items);
    //   setPageInfo(() => ({
    //     current: vegetableList.page,
    //     pageSize: vegetableList.pageSize,
    //     total: vegetableList.total,
    //     onChange: (page) => setPage(page),
    //   }));
    // })();
  }, [page]);

  return (
    <Card title="React 子应用列表页">
      <h2 style={{ fontSize: "26px", color: "#fb4487" }}>
        曾经充满数据的一个列表（因服务器到期，此处数据已丢失）
      </h2>
      {/* <Table rowKey="_id" dataSource={data} pagination={pageInfo}>
        <Column dataIndex="poster" render={(text) => <Avatar src={text} />} />
        <Column dataIndex="name" />
        <Column dataIndex="price" render={(text) => <>￥ {text}</>} />
      </Table> */}
    </Card>
  );
};

export default List;
