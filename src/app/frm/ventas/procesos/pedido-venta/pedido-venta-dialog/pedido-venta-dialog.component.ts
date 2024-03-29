import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {PedidoVenta} from '../../../../../models/pedidoVenta';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {UtilService} from '../../../../../services/util.service';
import {PedidoVentaService} from '../../../../../services/pedidoventa.service';
import {Sucursal} from '../../../../../models/sucursal';
import {Deposito} from '../../../../../models/deposito';
import {MatTableDataSource} from '@angular/material/table';
import {PedidoVentaDetalle} from '../../../../../models/pedidoVentaDetalle';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SucursalService} from '../../../../../services/sucursal.service';
import {DepositoService} from '../../../../../services/deposito.service';
import {Usuario} from '../../../../../models/usuario';
import {Estado} from '../../../../../models/estado';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {Cliente} from '../../../../../models/cliente';
import {ClienteService} from '../../../../../services/cliente.service';
import {StockService} from '../../../../../services/stock.service';
import {Stock} from '../../../../../models/stock';

@Component({
    selector: 'app-pedido-venta-dialog',
    templateUrl: './pedido-venta-dialog.component.html',
    styleUrls: ['./pedido-venta-dialog.component.scss']
})
export class PedidoVentaDialogComponent implements OnInit {

    myControl = new FormControl('');
    myControlCliente = new FormControl('');
    options: Stock[] = [];
    optionsCliente: Cliente[] = [];
    filteredOptions: Observable<Stock[]>;
    filteredOptionsCliente: Observable<Cliente[]>;

    item: PedidoVenta;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    fecha = new Date();

