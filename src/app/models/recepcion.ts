import {Estado} from './estado';
import {Usuario} from './usuario';
import {Cliente} from './cliente';
import {RecepcionDetalle} from './recepcionDetalle';

export class Recepcion {
    id: number;
    fecha: Date;
    estado: string;
    estadoRecepcion: Estado;
    recepcionDetalle: RecepcionDetalle[];
    usuario: Usuario;
    cliente: Cliente;
    observacion: string;
}
