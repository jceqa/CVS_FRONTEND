import {Component, Inject, OnInit} from '@angular/core';
import {Timbrado} from '../../../../../models/timbrado';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {TimbradoService} from '../../../../../services/timbrado.service';
import {UtilService} from '../../../../../services/util.service';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-timbrado-dialog',
    templateUrl: './timbrado-dialog.component.html',
    styleUrls: ['./timbrado-dialog.component.scss'],
    providers: [DatePipe]
})
export class TimbradoDialogComponent implements OnInit {

    item: Timbrado;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    inicioVigencia = new Date();
    finVigencia = new Date();

    minDate = new Date();

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<TimbradoDialogComponent>,
        private uiService: UIService,
        private timbradoService: TimbradoService,
        private utils: UtilService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.finVigencia.setDate(this.finVigencia.getDate() + 365);
        this.form = new FormGroup({
            id: new FormControl('', []),
            numero: new FormControl('', [Validators.required]),
            inicioVigencia: new FormControl(this.inicioVigencia, [Validators.required]),
            finVigencia: new FormControl(this.finVigencia, [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getTimbradoById(this.data.item.id);
            this.formType = FormType.EDIT;
            // this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }
    }

    getTimbradoById(id: number): void {
        this.utils.startLoading();
        this.timbradoService.getTimbradoById(id).subscribe(
            data => {
                this.item = data as Timbrado;
                this.utils.stopLoading();
                this.setForm(this.item);
            }, (error) => {
                this.utils.stopLoading();
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Timbrado) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                numero: item.numero,
                inicioVigencia: new Date(item.inicioVigencia),
                finVigencia: new Date(item.finVigencia)
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.numero = this.form.get('numero').value.toString().toUpperCase().trim();
        this.item.inicioVigencia = this.form.get('inicioVigencia').value;
        this.item.finVigencia = this.form.get('finVigencia').value;
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
        this.utils.startLoading();
        this.timbradoService.guardarTimbrado(this.item)
            .subscribe(data => {
                    console.log(data);
                    this.dialogRef.close(data);
                    this.utils.stopLoading();
                    this.uiService.showSnackbar(
                        'Agregado exitosamente.',
                        'Cerrar',
                        3000
                    );
                },
                (error) => {
                    console.error('[ERROR]: ', error);
                    this.utils.stopLoading();
                    this.uiService.showSnackbar(
                        error.error,
                        'Cerrar',
                        5000
                    );

                }
            );
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {
        this.setAtributes();
        this.utils.startLoading();
        this.timbradoService.editarTimbrado(this.item).subscribe(data => {
            console.log(data);
            this.uiService.showSnackbar(
                'Modificado exitosamente.',
                'Cerrar',
                3000
            );
            this.utils.stopLoading();
            this.dialogRef.close(data);
        }, (error) => {
            console.error('[ERROR]: ', error);
            this.utils.stopLoading();
            this.uiService.showSnackbar(
                'Ha ocurrido un error.',
                'Cerrar',
                3000
            );
        });
    }
}
