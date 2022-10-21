import {DiagnosticoDetalle} from './diagnosticoDetalle';
import {Servicio} from './servicio';

export class PresupuestoServicioDetalle {
    id: number;
    estado: string;
    monto: number;
    servicio: Servicio;
    diagnosticoDetalle: DiagnosticoDetalle;
}
