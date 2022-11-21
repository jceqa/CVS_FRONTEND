import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Formulario} from '../../../../models/formulario';
import {MatPaginator} from '@angular/material/paginator';
import {FormularioService} from '../../../../services/formulario.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {FormularioDialogComponent} from './formulario-dialog/formulario-dialog.component';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {

    displayedColumns: string[] = ['nombre', 'url', 'sistema', 'submenu', 'actions'];

    dataSource = new MatTableDataSource<Formulario>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    formularios: Formulario[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private formularioService: FormularioService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarFormularios();
    }

    cargarFormularios() {
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
        this.formularioService.getFormularios(this.all).subscribe(
            (data) => {
                console.log(data);
                this.formularios = data;

                this.dataSource = new MatTableDataSource<Formulario>(
                    this.formularios
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

        const item = new Formulario();

        this.editItem(item);

    }

    editItem(item: Formulario): void {
        const dialogRef = this.dialog.open(FormularioDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarFormularios();
            }
        });
    }

    deleteItem(id: number): void {
        this.formularioService.eliminarFormulario(id).subscribe(
            result => {
                console.log(result);
                this.cargarFormularios();

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

    reactivateItem(formulario: Formulario): void {
        formulario.estado = 'ACTIVO';
        this.formularioService.editarFormulario(formulario).subscribe(
            result => {
                console.log(result);
                this.cargarFormularios();
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

    delete(event: any, formulario: Formulario): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Formulario',
                msg: '¿Está seguro que desea eliminar este formulario?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(formulario.id);
            }
        });
    }

    reactivate(event: any, formulario: Formulario): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Formulario',
                msg: '¿Está seguro que desea reactivar este formulario?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(formulario);
            }
        });
    }
}
