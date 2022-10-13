import {Articulo} from './articulo';
import {Deposito} from './deposito';

export class Stock {
    id: number;
    estado: string;
    existencia: number;
    articulo: Articulo;
    deposito: Deposito;
}
