import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {AperturaCierreCaja} from '../../../../models/aperturaCierreCaja';
import {MatPaginator} from '@angular/material/paginator';
import {AperturaCierreCajaService} from '../../../../services/aperturacierrecaja.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {
    AperturaCierreCajaDialogComponent
} from './apertura-cierre-caja-dialog/apertura-cierre-caja-dialog.component';

@Component({
    selector: 'app-apertura-cierre-caja',
    templateUrl: './apertura-cierre-caja.component.html',
    styleUrls: ['./apertura-cierre-caja.component.scss']
})
export class AperturaCierreCajaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'caja', 'sucursal', 'fechaHoraApertura', 'fechaHoraCierre', 'montoApertura', 'montoCierre','actions'];
    dataSource = new MatTableDataSource<AperturaCierreCaja>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    pedidosCompra: AperturaCierreCaja[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private aperturaCierreCajaService: AperturaCierreCajaService,
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
        this.aperturaCierreCajaService.getAperturaCierreCajas(this.all).subscribe(
            (data) => {
                console.log(data);
                this.pedidosCompra = data;

                this.dataSource = new MatTableDataSource<AperturaCierreCaja>(
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

        const item = new AperturaCierreCaja();

        this.openDialog(item);

    }

    anular(dato: AperturaCierreCaja): void {
        this.util.startLoading();
        this.aperturaCierreCajaService.anularAperturaCierreCaja(dato).subscribe(
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

    anularDialog(event: any, aperturaCierreCaja: AperturaCierreCaja): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Pedido Compra',
                msg: '¿Está seguro que desea anular este Pedido de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(aperturaCierreCaja);
            }
        });
    }

    openDialog(item: AperturaCierreCaja): void {
        const dialogRef = this.dialog.open(AperturaCierreCajaDialogComponent, {
            minWidth: '70%',
            // maxWidth: '600px',
            disableClose: true,
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
