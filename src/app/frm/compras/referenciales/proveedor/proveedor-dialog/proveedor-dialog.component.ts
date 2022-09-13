import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProveedorService} from '../../../../../services/proveedor.service';
import {UIService} from '../../../../../services/ui.service';
import {Ciudad} from '../../../../../models/ciudad';
import {Impuesto} from '../../../../../models/impuesto';
import {CiudadService} from '../../../../../services/ciudad.service';
import {Proveedor} from '../../../../../models/proveedor';

@Component({
    selector: 'app-proveedor-dialog',
    templateUrl: './proveedor-dialog.component.html',
    styleUrls: ['./proveedor-dialog.component.css']
})
export class ProveedorDialogComponent implements OnInit {

    item: Proveedor;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    ciudades: Ciudad[] = [];
    impuestos: Impuesto[] = [];

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<ProveedorDialogComponent>,
        private uiService: UIService,
        private proveedorService: ProveedorService,
        private ciudadService: CiudadService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            id: new FormControl('', []),
            ruc: new FormControl('', [Validators.required]),
            razon: new FormControl('', [Validators.required]),
            direccion: new FormControl('', [Validators.required]),
            correo: new FormControl('', [Validators.required]),
            telefono: new FormControl('', [Validators.required]),
            ciudad: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id && this.data != null) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getProveedorById(this.data.item.id);
            this.formType = FormType.EDIT;
            // this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.ciudadService.getCiudades().subscribe(
            (data) => {
                console.log(data);
                this.ciudades = data;
            },
            err => {
                console.log(err.error);
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    getProveedorById(id: number): void {

        // Realiza la llamada http para obtener el objeto
        this.proveedorService.getProveedorById(id).subscribe(
            data => {
                this.item = data as Proveedor;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Proveedor) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                ruc: item.ruc,
                razon: item.razonSocial,
                direccion: item.direccion,
                correo: item.correo,
                telefono: item.telefono,
                ciudad : item.ciudad
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.ruc = this.form.get('ruc').value;
        this.item.razonSocial = this.form.get('razon').value;
        this.item.direccion = this.form.get('direccion').value;
        this.item.correo = this.form.get('correo').value;
        this.item.telefono = this.form.get('telefono').value;
        this.item.ciudad = this.form.get('ciudad').value;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
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
        console.log(this.item);

        // Llama al servicio que almacena el objeto {PriceListDraft}
        this.proveedorService.guardarProveedor(this.item)
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

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        // Asigna los valores del formulario al objeto a almacenar
        console.log(this.item);
        this.setAtributes();
        console.log(this.item);

        // Llama al servicio http que actualiza el objeto.
        this.proveedorService.editarProveedor(this.item)
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

}
