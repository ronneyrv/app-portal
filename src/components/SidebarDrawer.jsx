import React from "react";
import { Drawer as MuiDrawer, IconButton, Divider } from "@mui/material";
import { ChevronLeft, ChevronRight, Inbox, Mail } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import SidebarItems from "./SidebarItems";
import logo from "../assets/images/logo_pptm.png";

/* Lista de itens do Drawer */
import DirectionsBoatOutlinedIcon from "@mui/icons-material/DirectionsBoatOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import CycloneOutlinedIcon from '@mui/icons-material/CycloneOutlined';
import FilterHdrOutlinedIcon from '@mui/icons-material/FilterHdrOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InvertColorsOutlinedIcon from '@mui/icons-material/InvertColorsOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import MobileFriendlyOutlinedIcon from '@mui/icons-material/MobileFriendlyOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import PlaylistAddCheckCircleOutlinedIcon from '@mui/icons-material/PlaylistAddCheckCircleOutlined';

const drawerItems = [
  { title: "Estoque", icon: <FilterHdrOutlinedIcon />, path: "/estoque" },
  { title: "Descarregamento", icon: <DirectionsBoatOutlinedIcon />, path: "/descarregamento", },
  { title: "Retoma", icon: <CycloneOutlinedIcon />, path: "/retoma" },
  { title: "Horímetro", icon: <AgricultureOutlinedIcon />, path: "/horimetro" },
  { title: "Polímero", icon: <InvertColorsOutlinedIcon />, path: "/polimero" },
  { title: "Autocombustão", icon: <LocalFireDepartmentOutlinedIcon />, path: "/combustao" },
  { title: "Rondas", icon: <MobileFriendlyOutlinedIcon />, path: "/ronda" },
  { title: "Prog. de Retoma", icon: <PlaylistAddCheckCircleOutlinedIcon />, path: "/programacao-retoma" },
  { title: "Prog. de LOTO", icon: <LockResetOutlinedIcon />, path: "/programacao-loto" },
  { title: "LOTO", icon: <LockPersonOutlinedIcon />, path: "/loto" },
  { title: "ROT", icon: <MenuBookOutlinedIcon />, path: "/rot" },
  { title: "Gestão", icon: <GroupsOutlinedIcon />, path: "/gestao" },
];
/* /Lista de itens do Drawer */

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `60px`,
  [theme.breakpoints.up("sm")]: {
    width: `60px`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SidebarDrawer = ({ open, toggleDrawer }) => {
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <img
          src={logo}
          alt="Logo PPTM"
          style={{ height: 40, objectFit: "contain" }}
        />

        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <SidebarItems items={drawerItems} open={open} toggleDrawer={toggleDrawer} />
    </Drawer>
  );
};

export default SidebarDrawer;
export { DrawerHeader };
