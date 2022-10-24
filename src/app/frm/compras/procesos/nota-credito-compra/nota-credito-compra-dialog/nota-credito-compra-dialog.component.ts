import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {FacturaCompra} from '../../../../../models/facturaCompra';
import {NotaCreditoCompra} from '../../../../../models/notaCreditoCompra';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
// import {NotaCreditoCompraDetalle} from '../../../../../models/notaCreditoCompraDetalle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {NotaCreditoCompraService} from '../../../../../services/notacreditocompra.service';
import {UtilService} from '../../../../../services/util.service';
import {FacturaCompraService} from '../../../../../services/facturacompra.service';
import {map, startWith} from 'rxjs/operators';
import {Usuario} from '../../../../../models/usuario';
import {Estado} from '../../../../../models/estado';
// import {NotaRemision} from '../../../../../models/notaRemision';
// import {Deposito} from '../../../../../models/deposito';
// import {NotaRemisionDetalle} from '../../../../../models/notaRemisionDetalle';
// import {NotaDebitoCompra} from '../../../../../models/notaDebitoCompra';
import {formatDate} from '@angular/common';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {FacturaCompraDetalle} from '../../../../../models/facturaCompraDetalle';
import {NotaCreditoCompraDetalle} from '../../../../../models/notaCreditoCompraDetalle';

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

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'precio', 'total', 'cantidadNotaCredito', 'subTotalNotaCredito', 'actions'];
    dataSource = new MatTableDataSource<FacturaCompraDetalle>();
    detalles: FacturaCompraDetalle[] = [];

    facturasCompra: FacturaCompra[];
    facturaCompraSelected: FacturaCompra;

    estadoNotaCredito = '';
    total = 0;
    totalNotaCredito = 0;

    cantidadNotaCredito: number[] = [];

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
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = '';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            // this.total = this.item.monto;
            this.totalNotaCredito = this.item.monto;
            this.setForm(this.item);
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
            // this.facturaCompraSelected = this.item.facturaCompra;
            this.fecha = item.fecha;
            this.detalles = item.facturaCompra.facturaCompraDetalle;
            this.estadoNotaCredito = item.estadoNotaCreditoCompra.descripcion;
            this.dataSource = new MatTableDataSource<FacturaCompraDetalle>(
                this.detalles
            );
            item.notaCreditoCompraDetalle.forEach( nCD => {
               this.cantidadNotaCredito.push(nCD.cantidad);
            });
        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.estado = 'ACTIVO';
        this.item.fecha = this.fecha;
        this.item.monto = this.totalNotaCredito;
        this.item.proveedor = this.facturaCompraSelected.ordenCompra.proveedor;
        this.item.estadoNotaCreditoCompra = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.facturaCompra = this.facturaCompraSelected;

        let i = 0;
        const notaCreditoCompraDetalles: NotaCreditoCompraDetalle[] = [];
        this.detalles.forEach( d => {
            if (this.cantidadNotaCredito[i] > 0) {
                notaCreditoCompraDetalles.push({
                    id: 0,
                    estado: 'ACTIVO',
                    monto: d.ordenCompraDetalle.presupuestoCompraDetalle.monto,
                    cantidad: this.cantidadNotaCredito[i],
                    articulo: d.ordenCompraDetalle.presupuestoCompraDetalle.pedidoCompraDetalle.articulo
                });
            }
            i++;
        });
        this.item.notaCreditoCompraDetalle = notaCreditoCompraDetalles;
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
        this.totalNotaCredito = 0;
        this.cantidadNotaCredito.length = 0;
        this.facturaCompraSelected.facturaCompraDetalle.forEach( detalle => {
            this.detalles.push(detalle);
            this.cantidadNotaCredito.push(0);
        });
        this.dataSource = new MatTableDataSource<FacturaCompraDetalle>(
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

        let sum = 0;
        this.cantidadNotaCredito.forEach( c => {
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
            this.notaCreditoCompraService.guardarNotaCreditoCompra(this.item)
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

    incItem(i: number) {
        this.cantidadNotaCredito[i]++;
        this.totalNotaCredito += this.detalles[i].ordenCompraDetalle.presupuestoCompraDetalle.monto;
    }

    descItem(i: number) {
        this.cantidadNotaCredito[i]--;
        this.totalNotaCredito -= this.detalles[i].ordenCompraDetalle.presupuestoCompraDetalle.monto;
    }

    disableInc(dato: FacturaCompraDetalle, i: number) {
        return dato.ordenCompraDetalle.presupuestoCompraDetalle.pedidoCompraDetalle.cantidad <= this.cantidadNotaCredito[i];
    }
}
