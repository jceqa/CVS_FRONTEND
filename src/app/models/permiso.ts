import { Formulario } from './formulario';
import { Rol } from './rol';

export class Permiso {
    id: number;
    rol: Rol;
    formulario: Formulario;
    agregar: boolean;
    modificar: boolean;
    eliminar: boolean;
    consultar: boolean;
    lista: boolean;
    informe: boolean;
    exportar: boolean;
    estado: string;
}
