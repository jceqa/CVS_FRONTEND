import {RecepcionDetalle} from './recepcionDetalle';
import {Servicio} from './servicio';

export class DiagnosticoDetalle {
    id: number;
    estado: string;
    diagnostico: string;
    servicios: Servicio[] = [];
    recepcionDetalle: RecepcionDetalle;
}
