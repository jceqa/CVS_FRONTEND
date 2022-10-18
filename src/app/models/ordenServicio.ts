import {Estado} from './estado';
import {Usuario} from './usuario';
import {PresupuestoServicio} from './presupuestoServicio';
import {OrdenServicioDetalle} from './ordenServicioDetalle';
import {Deposito} from './deposito';

export class OrdenCompra {
    id: number;
    fecha: Date;
    observacion: string;
    estado: string;
    fechaentrega: Date;
    estadoOrdenCompra: Estado;
    usuario: Usuario;
    deposito: Deposito;
    presupuestosServicio: PresupuestoServicio[];
    ordenServicioDetalle: OrdenServicioDetalle[];
}
