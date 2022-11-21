import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TipoArticuloService } from '../../../../services/tipoarticulo.service';
import { TipoArticulo } from '../../../../models/tipoArticulo';
import { MatDialog } from '@angular/material/dialog';
import { TipoArticuloDialogComponent } from './tipo-articulo-dialog/tipo-articulo-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';
import {UtilService} from '../../../../services/util.service';


@Component({
    selector: 'app-tipo-articulo.component.ts',
    templateUrl: './tipo-articulo.component.html',
    styleUrls: ['./tipo-articulo.component.css']
})
export class TipoArticuloComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<TipoArticulo>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    tipoarticulos: TipoArticulo[] = [];

    pagina = 1;
    numeroResultados = 5;
    all = false;

    constructor(
        private tipoarticuloService: TipoArticuloService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarTipoArticulos();
    }

    cargarTipoArticulos() {
        this.tipoarticuloService.getTipoArticulos(this.all).subscribe(
            (data) => {
                console.log(data);
                this.tipoarticulos = data;

                this.dataSource = new MatTableDataSource<TipoArticulo>(
                    this.tipoarticulos
                );
                this.dataSource.paginator = this.paginator;
            },
            err => {
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

        const item = new TipoArticulo();

        this.editItem(item);

    }

    editItem(item: TipoArticulo): void {
        const dialogRef = this.dialog.open(TipoArticuloDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarTipoArticulos();
            }
        });
    }

    deleteItem(id: number): void {
        this.tipoarticuloService.eliminarTipoArticulo(id).subscribe(
            result => {
                console.log(result);
                this.cargarTipoArticulos();

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

    reactivateItem(tipoArticulo: TipoArticulo): void {
        tipoArticulo.estado = 'ACTIVO';
        this.tipoarticuloService.editarTipoArticulo(tipoArticulo).subscribe(
            result => {
                console.log(result);
                this.cargarTipoArticulos();
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

    delete(event: any, tipoArticulo: TipoArticulo): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Tipo de Articulo',
                msg: '¿Está seguro que desea eliminar este Tipo de Articulo?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(tipoArticulo.id);
            }
        });
    }

    reactivate(event: any, tipoArticulo: TipoArticulo): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Tipo de Articulo',
                msg: '¿Está seguro que desea reactivar este Tipo de Articulo?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(tipoArticulo);
            }
        });
    }
}
