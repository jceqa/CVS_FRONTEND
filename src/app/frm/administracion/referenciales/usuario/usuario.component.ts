import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Usuario} from '../../../../models/usuario';
import {MatPaginator} from '@angular/material/paginator';
import {UsuarioService} from '../../../../services/usuario.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {UsuarioDialogComponent} from '../usuario/usuario-dialog/usuario-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

    displayedColumns: string[] = ['id', 'nombre', 'actions'];

    dataSource = new MatTableDataSource<Usuario>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    usuariosList: Usuario[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private usuarioService: UsuarioService,
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
        this.usuarioService.getUsuarios(this.all).subscribe(
            (data) => {
                console.log(data);
                this.usuariosList = data;
                this.dataSource = new MatTableDataSource<Usuario>(
                    this.usuariosList
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

        const item = new Usuario();

        this.editItem(item);

    }

    editItem(item: Usuario): void {
        const dialogRef = this.dialog.open(UsuarioDialogComponent, {
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
        this.usuarioService.eliminarUsuario(id).subscribe(
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

    reactivateItem(usuario: Usuario): void {
        usuario.estado = 'ACTIVO';
        this.usuarioService.editarUsuario(usuario).subscribe(
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

    delete(event: any, usuario: Usuario): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Usuario',
                msg: '¿Está seguro que desea eliminar este usuario?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(usuario.id);
            }
        });
    }

    reactivate(event: any, usuario: Usuario): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Usuario',
                msg: '¿Está seguro que desea reactivar este usuario?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(usuario);
            }
        });
    }

}
