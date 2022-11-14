import {Sucursal} from './sucursal';

export class Usuario {
    id: number;
    nombre: string;
    usuario: string;
    clave: string;
    estado: string;
    intentosFallidos: number;
    sucursal: Sucursal;

    constructor(id?: number) {
        if (id) {
            this.id = id;
        }
    }
}
