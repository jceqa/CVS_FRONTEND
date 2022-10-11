import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {NotaCreditoCompra} from '../../../../models/notaCreditoCompra';
import {MatPaginator} from '@angular/material/paginator';
import {NotaCreditoCompraService} from '../../../../services/notacreditocompra.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {
    NotaCreditoCompraDialogComponent
} from './nota-credito-compra-dialog/nota-credito-compra-dialog.component';

@Component({
    selector: 'app-nota-credito-compra',
    templateUrl: './nota-credito-compra.component.html',
    styleUrls: ['./nota-credito-compra.component.scss']
})
export class NotaCreditoCompraComponent implements OnInit {


    displayedColumns: string[] = ['id', 'observacion', 'numero', 'fechaVencimiento', 'estado', 'monto', 'actions'];
    dataSource = new MatTableDataSource<NotaCreditoCompra>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    facturasCompra: NotaCreditoCompra[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private notaCreditoCompraService: NotaCreditoCompraService,
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
            this.notaCreditoCompraService.getNotasCreditoCompra(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.facturasCompra = data;
                    this.dataSource = new MatTableDataSource<NotaCreditoCompra>(
                        this.facturasCompra
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
            this.notaCreditoCompraService.getNotaCreditoCompraPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.facturasCompra = data;
                    this.dataSource = new MatTableDataSource<NotaCreditoCompra>(
                        this.facturasCompra
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

        const item = new NotaCreditoCompra();

        this.openDialog(item);

    }

    anular(dato: NotaCreditoCompra): void {
        this.util.startLoading();
        this.notaCreditoCompraService.anularNotaCreditoCompra(dato).subscribe(
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

    anularDialog(event: any, notaCreditoCompra: NotaCreditoCompra): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Factura Compra',
                msg: '¿Está seguro que desea anular esta Factura de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(notaCreditoCompra);
            }
        });
    }

    openDialog(item: NotaCreditoCompra): void {
        const dialogRef = this.dialog.open(NotaCreditoCompraDialogComponent, {
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
