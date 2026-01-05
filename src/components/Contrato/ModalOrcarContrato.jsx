import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import NotifyBar from "../NotifyBar";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";

const formatarValorParaInput = (valor) => {
  if (!valor) return 0;
  const numero = parseFloat(valor.toString().replace(",", "."));

  if (isNaN(numero)) return "";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);
};

const prepararNumero = (value) => {
  const isNegative = value.startsWith("-");
  let cleanedValue = value.replace(/-/g, "").replace(/[^0-9,]/g, "");
  const endsWithComma = cleanedValue.endsWith(",");
  const parts = cleanedValue.split(",");
  if (parts.length > 2) {
    cleanedValue = parts[0] + "," + parts.slice(1).join("");
  }

  if (
    cleanedValue.length > 1 &&
    cleanedValue.startsWith("0") &&
    !cleanedValue.startsWith("0,")
  ) {
    cleanedValue = cleanedValue.substring(1);
  }

  if (
    cleanedValue === "" ||
    cleanedValue === "," ||
    value === "-" ||
    value === "-,"
  ) {
    if (isNegative && cleanedValue.length > 0) {
      return "-" + cleanedValue;
    }
    return isNegative ? value : cleanedValue;
  }
  const numericValue = parseFloat(cleanedValue.replace(",", "."));

  if (isNaN(numericValue)) {
    return isNegative ? "-" + cleanedValue : cleanedValue;
  }

  const decimalPart = cleanedValue.split(",")[1];
  const decimalLength = decimalPart ? decimalPart.length : 0;
  const maxDigits = 3; 

  const options = {
    minimumFractionDigits: Math.min(decimalLength, maxDigits),
    maximumFractionDigits: maxDigits,
    useGrouping: true,
  };
  const formatter = new Intl.NumberFormat("pt-BR", options);
  let formatted = formatter.format(numericValue * (isNegative ? -1 : 1));

  if (endsWithComma && !formatted.includes(",")) {
    return formatted + ",";
  }

  return formatted;
};

