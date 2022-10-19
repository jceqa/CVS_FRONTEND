import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {UtilService} from '../../../../../services/util.service';
import {ClienteService} from '../../../../../services/cliente.service';
import {Cliente} from '../../../../../models/cliente';
import {MatTableDataSource} from '@angular/material/table';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Equipo} from '../../../../../models/equipo';
import {EquipoService} from '../../../../../services/equipo.service';
import {Usuario} from '../../../../../models/usuario';
import {Recepcion} from '../../../../../models/recepcion';
import {RecepcionService} from '../../../../../services/recepcion.service';
import {RecepcionDetalle} from '../../../../../models/recepcionDetalle';
import {Estado} from '../../../../../models/estado';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {SucursalService} from '../../../../../services/sucursal.service';
import {Sucursal} from '../../../../../models/sucursal';

@Component({
    selector: 'app-recepcion-dialog',
    templateUrl: './recepcion-dialog.component.html',
    styleUrls: ['./recepcion-dialog.component.scss']
})
export class RecepcionDialogComponent implements OnInit {

    myControl = new FormControl('');
    clienteControl = new FormControl('');
    options: Equipo[] = [];
    filteredOptions: Observable<Equipo[]>;
    clienteFiltered: Observable<Cliente[]>;

    item: Recepcion;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    fecha = new Date();

    equipoSelected: Equipo = null;
    clientes: Cliente[] = [];
    sucursales: Sucursal[] = [];

    displayedColumns: string[] = ['codigo', 'descripcion', 'marca', 'modelo', 'serie',  'actions'];
    dataSource = new MatTableDataSource<RecepcionDetalle>();
    detalles: RecepcionDetalle[] = [];

    estadoRecepcion = '';
    clienteSelected: Cliente;

    constructor(
        private dialogRef: MatDialogRef<RecepcionDialogComponent>,
        private uiService: UIService,
        private recepcionService: RecepcionService,
        private equipoService: EquipoService,
        private utils: UtilService,
        private clienteService: ClienteService,
        private dialog: MatDialog,
        private sucursalService: SucursalService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            observacion: new FormControl('', [Validators.required]),
            sucursal: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            // this.getMarcaById(this.data.item.id);
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.form.get('observacion').disable();
            this.form.get('sucursal').disable();
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.equipoService.listEquipos().subscribe(data => {
            console.log(data);
            this.options = data;

            this.filteredOptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
        this.clienteService.getClientes().subscribe(data => {
            console.log(data);
            this.clientes = data;
            this.clienteFiltered = this.clienteControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterCliente(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
        this.sucursalService.getSucursalByUserId(this.utils.getUserId()).subscribe(data => {
            console.log(data);
            this.sucursales = data;
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    private _filter(value: any): Equipo[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.options.filter(option => option.modelo.toString().includes(filterValue) ||
                option.serie.toString().includes(filterValue) ||
                option.descripcion.toLowerCase().includes(filterValue))
        );
    }


    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    setForm(item: Recepcion) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
                sucursal: item.sucursal,
                cliente: item.cliente,
            });
            this.fecha = item.fecha;
            this.detalles = item.recepcionDetalles;
            this.estadoRecepcion = item.estadoRecepcion.descripcion;
            this.dataSource = new MatTableDataSource<RecepcionDetalle>(
                this.detalles
            );

            // this.listClientes();
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.cliente = this.clienteSelected;
        this.item.sucursal = this.form.get('sucursal').value;
        this.item.estadoRecepcion = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        this.item.recepcionDetalles = this.detalles;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selected($event): void {
        console.log($event.source.value);
        this.equipoSelected = $event.source.value;
    }

    display(value: Equipo) {
        if (value) {
            return value.descripcion + ' | ' + value.marca.descripcion + ' | ' + value.modelo + ' | ' + value.serie;
        }
    }

    displayCliente(value: Cliente) {
        if (value) {
            return value.ruc + ' | ' + value.razon;
        }
    }

    limpiarCampos() {
        this.equipoSelected = null;
        this.myControl.setValue('');
    }

    addItem() {
        if (this.equipoSelected !== null) {
            const art = this.detalles.find(d => d.equipo.id === this.equipoSelected.id);
            if (art) {
                this.uiService.showSnackbar(
                    'No se puede seleccionar dos veces el mismo equipo.',
                    'Cerrar',
                    3000
                );
            } else {
                this.detalles.push({
                    'id': 0,
                    'equipo': this.equipoSelected,
                    'estado': 'ACTIVO'
                });
            }
            console.log(this.detalles);
            this.dataSource = new MatTableDataSource<RecepcionDetalle>(
                this.detalles
            );
            this.limpiarCampos();
        } else {
            this.uiService.showSnackbar(
                'Debe seleccionar un articulo.',
                'Cerrar',
                3000
            );
        }
    }

    deleteItem(dato) {
        this.detalles = this.detalles.filter(d => d.equipo.id !== dato.equipo.id);
        this.dataSource = new MatTableDataSource<RecepcionDetalle>(
            this.detalles
        );
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

    // Metodo para agregar una nueva lista de precios
    add(): void {
        this.setAtributes();
        this.item.id = 0;
        if (this.validarCampos()) {
            // Llama al servicio que almacena el objeto {PriceListDraft}
            this.utils.startLoading();
            this.recepcionService.guardarRecepcion(this.item)
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
        if (this.validarCampos()) {
            this.recepcionService.editarRecepcion(this.item).subscribe(data => {
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
        }
    }

    anular(dato: Recepcion): void {
        this.utils.startLoading();
        this.recepcionService.anularRecepcion(dato).subscribe(
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
                title: 'Anular Recepcion',
                msg: '¿Está seguro que desea anular esta Recepcion?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    validarCampos(): boolean {
        if (!this.utils.tieneLetras(this.item.observacion)) {
            this.uiService.showSnackbar(
                'La observacion no puede ser solo númerica.',
                'Cerrar',
                5000
            );
            return false;
        } else if (!this.clienteSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar un Cliente.',
                'Cerrar',
                5000
            );
            return false;
        } else if (this.detalles.length === 0) {
            this.uiService.showSnackbar(
                'Debe seleccionar al menos un Equipo.',
                'Cerrar',
                5000
            );
            return false;
        }
        return true;
    }

    selectedCliente($event): void {
        console.log($event.source.value);
        this.clienteSelected = $event.source.value;
    }

    private _filterCliente(value: any): Cliente[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.clientes.filter(cliente =>
                cliente.ruc.toLowerCase().includes(filterValue) ||
                cliente.razon.toLowerCase().includes(filterValue))
        );
    }
}
