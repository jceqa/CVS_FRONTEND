import { Marca } from './marca';

export class Equipo {
    id: number;
    descripcion: string;
    serie: string;
    modelo: string;
    marca : Marca;
}