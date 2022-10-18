import {PresupuestoCompraDetalle} from './presupuestoCompraDetalle';
import {Articulo} from './articulo';

export class OrdenServicioDetalle {
    id: number;
    estado: string;
    cantidad: number;
    articulo: Articulo;
    presupuestoServicioDetalle: PresupuestoCompraDetalle;
}
