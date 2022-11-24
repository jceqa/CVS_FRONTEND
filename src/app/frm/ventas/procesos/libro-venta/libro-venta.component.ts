import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {LibroVenta} from '../../../../models/libroVenta';
import {MatPaginator} from '@angular/material/paginator';
import {LibroVentaService} from '../../../../services/libroventa.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {
    LibroVentaDialogComponent
} from './libro-venta-dialog/libro-venta-dialog.component';

@Component({
    selector: 'app-libro-venta',
    templateUrl: './libro-venta.component.html',
    styleUrls: ['./libro-venta.component.scss']
})
export class LibroVentaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'estado', 'fecha', 'montoIVA5', 'montoIVA10', 'montoNeto', 'montoTotal', 'actions'];
    dataSource = new MatTableDataSource<LibroVenta>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    facturasVenta: LibroVenta[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private libroVentaService: LibroVentaService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.util.startLoading();
        this.libroVentaService.getLibrosVenta(this.all).subscribe(
            (data) => {
                console.log(data);
                this.facturasVenta = data;

                this.dataSource = new MatTableDataSource<LibroVenta>(
                    this.facturasVenta
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

    add(): void {
        const item = new LibroVenta();
        this.openDialog(item);
    }

    anular(dato: LibroVenta): void {
        this.util.startLoading();
        this.libroVentaService.anularLibroVenta(dato).subscribe(
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

    anularDialog(event: any, libroVenta: LibroVenta): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Factura Venta',
                msg: '¿Está seguro que desea anular esta Factura de Venta?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(libroVenta);
            }
        });
    }

    openDialog(item: LibroVenta): void {
        const dialogRef = this.dialog.open(LibroVentaDialogComponent, {
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
