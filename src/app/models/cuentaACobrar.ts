import {Estado} from './estado';
import {Cobro} from './Cobro';

export class CuentaACobrar {
    id: number;
    monto: number;
    fechaVencimiento: Date;
    cantidadCuotas: number;
    numeroCuota: number;
    estado: string;
    estadoCuentaACobrar: Estado;
    cobro: Cobro;
}

