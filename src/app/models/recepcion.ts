import {Estado} from './estado';
import {Usuario} from './usuario';
import {RecepcionDetalle} from './recepcionDetalle';
import {Sucursal} from './sucursal';

export class Recepcion {
    id: number;
    fecha: Date;
    estado: string;
    estadoRecepcion: Estado;
    recepcionDetalles: RecepcionDetalle[];
    usuario: Usuario;
    observacion: string;
    sucursal: Sucursal;
}
