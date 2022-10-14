import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {PedidoVenta} from '../../../../models/pedidoVenta';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {PedidoVentaService} from '../../../../services/pedidoventa.service';
import {PedidoVentaDialogComponent} from './pedido-venta-dialog/pedido-venta-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-pedido-venta',
    templateUrl: './pedido-venta.component.html',
    styleUrls: ['./pedido-venta.component.scss']
})
export class PedidoVentaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'estado', 'cliente', 'sucursal', 'actions'];
    dataSource = new MatTableDataSource<PedidoVenta>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    pedidosVenta: PedidoVenta[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private pedidoVentaService: PedidoVentaService,
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
            this.pedidoVentaService.getPedidosVenta(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.pedidosVenta = data;
                    this.dataSource = new MatTableDataSource<PedidoVenta>(
                        this.pedidosVenta
                    );
                    this.dataSource.paginator = this.paginator;
                    this.util.stopLoading();
                },
                err => {
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
            this.pedidoVentaService.getPedidosVentaPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.pedidosVenta = data;
                    this.dataSource = new MatTableDataSource<PedidoVenta>(
                        this.pedidosVenta
                    );
                    this.dataSource.paginator = this.paginator;
                    this.util.stopLoading();
                },
                err => {
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

        const item = new PedidoVenta();

        this.openDialog(item);

    }

    anular(dato: PedidoVenta): void {
        this.util.startLoading();
        this.pedidoVentaService.anularPedidoVenta(dato).subscribe(
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

    anularDialog(event: any, pedidoVenta: PedidoVenta): void {
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
                this.anular(pedidoVenta);
            }
        });
    }

    openDialog(item: PedidoVenta): void {
        const dialogRef = this.dialog.open(PedidoVentaDialogComponent, {
            minWidth: '70%',
            // maxWidth: '600px',
            disableClose: true,
            autoFocus: false,
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
