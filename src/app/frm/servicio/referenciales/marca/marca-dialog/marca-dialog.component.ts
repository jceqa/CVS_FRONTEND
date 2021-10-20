import { Component, OnInit, Inject } from '@angular/core';
import { Marca } from '../../../../../models/marca';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormType } from '../../../../../models/enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MarcaService } from '../../../../../services/marca.service';

@Component({
    selector: 'app-marca-dialog',
    templateUrl: './marca-dialog.component.html',
    styleUrls: ['./marca-dialog.component.css']
})
export class MarcaDialogComponent implements OnInit {

    item: Marca;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    constructor(
        //private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<MarcaDialogComponent>,
        //private uiService: UIService,
        private marcaService: MarcaService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            descripcion: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id && this.data != null) {
            //Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getMarcaById(this.data.item.id);
            this.formType = FormType.EDIT;
            //this.setForm(this.item);
        } else {
            //Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }
    }

    getMarcaById(id: number): void {

        //Realiza la llamada http para obtener el objeto
        this.marcaService.getMarcaById(id).subscribe(
            data => {
                this.item = data as Marca;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    //Rellena los campos del formulario con los valores dados
    setForm(item: Marca) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                descripcion: item.descripcion
            });
        }
    }

    //Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.descripcion = this.form.get('descripcion').value;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    //Metodo que se llama al oprimir el boton guardar
    ok(): void {
        //Si es una edicion llama al metodo para editar
        if (this.formType === FormType.EDIT) {
            this.edit();
        }

        //Si es una lista nueva llama al metodo para agregar
        if (this.formType === FormType.NEW) {
            this.add()
        };
    }

    //Metodo para agregar una nueva lista de precios
    add(): void {

        this.setAtributes();
        console.log(this.item);

        //Llama al servicio que almacena el objeto {PriceListDraft}
        this.marcaService.guardarMarca(this.item)
            .subscribe(data => {
                console.log(data);
                this.dialogRef.close(data);
            },
                (error) => {

                    console.error('[ERROR]: ', error);
                    // NO cerrar si hay error permanecer en el mismo lugar
                    // para evitar que el usuario vuelva a cargar.
                    // this.dialogRef.close();

                }
            );
    }

    //Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        //Asigna los valores del formulario al objeto a almacenar
        console.log(this.item);
        this.setAtributes();
        console.log(this.item);

        //Llama al servicio http que actualiza el objeto.
        this.marcaService.editarMarca(this.item)
            .subscribe(data => {
                console.log(data);
                this.dialogRef.close(data);
            },
                (error) => {
                    console.error('[ERROR]: ', error);
                }
            );
    }

}