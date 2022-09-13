import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SucursalService} from '../../../../../services/sucursal.service';
import {UIService} from '../../../../../services/ui.service';
import {Ciudad} from '../../../../../models/ciudad';
import {Sucursal} from '../../../../../models/sucursal';
import {CiudadService} from '../../../../../services/ciudad.service';


@Component({
    selector: 'app-sucursal-dialog',
    templateUrl: './sucursal-dialog.component.html',
    styleUrls: ['./sucursal-dialog.component.css']
})
export class SucursalDialogComponent implements OnInit {

    item: Sucursal;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    ciudades: Ciudad[] = [];

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<SucursalDialogComponent>,
        private uiService: UIService,
        private sucursalService: SucursalService,
        private ciudadService: CiudadService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            descripcion: new FormControl('', [Validators.required]),
            ciudad: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id && this.data != null) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getSucursalById(this.data.item.id);
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

    getSucursalById(id: number): void {

        // Realiza la llamada http para obtener el objeto
        this.sucursalService.getSucursalById(id).subscribe(
            data => {
                this.item = data as Sucursal;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Sucursal) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                descripcion: item.descripcion,
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.descripcion = this.form.get('descripcion').value;
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
        this.sucursalService.guardarSucursal(this.item)
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
        this.sucursalService.editarSucursal(this.item)
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
