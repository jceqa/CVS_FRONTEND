import {FacturaDetalle} from './facturaDetalle';
import {Impuesto} from './impuesto';

export class LibroVentaDetalle {
    id: number;
    estado: string;
    montoNeto: number;
    montoImpuesto: number;
    impuesto: Impuesto;
    facturaDetalle: FacturaDetalle;
}
