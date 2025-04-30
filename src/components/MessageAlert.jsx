import React from "react";
import Alert from "@mui/material/Alert";

function MessageAlert({ type = "info", message = "" }) {
  if (!message) return null;

  return (
    <div className="alert-login">
      <Alert severity={type}>{message}</Alert>
    </div>
  );
}

export default MessageAlert;
