import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function IndidadorAno({age,setAge}) {
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const renderAnos = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];

    for (let ano = 2020; ano <= anoAtual; ano++) {
      anos.push(
        <MenuItem key={ano} value={ano.toString()}>
          {ano}
        </MenuItem>
      );
    }
    return anos;
  };

  return (
    <FormControl sx={{ m: 1, width: 200 }} size="small">
      <InputLabel id="demo-select-small-label">Indicador Ano</InputLabel>
      <Select
        fontSize="inherit"
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label="Indicador Ano"
        onChange={handleChange}
      >
        {renderAnos()}
      </Select>
    </FormControl>
  );
}
