import {Estado} from './estado';
import {Usuario} from './usuario';
import {Deposito} from './deposito';
import {PedidoVentaDetalle} from './pedidoVentaDetalle';

export class PedidoVenta {
    id: number;
    fecha: Date;
    estado: string;
    estadoPedido: Estado;
    detallePedidoVentas: PedidoVentaDetalle[];
    usuario: Usuario;
    deposito: Deposito;
    observacion: string;
}
