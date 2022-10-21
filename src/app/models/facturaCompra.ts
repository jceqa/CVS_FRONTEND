import {Usuario} from './usuario';
import {Estado} from './estado';
import {OrdenCompra} from './ordenCompra';
import {FacturaCompraDetalle} from './facturaCompraDetalle';
import {NotaRemision} from './notaRemision';
import {NotaDebitoCompra} from './notaDebitoCompra';
import {LibroCompra} from './libroCompra';

export class FacturaCompra {
    id: number;
    observacion: string;
    estado: string;
    fecha: Date;
    monto: number;
    numeroFactura: string;
    usuario: Usuario;
    estadoFacturaCompra: Estado;
    ordenCompra: OrdenCompra;
    facturaCompraDetalle: FacturaCompraDetalle[];
    libroCompra: LibroCompra;
    notaRemisionList: NotaRemision[];
    notaDebitoCompraList: NotaDebitoCompra[];
}
