import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TipoNotaService } from '../../../../services/tiponota.service';
import { TipoNota } from '../../../../models/tipoNota';
import { MatDialog } from '@angular/material/dialog';
import { TipoNotaDialogComponent } from './tipo-nota-dialog/tipo-nota-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';
import {UtilService} from '../../../../services/util.service';


@Component({
    selector: 'app-tipo-nota',
    templateUrl: './tipo-nota.component.html',
    styleUrls: ['./tipo-nota.component.css']
})
export class TipoNotaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<TipoNota>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    tiponotas: TipoNota[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;
    constructor(
        private tipoNotaService: TipoNotaService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarTipoNotas();
    }

    cargarTipoNotas() {
        this.util.startLoading();
        this.tipoNotaService.getTipoNotas(this.all).subscribe(
            (data) => {
                console.log(data);
                this.tiponotas = data;

                this.dataSource = new MatTableDataSource<TipoNota>(
                    this.tiponotas
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

    addItem(): void {
        const item = new TipoNota();
        this.editItem(item);
    }

    editItem(item: TipoNota): void {
        const dialogRef = this.dialog.open(TipoNotaDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarTipoNotas();
            }
        });
    }

    deleteItem(id: number): void {
        this.tipoNotaService.eliminarTipoNota(id).subscribe(
            result => {
                console.log(result);
                this.cargarTipoNotas();

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

    reactivateItem(tiponota: TipoNota): void {
        tiponota.estado = 'ACTIVO';
        this.tipoNotaService.editarTipoNota(tiponota).subscribe(
            result => {
                console.log(result);
                this.cargarTipoNotas();
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

    delete(event: any, tiponota: TipoNota): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar este Tipo de Nota',
                msg: '¿Está seguro que desea eliminar este Tipo de Nota?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(tiponota.id);
            }
        });
    }

    reactivate(event: any, tiponota: TipoNota): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar tipo de nota',
                msg: '¿Está seguro que desea reactivar este tipo de nota?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(tiponota);
            }
        });
    }
}
