import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {PresupuestoCompra} from '../../../../models/presupuestoCompra';
import {PresupuestoCompraDialogComponent} from './presupuesto-compra-dialog/presupuesto-compra-dialog.component';
import {PresupuestoCompraService} from '../../../../services/presupuestocompra.service';

@Component({
    selector: 'app-presupuesto-compra',
    templateUrl: './presupuesto-compra.component.html',
    styleUrls: ['./presupuesto-compra.component.scss']
})
export class PresupuestoCompraComponent implements OnInit {

    displayedColumns: string[] = ['id', 'observacion', 'fecha', 'estado', 'total', 'actions'];
    dataSource = new MatTableDataSource<PresupuestoCompra>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    presupuestosCompra: PresupuestoCompra[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private presupuestoCompraService: PresupuestoCompraService,
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
        this.presupuestoCompraService.getPresupuestosCompra(this.all).subscribe(
            (data) => {
                console.log(data);
                this.presupuestosCompra = data;

                this.dataSource = new MatTableDataSource<PresupuestoCompra>(
                    this.presupuestosCompra
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

        const item = new PresupuestoCompra();

        this.openDialog(item);

    }

    anular(dato: PresupuestoCompra): void {
        this.util.startLoading();
        this.presupuestoCompraService.anularPresupuestoCompra(dato).subscribe(
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

    anularDialog(event: any, presupuestoCompra: PresupuestoCompra): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Presupuesto Compra',
                msg: '¿Está seguro que desea anular este Presupuesto de Compra?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(presupuestoCompra);
            }
        });
    }

    openDialog(item: PresupuestoCompra): void {
        const dialogRef = this.dialog.open(PresupuestoCompraDialogComponent, {
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
