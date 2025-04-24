import "../styles/patio.css";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";
import SignalWifiConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiConnectedNoInternet4";
import Divider from "@mui/material/Divider";

export default function Patio() {
  const alturas = {
    "1A": 7,
    "1B": 7,
    "2A": 8,
    "2B": 5,
    "2C": 10,
    "2D": 0,
    "3A": 8,
    "3B": 10,
  };
  const canhoes = [
    {
      can: "A1",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A2",
      modo: "indisponivel",
      icon: "SignalWifiConnectedNoInternet4Icon",
      cor: "#FF0000",
      lado: "rotate(0deg)",
    },
    {
      can: "A3",
      modo: "desabilitado",
      icon: "SignalWifiOffIcon",
      cor: "#757575",
      lado: "rotate(0deg)",
    },
    {
      can: "A4",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A5",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A6",
      modo: "indisponivel",
      icon: "SignalWifiConnectedNoInternet4Icon",
      cor: "#FF0000",
      lado: "rotate(0deg)",
    },
    {
      can: "A7",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A8",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A9",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A10",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A11",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A12",
      modo: "desabilitado",
      icon: "SignalWifiOffIcon",
      cor: "#757575",
      lado: "rotate(180deg)",
    },
    {
      can: "A13",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A14",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A15",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A16",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A17",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A18",
      modo: "indisponivel",
      icon: "SignalWifiConnectedNoInternet4Icon",
      cor: "#FF0000",
      lado: "rotate(180deg)",
    },
    {
      can: "A19",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A20",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A21",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A22",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A23",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A24",
      modo: "desabilitado",
      icon: "SignalWifiOffIcon",
      cor: "#757575",
      lado: "rotate(0deg)",
    },
    {
      can: "A25",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A26",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A27",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A28",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A29",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A30",
      modo: "indisponivel",
      icon: "SignalWifiConnectedNoInternet4Icon",
      cor: "#FF0000",
      lado: "rotate(180deg)",
    },
    {
      can: "A31",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A32",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A33",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A34",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A35",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A36",
      modo: "desabilitado",
      icon: "SignalWifiOffIcon",
      cor: "#757575",
      lado: "rotate(180deg)",
    },
    {
      can: "A37",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A38",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A39",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A40",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A41",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A42",
      modo: "indisponivel",
      icon: "SignalWifiConnectedNoInternet4Icon",
      cor: "#FF0000",
      lado: "rotate(0deg)",
    },
    {
      can: "A43",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A44",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A45",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(0deg)",
    },
    {
      can: "A46",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A47",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A48",
      modo: "desabilitado",
      icon: "SignalWifiOffIcon",
      cor: "#757575",
      lado: "rotate(180deg)",
    },
    {
      can: "A49",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A50",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A51",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A52",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A53",
      modo: "disponivel",
      icon: "SignalWifiStatusbar4BarIcon",
      cor: "#76ff03",
      lado: "rotate(180deg)",
    },
    {
      can: "A54",
      modo: "indisponivel",
      icon: "SignalWifiConnectedNoInternet4Icon",
      cor: "#FF0000",
      lado: "rotate(180deg)",
    },
  ];

  const iconMap = {
    SignalWifiStatusbar4BarIcon,
    SignalWifiConnectedNoInternet4Icon,
    SignalWifiOffIcon,
  };

  const calcEstiloTopo = (id, altura) => {
    if (id.startsWith("2")) {
      const padding = 45 - altura * 2.1;
      const margin = altura * 2;
      return {
        padding: `${padding}px`,
        margin: `${margin}px`,
      };
    }

    const padding = 20 - altura * 1.8;
    const margin = altura * 1.8;
    return {
      padding: `${padding}px`,
      margin: `${margin}px`,
    };
  };

  const renderPilha = (id) => (
    <div className={`topo-${id}`} style={calcEstiloTopo(id, alturas[id])}>
      {id}
    </div>
  );

  return (
    <div className="containe-patio">
      <div className=" layout">
        <div className="patio">
          <div className="patio-3">
            <div className="can-linha-6">
              {[...canhoes.slice(45, 54).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <div key={index} title={item.can}>
                    <IconComponent
                      sx={{
                        color: item.cor,
                        fontSize: 20,
                        transform: item.lado,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="pilhas">
              <div className="pilha-3B">{renderPilha("3B")}</div>
              <div className="pilha-3A">{renderPilha("3A")}</div>
            </div>
            <div className="can-linha-5">
              {[...canhoes.slice(36, 45).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <div key={index} title={item.can}>
                    <IconComponent
                      sx={{
                        color: item.cor,
                        fontSize: 20,
                        transform: item.lado,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <Divider />
          <div className="patio-2">
            <div className="can-linha-4">
              {[...canhoes.slice(27, 36).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <div key={index} title={item.can}>
                    <IconComponent
                      sx={{
                        color: item.cor,
                        fontSize: 20,
                        transform: item.lado,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="pilhas">
              <div className="pilha-2D">{renderPilha("2D")}</div>
              <div className="pilha-2C">{renderPilha("2C")}</div>
              <div className="pilha-2B">{renderPilha("2B")}</div>
              <div className="pilha-2A">{renderPilha("2A")}</div>
            </div>
            <div className="can-linha-3">
              {[...canhoes.slice(18, 27).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <div key={index} title={item.can}>
                    <IconComponent
                      sx={{
                        color: item.cor,
                        fontSize: 20,
                        transform: item.lado,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <Divider />
          <div className="patio-1">
            <div className="can-linha-2">
              {[...canhoes.slice(9, 18).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <div key={index} title={item.can}>
                    <IconComponent
                      sx={{
                        color: item.cor,
                        fontSize: 20,
                        transform: item.lado,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="pilhas">
              <div className="pilha-1B">{renderPilha("1B")}</div>
              <div className="pilha-1A">{renderPilha("1A")}</div>
            </div>

            <div className="can-linha-1">
              {[...canhoes.slice(0, 9).reverse()].map((item, index) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <div key={index} title={item.can}>
                    <IconComponent
                      sx={{
                        color: item.cor,
                        fontSize: 20,
                        transform: item.lado,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="obs"></div>
    </div>
  );
}
