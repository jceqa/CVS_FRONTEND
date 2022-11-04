import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Permiso} from '../../../../models/permiso';
import {MatPaginator} from '@angular/material/paginator';
import {PermisoService} from '../../../../services/permiso.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {PermisoDialogComponent} from '../permiso/permiso-dialog/permiso-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.scss']
})
export class PermisoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'rol', 'formulario', 'actions'];

    dataSource = new MatTableDataSource<Permiso>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    permisos: Permiso[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private permisoService: PermisoService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarPermisos();
    }

    cargarPermisos() {
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
        this.permisoService.getPermisos(this.all).subscribe(
            (data) => {
                console.log(data);
                this.permisos = data;

                this.dataSource = new MatTableDataSource<Permiso>(
                    this.permisos
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

        const item = new Permiso();

        this.editItem(item);

    }

    editItem(item: Permiso): void {
        const dialogRef = this.dialog.open(PermisoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarPermisos();
            }
        });
    }

    deleteItem(id: number): void {
        this.permisoService.eliminarPermiso(id).subscribe(
            result => {
                console.log(result);
                this.cargarPermisos();

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

    reactivateItem(permiso: Permiso): void {
        permiso.estado = 'ACTIVO';
        this.permisoService.editarPermiso(permiso).subscribe(
            result => {
                console.log(result);
                this.cargarPermisos();
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

    delete(event: any, permiso: Permiso): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Permiso',
                msg: '¿Está seguro que desea eliminar este permiso?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(permiso.id);
            }
        });
    }

    reactivate(event: any, permiso: Permiso): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Permiso',
                msg: '¿Está seguro que desea reactivar este permiso?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(permiso);
            }
        });
    }

}
