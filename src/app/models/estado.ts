export class Estado {
    id: number;
    descripcion: string;
    estado: string;

    constructor(id: number) {
        this.id = id;
        if (id === 1) {
            this.descripcion = 'PENDIENTE';
            this.estado = 'ACTIVO';
        }
    }
}
