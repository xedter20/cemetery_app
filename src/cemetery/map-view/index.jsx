


import Drawer from "@mui/material/Drawer";
import { useClientSearchDeceasedQuery } from "../../service/clientService";
import { MapViewComponent } from "../../shared/Map-View";
import { useSearchParams } from "react-router-dom";

import map_banban from "./../../assets/FORMAPPING/Banban.png";
import map_poblacion from "./../../assets/FORMAPPING/Old-Poblacion.png";
import map_east_valencia from "./../../assets/FORMAPPING/East-Valencia.png";

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
    const isBanBan = location.toLowerCase().includes("Banban")

      ||

      location === "Banban Cemetery"
      ;
    const isPoblascion = location.toLowerCase().includes("old poblacion") ||

      location === "Old Poblacion Cemetery"
      ;
    const isEastVelencia = location.toLowerCase().includes("east valencia")


      ||

      location === "East Valencia Cemetery"
      ;


    console.log({ location, isBanBan, isPoblascion, isEastVelencia })
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

    </Box>
  );
}
