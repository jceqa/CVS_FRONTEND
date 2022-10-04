import {Proveedor} from './proveedor';
import {Estado} from './estado';
import {FacturaCompra} from './facturaCompra';
import {NotaCreditoCompraDetalle} from './notaCreditoCompraDetalle';

export class NotaCreditoCompra {
    id: number;
    observacion: string;
    estado: string;
    monto: number;
    fecha: Date;
    proveedor: Proveedor;
    estadoNotaCreditoCompra: Estado;
    facturaCompra: FacturaCompra;
    notaCreditoDetalle: NotaCreditoCompraDetalle[];
}
