import {Estado} from './estado';

export class CuentaAPagar {
    id: number;
    monto: number;
    fechaVencimiento: Date;
    cantidadCuotas: number;
    numeroCuota: number;
    estado: string;
    estadoCuentaAPagar: Estado;
}
