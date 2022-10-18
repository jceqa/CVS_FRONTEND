import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Sucursal } from '../../../../models/sucursal';
import { MatDialog } from '@angular/material/dialog';
import { SucursalDialogComponent } from './sucursal-dialog/sucursal-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';
import {SucursalService} from '../../../../services/sucursal.service';
import {UtilService} from '../../../../services/util.service';

@Component({
    selector: 'app-sucursal',
    templateUrl: './sucursal.component.html',
    styleUrls: ['./sucursal.component.css']
})
export class SucursalComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion',  'ciudad', 'actions'];

    dataSource = new MatTableDataSource<Sucursal>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    sucursales: Sucursal[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;
    constructor(
        private sucursalService: SucursalService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarSucursales();
    }

    cargarSucursales() {
        this.util.startLoading();
        this.sucursalService.getSucursales(this.all).subscribe(
            (data) => {
                console.log(data);
                this.sucursales = data;

                this.dataSource = new MatTableDataSource<Sucursal>(
                    this.sucursales
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

        const item = new Sucursal();

        this.editItem(item);

    }

    editItem(item: Sucursal): void {
        const dialogRef = this.dialog.open(SucursalDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarSucursales();
            }
        });
    }

    deleteItem(id: number): void {
        this.sucursalService.eliminarSucursal(id).subscribe(
            result => {
                console.log(result);
                this.cargarSucursales();

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

    reactivateItem(sucursal: Sucursal): void {
        sucursal.estado = 'ACTIVO';
        this.sucursalService.editarSucursal(sucursal).subscribe(
            result => {
                console.log(result);
                this.cargarSucursales();
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

    delete(event: any, sucursal: Sucursal): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Sucursal',
                msg: '¿Está seguro que desea eliminar esta sucursal?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(sucursal.id);
            }
        });
    }

    reactivate(event: any, sucursal: Sucursal): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Sucursal',
                msg: '¿Está seguro que desea reactivar esta sucursal?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(sucursal);
            }
        });
    }
}
