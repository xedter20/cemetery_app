import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Grid2 } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

export default function CustomModal({ children , open, onClose, onOk, onCancel, width=400}) {
 
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width }}>
          {children}
          <Grid2
            container
            spacing={1}
            sx={{ width: "100%", marginTop: "12px" }}
            justifyContent={"flex-end"}
          >
            <Button variant="contained" color="error" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={onOk}>
              Create
            </Button>
          </Grid2>
        </Box>
      </Modal>
    </div>
  );
}
