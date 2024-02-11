import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Breadcrumb,
  Space,
  Popconfirm,
  Skeleton,
  notification,
} from "antd";
import * as API from "../api";

interface ProfileFormValues {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

const MyAccount = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<API.User.User>();

  const openErrorNotification = (options: any) => {
    const { message, description } = options;
    notification.error({
      message: message,
      description: description,
    });
  };

  const onFinish = (values: ProfileFormValues) => {
    API.User.updateCurrentUser(
      {
        username: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName
      },
      (data) => {
        navigate("/");
      },
      () => {
        alert("Unable to update user.");
      }
    );
  };

  const onFinishFailed = (errorInfo: {}) => {
    // console.log("Failed:", errorInfo);
  };

  const onDelete = () => {
    API.User.deleteCurrentUser(
      () => {
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
      },
      () => {
        alert("Unable to delete user.");
      }
    );
  };

  useEffect(() => {
    API.User.getCurrentUser(
      (data) => {
        setUser(data);
        setIsLoading(false);
      },
      () => {
        alert("Unable to get user.");
      }
    );
  }, []);

  return (
    <React.Fragment>
      <Breadcrumb
        items={[
          {
            title: (
              <Link to={"/"}>
                <HomeOutlined />
              </Link>
            ),
          },
          {
            title: "My Account",
          },
        ]}
      />
      <h1>My Account</h1>
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <Form
          name="updateMyAccountForm"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={user}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "You must provide a username",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Email Address" name="email">
            <Input />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "You must provide your first name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "You must provide your last name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Space direction="horizontal">
              <Button type="primary" htmlType="submit">
                Update My Account
              </Button>
              <Popconfirm
                title="Delete Your Account"
                description="Are you sure you want to delete your account? All your items, services, and skills will also be deleted. This cannot be undone."
                onConfirm={onDelete}
                okText="Yes, Delete My Account"
                cancelText="No, Don't Delete"
              >
                <Button type="primary" htmlType="button" danger>
                  Delete My Account
                </Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};
export default MyAccount;
