import React from 'react';
import {
  Drawer as MuiDrawer,
  IconButton,
  Divider,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Inbox, Mail } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import SidebarItems from './SidebarItems';
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';

const drawerWidth = 240;

const drawerItems = [
  { title: 'Descarregamento', icon: <DirectionsBoatOutlinedIcon />, path: '/descarregamento' },
  { title: 'Horímetro', icon: <AgricultureOutlinedIcon />, path: '/horimetro' },
]

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `60px`,
  [theme.breakpoints.up('sm')]: {
    width: `60px`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const SidebarDrawer = ({ open, toggleDrawer }) => {

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <SidebarItems items={drawerItems} open={open} />
    </Drawer>
  );
};

export default SidebarDrawer;
export { DrawerHeader };
