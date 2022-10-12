import {Stock} from './stock';
import {Estado} from './estado';

export class Ajuste {
    id: number;
    descripcion: string;
    estado: string;
    fecha: Date;
    cantidad: number;
    tipo: string;
    stock: Stock;
    estadoAjuste: Estado;
}
