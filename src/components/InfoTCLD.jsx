import Relogio from "../components/GraficRelogio";
import "../styles/infotcld.css";

export default function InfoTCLD({ dados }) {
  return (
    <div className="grid-tcld">
      <div className="info-navio">
        <div className="info-navio-row">
          <div>
            <label>Cliente:</label>
            <input
              type="text"
              style={{ width: "150px" }}
              defaultValue={dados[0].cliente}
              readOnly
            />
          </div>
          <div>
            <label>Navio:</label>
            <input
              type="text"
              style={{ width: "230px" }}
              defaultValue={dados[0].navio}
              readOnly
            />
          </div>
          <div>
            <label>Arqueação Inicial:</label>
            <input
              type="text"
              style={{ width: "120px" }}
              defaultValue={dados[0].arqueacao}
              readOnly
            />
          </div>
        </div>
        <div className="info-navio-row">
          <div>
            <label>Atracação:</label>
            <input type="text" defaultValue={dados[0].atracacao} readOnly />
          </div>
          <div>
            <label>Início da operação:</label>
            <input type="text" defaultValue={dados[0].inicioOP} readOnly />
          </div>
        </div>
        <div className="info-navio-row">
          <div>
            <label>Saldo à Bordo:</label>
            <input type="text" defaultValue={dados[0].saldo} readOnly />
          </div>
          <div>
            <label>Previsão de Término:</label>
            <input type="text" defaultValue={dados[0].fimOP} readOnly />
          </div>
        </div>
      </div>

      <div className="info-relogio">
        <Relogio plano={dados[0].meta} real={dados[0].dias} readOnly />
      </div>
    </div>
  );
}
