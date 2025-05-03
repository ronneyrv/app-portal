import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export default function ModalConfirm({ open, message, onConfirm, onClose }) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ padding: "30px" }}>
          <DialogContentText id="alert-dialog-description">
            {message.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ background: "#f0f0f0", height: "30px" }}>
          <Button onClick={onClose}>Concelar</Button>
          <Button onClick={handleConfirm}>OK</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
