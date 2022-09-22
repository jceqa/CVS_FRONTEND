import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TipoTarjetaService } from '../../../../services/tipotarjeta.service';
import { TipoTarjeta } from '../../../../models/tipoTarjeta';
import { MatDialog } from '@angular/material/dialog';
import { TipoTarjetaDialogComponent } from './tipotarjeta-dialog/tipotarjeta-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';
import {UtilService} from '../../../../services/util.service';

@Component({
    selector: 'app-tipotarjeta',
    templateUrl: './tipotarjeta.component.html',
    styleUrls: ['./tipotarjeta.component.css']
})
export class TipoTarjetaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<TipoTarjeta>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    tipotarjetas: TipoTarjeta[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;
    constructor(
        private tipotarjetaService: TipoTarjetaService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarTipoTarjetas();
    }

    cargarTipoTarjetas() {
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
        this.tipotarjetaService.getTipoTarjetas(this.all).subscribe(
            (data) => {
                console.log(data);
                this.tipotarjetas = data;

                this.dataSource = new MatTableDataSource<TipoTarjeta>(
                    this.tipotarjetas
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

        const item = new TipoTarjeta();

        this.editItem(item);

    }

    editItem(item: TipoTarjeta): void {
        const dialogRef = this.dialog.open(TipoTarjetaDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarTipoTarjetas();
            }
        });
    }

    deleteItem(id: number): void {
        this.tipotarjetaService.eliminarTipoTarjeta(id).subscribe(
            result => {
                console.log(result);
                this.cargarTipoTarjetas();

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

    reactivateItem(tipotarjeta: TipoTarjeta): void {
        tipotarjeta.estado = 'ACTIVO';
        this.tipotarjetaService.editarTipoTarjeta(tipotarjeta).subscribe(
            result => {
                console.log(result);
                this.cargarTipoTarjetas();
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

    delete(event: any, tipotarjeta: TipoTarjeta): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Tipo de Tarjeta',
                msg: '¿Está seguro que desea eliminar este tipo tarjeta?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(tipotarjeta.id);
            }
        });
    }

    reactivate(event: any, tipotarjeta: TipoTarjeta): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Tipo de Tarjeta',
                msg: '¿Está seguro que desea reactivar este tipo de tarjeta?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(tipotarjeta);
            }
        });
    }
}
