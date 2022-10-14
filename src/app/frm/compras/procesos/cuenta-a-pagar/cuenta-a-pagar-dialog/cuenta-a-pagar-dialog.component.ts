import {Component, Inject, OnInit} from '@angular/core';
import {CuentaAPagar} from '../../../../../models/cuentaAPagar';
import {FormControl, FormGroup} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Estado} from '../../../../../models/estado';

@Component({
  selector: 'app-cuenta-a-pagar-dialog',
  templateUrl: './cuenta-a-pagar-dialog.component.html',
  styleUrls: ['./cuenta-a-pagar-dialog.component.scss']
})
export class CuentaAPagarDialogComponent implements OnInit {

    item: CuentaAPagar;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();
    estadoCuentaAPagar = '';

    constructor(
        private dialogRef: MatDialogRef<CuentaAPagarDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', [])
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            // this.title = 'Editar';
            this.title = '';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.form.get('observacion').disable();
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }
    }

    setForm(item: CuentaAPagar) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                // observacion: item.observacion
            });
            this.estadoCuentaAPagar = item.estadoCuentaAPagar.descripcion;
        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        // this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.estado = 'ACTIVO';
        this.item.estadoCuentaAPagar = new Estado(1);
        // this.item.cuentaAPagarDetalle = this.detalles;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }
}
