import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FacturaCompra} from '../../../../models/facturaCompra';
import {MatPaginator} from '@angular/material/paginator';
import {FacturaCompraService} from '../../../../services/facturacompra.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {FacturaCompraDialogComponent} from './factura-compra-dialog/factura-compra-dialog.component';

@Component({
    selector: 'app-factura-compra',
    templateUrl: './factura-compra.component.html',
    styleUrls: ['./factura-compra.component.scss']
})
export class FacturaCompraComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'estado', 'condicionPago', 'total', 'actions'];
    dataSource = new MatTableDataSource<FacturaCompra>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    facturasCompra: FacturaCompra[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private facturaCompraService: FacturaCompraService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.util.startLoading();
        this.facturaCompraService.getFacturasCompra(this.all).subscribe(
            (data) => {
                console.log(data);
                this.facturasCompra = data;

                this.dataSource = new MatTableDataSource<FacturaCompra>(
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

        const item = new FacturaCompra();

        this.openDialog(item);

    }

    anular(dato: FacturaCompra): void {
        this.util.startLoading();
        this.facturaCompraService.anularFacturaCompra(dato).subscribe(
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

    anularDialog(event: any, facturaCompra: FacturaCompra): void {
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
                this.anular(facturaCompra);
            }
        });
    }

    openDialog(item: FacturaCompra): void {
        const dialogRef = this.dialog.open(FacturaCompraDialogComponent, {
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
