import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {EntidadEmisoraService} from '../../../../services/entidademisora.service';
import {EntidadEmisora} from '../../../../models/entidadEmisora';
import {MatDialog} from '@angular/material/dialog';
import {EntidadEmisoraDialogComponent} from './entidademisora-dialog/entidademisora-dialog.component';
import {UIService} from '../../../../services/ui.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {UtilService} from '../../../../services/util.service';


@Component({
    selector: 'app-entidad-emisora',
    templateUrl: './entidad-emisora.component.html',
    styleUrls: ['./entidad-emisora.component.css']
})
export class EntidadEmisoraComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<EntidadEmisora>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    entidademisoras: EntidadEmisora[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private entidademisoraService: EntidadEmisoraService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) {
    }

    ngOnInit(): void {
        this.cargarEntidadEmisoras();
    }

    cargarEntidadEmisoras() {
        this.util.startLoading();
        this.entidademisoraService.getEntidadEmisoras(this.all).subscribe(
            (data) => {
                console.log(data);
                this.entidademisoras = data;

                this.dataSource = new MatTableDataSource<EntidadEmisora>(
                    this.entidademisoras
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

        const item = new EntidadEmisora();

        this.editItem(item);

    }

    editItem(item: EntidadEmisora): void {
        const dialogRef = this.dialog.open(EntidadEmisoraDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarEntidadEmisoras();
            }
        });
    }

    deleteItem(id: number): void {
        this.entidademisoraService.eliminarEntidadEmisora(id).subscribe(
            result => {
                console.log(result);
                this.cargarEntidadEmisoras();

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

    reactivateItem(entidademisora: EntidadEmisora): void {
        entidademisora.estado = 'ACTIVO';
        this.entidademisoraService.editarEntidadEmisora(entidademisora).subscribe(
            result => {
                console.log(result);
                this.cargarEntidadEmisoras();
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

    delete(event: any, entidademisora: EntidadEmisora): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar esta Entidad',
                msg: '¿Está seguro que desea eliminar esta entidad?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(entidademisora.id);
            }
        });
    }

    reactivate(event: any, entidademisora: EntidadEmisora): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Entidad',
                msg: '¿Está seguro que desea reactivar esta entidad?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(entidademisora);
            }
        });
    }
}
