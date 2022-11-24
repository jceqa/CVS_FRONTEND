import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {NotaVenta} from '../../../../models/notaVenta';
import {MatPaginator} from '@angular/material/paginator';
import {NotaVentaService} from '../../../../services/notaventa.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {
    NotaVentaDialogComponent
} from './nota-venta-dialog/nota-venta-dialog.component';

@Component({
    selector: 'app-nota-venta',
    templateUrl: './nota-venta.component.html',
    styleUrls: ['./nota-venta.component.scss']
})
export class NotaVentaComponent implements OnInit {


    displayedColumns: string[] = ['id', 'observacion', 'cliente', 'fecha', 'estado', 'monto', 'actions'];
    dataSource = new MatTableDataSource<NotaVenta>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    facturas: NotaVenta[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private notaVentaService: NotaVentaService,
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
            this.notaVentaService.getNotasVenta(this.all).subscribe(
                (data) => {
                    console.log(data);
                    this.facturas = data;
                    this.dataSource = new MatTableDataSource<NotaVenta>(
                        this.facturas
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
            this.notaVentaService.getNotaVentaPendientes().subscribe(
                (data) => {
                    console.log(data);
                    this.facturas = data;
                    this.dataSource = new MatTableDataSource<NotaVenta>(
                        this.facturas
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

        const item = new NotaVenta();

        this.openDialog(item);

    }

    anular(dato: NotaVenta): void {
        this.util.startLoading();
        this.notaVentaService.anularNotaVenta(dato).subscribe(
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

    anularDialog(event: any, notaVenta: NotaVenta): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Nota de Venta',
                msg: '¿Está seguro que desea anular esta Nota de Venta?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(notaVenta);
            }
        });
    }

    openDialog(item: NotaVenta): void {
        const dialogRef = this.dialog.open(NotaVentaDialogComponent, {
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
