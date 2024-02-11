import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  HomeOutlined,
  FrownOutlined,
  MehOutlined,
  SmileOutlined
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Breadcrumb,
  Space,
  Popconfirm,
  Skeleton,
  Rate,
  AutoComplete,
  Row,
  InputNumber
} from "antd";
const { Option } = AutoComplete;
import * as API from "../api";
import { TimeEntryWithId } from "../api/timeEntries";
import { ObjectId } from 'bson';
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

interface TimeEntryProps {
  createMode: boolean;
}

const TimeEntry: React.FC<TimeEntryProps> = ({createMode}) => {
  const navigate = useNavigate();
  const routeParams = useParams();

  const [activityOptions, setActivityOptions] = useState<ActivityOption[]>([]);
  const [filteredActivityOptions, setFilteredActivityOptions] = useState<ActivityOption[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>();
  const [selectedActivityName, setSelectedActivityName] = useState<string>();
  const [rateColor, setRateColor] = useState('#2fd455');
  const [isLoading, setIsLoading] = useState(true);
  const [timeEntry, setTimeEntry] = useState<any>();

  const [form] = Form.useForm()

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

  const sendDeleteTimeEntry = (id: string) => {
    API.TimeEntry.deleteTimeEntry(
      id,
      () => {
        navigate("/myTimeEntries");
      },
      () => {
        alert("Unable to delete time entry.");
      }
    );
  };

  const onFinish = (values: any) => {

    const dateString = (values.dateString === undefined) ? dayjs().format('YYYY-MM-DD') :
        dayjs(values.dateString).format('YYYY-MM-DD');

    const activityId = selectedActivityId;
    if (activityId === undefined) {
      console.log("No activityId");
      return;
    }

    const activityName = selectedActivityName;
    if (activityName === undefined) {
      console.log("No activityName");
      return;
    }

    const duration = values.duration;
    if (duration === undefined) {
      console.log("No duration");
      return;
    }

    const concentrationLevel = values.concentrationLevel;
    if (concentrationLevel === undefined) {
      console.log("No concentrationLevel");
      return;
    }

    if (createMode) {
      const actorId = localStorage.getItem("user-id");

      const timeEntry = API.TimeEntry.TimeEntry.parse({
        actorId: actorId,
        dateString: dateString,
        activityId: selectedActivityId,
        activityName: selectedActivityName,
        duration: duration,
        concentrationLevel: values.concentrationLevel
      });
  
      API.TimeEntry.createTimeEntry(
        timeEntry,
        () => {
          navigate("/myTimeEntries");
        },
        () => {
          alert("Unable to create time entry");
        }
      );
    } else {
      const id = routeParams.id;
      if (id === undefined) {
        return;
      }

      const timeEntry = API.TimeEntry.TimeEntryPartial.parse({
        dateString: dateString,
        activityId: selectedActivityId,
        activityName: selectedActivityName,
        duration: duration,
        concentrationLevel: concentrationLevel
      });

      API.TimeEntry.updateTimeEntry(
        id,
        timeEntry,
        () => {
          navigate("/myTimeEntries");
        },
        () => {
          alert("Unable to update time entry.");
        }
      );
    }

  };

  const onFinishFailed = (errorInfo: {}) => {
    console.log("Failed:", errorInfo);
  };

  const onDelete = () => {
    const id = routeParams.id;
    if (id !== undefined) {
      sendDeleteTimeEntry(id);
    }
  };

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

  useEffect(() => {

    API.Activity.getAllActivities(
      (data) => {
        const options = data.map(activity => ({
          key: activity._id.toString(),
          value: activity.name
        }));
        setActivityOptions(options);

        if (!createMode) {
          const id = routeParams.id;
          if (id === undefined) {
            return;
          }
    
          API.TimeEntry.getTimeEntry(
            id,
            (data) => {
              setSelectedActivityId(data.activityId.toString());
              setSelectedActivityName(data.activityName);
              const formData = {
                dateString: dayjs(data.dateString),
                activityId: {
                  value: options.filter((option: any) => option.key === data.activityId.toString())[0].value
                },
                duration: data.duration,
                hours: Math.trunc(data.duration),
                minutes: (data.duration - Math.floor(data.duration))*60,
                concentrationLevel: data.concentrationLevel
              };
              setTimeEntry(formData);
              setIsLoading(false);
            },
            () => {
              alert("Unable to get time entry.");
            }
          );
        } else {
          setIsLoading(false);
        }
      },
      () => {
        alert("Unable to get activities.");
      }
    );

  }, []);

  const formButtons = () => {
    if (createMode) {
      return (
        <React.Fragment>
          <Button type="primary" htmlType="submit">
            Create Time Entry
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Button type="primary" htmlType="submit">
            Update Time Entry
          </Button>
          <Popconfirm
            title="Delete Time Entry"
            description="Are you sure you want to delete this time entry?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" htmlType="button" danger>
              Delete Time Entry
            </Button>
          </Popconfirm>
        </React.Fragment>
      );
    }
  }

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
            title: <Link to={"/myTimeEntries"}>My Time Entries</Link>,
          },
          {
            title: createMode ? "Create Time Entry" : "Update Time Entry",
          },
        ]}
      />
      { createMode ? <h1>Create Time Entry</h1> : <h1>Update Time Entry</h1> }
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <Form
          name="timeEntryForm"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={timeEntry}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >

          <Form.Item
            label="Date"
            name="dateString"
            rules={[
              {
                required: true,
                message: "Please input the time entry date",
              },
            ]}
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

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Space direction="horizontal">
              { formButtons() }
            </Space>
          </Form.Item>
        </Form>
      )}
    </React.Fragment>
  );
};
export default TimeEntry;
