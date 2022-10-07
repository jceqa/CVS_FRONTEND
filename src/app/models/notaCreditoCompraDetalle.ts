import {Articulo} from './articulo';

export class NotaCreditoCompraDetalle {
    id: number;
    estado: string;
    monto: number;
    cantidad: number;
    articulo: Articulo;
}
