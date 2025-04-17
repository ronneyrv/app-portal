import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import SidebarDrawer, { DrawerHeader } from './SidebarDrawer';
import Main from './Main';

const Layout = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen((prev) => !prev);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar open={open} toggleDrawer={toggleDrawer} />
      <SidebarDrawer open={open} toggleDrawer={toggleDrawer} />
      <Main open={open}>
        <DrawerHeader />

      </Main>
    </Box>
  );
};

export default Layout;
