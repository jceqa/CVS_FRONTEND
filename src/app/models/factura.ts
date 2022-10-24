import {Estado} from './estado';
import {Timbrado} from './timbrado';
import {CondicionPago} from './condicionPago';
import {PedidoVenta} from './pedidoVenta';
import {OrdenServicio} from './ordenServicio';
import {Caja} from './caja';
import {LibroVenta} from './libroVenta';
import {FacturaDetalle} from './facturaDetalle';
import {CuentaACobrar} from './cuentaACobrar';
import {Usuario} from './usuario';

export class Factura {
    id: number;
    observacion: string;
    estado: string;
    fecha: Date;
    monto: number;
    numeroFactura: string;
    estadoFactura: Estado;
    timbrado: Timbrado;
    condicionPago: CondicionPago;
    pedidoVenta: PedidoVenta;
    ordenServiciosList: OrdenServicio[];
    caja: Caja;
    libroVenta: LibroVenta;
    facturaDetalles: FacturaDetalle[];
    cuentaACobrarList: CuentaACobrar[];
    usuario: Usuario;
}
