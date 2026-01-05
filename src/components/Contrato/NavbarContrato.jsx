import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./NavbarContrato.css";

export default function NavbarContrato() {
  return (
    <div className="main-buttons">
      <Button
        variant="contained"
        size="small"
        component={Link}
        to="/pptm/contratos"
      >
        Contratos
      </Button>
      <Button
        variant="contained"
        size="small"
        component={Link}
        to="/pptm/contratos/medicoes"
      >
        Medições
      </Button>
      <Button
        variant="contained"
        size="small"
        component={Link}
        to="/pptm/contratos/orcamentos"
      >
        Painel
      </Button>
    </div>
  );
}
