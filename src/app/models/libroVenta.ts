import {LibroVentaDetalle} from './libroVentaDetalle';

export class LibroVenta {
    id: number;
    fecha: Date;
    estado: string;
    montoIVA5: number;
    montoIVA10: number;
    montoNeto: number;
    libroVentaDetalles: LibroVentaDetalle[];
}
