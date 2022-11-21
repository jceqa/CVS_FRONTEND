import {Usuario} from './usuario';
import {Rol} from './rol';

export class UsuarioDto {
    usuario: Usuario;
    roles: Rol[];
}
