import {Component, Inject, OnInit} from '@angular/core';
import {NotaDebitoCompra} from '../../../../../models/notaDebitoCompra';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {NotaDebitoCompraDetalle} from '../../../../../models/notaDebitoCompraDetalle';
import {Articulo} from '../../../../../models/articulo';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {NotaDebitoCompraService} from '../../../../../services/notadebitocompra.service';
import {UtilService} from '../../../../../services/util.service';
import {Estado} from '../../../../../models/estado';
import {Pago} from '../../../../../models/pago';

@Component({
  selector: 'app-nota-debito-compra-dialog',
  templateUrl: './nota-debito-compra-dialog.component.html',
  styleUrls: ['./nota-debito-compra-dialog.component.scss']
})
export class NotaDebitoCompraDialogComponent implements OnInit {

    item: NotaDebitoCompra;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    dataSource = new MatTableDataSource<NotaDebitoCompraDetalle>();
    detalles: NotaDebitoCompraDetalle[] = [];

    myControl = new FormControl('');
    filteredOptions: Observable<Articulo[]>;

    estadoNotaDebitoCompra = '';

    constructor(
        private dialogRef: MatDialogRef<NotaDebitoCompraDialogComponent>,
        private uiService: UIService,
        private notaDebitoCompraService: NotaDebitoCompraService,
        private utils: UtilService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            observacion: new FormControl('', [Validators.required])
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

    setForm(item: NotaDebitoCompra) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion
            });
            this.estadoNotaDebitoCompra = item.estadoNotaDebitoCompra.descripcion;
        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.estado = 'ACTIVO';
        this.item.estadoNotaDebitoCompra = new Estado(1);
        this.item.notaDebitoCompraDetalle = this.detalles;
    }

    generatePago(): void {
        const pago = new Pago();
        pago.id = 0;
        pago.descripcion = 'PAGO GENERADO PARA NOTA DE DEBITO NRO: ' + this.item.id;
        pago.fecha = new Date();
        pago.estado = 'ACTIVO';
        pago.monto = this.item.monto;

        this.item.cuentaAPagar.pago = pago;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    process() {
        this.utils.startLoading();
        this.generatePago();
        this.notaDebitoCompraService.processNotaDebitoCompra(this.item).subscribe(
            data => {
                console.log(data);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Procesado Exitosamente.',
                    'Cerrar',
                    3000
                );
                this.dialogRef.close(true);
            }, error => {
                console.log(error);
                this.utils.stopLoading();
            }
        );
    }
}
