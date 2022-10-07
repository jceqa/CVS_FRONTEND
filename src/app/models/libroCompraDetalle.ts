import {Impuesto} from './impuesto';
import {FacturaCompraDetalle} from './facturaCompraDetalle';

export class LibroCompraDetalle {
    id: number;
    estado: string;
    montoNeto: number;
    montoImpuesto: number;
    impuesto: Impuesto;
    facturaCompraDetalle: FacturaCompraDetalle;

    constructor(montoNeto, montoImpuesto, impuesto) {
        this.id = 0;
        this.estado = 'ACTIVO';
        this.montoNeto = montoNeto;
        this.montoImpuesto = montoImpuesto;
        this.impuesto = impuesto;
    }
}
