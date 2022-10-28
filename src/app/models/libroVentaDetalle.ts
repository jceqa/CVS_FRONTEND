import {FacturaDetalle} from './facturaDetalle';
import {Impuesto} from './impuesto';

export class LibroVentaDetalle {
    id: number;
    estado: string;
    montoNeto: number;
    montoImpuesto: number;
    impuesto: Impuesto;
    facturaDetalle: FacturaDetalle;

    constructor(montoNeto: number, montoImpuesto: number, impuesto: Impuesto) {
        this.id = 0;
        this.estado = 'ACTIVO';
        this.montoNeto = montoNeto;
        this.montoImpuesto = montoImpuesto;
        this.impuesto = impuesto;
    }
}
