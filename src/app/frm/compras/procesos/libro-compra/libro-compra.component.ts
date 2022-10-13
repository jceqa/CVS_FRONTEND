import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {LibroCompra} from '../../../../models/libroCompra';
import {MatPaginator} from '@angular/material/paginator';
import {LibroCompraService} from '../../../../services/librocompra.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {
    LibroCompraDialogComponent
} from './libro-compra-dialog/libro-compra-dialog.component';

@Component({
    selector: 'app-libro-compra',
    templateUrl: './libro-compra.component.html',
    styleUrls: ['./libro-compra.component.sass']
})
export class LibroCompraComponent implements OnInit {

    displayedColumns: string[] = ['id', 'estado', 'fecha', 'montoIVA5', 'montoIVA10', 'montoNeto', 'montoTotal', 'actions'];
    dataSource = new MatTableDataSource<LibroCompra>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    facturasCompra: LibroCompra[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private libroCompraService: LibroCompraService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.util.startLoading();
        this.libroCompraService.getLibrosCompra(this.all).subscribe(
            (data) => {
                console.log(data);
                this.facturasCompra = data;

                this.dataSource = new MatTableDataSource<LibroCompra>(
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

    add(): void {
        const item = new LibroCompra();
        this.openDialog(item);
    }

    anular(dato: LibroCompra): void {
        this.util.startLoading();
        this.libroCompraService.anularLibroCompra(dato).subscribe(
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

    anularDialog(event: any, libroCompra: LibroCompra): void {
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
                this.anular(libroCompra);
            }
        });
    }

    openDialog(item: LibroCompra): void {
        const dialogRef = this.dialog.open(LibroCompraDialogComponent, {
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
