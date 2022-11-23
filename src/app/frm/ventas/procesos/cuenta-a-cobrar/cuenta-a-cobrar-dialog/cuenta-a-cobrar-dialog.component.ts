import {Component, Inject, OnInit} from '@angular/core';
import {CuentaACobrar} from '../../../../../models/cuentaACobrar';
import {FormControl, FormGroup} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Estado} from '../../../../../models/estado';

@Component({
  selector: 'app-cuenta-a-cobrar-dialog',
  templateUrl: './cuenta-a-cobrar-dialog.component.html',
  styleUrls: ['./cuenta-a-cobrar-dialog.component.scss']
})
export class CuentaACobrarDialogComponent implements OnInit {

  item: CuentaACobrar;
  companyId = 0;
  form: FormGroup;

  formType: FormType;

  title: String;
  editID: number;
  fecha = new Date();
  estadoCuentaACobrar = '';

  constructor(
      private dialogRef: MatDialogRef<CuentaACobrarDialogComponent>,
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

  setForm(item: CuentaACobrar) {
    console.log(item);
    if (this.formType === FormType.EDIT) {
      this.form.patchValue({
        id: item.id,
        // observacion: item.observacion
      });
      this.estadoCuentaACobrar = item.estadoCuentaACobrar.descripcion;
    }
  }

  setAtributes(): void {
    this.item.id = this.form.get('id').value;
    // this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
    this.item.estado = 'ACTIVO';
    this.item.estadoCuentaACobrar = new Estado(1);
    // this.item.cuentaACobrarDetalle = this.detalles;
  }

  dismiss(result?: any) {
    this.dialogRef.close(result);
  }
}
