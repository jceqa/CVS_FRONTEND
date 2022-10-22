import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {UtilService} from '../../../../../services/util.service';
import {map, startWith} from 'rxjs/operators';
import {Usuario} from '../../../../../models/usuario';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {RecepcionService} from '../../../../../services/recepcion.service';
import {Recepcion} from '../../../../../models/recepcion';
import {formatDate} from '@angular/common';
import {Deposito} from '../../../../../models/deposito';
import {DepositoService} from '../../../../../services/deposito.service';
import {Sucursal} from '../../../../../models/sucursal';
import {OrdenServicio} from '../../../../../models/ordenServicio';
import {OrdenServicioDetalle} from '../../../../../models/ordenServicioDetalle';
import {SucursalService} from '../../../../../services/sucursal.service';
import {OrdenServicioService} from '../../../../../services/ordenservicio.service';

@Component({
    selector: 'app-orden-servicio-dialog',
    templateUrl: './orden-servicio-dialog.component.html',
    styleUrls: ['./orden-servicio-dialog.component.scss']
})
export class OrdenServicioDialogComponent implements OnInit {

    recepcionControl = new FormControl('');
    depositoControl = new FormControl('');
    sucursalControl = new FormControl('');
    recepcionesFiltered: Observable<Recepcion[]>;
    depositoFiltered: Observable<Deposito[]>;
    sucursalesFiltered: Observable<Sucursal[]>;

    item: OrdenServicio;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'precio', 'total'/*, 'actions'*/];
    dataSource = new MatTableDataSource<OrdenServicioDetalle>();
    detalles: OrdenServicioDetalle[] = [];

    recepciones: Recepcion[] = [];
    depositos: Deposito[] = [];
    sucursales: Sucursal[] = [];
    recepcionSelected: Recepcion;
    depositoSelected: Deposito;
    sucursalSelected: Sucursal;

    estadoOrdenServicio = '';
    total = 0;

    constructor(
        private dialogRef: MatDialogRef<OrdenServicioDialogComponent>,
        private uiService: UIService,
        private ordenServicioService: OrdenServicioService,
        private utils: UtilService,
        private recepcionService: RecepcionService,
        private depositoService: DepositoService,
        private sucursalService: SucursalService,
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
            // this.title = 'Editar';
            this.title = '';
            this.editID = this.data.item.id;
            // this.getMarcaById(this.data.item.id);
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.form.get('observacion').disable();
            // this.total = this.item.total;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.recepcionService.getRecepcionPendientes().subscribe(data => {
            console.log(data);
            this.recepciones = data;

            this.recepcionesFiltered = this.recepcionControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterRecepcion(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
        this.depositoService.getDepositos().subscribe(data => {
            console.log(data);
            this.depositos = data;

            this.depositoFiltered = this.depositoControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterDeposito(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
        this.sucursalService.getSucursales().subscribe(data => {
            console.log(data);
            this.sucursales = data;

            this.sucursalesFiltered = this.sucursalControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterSucursal(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    setForm(item: OrdenServicio) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
            });
            this.fecha = item.fecha;
            // this.detalles = item.presupuestoCompraDetalles;
            // this.estadoOrdenServicio = item.estadoOrdenServicio.descripcion;
            this.dataSource = new MatTableDataSource<OrdenServicioDetalle>(
                this.detalles
            );

        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        // this.item.estadoOrdenServicio = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        /* this.item.ordenServicioDetalles = this.detalles;
        this.item.total = this.total;
        this.item.recepcion = this.recepcionSelected;
        this.item.deposito = this.depositoSelected;
        this.item.sucursal = this.sucursalSelected;*/
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    /*selectedRecepcion($event): void {
        console.log($event.source.value);
        this.recepcionSelected = $event.source.value;

        this.detalles.length = 0;

        this.recepcionSelected.RecepcionDetalle.forEach(dPC => {
            this.detalles.push(
                {
                    estado: 'ACTIVO',
                    id: 0,
                    monto: 0,
                    recepcionDetalle: dPC
                });
        });

        this.dataSource = new MatTableDataSource<OrdenServicioDetalle>(
            this.detalles
        );
    }*/

    selectedDeposito($event): void {
        console.log($event.source.value);
        this.depositoSelected = $event.source.value;
    }

    selectedSucursal($event): void {
        console.log($event.source.value);
        this.sucursalSelected = $event.source.value;
    }

    displayRecepcion(value) {
        if (value) {
            return value.observacion + ' | '
                + formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | '
                + value.usuario.nombre + ' | '
                + value.deposito.descripcion;
        }
    }

    displayDeposito(value) {
        if (value) {
            return value.id + ' | ' + value.descripcion;
        }
    }

    displaySucursal(value) {
        if (value) {
            return value.id + ' | ' + value.descripcion;
        }
    }

    /*setNumber($event, index) {
        this.total -= this.detalles[index].monto * this.detalles[index].pedidoCompraDetalle.cantidad;
        this.detalles[index].monto = this.utils.getNumber($event.target.value);
        this.total += this.detalles[index].monto * this.detalles[index].pedidoCompraDetalle.cantidad;
    }

    onKeydown($event, index) {
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
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
            return false;
        } else if (!this.recepcionSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar un Pedido de Compra.',
                'Cerrar',
                5000
            );
            return false;
        }

        /*let haveZero = false;
        this.item.ordenServicioDetalles.forEach(pcd => {
            if (pcd.monto === 0) {
                haveZero = true;
            }
        });

        if (haveZero) {
            this.uiService.showSnackbar(
                'Debe especificar un Precio diferente de 0 para cada Articulo.',
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
            this.utils.startLoading();
            this.ordenServicioService.guardarOrdenServicio(this.item)
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

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        // Asigna los valores del formulario al objeto a almacenar
        this.setAtributes();

        // Llama al servicio http que actualiza el objeto.
        if (this.utils.tieneLetras(this.item.observacion)) {
            this.ordenServicioService.editarOrdenServicio(this.item).subscribe(data => {
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

    anular(dato: OrdenServicio): void {
        this.utils.startLoading();
        this.ordenServicioService.anularOrdenServicio(dato).subscribe(
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
                title: 'Anular Orden de Servicio',
                msg: '¿Está seguro que desea anular esta Orden de Servicio?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    private _filterSucursal(value: any): Sucursal[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.sucursales.filter(sucursal =>
                sucursal.descripcion.toLowerCase().includes(filterValue))
        );
    }

    private _filterDeposito(value: any): Deposito[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.depositos.filter(deposito =>
                deposito.descripcion.toLowerCase().includes(filterValue) ||
                deposito.sucursal.descripcion.toLowerCase().includes(filterValue))
        );
    }

    private _filterRecepcion(value: any): Recepcion[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.recepciones.filter(recepcion =>
                recepcion.observacion.toLowerCase().includes(filterValue) ||
                recepcion.usuario.nombre.toLowerCase().includes(filterValue) ||
                recepcion.sucursal.descripcion.toLowerCase().includes(filterValue) ||
                formatDate(recepcion.fecha, 'dd/MM/yyyy', 'en-US').includes(filterValue))
        );
    }
}

