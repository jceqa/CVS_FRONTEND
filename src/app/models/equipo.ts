import { Marca } from './marca';
import {Cliente} from './cliente';

export class Equipo {
    id: number;
    descripcion: string;
    serie: string;
    modelo: string;
    marca: Marca;
    cliente: Cliente;
    estado: string;
}
