import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {PedidoCompra} from '../../../../models/pedidoCompra';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {PedidoCompraService} from '../../../../services/pedidocompra.service';
import {PedidoCompraDialogComponent} from './pedido-compra-dialog/pedido-compra-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-pedido-compra',
    templateUrl: './pedido-compra.component.html',
    styleUrls: ['./pedido-compra.component.scss']
})
export class PedidoCompraComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'estado', 'deposito', 'actions'];
    dataSource = new MatTableDataSource<PedidoCompra>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    pedidosCompra: PedidoCompra[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private pedidoCompraService: PedidoCompraService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.util.startLoading();
        if (this.all) {
            this.pedidoCompraService.getPedidosCompra(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.pedidosCompra = data;
                    this.dataSource = new MatTableDataSource<PedidoCompra>(
                        this.pedidosCompra
                    );
                    this.dataSource.paginator = this.paginator;
                    // this.store.dispatch(new UI.StopLoading());
                    // this.util.localStorageSetItem('loading', 'false');
                    this.util.stopLoading();
                },
                err => {
                    // this.store.dispatch(new UI.StopLoading());
                    // this.util.localStorageSetItem('loading', 'false');
                    this.util.stopLoading();
                    console.log(err.error);
                    this.uiService.showSnackbar(
                        'Ha ocurrido un error.',
                        'Cerrar',
                        3000
                    );
                }
            );
        } else {
            this.pedidoCompraService.getPedidosCompraPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.pedidosCompra = data;
                    this.dataSource = new MatTableDataSource<PedidoCompra>(
                        this.pedidosCompra
                    );
                    this.dataSource.paginator = this.paginator;
                    // this.store.dispatch(new UI.StopLoading());
                    // this.util.localStorageSetItem('loading', 'false');
                    this.util.stopLoading();
                },
                err => {
                    // this.store.dispatch(new UI.StopLoading());
                    // this.util.localStorageSetItem('loading', 'false');
                    this.util.stopLoading();
                    console.log(err.error);
                    this.uiService.showSnackbar(
                        'Ha ocurrido un error.',
                        'Cerrar',
                        3000
                    );
                }
            );
        }
    }

    add(): void {

        const item = new PedidoCompra();

        this.openDialog(item);

    }

    anular(dato: PedidoCompra): void {
        this.util.startLoading();
        this.pedidoCompraService.anularPedidoCompra(dato).subscribe(
            result => {
                console.log(result);
                this.cargar();
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    'Anulado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    anularDialog(event: any, pedidoCompra: PedidoCompra): void {
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
                this.anular(pedidoCompra);
            }
        });
    }

    openDialog(item: PedidoCompra): void {
        const dialogRef = this.dialog.open(PedidoCompraDialogComponent, {
            minWidth: '70%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // debugger;
            if (result) {
                this.cargar();
            }
        });
    }

}
