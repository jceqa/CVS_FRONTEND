import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {PresupuestoCompra} from '../../../../../models/presupuestoCompra';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {PresupuestoCompraDetalle} from '../../../../../models/presupuestoCompraDetalle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {DiagnosticoService} from '../../../../../services/diagnostico.service';
import {UtilService} from '../../../../../services/util.service';
import {map, startWith} from 'rxjs/operators';
import {Estado} from '../../../../../models/estado';
import {Usuario} from '../../../../../models/usuario';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {RecepcionService} from '../../../../../services/recepcion.service';
import {Recepcion} from '../../../../../models/recepcion';
import {formatDate} from '@angular/common';


@Component({
    selector: 'app-diagnostico-dialog',
    templateUrl: './diagnostico-dialog.component.html',
    styleUrls: ['./diagnostico-dialog.component.scss']
})
export class DiagnosticoDialogComponent implements OnInit {

    recepcionesControl = new FormControl('');
    recepcionFiltered: Observable<Recepcion[]>;

    item: Diagnostico;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['codigo', 'item', 'diagnostico'/*, 'actions'*/];
    dataSource = new MatTableDataSource<DiagnosticoDetalle>();
    detalles: DiagosticoDetalle[] = [];

    recepciones: Recepcion[] = [];
    recepcionSelected: Recepcion;

    estadoDiagnostico = '';
    total = 0;

    constructor(
        private dialogRef: MatDialogRef<DiagnosticoDialogComponent>,
        private uiService: UIService,
        private diagnosticoService: DiagnosticoService,
        private utils: UtilService,
        private recepcionService: RecepcionService,
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
            this.total = this.item.total;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.recepcionService.getRecepcionPendientes().subscribe(data => {
            console.log(data);
            this.recepciones = data;
            this.recepcionFiltered = this.recepcionesControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterRecepcion(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    setForm(item: Diagnostico) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
            });
            this.fecha = item.fecha;
            this.detalles = item.diagnosticoDetalles;
            this.estadoDiagnostico = item.estadoDiagnostico.descripcion;
            this.dataSource = new MatTableDataSource<DiagnosticoDetalle>(
                this.detalles
            );

        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.estadoDiagnostico = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        this.item.diagnosticoDetalles = this.detalles;
        this.item.recepcion = this.recepcionSelected;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selectedRecepcion($event): void {
        console.log($event.source.value);
        this.recepcionSelected = $event.source.value;

        this.detalles.length = 0;

        this.recepcionSelected.recepcionDetalles.forEach(dPC => {
            this.detalles.push(
                {
                    estado: 'ACTIVO',
                    id: 0,
                    monto: 0,
                    recepcionDetalle: dPC
                });
        });

        this.dataSource = new MatTableDataSource<DiagnosticoDetalle>(
            this.detalles
        );
    }

    displayRecepcion(value) {
        if (value) {
            return value.observacion + ' | '
                + formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | '
                + value.usuario.nombre + ' | '
                + value.sucursal.descripcion;
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
        } else if (!this.recepcionSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar una Recepcion.',
                'Cerrar',
                5000
            );
            return false;
        }

        let haveZero = false;
        this.item.diagnosticoDetalle.forEach( pcd => {
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
        }

        return true;
    }

    add(): void {
        this.setAtributes();
        this.item.id = 0;
        if (this.validarCampos()) {
            this.utils.startLoading();
            this.diagnosticoService.guardarDiagnostico(this.item)
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
            this.diagnosticoService.editardiagnostico(this.item).subscribe(data => {
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

    anular(dato: PresupuestoCompra): void {
        this.utils.startLoading();
        this.diagnosticoService.anularDiagosticoDetalle(dato).subscribe(
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
                title: 'Anular Diagnostico',
                msg: '¿Está seguro que desea anular este Diagnostico?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
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
