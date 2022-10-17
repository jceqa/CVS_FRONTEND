import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {FacturaCompra} from '../../../../../models/facturaCompra';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {FacturaCompraDetalle} from '../../../../../models/facturaCompraDetalle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {FacturaCompraService} from '../../../../../services/facturacompra.service';
import {UtilService} from '../../../../../services/util.service';
import {map, startWith} from 'rxjs/operators';
import {Estado} from '../../../../../models/estado';
import {Usuario} from '../../../../../models/usuario';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {OrdenCompra} from '../../../../../models/ordenCompra';
import {OrdenCompraService} from '../../../../../services/ordencompra.service';
import {formatDate} from '@angular/common';
import {LibroCompraDetalle} from '../../../../../models/libroCompraDetalle';
import {LibroCompra} from '../../../../../models/libroCompra';
import {NotaRemision} from '../../../../../models/notaRemision';
import {Deposito} from '../../../../../models/deposito';
import {NotaRemisionDetalle} from '../../../../../models/notaRemisionDetalle';
import {NotaDebitoCompra} from '../../../../../models/notaDebitoCompra';

@Component({
    selector: 'app-factura-compra-dialog',
    templateUrl: './factura-compra-dialog.component.html',
    styleUrls: ['./factura-compra-dialog.component.scss']
})
export class FacturaCompraDialogComponent implements OnInit {

    ordenCompraControl = new FormControl('');
    ordenCompraFiltered: Observable<OrdenCompra[]>;

