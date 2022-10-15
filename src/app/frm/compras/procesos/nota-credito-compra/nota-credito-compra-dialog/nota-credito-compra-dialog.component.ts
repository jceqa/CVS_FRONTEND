import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {FacturaCompra} from '../../../../../models/facturaCompra';
import {NotaCreditoCompra} from '../../../../../models/notaCreditoCompra';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {NotaCreditoCompraDetalle} from '../../../../../models/notaCreditoCompraDetalle';
import {PresupuestoCompra} from '../../../../../models/presupuestoCompra';
import {LibroCompraDetalle} from '../../../../../models/libroCompraDetalle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {NotaCreditoCompraService} from '../../../../../services/notacreditocompra.service';
import {UtilService} from '../../../../../services/util.service';
import {FacturaCompraService} from '../../../../../services/facturacompra.service';
import {map, startWith} from 'rxjs/operators';
// import {Usuario} from '../../../../../models/usuario';
// import {Estado} from '../../../../../models/estado';
import {LibroCompra} from '../../../../../models/libroCompra';
// import {NotaRemision} from '../../../../../models/notaRemision';
// import {Deposito} from '../../../../../models/deposito';
// import {NotaRemisionDetalle} from '../../../../../models/notaRemisionDetalle';
// import {NotaDebitoCompra} from '../../../../../models/notaDebitoCompra';
import {formatDate} from '@angular/common';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-nota-credito-compra-dialog',
  templateUrl: './nota-credito-compra-dialog.component.html',
  styleUrls: ['./nota-credito-compra-dialog.component.scss']
})
export class NotaCreditoCompraDialogComponent implements OnInit {
    facturaCompraControl = new FormControl('');
    facturaCompraFiltered: Observable<FacturaCompra[]>;

