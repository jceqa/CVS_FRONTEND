import {Sucursal} from './sucursal';

export class Usuario {
    id: number;
    nombre: string;
    usuario: string;
    clave: string;
    estado: string;
    sucursal: Sucursal;

    constructor();
    constructor(id?: number) {
        this.id = id;
    }
}
