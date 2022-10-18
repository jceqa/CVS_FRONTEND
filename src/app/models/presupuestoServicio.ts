import {Estado} from './estado';
import {Usuario} from './usuario';
import {Diagnostico} from './diagnostico';
import {Servicio} from './servicio';
import {PresupuestoServicioDetalle} from './presupuestoServicioDetalle';
import {PromoDescuento} from './promodescuento';


export class PresupuestoServicio {
    id: number;
    fecha: Date;
    estado: string;
    observacion: string;
    total: number;
    estadoPresupuestoServicio: Estado;
    usuario: Usuario;
    diagnostico: Diagnostico;
    presupuestoServicioDetalles: PresupuestoServicioDetalle[];
    servicio: Servicio;
    promoDescuento: PromoDescuento;
}
