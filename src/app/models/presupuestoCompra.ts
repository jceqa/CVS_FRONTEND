import {Estado} from './estado';
import {Usuario} from './usuario';
import {PedidoCompra} from './pedidoCompra';
import {PresupuestoCompraDetalle} from './presupuestoCompraDetalle';
import {Proveedor} from './proveedor';

export class PresupuestoCompra {
    id: number;
    fecha: Date;
    estado: string;
    observacion: string;
    total: number;
    estadoPresupuestoCompra: Estado;
    usuario: Usuario;
    pedidoCompra: PedidoCompra;
    presupuestoCompraDetalles: PresupuestoCompraDetalle[];
    proveedor: Proveedor;
}
