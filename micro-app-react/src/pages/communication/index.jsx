import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Descriptions, Avatar, message } from "antd";

import SharedModule from "@/shared";
import { ApiGetUserInfo } from "@/apis";

const Status = () => {
  const history = useHistory();

  const [token, setToken] = useState();
  useEffect(() => {
    const shared = SharedModule.getShared();
    const token = shared.getToken();

    // 未登录 - 返回主页
    if (!token) {
      message.error("未检测到登录信息！");
      return history.push("/");
    }
    
    setToken(token);
  }, [history]);

  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    if (!token) return;

    (async () => {
      const result = await ApiGetUserInfo(token);
      console.log(result);
      setUserInfo(result.data.getUserInfo);
    })();
  }, [token]);

  if (!userInfo) return null;

  return (
    <section>
      <Descriptions title={`欢迎你，${userInfo.nickname}`}>
        <Descriptions.Item label="Avatar">
          <Avatar src={userInfo.avatarUrl} />
        </Descriptions.Item>
        <Descriptions.Item label="UserName">
          {userInfo.nickname}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          {userInfo.gender ? "boy" : "girl"}
        </Descriptions.Item>
        <Descriptions.Item label="Live">{`${userInfo.country} ${userInfo.province} ${userInfo.city}`}</Descriptions.Item>
      </Descriptions>
      <style jsx>{`
        section {
          padding: 20px;
        }
      `}</style>
    </section>
  );
};

export default Status;
