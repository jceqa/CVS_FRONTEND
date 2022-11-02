import {Impuesto} from './impuesto';
import {Articulo} from './articulo';

export class Servicio {
    id: number;
    descripcion: string;
    monto: number;
    impuesto: Impuesto;
    articulo: Articulo;
}
