import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Rol} from '../../../../models/rol';
import {MatPaginator} from '@angular/material/paginator';
import {RolService} from '../../../../services/rol.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {RolDialogComponent} from './rol-dialog/rol-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss']
})
export class RolComponent implements OnInit {

    displayedColumns: string[] = ['id', 'nombre', 'actions'];

    dataSource = new MatTableDataSource<Rol>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    rol: Rol[] = [];

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
                this.rol = data;

                this.dataSource = new MatTableDataSource<Rol>(
                    this.rol
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

        const item = new Rol();

        this.editItem(item);

    }

    editItem(item: Rol): void {
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

    reactivateItem(rol: Rol): void {
        rol.estado = 'ACTIVO';
        this.rolService.editarRol(rol).subscribe(
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

    delete(event: any, rol: Rol): void {
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
                this.deleteItem(rol.id);
            }
        });
    }

    reactivate(event: any, rol: Rol): void {
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
                this.reactivateItem(rol);
            }
        });
    }

}
