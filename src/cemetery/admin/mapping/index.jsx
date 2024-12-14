import { Box, Button, Stack } from "@mui/material";
import BasicTable from "../../../shared/Table/BasicTable";
import { useState } from "react";

export const Mapping = () => {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(3);

  const rows = [
    {
      id: 1,
      deceased: "Peter P.",
      bornDate: "1900",
      diedDate: "1940",
      place: "Poblacion",
      niche: "Lot 2, Block 1",
    },
    {
      id: 2,
      deceased: "Johnson S.",
      bornDate: "1860",
      diedDate: "1978",
      place: "Poblacion",
      niche: "Lot 1, Block 2",
    },
    {
      id: 3,
      deceased: "Erick T.",
      bornDate: "1650",
      diedDate: "1700",
      place: "Poblacion",
      niche: "Lot 1, Block 1",
    },
  ];

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "deceased",
      dataIndex: "deceased",
      key: "deceased",
    },
    {
      title: "bornDate",
      dataIndex: "bornDate",
      key: "bornDate",
    },
    {
      title: "diedDate",
      dataIndex: "diedDate",
      key: "diedDate",
    },
    {
      title: "place",
      dataIndex: "place",
      key: "place",
    },
    {
      title: "niche",
      dataIndex: "niche",
      key: "niche",
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

  return (
    <Box>
      <BasicTable
        rows={rows}
        columns={columns}
        onPageChange={onPageChange}
        page={page}
        count={count}
      />
    </Box>
  );
};
