import { FC } from "react";
import { Modal, Form, Input, Button } from "antd";
import * as API from "../api";
import { ModalVisibleProps } from "../util/types";

const DefineActivityModal: FC<ModalVisibleProps> = ({ open, setModalVisible, title }: ModalVisibleProps) => {

  const [form] = Form.useForm()

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  }

  const handleOk = () => {
    form.submit();
  }

  const onFinish = (values: API.Activity.Activity) => {

    const { name } = values;

    if (name === undefined) {
      return;
    }

    API.Activity.createActivity(
      {
        name: name
      },
      () => {},
      () => {
        alert("Unable to create activity");
      }
    );

    setModalVisible(false)
  }

  return (
    <Modal title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
            Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
            Submit
        </Button>,
    ]}
    >
      <Form
        name="defineActivityForm"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
        form={form} onFinish={onFinish}
      >
        <Form.Item
          label="Activity Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter a name for the activity",
            },
          ]}
        >
          <Input />
        </Form.Item>

       
      </Form>
    </Modal>
  );
}

export default DefineActivityModal;