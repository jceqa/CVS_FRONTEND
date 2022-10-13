import {Component, Inject, OnInit} from '@angular/core';
import {NotaDebitoCompra} from '../../../../../models/notaDebitoCompra';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {NotaDebitoCompraDetalle} from '../../../../../models/notaDebitoCompraDetalle';
import {Stock} from '../../../../../models/stock';
import {Deposito} from '../../../../../models/deposito';
import {Articulo} from '../../../../../models/articulo';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {NotaDebitoCompraService} from '../../../../../services/notadebitocompra.service';
import {UtilService} from '../../../../../services/util.service';
import {DepositoService} from '../../../../../services/deposito.service';
import {ArticuloService} from '../../../../../services/articulo.service';
import {StockService} from '../../../../../services/stock.service';
import {map, startWith} from 'rxjs/operators';
import {Estado} from '../../../../../models/estado';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';

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

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', /*'precio', 'total',*/ 'actions'];
    dataSource = new MatTableDataSource<NotaDebitoCompraDetalle>();
    detalles: NotaDebitoCompraDetalle[] = [];

    stockSelected: Stock[];
    depositos: Deposito[] = [];
    options: Articulo[] = [];
    myControl = new FormControl('');
    filteredOptions: Observable<Articulo[]>;

    articuloSelected: Articulo = null;
    stocks: Stock[] = [];
    estadoNotaDebitoCompra = '';

    constructor(
        private dialogRef: MatDialogRef<NotaDebitoCompraDialogComponent>,
        private uiService: UIService,
        private notaDebitoCompraService: NotaDebitoCompraService,
        private utils: UtilService,
        private depositoService: DepositoService,
        private articuloService: ArticuloService,
        private stockService: StockService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            observacion: new FormControl('', [Validators.required]),
            origen: new FormControl('', [Validators.required]),
            destino: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            // this.title = 'Editar';
            this.title = '';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.form.get('observacion').disable();
            this.form.get('origen').disable();
            this.form.get('destino').disable();
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nueva';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.depositoService.getDepositos().subscribe(
            data => {
                console.log(data);
                this.depositos = data;
                this.utils.stopLoading();
                this.utils.stopLoading();
            }, error => {
                console.log(error);
                this.utils.stopLoading();
            }
        );

        this.utils.startLoading();
        this.articuloService.getArticulos().subscribe(data => {
            console.log(data);
            this.options = data;

            this.filteredOptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
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

    setForm(item: NotaDebitoCompra) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
                // origen: item.origen,
                // destino: item.destino
            });
            // this.fecha = item.fecha;
            this.detalles = item.notaDebitoCompraDetalle;
            this.estadoNotaDebitoCompra = item.estadoNotaDebitoCompra.descripcion;
            this.dataSource = new MatTableDataSource<NotaDebitoCompraDetalle>(
                this.detalles
            );

        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.estado = 'ACTIVO';
        // this.item.tipo = 'MANUAL';
        // this.item.fecha = this.fecha;
        this.item.estadoNotaDebitoCompra = new Estado(1);
        /*this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.origen = this.form.get('origen').value;
        this.item.destino = this.form.get('destino').value;*/
        this.item.notaDebitoCompraDetalle = this.detalles;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    selected($event): void {
        if ($event.isUserInput) {
            console.log($event.source.value);
            this.utils.startLoading();
            this.stockService.listStockByDeposito($event.source.value.id).subscribe(
                data => {
                    console.log(data);
                    this.stocks = data;
                    this.utils.stopLoading();
                }, error => {
                    this.utils.stopLoading();
                    console.log(error);
                }
            );
        }
    }

    display(value) {
        if (value) {
            return value.codigoGenerico.toString() + ' - ' + value.descripcion;
        }
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selectedStock($event): void {
        console.log($event.source._value);
        this.stockSelected = $event.source._value;
        this.detalles.length = 0;
        /*this.detalles.forEach(detalle => {
            const art = this.stockSelected.find(d => d.articulo.id === detalle.articulo.id);
            if (!art) {
                this.detalles = this.detalles.filter(d => d.articulo.id !== detalle.articulo.id);
            }
        });*/
        this.addItem();
    }

    ok(): void {
        if (this.formType === FormType.NEW) {
            this.add();
        }
    }

    validarCampos(): boolean {
        if (!this.utils.tieneLetras(this.item.observacion)) {
            this.uiService.showSnackbar(
                'La observacion no puede ser solo númerica.',
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
        } else if (this.form.get('origen').value.id === this.form.get('destino').value.id) {
            this.uiService.showSnackbar(
                'El origen no puede ser igual al destino.',
                'Cerrar',
                5000
            );
            return false;
        }
        return true;
    }

    add(): void {
        this.setAtributes();
        this.item.id = 0;
        if (this.validarCampos()) {
            this.utils.startLoading();
            this.notaDebitoCompraService.guardarNotaDebitoCompra(this.item)
                .subscribe(data => {
                        console.log(data);
                        this.utils.stopLoading();
                        this.uiService.showSnackbar(
                            'Argregado exitosamente.',
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
        }
    }

    anular(dato: NotaDebitoCompra): void {
        this.utils.startLoading();
        this.notaDebitoCompraService.anularNotaDebitoCompra(dato).subscribe(
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
                title: 'Anular Orden Compra',
                msg: '¿Está seguro que desea anular esta Orden de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    addItem() {
        /*this.stockSelected.forEach(stock => {
            const art = this.detalles.find(d => d.articulo.id === stock.articulo.id);
            if (!art) {
                this.detalles.push({
                    'id': 0,
                    'articulo': stock.articulo,
                    'cantidad': 1,
                    'estado': 'ACTIVO',
                    'pedidoCompraDetalle': null
                });
            }
        });*/
        console.log(this.detalles);
        this.dataSource = new MatTableDataSource<NotaDebitoCompraDetalle>(
            this.detalles
        );
    }

    incItem(dato) {
        dato.cantidad++;
    }

    descItem(dato) {
        dato.cantidad--;
    }

    disableInc(dato) {
        const stock = this.stockSelected.find(s => s.articulo.id === dato.articulo.id);
        return stock.existencia <= dato.cantidad;
    }

    process() {
        this.utils.startLoading();
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
