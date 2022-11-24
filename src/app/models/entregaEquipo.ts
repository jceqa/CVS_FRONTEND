import {Estado} from './estado';
import {Usuario} from './usuario';
import {Factura} from './factura';
import {EntregaEquipoDetalle} from './entregaEquipoDetalle';

export class EntregaEquipo {
    id: number;
    fecha: Date;
    estado: string;
    observacion: string;
    estadoEntregaEquipo: Estado;
    usuario: Usuario;
    factura: Factura;
    entregaEquipoDetalle: EntregaEquipoDetalle[];
}
