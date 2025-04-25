import "../styles/patio.css";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";
import SignalWifiConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiConnectedNoInternet4";
import Divider from "@mui/material/Divider";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import GppGoodIcon from "@mui/icons-material/GppGood";
import GppBadIcon from "@mui/icons-material/GppBad";
import alturas from "../assets/config/DataAlturas";
import canhoes from "../assets/config/DataCanhoes";
import stqPolimero from "../assets/config/DataStdPolimero";
import polimero from "../assets/config/DataPolimero";
import sisUmectacao from "../assets/config/DataSisUmectacao";

export default function Patio() {

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
      <div className="observacao">
        <div className="polimero">
          <h3>Validade do Polímero</h3>
          {polimero.map((item) => (
            <div
              key={item.pilha}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <WaterDropIcon style={{ fontSize: 15, color: item.cor }} />
              <span>
                {item.pilha}: {item.validade} - {item.acao}
              </span>
            </div>
          ))}
          <label>Estoque de Polímero:</label>
          <div className="stqPol">
            {stqPolimero.map((item, index) => (
              <div key={index}>
                {item.cliente}: {item.litro} litros
              </div>
            ))}
          </div>
        </div>
        <Divider />
        <div className="umectacao">
          <h3>Sistema de Umectação</h3>
          <div>
            {sisUmectacao.map((item, index) => (
              <div key={index} className="umectacao-status">
                {item.disponível ? (
                  <GppGoodIcon style={{ fontSize: 20, color: "#76ff03" }} />
                ) : (
                  <GppBadIcon style={{ fontSize: 20, color: "#ff1744" }} />
                )}
                {item.disponível ? (
                  <h4>Sistema Disponível</h4>
                ) : (
                  <h4>Sistema Indisponível</h4>
                )}
              </div>
            ))}

            <div className="umectacao-legenda">
              <label>Legenda:</label>
              <div className="legenda">
                <div>
                  <SignalWifiStatusbar4BarIcon
                    style={{ fontSize: 15, color: "#76ff03" }}
                  />
                  <span>DISPONÍVEL</span>
                </div>
                <div>
                  <SignalWifiOffIcon
                    style={{ fontSize: 15, color: "#757575" }}
                  />
                  <span>DESABILITADO</span>
                </div>
                <div>
                  <SignalWifiConnectedNoInternet4Icon
                    style={{ fontSize: 15, color: "#FF0000" }}
                  />
                  <span>INDISPONÍVEL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider />

        <div className="obs">
          <h3>Observações:</h3>
          <textarea rows={7}></textarea>
        </div>
      </div>
    </div>
  );
}
