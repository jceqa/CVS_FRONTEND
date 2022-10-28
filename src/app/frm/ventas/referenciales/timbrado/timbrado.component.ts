import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Timbrado} from '../../../../models/timbrado';
import {MatPaginator} from '@angular/material/paginator';
import {TimbradoService} from '../../../../services/timbrado.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {TimbradoDialogComponent} from './timbrado-dialog/timbrado-dialog.component';

@Component({
  selector: 'app-timbrado',
  templateUrl: './timbrado.component.html',
  styleUrls: ['./timbrado.component.scss']
})
export class TimbradoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'numero', 'inicioVigencia', 'finVigencia', 'actions'];

    dataSource = new MatTableDataSource<Timbrado>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    timbrados: Timbrado[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private timbradoService: TimbradoService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarTimbrados();
    }

    cargarTimbrados() {
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
        this.timbradoService.getTimbrados(this.all).subscribe(
            (data) => {
                console.log(data);
                this.timbrados = data;

                this.dataSource = new MatTableDataSource<Timbrado>(
                    this.timbrados
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

        const item = new Timbrado();

        this.editItem(item);

    }

    editItem(item: Timbrado): void {
        const dialogRef = this.dialog.open(TimbradoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarTimbrados();
            }
        });
    }

    deleteItem(id: number): void {
        this.timbradoService.eliminarTimbrado(id).subscribe(
            result => {
                console.log(result);
                this.cargarTimbrados();

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

    reactivateItem(timbrado: Timbrado): void {
        timbrado.estado = 'ACTIVO';
        this.timbradoService.editarTimbrado(timbrado).subscribe(
            result => {
                console.log(result);
                this.cargarTimbrados();
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

    delete(event: any, timbrado: Timbrado): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Timbrado',
                msg: '¿Está seguro que desea eliminar este timbrado?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(timbrado.id);
            }
        });
    }

    reactivate(event: any, timbrado: Timbrado): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Timbrado',
                msg: '¿Está seguro que desea reactivar este timbrado?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(timbrado);
            }
        });
    }

}
