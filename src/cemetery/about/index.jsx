import * as React from "react";
import { Container, Divider, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import BG from "../../assets/about.jpg";

import banbanImg from "../../assets/banban.JPG";
import poblasionImg from "../../assets/poblasion.JPG";
import eastvelenciaImg from "../../assets/east_velencia.JPG";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ModalMenu from "../../shared/Modal/ModalMenu";

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
import { resetStorage } from "../../utility";

export const About = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

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

  return (
    <Paper sx={{ backgroundImage: `url("${BG}")` }}>
      <Box
        justifyContent={"flex-end"}
        sx={{ display: "flex", padding: "2rem" }}
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
      <Container>
        <Box
          sx={{
            height: "500px",
            padding: "2rem",
            paddingTop: "8rem",
          }}
        >
          <Stack
            direction="row"
            spacing={4}
            id="banban-cemetery"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <img
              src={banbanImg}
              height={"400px"}
              width={"400px"}
              style={{ borderRadius: "100%" }}
            />
            <Box>
              <Box>
                <Typography color="white" variant="h5" fontWeight={800}>
                  Ban Ban Cemetery
                </Typography>
              </Box>
              <Box sx={{ marginTop: 2, marginBottom: 2 }}>
                <Divider color="white" />
              </Box>
              <Box>
                <p>
                  <Typography
                    color="white"
                    textAlign={"justify"}
                    variant="body2"
                  >
                    orem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </Typography>
                </p>
                <p>
                  <Typography
                    color="white"
                    textAlign={"justify"}
                    variant="body2"
                  >
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </Typography>
                </p>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            height: "500px",
            padding: "2rem",
          }}
        >
          <Stack
            direction="row"
            spacing={4}
            id="poblacion-cemetery"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box>
              <Box>
                <Typography
                  color="white"
                  variant="h5"
                  textAlign={"right"}
                  fontWeight={800}
                >
                  Poblacion Cemetery
                </Typography>
              </Box>
              <Box sx={{ marginTop: 2, marginBottom: 2 }}>
                <Divider color="white" />
              </Box>
              <Box>
                <p>
                  <Typography
                    color="white"
                    textAlign={"justify"}
                    variant="body2"
                  >
                    orem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </Typography>
                </p>
                <p>
                  <Typography
                    color="white"
                    textAlign={"justify"}
                    variant="body2"
                  >
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </Typography>
                </p>
              </Box>
            </Box>
            <img
              src={poblasionImg}
              height={"400px"}
              width={"400px"}
              style={{ borderRadius: "100%" }}
            />
          </Stack>
        </Box>

        <Box
          sx={{
            height: "500px",
            padding: "2rem",
          }}
        >
          <Stack
            direction="row"
            spacing={4}
            id="east_valencia-cemetery"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <img
              src={eastvelenciaImg}
              height={"400px"}
              width={"400px"}
              style={{ borderRadius: "100%" }}
            />
            <Box>
              <Box>
                <Typography color="white" variant="h5" fontWeight={800}>
                  East Velencia Cemetery
                </Typography>
              </Box>
              <Box sx={{ marginTop: 2, marginBottom: 2 }}>
                <Divider color="white" />
              </Box>
              <Box>
                <p>
                  <Typography
                    color="white"
                    textAlign={"justify"}
                    variant="body2"
                  >
                    orem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </Typography>
                </p>
                <p>
                  <Typography
                    color="white"
                    textAlign={"justify"}
                    variant="body2"
                  >
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </Typography>
                </p>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Container>
      <ModalMenu open={open} handleClick={(id) => onModalMenuClick(id)} />
    </Paper>
  );
};
