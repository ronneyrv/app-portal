import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from "@mui/material";
import Navbar from "./Navbar";
import SidebarDrawer, { DrawerHeader } from "./SidebarDrawer";
import Main from "./Main";
import Home from "../pages/Home";
import Descarregamento from "../pages/Descarregamento";
import Horimetro from "../pages/Horimetro";

const Layout = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen((prev) => !prev);

  return (
    <Router>
        <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar open={open} toggleDrawer={toggleDrawer} />
      <SidebarDrawer open={open} toggleDrawer={toggleDrawer} />
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/descarregamento" element={<Descarregamento />} />
          <Route path="/horimetro" element={<Horimetro />} />
        </Routes>
      </Main>
    </Box>
    </Router>
  );
};

export default Layout;
