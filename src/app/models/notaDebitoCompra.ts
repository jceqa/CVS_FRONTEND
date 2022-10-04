import {Estado} from './estado';
import {CuentaAPagar} from './cuentaAPagar';
import {NotaDebitoCompraDetalle} from './notaDebitoCompraDetalle';

export class NotaDebitoCompra {
    id: number;
    observacion: string;
    estado: string;
    numero: string;
    monto: number;
    estadoNotaDebitoCompra: Estado;
    cuentaAPagar: CuentaAPagar;
    notaDebitoCompraDetalle: NotaDebitoCompraDetalle[];
}
