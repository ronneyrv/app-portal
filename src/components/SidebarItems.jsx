import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";

const SidebarItems = ({ items, open, toggleDrawer }) => {
  const location = useLocation();
  return (
    <List>
      {items.map(({ title, icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <ListItem key={title} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={path}
              selected={isActive}
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
                  color: isActive ? "primary.main" : "inherit",
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontWeight: isActive ? "bold" : "normal",
                      color: isActive ? "primary.main" : "inherit",
                      opacity: open ? 1 : 0,
                    }}
                  >
                    {title}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SidebarItems;
