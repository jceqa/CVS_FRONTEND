import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {CuentaAPagar} from '../../../../models/cuentaAPagar';
import {MatPaginator} from '@angular/material/paginator';
import {CuentaAPagarService} from '../../../../services/cuentaapagar.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {
    CuentaAPagarDialogComponent
} from './cuenta-a-pagar-dialog/cuenta-a-pagar-dialog.component';

@Component({
    selector: 'app-cuenta-a-pagar',
    templateUrl: './cuenta-a-pagar.component.html',
    styleUrls: ['./cuenta-a-pagar.component.scss']
})
export class CuentaAPagarComponent implements OnInit {

    displayedColumns: string[] = ['id', 'fechaVencimiento', 'estado', 'monto', 'cuota', 'actions'];
    dataSource = new MatTableDataSource<CuentaAPagar>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    facturasCompra: CuentaAPagar[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private cuentaAPagarService: CuentaAPagarService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.util.startLoading();
        this.cuentaAPagarService.getCuentasAPagar(this.all).subscribe(
            (data) => {
                console.log(data);
                this.facturasCompra = data;

                this.dataSource = new MatTableDataSource<CuentaAPagar>(
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

        const item = new CuentaAPagar();

        this.openDialog(item);

    }

    anular(dato: CuentaAPagar): void {
        this.util.startLoading();
        this.cuentaAPagarService.anularCuentaAPagar(dato).subscribe(
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

    anularDialog(event: any, cuentaAPagar: CuentaAPagar): void {
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
                this.anular(cuentaAPagar);
            }
        });
    }

    openDialog(item: CuentaAPagar): void {
        const dialogRef = this.dialog.open(CuentaAPagarDialogComponent, {
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
