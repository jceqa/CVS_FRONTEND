import {Estado} from './estado';
import {Usuario} from './usuario';
import {Deposito} from './deposito';
import {PedidoCompraDetalle} from './pedidoCompraDetalle';

export class PedidoCompra {
    id: number;
    fecha: Date;
    estado: string;
    estadoPedido: Estado;
    detallePedidoCompras: PedidoCompraDetalle[];
    usuario: Usuario;
    deposito: Deposito;
    observacion: string;
}
