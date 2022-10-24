import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Factura} from '../../../../models/factura';
import {MatPaginator} from '@angular/material/paginator';
import {FacturaService} from '../../../../services/factura.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {FacturaDialogComponent} from './factura-dialog/factura-dialog.component';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'estado', 'condicionPago', 'total', 'actions'];
    dataSource = new MatTableDataSource<Factura>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    facturas: Factura[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private facturaService: FacturaService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    cargar() {
        this.util.startLoading();
        this.facturaService.getFacturas(this.all).subscribe(
            (data) => {
                console.log(data);
                this.facturas = data;

                this.dataSource = new MatTableDataSource<Factura>(
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

    add(): void {
        const item = new Factura();
        this.openDialog(item);
    }

    anular(dato: Factura): void {
        this.util.startLoading();
        this.facturaService.anularFactura(dato).subscribe(
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

    anularDialog(event: any, factura: Factura): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Factura ',
                msg: '¿Está seguro que desea anular esta Factura de ?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(factura);
            }
        });
    }

    openDialog(item: Factura): void {
        const dialogRef = this.dialog.open(FacturaDialogComponent, {
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
