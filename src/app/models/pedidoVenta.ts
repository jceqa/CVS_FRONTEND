import {Estado} from './estado';
import {Usuario} from './usuario';
import {Deposito} from './deposito';
import {PedidoVentaDetalle} from './pedidoVentaDetalle';
import {Cliente} from './cliente';

export class PedidoVenta {
    id: number;
    fecha: Date;
    estado: string;
    estadoPedidoVenta: Estado;
    pedidoVentaDetalles: PedidoVentaDetalle[];
    usuario: Usuario;
    deposito: Deposito;
    observacion: string;
    cliente: Cliente;
}
