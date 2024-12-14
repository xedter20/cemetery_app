import { Box, Button, Stack } from "@mui/material";
import BasicTable from "../../../shared/Table/BasicTable";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const Notification = () => {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(3);

  const rows = [
    {
      id: 1,
      firstName: "Johnny Depp",
      lastName: "Depp",
      email: "johnny.depp@fake.email.com",
      dueDate: "10/10/2024",
      amount: "1000.00",
    },
    {
      id: 2,
      firstName: "Arnold",
      lastName: "Schwarzenegger",
      email: "arnold.schwarzenegger@fake.email.com",
      dueDate: "10/10/2024",
      amount: "1000.00",
    },
    {
      id: 3,
      firstName: "Jim",
      lastName: "Carrey",
      email: "Jim.Carrey@fake.email.com",
      dueDate: "10/10/2024",
      amount: "1000.00",
    },
  ];

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Box>
          <Button
            size="small"
            variant="contained"
            onClick={() => onAction(record)}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  const onAction = (data) => {
    console.log("onAction", data);
  };

  const onPageChange = (value) => {
    setPage(value);
  };
  const [value, setValue] = useState('');
  return (
    <Box>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      {/* <BasicTable
        rows={rows}
        columns={columns}
        onPageChange={onPageChange}
        page={page}
        count={count}
      /> */}
    </Box>
  );
};
