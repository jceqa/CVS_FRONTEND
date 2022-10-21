import {Estado} from './estado';
import {Usuario} from './usuario';
import {Diagnostico} from './diagnostico';
import {PresupuestoServicioDetalle} from './presupuestoServicioDetalle';
import {PromoDescuento} from './promoDescuento';

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
    promoDescuento: PromoDescuento;
}
