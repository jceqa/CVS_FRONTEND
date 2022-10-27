import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {OrdenServicio} from '../../../../../models/ordenServicio';
import {Factura} from '../../../../../models/factura';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {FacturaDetalle} from '../../../../../models/facturaDetalle';
import {LibroVentaDetalle} from '../../../../../models/libroVentaDetalle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {FacturaService} from '../../../../../services/factura.service';
import {UtilService} from '../../../../../services/util.service';
import {OrdenServicioService} from '../../../../../services/ordenservicio.service';
import {map, startWith} from 'rxjs/operators';
import {Usuario} from '../../../../../models/usuario';
import {Estado} from '../../../../../models/estado';
import {LibroVenta} from '../../../../../models/libroVenta';
import {formatDate} from '@angular/common';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {Cliente} from '../../../../../models/cliente';
import {ClienteService} from '../../../../../services/cliente.service';
import {PedidoVenta} from '../../../../../models/pedidoVenta';
import {PedidoVentaService} from '../../../../../services/pedidoventa.service';

@Component({
  selector: 'app-factura-dialog',
  templateUrl: './factura-dialog.component.html',
  styleUrls: ['./factura-dialog.component.scss']
})
export class FacturaDialogComponent implements OnInit {

    pedidoVentaControl = new FormControl('');
    pedidoVentaFiltered: Observable<PedidoVenta[]>;
    pedidosVenta: PedidoVenta[];
    pedidoVentaSelected: PedidoVenta;

    ordenesServicio: OrdenServicio[] = [];
    ordenServicioSelected: OrdenServicio[] = [];

    myControlCliente = new FormControl('');
    optionsCliente: Cliente[] = [];
    filteredOptionsCliente: Observable<Cliente[]>;
    clienteSelected: Cliente = null;

    item: Factura;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['item-servicio', 'cantidad', 'precio', 'exenta', 'iva5', 'iva10'/*, 'total', 'actions'*/];
    dataSource = new MatTableDataSource<FacturaDetalle>();
    detalles: FacturaDetalle[] = [];
    libroVentaDetalles: LibroVentaDetalle[] = [];

    estadoFactura = '';
    total = 0;
    totalIVA = 0;
    totalNotasCredito = 0;

