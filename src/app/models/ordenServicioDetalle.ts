import {PresupuestoServicioDetalle} from './presupuestoServicioDetalle';


export class OrdenServicioDetalle {
    id: number;
    estado: string;
    monto: number;
    presupuestoServicioDetalle: PresupuestoServicioDetalle;
}
