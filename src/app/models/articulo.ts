import {Impuesto} from './impuesto';
import {Marca} from './marca';
import {TipoArticulo} from './tipoArticulo';

export class Articulo {
    id: number;
    descripcion: string;
    precioCompra: number;
    precioVenta: number;
    codigoGenerico: number;
    impuesto: Impuesto;
    marca: Marca;
    tipoArticulo: TipoArticulo;
}
