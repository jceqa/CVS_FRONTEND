import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Caja} from '../../../../models/caja';
import {MatPaginator} from '@angular/material/paginator';
import {CajaService} from '../../../../services/caja.service';
import {MatDialog} from '@angular/material/dialog';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import {CajaDialogComponent} from '../../../ventas/referenciales/caja/caja-dialog/caja-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.sass']
})
export class CajaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'numero', 'sucursal', 'actions'];

    dataSource = new MatTableDataSource<Caja>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    cajas: Caja[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;

    constructor(
        private cajaService: CajaService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarCajas();
    }

    cargarCajas() {
        // this.store.dispatch(new UI.StartLoading());
        // this.util.localStorageSetItem('loading', 'true');
        this.util.startLoading();
        this.cajaService.getCajas(this.all).subscribe(
            (data) => {
                console.log(data);
                this.cajas = data;

                this.dataSource = new MatTableDataSource<Caja>(
                    this.cajas
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

        const item = new Caja();

        this.editItem(item);

    }

    editItem(item: Caja): void {
        const dialogRef = this.dialog.open(CajaDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarCajas();
            }
        });
    }

    deleteItem(id: number): void {
        this.cajaService.eliminarCaja(id).subscribe(
            result => {
                console.log(result);
                this.cargarCajas();

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

    reactivateItem(caja: Caja): void {
        caja.estado = 'ACTIVO';
        this.cajaService.editarCaja(caja).subscribe(
            result => {
                console.log(result);
                this.cargarCajas();
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

    delete(event: any, caja: Caja): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Caja',
                msg: '¿Está seguro que desea eliminar esta caja?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(caja.id);
            }
        });
    }

    reactivate(event: any, caja: Caja): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Caja',
                msg: '¿Está seguro que desea reactivar esta caja?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(caja);
            }
        });
    }

}
