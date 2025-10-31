import { useUsuario } from "../contexts/useUsuario";
import { Link, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

const SidebarItems = ({ items, open, toggleDrawer }) => {
  const { usuario } = useUsuario();
  const location = useLocation();
  return (
    <List>
      {usuario.nivel == 10 && (
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <InsertEmoticonIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: "bold",
                    opacity: open ? 1 : 0,
                  }}
                >
                  Bem vindo!
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      )}{" "}
      {items
        .filter((item) => usuario.nivel <= item.permissao)
        .map(({ title, icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <ListItem key={title} disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={title} 
                placement="right"
                disableHoverListener={open}
                arrow // ⬅️ Adiciona uma seta ao Tooltip
              >
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
              </Tooltip>
            </ListItem>
          );
        })}
    </List>
  );
};

export default SidebarItems;
