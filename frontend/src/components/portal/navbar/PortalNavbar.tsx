import React, { useState } from "react";
import { Menu, Flex, Row, Col, Typography } from "antd";
import {
  ClockCircleOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import * as API from "../../../api";
// import "./PortalNavbar.css";

const items = [
  {
    label: "My Time",
    key: "myTime",
    children: [
      {
        label: <Link to={"/myTimeEntries"}>My Time Entries</Link>,
        key: "myTime:myTimeEntries",
        icon: <EditOutlined />,
      }
    ],
  },
  {
    label: "Reports",
    key: "reports",
    children: [
      {
        label: <Link to={"/timeUse"}>Time Use</Link>,
        key: "reports:timeUse",
        icon: <ClockCircleOutlined />,
      }
    ],
  },
  {
    label: "Logged In",
    key: "account",
    icon: <UserOutlined />,
    children: [
      {
        label: <Link to={"/myAccount"}>My Account</Link>,
        key: "account:myAccount",
      },
      {
        label: "Logout",
        key: "account:Logout",
      },
    ],
  },
];

const PortalNavbar = () => {
  const [current, setCurrent] = useState("mail");
  const onClick = (e: any) => {
    if (e.key === "account:Logout") {
      handleLogoutClick();
    }
    setCurrent(e.key);
  };

  const navigate = useNavigate();

  const handleLogoutClick = () => {
    const refreshToken = localStorage.getItem("refresh-token");
    if (refreshToken === null) {
      return;
    }
    API.Auth.logout(
      refreshToken,
      () => {
        localStorage.clear();
        navigate("/auth/login");
      },
      () => {
        alert("Unable to logout. Please try after some time.");
      }
    );
  };

  return (
    <React.Fragment>
      <Row align="middle">
        <Col><Typography>Rigorist</Typography></Col>
        <Col flex="auto"></Col>
        <Col>
          <Flex justify={"flex-end"}>
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={items}
            />
          </Flex>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default PortalNavbar;
