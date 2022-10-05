import {Articulo} from './articulo';

export class PedidoVentaDetalle {
    id: number;
    cantidad: number;
    estado: string;
    articulo: Articulo;
}
