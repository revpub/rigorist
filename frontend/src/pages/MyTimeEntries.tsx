import React, { useEffect, useState } from "react";
import { Button, Table, Flex, Space, Breadcrumb, Skeleton } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import * as API from "../api";
import TimeEntryModal from "../components/TimeEntryModal"
import { TimeEntryWithId } from "../api/timeEntries";

const MyTimeEntries = () => {

  const [isTimeEntryModalOpen, setTimeEntryModalOpen] = useState(false);
  const [timeEntryModalTitle, setTimeEntryModalTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [timeEntries, setTimeEntries] = useState<object[]>();

  /* TimeEntryModal functions */
  const showTimeEntryModal = (mode: string) => {
    if (mode === "Create") {
      setTimeEntryModalTitle("Make New Time Entry");
    }
    else {
      setTimeEntryModalTitle("Update Existing Time Entry");
    }
    setTimeEntryModalOpen(true);
  };

  const columns: any = [
    {
      title: "Date",
      dataIndex: "dateString",
      render: (text: string, record: TimeEntryWithId) => (
        <Link to={"/myTimeEntries/" + record._id}>{text}</Link>
      ),
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value: string, record: TimeEntryWithId) =>
        record.dateString.indexOf(value) === 0,
      sorter: (a: TimeEntryWithId, b: TimeEntryWithId) => a.dateString.length - b.dateString.length,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Activity Name",
      dataIndex: "activityName",
      onFilter: (value: string, record: TimeEntryWithId) =>
        record.activityName!.indexOf(value) === 0,
      sorter: (a: TimeEntryWithId, b: TimeEntryWithId) =>
        a.activityName!.length - b.activityName!.length,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Duration",
      dataIndex: "duration",
      sorter: (a: TimeEntryWithId, b: TimeEntryWithId) =>
        a.duration > - b.duration,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Concentration Level",
      dataIndex: "concentrationLevel",
      sorter: (a: TimeEntryWithId, b: TimeEntryWithId) =>
        a.concentrationLevel > b.concentrationLevel,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Actions",
    },
  ];

  useEffect(() => {
    const myUserId = localStorage.getItem("user-id");
    if (myUserId === null) {
      return;
    }

    API.TimeEntry.getTimeEntriesWithActorId(
      myUserId,
      (data) => {
        data.map((timeEntry: any) => {
          timeEntry.key = "timeEntry" + timeEntry._id.toString();
          return timeEntry;
        });
        setTimeEntries(data);
        setIsLoading(false);
      },
      () => {
        alert("Unable to get time entries.");
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
            title: "My Time Entries",
          },
        ]}
      />
      <h1>My Time Entries</h1>
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <Flex vertical>
          <Space direction="vertical">
            <Link to={"createTimeEntry"}>
              <Button>Create Time Entry</Button>
            </Link>
            <Table columns={columns} dataSource={timeEntries} />
          </Space>
        </Flex>
      )}
      <TimeEntryModal
        open={isTimeEntryModalOpen}
        setModalVisible={setTimeEntryModalOpen}
        title={timeEntryModalTitle}
      ></TimeEntryModal>
    </React.Fragment>
  );
};
export default MyTimeEntries;
