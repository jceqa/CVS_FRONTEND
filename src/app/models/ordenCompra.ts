import {Estado} from './estado';
import {Usuario} from './usuario';
import {PresupuestoCompra} from './presupuestoCompra';
import {CondicionPago} from './condicionPago';
import {OrdenCompraDetalle} from './ordenCompraDetalle';

export class OrdenCompra {
    id: number;
    fecha: Date;
    estado: string;
    intervalo: number;
    cantidadCuota: number;
    montoCuota: number;
    estadoOrdenCompra: Estado;
    usuario: Usuario;
    presupuestoCompra: PresupuestoCompra;
    condicionPago: CondicionPago;
    ordenCompraDetalle: OrdenCompraDetalle[];
    observacion: string;
}
