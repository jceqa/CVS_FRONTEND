import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {OrdenCompra} from '../../../../models/ordenCompra';
import {MatPaginator} from '@angular/material/paginator';
import {OrdenCompraService} from '../../../../services/ordencompra.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {OrdenCompraDialogComponent} from './orden-compra-dialog/orden-compra-dialog.component';

@Component({
    selector: 'app-orden-compra',
    templateUrl: './orden-compra.component.html',
    styleUrls: ['./orden-compra.component.scss']
})
export class OrdenCompraComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'estado', 'condicionPago', 'total', 'actions'];
    dataSource = new MatTableDataSource<OrdenCompra>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    ordenesCompra: OrdenCompra[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private ordenCompraService: OrdenCompraService,
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
            this.ordenCompraService.getOrdenesCompra(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.ordenesCompra = data;
                    this.dataSource = new MatTableDataSource<OrdenCompra>(
                        this.ordenesCompra
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
            this.ordenCompraService.getOrdenCompraPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.ordenesCompra = data;
                    this.dataSource = new MatTableDataSource<OrdenCompra>(
                        this.ordenesCompra
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
        const item = new OrdenCompra();
        this.openDialog(item);
    }

    anular(dato: OrdenCompra): void {
        this.util.startLoading();
        this.ordenCompraService.anularOrdenCompra(dato).subscribe(
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

    anularDialog(event: any, ordenCompra: OrdenCompra): void {
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
                this.anular(ordenCompra);
            }
        });
    }

    openDialog(item: OrdenCompra): void {
        const dialogRef = this.dialog.open(OrdenCompraDialogComponent, {
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