export default function ModalOrcarContrato({
  abrirModalOrcarContrato,
  setAbrirModalOrcarContrato,
  rowContrato,
  setRowContrato,
  fetchContratos,
}) {
  const chartRef = useRef(null);
  const [projecao, setProjecao] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formRowData, setFormRowData] = useState({
    ano: "",
    plano_orcamentario: "",
    contrato: "",
    fornecedor: "",
    vigencia: "",
    valor_contrato: "",
    valor_realizado: "",
    valor_saldo: "",
  });
  const [notify, setNotify] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const handleClose = () => {
    setAbrirModalOrcarContrato(false);
    setRowContrato([]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("previsto_")) {
      setFormRowData((prevData) => ({
        ...prevData,
        [name]: prepararNumero(value),
      }));
    } else {
      setFormRowData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formRowData.ano || !formRowData.contrato || !formRowData.fornecedor) {
      setNotify({
        open: true,
        message: "Ha campo obrigatório não preenchidos",
        severity: "info",
      });
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/contratos/provisoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ dados: formRowData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type == "success") {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
          fetchContratos();
          handleClose();
        } else {
          setNotify({
            open: true,
            message: data.message,
            severity: data.type,
          });
        }
        setLoading(false);
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  const fetchProvisoes = () => {
    fetch(`${API_URL}/contratos/${formRowData.ano}/${formRowData.contrato}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "success") {
          const provisao = data.data[0];
          setProjecao(provisao);
          setFormRowData((prevData) => ({
            ...prevData,
            plano_orcamentario: provisao.plano_orcamentario,
            valor_contrato: formatarValorParaInput(provisao.valor_contrato),
            valor_realizado: formatarValorParaInput(
              provisao.valor_medido_contrato
            ),
            valor_saldo: formatarValorParaInput(provisao.valor_saldo),
            previsto_1: formatarValorParaInput(provisao.previsto_1),
            previsto_2: formatarValorParaInput(provisao.previsto_2),
            previsto_3: formatarValorParaInput(provisao.previsto_3),
            previsto_4: formatarValorParaInput(provisao.previsto_4),
            previsto_5: formatarValorParaInput(provisao.previsto_5),
            previsto_6: formatarValorParaInput(provisao.previsto_6),
            previsto_7: formatarValorParaInput(provisao.previsto_7),
            previsto_8: formatarValorParaInput(provisao.previsto_8),
            previsto_9: formatarValorParaInput(provisao.previsto_9),
            previsto_10: formatarValorParaInput(provisao.previsto_10),
            previsto_11: formatarValorParaInput(provisao.previsto_11),
            previsto_12: formatarValorParaInput(provisao.previsto_12),
            realizado_1: formatarValorParaInput(provisao.realizado_1),
            realizado_2: formatarValorParaInput(provisao.realizado_2),
            realizado_3: formatarValorParaInput(provisao.realizado_3),
            realizado_4: formatarValorParaInput(provisao.realizado_4),
            realizado_5: formatarValorParaInput(provisao.realizado_5),
            realizado_6: formatarValorParaInput(provisao.realizado_6),
            realizado_7: formatarValorParaInput(provisao.realizado_7),
            realizado_8: formatarValorParaInput(provisao.realizado_8),
            realizado_9: formatarValorParaInput(provisao.realizado_9),
            realizado_10: formatarValorParaInput(provisao.realizado_10),
            realizado_11: formatarValorParaInput(provisao.realizado_11),
            realizado_12: formatarValorParaInput(provisao.realizado_12),
          }));
        }
      })
      .catch((err) => console.error("Erro de rede:", err));
  };

  useEffect(() => {
    if (!formRowData.ano || formRowData.ano.length < 4) return;
    fetchProvisoes();
  }, [formRowData.ano]);

  useEffect(() => {
    if (!rowContrato || rowContrato.length === 0) return;
    setLoading(false);
    setFormRowData({
      contrato: rowContrato.contrato,
      fornecedor: rowContrato.fornecedor,
      vigencia: rowContrato.vigencia,
    });
  }, [rowContrato]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chartInstance = echarts.init(chartRef.current);

    const option = {
      title: {
        text: projecao.fornecedor || "Projeção Orçamentária",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          const valorFormatado = params.value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
          return `${params.name}: ${valorFormatado} (${params.percent}%)`;
        },
      },
      series: [
        {
          type: "pie",
          radius: "70%",
          center: ["50%", "50%"],
          selectedMode: "single",
          data: [
            {
              value: parseFloat(projecao.valor_medido_contrato) || 0,
              name: "Utilizado",
              label: { color: "#333" },
            },
            {
              value: parseFloat(projecao.valor_saldo) || 0,
              name: "Saldo",
              label: { color: "#333" },
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    chartInstance.setOption(option);
    const handleResize = () => {
      chartInstance.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.dispose();
    };
  }, [projecao]);

  return (
    <div>
      <NotifyBar
        open={notify.open}
        message={notify.message}
        severity={notify.severity}
        onClose={() => setNotify({ ...notify, open: false })}
      />
      <Dialog
        open={abrirModalOrcarContrato}
        onClose={handleClose}
        disableRestoreFocus
        maxWidth="md"
      >
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box display="flex" gap={1}>
                    <TextField
                      required
                      size="small"
                      margin="dense"
                      name="ano"
                      label="Ano da Previsão"
                      variant="outlined"
                      value={formRowData.ano}
                      onChange={handleChange}
                      sx={{
                        width: "150px",
                        "& .MuiInputBase-input": {
                          padding: "4px 14px",
                          fontSize: "1rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                    <TextField
                      size="small"
                      margin="dense"
                      name="plano_orcamentario"
                      label="Plano Orcamentário"
                      variant="outlined"
                      value={formRowData.plano_orcamentario}
                      onChange={handleChange}
                      sx={{
                        width: "300px",
                        "& .MuiInputBase-input": {
                          padding: "4px 14px",
                          fontSize: "1rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  </Box>
                  <Box display="flex" gap={1} alignItems="center" mt={1}>
                    <TextField
                      disabled
                      fullWidth
                      size="small"
                      margin="dense"
                      name="contrato"
                      label="Contrato"
                      variant="outlined"
                      value={formRowData.contrato}
                      onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "4px 14px",
                          fontSize: "1rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                    <TextField
                      disabled
                      fullWidth
                      size="small"
                      margin="dense"
                      name="fornecedor"
                      label="Fornecedor"
                      variant="outlined"
                      value={formRowData.fornecedor}
                      onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "4px 14px",
                          fontSize: "1rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                    <TextField
                      disabled
                      fullWidth
                      size="small"
                      margin="dense"
                      name="vigencia"
                      label="Vigência"
                      variant="outlined"
                      value={formRowData.vigencia}
                      onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "4px 14px",
                          fontSize: "1rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  </Box>
                  <Box display="flex" gap={1} mb={1}>
                    <TextField
                      disabled
                      fullWidth
                      size="small"
                      margin="dense"
                      name="valor_contrato"
                      label="Valor do Contrato"
                      variant="outlined"
                      value={formRowData.valor_contrato}
                      onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "4px 14px",
                          fontSize: "1rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                    <TextField
                      disabled
                      fullWidth
                      size="small"
                      margin="dense"
                      name="realizado"
                      label="Realizado"
                      variant="outlined"
                      value={formRowData.valor_realizado}
                      onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "4px 14px",
                          fontSize: "1rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                    <TextField
                      disabled
                      fullWidth
                      size="small"
                      margin="dense"
                      name="saldo"
                      label="Saldo"
                      variant="outlined"
                      value={formRowData.valor_saldo}
                      onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "4px 14px",
                          fontSize: "1rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ height: "370px", width: "100%" }}>
                  <div
                    ref={chartRef}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {[
                  "Jan",
                  "Fev",
                  "Mar",
                  "Abr",
                  "Mai",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Set",
                  "Out",
                  "Nov",
                  "Dez",
                ].map((item, index) => (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <Typography sx={{ width: "63px", fontWeight: "bold" }}>
                      {item}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      margin="dense"
                      name={`previsto_${index + 1}`}
                      label="Previsto"
                      variant="outlined"
                      value={formRowData[`previsto_${index + 1}`]}
                      onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "5px 14px",
                          fontSize: "0.875rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                    <TextField
                      disabled
                      fullWidth
                      size="small"
                      margin="dense"
                      name={`realizado_${index + 1}`}
                      label="Realizado"
                      variant="outlined"
                      value={formRowData[`realizado_${index + 1}`]}
                      onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "5px 14px",
                          fontSize: "0.875rem",
                        },
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Box sx={{ m: 1, position: "relative" }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  Salvar
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Box>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
