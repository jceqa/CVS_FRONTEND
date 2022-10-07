import {LibroCompraDetalle} from './libroCompraDetalle';

export class LibroCompra {
    id: number;
    fecha: Date;
    estado: string;
    montoIVA5: number;
    montoIVA10: number;
    montoNeto: number;
    libroCompraDetalles: LibroCompraDetalle[];
}
