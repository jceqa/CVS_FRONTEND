import {Estado} from './estado';
import {Usuario} from './usuario';
import {EntregaEquipo} from './entregaEquipo;
import {ReclamoDetalle} from './reclamoDetalle';

export class Reclamo {
    id: number;
    fecha: Date;
    estado: string;
    observacion: string;
    estadoReclmo: Estado;
    usuario: Usuario;
    entregaEquipo: EntregaEquipo;
    reclamoDetalles: ReclamoDetalle[];
}
