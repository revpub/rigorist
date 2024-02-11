import { FC, useState, useEffect } from "react";
import { Modal, Form, AutoComplete, InputNumber, Rate, Button, Row, DatePicker } from "antd";
import {
  FrownOutlined,
  MehOutlined,
  SmileOutlined
} from "@ant-design/icons";
const { Option } = AutoComplete;
import * as API from "../api";
import { ModalVisibleProps } from "../util/types";
import dayjs from "dayjs";

const customIcons: Record<number, React.ReactNode>  = {
  1: <FrownOutlined />,
  3: <MehOutlined />,
  5: <SmileOutlined />
};

interface ActivityOption {
  key: string,
  value: string
}

const TimeEntryModal: FC<ModalVisibleProps> = ({ open, setModalVisible, title }: ModalVisibleProps) => {

  const [rateColor, setRateColor] = useState('#2fd455');
  const [activityOptions, setActivityOptions] = useState<ActivityOption[]>([]);
  const [filteredActivityOptions, setFilteredActivityOptions] = useState<ActivityOption[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>();
  const [selectedActivityName, setSelectedActivityName] = useState<string>();

  const [form] = Form.useForm()

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  }

  const handleOk = () => {
    form.submit();
  }

  const onFinish = (values: any) => {

    if (values.activityId === undefined) {
      return;
    }

    if (values.duration === undefined) {
      return;
    }

    if (values.concentrationLevel === undefined) {
      return;
    }

    let dateString = (values.date === undefined) ? dayjs().format('YYYY-MM-DD') :
      dayjs(values.date).format('YYYY-MM-DD');

    const actorId = localStorage.getItem("user-id");

    const timeEntry = API.TimeEntry.TimeEntry.parse({
      actorId: actorId,
      dateString: dateString,
      activityId: selectedActivityId,
      activityName: selectedActivityName,
      duration: parseFloat(values.duration),
      concentrationLevel: values.concentrationLevel
    });

    API.TimeEntry.createTimeEntry(
      timeEntry,
      () => {},
      () => {
        alert("Unable to create activity");
      }
    );

    setModalVisible(false);
  }

  const handleRateChange = (value: number) => {

    if (value === 1) {
      setRateColor('red');
    }
    else if (value === 3) {
      setRateColor('#f9da36');
    }
    else if (value === 5) {
      setRateColor('#2fd455');
    }
  }

  const onActivitySelect = (value: any, option: any) => {
    setSelectedActivityId(option.key);
    setSelectedActivityName(option.value);
  };

  const onActivitySearch = (val: string) => {
    const filtered = activityOptions.filter(
      option =>
        option.value
          .toString()
          .toLowerCase()
          .includes(val.toLowerCase())
    );

    setFilteredActivityOptions(filtered);
  };

  useEffect(() => {
    API.Activity.getAllActivities(
      (data) => {
        const options = data.map(activity => ({
          key: activity._id.toString(),
          value: activity.name
        }));
        setActivityOptions(options);
      },
      () => {
        alert("Unable to get activities.");
      }
    );
  }, []);

  const setDuration = () => {

    let hours = form.getFieldValue('hours') ;
    hours = (hours === undefined || hours === "") ? 0 : hours;
    let minutes = form.getFieldValue('minutes');
    minutes = (minutes === undefined || minutes === "") ? 0 : minutes;

    const duration = hours + minutes/60.0;

    form.setFieldValue('duration', duration);

  }

  const checkHours = () => {
    if (form.getFieldValue('hours') > 23) {
      form.setFieldValue('minutes', 0);
    }

    setDuration();
  }

  const checkMinutes = () => {
    if (form.getFieldValue('hours') > 23) {
      form.setFieldValue('minutes', 0);
    }

    setDuration();
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
        name="timeEntryForm"
        labelCol={{
          span: 9,
        }}
        wrapperCol={{
          span: 17,
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
          label="Date"
          name="date"
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Activity"
          name="activityId"
          rules={[
            {
              required: true,
              message: "Please input an activity",
            },
          ]}
        >
          <AutoComplete
            options={filteredActivityOptions}
            style={{
              width: 200,
            }}
            onSelect={onActivitySelect}
            onSearch={onActivitySearch}
            placeholder="Select activity name"
          >
            <Option label="1">Hello</Option>
            <Option value="2">Hello2</Option>
          </AutoComplete>
        </Form.Item>

        <Form.Item
          label="Duration"
          name="duration"
          rules={[
            {
              required: true,
              message: ''
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  (
                    (getFieldValue('hours') === undefined) ||
                    (getFieldValue('hours') === null)
                  ) &&
                  (
                    (getFieldValue('minutes') === undefined) ||
                    (getFieldValue('minutes') === null)
                  )
                ) {
                  return Promise.reject(new Error('Please enter activity duration'));
                }
                return Promise.resolve();
                
              },
            }),
          ]}
        >
          <Row>
            <Form.Item
              name="hours"
              label="hr"
              colon={false}
              style={{margin: '0px'}}
              labelCol={{ style: { order: 2, marginLeft: 5 } }}>
              <InputNumber
                min={0}
                max={24}
                onChange={checkHours}
                style={{width: '60px'}}
              />
            </Form.Item>
            <Form.Item
              name="minutes"
              label="min"
              colon={false}
              style={{margin: '0px'}}
              labelCol={{ style: { order: 2, marginLeft: 5 } }}>
              <InputNumber
                min={0}
                max={45}
                step={15}
                onChange={checkMinutes}
                style={{width: '60px'}}
              />
            </Form.Item>
          </Row>
        </Form.Item>

        <Form.Item
          label="Concentration Level"
          name="concentrationLevel"
          rules={[
            {
              required: true,
              message: "Please specify how focused you were",
            },
          ]}
        >
          <Rate
            character={({ index }) => customIcons[index! + 1]}
            onHoverChange={handleRateChange}
            style={{ color: rateColor }}
          />
        </Form.Item>

      </Form>
    </Modal>
  );
}

export default TimeEntryModal;