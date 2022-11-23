import {TipoCobro} from './tipoCobro';

export class Cobro {
    id: number;
    descripcion: string;
    estado: string;
    fecha: Date;
    monto: number;
    tipoCobro: TipoCobro;
}
