import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {map, startWith} from 'rxjs/operators';
import {formatDate} from '@angular/common';
import {Diagnostico} from '../../../../../models/diagnostico';
import {PresupuestoServicio} from '../../../../../models/presupuestoServicio';
import {FormType} from '../../../../../models/enum';
import {PresupuestoServicioDetalle} from '../../../../../models/presupuestoServicioDetalle';
import {UIService} from '../../../../../services/ui.service';
import {PresupuestoServicioService} from '../../../../../services/presupuestoservicio.service';
import {UtilService} from '../../../../../services/util.service';
import {DiagnosticoService} from '../../../../../services/diagnostico.service';
import {PromoDescuento} from '../../../../../models/promoDescuento';
import {PromoDescuentoService} from '../../../../../services/promodescuento.service';
import {Usuario} from '../../../../../models/usuario';
import {Estado} from '../../../../../models/estado';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {
    DiagnosticoEquipoDialogComponent
} from '../../diagnostico/diagnostico-dialog/diagnostico-equipo-dialog/diagnostico-equipo-dialog.component';


@Component({
    selector: 'app-presupuesto-dialog-servicio',
    templateUrl: './presupuesto-servicio-dialog.component.html',
    styleUrls: ['./presupuesto-servicio-dialog.component.scss']
})
export class PresupuestoServicioDialogComponent implements OnInit {

    diagnosticosControl = new FormControl('');
    promoDescuentoControl = new FormControl('');
    diagnosticosFiltered: Observable<Diagnostico[]>;
    promoDescuentoFiltered: Observable<PromoDescuento[]>;

    item: PresupuestoServicio;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['equipo', 'diagnostico', 'subTotal', 'actions'];
    dataSource = new MatTableDataSource<PresupuestoServicioDetalle>();
    detalles: PresupuestoServicioDetalle[] = [];

    diagnosticos: Diagnostico[] = [];
    promoDescuento: PromoDescuento[] = [];
    diagnosticoSelected: Diagnostico;
    promoDescuentoSelected: PromoDescuento;

    estadoPresupuestoServicio = '';
    total = 0;
    totalDescuento = 0;
    totalConDescuento = 0;
    subTotales: number[] = [];

    constructor(
        private dialogRef: MatDialogRef<PresupuestoServicioDialogComponent>,
        private uiService: UIService,
        private presupuestoServicioService: PresupuestoServicioService,
        private utils: UtilService,
        private diagnosticoService: DiagnosticoService,
        private promoDescuentoService: PromoDescuentoService,
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
        this.diagnosticoService.getDiagnosticosPendientes().subscribe(data => {
            console.log(data);
            this.diagnosticos = data;

            this.diagnosticosFiltered = this.diagnosticosControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterDiagnostico(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
        this.promoDescuentoService.listPromoDescuentos().subscribe(data => {
            console.log(data);
            this.promoDescuento = data;

            this.promoDescuentoFiltered = this.promoDescuentoControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterPromoDescuento(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    setForm(item: PresupuestoServicio) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
            });
            this.fecha = item.fecha;
            this.detalles = item.presupuestoServicioDetalles;
            this.estadoPresupuestoServicio = item.estadoPresupuestoServicio.descripcion;
            this.dataSource = new MatTableDataSource<PresupuestoServicioDetalle>(
                this.detalles
            );
        }

        this.detalles.forEach(d => {
            let subTotal = 0;
            d.diagnosticoDetalle.servicios.forEach(s => {
                subTotal += s.monto;
                if (s.articulo) {
                    subTotal += s.articulo.precioVenta;
                }
            });
            this.subTotales.push(subTotal);
            this.total += subTotal;
        });

        this.totalDescuento = this.total * (item.promoDescuento.porcentaje / 100);
        this.totalConDescuento = this.total - this.totalDescuento;
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.estadoPresupuestoServicio = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        this.item.presupuestoServicioDetalles = this.detalles;
        this.item.total = this.total;
        this.item.diagnostico = this.diagnosticoSelected;
        this.item.promoDescuento = this.promoDescuentoSelected;
        // this.item.servicio = this.servicioSelected;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selectedDiagnostico($event): void {
        console.log($event.source.value);
        this.diagnosticoSelected = $event.source.value;

        this.detalles.length = 0;

        this.diagnosticoSelected.diagnosticoDetalles.forEach(dPC => {
            this.detalles.push(
                {
                    estado: 'ACTIVO',
                    id: 0,
                    monto: 0,
                    diagnosticoDetalle: dPC,
                });
        });

        this.dataSource = new MatTableDataSource<PresupuestoServicioDetalle>(
            this.detalles
        );

        this.detalles.forEach(d => {
            let subTotal = 0;
            d.diagnosticoDetalle.servicios.forEach(s => {
                subTotal += s.monto;
                if (s.articulo) {
                    subTotal += s.articulo.precioVenta;
                }
            });
            d.monto = subTotal;
            this.subTotales.push(subTotal);
            this.total += subTotal;
        });
    }

    selectedPromoDescuento($event): void {
        console.log($event.source.value);
        this.promoDescuentoSelected = $event.source.value;

        this.totalDescuento = this.total * (this.promoDescuentoSelected.porcentaje / 100);
        this.totalConDescuento = this.total - this.totalDescuento;
    }

    displayDiagnostico(value: Diagnostico) {
        if (value) {
            return value.observacion + ' | '
                + formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | '
                + value.usuario.nombre + ' | '
                + value.recepcion.recepcionDetalles[0].equipo.cliente.razon + ' | '
                + value.recepcion.sucursal.descripcion;
        }
    }

    displayPromoDescuento(value: PromoDescuento) {
        if (value) {
            return value.id + ' | '
                + value.descripcion + ' | '
                + value.porcentaje.toString() + '%';
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
        } else if (!this.diagnosticoSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar un Diagnostico.',
                'Cerrar',
                5000
            );
            return false;
        } else if (!this.promoDescuentoSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar una Promo/Descuento.',
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
            this.presupuestoServicioService.guardarPresupuestoServicio(this.item)
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
            this.presupuestoServicioService.editarPresupuestoServicio(this.item).subscribe(data => {
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

    anular(dato: PresupuestoServicio): void {
        this.utils.startLoading();
        this.presupuestoServicioService.anularPresupuestoServicio(dato).subscribe(
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
                title: 'Anular Presupuesto de Servicio',
                msg: '¿Está seguro que desea anular este Presupuesto de Servicio?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    private _filterDiagnostico(value): Diagnostico[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.diagnosticos.filter(diagnostico =>
                diagnostico.observacion.toLowerCase().includes(filterValue) ||
                diagnostico.usuario.nombre.toLowerCase().includes(filterValue) ||
                diagnostico.recepcion.sucursal.descripcion.toLowerCase().includes(filterValue) ||
                diagnostico.recepcion.recepcionDetalles[0].equipo.cliente.razon.toLowerCase().includes(filterValue) ||
                formatDate(diagnostico.fecha, 'dd/MM/yyyy', 'en-US').includes(filterValue))
        );
    }

    private _filterPromoDescuento(value: any): PromoDescuento[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.promoDescuento.filter(promoDescuento =>
                promoDescuento.id.toString().toLowerCase().includes(filterValue) ||
                promoDescuento.porcentaje.toString().toLowerCase().includes(filterValue) ||
                promoDescuento.descripcion.toLowerCase().includes(filterValue))
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
                item: this.detalles[index].diagnosticoDetalle.servicios
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
