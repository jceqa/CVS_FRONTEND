import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {CiudadService} from '../../../../services/ciudad.service';
import {Ciudad} from '../../../../models/ciudad';
import {MatDialog} from '@angular/material/dialog';
import {CiudadDialogComponent} from './ciudad-dialog/ciudad-dialog.component';
import {UIService} from '../../../../services/ui.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-ciudad',
    templateUrl: './ciudad.component.html',
    styleUrls: ['./ciudad.component.css']
})
export class CiudadComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<Ciudad>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    ciudades: Ciudad[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private ciudadService: CiudadService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) {
    }

    ngOnInit(): void {
        this.cargarCiudades();
    }

    cargarCiudades() {
        this.ciudadService.getCiudades().subscribe(
            (data) => {
                console.log(data);
                this.ciudades = data;

                this.dataSource = new MatTableDataSource<Ciudad>(
                    this.ciudades
                );
                this.dataSource.paginator = this.paginator;
            },
            err => {
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

        const item = new Ciudad();

        this.editItem(item);

    }

    editItem(item: Ciudad): void {
        const dialogRef = this.dialog.open(CiudadDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarCiudades();
            }
        });
    }

    deleteItem(id: number): void {
        this.ciudadService.eliminarCiudad(id).subscribe(
            result => {
                console.log(result);
                this.cargarCiudades();

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

    openDialog(event: any, ciudad: Ciudad): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            //width: '50vw',
            data: {
                title: 'Eliminar Ciudad',
                msg: '¿Está seguro que desea eliminar esta ciudad?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(ciudad.id);
            }
        });
    }
}
