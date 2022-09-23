import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Articulo } from '../../../../models/articulo';
import { MatDialog } from '@angular/material/dialog';
import { ArticuloDialogComponent } from './articulo-dialog/articulo-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';
import {ArticuloService} from '../../../../services/articulo.service';
import {UtilService} from '../../../../services/util.service';

@Component({
    selector: 'app-articulo',
    templateUrl: './articulo.component.html',
    styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'precioCompra', 'precioVenta', 'codigoGenerico', 'marca', 'tipoArticulo', 'impuesto', 'actions'];

    dataSource = new MatTableDataSource<Articulo>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    articulos: Articulo[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private articuloService: ArticuloService,
        private dialog: MatDialog,
        private uiService: UIService,
        private utils: UtilService
    ) { }

    ngOnInit(): void {
        this.cargarArticulos();
    }

    cargarArticulos() {
        this.utils.startLoading();
        this.articuloService.getArticulos().subscribe(
            (data) => {
                console.log(data);
                this.articulos = data;
                this.dataSource = new MatTableDataSource<Articulo>(
                    this.articulos
                );
                this.dataSource.paginator = this.paginator;
                this.utils.stopLoading();
            },
            err => {
                console.log(err.error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    addItem(): void {

        const item = new Articulo();

        this.editItem(item);

    }

    editItem(item: Articulo): void {
        const dialogRef = this.dialog.open(ArticuloDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarArticulos();
            }
        });
    }

    deleteItem(id: number): void {
        this.utils.startLoading();
        this.articuloService.eliminarArticulo(id).subscribe(
            result => {
                console.log(result);
                this.cargarArticulos();
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Eliminado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    openDialog(event: any, articulo: Articulo): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Articulo',
                msg: '¿Está seguro que desea eliminar esta articulo?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(articulo.id);
            }
        });
    }
}
