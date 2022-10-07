import {Caja} from './caja';
import {Usuario} from './usuario';

export class AperturaCierreCaja {
    id: number;
    descripcion: string;
    estado: string;
    fechaHoraApertura: Date;
    fechaHoraCierre: Date;
    montoApertura: number;
    montoCierre: number;
    montoCierreEfectivo: number;
    montoCierreCheque: number;
    montoCierreTarjeta: number;
    caja: Caja;
    usuario: Usuario;
}
