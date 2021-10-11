export class Critica {
    id!: number;
    usuario!: {
        first_name: string;
        last_name: string;
    };
    creado!: Date;
    modificado!: Date;
    calificacion!: number;
    mensaje!: string;
    pelicula! : number
}