    stockSelected: Stock = null;
    clienteSelected: Cliente = null;
    sucursales: Sucursal[] = [];
    depositos: Deposito[] = [];

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'actions'];
    dataSource = new MatTableDataSource<PedidoVentaDetalle>();
    detalles: PedidoVentaDetalle[] = [];
    listStocks: Stock[] = [];

    estadoPedido = '';

    constructor(
        private dialogRef: MatDialogRef<PedidoVentaDialogComponent>,
        private uiService: UIService,
        private pedidoVentaService: PedidoVentaService,
        private clienteService: ClienteService,
        private utils: UtilService,
        private sucursalService: SucursalService,
        private depositoService: DepositoService,
        private stockService: StockService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }
    // define los imput del form, obtiene los valores que se introducen en el frontend
    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            observacion: new FormControl('', [Validators.required]),
            sucursal: new FormControl('', [Validators.required]),
            deposito: new FormControl('', [Validators.required]),
            cantidadArticulo: new FormControl(0),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            // this.title = 'Editar';
            this.title = '';
            this.editID = this.data.item.id;
            // this.getMarcaById(this.data.item.id);
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.form.get('observacion').disable();
            this.form.get('deposito').disable();
            this.form.get('sucursal').disable();
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.clienteService.getClientes().subscribe(data => {
            console.log(data);
            this.optionsCliente = data;

            this.filteredOptionsCliente = this.myControlCliente.valueChanges.pipe(
                startWith(''),
                map(value => this._filterCliente(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

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

    private _filter(value: any): Stock[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.options.filter(option => option.articulo.codigoGenerico.toString().includes(filterValue) ||
                option.articulo.descripcion.toLowerCase().includes(filterValue))
        );
    }

    private _filterCliente(value: any): Cliente[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.optionsCliente.filter(option => option.ruc.toString().includes(filterValue) ||
                option.razon.toLowerCase().includes(filterValue))
        );
    }

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    setForm(item: PedidoVenta) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
                deposito: item.deposito,
                sucursal: item.deposito.sucursal,
            });
            this.fecha = item.fecha;
            this.detalles = item.pedidoVentaDetalles;
            this.estadoPedido = item.estadoPedidoVenta.descripcion;
            this.dataSource = new MatTableDataSource<PedidoVentaDetalle>(
                this.detalles
            );
            this.clienteSelected = item.cliente;

            this.listDepositos();
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.deposito = this.form.get('deposito').value;
        this.item.estadoPedidoVenta = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        this.item.pedidoVentaDetalles = this.detalles;
        this.item.cliente = this.clienteSelected;
    }

    listDepositos() {
        this.form.get('deposito').setValue('');
        this.limpiarCampos();
        this.detalles.length = 0;
        this.dataSource = new MatTableDataSource<PedidoVentaDetalle>(
            this.detalles
        );
        this.utils.startLoading();
        this.depositoService.listDepositosBySucursal(this.form.get('sucursal').value.id).subscribe(
            data => {
                console.log(data);
                this.depositos = data;
                this.utils.stopLoading();
                if (this.formType === FormType.EDIT) {
                    this.form.get('deposito').setValue(this.item.deposito);
                }
                this.utils.stopLoading();
            }, error => {
                console.log(error);
                this.utils.stopLoading();
            }
        );
    }

    listStock() {
        this.utils.startLoading();
        this.limpiarCampos();
        this.detalles.length = 0;
        this.dataSource = new MatTableDataSource<PedidoVentaDetalle>(
            this.detalles
        );
        this.stockService.listStockByDeposito(this.form.get('deposito').value.id).subscribe(data => {
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
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selected($event): void {
        console.log($event.source.value);
        this.stockSelected = $event.source.value;
    }

    selectedCliente($event): void {
        console.log($event.source.value);
        this.clienteSelected = $event.source.value;
    }

    display(value: Stock) {
        if (value) {
            return value.articulo.codigoGenerico.toString() + ' | ' + value.articulo.descripcion + ' | ' + value.existencia.toString();
        }
    }

    displayCliente(value: Cliente) {
        if (value) {
            return value.ruc.toString() + ' - ' + value.razon;
        }
    }

    limpiarCampos() {
        this.stockSelected = null;
        this.myControl.setValue('');
        this.form.get('cantidadArticulo').setValue(0);
    }

    addItem() {
        if (this.stockSelected !== null) {
            if (this.form.get('cantidadArticulo').value > 0) {
                if (this.form.get('cantidadArticulo').value <= this.stockSelected.existencia) {
                    const art = this.detalles.find(d => d.articulo.id === this.stockSelected.articulo.id);
                    if (art) {
                        if (art.cantidad + this.form.get('cantidadArticulo').value <= this.stockSelected.existencia) {
                            art.cantidad += this.form.get('cantidadArticulo').value;
                            this.limpiarCampos();
                        } else {
                            this.uiService.showSnackbar(
                                'La cantidad de articulos no puede sobrepasar a la existencia.',
                                'Cerrar',
                                3000
                            );
                        }
                    } else {
                        this.detalles.push({
                            'id': 0,
                            'articulo': this.stockSelected.articulo,
                            'cantidad': this.form.get('cantidadArticulo').value,
                            'estado': 'ACTIVO'
                        });
                        this.listStocks.push(this.stockSelected);
                        console.log(this.detalles);
                        this.dataSource = new MatTableDataSource<PedidoVentaDetalle>(
                            this.detalles
                        );
                        this.limpiarCampos();
                    }
                } else {
                    this.uiService.showSnackbar(
                        'La cantidad de articulos no puede sobrepasar a la existencia.',
                        'Cerrar',
                        3000
                    );
                }
            } else {
                this.uiService.showSnackbar(
                    'La cantidad de articulos debe ser mayor a 0.',
                    'Cerrar',
                    3000
                );
            }
        } else {
            this.uiService.showSnackbar(
                'Debe seleccionar un articulo.',
                'Cerrar',
                3000
            );
        }
    }

    incItem(dato) {
        dato.cantidad++;
    }

    descItem(dato) {
        dato.cantidad--;
    }

    deleteItem(dato) {
        this.detalles = this.detalles.filter(d => d.articulo.id !== dato.articulo.id);
        this.listStocks = this.listStocks.filter(d => d.articulo.id !== dato.articulo.id);
        this.dataSource = new MatTableDataSource<PedidoVentaDetalle>(
            this.detalles
        );
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
        if (this.detalles.length > 0) {
            this.setAtributes();
            this.item.id = 0;
            if (this.utils.tieneLetras(this.item.observacion)) {
                // Llama al servicio que almacena el objeto {PriceListDraft}
                this.utils.startLoading();
                this.pedidoVentaService.guardarPedidoVenta(this.item)
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
            } else {
                this.uiService.showSnackbar(
                    'La descripción no puede ser solo númerica.',
                    'Cerrar',
                    5000
                );
            }
        } else {
            this.uiService.showSnackbar(
                'Debe asignar al menos un detalle al pedido.',
                'Cerrar',
                5000
            );
        }
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {
        // Asigna los valores del formulario al objeto a almacenar
        this.setAtributes();
        // Llama al servicio http que actualiza el objeto.
        if (this.utils.tieneLetras(this.item.observacion)) {
            this.pedidoVentaService.editarPedidoVenta(this.item).subscribe(data => {
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

    anular(dato: PedidoVenta): void {
        this.utils.startLoading();
        this.pedidoVentaService.anularPedidoVenta(dato).subscribe(
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

    existStock(i: number) {
        return this.detalles[i].cantidad < this.listStocks[i].existencia;
    }

    anularDialog(event: any): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Pedido de Venta',
                msg: '¿Está seguro que desea anular este Pedido de Venta?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }
}
