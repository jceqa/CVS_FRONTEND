import {Component, Inject, OnInit} from '@angular/core';
import {Rol} from '../../../../../models/rol';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {RolService} from '../../../../../services/rol.service';
import {UtilService} from '../../../../../services/util.service';

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.scss']
})
export class RolDialogComponent implements OnInit {

    item: Rol;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<RolDialogComponent>,
        private uiService: UIService,
        private rolService: RolService,
        private utils: UtilService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            nombre: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getRolById(this.data.item.id);
            this.formType = FormType.EDIT;
            // this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }
    }

    getRolById(id: number): void {

        // Realiza la llamada http para obtener el objeto
        this.rolService.getRolById(id).subscribe(
            data => {
                this.item = data as Rol;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Rol) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                nombre: item.nombre
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.nombre = this.form.get('nombre').value.toString().toUpperCase().trim();
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
        if (this.utils.tieneLetras(this.item.nombre)) {
            // Llama al servicio que almacena el objeto {PriceListDraft}
            this.rolService.guardarRol(this.item)
                .subscribe(data => {
                        console.log(data);
                        this.dialogRef.close(data);

                        this.uiService.showSnackbar(
                            'Agregado exitosamente.',
                            'Cerrar',
                            3000
                        );
                    },
                    (error) => {

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
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        // Asigna los valores del formulario al objeto a almacenar
        this.setAtributes();

        // Llama al servicio http que actualiza el objeto.
        if (this.utils.tieneLetras(this.item.nombre)) {
            this.rolService.editarRol(this.item).subscribe(data => {
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

}
