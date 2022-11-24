import {Component, Inject, OnInit} from '@angular/core';
import {CuentaACobrar} from '../../../../../models/cuentaACobrar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Estado} from '../../../../../models/estado';
import {UtilService} from '../../../../../services/util.service';
import {Cobro} from '../../../../../models/cobro';
import {CuentaACobrarService} from '../../../../../services/cuentaacobrar.service';
import {UIService} from '../../../../../services/ui.service';
import {TipoCobroService} from '../../../../../services/tipocobro.service';
import {TipoCobro} from '../../../../../models/tipoCobro';

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

    tiposCobro: TipoCobro[] = [];

    constructor(
        private dialogRef: MatDialogRef<CuentaACobrarDialogComponent>,
        private utils: UtilService,
        private cuentaACobrarService: CuentaACobrarService,
        private uiService: UIService,
        private tipoCobroService: TipoCobroService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            tipo: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            // this.title = 'Editar';
            this.title = '';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }

        console.log('hola');
        this.utils.startLoading();
        this.tipoCobroService.getTipoCobros().subscribe(
            (data) => {
                console.log(data);
                this.tiposCobro = data;
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

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    setForm(item: CuentaACobrar) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                tipo: item.cobro ? item.cobro.tipoCobro : ''
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

    process() {
        this.utils.startLoading();
        this.generateCobro();
        this.cuentaACobrarService.processCuentaACobrar(this.item).subscribe(
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

    generateCobro(): void {
        const cobro = new Cobro();
        cobro.id = 0;
        cobro.descripcion = 'COBRO GENERADO PARA CUENTA A COBRAR NRO: ' + this.item.id;
        cobro.fecha = new Date();
        cobro.estado = 'ACTIVO';
        cobro.monto = this.item.monto;
        cobro.tipoCobro = this.form.get('tipo').value;

        this.item.cobro = cobro;
    }
}
