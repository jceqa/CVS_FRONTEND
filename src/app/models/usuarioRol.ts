import { Rol } from './rol';
import { Usuario } from './usuario';
import {Permiso} from './permiso';

export interface UsuarioRol {
    id: number;
    usuario: Usuario;
    rol: Rol;
    permisos: Permiso[];
}
