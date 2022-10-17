import {Estado} from './estado';
import {Usuario} from './usuario';
import {Recepcion} from './recepcion';
import {DiagnosticoDetalle} from './diagnosticoDetalle';


export class Diagnostico {
    id: number;
    fecha: Date;
    estado: string;
    observacion: string;
    total: number;
    estadoDiagnostico: Estado;
    usuario: Usuario;
    recepcion: Recepcion;
    diagnosticoDetalle: DiagnosticoDetalle[];
}
