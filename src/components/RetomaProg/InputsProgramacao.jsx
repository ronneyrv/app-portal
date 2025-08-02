import { useState, useEffect, useRef } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NotifyBar from "../NotifyBar";
import "./inputsProgramacao.css";

export default function InputsProgramacao({ dias, semana }) {
  const [loading, setLoading] = useState(false);
  const [comentarios, setComentarios] = useState({});
  const [selecaoMaquina, setSelecaoMaquina] = useState({});
  const [selecaoPilha, setSelecaoPilha] = useState({});
  const [selecaoEmpilha, setSelecaoEmpilha] = useState({});
  const [pilhas, setPilhas] = useState([]);
  const [textoManual, setTextoManual] = useState({});

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const opcoesPilhaPadrao = ["1A", "1B", "2A", "2B", "2C", "2D", "3A", "3B"];
  const opcoesPilhaM1 = ["1A", "1B", "2A", "2B", "2C", "2D"];
  const opcoesPilhaM2 = ["2A", "2B", "2C", "2D", "3A", "3B"];
  const opcoesMaquina = ["STACKER 1", "STACKER 2", "ESCAVADEIRA"];
  const opcoesEmpilha = ["STACKER 1", "STACKER 2", "TMUT"];

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetch(`${API_URL}/descarregamento/pilhas`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (data.type === "success") setPilhas(data.data);
      })
      .catch(console.error);
  }, []);

  const Dropdown = ({
    bloco,
    index,
    opcoes,
    selecionado,
    onSelect,
    isCheckbox,
  }) => {
    return (
      <div
        className="inputs-programacao-dropdown"
        style={{ padding: isCheckbox ? 0 : "5px" }}
      >
        {opcoes.map((item, i) =>
          isCheckbox ? (
            <label key={i} className="inputs-programacao-dropdown-checkbox">
              <input
                type="checkbox"
                checked={(selecionado || []).includes(item)}
                onChange={() => onSelect(bloco, index, item)}
              />{" "}
              {item}
            </label>
          ) : (
            <div
              key={i}
              onClick={() => onSelect(bloco, index, item)}
              className={`inputs-programacao-dropdown-item ${
                selecionado === item ? "selected" : ""
              }`}
            >
              {item}
            </div>
          )
        )}
      </div>
    );
  };

  const handleSalvar = () => {
    setLoading(true);
    const programacao = gerarProgramacaoCompleta();

    fetch(`${API_URL}/prog-retoma`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(programacao),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("HTTP status:", res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.type === "success") {
          setLoading(false);
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        } else {
          setLoading(false);
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
      })
      .catch((err) => {
        console.error("Erro ao adicionar programação:", err);
        setLoading(false);
      });
  };

  const handleTextoManualChange = (bloco, index, value) => {
    const key = `comentario-${bloco}-${index}`;
    setTextoManual((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDoubleClickInput = (bloco, index, tipo) => {
    const chave = `${tipo}-${bloco}-${index}`;

    if (tipo === "maquina") {
      setSelecaoMaquina((prev) => ({ ...prev, [chave]: "" }));
    } else if (tipo === "empilha") {
      setSelecaoEmpilha((prev) => ({ ...prev, [chave]: "" }));
    } else if (tipo === "pilhas") {
      setSelecaoPilha((prev) => ({
        ...prev,
        [chave]: bloco === "Empilha" ? "" : [],
      }));
    } else if (tipo === "comentario") {
      setTextoManual((prev) => ({ ...prev, [chave]: "" }));
    }
  };

  const toggleDropdown = (tipo, bloco, index) => {
    const key = `${tipo}-${bloco}-${index}`;
    const setter =
      tipo === "maquina"
        ? setSelecaoMaquina
        : tipo === "empilha"
        ? setSelecaoEmpilha
        : setSelecaoPilha;

    setter((prev) => ({
      ...prev,
      [`dropdownAberto-${key}`]: !prev[`dropdownAberto-${key}`],
    }));
  };

  const toggleMaquina = (bloco, index, valor) => {
    const key = `${bloco}-${index}`;
    setSelecaoMaquina((prev) => ({
      ...prev,
      [`maquina-${key}`]: valor,
      [`dropdownAberto-maquina-${key}`]: false,
    }));
  };

  const toggleEmpilha = (bloco, index, valor) => {
    const key = `${bloco}-${index}`;
    setSelecaoEmpilha((prev) => ({
      ...prev,
      [`empilha-${key}`]: valor,
      [`dropdownAberto-empilha-${key}`]: false,
    }));
  };

  const togglePilha = (bloco, index, valor) => {
    const chave = `pilhas-${bloco}-${index}`;
    const isEmpilha = bloco === "Empilha";

    if (isEmpilha) {
      setSelecaoPilha((prev) => ({
        ...prev,
        [chave]: [valor],
        [`dropdownAberto-pilhas-${bloco}-${index}`]: false,
      }));
    } else {
      const atuais = selecaoPilha[chave] || [];
      const novaLista = atuais.includes(valor)
        ? atuais.filter((p) => p !== valor)
        : [...atuais, valor];

      setSelecaoPilha((prev) => ({
        ...prev,
        [chave]: novaLista,
      }));
    }
  };

  useEffect(() => {
    const navioAdd = {};
    ["UG1", "UG2", "UG3", "Empilha"].forEach((bloco) => {
      dias.forEach((_, index) => {
        const key = `${bloco}-${index}`;
        const pilhasSelecionadas = selecaoPilha[`pilhas-${key}`] || [];
        const navios = pilhas
          .filter((p) => pilhasSelecionadas.includes(p.pilha))
          .map((p) => p.navio);
        navioAdd[`comentario-${key}`] = [...new Set(navios)].join("; ");
      });
    });
    setComentarios(navioAdd);
  }, [selecaoPilha, pilhas, dias]);

  const renderBloco = (bloco, usarMaquina = true, usarEmpilha = false) => (
    <div className="inputs-programacao-bloco">
      <div className="inputs-programacao-linha">
        <div
          className={`inputs-programacao-cabecalho ${
            usarEmpilha ? "inputs-programacao-cabecalho-empilha" : ""
          }`}
        >
          <h2>{bloco}</h2>
        </div>

        {dias.map((dia, index) => {
          const chaveMaquina = `maquina-${bloco}-${index}`;
          const chaveEmpilha = `empilha-${bloco}-${index}`;
          const chavePilha = `pilhas-${bloco}-${index}`;
          const comentarioKey = `comentario-${bloco}-${index}`;

          const maquinaSelecionada =
            selecaoMaquina[chaveMaquina] || selecaoEmpilha[chaveEmpilha];
          let opcoesPilhaDinamica = opcoesPilhaPadrao;

          if (maquinaSelecionada === "STACKER 1") {
            opcoesPilhaDinamica = opcoesPilhaM1;
          } else if (maquinaSelecionada === "STACKER 2") {
            opcoesPilhaDinamica = opcoesPilhaM2;
          }

          return (
            <div key={index} className="inputs-programacao-coluna">
              <h5 className="inputs-programacao-dia">{dia}</h5>

              {usarMaquina && (
                <div className="inputs-programacao-input-container">
                  <input
                    type="text"
                    placeholder="Máquina"
                    readOnly
                    className="inputs-programacao-input"
                    value={selecaoMaquina[chaveMaquina] || ""}
                    onDoubleClick={() =>
                      handleDoubleClickInput(bloco, index, "maquina")
                    }
                  />
                  <AddBoxIcon
                    className="button-add"
                    onClick={() => toggleDropdown("maquina", bloco, index)}
                  />
                  {selecaoMaquina[
                    `dropdownAberto-maquina-${bloco}-${index}`
                  ] && (
                    <Dropdown
                      bloco={bloco}
                      index={index}
                      opcoes={opcoesMaquina}
                      tipo="maquina"
                      selecionado={selecaoMaquina[chaveMaquina]}
                      onSelect={toggleMaquina}
                    />
                  )}
                </div>
              )}

              {usarEmpilha && (
                <div className="inputs-programacao-input-container">
                  <input
                    type="text"
                    placeholder="Máquina"
                    readOnly
                    className="inputs-programacao-input"
                    value={selecaoEmpilha[chaveEmpilha] || ""}
                    onDoubleClick={() =>
                      handleDoubleClickInput(bloco, index, "empilha")
                    }
                  />
                  <AddBoxIcon
                    className="button-add"
                    onClick={() => toggleDropdown("empilha", bloco, index)}
                  />
                  {selecaoEmpilha[
                    `dropdownAberto-empilha-${bloco}-${index}`
                  ] && (
                    <Dropdown
                      bloco={bloco}
                      index={index}
                      opcoes={opcoesEmpilha}
                      tipo="empilha"
                      selecionado={selecaoEmpilha[chaveEmpilha]}
                      onSelect={toggleEmpilha}
                    />
                  )}
                </div>
              )}

              {/* PILHA */}
              <div className="inputs-programacao-input-container">
                <input
                  type="text"
                  placeholder="Pilha"
                  readOnly
                  className="inputs-programacao-input"
                  value={
                    bloco === "Empilha"
                      ? selecaoPilha[chavePilha] || ""
                      : (selecaoPilha[chavePilha] || []).join(", ")
                  }
                  onDoubleClick={() =>
                    handleDoubleClickInput(bloco, index, "pilhas")
                  }
                />
                <AddBoxIcon
                  className="button-add"
                  onClick={() => toggleDropdown("pilhas", bloco, index)}
                />
                {selecaoPilha[`dropdownAberto-pilhas-${bloco}-${index}`] && (
                  <Dropdown
                    bloco={bloco}
                    index={index}
                    opcoes={opcoesPilhaDinamica}
                    tipo="pilha"
                    selecionado={
                      selecaoPilha[chavePilha] ||
                      (bloco === "Empilha" ? "" : [])
                    }
                    onSelect={togglePilha}
                    isCheckbox={bloco !== "Empilha"}
                    fecharAoSelecionar={bloco === "Empilha"}
                  />
                )}
              </div>

              {/* TEXTAREA */}
              <textarea
                rows={usarEmpilha ? 1 : 4}
                placeholder={usarEmpilha ? "Nome do navio?" : "Navios"}
                className="inputs-programacao-textarea"
                readOnly={!usarEmpilha ? true : false}
                value={
                  usarEmpilha
                    ? textoManual[comentarioKey] || ""
                    : comentarios[comentarioKey] || ""
                }
                onChange={(e) =>
                  usarEmpilha &&
                  handleTextoManualChange(bloco, index, e.target.value)
                }
              />
            </div>
          );
        })}

        <textarea
          placeholder="Observações:"
          className={`inputs-programacao-textarea-final ${
            usarEmpilha
              ? "inputs-programacao-textarea-final-empilha"
              : "inputs-programacao-textarea-final-ug"
          }`}
        />
      </div>
    </div>
  );

  const gerarProgramacaoCompleta = () => {
    const formatarData = (dataBR) => {
      const [dia, mes, ano] = dataBR.split("/");
      return `${ano}-${mes}-${dia}`;
    };

    const programacoes = dias.map((dia, index) => ({
      dia: formatarData(dia),
      semana: semana,

      maquina_ug1: selecaoMaquina[`maquina-UG1-${index}`] || "",
      pilha_ug1: (selecaoPilha[`pilhas-UG1-${index}`] || []).join(", "),
      navio_ug1: comentarios[`comentario-UG1-${index}`] || "",
      obs_ug1:
        document.querySelectorAll(".inputs-programacao-textarea-final-ug")[0]
          ?.value || "",

      maquina_ug2: selecaoMaquina[`maquina-UG2-${index}`] || "",
      pilha_ug2: (selecaoPilha[`pilhas-UG2-${index}`] || []).join(", "),
      navio_ug2: comentarios[`comentario-UG2-${index}`] || "",
      obs_ug2:
        document.querySelectorAll(".inputs-programacao-textarea-final-ug")[1]
          ?.value || "",

      maquina_ug3: selecaoMaquina[`maquina-UG3-${index}`] || "",
      pilha_ug3: (selecaoPilha[`pilhas-UG3-${index}`] || []).join(", "),
      navio_ug3: comentarios[`comentario-UG3-${index}`] || "",
      obs_ug3:
        document.querySelectorAll(".inputs-programacao-textarea-final-ug")[2]
          ?.value || "",

      maquina_empilha: selecaoEmpilha[`empilha-Empilha-${index}`] || "",
      pilha_empilha: (selecaoPilha[`pilhas-Empilha-${index}`] || []).join(", "),
      navio_empilha: textoManual[`comentario-Empilha-${index}`] || "",
      obs_empilha:
        document.querySelector(".inputs-programacao-textarea-final-empilha")
          ?.value || "",
    }));

    return programacoes;
  };

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      {loading ? <LoadingSpinner /> : null}
      {["UG1", "UG2", "UG3"].map((item) => (
        <div key={item}>{renderBloco(item, true, false)}</div>
      ))}
      {renderBloco("Empilha", false, true)}
      {
        <button onClick={handleSalvar} className="button-save">
          Salvar Programação de Retoma
        </button>
      }
    </div>
  );
}
