import {Estado} from './estado';
import {Pago} from './pago';

export class CuentaAPagar {
    id: number;
    monto: number;
    fechaVencimiento: Date;
    cantidadCuotas: number;
    numeroCuota: number;
    estado: string;
    estadoCuentaAPagar: Estado;
    pago: Pago;
}
