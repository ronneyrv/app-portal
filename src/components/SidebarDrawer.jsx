import React from "react";
import { Drawer as MuiDrawer, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import SidebarItems from "./SidebarItems";

/* Lista de itens do Drawer */
import DirectionsBoatOutlinedIcon from "@mui/icons-material/DirectionsBoatOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CycloneOutlinedIcon from "@mui/icons-material/CycloneOutlined";
import FilterHdrOutlinedIcon from "@mui/icons-material/FilterHdrOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import InvertColorsOutlinedIcon from "@mui/icons-material/InvertColorsOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import MobileFriendlyOutlinedIcon from "@mui/icons-material/MobileFriendlyOutlined";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventNoteIcon from '@mui/icons-material/EventNote';
const drawerItems = [
  {
    title: "Estoque",
    icon: <FilterHdrOutlinedIcon />,
    path: "/pptm/estoque",
    permissao: 7,
  },
  {
    title: "Descarregamento",
    icon: <DirectionsBoatOutlinedIcon />,
    path: "/pptm/descarregamento",
    permissao: 7,
  },
  {
    title: "Retoma",
    icon: <CycloneOutlinedIcon />,
    path: "/pptm/retoma",
    permissao: 1,//7
  },
  {
    title: "Horímetro",
    icon: <AgricultureOutlinedIcon />,
    path: "/pptm/horimetro",
    permissao: 1,//7
  },
  {
    title: "Polímero",
    icon: <InvertColorsOutlinedIcon />,
    path: "/pptm/polimero",
    permissao: 1,//7
  },
  {
    title: "Autocombustão",
    icon: <LocalFireDepartmentOutlinedIcon />,
    path: "/pptm/combustao",
    permissao: 1,//7
  },
  {
    title: "Rondas",
    icon: <MobileFriendlyOutlinedIcon />,
    path: "/pptm/ronda",
    permissao: 1,//7
  },
  {
    title: "Prog. de Retoma",
    icon: <EventNoteIcon />,
    path: "/pptm/programacao-retoma",
    permissao: 6,
  },
  {
    title: "Prog. de LOTO",
    icon: <PendingActionsIcon />,
    path: "/pptm/programacao-loto",
    permissao: 1,//7
  },
  {
    title: "LOTO",
    icon: <LockPersonOutlinedIcon />,
    path: "/pptm/loto",
    permissao: 1,//7
  },
  {
    title: "ROT",
    icon: <MenuBookOutlinedIcon />,
    path: "/pptm/rot",
    permissao: 7,
  },
  {
    title: "Gestão",
    icon: <GroupsOutlinedIcon />,
    path: "/pptm/gestao",
    permissao: 5,
  },
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
          src="/images/logo_pptm.png" 
          alt="Logo PPTM"
          style={{ height: 40, objectFit: "contain" }}
          onClick={toggleDrawer}
        />

        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <SidebarItems
        items={drawerItems}
        open={open}
        toggleDrawer={toggleDrawer}
      />
    </Drawer>
  );
};

export default SidebarDrawer;
export { DrawerHeader };
