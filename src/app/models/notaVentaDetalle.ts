import {Articulo} from './articulo';

export class NotaVentaDetalle {
    id: number;
    estado: string;
    monto: number;
    cantidad: number;
    articulo: Articulo;
}
