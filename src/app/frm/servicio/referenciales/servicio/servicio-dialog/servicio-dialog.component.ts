import { Component, OnInit, Inject } from '@angular/core';
import { Servicio } from '../../../../../models/servicio';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormType } from '../../../../../models/enum';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UIService } from '../../../../../services/ui.service';
import { ServicioService } from '../../../../../services/servicio.service';
import {UtilService} from '../../../../../services/util.service';
import {Impuesto} from '../../../../../models/impuesto';
import {ImpuestoService} from '../../../../../services/impuesto.service';

@Component({
    selector: 'app-equipo-dialog',
    templateUrl: './servicio-dialog.component.html',
    styleUrls: ['./servicio-dialog.component.css']
})
export class ServicioDialogComponent implements OnInit {

    item: Servicio;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    impuestos: Impuesto[] = [];

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<ServicioDialogComponent>,
        private uiService: UIService,
        private servicioService: ServicioService,
        private utils: UtilService,
        private impuestoService: ImpuestoService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            descripcion: new FormControl('', [Validators.required]),
            monto: new FormControl('', [Validators.required]),
            impuesto: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.impuestoService.getImpuestos().subscribe(
            (data) => {
                console.log(data);
                this.impuestos = data;
                this.utils.stopLoading();
            },
            err => {
                console.log(err.error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Servicio) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                descripcion: item.descripcion,
                monto: item.monto,
                impuesto: item.impuesto
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.descripcion = this.form.get('descripcion').value.toString().toUpperCase().trim();
        this.item.monto = this.utils.getNumber(this.form.get('monto').value);
        this.item.impuesto = this.form.get('impuesto').value;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
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
        this.servicioService.guardarServicio(this.item)
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
        this.setAtributes();
        // Llama al servicio http que actualiza el objeto.
        this.servicioService.editarServicio(this.item)
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

    setNumber($event, type) {
        this.form.get(type).setValue($event.target.value);
    }
}
