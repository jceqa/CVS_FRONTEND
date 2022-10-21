import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {PresupuestoCompra} from '../../../../../models/presupuestoCompra';
import {FormType} from '../../../../../models/enum';
import {MatTableDataSource} from '@angular/material/table';
import {PresupuestoCompraDetalle} from '../../../../../models/presupuestoCompraDetalle';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {PresupuestoCompraService} from '../../../../../services/presupuestocompra.service';
import {UtilService} from '../../../../../services/util.service';
import {map, startWith} from 'rxjs/operators';
import {Estado} from '../../../../../models/estado';
import {Usuario} from '../../../../../models/usuario';
import {ConfirmDialogComponent} from '../../../../../confirm-dialog/confirm-dialog.component';
import {PedidoCompraService} from '../../../../../services/pedidocompra.service';
import {PedidoCompra} from '../../../../../models/pedidoCompra';
import {formatDate} from '@angular/common';
import {Proveedor} from '../../../../../models/proveedor';
import {ProveedorService} from '../../../../../services/proveedor.service';

@Component({
    selector: 'app-presupuesto-compra-dialog',
    templateUrl: './presupuesto-compra-dialog.component.html',
    styleUrls: ['./presupuesto-compra-dialog.component.scss']
})
export class PresupuestoCompraDialogComponent implements OnInit {

    pedidosControl = new FormControl('');
    proveedorControl = new FormControl('');
    pedidosFiltered: Observable<PedidoCompra[]>;
    proveedorFiltered: Observable<Proveedor[]>;

    item: PresupuestoCompra;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;
    fecha = new Date();

    displayedColumns: string[] = ['codigo', 'item', 'cantidad', 'precio', 'total'/*, 'actions'*/];
    dataSource = new MatTableDataSource<PresupuestoCompraDetalle>();
    detalles: PresupuestoCompraDetalle[] = [];

    pedidos: PedidoCompra[] = [];
    proveedores: Proveedor[] = [];
    pedidoSelected: PedidoCompra;
    proveedorSelected: Proveedor;

    estadoPresupuesto = '';
    total = 0;

    constructor(
        private dialogRef: MatDialogRef<PresupuestoCompraDialogComponent>,
        private uiService: UIService,
        private presupuestoCompraService: PresupuestoCompraService,
        private utils: UtilService,
        private pedidoCompraService: PedidoCompraService,
        private proveedorService: ProveedorService,
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
            this.total = this.item.total;
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.pedidoCompraService.getPedidosCompraPendientes().subscribe(data => {
            console.log(data);
            this.pedidos = data;
            this.pedidosFiltered = this.pedidosControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterPedido(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
        this.proveedorService.getProveedores().subscribe(data => {
            console.log(data);
            this.proveedores = data;

            this.proveedorFiltered = this.proveedorControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterProveedor(value || '')),
            );
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    setForm(item: PresupuestoCompra) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                observacion: item.observacion,
            });
            this.fecha = item.fecha;
            this.detalles = item.presupuestoCompraDetalles;
            this.estadoPresupuesto = item.estadoPresupuestoCompra.descripcion;
            this.dataSource = new MatTableDataSource<PresupuestoCompraDetalle>(
                this.detalles
            );

        }
    }

    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.observacion = this.form.get('observacion').value.toString().toUpperCase().trim();
        this.item.estadoPresupuestoCompra = new Estado(1);
        this.item.usuario = new Usuario(this.utils.getUserId());
        this.item.fecha = this.fecha;
        this.item.estado = 'ACTIVO';
        this.item.presupuestoCompraDetalles = this.detalles;
        this.item.total = this.total;
        this.item.pedidoCompra = this.pedidoSelected;
        this.item.proveedor = this.proveedorSelected;
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    selectedPedido($event): void {
        console.log($event.source.value);
        this.pedidoSelected = $event.source.value;

        this.detalles.length = 0;

        this.pedidoSelected.detallePedidoCompras.forEach(dPC => {
            this.detalles.push(
                {
                    estado: 'ACTIVO',
                    id: 0,
                    monto: 0,
                    pedidoCompraDetalle: dPC
                });
        });

        this.dataSource = new MatTableDataSource<PresupuestoCompraDetalle>(
            this.detalles
        );
    }

    selectedProveedor($event): void {
        console.log($event.source.value);
        this.proveedorSelected = $event.source.value;
    }

    displayPedido(value) {
        if (value) {
            return value.observacion + ' | '
                + formatDate(value.fecha, 'dd/MM/yyyy', 'en-US') + ' | '
                + value.usuario.nombre + ' | '
                + value.deposito.descripcion;
        }
    }

    displayProveedor(value) {
        if (value) {
            return value.ruc + ' | ' + value.razonSocial;
        }
    }

    setNumber($event, index) {
        this.total -= this.detalles[index].monto * this.detalles[index].pedidoCompraDetalle.cantidad;
        this.detalles[index].monto = this.utils.getNumber($event.target.value);
        this.total += this.detalles[index].monto * this.detalles[index].pedidoCompraDetalle.cantidad;
    }

    onKeydown($event, index) {
        if ($event.key === 'Enter') {
            this.setNumber($event, index);
        }
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

    validarCampos(): boolean {
        if (!this.utils.tieneLetras(this.item.observacion)) {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
            return false;
        } else if (!this.pedidoSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar un Pedido de Compra.',
                'Cerrar',
                5000
            );
            return false;
        } else if (!this.proveedorSelected) {
            this.uiService.showSnackbar(
                'Debe seleccionar un Proveedor.',
                'Cerrar',
                5000
            );
            return false;
        }

        let haveZero = false;
        this.item.presupuestoCompraDetalles.forEach( pcd => {
            if (pcd.monto === 0) {
                haveZero = true;
            }
        });

        if (haveZero) {
            this.uiService.showSnackbar(
                'Debe especificar un Precio diferente de 0 para cada Articulo.',
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
            this.presupuestoCompraService.guardarPresupuestoCompra(this.item)
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

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        // Asigna los valores del formulario al objeto a almacenar
        this.setAtributes();

        // Llama al servicio http que actualiza el objeto.
        if (this.utils.tieneLetras(this.item.observacion)) {
            this.presupuestoCompraService.editarPresupuestoCompra(this.item).subscribe(data => {
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

    anular(dato: PresupuestoCompra): void {
        this.utils.startLoading();
        this.presupuestoCompraService.anularPresupuestoCompra(dato).subscribe(
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
                title: 'Anular Presupuesto Compra',
                msg: '¿Está seguro que desea anular este Presupuesto de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(this.item);
            }
        });
    }

    private _filterPedido(value: any): PedidoCompra[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.pedidos.filter(pedido =>
                pedido.observacion.toLowerCase().includes(filterValue) ||
                pedido.usuario.nombre.toLowerCase().includes(filterValue) ||
                pedido.deposito.descripcion.toLowerCase().includes(filterValue) ||
                formatDate(pedido.fecha, 'dd/MM/yyyy', 'en-US').includes(filterValue))
        );
    }

    private _filterProveedor(value: any): Proveedor[] {
        const filterValue = value.toString().toLowerCase();
        return (
            this.proveedores.filter(proveedor =>
                proveedor.ruc.toLowerCase().includes(filterValue) ||
                proveedor.razonSocial.toLowerCase().includes(filterValue))
        );
    }
}
