import { Component, OnInit, Inject } from '@angular/core';
import { Equipo } from '../../../../../models/equipo';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormType } from '../../../../../models/enum';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UIService } from '../../../../../services/ui.service';
import { EquipoService } from '../../../../../services/equipo.service';
import { MarcaService } from '../../../../../services/marca.service';
import {Observable} from 'rxjs';
import {Cliente} from '../../../../../models/cliente';
import {ClienteService} from '../../../../../services/cliente.service';
import {map, startWith} from 'rxjs/operators';
import {UtilService} from '../../../../../services/util.service';

@Component({
    selector: 'app-equipo-dialog',
    templateUrl: './equipo-dialog.component.html',
    styleUrls: ['./equipo-dialog.component.css']
})
export class EquipoDialogComponent implements OnInit {


    clienteControl = new FormControl('');
    clienteFiltered: Observable<Cliente[]>;


    clientes: Cliente[] = [];
    clienteSelected: Cliente;

    item: Equipo;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    marcas = [];

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<EquipoDialogComponent>,
        private uiService: UIService,
        private utils: UtilService,
        private equipoService: EquipoService,
        private marcaService: MarcaService,
        private clienteService: ClienteService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            descripcion: new FormControl('', [Validators.required]),
            serie: new FormControl('', [Validators.required]),
            modelo: new FormControl('', [Validators.required]),
            marca: new FormControl('', [Validators.required])
        });

        this.getMarcas();

        if (this.data.item.id && this.data != null) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getEquipoById(this.data.item.id);
            this.formType = FormType.EDIT;
            // this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

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
    }

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    getMarcas(): void {
        this.marcaService.getMarcas().subscribe(
            result => {
                this.marcas = result;
            }, error => {
                console.log(error);
                this.uiService.showSnackbar(
                    'Error al obtener las Marcas.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    getEquipoById(id: number): void {
        // Realiza la llamada http para obtener el objeto
        this.equipoService.getEquipoById(id).subscribe(
            data => {
                this.item = data as Equipo;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Equipo) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                descripcion: item.descripcion,
                serie: item.serie,
                modelo: item.modelo,
                marca: item.marca,
                cliente: item.cliente,
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.descripcion = this.form.get('descripcion').value.toString().toUpperCase().trim();
        this.item.modelo = this.form.get('modelo').value.toString().toUpperCase().trim();
        this.item.serie = this.form.get('serie').value.toString().toUpperCase().trim();
        this.item.marca = this.form.get('marca').value;
        this.item.cliente = this.clienteSelected;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    displayCliente(value: Cliente) {
        if (value) {
            return value.ruc + ' | ' + value.razon;
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

    // Metodo para agregar una nueva lista de precios
    add(): void {
        this.setAtributes();
        console.log(this.item);
        // Llama al servicio que almacena el objeto {PriceListDraft}
        if(this.validarCampos){
            this.equipoService.guardarEquipo(this.item)
                .subscribe(data => {
                    console.log(data);
                    this.dialogRef.close(data);
                    this.uiService.showSnackbar(
                        'Argregado exitosamente.',
                        'Cerrar',
                        3000
                    );
                },
                    (error) => {
                        console.error('[ERROR]: ', error);
                        this.uiService.showSnackbar(
                            'Ha ocurrido un error.',
                            'Cerrar',
                            3000
                        );
                    }
                );
        }
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {
        this.setAtributes();
        // Llama al servicio http que actualiza el objeto.
        this.equipoService.editarEquipo(this.item)
            .subscribe(data => {
                console.log(data);
                this.uiService.showSnackbar(
                    'Modificado exitosamente.',
                    'Cerrar',
                    3000
                );
                this.dialogRef.close(data);
            },
                (error) => {
                    console.error('[ERROR]: ', error);
                    this.uiService.showSnackbar(
                        'Ha ocurrido un error.',
                        'Cerrar',
                        3000
                    );
                }
            );
    }

    validarCampos(): Boolean {
        if (!this.utils.tieneLetras(this.item.descripcion)) {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
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
        }
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
