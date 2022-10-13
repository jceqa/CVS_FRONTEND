import {Component, Inject, OnInit} from '@angular/core';
import {Ajuste} from '../../../../../models/ajuste';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {AjusteService} from '../../../../../services/ajuste.service';
import {UtilService} from '../../../../../services/util.service';
import {Sucursal} from '../../../../../models/sucursal';
import {Deposito} from '../../../../../models/deposito';
import {SucursalService} from '../../../../../services/sucursal.service';
import {DepositoService} from '../../../../../services/deposito.service';
import {Articulo} from '../../../../../models/articulo';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {Stock} from '../../../../../models/stock';
import {StockService} from '../../../../../services/stock.service';
import {Estado} from '../../../../../models/estado';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-ajuste-dialog',
  templateUrl: './ajuste-dialog.component.html',
  styleUrls: ['./ajuste-dialog.component.sass']
})
export class AjusteDialogComponent implements OnInit {

    item: Ajuste;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    fecha = new Date();

    articuloSelected: Articulo = null;
    sucursales: Sucursal[] = [];
    depositos: Deposito[] = [];

    options: Articulo[] = [];
    filteredOptions: Observable<Articulo[]>;

    myControl = new FormControl('');

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'nuevaCantidad'];
    dataSource = new MatTableDataSource<Stock>();
    detalles: Stock[] = [];
    tiposAjuste = ['AUMENTO', 'DESCUENTO'];
    stocks: Stock[] = [];
    stockSelected: Stock;

    nuevaCantidad = 0;
    estadoAjuste = '';

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<AjusteDialogComponent>,
        private uiService: UIService,
        private ajusteService: AjusteService,
        private sucursalService: SucursalService,
        private depositoService: DepositoService,
        private stockService: StockService,
        private utils: UtilService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            descripcion: new FormControl('', [Validators.required]),
            sucursal: new FormControl('', [Validators.required]),
            deposito: new FormControl('', [Validators.required]),
            tipoAjuste: new FormControl('', [Validators.required]),
            cantidadArticulo: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            // this.getAjusteById(this.data.item.id);
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.form.get('descripcion').disable();
            this.form.get('sucursal').disable();
            this.form.get('deposito').disable();
            this.form.get('tipoAjuste').disable();
            this.form.get('cantidadArticulo').disable();
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
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

    /*getAjusteById(id: number): void {

        // Realiza la llamada http para obtener el objeto
        this.ajusteService.getAjusteById(id).subscribe(
            data => {
                this.item = data as Ajuste;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }*/

    // Rellena los campos del formulario con los valores dados
    setForm(item: Ajuste) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                descripcion: item.descripcion,
                deposito: item.stock.deposito,
                sucursal: item.stock.deposito.sucursal,
                tipoAjuste: item.tipo,
                cantidadArticulo: item.cantidad
            });
            this.estadoAjuste = item.estadoAjuste.descripcion;
        }

        this.detalles.push(this.item.stock);
        this.dataSource = new MatTableDataSource<Stock>(
            this.detalles
        );

        if (this.item.tipo === 'AUMENTO') {
            this.nuevaCantidad = this.item.stock.existencia + this.item.cantidad;
        } else if (this.item.tipo === 'DESCUENTO') {
            this.nuevaCantidad = this.item.stock.existencia - this.item.cantidad;
        }
    }

    listDepositos() {
        this.form.get('deposito').setValue('');
        this.utils.startLoading();
        this.depositoService.listDepositosBySucursal(this.form.get('sucursal').value.id).subscribe(
            data => {
                console.log(data);
                this.depositos = data;
                this.utils.stopLoading();
                if (this.formType === FormType.EDIT) {
                    this.form.get('deposito').setValue(this.item.stock.deposito);
                }
                this.utils.stopLoading();
            }, error => {
                console.log(error);
                this.utils.stopLoading();
            }
        );
    }

    listStock() {
        // this.form.get('deposito').setValue('');
        this.utils.startLoading();
        this.stockService.listStockByDeposito(this.form.get('deposito').value.id).subscribe(result => {
            console.log(result);
            result.forEach(r => {
               this.options.push(r.articulo);
            });
            this.stocks = result;

            this.filteredOptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
        this.utils.stopLoading();
    }

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    private _filter(value: any): Articulo[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.options.filter(option => option.codigoGenerico.toString().includes(filterValue) ||
                option.descripcion.toLowerCase().includes(filterValue))
        );
    }

    // Asigna los valores del formulario al objeto
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.descripcion = this.form.get('descripcion').value.toString().toUpperCase().trim();
        this.item.estado = 'ACTIVO';
        this.item.fecha = this.fecha;
        this.item.cantidad = parseInt(this.form.get('cantidadArticulo').value.toString(), 10);
        this.item.tipo = this.form.get('tipoAjuste').value.toString().toUpperCase().trim();
        this.item.stock = this.stockSelected;
        this.item.estadoAjuste = new Estado(1);
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    display(value) {
        if (value) {
            return value.codigoGenerico.toString() + ' - ' + value.descripcion;
        }
    }

    selected($event): void {
        console.log($event.source.value);
        this.articuloSelected = $event.source.value;
        this.detalles.length = 0;
        this.stockSelected = this.stocks.find(s => s.articulo.id === this.articuloSelected.id);
        this.nuevaCantidad = this.stockSelected.existencia;
        this.detalles.push(this.stockSelected);
        this.dataSource = new MatTableDataSource<Stock>(
            this.detalles
        );
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

    add(): void {
        this.setAtributes();
        this.item.id = 0;
        if (this.validarCampos()) {
            this.utils.startLoading();
            this.ajusteService.guardarAjuste(this.item)
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
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {
        // Asigna los valores del formulario al objeto a almacenar
        this.setAtributes();
        // Llama al servicio http que actualiza el objeto.
        if (this.utils.tieneLetras(this.item.descripcion)) {
            this.ajusteService.editarAjuste(this.item).subscribe(data => {
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
        } else {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
        }
    }

    calculateCantidad() {
        if (!Number.isNaN(parseInt(this.form.get('cantidadArticulo').value.toString(), 10)) && this.stockSelected) {
            if (this.form.get('tipoAjuste').value.toString() === 'AUMENTO' ) {
               this.nuevaCantidad = this.stockSelected.existencia +  parseInt(this.form.get('cantidadArticulo').value.toString(), 10);
            } else if (this.form.get('tipoAjuste').value.toString() === 'DESCUENTO' ) {
                this.nuevaCantidad = this.stockSelected.existencia -  parseInt(this.form.get('cantidadArticulo').value.toString(), 10);
            }
        }
    }

    validarCampos(): boolean {
        if (!this.utils.tieneLetras(this.item.descripcion)) {
            this.uiService.showSnackbar(
                'La descripcion no puede ser solo númerica.',
                'Cerrar',
                5000
            );
            return false;
        }  else if (this.detalles.length === 0) {
            this.uiService.showSnackbar(
                'Debe seleccionar al menos un item.',
                'Cerrar',
                5000
            );
            return false;
        } else if (parseInt(this.form.get('cantidadArticulo').value.toString(), 10) <= 0) {
            this.uiService.showSnackbar(
                'La cantidad a ajustar debe ser mayor a 0.',
                'Cerrar',
                5000
            );
            return false;
        } else if ( this.nuevaCantidad <= 0) {
            this.uiService.showSnackbar(
                'La nueva existencia debe ser mayor a 0.',
                'Cerrar',
                5000
            );
            return false;
        }
        return true;
    }

    anularDialog(event: any): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Ajuste',
                msg: '¿Está seguro que desea anular este Ajuste?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    anular(dato: Ajuste): void {
        this.utils.startLoading();
        this.ajusteService.anularAjuste(dato).subscribe(
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

    process() {
        this.utils.startLoading();
        this.ajusteService.processAjuste(this.item).subscribe(
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
