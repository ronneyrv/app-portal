import { useContext } from "react";
import UsuarioContext from "./UsuarioContext";

export const useUsuario = () => useContext(UsuarioContext);
