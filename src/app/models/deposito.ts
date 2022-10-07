import {Sucursal} from './sucursal';

export class Deposito {
    id: number;
    descripcion: string;
    sucursal: Sucursal;
    estado: string;

    constructor(id = 0) {
        this.id = id;
    }
}
