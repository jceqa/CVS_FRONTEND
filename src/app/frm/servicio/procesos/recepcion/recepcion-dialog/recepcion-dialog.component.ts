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

@Component({
    selector: 'app-recepcion-dialog',
    templateUrl: './recepcion-dialog.component.html',
    styleUrls: ['./recepcion-dialog.component.scss']
})
export class RecepcionDialogComponent implements OnInit {

    myControl = new FormControl('');
    options: Equipo[] = [];
    filteredOptions: Observable<Equipo[]>;

    item: Recepcion;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    fecha = new Date();

    equipoSelected: Equipo = null;
    clientes: Cliente[] = [];

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'actions'];
    dataSource = new MatTableDataSource<RecepcionDetalle>();
    detalles: RecepcionDetalle[] = [];

    estadoRecepcion = '';

    constructor(
        private dialogRef: MatDialogRef<RecepcionDialogComponent>,
        private uiService: UIService,
        private recepcionService: RecepcionService,
        private equipoService: EquipoService,
        private utils: UtilService,
        private clienteService: ClienteService,
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
            cliente: new FormControl('', [Validators.required]),
            // codigoArticulo: new FormControl(''),
            // descripcionArticulo: new FormControl(''),
            cantidadEquipo: new FormControl(0),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            // this.getMarcaById(this.data.item.id);
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.form.get('observacion').disable();
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
                // deposito: item.deposito,
                cliente: item.cliente,
            });
            this.fecha = item.fecha;
            this.detalles = item.recepcionDetalle;
            this.estadoRecepcion = item.estadoRecepcion.descripcion;
            this.dataSource = new MatTableDataSource<RecepcionDetalle>(
                this.detalles
            );

            this.listClientes();
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.cliente = this.form.get('cliente').value;
        this.item.estadoRecepcion = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        this.item.recepcionDetalle = this.detalles;
    }

    listClientes() {
        this.form.get('cliente').setValue('');
        this.utils.startLoading();
        this.clienteService.getClientes().subscribe(
            data => {
                console.log(data);
                this.clientes = data;
                this.utils.stopLoading();
                if (this.formType === FormType.EDIT) {
                    this.form.get('deposito').setValue(this.item.cliente);
                }
                this.utils.stopLoading();
            }, error => {
                console.log(error);
                this.utils.stopLoading();
            }
        );
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

    display(value) {
        if (value) {
            return value.codigoGenerico.toString() + ' - ' + value.descripcion;
        }
    }

    limpiarCampos() {
        this.equipoSelected = null;
        this.myControl.setValue('');
        this.form.get('cantidadArticulo').setValue(0);
    }

    addItem() {
        if (this.equipoSelected !== null) {
            if (this.form.get('cantidadEquipo').value > 0) {
                const art = this.detalles.find(d => d.equipo.id === this.equipoSelected.id);
                if (art) {
                    art.cantidad += this.form.get('cantidadEquipo').value;
                    /*const index = this.detalles.indexOf(art);
                    this.detalles.splice(index, 1, {
                        'id': 0,
                        'articulo': this.articuloSelected,
                        'cantidad': this.form.get('cantidadArticulo').value + this.detalles[index].cantidad,
                        'estado': 'ACTIVO'
                    });*/
                } else {
                    this.detalles.push({
                        'id': 0,
                        'equipo': this.equipoSelected,
                        'cantidad': this.form.get('cantidadArticulo').value,
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
                    'La cantidad de equipos debe ser mayor a 0.',
                    'Cerrar',
                    3000
                );
            }
        } else {
            this.uiService.showSnackbar(
                'Debe seleccionar un articulo.',
                'Cerrar',
                3000
            );
        }
    }

    incItem(dato) {
        dato.cantidad++;
    }

    descItem(dato) {
        dato.cantidad--;
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
        if (this.detalles.length > 0) {
            this.setAtributes();
            this.item.id = 0;
            if (this.utils.tieneLetras(this.item.observacion)) {
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
            } else {
                this.uiService.showSnackbar(
                    'La descripción no puede ser solo númerica.',
                    'Cerrar',
                    5000
                );
            }
        } else {
            this.uiService.showSnackbar(
                'Debe asignar al menos un detalle al pedido.',
                'Cerrar',
                5000
            );
        }
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        // Asigna los valores del formulario al objeto a almacenar
        this.setAtributes();

        // Llama al servicio http que actualiza el objeto.
        if (this.utils.tieneLetras(this.item.observacion)) {
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
        } else {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
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

}
