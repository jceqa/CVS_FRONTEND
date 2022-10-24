import {Estado} from './estado';
import {Usuario} from './usuario';
import {PresupuestoServicio} from './presupuestoServicio';
import {OrdenServicioDetalle} from './ordenServicioDetalle';
export class OrdenServicio {
    id: number;
    fecha: Date;
    estado: string;
    observacion: string;
    total: number;
    fechaEntrega: Date;
    vencimientoGarantia: Date;
    estadoOrdenServicio: Estado;
    usuario: Usuario;
    presupuestoServicio: PresupuestoServicio;
    ordenServicioDetalles: OrdenServicioDetalle[];
}
