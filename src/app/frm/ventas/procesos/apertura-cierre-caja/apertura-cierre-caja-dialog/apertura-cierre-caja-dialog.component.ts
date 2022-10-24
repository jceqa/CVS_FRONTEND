import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Articulo} from '../../../../../models/articulo';
import {Observable} from 'rxjs';
import {AperturaCierreCaja} from '../../../../../models/aperturaCierreCaja';
import {FormType} from '../../../../../models/enum';
import {Sucursal} from '../../../../../models/sucursal';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {AperturaCierreCajaService} from '../../../../../services/aperturacierrecaja.service';
import {UtilService} from '../../../../../services/util.service';
import {SucursalService} from '../../../../../services/sucursal.service';
// import {map, startWith} from 'rxjs/operators';
import {Usuario} from '../../../../../models/usuario';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {Caja} from '../../../../../models/caja';
import {CajaService} from '../../../../../services/caja.service';

@Component({
    selector: 'app-apertura-cierre-caja-dialog',
    templateUrl: './apertura-cierre-caja-dialog.component.html',
    styleUrls: ['./apertura-cierre-caja-dialog.component.scss']
})
export class AperturaCierreCajaDialogComponent implements OnInit {

    myControl = new FormControl('');
    options: Articulo[] = [];
    filteredOptions: Observable<Articulo[]>;

    item: AperturaCierreCaja;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    fecha = new Date();

    articuloSelected: Articulo = null;
    sucursales: Sucursal[] = [];
    cajas: Caja[] = [];

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'actions'];

    constructor(
        private dialogRef: MatDialogRef<AperturaCierreCajaDialogComponent>,
        private uiService: UIService,
        private aperturaCierreCajaService: AperturaCierreCajaService,
        private utils: UtilService,
        private sucursalService: SucursalService,
        private cajaService: CajaService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            caja: new FormControl('', [Validators.required]),
            montoApertura: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Cierre';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            this.form.get('montoApertura').disable();
            this.form.get('caja').disable();
            this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Apertura';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.sucursalService.getSucursalByUserId(this.utils.getUserId()).subscribe(data => {
            console.log(data);
            this.sucursales = data;
            this.cajaService.listCajasBySucursal(this.sucursales).subscribe(
                dataSucursal => {
                    console.log(dataSucursal);
                    this.cajas = dataSucursal;
                }
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }


    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    setForm(item: AperturaCierreCaja) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                caja: item.caja,
                montoApertura: item.montoApertura,
                fecha: item.fechaHoraApertura
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.fechaHoraApertura = this.fecha;
        this.item.caja = this.form.get('caja').value;
        this.item.montoApertura = this.utils.getNumber(this.form.get('montoApertura').value);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.estado = 'ACTIVO';
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
        // if (this.detalles.length > 0) {
            this.setAtributes();
            this.item.id = 0;
            // if (this.utils.tieneLetras(this.item.observacion)) {
                // Llama al servicio que almacena el objeto {PriceListDraft}
                this.utils.startLoading();
                this.aperturaCierreCajaService.guardarAperturaCierreCaja(this.item)
                    .subscribe(data => {
                            console.log(data);
                            this.utils.stopLoading();
                            this.uiService.showSnackbar(
                                'Agregado exitosamente.',
                                'Cerrar',
                                3000
                            );
                            this.dialogRef.close(data);
                        },
                        (error) => {
                            this.utils.stopLoading();
                            console.error('[ERROR]: ', error);

                            this.uiService.showSnackbar(
                                error.error,
                                'Cerrar',
                                5000
                            );

                        }
                    );
           /* } else {
                this.uiService.showSnackbar(
                    'La descripción no puede ser solo númerica.',
                    'Cerrar',
                    5000
                );
            } */
       /* } else {
            this.uiService.showSnackbar(
                'Debe asignar al menos un detalle al pedido.',
                'Cerrar',
                5000
            );
        }*/
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        // Asigna los valores del formulario al objeto a almacenar
        this.setAtributes();

        // Llama al servicio http que actualiza el objeto.
        // if (this.utils.tieneLetras(this.item.observacion)) {
            this.aperturaCierreCajaService.editarAperturaCierreCaja(this.item).subscribe(data => {
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
       /* } else {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
        }*/
    }

    anular(dato: AperturaCierreCaja): void {
        this.utils.startLoading();
        this.aperturaCierreCajaService.anularAperturaCierreCaja(dato).subscribe(
            data => {
                console.log(data);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Anulado Exitosamente.',
                    'Cerrar',
                    3000
                );
                this.dialogRef.close(true);
            }, error => {
                console.log(error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    anularDialog(event: any): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Pedido Compra',
                msg: '¿Está seguro que desea anular este Pedido de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    setNumber($event, type) {
        this.form.get(type).setValue($event.target.value);
    }

}
