import {Articulo} from './articulo';

export class PedidoCompraDetalle {
    id: number;
    cantidad: number;
    estado: string;
    articulo: Articulo;
}
