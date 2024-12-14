import React, { useEffect, useState } from "react";
import { Grid2, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import LOGO from "../../assets/Buenavista-sm.png";
import BG from "../../assets/main-bg.jpg";
import { useNavigate } from "react-router-dom";
import { SearchTextField } from "../../shared/TextFields";

import ModalMenu from "../../shared/Modal/ModalMenu";
import MenuIcon from "@mui/icons-material/Menu";

import {
  MODAL_CLICK_ABOUT,
  MODAL_CLICK_CLOSE,
  MODAL_CLICK_CONTACT_US,
  MODAL_CLICK_HOME,
  MODAL_CLICK_LOGOUT,
  ROUTE_ABOUT,
  ROUTE_CONTACT_US,
  ROUTE_FINDER,
  ROUTE_LOGIN,
} from "../../constants";

import { useLazyClientSearchDeceasedQuery } from "../../service/clientService";
import { resetStorage } from "../../utility";

export const Finder = () => {
  const [search, setSearch] = React.useState();
  const [searchDeased, result] = useLazyClientSearchDeceasedQuery(search);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (result.error) {
      if (result.error.status == 401) {
        resetStorage();
        navigate(ROUTE_LOGIN)
      }
    }

    if (result.data) {
      if (Number(result.data.statusCode) == 200) {
        navigate(`/cemetery/map-view?fullname=${search}&location=${result?.data?.deceased.cemeteryLocation}`);
      } else {
        setErrorMessage(result.currentData?.message)
      }
    }

  }, [result]);

  const onSearch = (value) => {
    setSearch(value)
    searchDeased(value);
  };

  const onModalMenuClick = (id) => {
    switch (id) {
      case MODAL_CLICK_CLOSE:
        setOpen(false);
        break;
      case MODAL_CLICK_ABOUT:
        navigate(ROUTE_ABOUT);
        break;
      case MODAL_CLICK_CONTACT_US:
        navigate(ROUTE_CONTACT_US);
        break;
      case MODAL_CLICK_HOME:
        navigate(ROUTE_FINDER);
        break;
      case MODAL_CLICK_LOGOUT:
        resetStorage();
        navigate(ROUTE_LOGIN);
        break;
    }
  };
  const availableNames = [
    "Juan Dela Cruz",
    "Maria Clara",
    "José Rizal",
    "Andres Bonifacio",
    "Emilio Aguinaldo",
    "Apolinario Mabini"
  ];

  return (
    <Paper
      sx={{
        background: "black",
        minHeight: "100vh",
        display: "flex",
        backgroundImage: `url("${BG}")`,
      }}
    >
      <Box
        justifyContent={"flex-end"}
        sx={{
          display: "flex",
          padding: "2rem",
          top: 0,
          right: 0,
          position: "absolute",
        }}
      >
        <Box sx={{ border: "1px solid white" }}>
          <Button
            onClick={() => setOpen(true)}
            sx={{ p: 1, background: "transparent", width: "130px" }}
            variant="contained"
            endIcon={<MenuIcon />}
          >
            MENU
          </Button>
        </Box>
      </Box>
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          background: "rgba(0,0,0, 0.6)",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Grid2
          sx={{
            width: "800px",
          }}
          container
          justifyContent={"start"}
          alignItems={"center"}
          alignContent={"center"}
        >
          <Stack
            spacing={1}
            direction={"column"}
            justifyItems={"center"}
            justifyContent={"center"}
            sx={{ margin: 2 }}
          >
            <Box sx={{ display: "flex", justifyContent: "start" }}>
              <img src={LOGO} height={100} />
            </Box>
            <Typography
              textAlign={"start"}
              color="white"
              variant="body1"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              BUENAVISTA, GUIMARAS
            </Typography>
            <Typography
              textAlign={"start"}
              color="white"
              variant="h5"
              noWrap
              component="div"
              fontWeight={900}
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              PUBLIC CEMETERY MANAGEMENT
            </Typography>
            <Typography
              variant="caption"
              color="white"
              fontWeight={100}
              textAlign={"start"}
            >
              (OLD POBLACION | EAST VALENCIA | BANBAN CEMETERY)
            </Typography>
          </Stack>

          <Grid2 container size={12} justifyContent={"start"}>
            <Box sx={{ width: "80%" }}>
              <SearchTextField

                onSearch={onSearch}
                setErrorMessage={setErrorMessage}
                names={availableNames} // Pass the list of names to the component
              />
              {errorMessage && (
                <Typography color="error" variant="body1" sx={{ fontWeight: 600, marginTop: '3px' }}>*{errorMessage}</Typography>
              )}
            </Box>
          </Grid2>
        </Grid2>
      </Box>
      <ModalMenu open={open} handleClick={(id) => onModalMenuClick(id)} />
    </Paper>
  );
};
