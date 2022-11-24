import {Cliente} from './cliente';
import {Estado} from './estado';
import {Factura} from './factura';
import {NotaVentaDetalle} from './notaVentaDetalle';
import {Usuario} from './usuario';
import {TipoNota} from './tipoNota';

export class NotaVenta {
    id: number;
    observacion: string;
    estado: string;
    monto: number;
    fecha: Date;
    usuario: Usuario;
    cliente: Cliente;
    tiponota: TipoNota;
    estadoNotaVenta: Estado;
    factura: Factura;
    notaVentaDetalle: NotaVentaDetalle[];
}
