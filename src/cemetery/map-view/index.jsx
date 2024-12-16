


import Drawer from "@mui/material/Drawer";
import { useClientSearchDeceasedQuery } from "../../service/clientService";
import { MapViewComponent } from "../../shared/Map-View";
import { useSearchParams } from "react-router-dom";

import map_banban from "../../assets/map_banban.png";
import map_poblacion from "../../assets/map_poblacion.png";
import map_east_valencia from "../../assets/EAST_VALENCIA_MAP.png";
import { Box, Button, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export function MapView() {
  const [searchParams] = useSearchParams();
  const { data } = useClientSearchDeceasedQuery(searchParams.get("fullname"));

  // console.log('data', data)

  const [open, setOpen] = useState(true);

  const getInitialBg = () => {
    const location = searchParams.get("location");
    const isBanBan = location.toLowerCase().includes("ban ban");
    const isPoblascion = location.toLowerCase().includes("old poblacion");
    const isEastVelencia = location.toLowerCase().includes("east valencia");

    if (isBanBan) {
      return map_banban;
    } else if (isEastVelencia) {
      return map_east_valencia;
    } else if (isPoblascion) {
      return map_poblacion;
    }
  };

  const goBack = () => { };
  const onSave = () => { };
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };



  let mappData = data?.data[0].CANVAS_MAP;
  let deceasedInfo = data?.data[0];

  console.log({ mappData, deceasedInfo })
  return (
    <Box>
      {mappData && (
        <MapViewComponent
          mapBackground={getInitialBg()}
          showMenuBar={false}
          menuBarTitle=""
          goBack={goBack}
          onSave={onSave}
          allowGrid={false}
          initialData={mappData}
          deceasedInfo={deceasedInfo}
        />
      )}
    </Box>
  );
}
