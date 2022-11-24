import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {LibroCompra} from '../../../../../models/libroCompra';
import {LibroCompraDetalle} from '../../../../../models/libroCompraDetalle';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-libro-compra-dialog',
  templateUrl: './libro-compra-dialog.component.html',
  styleUrls: ['./libro-compra-dialog.component.scss']
})
export class LibroCompraDialogComponent implements OnInit {

    item: LibroCompra;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'precio', 'exenta', 'iva5', 'iva10'/*, 'total', 'actions'*/];
    dataSource = new MatTableDataSource<LibroCompraDetalle>();
    detalles: LibroCompraDetalle[] = [];

    total = 0;
    totalIVA = 0;

    constructor(
        private dialogRef: MatDialogRef<LibroCompraDialogComponent>,
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
            this.total = this.item.montoNeto + this.item.montoIVA10 + this.item.montoIVA5;
            this.totalIVA = this.item.montoIVA10 + this.item.montoIVA5;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }
    }

    setForm(item: LibroCompra) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
            });
            this.fecha = item.fecha;
            this.detalles = item.libroCompraDetalles;
            this.dataSource = new MatTableDataSource<LibroCompraDetalle>(
                this.detalles
            );
        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.estado = 'ACTIVO';
        this.item.fecha = this.fecha;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }
}
