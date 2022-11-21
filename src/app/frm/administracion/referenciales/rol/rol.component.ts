import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RolService} from '../../../../services/rol.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {RolDialogComponent} from './rol-dialog/rol-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {RolPermiso} from '../../../../models/rolPermiso';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss']
})
export class RolComponent implements OnInit {

    displayedColumns: string[] = ['id', 'nombre', 'actions'];

    dataSource = new MatTableDataSource<RolPermiso>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    rolPermisosList: RolPermiso[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private rolService: RolService,
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
        this.rolService.getRoles(this.all).subscribe(
            (data) => {
                console.log(data);
                this.rolPermisosList = data;
                this.dataSource = new MatTableDataSource<RolPermiso>(
                    this.rolPermisosList
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

        const item = new RolPermiso();

        this.editItem(item);

    }

    editItem(item: RolPermiso): void {
        const dialogRef = this.dialog.open(RolDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargar();
            }
        });
    }

    deleteItem(id: number): void {
        this.rolService.eliminarRol(id).subscribe(
            result => {
                console.log(result);
                this.cargar();

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

    reactivateItem(rolPermiso: RolPermiso): void {
        rolPermiso.rol.estado = 'ACTIVO';
        this.rolService.editarRol(rolPermiso).subscribe(
            result => {
                console.log(result);
                this.cargar();
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

    delete(event: any, rolPermiso: RolPermiso): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Rol',
                msg: '¿Está seguro que desea eliminar este rol?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(rolPermiso.rol.id);
            }
        });
    }

    reactivate(event: any, rolPermiso: RolPermiso): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Rol',
                msg: '¿Está seguro que desea reactivar este rol?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(rolPermiso);
            }
        });
    }

}
