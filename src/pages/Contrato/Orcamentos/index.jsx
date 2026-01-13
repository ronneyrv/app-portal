import { useEffect, useRef, useState } from "react";
import NavbarContrato from "../../../components/Contrato/NavbarContrato";
import GraficoAnual from "../../../components/Contrato/GraficoAnual";
import GraficoAcumulado from "../../../components/Contrato/GraficoAcumulado";
import GraficoOcamento from "../../../components/Contrato/GraficoOcamento";
import GraficoContrato from "../../../components/Contrato/GraficoContrato";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import {
  Box,
  Button,
  ButtonGroup,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import "../../Contrato/contrato.css";

const formatarValorParaInput = (valor) => {
  if (!valor) return 0;
  const numero = parseFloat(valor.toString().replace(",", "."));

  if (isNaN(numero)) return "";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);
};

const formatarDate = (dateString) => {
  if (!dateString) return "SEM REAJUSTE";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

export default function Orcamentos() {
  const [statusContrato, setStatusContrato] = useState(1);
  const [tipoContrato, setTipoContrato] = useState("PPTM");
  const [divWidth, setDivWidth] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState(null);
  const [projecao, setProjecao] = useState(null);
  const [fornecedores, setFornecedores] = useState([]);
  const [contrato, setContrato] = useState({
    fornecedor: "-",
    vigencia: "",
    reajuste: "",
    valor_contrato: "",
    tarifa: "",
  });
  const containerRef = useRef(null);
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const selectAno = (item) => {
    setAnoSelecionado(item);
  };

  const handleSelect = (fornecedorData) => {
    setContratoSelecionado(fornecedorData.contrato);
    setFetching(true);
    setContrato({
      fornecedor: fornecedorData.fornecedor,
      vigencia: formatarDate(fornecedorData.vigencia),
      status_vigencia: fornecedorData.status_vigencia,
      reajuste: formatarDate(fornecedorData.reajuste),
      status_reajuste: fornecedorData.status_reajuste,
      valor_contrato: formatarValorParaInput(fornecedorData.valor_contrato),
      tarifa: fornecedorData.tarifa,
    });
  };

  useEffect(() => {
    setFornecedores([]);
    fetch(
      `${API_URL}/contratos/orcamento/fornecedores/${statusContrato}/${tipoContrato}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setFornecedores(data.data);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, [statusContrato, tipoContrato]);

  useEffect(() => {
    if (!contratoSelecionado) return;
    fetch(`${API_URL}/contratos/painel/${contratoSelecionado}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          setProjecao(data.data);
          if (data.data.dadosAnuais) {
            const anos = Object.keys(data.data.dadosAnuais).map(Number);
            if (anos.length > 0) {
              const maiorAno = Math.max(...anos);
              setAnoSelecionado(maiorAno);
            }
          }
          setFetching(false);
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  }, [contratoSelecionado]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        setDivWidth(width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <NavbarContrato />
      <div className="main-orcamentos">
        <div className="container-orcamentos-left">
          <div className="container-orcamento-lt1">
            <div className="container-lt1-Fornecedor">
              <Typography
                variant="h6"
                sx={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                Fornecedor
              </Typography>
              <Box display="flex" gap={1} alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {contrato.fornecedor}
                </Typography>
              </Box>
            </div>

            <div className="container-lt1-vigencia">
              <Typography
                variant="h6"
                sx={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                Vigência: {contrato.status_vigencia}
              </Typography>
              <Box display="flex" gap={1} alignItems="center">
                <CalendarMonthIcon fontSize="medium" sx={{ color: "white" }} />
                <Typography variant="body1">{contrato.vigencia}</Typography>
              </Box>
            </div>

            <div className="container-lt1-reajuste">
              <Typography
                variant="h6"
                sx={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                Reajuste: {contrato.status_reajuste}
              </Typography>
              <Box display="flex" gap={1} alignItems="center">
                <HourglassTopIcon fontSize="medium" sx={{ color: "white" }} />
                <Typography variant="body1">{contrato.reajuste}</Typography>
              </Box>
            </div>

            <div className="container-lt1-valor">
              <Typography
                variant="h6"
                sx={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                Valor Total
              </Typography>
              <Box display="flex" gap={1} alignItems="center">
                <LocalAtmIcon fontSize="medium" sx={{ color: "white" }} />
                <Typography variant="body1">
                  {contrato.valor_contrato}
                </Typography>
              </Box>
            </div>

            <div className="container-lt1-tarifa">
              <Typography
                variant="h6"
                sx={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                Tarifas
              </Typography>
              <Box display="flex" gap={1} alignItems="center">
                <PriceChangeIcon fontSize="medium" sx={{ color: "white" }} />
                <Typography variant="body1">{contrato.tarifa}</Typography>
              </Box>
            </div>
          </div>
          <div className="container-orcamento-lt2" ref={containerRef}>
            {fetching ? (
              <>
                <div className="container-up">
                  <div className="content-contrato">
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      sx={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div className="content-orcamento">
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      sx={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
                <div className="container-down-row">
                  <div className="content-anual">
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      sx={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div className="content-acumulado">
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      sx={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {projecao && anoSelecionado ? (
                  <>
                    <div className="container-up">
                      <div className="content-contrato">
                        <GraficoContrato projecao={projecao} />
                      </div>
                      <div className="content-orcamento">
                        <GraficoOcamento
                          dadosContrato={projecao.dadosAnuais[anoSelecionado]}
                          anoSelecionado={anoSelecionado}
                        />
                      </div>
                    </div>
                    <div className="container-down-row">
                      <div className="content-anual">
                        <div className="buttons-ano">
                          <ButtonGroup
                            orientation="vertical"
                            aria-label="Vertical button group"
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiButton-root": {
                                color: "#ed6c02",
                                borderColor: "#ed6c02",
                                "&:hover": {
                                  backgroundColor: "rgba(237, 108, 2, 0.1)",
                                  borderColor: "#ed6c02",
                                },
                              },
                            }}
                          >
                            {Object.keys(projecao.dadosAnuais).map((ano) => {
                              const selected = anoSelecionado === Number(ano);
                              return (
                                <Tooltip key={ano}>
                                  <Button
                                    variant="outlined"
                                    onClick={() => selectAno(Number(ano))}
                                    sx={{
                                      backgroundColor: selected
                                        ? "#ed6c02"
                                        : "transparent",
                                      color: selected
                                        ? "#ffffff !important"
                                        : "#ed6c02",
                                    }}
                                  >
                                    {ano}
                                  </Button>
                                </Tooltip>
                              );
                            })}
                          </ButtonGroup>
                        </div>
                        <GraficoAnual
                          dadosContrato={projecao.dadosAnuais[anoSelecionado]}
                          anoSelecionado={anoSelecionado}
                          divWidth={divWidth}
                        />
                      </div>
                      <div className="content-acumulado">
                        <GraficoAcumulado projecao={projecao} />
                      </div>
                    </div>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "395px",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#999999" }}>
                      Selecione um fornecedor para carregar os gráficos...
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </div>
        </div>
        <div className="container-orcamentos-right">
          <div className="container-orcamento-rt1">
            <div className="orcamentos-status">
              <ButtonGroup
                disableElevation
                size="small"
                variant="contained"
                aria-label="Status button group"
                fullWidth
                sx={{
                  "& .MuiButton-root": {
                    borderColor: "#c25802",
                  },
                }}
              >
                <Button
                  sx={{
                    backgroundColor:
                      statusContrato === 1 ? "#ed6c02" : "#9e9e9e",
                    "&:hover": {
                      backgroundColor:
                        statusContrato === 1 ? "#d15e02" : "#757575",
                    },
                  }}
                  onClick={() => setStatusContrato(1)}
                >
                  ATIVO
                </Button>
                <Button
                  sx={{
                    backgroundColor:
                      statusContrato === 0 ? "#ed6c02" : "#9e9e9e",
                    "&:hover": {
                      backgroundColor:
                        statusContrato === 0 ? "#d15e02" : "#757575",
                    },
                  }}
                  onClick={() => setStatusContrato(0)}
                >
                  INATIVO
                </Button>
              </ButtonGroup>
              <ButtonGroup
                disableElevation
                size="small"
                variant="contained"
                aria-label="Status button group"
                fullWidth
                sx={{
                  "& .MuiButton-root": {
                    borderColor: "#c25802",
                  },
                }}
              >
                <Button
                  sx={{
                    backgroundColor:
                      tipoContrato === "PPTM" ? "#ed6c02" : "#9e9e9e",
                    "&:hover": {
                      backgroundColor:
                        tipoContrato === "PPTM" ? "#d15e02" : "#757575",
                    },
                  }}
                  onClick={() => setTipoContrato("PPTM")}
                >
                  PPTM
                </Button>
                <Button
                  sx={{
                    backgroundColor:
                      tipoContrato === "GTPC" ? "#ed6c02" : "#9e9e9e",
                    "&:hover": {
                      backgroundColor:
                        tipoContrato === "GTPC" ? "#d15e02" : "#757575",
                    },
                  }}
                  onClick={() => setTipoContrato("GTPC")}
                >
                  GTPC
                </Button>
              </ButtonGroup>
            </div>
            <div className="orcamentos-fornecedor">
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#ed6c02",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                FORNECEDOR
              </Typography>
              {!fornecedores ? (
                <>
                  <div className="buttons-fornecedor">
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      sx={{ width: "175px", height: "330px" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="buttons-fornecedor">
                    <ButtonGroup
                      orientation="vertical"
                      aria-label="Vertical button group"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiButton-root": {
                          color: "#ed6c02",
                          borderColor: "#ed6c02",
                          "&:hover": {
                            backgroundColor: "rgba(237, 108, 2, 0.1)",
                            borderColor: "#ed6c02",
                          },
                        },
                      }}
                    >
                      {fornecedores.map((item) => {
                        const isSelected =
                          contratoSelecionado === item.contrato;
                        return (
                          <Tooltip
                            key={item.contrato}
                            title={`Contrato: ${item.contrato}`}
                            placement="right"
                            arrow
                          >
                            <Button
                              variant="outlined"
                              onClick={() => handleSelect(item)}
                              sx={{
                                backgroundColor: isSelected
                                  ? "#ed6c02"
                                  : "transparent",
                                color: isSelected
                                  ? "#ffffff !important"
                                  : "#ed6c02",
                                "&:hover": {
                                  backgroundColor: isSelected
                                    ? "#e65100"
                                    : "rgba(237, 108, 2, 0.1)",
                                  borderColor: "#ed6c02",
                                },
                              }}
                            >
                              {item.fornecedor}
                            </Button>
                          </Tooltip>
                        );
                      })}
                    </ButtonGroup>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
