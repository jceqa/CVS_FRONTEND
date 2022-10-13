import {Estado} from './estado';
import {PedidoCompra} from './pedidoCompra';
import {Deposito} from './deposito';
import {NotaRemisionDetalle} from './notaRemisionDetalle';
import {Usuario} from './usuario';

export class NotaRemision {
    id: number;
    observacion: string;
    estado: string;
    tipo: string;
    fecha: Date;
    estadoNotaRemision: Estado;
    pedidoCompra: PedidoCompra;
    origen: Deposito;
    destino: Deposito;
    notaRemisionDetalle: NotaRemisionDetalle[];
    usuario: Usuario;
}
