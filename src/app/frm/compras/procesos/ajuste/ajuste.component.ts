import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Ajuste} from '../../../../models/ajuste';
import {MatPaginator} from '@angular/material/paginator';
import {AjusteService} from '../../../../services/ajuste.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {AjusteDialogComponent} from './ajuste-dialog/ajuste-dialog.component';
@Component({
  selector: 'app-ajuste',
  templateUrl: './ajuste.component.html',
  styleUrls: ['./ajuste.component.scss']
})
export class AjusteComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'estado', 'fecha', 'articulo', 'actions'];

    dataSource = new MatTableDataSource<Ajuste>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    ajustes: Ajuste[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private ajusteService: AjusteService,
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
        this.ajusteService.getAjustes(this.all).subscribe(
            (data) => {
                console.log(data);
                this.ajustes = data;

                this.dataSource = new MatTableDataSource<Ajuste>(
                    this.ajustes
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

        const item = new Ajuste();

        this.openDialog(item);

    }

    edit(item: Ajuste): void {
        const dialogRef = this.dialog.open(AjusteDialogComponent, {
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
        this.ajusteService.eliminarAjuste(id).subscribe(
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

    reactivateItem(ajuste: Ajuste): void {
        ajuste.estado = 'ACTIVO';
        this.ajusteService.editarAjuste(ajuste).subscribe(
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

    delete(event: any, ajuste: Ajuste): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Ajuste',
                msg: '¿Está seguro que desea eliminar este ajuste?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(ajuste.id);
            }
        });
    }

    reactivate(event: any, ajuste: Ajuste): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Ajuste',
                msg: '¿Está seguro que desea reactivar este ajuste?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(ajuste);
            }
        });
    }

    openDialog(item: Ajuste): void {
        const dialogRef = this.dialog.open(AjusteDialogComponent, {
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

    anular(dato: Ajuste): void {
        this.util.startLoading();
        this.ajusteService.anularAjuste(dato).subscribe(
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

    anularDialog(event: any, ajuste: Ajuste): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Anular Ajuste',
                msg: '¿Está seguro que desea anular este Ajuste?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.anular(ajuste);
            }
        });
    }

    procesar(dato: Ajuste): void {
        this.util.startLoading();
        this.ajusteService.processAjuste(dato).subscribe(
            result => {
                console.log(result);
                this.cargar();
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    'Procesado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);
                this.util.stopLoading();
                this.uiService.showSnackbar(
                    error.error ? error.error : 'Ha ocurrido un error',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    procesarDialog(event: any, ajuste: Ajuste): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Procesar Ajuste',
                msg: '¿Está seguro que desea procesar este Ajuste?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.procesar(ajuste);
            }
        });
    }
}
