import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {NotaVenta} from '../../../../../models/notaVenta';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
// import {NotaVentaDetalle} from '../../../../../models/notaVentaDetalle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {NotaVentaService} from '../../../../../services/notaventa.service';
import {UtilService} from '../../../../../services/util.service';
import {FacturaService} from '../../../../../services/factura.service';
import {map, startWith} from 'rxjs/operators';
import {Usuario} from '../../../../../models/usuario';
import {Estado} from '../../../../../models/estado';
// import {NotaRemision} from '../../../../../models/notaRemision';
// import {Deposito} from '../../../../../models/deposito';
// import {NotaRemisionDetalle} from '../../../../../models/notaRemisionDetalle';
// import {NotaDebitoCompra} from '../../../../../models/notaDebitoCompra';
import {formatDate} from '@angular/common';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {FacturaDetalle} from '../../../../../models/facturaDetalle';
import {Factura} from '../../../../../models/factura';
import {NotaVentaDetalle} from '../../../../../models/notaVentaDetalle';
import {TipoNota} from '../../../../../models/tipoNota';
import {TipoNotaService} from '../../../../../services/tiponota.service';

@Component({
    selector: 'app-nota-venta-dialog',
    templateUrl: './nota-venta-dialog.component.html',
    styleUrls: ['./nota-venta-dialog.component.scss']
})
export class NotaVentaDialogComponent implements OnInit {
    facturaControl = new FormControl('');
    facturaFiltered: Observable<Factura[]>;

    item: NotaVenta;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'precio', 'total', 'cantidadNotaVenta', 'subTotalNotaVenta', 'actions'];
    dataSource = new MatTableDataSource<FacturaDetalle>();
    detalles: FacturaDetalle[] = [];

    tiponotas: TipoNota[] = [];
    facturas: Factura[];
    facturaSelected: Factura;

    estadoNotaVenta = '';
    total = 0;
    totalNotaVenta = 0;

    cantidadNotaVenta: number[] = [];

    constructor(
        private dialogRef: MatDialogRef<NotaVentaDialogComponent>,
        private uiService: UIService,
        private notaVentaService: NotaVentaService,
        private utils: UtilService,
        private tipoNotaService: TipoNotaService,
        private facturaService: FacturaService,
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
            tipoNota: new FormControl('', [Validators.required]),
        });


        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = '';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            // this.total = this.item.monto;
            this.totalNotaVenta = this.item.monto;
            this.setForm(this.item);
            // this.totalIVA = this.item.libroCompra.montoIVA10 + this.item.libroCompra.montoIVA5;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.tipoNotaService.getTipoNotas().subscribe(
            (data) => {
                console.log(data);
                this.tiponotas = data;
                this.utils.stopLoading();
            },
            err => {
                console.log(err.error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
        this.utils.startLoading();
        this.facturaService.getFacturasProcesadas().subscribe(data => {
            console.log(data);
            this.facturas = data;
            this.facturaFiltered = this.facturaControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterFactura(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    setForm(item: NotaVenta) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
                tipoNota: item.tiponota,
                // numeroNotaCredito: item.numeroNotaCredito
            });
            this.form.get('observacion').disable();
            // this.facturaCompraSelected = this.item.facturaCompra;
            this.fecha = item.fecha;
            this.detalles = item.factura.facturaDetalles;
            this.estadoNotaVenta = item.estadoNotaVenta.descripcion;
            this.dataSource = new MatTableDataSource<FacturaDetalle>(
                this.detalles
            );
            item.notaVentaDetalle.forEach( nCD => {
                this.cantidadNotaVenta.push(nCD.cantidad);
            });
        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.estado = 'ACTIVO';
        this.item.tiponota = this.form.get('tiponota').value;
        this.item.fecha = this.fecha;
        this.item.monto = this.totalNotaVenta;
        this.item.cliente = this.facturaSelected.pedidoVenta.cliente;
        this.item.estadoNotaVenta = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.factura = this.facturaSelected;

        let i = 0;
        const notaVentaDetalles: NotaVentaDetalle[] = [];
        this.detalles.forEach( d => {
            if (this.cantidadNotaVenta[i] > 0) {
                notaVentaDetalles.push({
                    id: 0,
                    estado: 'ACTIVO',
                    monto: d.monto,
                    cantidad: this.cantidadNotaVenta[i],
                    articulo: d.pedidoVentaDetalle.articulo
                });
            }
            i++;
        });
        this.item.notaVentaDetalle = notaVentaDetalles;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selectedFactura($event): void {
        console.log($event.source.value);
        this.facturaSelected = $event.source.value;
        this.detalles.length = 0;
        this.total = this.facturaSelected.monto;
        this.totalNotaVenta = 0;
        this.cantidadNotaVenta.length = 0;
        this.facturaSelected.facturaDetalles.forEach( detalle => {
            this.detalles.push(detalle);
            this.cantidadNotaVenta.push(0);
        });
        this.dataSource = new MatTableDataSource<FacturaDetalle>(
            this.detalles
        );
    }


    displayFactura(value: Factura ) {
        if (value) {
            return value.numeroFactura + ' | ' +
                value.observacion + ' | ' +
                formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | ' +
                value.pedidoVenta.cliente.razon + ' | ' +
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
        } else if (!this.facturaSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar una Factura de Venta.',
                'Cerrar',
                5000
            );
            return false;
        }

        let sum = 0;
        this.cantidadNotaVenta.forEach( c => {
            sum += c;
        });

        if (sum === 0) {
            this.uiService.showSnackbar(
                'Debe seleccionar al menos un item.',
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
            this.notaVentaService.guardarNotaVenta(this.item)
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

    anular(dato: NotaVenta): void {
        this.utils.startLoading();
        this.notaVentaService.anularNotaVenta(dato).subscribe(
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
                title: 'Anular Nota de Venta',
                msg: '¿Está seguro que desea anular esta Nota de Venta?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    private _filterFactura(value: any): Factura[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.facturas.filter(factura =>
                factura.numeroFactura.toLowerCase().includes(filterValue) ||
                factura.observacion.toLowerCase().includes(filterValue) ||
                formatDate(factura.fecha, 'dd/MM/yyyy', 'en-US').includes(filterValue) ||
                factura.pedidoVenta.cliente.razon.toLowerCase().includes(filterValue) ||
                factura.usuario.nombre.includes(filterValue) ||
                factura.monto.toString().includes(filterValue))
        );
    }

    incItem(i: number) {
        this.cantidadNotaVenta[i]++;
        this.totalNotaVenta += this.detalles[i].monto;
    }

    descItem(i: number) {
        this.cantidadNotaVenta[i]--;
        this.totalNotaVenta -= this.detalles[i].monto;
    }

    disableInc(dato: FacturaDetalle, i: number) {
        return dato.pedidoVentaDetalle.cantidad <= this.cantidadNotaVenta[i];
    }
}
