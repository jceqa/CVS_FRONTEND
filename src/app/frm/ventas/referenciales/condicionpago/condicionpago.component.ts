import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CondicionPagoService } from '../../../../services/condicionpago.service';
import { CondicionPago } from '../../../../models/condicionPago';
import { MatDialog } from '@angular/material/dialog';
import { CondicionPagoDialogComponent } from './condicionPago-dialog/condicionPago-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';
import {UtilService} from '../../../../services/util.service';


@Component({
    selector: 'app-condicionpago',
    templateUrl: './condicionPago.component.html',
    styleUrls: ['./condicionPago.component.css']
})
export class CondicionPagoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<CondicionPago>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    condicionpagos: CondicionPago[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;
    constructor(
        private condicionPagoService: CondicionPagoService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarCondicionPagos();
    }

    cargarCondicionPagos() {
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
        this.condicionPagoService.getCondicionPagos(this.all).subscribe(
            (data) => {
                console.log(data);
                this.condicionpagos = data;

                this.dataSource = new MatTableDataSource<CondicionPago>(
                    this.condicionpagos
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

    addItem(): void {

        const item = new CondicionPago();

        this.editItem(item);

    }

    editItem(item: CondicionPago): void {
        const dialogRef = this.dialog.open(CondicionPagoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarCondicionPagos();
            }
        });
    }

    deleteItem(id: number): void {
        this.condicionPagoService.eliminarCondicionPago(id).subscribe(
            result => {
                console.log(result);
                this.cargarCondicionPagos();

                this.uiService.showSnackbar(
                    'Eliminado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);

                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    reactivateItem(condicionpago: CondicionPago): void {
        condicionpago.estado = 'ACTIVO';
        this.condicionPagoService.editarCondicionPago(condicionpago).subscribe(
            result => {
                console.log(result);
                this.cargarCondicionPagos();
                this.uiService.showSnackbar(
                    'Reactivado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);

                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    delete(event: any, condicionpago: CondicionPago): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar esta Condicion de pago',
                msg: '¿Está seguro que desea eliminar esta condicion de pago?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(condicionpago.id);
            }
        });
    }

    reactivate(event: any, condicionpago: CondicionPago): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar condicion de pago',
                msg: '¿Está seguro que desea reactivar esta condicion de pago?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(condicionpago);
            }
        });
    }
}
