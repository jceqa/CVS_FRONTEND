import {Proveedor} from './proveedor';
import {Estado} from './estado';
import {FacturaCompra} from './facturaCompra';
import {NotaCreditoCompraDetalle} from './notaCreditoCompraDetalle';
import {Usuario} from './usuario';

export class NotaCreditoCompra {
    id: number;
    observacion: string;
    estado: string;
    monto: number;
    fecha: Date;
    usuario: Usuario;
    proveedor: Proveedor;
    estadoNotaCreditoCompra: Estado;
    facturaCompra: FacturaCompra;
    notaCreditoCompraDetalle: NotaCreditoCompraDetalle[];
}
