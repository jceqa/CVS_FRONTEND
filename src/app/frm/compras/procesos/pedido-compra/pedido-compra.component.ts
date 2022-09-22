import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {PedidoCompra} from '../../../../models/pedidoCompra';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {PedidoCompraService} from '../../../../services/pedidocompra.service';
import {PedidoCompraDialogComponent} from './pedido-compra-dialog/pedido-compra-dialog.component';

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
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
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
    }

    add(): void {

        const item = new PedidoCompra();

        this.openDialog(item);

    }

    openDialog(item: PedidoCompra): void {
        const dialogRef = this.dialog.open(PedidoCompraDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargar();
            }
        });
    }

}
