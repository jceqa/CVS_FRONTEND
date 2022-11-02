import {PedidoVentaDetalle} from './pedidoVentaDetalle';
import {OrdenServicioDetalle} from './ordenServicioDetalle';

export class FacturaDetalle {
    id: number;
    estado: string;
    monto: number;
    pedidoVentaDetalle: PedidoVentaDetalle;
    ordenServicioDetalle: OrdenServicioDetalle;
}