    constructor(
        private dialogRef: MatDialogRef<FacturaDialogComponent>,
        private uiService: UIService,
        private facturaService: FacturaService,
        private utils: UtilService,
        private pedidoVentaService: PedidoVentaService,
        private ordenServicioService: OrdenServicioService,
        private clienteService: ClienteService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            observacion: new FormControl('', [Validators.required]),
            numeroFactura: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = '';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.total = this.item.monto;
            /*this.item.ordenServicio.notaCreditoComprasCancelacion.forEach( nCCC => {
                this.totalNotasCredito += nCCC.monto;
            });*/
            // this.totalNotasCredito = this.item.ordenCompra.notaCreditoComprasCancelacion
            this.totalIVA = this.item.libroVenta.montoIVA10 + this.item.libroVenta.montoIVA5;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.clienteService.getClientes().subscribe(data => {
            console.log(data);
            this.optionsCliente = data;

            this.filteredOptionsCliente = this.myControlCliente.valueChanges.pipe(
                startWith(''),
                map(value => this._filterCliente(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    setForm(item: Factura) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
                numeroFactura: item.numeroFactura
            });
            this.form.get('observacion').disable();
            this.form.get('numeroFactura').disable();
            // this.ordenServicioSelected = this.item.ordenServiciosList;
            this.fecha = item.fecha;
            this.detalles = item.facturaDetalles;
            this.estadoFactura = item.estadoFactura.descripcion;
            this.dataSource = new MatTableDataSource<FacturaDetalle>(
                this.detalles
            );
        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.estado = 'ACTIVO';
        this.item.fecha = this.fecha;
        this.item.monto = this.total;
        /**
         * TODO
         * GENERAR NUMERO FACTURA
         */
        // this.item.numeroFactura = this.form.get('numeroFactura').value.toString().toUpperCase().trim();
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.estadoFactura = new Estado(4);
        /**
         * TIMBRADO
         * CONDICION PAGO
         * CAJA
         */
        this.item.pedidoVenta = this.pedidoVentaSelected;
        this.item.ordenServiciosList = this.ordenServicioSelected;
        this.item.facturaDetalles = this.detalles;
        this.item.libroVenta = this.crearLibroVenta();
        /*this.item.notaRemisionList = this.crearNotaRemision();
        this.item.notaDebitoCompraList = this.crearNotaDebito();*/

        // this.item.notaCreditoComprasCancelacion = this.notasCreditoSelected;
    }

    crearLibroVenta(): LibroVenta {
        const libroVenta = new LibroVenta();
        libroVenta.id = 0;
        libroVenta.fecha = new Date();
        libroVenta.estado = 'ACTIVO';
        let monto5 = 0;
        let monto10 = 0;
        let neto = 0;
        this.libroVentaDetalles.forEach(lCD => {
            switch (lCD.impuesto.id) {
                case 1:
                    monto5 += lCD.montoImpuesto;
                    break;
                case 2:
                    monto10 += lCD.montoImpuesto;
                    break;
                default:
                    console.log('Invalid Option..');
                    break;
            }
            neto += lCD.montoNeto;
        });
        libroVenta.montoIVA5 = monto5;
        libroVenta.montoIVA10 = monto10;
        libroVenta.montoNeto = neto;
        libroVenta.libroVentaDetalles = this.libroVentaDetalles;
        return libroVenta;
    }

    /*crearNotaRemision(): NotaRemision[] {
        const notaRemisionList = [];
        this.ordenServicioSelected.presupuestoServicio.forEach(pC => {
            const pedido = pC.pedidoServicio;
            const notaRemision = new NotaRemision();
            notaRemision.id = 0;
            notaRemision.observacion = 'REMISION AUTOMATICA POR COMPRA';
            notaRemision.estado = 'ACTIVO';
            notaRemision.tipo = 'AUTOMATICA';
            notaRemision.fecha = new Date();
            notaRemision.estadoNotaRemision = new Estado(1);
            notaRemision.pedidoServicio = pedido;
            notaRemision.origen = new Deposito(1);
            notaRemision.destino = pedido.deposito;
            notaRemision.notaRemisionDetalle = [];
            notaRemision.usuario = new Usuario(this.utils.getUserId());

            pedido.detallePedidoServicios.forEach(dPC => {
                const detalle = new NotaRemisionDetalle();
                detalle.id = 0;
                detalle.estado = 'ACTIVO';
                detalle.cantidad = dPC.cantidad;
                detalle.articulo = dPC.articulo;
                detalle.pedidoServicioDetalle = dPC;

                notaRemision.notaRemisionDetalle.push(detalle);
            });
            notaRemisionList.push(notaRemision);
        });
        return notaRemisionList;
    }

    crearNotaDebito(): NotaDebitoCompra[] {
        const notaDebitoCompraList = [];
        const cantidadCuotas = this.ordenServicioSelected.cantidadCuota ? this.ordenServicioSelected.cantidadCuota : 1;
        for (let i = 0; i < cantidadCuotas; i++) {
            const notaDebitoCompra = new NotaDebitoCompra();
            notaDebitoCompra.id = 0;
            notaDebitoCompra.observacion = 'GENERADO AUTOMATICAMENTE POR FACTURA NUMERO : ' + this.item.numeroFactura;
            notaDebitoCompra.estado = 'ACTIVO';
            // NUMERO GENERADO AUTOINCREMENTADO
            notaDebitoCompra.monto = cantidadCuotas === 1 ? this.total : this.ordenServicioSelected.montoCuota;
            notaDebitoCompra.estadoNotaDebitoCompra = new Estado(1);
            notaDebitoCompra.cuentaAPagar = {
                id: 0,
                monto: cantidadCuotas === 1 ? this.total : this.ordenServicioSelected.montoCuota,
                fechaVencimiento: cantidadCuotas === 1 ? new Date() : this.calcularVencimiento(i + 1, this.ordenServicioSelected.intervalo),
                cantidadCuotas : cantidadCuotas,
                numeroCuota: i + 1,
                estado: 'ACTIVO',
                estadoCuentaAPagar: new Estado(1),
                pago: null
            };
            const detalles = [];
            this.detalles.forEach(det => {
                detalles.push({
                    id: 0,
                    estado: 'ACTIVO',
                    facturaDetalle : null // det
                });
                console.log(det);
            });
            notaDebitoCompra.notaDebitoCompraDetalle = detalles;
            notaDebitoCompraList.push(notaDebitoCompra);
        }
        return notaDebitoCompraList;
    }*/

    calcularVencimiento(numeroCuota: number, plazo: number): Date {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + (numeroCuota * plazo));
        return fecha;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selectedPedidoVenta($event): void {
        console.log($event.source.value);
        this.unselectPedidoVenta();
        this.pedidoVentaSelected = $event.source.value;

        this.pedidoVentaSelected.pedidoVentaDetalles.forEach( pVD => {
            const monto = pVD.articulo.precioVenta * pVD.cantidad;
            this.detalles.push({
                id: 0,
                estado: 'ACTIVO',
                monto: monto,
                pedidoVentaDetalle : pVD,
                ordenServicioDetalle: null
            });
            const fact =  ( pVD.articulo.impuesto.porcentajeImpuesto + 100 ) / 100;
            const montoSinIVA = Math.round(monto / fact);
            const iva = monto - montoSinIVA;
            this.totalIVA += iva;
            this.total += monto;
            this.libroVentaDetalles.push(new LibroVentaDetalle(montoSinIVA, iva, pVD.articulo.impuesto));
        });
        this.dataSource = new MatTableDataSource<FacturaDetalle>(
            this.detalles
        );
    }

    unselectPedidoVenta() {
        if (this.pedidoVentaSelected) {
            this.pedidoVentaSelected.pedidoVentaDetalles.forEach( pVD => {
                const monto = pVD.articulo.precioVenta * pVD.cantidad;
                const fact =  ( pVD.articulo.impuesto.porcentajeImpuesto + 100 ) / 100;
                const montoSinIVA = Math.round(monto / fact);
                const iva = monto - montoSinIVA;
                this.totalIVA -= iva;
                this.total -= monto;
                this.detalles = this.detalles.filter(d => d.pedidoVentaDetalle.id !== pVD.id);
                this.dataSource = new MatTableDataSource<FacturaDetalle>(
                    this.detalles
                );
                // this.libroVentaDetalles.push(new LibroVentaDetalle(montoSinIVA, iva, pDV.articulo.impuesto));
            });
        }

    }

    selectedOrdenServicio($event): void {
        console.log($event.source._value);
        this.unselectOrdenServicio($event.source._value);
        this.ordenServicioSelected = $event.source._value;
        this.ordenServicioSelected.forEach(oSS => {
            oSS.ordenServicioDetalles.forEach( oSD => {
                this.detalles.push({
                    id: 0,
                    estado: 'ACTIVO',
                    monto: oSD.monto,
                    pedidoVentaDetalle: null,
                    ordenServicioDetalle: oSD
                });
                const fact =  ( oSD.presupuestoServicioDetalle.diagnosticoDetalle.servicios[0].impuesto.porcentajeImpuesto + 100 ) / 100;
                const montoSinIVA = Math.round(oSD.monto / fact);
                const iva = oSD.monto - montoSinIVA;
                this.totalIVA += iva;
                this.total += oSD.monto;
                this.libroVentaDetalles.push(new LibroVentaDetalle(montoSinIVA, iva, oSD.presupuestoServicioDetalle.diagnosticoDetalle.servicios[0].impuesto.porcentajeImpuesto));
            });
        });

        this.dataSource = new MatTableDataSource<FacturaDetalle>(
            this.detalles
        );
    }

    unselectOrdenServicio(newSelected: OrdenServicio[]) {
        if (this.ordenServicioSelected.length > 0 && this.ordenServicioSelected.length > newSelected.length) {
            let removed: OrdenServicio;
            this.ordenServicioSelected.forEach( oSS => {
                let exists = false;
                newSelected.forEach( nS => {
                    if (nS.id === oSS.id) {
                        exists = true;
                    }
                });
                if (!exists) {
                    removed = oSS;
                }
            });
            removed.ordenServicioDetalles.forEach( oSD => {
                const fact =  ( oSD.presupuestoServicioDetalle.diagnosticoDetalle.servicios[0].impuesto.porcentajeImpuesto + 100 ) / 100;
                const montoSinIVA = Math.round(oSD.monto / fact);
                const iva = oSD.monto - montoSinIVA;
                this.totalIVA -= iva;
                this.total -= oSD.monto;
                this.detalles = this.detalles.filter(d => d.ordenServicioDetalle.id !== oSD.id);
                this.dataSource = new MatTableDataSource<FacturaDetalle>(
                    this.detalles
                );
                // this.libroVentaDetalles.push(new LibroVentaDetalle(montoSinIVA, iva, pDV.articulo.impuesto));
            });
        }

    }

    displayPedidoVenta(value: PedidoVenta) {
        if (value) {
            return value.observacion + ' | ' +
                formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | ' +
                // value.proveedor.razonSocial + ' | ' +
                value.usuario.nombre;
                // value.monto.toString();
        }
    }

    ok(): void {
        if (this.formType === FormType.NEW) {
            this.add();
        }
    }

    validarCampos(): boolean {
        if (!this.utils.tieneLetras(this.item.observacion)) {
            this.uiService.showSnackbar(
                'La observacion no puede ser solo númerica.',
                'Cerrar',
                5000
            );
            return false;
        } /*else if (!this.ordenServicioSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar una Orden de Servicio.',
                'Cerrar',
                5000
            );
            return false;
        }*/
        return true;
    }

    add(): void {
        this.setAtributes();
        this.item.id = 0;
        if (this.validarCampos()) {
            console.log(this.item);
            this.utils.startLoading();
            this.facturaService.guardarFactura(this.item)
                .subscribe(data => {
                        console.log(data);
                        this.utils.stopLoading();
                        this.uiService.showSnackbar(
                            'Agregado exitosamente.',
                            'Cerrar',
                            3000
                        );
                        this.dialogRef.close(data);
                    },
                    (error) => {
                        this.utils.stopLoading();
                        console.error('[ERROR]: ', error);

                        this.uiService.showSnackbar(
                            error.error,
                            'Cerrar',
                            5000
                        );

                    }
                );
        }
    }

    anular(dato: Factura): void {
        this.utils.startLoading();
        this.facturaService.anularFactura(dato).subscribe(
            data => {
                console.log(data);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Anulado Exitosamente.',
                    'Cerrar',
                    3000
                );
                this.dialogRef.close(true);
            }, error => {
                console.log(error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    anularDialog(event: any): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Factura ',
                msg: '¿Está seguro que desea anular esta Factura de ?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    private _filterPedidoVenta(value: any): PedidoVenta[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.pedidosVenta.filter(pedidoVenta =>
                pedidoVenta.observacion.toLowerCase().includes(filterValue) ||
                formatDate(pedidoVenta.fecha, 'dd/MM/yyyy', 'en-US').includes(filterValue) ||
                // ordenServicio.proveedor.razonSocial.toLowerCase().includes(filterValue) ||
                pedidoVenta.usuario.nombre.includes(filterValue))
                // pedidoVenta.total.toString().includes(filterValue))
        );
    }

    private _filterCliente(value: any): Cliente[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.optionsCliente.filter(option => option.ruc.toString().includes(filterValue) ||
                option.razon.toLowerCase().includes(filterValue))
        );
    }

    selectedCliente($event): void {
        console.log($event.source.value);
        this.clienteSelected = $event.source.value;

        this.utils.startLoading();
        this.pedidoVentaService.getPedidosVentaPendientesByCliente(this.clienteSelected.id).subscribe(data => {
            console.log(data);
            this.pedidosVenta = data;
            this.pedidoVentaFiltered = this.pedidoVentaControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterPedidoVenta(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
        this.ordenServicioService.getOrdenServicioPendientesByCliente(this.clienteSelected.id).subscribe(data => {
            console.log(data);
            this.ordenesServicio = data;
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    displayCliente(value: Cliente) {
        if (value) {
            return value.ruc.toString() + ' - ' + value.razon;
        }
    }
}
