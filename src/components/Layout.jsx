import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from "@mui/material";
import Navbar from "./Navbar";
import SidebarDrawer, { DrawerHeader } from "./SidebarDrawer";
import Main from "./Main";
import Home from "../pages/Home";
import Estoque from "../pages/Estoque";
import Descarregamento from "../pages/Descarregamento";
import Horimetro from "../pages/Horimetro";
import Retoma from "../pages/Retoma";
import Polimero from "../pages/Polimero";
import Combustao from "../pages/Combustao";
import Ronda from "../pages/Ronda";
import ProgRetoma from "../pages/ProgRetoma";
import ProgLoto from "../pages/ProgLoto";
import Loto from "../pages/Loto";
import Rot from "../pages/Rot";
import Gestao from "../pages/Gestao";

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
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/descarregamento" element={<Descarregamento />} />
          <Route path="/retoma" element={<Retoma />} />
          <Route path="/horimetro" element={<Horimetro />} />
          <Route path="/polimero" element={<Polimero />} />
          <Route path="/combustao" element={<Combustao />} />
          <Route path="/ronda" element={<Ronda />} />
          <Route path="/programacao-retoma" element={<ProgRetoma />} />
          <Route path="/programacao-loto" element={<ProgLoto />} />
          <Route path="/loto" element={<Loto />} />
          <Route path="/rot" element={<Rot />} />
          <Route path="/gestao" element={<Gestao />} />
        </Routes>
      </Main>
    </Box>
    </Router>
  );
};

export default Layout;
