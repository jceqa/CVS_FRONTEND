import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {PresupuestoCompra} from '../../../../../models/presupuestoCompra';
import {OrdenCompra} from '../../../../../models/ordenCompra';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {OrdenCompraDetalle} from '../../../../../models/ordenCompraDetalle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {OrdenCompraService} from '../../../../../services/ordencompra.service';
import {UtilService} from '../../../../../services/util.service';
import {PresupuestoCompraService} from '../../../../../services/presupuestocompra.service';
import {map, startWith} from 'rxjs/operators';
import {Estado} from '../../../../../models/estado';
import {Usuario} from '../../../../../models/usuario';
import {formatDate} from '@angular/common';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {CondicionPago} from '../../../../../models/condicionPago';
import {CondicionPagoService} from '../../../../../services/condicionpago.service';

@Component({
    selector: 'app-orden-compra-dialog',
    templateUrl: './orden-compra-dialog.component.html',
    styleUrls: ['./orden-compra-dialog.component.scss']
})
export class OrdenCompraDialogComponent implements OnInit {

    presupuestosControl = new FormControl('');
    presupuestosFiltered: Observable<PresupuestoCompra[]>;

    item: OrdenCompra;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'precio', 'total'/*, 'actions'*/];
    dataSource = new MatTableDataSource<OrdenCompraDetalle>();
    detalles: OrdenCompraDetalle[] = [];

    presupuestos: PresupuestoCompra[] = [];
    presupuestoSelected: PresupuestoCompra;

    condicionesPago: CondicionPago[] = [];
    cantidadCuotas = [3, 6, 12, 18, 24];
    intervalos = [7, 15, 30, 60, 90];

    estadoOrden = '';
    total = 0;

    condicionPagoType = 1;

    constructor(
        private dialogRef: MatDialogRef<OrdenCompraDialogComponent>,
        private uiService: UIService,
        private ordenCompraService: OrdenCompraService,
        private utils: UtilService,
        private presupuestoCompraService: PresupuestoCompraService,
        private condicionPagoService: CondicionPagoService,
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
            condicionPago: new FormControl('', [Validators.required]),
            cantidadCuota: new FormControl(''),
            intervalo: new FormControl(''),
            montoCuota: new FormControl(0),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            // this.getMarcaById(this.data.item.id);
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.form.get('observacion').disable();
            this.total = this.item.presupuestoCompra.total;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.presupuestoCompraService.getPresupuestosCompraPendientes().subscribe(data => {
            console.log(data);
            this.presupuestos = data;

            this.presupuestosFiltered = this.presupuestosControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterPresupuesto(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
        this.condicionPagoService.getCondicionPagos().subscribe(data => {
            console.log(data);
            this.condicionesPago = data;
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    setForm(item: OrdenCompra) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
            });
            this.fecha = item.fecha;
            this.detalles = item.ordenCompraDetalle;
            this.estadoOrden = item.estadoOrdenCompra.descripcion;
            this.dataSource = new MatTableDataSource<OrdenCompraDetalle>(
                this.detalles
            );

        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        this.item.estadoOrdenCompra = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.presupuestoCompra = this.presupuestoSelected;
        this.item.condicionPago = this.form.get('condicionPago').value;
        this.item.ordenCompraDetalle = this.detalles;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        // this.item.total = this.total;

        if (this.condicionPagoType === 2) {
            this.item.intervalo = this.form.get('intervalo').value;
            this.item.montoCuota = this.utils.getNumber(this.form.get('montoCuota').value);
            this.item.cantidadCuota = this.form.get('cantidadCuota').value;
        }
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selectedPresupuesto($event): void {
        console.log($event.source.value);
        this.presupuestoSelected = $event.source.value;

        this.detalles.length = 0;

        this.total = this.presupuestoSelected.total;

        this.presupuestoSelected.presupuestoCompraDetalles.forEach(pCD => {
            this.detalles.push(
                {
                    estado: 'ACTIVO',
                    id: 0,
                    monto: pCD.monto * pCD.pedidoCompraDetalle.cantidad,
                    presupuestoCompraDetalle: pCD
                });
        });

        this.dataSource = new MatTableDataSource<OrdenCompraDetalle>(
            this.detalles
        );

        const montoCuota = this.total / this.utils.getNumber(this.form.get('cantidadCuota').value);
        this.form.get('montoCuota').setValue(montoCuota);
    }

    tipoPagoSelected($event): void {
        if ($event.isUserInput) {
            console.log($event.source.value);
            this.condicionPagoType = $event.source.value.id;
        }
    }

    cantidadCuotaSelected($event): void {
        if ($event.isUserInput) {
            console.log($event.source.value);
            const montoCuota = this.total / this.utils.getNumber($event.source.value);
            this.form.get('montoCuota').setValue(montoCuota);
        }
    }

    displayPresupuesto(value) {
        if (value) {
            return value.observacion + ' | '
                + formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | '
                + value.usuario.nombre + ' | '
                + value.proveedor.razonSocial + ' | '
                + value.total.toString();
        }
    }

    setNumber($event, type) {
        this.form.get(type).setValue($event.target.value);
    }

    /*onKeydown($event, index) {
        if ($event.key === 'Enter') {
            this.setNumber($event, index);
        }
    }*/

    // Metodo que se llama al oprimir el boton guardar
    ok(): void {
        // Si es una edicion llama al metodo para editar
        if (this.formType === FormType.EDIT) {
            this.edit();
        }

        // Si es una lista nueva llama al metodo para agregar
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
        } else if (!this.presupuestoSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar un Presupuesto de Compra.',
                'Cerrar',
                5000
            );
            return false;
        } else if (this.condicionPagoType === 2) {
            if ( this.form.get('cantidadCuota').value === '') {
                this.uiService.showSnackbar(
                    'Debe especificar la cantidad de cuotas.',
                    'Cerrar',
                    5000
                );
                return false;
            } else if ( this.form.get('intervalo').value === '') {
                this.uiService.showSnackbar(
                    'Debe especificar intervalo entre las cuotas.',
                    'Cerrar',
                    5000
                );
                return false;
            }
        }
        return true;
    }

    add(): void {
        this.setAtributes();
        this.item.id = 0;
        if (this.validarCampos()) {
            this.utils.startLoading();
            this.ordenCompraService.guardarOrdenCompra(this.item)
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

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        // Asigna los valores del formulario al objeto a almacenar
        this.setAtributes();

        // Llama al servicio http que actualiza el objeto.
        if (this.utils.tieneLetras(this.item.observacion)) {
            this.ordenCompraService.editarOrdenCompra(this.item).subscribe(data => {
                console.log(data);
                this.uiService.showSnackbar(
                    'Modificado exitosamente.',
                    'Cerrar',
                    3000
                );

                this.dialogRef.close(data);
            }, (error) => {
                console.error('[ERROR]: ', error);

                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            });
        } else {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
        }
    }

    anular(dato: OrdenCompra): void {
        this.utils.startLoading();
        this.ordenCompraService.anularOrdenCompra(dato).subscribe(
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
                title: 'Anular Orden Compra',
                msg: '¿Está seguro que desea anular esta Orden de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    private _filterPresupuesto(value: any): PresupuestoCompra[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.presupuestos.filter(presupuesto =>
                presupuesto.observacion.toLowerCase().includes(filterValue) ||
                presupuesto.usuario.nombre.toLowerCase().includes(filterValue) ||
                presupuesto.proveedor.razonSocial.toLowerCase().includes(filterValue) ||
                formatDate(presupuesto.fecha, 'dd/MM/yyyy', 'en-US').includes(filterValue) ||
                presupuesto.total.toString().includes(filterValue))
        );
    }
}