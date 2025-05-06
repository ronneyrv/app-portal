import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./Navbar";
import SidebarDrawer, { DrawerHeader } from "./SidebarDrawer";
import Main from "./Main";
import theme from "../styles/theme";
import ProtectedRoute from "../components/ProtectedRoute";
import LoadingSpinner from "../components/LoadingSpinner"

const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/Signup"));
const Password = lazy(() => import("../pages/Password"));
const Home = lazy(() => import("../pages/Home"));
const Estoque = lazy(() => import("../pages/Estoque"));
const Descarregamento = lazy(() => import("../pages/Descarregamento"));
const Horimetro = lazy(() => import("../pages/Horimetro"));
const Retoma = lazy(() => import("../pages/Retoma"));
const Polimero = lazy(() => import("../pages/Polimero"));
const Combustao = lazy(() => import("../pages/Combustao"));
const Ronda = lazy(() => import("../pages/Ronda"));
const ProgRetoma = lazy(() => import("../pages/ProgRetoma"));
const ProgLoto = lazy(() => import("../pages/ProgLoto"));
const Loto = lazy(() => import("../pages/Loto"));
const Rot = lazy(() => import("../pages/Rot"));
const Gestao = lazy(() => import("../pages/Gestao"));
const Admin = lazy(() => import("../pages/Admin"));

const Layout = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen((prev) => !prev);

  return (
    <ThemeProvider theme={theme}>
      <Suspense
        fallback={
          <LoadingSpinner/>
        }
      >
        <Router>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/password" element={<Password />} />
              <Route
                path="/pptm/*"
                element={
                  <ProtectedRoute>
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
                        <Route path="rot" element={<Rot />} />
                        <Route path="/gestao" element={<Gestao />} />
                        <Route path="/admin" element={<Admin />} />
                      </Routes>
                    </Main>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </Router>
      </Suspense>
    </ThemeProvider>
  );
};

export default Layout;
