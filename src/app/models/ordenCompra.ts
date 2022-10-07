import {Estado} from './estado';
import {Usuario} from './usuario';
import {PresupuestoCompra} from './presupuestoCompra';
import {CondicionPago} from './condicionPago';
import {OrdenCompraDetalle} from './ordenCompraDetalle';
import {Proveedor} from './proveedor';

export class OrdenCompra {
    id: number;
    fecha: Date;
    observacion: string;
    estado: string;
    intervalo: number;
    cantidadCuota: number;
    montoCuota: number;
    monto: number;
    estadoOrdenCompra: Estado;
    usuario: Usuario;
    condicionPago: CondicionPago;
    proveedor: Proveedor;
    presupuestosCompra: PresupuestoCompra[];
    ordenCompraDetalle: OrdenCompraDetalle[];
}
