import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Divider, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MODAL_CLICK_ABOUT, MODAL_CLICK_CLOSE, MODAL_CLICK_CONTACT_US, MODAL_CLICK_HOME, MODAL_CLICK_LOGOUT, ROUTE_LOGIN } from "../../constants";
import { resetStorage } from "../../utility";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "rgb(87,103,160)",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalMenu({ open = false, handleClick = null }) {

  return (
    <div>
      <Modal
        open={open}
        onClose={() => handleClick(MODAL_CLICK_CLOSE)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box margin={1} position={"absolute"} right={0} top={0}>
            <Button
              variant="text"
              onClick={() => handleClick(MODAL_CLICK_CLOSE)}
            >
              <CloseIcon
                style={{
                  margin: "10px",
                  color: "white",
                  height: "20px",
                  width: "20px",
                }}
              />
            </Button>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Typography
              variant="h6"
              fontWeight={400}
              color="white"
              textAlign={"center"}
            >
              MENU
            </Typography>
          </Box>

          <Box justifyContent={"center"} sx={{ marginTop: 2, marginBottom: 2 }}>
            <Divider color="#f5e9e9" />
          </Box>

          <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button
              variant="text"
              onClick={() => handleClick(MODAL_CLICK_HOME)}
            >
              <Typography color="white" fontWeight={200} variant="subtitle1">
                HOME
              </Typography>
            </Button>
            <Button
              variant="text"
              onClick={() => handleClick(MODAL_CLICK_ABOUT)}
            >
              <Typography color="white" fontWeight={200} variant="subtitle1">
                ABOUT
              </Typography>
            </Button>
            <Button
              variant="text"
              onClick={() => handleClick(MODAL_CLICK_CONTACT_US)}
            >
              <Typography color="white" fontWeight={200} variant="subtitle1">
                CONTACT US
              </Typography>
            </Button>
            <Button
              variant="text"
              onClick={() => handleClick(MODAL_CLICK_LOGOUT)}
            >
              <Typography color="white" fontWeight={200} variant="subtitle1">
                SIGN-OUT
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
