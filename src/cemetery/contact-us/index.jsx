import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Button,
  Container,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { useNavigate } from "react-router-dom";
import PermPhoneMsgIcon from "@mui/icons-material/PermPhoneMsg";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import FacebookIcon from "@mui/icons-material/Facebook";
import "./index.css";
import ModalMenu from "../../shared/Modal/ModalMenu";
import MenuIcon from "@mui/icons-material/Menu";
import BG from "../../assets/about.jpg";

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

const WhiteBorderTextField = styled(TextField)`
  border: 1px solid white;
  & label.Mui-focused {
    color: white;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;

export const ContactUs = () => {
  const navigate = useNavigate();

  const [isCheck, setIsCheck] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const onCheckboxChange = () => {
    setIsCheck(!isCheck);
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

  return (
    <Paper sx={{ backgroundImage: `url("${BG}")` }}>
      <Box sx={{ paddingBottom: "4rem" }}>
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
          <Grid2 container spacing={2} marginTop={4} padding={4}>
            <Grid2>
              <Box>
                <Typography variant="h4" color="white" fontWeight={800}>
                  GET IN TOUCH
                </Typography>
              </Box>

              <Box sx={{ marginTop: "1em", marginBottom: "1em" }}>
                <Divider color="white" />
              </Box>

              <Box>
                <Typography color="white" variant="body1">
                  Easily reach out to us via our 'Get in Touch' function within
                  our Cemetery Mapping System, ensuring prompt assistance for
                  any queries or assistance you may require.
                </Typography>
              </Box>
            </Grid2>

            <Grid2 size={12} container marginTop={4}>
              <Grid2 size={5}>
                <Stack direction={"column"} sx={{ width: "100%" }} spacing={2}>
                  <Stack direction={"column"} spacing={1}>
                    <Typography variant="caption" fontWeight={800} color="#fff">
                      NAME
                    </Typography>
                    <WhiteBorderTextField fullWidth size="small" />
                  </Stack>

                  <Stack direction={"column"} spacing={1}>
                    <Typography color="#fff" variant="caption" fontWeight={800}>
                      EMAIL
                    </Typography>
                    <WhiteBorderTextField fullWidth size="small" />
                  </Stack>
                  <Stack direction={"column"} spacing={1}>
                    <Typography color="#fff" variant="caption" fontWeight={800}>
                      CEMETERY NAME
                    </Typography>
                    <WhiteBorderTextField fullWidth size="small" />
                  </Stack>
                  <Stack direction={"column"} spacing={1}>
                    <Typography color="#fff" variant="caption" fontWeight={800}>
                      MESSAGE
                    </Typography>
                    <textarea
                      rows="4"
                      style={{
                        border: "1px solid white",
                        width: "100%",
                        backgroundColor: "transparent",
                      }}
                    />
                  </Stack>
                  <Stack
                    direction={"row"}
                    spacing={2}
                    sx={{ marginTop: "12px", paddingTop: 4 }}
                  >
                    <Box
                      justifyContent={"center"}
                      alignItems={"center"}
                      sx={{
                        display: "flex",
                        border: "1px solid white",
                        height: "30px",
                        width: "30px",
                      }}
                    >
                      <input
                        onClick={onCheckboxChange}
                        className="input-box"
                        type="checkbox"
                        checked={isCheck}
                        style={{
                          height: "20px",
                          width: "20px",
                          background: "transparent",
                          accentColor: "transparent",
                          border: "1px solid #F0",
                        }}
                      />
                    </Box>
                    <Typography
                      color="#fff"
                      variant="subtitle2"
                      fontWeight={300}
                    >
                      I agree to receive other communications from Municipality
                      of Buenavista Guimaras
                    </Typography>
                  </Stack>
                  <Box paddingTop={4}>
                    <Button
                      variant="outlined"
                      sx={{
                        p: 1,
                        border: "1px solid white",
                        color: "white",
                        width: "200px",
                        fontWeight: 800,
                      }}
                    >
                      SEND MESSAGE
                    </Button>
                  </Box>
                </Stack>
              </Grid2>

              <Grid2
                size={4}
                padding={4}
                rowGap={0}
                justifyContent={"flex-start"}
                alignItems={"flex-start"}
              >
                <Grid2 sx={{ paddingBottom: 3 }}>
                  <Stack direction={"row"} spacing={2}>
                    <Box
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        display: "flex",
                        border: "1px solid white",
                        height: "30px",
                        width: "30px",
                        borderRadius: 50,
                      }}
                    >
                      <HomeWorkIcon
                        style={{
                          margin: "10px",
                          color: "white",
                          height: "20px",
                          width: "20px",
                        }}
                      />
                    </Box>
                    <Stack
                      direction={"column"}
                      spacing={"4px"}
                      sx={{ minWidth: "300px" }}
                    >
                      <Box>
                        <Typography
                          color="#fff"
                          variant="subtitle2"
                          fontWeight={300}
                        >
                          Buenavista Town Hall,
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          color="#fff"
                          variant="subtitle2"
                          fontWeight={300}
                        >
                          Buenavista Municipal Compound, #2894
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          color="#fff"
                          variant="subtitle2"
                          fontWeight={300}
                        >
                          Buenavista, Guimaras
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Grid2>

                <Grid2 sx={{ paddingBottom: 3 }}>
                  <Stack direction={"row"} spacing={2}>
                    <Box
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        display: "flex",
                        border: "1px solid white",
                        height: "30px",
                        width: "30px",
                        borderRadius: "50px",
                      }}
                    >
                      <PermPhoneMsgIcon
                        style={{
                          margin: "10px",
                          color: "white",
                          height: "20px",
                          width: "20px",
                        }}
                      />
                    </Box>

                    <Stack direction={"column"}>
                      <Box>
                        <Typography
                          color="#fff"
                          variant="subtitle2"
                          fontWeight={300}
                        >
                          09000000001
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Grid2>

                <Grid2 sx={{ paddingBottom: 3 }}>
                  <Stack direction={"row"} spacing={2}>
                    <Box
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        display: "flex",
                        border: "1px solid white",
                        height: "30px",
                        width: "30px",
                        borderRadius: "50px",
                      }}
                    >
                      <AttachEmailIcon
                        style={{
                          margin: "10px",
                          color: "white",
                          height: "20px",
                          width: "20px",
                        }}
                      />
                    </Box>

                    <Stack direction={"column"}>
                      <Box>
                        <Typography
                          color="#fff"
                          fontWeight={300}
                          variant="subtitle2"
                        >
                          buenavista@gmail.com
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Grid2>

                <Grid2>
                  <Stack direction={"row"} spacing={2}>
                    <Box
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        display: "flex",
                        border: "1px solid white",
                        height: "30px",
                        width: "30px",
                        borderRadius: "50px",
                      }}
                    >
                      <FacebookIcon
                        style={{
                          margin: "10px",
                          color: "white",
                          height: "20px",
                          width: "20px",
                        }}
                      />
                    </Box>

                    <Stack direction={"column"}>
                      <Box>
                        <Typography
                          fontWeight={300}
                          color="#fff"
                          variant="subtitle2"
                        >
                          Municipality of Buenavista
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Container>
        <ModalMenu open={open} handleClick={(id) => onModalMenuClick(id)} />
      </Box>
    </Paper>
  );
};
