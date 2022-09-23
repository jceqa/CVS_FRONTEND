import {PedidoCompraDetalle} from './pedidoCompraDetalle';

export class PresupuestoCompraDetalle {
    id: number;
    estado: string;
    monto: number;
    pedidoCompraDetalle: PedidoCompraDetalle;
}
