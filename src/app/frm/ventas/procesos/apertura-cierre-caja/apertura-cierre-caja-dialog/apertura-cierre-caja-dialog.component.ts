import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Articulo} from '../../../../../models/articulo';
import {Observable} from 'rxjs';
import {AperturaCierreCaja} from '../../../../../models/aperturaCierreCaja';
import {FormType} from '../../../../../models/enum';
import {Sucursal} from '../../../../../models/sucursal';
import {Deposito} from '../../../../../models/deposito';
// import {MatTableDataSource} from '@angular/material/table';
// import {AperturaCierreCajaDetalle} from '../../../../../models/aperturaCierreCajaDetalle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {AperturaCierreCajaService} from '../../../../../services/aperturacierrecaja.service';
import {ArticuloService} from '../../../../../services/articulo.service';
import {UtilService} from '../../../../../services/util.service';
import {SucursalService} from '../../../../../services/sucursal.service';
import {DepositoService} from '../../../../../services/deposito.service';
import {map, startWith} from 'rxjs/operators';
import {Usuario} from '../../../../../models/usuario';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';

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
    depositos: Deposito[] = [];

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'actions'];
    // dataSource = new MatTableDataSource<AperturaCierreCajaDetalle>();
    // detalles: AperturaCierreCajaDetalle[] = [];

    estadoPedido = '';

    constructor(
        private dialogRef: MatDialogRef<AperturaCierreCajaDialogComponent>,
        private uiService: UIService,
        private aperturaCierreCajaService: AperturaCierreCajaService,
        private articuloService: ArticuloService,
        private utils: UtilService,
        private sucursalService: SucursalService,
        private depositoService: DepositoService,
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
            sucursal: new FormControl('', [Validators.required]),
            deposito: new FormControl('', [Validators.required]),
            cantidadArticulo: new FormControl(0),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            // this.title = 'Editar';
            this.title = '';
            this.editID = this.data.item.id;
            this.formType = FormType.EDIT;
            this.setForm(this.item);
            this.form.get('observacion').disable();
            this.form.get('sucursal').disable();
            this.form.get('deposito').disable();
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

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
        this.sucursalService.getSucursalByUserId(this.utils.getUserId()).subscribe(data => {
            console.log(data);
            this.sucursales = data;
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    private _filter(value: any): Articulo[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.options.filter(option => option.codigoGenerico.toString().includes(filterValue) ||
                option.descripcion.toLowerCase().includes(filterValue))
        );
    }


    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    setForm(item: AperturaCierreCaja) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                // observacion: item.observacion,
                // deposito: item.deposito,
                // sucursal: item.deposito.sucursal,
            });
            /*this.fecha = item.fecha;
            this.detalles = item.detalleAperturaCierreCajas;
            this.estadoPedido = item.estadoAperturaCierreCaja.descripcion;
            this.dataSource = new MatTableDataSource<AperturaCierreCajaDetalle>(
                this.detalles
            );*/

            this.listDepositos();
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        // this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        // this.item.deposito = this.form.get('deposito').value;
        // this.item.estadoAperturaCierreCaja = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        // this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        // this.item.detalleAperturaCierreCajas = this.detalles;
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
                    // this.form.get('deposito').setValue(this.item.deposito);
                }
                this.utils.stopLoading();
            }, error => {
                console.log(error);
                this.utils.stopLoading();
            }
        );
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selected($event): void {
        console.log($event.source.value);
        this.articuloSelected = $event.source.value;
    }

    display(value) {
        if (value) {
            return value.codigoGenerico.toString() + ' - ' + value.descripcion;
        }
    }

    limpiarCampos() {
        this.articuloSelected = null;
        this.myControl.setValue('');
        this.form.get('cantidadArticulo').setValue(0);
    }

    addItem() {
        if (this.articuloSelected !== null) {
            if (this.form.get('cantidadArticulo').value > 0) {
                // const art = this.detalles.find(d => d.articulo.id === this.articuloSelected.id);
                // if (art) {
                //    art.cantidad += this.form.get('cantidadArticulo').value;
                    /*const index = this.detalles.indexOf(art);
                    this.detalles.splice(index, 1, {
                        'id': 0,
                        'articulo': this.articuloSelected,
                        'cantidad': this.form.get('cantidadArticulo').value + this.detalles[index].cantidad,
                        'estado': 'ACTIVO'
                    });*/
                /*} else {
                    this.detalles.push({
                        'id': 0,
                        'articulo': this.articuloSelected,
                        'cantidad': this.form.get('cantidadArticulo').value,
                        'estado': 'ACTIVO'
                    });
                }
                console.log(this.detalles);
                this.dataSource = new MatTableDataSource<AperturaCierreCajaDetalle>(
                    this.detalles
                );*/
                this.limpiarCampos();
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
        console.log(dato);
        /*this.detalles = this.detalles.filter(d => d.articulo.id !== dato.articulo.id);
        this.dataSource = new MatTableDataSource<AperturaCierreCajaDetalle>(
            this.detalles
        );*/
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

}
