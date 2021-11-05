import { Rol } from "./rol";
import { Usuario } from "./usuario";

export interface UsuarioRol{
    id : number;
    usuario : Usuario;
    rol : Rol;
}