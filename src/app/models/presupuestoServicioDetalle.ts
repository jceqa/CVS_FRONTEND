import {DiagnosticoDetalle} from './diagnosticoDetalle';

export class PresupuestoServicioDetalle {
    id: number;
    estado: string;
    monto: number;
    diagnosticoDetalle: DiagnosticoDetalle;
}
