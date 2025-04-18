import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";

const SidebarItems = ({ items, open, toggleDrawer }) => {
  
  return (
    <List>
      {items.map(({ title, icon, path }) => (
        <ListItem key={title} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            component={Link}
            to={path}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2,
            }}
            onClick={open ? toggleDrawer : undefined}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText primary={title} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default SidebarItems;
