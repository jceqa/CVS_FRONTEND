import {Component, Inject, OnInit} from '@angular/core';
import {Caja} from '../../../../../models/caja';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {CajaService} from '../../../../../services/caja.service';
import {UtilService} from '../../../../../services/util.service';
import {Sucursal} from '../../../../../models/sucursal';
import {SucursalService} from '../../../../../services/sucursal.service';

@Component({
  selector: 'app-caja-dialog',
  templateUrl: './caja-dialog.component.html',
  styleUrls: ['./caja-dialog.component.sass']
})
export class CajaDialogComponent implements OnInit {

    item: Caja;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    sucursales: Sucursal[] = [];

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<CajaDialogComponent>,
        private uiService: UIService,
        private cajaService: CajaService,
        private sucursalService: SucursalService,
        private utils: UtilService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            descripcion: new FormControl('', [Validators.required]),
            numero: new FormControl('', [Validators.required]),
            sucursal: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getCajaById(this.data.item.id);
            this.formType = FormType.EDIT;
            // this.form.get('sucursal').disable();
            // this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }


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

    getCajaById(id: number): void {

        // Realiza la llamada http para obtener el objeto
        this.cajaService.getCajaById(id).subscribe(
            data => {
                this.item = data as Caja;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Caja) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                descripcion: item.descripcion,
                numero: item.numero,
                sucursal: item.sucursal,
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.descripcion = this.form.get('descripcion').value.toString().toUpperCase().trim();
        this.item.numero = this.utils.getNumber(this.form.get('numero').value);
        this.item.sucursal = this.form.get('sucursal').value;
    }

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
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
        if (this.utils.tieneLetras(this.item.descripcion)) {
            // Llama al servicio que almacena el objeto {PriceListDraft}
            this.cajaService.guardarCaja(this.item)
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
        this.utils.startLoading();
        // Llama al servicio http que actualiza el objeto.
        if (this.utils.tieneLetras(this.item.descripcion)) {
            this.cajaService.editarCaja(this.item).subscribe(data => {
                console.log(data);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Modificado exitosamente.',
                    'Cerrar',
                    3000
                );

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
        } else {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
        }
    }
}
