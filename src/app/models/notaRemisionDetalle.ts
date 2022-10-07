import {Articulo} from './articulo';
import {PedidoCompraDetalle} from './pedidoCompraDetalle';

export class NotaRemisionDetalle {
    id: number;
    estado: string;
    cantidad: number;
    articulo: Articulo;
    pedidoCompraDetalle: PedidoCompraDetalle;
}
