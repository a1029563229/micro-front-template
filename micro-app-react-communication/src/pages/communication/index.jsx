import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Descriptions, Avatar, message } from "antd";

import SharedModule from "@/shared";
import { ApiGetUserInfo } from "@/apis";

const Status = () => {
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    if (!token) return;

    (async () => {
      setUserInfo({
        nickname: "shadows",
        avatarUrl: "",
        gender: 1,
        country: "中国",
        province: "广东",
        city: "深圳",
      });
    })();
  }, []);

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