    item: NotaCreditoCompra;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'precio', 'exenta', 'iva5', 'iva10'/*, 'total', 'actions'*/];
    dataSource = new MatTableDataSource<NotaCreditoCompraDetalle>();
    detalles: NotaCreditoCompraDetalle[] = [];

    facturasCompra: FacturaCompra[];
    presupuestosSelected: PresupuestoCompra[];
    facturaCompraSelected: FacturaCompra;

    libroCompraDetalles: LibroCompraDetalle[] = [];

    estadoNotaCredito = '';
    total = 0;
    totalIVA = 0;

    constructor(
        private dialogRef: MatDialogRef<NotaCreditoCompraDialogComponent>,
        private uiService: UIService,
        private notaCreditoCompraService: NotaCreditoCompraService,
        private utils: UtilService,
        private facturaCompraService: FacturaCompraService,
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
            numeroNotaCredito: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = '';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.total = this.item.monto;
            // this.totalIVA = this.item.libroCompra.montoIVA10 + this.item.libroCompra.montoIVA5;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.facturaCompraService.getFacturasComprasProcesadas().subscribe(data => {
            console.log(data);
            this.facturasCompra = data;
            this.facturaCompraFiltered = this.facturaCompraControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterFacturaCompra(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    setForm(item: NotaCreditoCompra) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
                // numeroNotaCredito: item.numeroNotaCredito
            });
            this.form.get('observacion').disable();
            this.form.get('numeroNotaCredito').disable();
            // this.facturaCompraSelected = this.item.facturaCompra;
            this.fecha = item.fecha;
            // this.detalles = item.notaCreditoCompraDetalle;
            this.estadoNotaCredito = item.estadoNotaCreditoCompra.descripcion;
            this.dataSource = new MatTableDataSource<NotaCreditoCompraDetalle>(
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
        /*this.item.numeroNotaCredito = this.form.get('numeroNotaCredito').value.toString().toUpperCase().trim();
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.estadoNotaCreditoCompra = new Estado(4);
        this.item.facturaCompra = this.facturaCompraSelected;
        this.item.notaCreditoCompraDetalle = this.detalles;

        this.item.libroCompra = this.crearLibroCompra();
        this.item.notaRemisionList = this.crearNotaRemision();
        this.item.notaDebitoCompraList = this.crearNotaDebito();

        this.item.notaCreditoComprasCancelacion = null;*/
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

    /*crearNotaRemision(): NotaRemision[] {
        const notaRemisionList = [];
        this.facturaCompraSelected.presupuestosCompra.forEach(pC => {
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
    }*/

    /*crearNotaDebito(): NotaDebitoCompra[] {
        const notaDebitoCompraList = [];
        const cantidadCuotas = this.facturaCompraSelected.cantidadCuota ? this.facturaCompraSelected.cantidadCuota : 1;
        for (let i = 0; i < cantidadCuotas; i++) {
            const notaDebitoCompra = new NotaDebitoCompra();
            notaDebitoCompra.id = 0;
            // notaDebitoCompra.observacion = 'GENERADO AUTOMATICAMENTE POR FACTURA NUMERO : ' + this.item.numeroNotaCredito;
            notaDebitoCompra.estado = 'ACTIVO';
            // NUMERO GENERADO AUTOINCREMENTADO
            notaDebitoCompra.monto = cantidadCuotas === 1 ? this.facturaCompraSelected.monto : this.facturaCompraSelected.montoCuota;
            notaDebitoCompra.estadoNotaDebitoCompra = new Estado(1);
            notaDebitoCompra.cuentaAPagar = {
                id: 0,
                monto: cantidadCuotas === 1 ? this.facturaCompraSelected.monto : this.facturaCompraSelected.montoCuota,
                fechaVencimiento: cantidadCuotas === 1 ? new Date() : this.calcularVencimiento(i + 1, this.facturaCompraSelected.intervalo),
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
                    notaCreditoCompraDetalle : null // det
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

    selectedFacturaCompra($event): void {
        console.log($event.source.value);
        this.facturaCompraSelected = $event.source.value;
        this.detalles.length = 0;
        this.total = this.facturaCompraSelected.monto;
        this.totalIVA = 0;
        this.libroCompraDetalles.length = 0;

        /*this.facturaCompraSelected.facturaCompraDetalle.forEach(oCD => {
            this.detalles.push({
                id: 0,
                estado: 'ACTIVO',
                facturaCompraDetalle: oCD
            });
            const fact =  ( oCD.presupuestoCompraDetalle.pedidoCompraDetalle.articulo.impuesto.porcentajeImpuesto + 100 ) / 100;
            const montoSinIVA = Math.round(oCD.monto / fact);
            const iva = oCD.monto - montoSinIVA;
            this.totalIVA += iva;

            this.libroCompraDetalles.push(new LibroCompraDetalle(montoSinIVA, iva, oCD.presupuestoCompraDetalle.pedidoCompraDetalle.articulo.impuesto));
        });*/

        this.dataSource = new MatTableDataSource<NotaCreditoCompraDetalle>(
            this.detalles
        );
    }


    displayFacturaCompra(value: FacturaCompra ) {
        if (value) {
            return value.numeroFactura + ' | ' +
                value.observacion + ' | ' +
                formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | ' +
                value.ordenCompra.proveedor.razonSocial + ' | ' +
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
        } else if (!this.facturaCompraSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar una Factura de Compra.',
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
            this.notaCreditoCompraService.guardarNotaCreditoCompra(this.item)
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

    anular(dato: NotaCreditoCompra): void {
        this.utils.startLoading();
        this.notaCreditoCompraService.anularNotaCreditoCompra(dato).subscribe(
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
                title: 'Anular Nota Credito Compra',
                msg: '¿Está seguro que desea anular esta Nota Credito de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    private _filterFacturaCompra(value: any): FacturaCompra[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.facturasCompra.filter(facturaCompra =>
                facturaCompra.numeroFactura.toLowerCase().includes(filterValue) ||
                facturaCompra.observacion.toLowerCase().includes(filterValue) ||
                formatDate(facturaCompra.fecha, 'dd/MM/yyyy', 'en-US').includes(filterValue) ||
                facturaCompra.ordenCompra.proveedor.razonSocial.toLowerCase().includes(filterValue) ||
                facturaCompra.usuario.nombre.includes(filterValue) ||
                facturaCompra.monto.toString().includes(filterValue))
        );
    }
}
