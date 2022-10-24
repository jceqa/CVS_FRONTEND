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
import {formatDate} from '@angular/common';
import {OrdenServicio} from '../../../../../models/ordenServicio';
import {OrdenServicioDetalle} from '../../../../../models/ordenServicioDetalle';
import {OrdenServicioService} from '../../../../../services/ordenservicio.service';
import {PresupuestoServicio} from '../../../../../models/presupuestoServicio';
import {PresupuestoServicioService} from '../../../../../services/presupuestoservicio.service';
import {
    DiagnosticoEquipoDialogComponent
} from '../../diagnostico/diagnostico-dialog/diagnostico-equipo-dialog/diagnostico-equipo-dialog.component';
import {PresupuestoServicioDetalle} from '../../../../../models/presupuestoServicioDetalle';
import {DateAdapter} from '@angular/material/core';
import {Estado} from '../../../../../models/estado';

@Component({
    selector: 'app-orden-servicio-dialog',
    templateUrl: './orden-servicio-dialog.component.html',
    styleUrls: ['./orden-servicio-dialog.component.scss']
})
export class OrdenServicioDialogComponent implements OnInit {

    presupuestoControl = new FormControl('');
    presupuestoFiltered: Observable<PresupuestoServicio[]>;

    item: OrdenServicio;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();
    fechaEntrega = new Date();
    fechaVencimiento = new Date();

    minDate = new Date();

    displayedColumns: string[] = ['equipo', 'diagnostico', 'subTotal', 'actions'];
    dataSource = new MatTableDataSource<OrdenServicioDetalle>();
    detalles: OrdenServicioDetalle[] = [];

    presupuestos: PresupuestoServicio[] = [];
    presupuestoSelected: PresupuestoServicio;

    estadoOrdenServicio = '';
    total = 0;

    constructor(
        private dialogRef: MatDialogRef<OrdenServicioDialogComponent>,
        private uiService: UIService,
        private ordenServicioService: OrdenServicioService,
        private utils: UtilService,
        private presupuestoService: PresupuestoServicioService,
        private dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dateAdapter.setLocale('en-GB'); // dd/MM/yyyy
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.fechaEntrega.setDate(this.fechaEntrega.getDate() + 3);
        this.fechaVencimiento.setDate(this.fechaVencimiento.getDate() + 90);
        this.form = new FormGroup({
            id: new FormControl('', []),
            observacion: new FormControl('', [Validators.required]),
            fechaEntrega: new FormControl(this.fechaEntrega, [Validators.required]),
            vencimientoGarantia: new FormControl(this.fechaVencimiento, [Validators.required]),
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
            this.total = this.item.total;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.presupuestoService.getPresupuestosServicioPendientes().subscribe(data => {
            console.log(data);
            this.presupuestos = data;

            this.presupuestoFiltered = this.presupuestoControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterPresupuesto(value || '')),
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
            this.detalles = item.ordenServicioDetalles;
            this.estadoOrdenServicio = item.estadoOrdenServicio.descripcion;
            this.dataSource = new MatTableDataSource<OrdenServicioDetalle>(
                this.detalles
            );

        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.total = this.total;
        this.item.fechaEntrega = this.fechaEntrega;
        this.item.vencimientoGarantia = this.fechaVencimiento;
        this.item.estadoOrdenServicio = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.ordenServicioDetalles = this.detalles;
        this.item.presupuestoServicio = this.presupuestoSelected;
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
        this.total = 0;
        this.detalles.length = 0;

        this.presupuestoSelected.presupuestoServicioDetalles.forEach( (dPC: PresupuestoServicioDetalle) => {
            this.detalles.push(
                {
                    estado: 'ACTIVO',
                    id: 0,
                    monto: dPC.monto,
                    presupuestoServicioDetalle: dPC
                });
            this.total += dPC.monto;
        });

        this.dataSource = new MatTableDataSource<OrdenServicioDetalle>(
            this.detalles
        );
    }

    displayPresupuesto(value: PresupuestoServicio) {
        if (value) {
            return value.observacion + ' | '
                + formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | '
                + value.usuario.nombre + ' | '
                + value.diagnostico.recepcion.sucursal.descripcion + ' | '
                + value.diagnostico.recepcion.recepcionDetalles[0].equipo.cliente.razon + ' | '
                + value.total.toString();
        }
    }

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
        } else if (!this.presupuestoSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar un Prespuesto de Servicio.',
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

    private _filterPresupuesto(value: any): PresupuestoServicio[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.presupuestos.filter(presupuesto =>
                presupuesto.observacion.toLowerCase().includes(filterValue) ||
                presupuesto.usuario.nombre.toLowerCase().includes(filterValue) ||
                presupuesto.diagnostico.recepcion.sucursal.descripcion.toLowerCase().includes(filterValue) ||
                presupuesto.diagnostico.recepcion.recepcionDetalles[0].equipo.cliente.razon.toLowerCase().includes(filterValue) ||
                formatDate(presupuesto.fecha, 'dd/MM/yyyy', 'en-US').includes(filterValue))
        );
    }

    openDialog(index): void {
        const dialogRef = this.dialog.open(DiagnosticoEquipoDialogComponent, {
            minWidth: '70%',
            // maxWidth: '600px',
            disableClose: true,
            autoFocus: false,
            data: {
                type: FormType.EDIT,
                item: this.detalles[index].presupuestoServicioDetalle.diagnosticoDetalle.servicios
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                // this.detalles[index].servicios = result;
            }
        });
    }
}
