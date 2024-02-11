import React, { useState, useEffect } from 'react';
import * as API from "../../api";
import dayjs from "dayjs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { ResponsiveLine } from '@nivo/line'

interface PlotDataPoint {
  Date: string,
  HoursWorked: number
}

const MyTimeEntriesLinePlot: React.FC = () => {

  const [plotData, setPlotData] = useState<PlotDataPoint[]>(Array.from({length: 31}, (v, i) => ({
    Date: dayjs().subtract(30 - i, 'day').format("YYYY-MM-DD"),
    HoursWorked: 0
  })));

  const calculateTotalsByDate = (timeEntries: API.TimeEntry.TimeEntryWithId[]) => {

    let newPlotData = Array.from({length: 31}, (v, i) => ({
      Date: dayjs().subtract(30 - i, 'day').format("YYYY-MM-DD"),
      HoursWorked: 0
    }));

    timeEntries.forEach(timeEntry => {
      newPlotData.filter(plotDataItem => plotDataItem.Date === timeEntry.dateString)[0].HoursWorked += timeEntry.duration;
    });

    setPlotData(newPlotData);

  }

  useEffect(() => {
    const userId = localStorage.getItem("user-id");
    if (userId === null) {
      return;
    }
    const thirtyDaysAgoStr = plotData[0].Date;
    const todayStr = plotData[plotData.length - 1].Date;
    API.TimeEntry.getTimeEntriesByActorIdAndDates(
      userId,
      thirtyDaysAgoStr,
      todayStr,
      (data) => {
        calculateTotalsByDate(data);
      },
      () => {
        alert("Unable to get user.");
      }
    );
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
    <LineChart
      data={plotData}
      margin={{
        top: 50,
        right: 50,
        left: 50,
        bottom: 80
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="Date"
        angle={45}
        minTickGap={30}
        dy={25}
        label={{ "value": "Date", "position": "insideBottom", "offset": -60 }}
      />
      <YAxis label={{ value: 'Hours Worked', angle: -90, position: 'insideLeft' }} />
      {/* <YAxis dataKey="HoursWorked" label="Hours Worked" /> */}
      <Tooltip />
      <Line
        type="monotone"
        dataKey="HoursWorked"
        stroke="#217bfb"
        strokeWidth="2"
        activeDot={{ r: 5 }}
      />
    </LineChart>
    </ResponsiveContainer>
  );

};
export default MyTimeEntriesLinePlot;