    item: FacturaCompra;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'precio', 'exenta', 'iva5', 'iva10'/*, 'total', 'actions'*/];
    dataSource = new MatTableDataSource<FacturaCompraDetalle>();
    detalles: FacturaCompraDetalle[] = [];

    ordenesCompra: OrdenCompra[];
    ordenCompraSelected: OrdenCompra;

    libroCompraDetalles: LibroCompraDetalle[] = [];

    estadoFactura = '';
    total = 0;
    totalIVA = 0;

    constructor(
        private dialogRef: MatDialogRef<FacturaCompraDialogComponent>,
        private uiService: UIService,
        private facturaCompraService: FacturaCompraService,
        private utils: UtilService,
        private ordenCompraService: OrdenCompraService,
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
            this.totalIVA = this.item.libroCompra.montoIVA10 + this.item.libroCompra.montoIVA5;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.ordenCompraService.getOrdenCompraPendientes().subscribe(data => {
            console.log(data);
            this.ordenesCompra = data;
            this.ordenCompraFiltered = this.ordenCompraControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterOrdenCompra(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    setForm(item: FacturaCompra) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
                numeroFactura: item.numeroFactura
            });
            this.form.get('observacion').disable();
            this.form.get('numeroFactura').disable();
            this.ordenCompraSelected = this.item.ordenCompra;
            this.fecha = item.fecha;
            this.detalles = item.facturaCompraDetalle;
            this.estadoFactura = item.estadoFacturaCompra.descripcion;
            this.dataSource = new MatTableDataSource<FacturaCompraDetalle>(
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
        this.item.numeroFactura = this.form.get('numeroFactura').value.toString().toUpperCase().trim();
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.estadoFacturaCompra = new Estado(4);
        this.item.ordenCompra = this.ordenCompraSelected;
        this.item.facturaCompraDetalle = this.detalles;

        this.item.libroCompra = this.crearLibroCompra();
        this.item.notaRemisionList = this.crearNotaRemision();
        this.item.notaDebitoCompraList = this.crearNotaDebito();

        // this.item.notaCreditoComprasCancelacion = this.notasCreditoSelected;
    }

    crearLibroCompra(): LibroCompra {
        const libroCompra = new LibroCompra();
        libroCompra.id = 0;
        libroCompra.fecha = new Date();
        libroCompra.estado = 'ACTIVO';
        let monto5 = 0;
        let monto10 = 0;
        let neto = 0;
        this.libroCompraDetalles.forEach(lCD => {
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
        libroCompra.montoIVA5 = monto5;
        libroCompra.montoIVA10 = monto10;
        libroCompra.montoNeto = neto;
        libroCompra.libroCompraDetalles = this.libroCompraDetalles;
        return libroCompra;
    }

    crearNotaRemision(): NotaRemision[] {
        const notaRemisionList = [];
        this.ordenCompraSelected.presupuestosCompra.forEach(pC => {
            const pedido = pC.pedidoCompra;
            const notaRemision = new NotaRemision();
            notaRemision.id = 0;
            notaRemision.observacion = 'REMISION AUTOMATICA POR COMPRA';
            notaRemision.estado = 'ACTIVO';
            notaRemision.tipo = 'AUTOMATICA';
            notaRemision.fecha = new Date();
            notaRemision.estadoNotaRemision = new Estado(1);
            notaRemision.pedidoCompra = pedido;
            notaRemision.origen = new Deposito(1);
            notaRemision.destino = pedido.deposito;
            notaRemision.notaRemisionDetalle = [];
            notaRemision.usuario = new Usuario(this.utils.getUserId());

            pedido.detallePedidoCompras.forEach(dPC => {
                const detalle = new NotaRemisionDetalle();
                detalle.id = 0;
                detalle.estado = 'ACTIVO';
                detalle.cantidad = dPC.cantidad;
                detalle.articulo = dPC.articulo;
                detalle.pedidoCompraDetalle = dPC;

                notaRemision.notaRemisionDetalle.push(detalle);
            });
            notaRemisionList.push(notaRemision);
        });
        return notaRemisionList;
    }

    crearNotaDebito(): NotaDebitoCompra[] {
        const notaDebitoCompraList = [];
        const cantidadCuotas = this.ordenCompraSelected.cantidadCuota ? this.ordenCompraSelected.cantidadCuota : 1;
        for (let i = 0; i < cantidadCuotas; i++) {
            const notaDebitoCompra = new NotaDebitoCompra();
            notaDebitoCompra.id = 0;
            notaDebitoCompra.observacion = 'GENERADO AUTOMATICAMENTE POR FACTURA NUMERO : ' + this.item.numeroFactura;
            notaDebitoCompra.estado = 'ACTIVO';
            // NUMERO GENERADO AUTOINCREMENTADO
            notaDebitoCompra.monto = cantidadCuotas === 1 ? this.total : this.ordenCompraSelected.montoCuota;
            notaDebitoCompra.estadoNotaDebitoCompra = new Estado(1);
            notaDebitoCompra.cuentaAPagar = {
                id: 0,
                monto: cantidadCuotas === 1 ? this.total : this.ordenCompraSelected.montoCuota,
                fechaVencimiento: cantidadCuotas === 1 ? new Date() : this.calcularVencimiento(i + 1, this.ordenCompraSelected.intervalo),
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
                   facturaCompraDetalle : null // det
                });
                console.log(det);
            });
            notaDebitoCompra.notaDebitoCompraDetalle = detalles;
            notaDebitoCompraList.push(notaDebitoCompra);
        }
        return notaDebitoCompraList;
    }

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

    selectedOrdenCompra($event): void {
        console.log($event.source.value);
        this.ordenCompraSelected = $event.source.value;
        this.detalles.length = 0;
        this.total = this.ordenCompraSelected.monto;
        this.totalIVA = 0;
        this.libroCompraDetalles.length = 0;
        // this.selectedProveedor(this.ordenCompraSelected.proveedor);

        this.ordenCompraSelected.ordenCompraDetalle.forEach(oCD => {
            this.detalles.push({
               id: 0,
               estado: 'ACTIVO',
               ordenCompraDetalle: oCD
            });
            const fact =  ( oCD.presupuestoCompraDetalle.pedidoCompraDetalle.articulo.impuesto.porcentajeImpuesto + 100 ) / 100;
            const montoSinIVA = Math.round(oCD.monto / fact);
            const iva = oCD.monto - montoSinIVA;
            this.totalIVA += iva;

            this.libroCompraDetalles.push(new LibroCompraDetalle(montoSinIVA, iva, oCD.presupuestoCompraDetalle.pedidoCompraDetalle.articulo.impuesto));
        });

        this.dataSource = new MatTableDataSource<FacturaCompraDetalle>(
            this.detalles
        );
    }

    displayOrdenCompra(value) {
        if (value) {
            return value.observacion + ' | ' +
                formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | ' +
                value.proveedor.razonSocial + ' | ' +
                value.usuario.nombre + ' | ' +
                value.monto.toString();
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
        } else if (!this.ordenCompraSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar una Orden de Compra.',
                'Cerrar',
                5000
            );
            return false;
        }
        return true;
    }

    add(): void {
        this.setAtributes();
        this.item.id = 0;
        if (this.validarCampos()) {
            console.log(this.item);
            this.utils.startLoading();
            this.facturaCompraService.guardarFacturaCompra(this.item)
                .subscribe(data => {
                        console.log(data);
                        this.utils.stopLoading();
                        this.uiService.showSnackbar(
                            'Argregado exitosamente.',
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

    anular(dato: FacturaCompra): void {
        this.utils.startLoading();
        this.facturaCompraService.anularFacturaCompra(dato).subscribe(
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
                title: 'Anular Factura Compra',
                msg: '¿Está seguro que desea anular esta Factura de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    private _filterOrdenCompra(value: any): OrdenCompra[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.ordenesCompra.filter(ordenCompra =>
                ordenCompra.observacion.toLowerCase().includes(filterValue) ||
                formatDate(ordenCompra.fecha, 'dd/MM/yyyy', 'en-US').includes(filterValue) ||
                ordenCompra.proveedor.razonSocial.toLowerCase().includes(filterValue) ||
                ordenCompra.usuario.nombre.includes(filterValue) ||
                ordenCompra.monto.toString().includes(filterValue))
        );
    }
}
